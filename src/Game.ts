/*
    DiepCustom - custom tank game server that shares diep.io's WebSocket protocol
    Copyright (C) 2022 ABCxFF (github.com/ABCxFF)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <https://www.gnu.org/licenses/>
*/

import * as config from "./config";
import * as util from "./util";
import { Server } from "ws";

import Writer from "./Coder/Writer";
import EntityManager from "./Native/Manager";
import Client from "./Client";

import ArenaEntity, { ArenaState } from "./Native/Arena";
import FFAArena from "./Gamemodes/FFA";
import Teams2Arena from "./Gamemodes/Team2";
import SandboxArena from "./Gamemodes/Sandbox";

import { ClientBound, Stat, StatCount, Tank } from "./Const/Enums";
import { IncomingMessage } from "http";
import WebSocket = require("ws");
import Teams4Arena from "./Gamemodes/Team4";
import DominationArena from "./Gamemodes/Domination";
import MothershipArena from "./Gamemodes/Mothership";
import TestingArena from "./Gamemodes/Misc/Testing";
import SpikeboxArena from "./Gamemodes/Misc/Spikebox";
import DominationTestingArena from "./Gamemodes/Misc/DomTest";
import JungleArena from "./Gamemodes/Misc/Jungle";
import FactoryTestArena from "./Gamemodes/Misc/FactoryTest";
import BallArena from "./Gamemodes/Misc/Ball";
import MazeArena from "./Gamemodes/Maze";
import Scenexe from "./Gamemodes/Scenexe";
import TankBody from "./Entity/Tank/TankBody";
import ClientCamera from "./Native/Camera";
import { Entity } from "./Native/Entity";
import { type } from "os";
import { gamer } from ".";
import Sanctuary from "./Gamemodes/Sanctuary";
import Crossroads from "./Gamemodes/Crossroads";
import { CameraTable } from "./Native/FieldGroups";

/**
 * WriterStream that broadcasts to all of the game's WebSockets.
 */
class WSSWriterStream extends Writer {
    private game: GameServer;
    public constructor(game: GameServer) {
        super();
        this.game = game;

    }

    public send() {
        const bytes = this.write();

        for (let client of this.game.clients) {
            client.ws.send(bytes);
        }
    }
}

export type DiepGamemodeID = "ffa" | "scenexe" | "sanctuary" | "crossroads" | "sandbox" | "teams" | "4teams" | "mot" | "dom" | "maze" | "tag" | "survival" | "testing" | "spike" | "domtest" | "jungle" | "factest" | "ball";

const GamemodeToArenaClass: Record<DiepGamemodeID, (typeof ArenaEntity) | null> & { "*": typeof ArenaEntity }= {
    "ffa": FFAArena,
    "teams": Teams2Arena,
    "4teams": Teams4Arena,
    "sandbox": SandboxArena,
    "scenexe": Scenexe,
    "*": SandboxArena,
    "dom": DominationArena,
    "survival": null,
    "tag": null,
    "mot": MothershipArena,
    "maze": MazeArena,
    "testing": TestingArena,
    "spike": SpikeboxArena,
    "domtest": DominationTestingArena,
    "jungle": JungleArena,
    "factest": FactoryTestArena,
    "ball": BallArena,
    "sanctuary" : Sanctuary,
    "crossroads": Crossroads
}


/**
 * Used for determining which endpoints go to the default.
 */
const HOSTED_ENDPOINTS: string[] = [];

    export default class GameServer {
    /**
     * Stores total player count.
     */
    public static globalPlayerCount = 0;

    /** Whether or not the game server is running. */
    public running = true;
    /** The gamemode the game is running. */
    public gamemode: DiepGamemodeID;
    /** The arena's display name */
    public name: string;

    /** Whether or not to put players on the map. */
    public playersOnMap: boolean = false;

    /** Inner WebSocket Server. */
    private wss: Server;


    /** Info on limits
     * The server caps players per IP to 4
     * The server caps players per discord account to 2
     */

    /** Contains count of each ip. */
    public ipCache: Record<string, number> = {}
    /** Contains count of each discord acc. */
    public discordCache: Record<string, number> = {}

    /** All clients connected. */
    public clients: Set<Client>;
    /** Entity manager of the game. */
    public entities: EntityManager;
    /** The current game tick. */
    public tick: number;
    /** The game's arena entity. */
    public arena: ArenaEntity;

    /** All listeners the function opened */
    private _listeners: Record<string, ((ws: WebSocket, req: IncomingMessage) => void)[]> = {};

    /** The interval timer of the tick loop. */
    private _tickInterval: NodeJS.Timeout;
        public pentalord: boolean;

    public constructor(wss: Server, gamemode: DiepGamemodeID, name: string | "*") {
        this.gamemode = gamemode;
        this.name = name;
        this.pentalord = false

        this.wss = wss;
        this.listen();
        this.clients = new Set();
        // Keeps player count updating per addition
        const _add = this.clients.add;
        this.clients.add = (client: Client) => {
            GameServer.globalPlayerCount += 1;
            this.broadcastPlayerCount();
            
            return _add.call(this.clients, client);
        }
        const _delete = this.clients.delete;
        this.clients.delete = (client: Client) => {
            let success = _delete.call(this.clients, client);
            if (success) {
                GameServer.globalPlayerCount -= 1;
                this.broadcastPlayerCount();
            }

            return success;
        }
        const _clear = this.clients.clear;
        this.clients.clear = () => {
            GameServer.globalPlayerCount -= this.clients.size;
            this.broadcastPlayerCount();
            
            return _clear.call(this.clients);
        }

        this.entities = new EntityManager(this);
        this.tick = 0;

        this.arena = new (GamemodeToArenaClass[this.gamemode] || GamemodeToArenaClass["*"])(this);

        this._tickInterval = setInterval(() => {
            if (this.clients.size) this.tickLoop();
        }, config.mspt);
    }

    /** Sets up listeners */
    private listen() {
        HOSTED_ENDPOINTS.push(this.gamemode);

        this._listeners["connection"] = [];
        const onConnect = this._listeners.connection[0] = (ws: WebSocket, request: IncomingMessage) => {
            // shouldHandle takes care of this for us
            const endpoint: DiepGamemodeID = (request.url || "").slice((request.url || "").indexOf("-") + 1) as DiepGamemodeID;
        
            if (!(!HOSTED_ENDPOINTS.includes(endpoint)) && this.gamemode !== endpoint) return;

            util.log("Incoming client");
            if (this.arena.state !== ArenaState.OPEN) {
                util.log("Arena is not open: Closing client");
                return  ws.terminate();
            }

            const ipPossible = request.headers['x-forwarded-for'] || request.socket.remoteAddress || "";
            const ipList = Array.isArray(ipPossible) ? ipPossible : ipPossible.split(',').map(c => c.trim());
            const ip = ipList[ipList.length - 1] || ""
            
            if ((ip !== ipList[0] || !ip) && config.mode !== "development") return request.destroy(new Error("Client ips dont match."));
            
            if (!this.ipCache[ip]) this.ipCache[ip] = 1;
            // When the player is banned, ipCache[ip] is boosted to infinity
            else if (this.ipCache[ip] === Infinity) return request.destroy();
            else {
                this.ipCache[ip] += 1;

                if (config.connectionsPerIp !== -1 && this.ipCache[ip] > config.connectionsPerIp) {
                    this.ipCache[ip] -= 1;
                    return request.destroy();
                }
            }

            // The rest of the parsing is taken care of in index.ts, so we can be sure there is a proper url here
            this.clients.add(new Client(this, ws, ip));
        }

        this.wss.on("connection", onConnect);

        util.saveToLog("Game Deploying", "Game now deploying gamemode `" + this.gamemode + "` at endpoint `" + this.gamemode + "`.", 0x1FE0C4);
    }

    /** Returns a WebSocketServer Writer Broadcast Stream. */
    public broadcast() {
        return new WSSWriterStream(this);
    }
    /** Broadcasts a player count packet. */
    public broadcastPlayerCount() {
        this.broadcast().vu(ClientBound.PlayerCount).vu(GameServer.globalPlayerCount).send();
    }

    /** Ends the game instance. */
    public end() {
        util.saveToLog("Game Instance Ending", "Game running " + this.gamemode + " at `" + this.gamemode + "` is now closing.", 0xEE4132);
        util.log("Ending Game instance");
        
        util.removeFast(HOSTED_ENDPOINTS, HOSTED_ENDPOINTS.indexOf(this.gamemode));

        clearInterval(this._tickInterval);

        for (const event in this._listeners) for (const listener of this._listeners[event]) this.wss.off(event, listener);

        for (const client of this.clients) {
            client.terminate()
        }

        this.tick = 0;
        this.clients.clear();
        this.entities.clear();

        this.ipCache = {};

        this.running = false;
        this.onEnd();
    }

    /** Can be overwritten to call things when the game is over */
    public onEnd() {
        util.log("Game instance is now over");

        this.start();
    }

    /** Reinitializes a game instance */
    public start() {
        if (this.running) return;

        util.log("New game instance booting up")

        this.listen();
        this.clients.clear();

        this.entities = new EntityManager(this);
        this.tick = 0;

        this.arena = new (GamemodeToArenaClass[this.gamemode] || GamemodeToArenaClass["*"])(this);

        this._tickInterval = setInterval(() => {
            if (this.clients.size) this.tickLoop();
        }, config.mspt);
    }

    /** Ticks the game. */
    private tickLoop() {
        
        this.tick += 1;
        this.entities.tick(this.tick);

        for (const client of this.clients) client.tick(this.tick);
    }

    public transferClient(client: Client) {
        const game = client.game;

        client.game = this;
        game.clients.delete(client);
        this.clients.add(client);

        client.write().u8(ClientBound.ServerInfo).stringNT(client.game.gamemode).stringNT("diepcustom-" + client.game.gamemode).send();
        client.write().u8(ClientBound.Accept).vi(client.accessLevel).send();

        if(Entity.exists(client.camera)) {
            const cam = new ClientCamera(this, client);
            cam.sizeFactor = client.camera.sizeFactor;
            cam.spectatee = null;

            cam.cameraData.values = { ...client.camera.cameraData.values };
            cam.cameraData.values.player = null;
            cam.cameraData.values.statNames = new CameraTable("", 9, cam.cameraData);
            cam.cameraData.values.statLevels = new CameraTable(0, 10, cam.cameraData);
            cam.cameraData.values.statLimits = new CameraTable(0, 11, cam.cameraData);

            for(let i = 0; i < StatCount; ++i) {
                cam.cameraData.statNames[i as Stat] = client.camera.cameraData.statNames[i as Stat];
                cam.cameraData.statLimits[i as Stat] = client.camera.cameraData.statLimits[i as Stat];
                cam.cameraData.statLevels[i as Stat] = client.camera.cameraData.statLevels[i as Stat];
            }

            if(Entity.exists(client.camera.cameraData.player)) {
                client.camera.cameraData.player.delete();
                let tank;
                if(client.camera.cameraData.player instanceof TankBody) {
                    tank = cam.cameraData.player = cam.relationsData.owner = cam.relationsData.parent = new TankBody(this, cam, client.inputs, client.camera.cameraData.player.currentTank);
                    tank.nameData.values.name = client.camera.cameraData.player.nameData.values.name;
                    const { x, y } = this.arena.findSpawnLocation();

                    tank.positionData.values.x = x;
                    tank.positionData.values.y = y;
                } else {
                    tank = cam.cameraData.player = cam.relationsData.owner = cam.relationsData.parent = new TankBody(this, cam, client.inputs);
                    tank.nameData.values.name = "";
                    const { x, y } = this.arena.findSpawnLocation();

                    tank.positionData.values.x = x;
                    tank.positionData.values.y = y;
                }
                tank.scoreData.values.score = cam.cameraData.values.score;
                tank.scoreReward = cam.cameraData.values.score;

                this.arena.spawnPlayer(tank, client);
            }

            client.camera.delete();
            client.camera = cam;
        }


        if(client.hasCheated()) client.setHasCheated(true);

        client.inputs.isPossessing = false;
        client.inputs.movement.magnitude = 0;
    }
}
