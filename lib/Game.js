"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("./config");
const util = require("./util");
const Writer_1 = require("./Coder/Writer");
const Manager_1 = require("./Native/Manager");
const Client_1 = require("./Client");
const Arena_1 = require("./Native/Arena");
const FFA_1 = require("./Gamemodes/FFA");
const Team2_1 = require("./Gamemodes/Team2");
const Sandbox_1 = require("./Gamemodes/Sandbox");
const Enums_1 = require("./Const/Enums");
const Team4_1 = require("./Gamemodes/Team4");
const Domination_1 = require("./Gamemodes/Domination");
const Mothership_1 = require("./Gamemodes/Mothership");
const Testing_1 = require("./Gamemodes/Misc/Testing");
const Spikebox_1 = require("./Gamemodes/Misc/Spikebox");
const DomTest_1 = require("./Gamemodes/Misc/DomTest");
const Jungle_1 = require("./Gamemodes/Misc/Jungle");
const FactoryTest_1 = require("./Gamemodes/Misc/FactoryTest");
const Ball_1 = require("./Gamemodes/Misc/Ball");
/**
 * WriterStream that broadcasts to all of the game's WebSockets.
 */
class WSSWriterStream extends Writer_1.default {
    constructor(game) {
        super();
        this.game = game;
    }
    send() {
        const bytes = this.write();
        for (let client of this.game.clients) {
            client.ws.send(bytes);
        }
    }
}
const GamemodeToArenaClass = {
    "ffa": FFA_1.default,
    "teams": Team2_1.default,
    "4teams": Team4_1.default,
    "sbx": Sandbox_1.default,
    "*": Sandbox_1.default,
    "dom": Domination_1.default,
    "survival": null,
    "tag": null,
    "mot": Mothership_1.default,
    "maze": null,
    "testing": Testing_1.default,
    "spike": Spikebox_1.default,
    "domtest": DomTest_1.default,
    "jungle": Jungle_1.default,
    "factest": FactoryTest_1.default,
    "ball": Ball_1.default
};
/**
 * Used for determining which endpoints go to the default.
 */
const HOSTED_ENDPOINTS = [];
class GameServer {
    constructor(wss, gamemode, name) {
        /** Whether or not the game server is running. */
        this.running = true;
        /** Whether or not to put players on the map. */
        this.playersOnMap = false;
        /** Info on limits
         * The server caps players per IP to 4
         * The server caps players per discord account to 2
         */
        /** Contains count of each ip. */
        this.ipCache = {};
        /** Contains count of each discord acc. */
        this.discordCache = {};
        /** All listeners the function opened */
        this._listeners = {};
        this.gamemode = gamemode;
        this.name = name;
        this.wss = wss;
        this.listen();
        this.clients = new Set();
        /** @ts-ignore */ // Keeps player count updating
        this.clients._add = this.clients.add;
        this.clients.add = (client) => {
            GameServer.globalPlayerCount += 1;
            this.broadcastPlayerCount();
            /** @ts-ignore */
            return this.clients._add(client);
        };
        /** @ts-ignore */ // Keeps player count updating
        this.clients._delete = this.clients.delete;
        this.clients.delete = (client) => {
            /** @ts-ignore */
            let success = this.clients._delete(client);
            if (success) {
                GameServer.globalPlayerCount -= 1;
                this.broadcastPlayerCount();
            }
            return success;
        };
        /** @ts-ignore */ // Keeps player count updating
        this.clients._clear = this.clients.clear;
        this.clients.clear = () => {
            GameServer.globalPlayerCount -= this.clients.size;
            this.broadcastPlayerCount();
            /** @ts-ignore */
            return this.clients._clear();
        };
        this.entities = new Manager_1.default(this);
        this.tick = 0;
        this.arena = new (GamemodeToArenaClass[this.gamemode] || GamemodeToArenaClass["*"])(this);
        this._tickInterval = setInterval(() => {
            if (this.clients.size)
                this.tickLoop();
        }, config.mspt);
    }
    /** Sets up listeners */
    listen() {
        HOSTED_ENDPOINTS.push(this.gamemode);
        this._listeners["connection"] = [];
        const onConnect = this._listeners.connection[0] = (ws, request) => {
            // shouldHandle takes care of this for us
            const endpoint = (request.url || "").slice((request.url || "").indexOf("-") + 1);
            if (!(!HOSTED_ENDPOINTS.includes(endpoint)) && this.gamemode !== endpoint)
                return;
            util.log("Incoming client");
            if (this.arena.arenaState !== Arena_1.ArenaState.OPEN)
                return util.log("Arena is not open: Ignoring client");
            const ipPossible = request.headers['x-forwarded-for'] || request.socket.remoteAddress || "";
            const ipList = Array.isArray(ipPossible) ? ipPossible : ipPossible.split(',').map(c => c.trim());
            const ip = ipList[ipList.length - 1] || "";
            if ((ip !== ipList[0] || !ip) && config.mode !== "development")
                return request.destroy(new Error("Client ips dont match."));
            if (!this.ipCache[ip])
                this.ipCache[ip] = 1;
            // When the player is banned, ipCache[ip] is boosted to infinity
            else if (this.ipCache[ip] === Infinity)
                return request.destroy();
            else {
                this.ipCache[ip] += 1;
                if (config.connectionsPerIp !== -1 && this.ipCache[ip] > config.connectionsPerIp) {
                    this.ipCache[ip] -= 1;
                    return request.destroy();
                }
            }
            // The rest of the parsing is taken care of in index.ts, so we can be sure there is a proper url here
            this.clients.add(new Client_1.default(this, ws, ip));
        };
        this.wss.on("connection", onConnect);
        util.saveToLog("Game Deploying", "Game now deploying gamemode `" + this.gamemode + "` at endpoint `" + this.gamemode + "`.", 0x1FE0C4);
    }
    /** Returns a WebSocketServer Writer Broadcast Stream. */
    broadcast() {
        return new WSSWriterStream(this);
    }
    /** Broadcasts a player count packet. */
    broadcastPlayerCount() {
        this.broadcast().vu(Enums_1.ClientBound.PlayerCount).vu(GameServer.globalPlayerCount).send();
    }
    /** Ends the game instance. */
    end() {
        util.saveToLog("Game Instance Ending", "Game running " + this.gamemode + " at `" + this.gamemode + "` is now closing.", 0xEE4132);
        util.log("Ending Game instance");
        util.removeFast(HOSTED_ENDPOINTS, HOSTED_ENDPOINTS.indexOf(this.gamemode));
        clearInterval(this._tickInterval);
        for (const event in this._listeners)
            for (const listener of this._listeners[event])
                this.wss.off(event, listener);
        for (const client of this.clients) {
            client.terminate();
        }
        this.tick = 0;
        this.clients.clear();
        this.entities.clear();
        this.ipCache = {};
        this.running = false;
        this.onEnd();
    }
    /** Can be overwritten to call things when the game is over */
    onEnd() {
        util.log("Game instance is now over");
        this.start();
    }
    /** Reinitializes a game instance */
    start() {
        if (this.running)
            return;
        util.log("New game instance booting up");
        this.listen();
        this.clients.clear();
        this.entities = new Manager_1.default(this);
        this.tick = 0;
        this.arena = new (GamemodeToArenaClass[this.gamemode] || GamemodeToArenaClass["*"])(this);
        this._tickInterval = setInterval(() => {
            if (this.clients.size)
                this.tickLoop();
        }, config.mspt);
    }
    /** Ticks the game. */
    tickLoop() {
        this.tick += 1;
        this.entities.tick(this.tick);
        for (const client of this.clients)
            client.tick(this.tick);
    }
}
exports.default = GameServer;
/**
 * Stores total player count.
 */
GameServer.globalPlayerCount = 0;
