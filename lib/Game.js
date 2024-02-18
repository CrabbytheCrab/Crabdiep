"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("./config");
const util = require("./util");
const Writer_1 = require("./Coder/Writer");
const Manager_1 = require("./Native/Manager");
const Client_1 = require("./Client");
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
const Maze_1 = require("./Gamemodes/Maze");
const Scenexe_1 = require("./Gamemodes/Scenexe");
const TankBody_1 = require("./Entity/Tank/TankBody");
const Camera_1 = require("./Native/Camera");
const Entity_1 = require("./Native/Entity");
const Sanctuary_1 = require("./Gamemodes/Sanctuary");
const Crossroads_1 = require("./Gamemodes/Crossroads");
const FieldGroups_1 = require("./Native/FieldGroups");
const BossBash_1 = require("./Gamemodes/BossBash");
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
    "sandbox": Sandbox_1.default,
    "scenexe": Scenexe_1.default,
    "*": Sandbox_1.default,
    "dom": Domination_1.default,
    "survival": null,
    "tag": null,
    "mot": Mothership_1.default,
    "maze": Maze_1.default,
    "testing": Testing_1.default,
    "spike": Spikebox_1.default,
    "domtest": DomTest_1.default,
    "jungle": Jungle_1.default,
    "factest": FactoryTest_1.default,
    "ball": Ball_1.default,
    "sanctuary": Sanctuary_1.default,
    "crossroads": Crossroads_1.default,
    "bossbash": BossBash_1.default
};
const HOSTED_ENDPOINTS = [];
class GameServer {
    constructor(wss, gamemode, name) {
        this.running = true;
        this.playersOnMap = false;
        this.ipCache = {};
        this.discordCache = {};
        this._listeners = {};
        this.gamemode = gamemode;
        this.name = name;
        this.pentalord = false;
        this.wss = wss;
        this.listen();
        this.clients = new Set();
        const _add = this.clients.add;
        this.clients.add = (client) => {
            GameServer.globalPlayerCount += 1;
            this.broadcastPlayerCount();
            return _add.call(this.clients, client);
        };
        const _delete = this.clients.delete;
        this.clients.delete = (client) => {
            let success = _delete.call(this.clients, client);
            if (success) {
                GameServer.globalPlayerCount -= 1;
                this.broadcastPlayerCount();
            }
            return success;
        };
        const _clear = this.clients.clear;
        this.clients.clear = () => {
            GameServer.globalPlayerCount -= this.clients.size;
            this.broadcastPlayerCount();
            return _clear.call(this.clients);
        };
        this.entities = new Manager_1.default(this);
        this.tick = 0;
        this.arena = new (GamemodeToArenaClass[this.gamemode] || GamemodeToArenaClass["*"])(this);
        this._tickInterval = setInterval(() => {
            if (this.clients.size)
                this.tickLoop();
        }, config.mspt);
    }
    listen() {
        HOSTED_ENDPOINTS.push(this.gamemode);
        this._listeners["connection"] = [];
        const onConnect = this._listeners.connection[0] = (ws, request) => {
            const endpoint = (request.url || "").slice((request.url || "").indexOf("-") + 1);
            if (!(!HOSTED_ENDPOINTS.includes(endpoint)) && this.gamemode !== endpoint)
                return;
            util.log("Incoming client");
            if (this.arena.state !== 0) {
                util.log("Arena is not open: Closing client");
                return ws.terminate();
            }
            const ipPossible = request.headers['x-forwarded-for'] || request.socket.remoteAddress || "";
            const ipList = Array.isArray(ipPossible) ? ipPossible : ipPossible.split(',').map(c => c.trim());
            const ip = ipList[ipList.length - 1] || "";
            if ((ip !== ipList[0] || !ip) && config.mode !== "development")
                return request.destroy(new Error("Client ips dont match."));
            if (!this.ipCache[ip])
                this.ipCache[ip] = 1;
            else if (this.ipCache[ip] === Infinity)
                return request.destroy();
            else {
                this.ipCache[ip] += 1;
                if (config.connectionsPerIp !== -1 && this.ipCache[ip] > config.connectionsPerIp) {
                    this.ipCache[ip] -= 1;
                    return request.destroy();
                }
            }
            this.clients.add(new Client_1.default(this, ws, ip));
        };
        this.wss.on("connection", onConnect);
        util.saveToLog("Game Deploying", "Game now deploying gamemode `" + this.gamemode + "` at endpoint `" + this.gamemode + "`.", 0x1FE0C4);
    }
    broadcast() {
        return new WSSWriterStream(this);
    }
    broadcastPlayerCount() {
        this.broadcast().vu(10).vu(GameServer.globalPlayerCount).send();
    }
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
    onEnd() {
        util.log("Game instance is now over");
        this.start();
    }
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
    tickLoop() {
        this.tick += 1;
        this.entities.tick(this.tick);
        for (const client of this.clients)
            client.tick(this.tick);
    }
    transferClient(client) {
        const game = client.game;
        client.game = this;
        game.clients.delete(client);
        this.clients.add(client);
        client.write().u8(7).vi(client.accessLevel).send();
        if (Entity_1.Entity.exists(client.camera)) {
            const cam = new Camera_1.default(this, client);
            cam.sizeFactor = client.camera.sizeFactor;
            cam.spectatee = null;
            cam.cameraData.values = { ...client.camera.cameraData.values };
            cam.cameraData.values.player = null;
            cam.cameraData.values.statNames = new FieldGroups_1.CameraTable("", 9, cam.cameraData);
            cam.cameraData.values.statLevels = new FieldGroups_1.CameraTable(0, 10, cam.cameraData);
            cam.cameraData.values.statLimits = new FieldGroups_1.CameraTable(0, 11, cam.cameraData);
            for (let i = 0; i < Enums_1.StatCount; ++i) {
                cam.cameraData.statNames[i] = client.camera.cameraData.statNames[i];
                cam.cameraData.statLimits[i] = client.camera.cameraData.statLimits[i];
                cam.cameraData.statLevels[i] = client.camera.cameraData.statLevels[i];
            }
            if (Entity_1.Entity.exists(client.camera.cameraData.player)) {
                client.camera.cameraData.player.delete();
                let tank;
                if (client.camera.cameraData.player instanceof TankBody_1.default) {
                    tank = cam.cameraData.player = cam.relationsData.owner = cam.relationsData.parent = new TankBody_1.default(this, cam, client.inputs, client.camera.cameraData.player.currentTank);
                    tank.nameData.values.name = client.camera.cameraData.player.nameData.values.name;
                    const { x, y } = this.arena.findSpawnLocation();
                    tank.positionData.values.x = x;
                    tank.positionData.values.y = y;
                }
                else {
                    tank = cam.cameraData.player = cam.relationsData.owner = cam.relationsData.parent = new TankBody_1.default(this, cam, client.inputs);
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
        if (client.hasCheated())
            client.setHasCheated(true);
        client.inputs.isPossessing = false;
        client.inputs.movement.magnitude = 0;
    }
}
exports.default = GameServer;
GameServer.globalPlayerCount = 0;
