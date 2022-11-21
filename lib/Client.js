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
exports.ClientInputs = void 0;
const config = require("./config");
const util = require("./util");
const crypto_1 = require("crypto");
const Auth_1 = require("./Auth");
const Reader_1 = require("./Coder/Reader");
const Writer_1 = require("./Coder/Writer");
const Game_1 = require("./Game");
const Camera_1 = require("./Native/Camera");
const Arena_1 = require("./Native/Arena");
const Object_1 = require("./Entity/Object");
const TankDefinitions_1 = require("./Const/TankDefinitions");
const DevTankDefinitions_1 = require("./Const/DevTankDefinitions");
const TankBody_1 = require("./Entity/Tank/TankBody");
const Vector_1 = require("./Physics/Vector");
const Entity_1 = require("./Native/Entity");
const Enums_1 = require("./Const/Enums");
const AI_1 = require("./Entity/AI");
const AbstractBoss_1 = require("./Entity/Boss/AbstractBoss");
/** XORed onto the tank id in the Tank Upgrade packet. */
const TANK_XOR = config.magicNum % TankDefinitions_1.TankCount;
/** XORed onto the stat id in the Stat Upgrade packet.  */
const STAT_XOR = config.magicNum % Enums_1.StatCount;
/** Cached ping packet */
const PING_PACKET = new Uint8Array([Enums_1.ClientBound.Ping]);
/**
 * Used to write data in Writer class form to the socket.
 */
class WSWriterStream extends Writer_1.default {
    constructor(ws) {
        super();
        this._at = 0;
        this.ws = ws;
    }
    get at() {
        return this._at;
    }
    set at(v) {
        if (v + 5 >= Writer_1.default.OUTPUT_BUFFER.length) {
            this.ws.send(Writer_1.default.OUTPUT_BUFFER.subarray(0, v), { fin: false });
            this._at = 0;
        }
        else
            this._at = v;
    }
    send() {
        this.ws.send(this.write());
    }
}
/**
 * Used to store flags and apply once a tick.
 */
class ClientInputs extends AI_1.Inputs {
    constructor(client) {
        super();
        /** Used to store flags and apply once a tick. */
        this.cachedFlags = 0;
        /** Just a place to store whether or not the client is possessing an AI. */
        this.isPossessing = false;
        this.client = client;
    }
}
exports.ClientInputs = ClientInputs;
class Client {
    constructor(game, ws, ipAddress) {
        /** Set to true if the client socket has been terminated. */
        this.terminated = false;
        /** The client's access level. */
        this.accessLevel = config.devTokens["*"];
        /** Cache of all incoming packets of the current tick. */
        this.incomingCache = Array(Enums_1.ServerBound.TakeTank + 1).fill(null).map(() => []);
        /** The parsed input data from the socket. */
        this.inputs = new ClientInputs(this);
        /** Client's camera entity. */
        this.camera = null;
        /** The client's discord id if available. */
        this.discordId = null;
        /** Whether or not the player has used in game dev cheats before (such as level up or godmode). */
        this.devCheatsUsed = 0;
        this.game = game;
        this.ws = ws;
        this.ipAddress = ipAddress;
        this.ipAddressHash = (0, crypto_1.createHash)('sha256').update(ipAddress + __dirname).digest('hex').slice(0, 8);
        this.lastPingTick = this.connectTick = game.tick;
        ws.binaryType = "arraybuffer";
        ws.on("close", () => {
            util.log("WS Closed");
            this.terminate();
        });
        ws.on("error", console.log.bind(void 0, "ws error"));
        ws.on("message", (buffer) => {
            const data = new Uint8Array(buffer);
            if (data[0] === 0x00 && data.byteLength === 1)
                return this.terminate(); // We do not host ping servers.
            const header = data[0];
            if (header === Enums_1.ServerBound.Ping) {
                this.lastPingTick = this.game.tick;
                if (config.mode === "production") {
                    // this.write().u8(ClientBound.Ping).send();
                    this.ws.send(PING_PACKET);
                }
                else {
                    // setTimeout(() => {
                    // this.write().u8(ClientBound.Ping).send();
                    this.ws.send(PING_PACKET);
                    // }, 20)
                }
            }
            else if (header >= Enums_1.ServerBound.Init && header <= Enums_1.ServerBound.TakeTank) {
                if (this.incomingCache[header].length) {
                    if (header === Enums_1.ServerBound.Input) {
                        // Otherwise store the flags
                        const r = new Reader_1.default(data);
                        r.at = 1;
                        const flags = r.vu();
                        this.inputs.cachedFlags |= flags & 0b110111100001; // WASD and gamepad are not stored.
                    }
                    else if (header === Enums_1.ServerBound.StatUpgrade) {
                        this.incomingCache[header].push(data);
                    }
                    return;
                }
                this.incomingCache[header][0] = data;
            }
            else {
                util.log("Suspicious activies have been avoided");
                return this.ban();
            }
        });
    }
    /** Returns a new writer stream connected to the socket. */
    write() {
        return new WSWriterStream(this.ws);
    }
    /** Parses incoming packets. */
    handleIncoming(header, data) {
        if (this.terminated)
            return;
        const r = new Reader_1.default(data);
        r.at = 1;
        const camera = this.camera;
        if (header === Enums_1.ServerBound.Init) {
            if (camera)
                return this.terminate(); // only one connection;
            const buildHash = r.stringNT();
            const pw = r.stringNT();
            // const party = r.stringNT();
            // const debugId = r.vu();
            if (buildHash !== config.buildHash) {
                util.log("Kicking client. Invalid build hash " + JSON.stringify(buildHash));
                util.saveToVLog(this.toString() + " being kicked, wrong version hash " + JSON.stringify(buildHash));
                this.write().u8(Enums_1.ClientBound.OutdatedClient).stringNT(config.buildHash).send();
                setTimeout(() => this.terminate(), 100);
                return;
            }
            // Hardcoded dev password
            if (!config.devPasswordHash || (0, crypto_1.createHash)('sha256').update(pw).digest('hex') === config.devPasswordHash) {
                this.accessLevel = 3 /* config.AccessLevel.FullAccess */;
                util.saveToLog("Developer Connected", "A client connected to the server (`" + this.game.gamemode + "`) with `full` access.", 0x5A65EA);
            }
            else if (Auth_1.default && pw) {
                if (!Auth_1.default.verifyCode(pw))
                    return this.terminate();
                const [id, perm] = pw.split('v');
                this.discordId = id;
                this.accessLevel = config.devTokens[id] ?? parseInt(perm) ?? config.devTokens["*"];
                util.saveToLog("Client Connected", this.toString() + " connected to the server (`" + this.game.gamemode + "`) with a level " + this.accessLevel + " access.", 0x5FF7B9);
                // Enforce 2 clients per account id
                if (!this.game.discordCache[id])
                    this.game.discordCache[id] = 1;
                else
                    this.game.discordCache[id] += 1;
                util.saveToVLog(`${this.toString()} client connecting. ip: ` + this.ipAddressHash);
                if (this.game.discordCache[id] > 2) {
                    util.saveToVLog(`${this.toString()} too many accounts!. ip: ` + this.ipAddressHash);
                    util.saveToLog("Client Kicked", this.toString() + " client count maximum reached at `" + this.game.gamemode + "`.", 0xEE326A);
                    this.terminate();
                }
            }
            else if (Auth_1.default) {
                util.saveToLog("Client Terminated", "Unknown client terminated due to lack of authentication:: " + this.toString(), 0x6AEE32);
                return this.terminate();
            }
            if (this.accessLevel === -1 /* config.AccessLevel.NoAccess */) {
                util.saveToLog("Client Terminated 2", "Possibly unknown, client terminated due to lack of authentication:: " + this.toString(), 0x6EAE23);
                return this.terminate();
            }
            // Finish handshake
            this.write().u8(Enums_1.ClientBound.Accept).send();
            this.write().u8(Enums_1.ClientBound.ServerInfo).stringNT(this.game.gamemode).stringNT(config.host).send();
            this.write().u8(Enums_1.ClientBound.PlayerCount).vu(Game_1.default.globalPlayerCount).send();
            this.camera = new Camera_1.default(this.game, this);
            return;
        }
        if (!Entity_1.Entity.exists(camera))
            return;
        switch (header) {
            case Enums_1.ServerBound.Init: throw new Error('0x0::How?');
            case Enums_1.ServerBound.Ping: throw new Error('0x5::How?');
            case Enums_1.ServerBound.Input: {
                // Beware, this code gets less readable as you scroll
                const previousFlags = this.inputs.flags;
                const flags = this.inputs.flags = r.vu() | this.inputs.cachedFlags;
                this.inputs.cachedFlags = 0;
                this.inputs.mouse.x = r.vf();
                this.inputs.mouse.y = r.vf();
                if (!Vector_1.default.isFinite(this.inputs.mouse))
                    break;
                const movement = {
                    x: 0,
                    y: 0
                };
                if (flags & Enums_1.InputFlags.gamepad) {
                    movement.x = r.vf();
                    movement.y = r.vf();
                    if (!Vector_1.default.isFinite(movement))
                        return;
                }
                else {
                    if (flags & Enums_1.InputFlags.up)
                        movement.y -= 1;
                    if (flags & Enums_1.InputFlags.down)
                        movement.y += 1;
                    if (flags & Enums_1.InputFlags.right)
                        movement.x += 1;
                    if (flags & Enums_1.InputFlags.left)
                        movement.x -= 1;
                }
                if (movement.x || movement.y) {
                    const angle = Math.atan2(movement.y, movement.x);
                    const magnitude = util.constrain(Math.sqrt(movement.x ** 2 + movement.y ** 2), -1, 1);
                    this.inputs.movement.magnitude = magnitude;
                    this.inputs.movement.angle = angle;
                }
                const player = camera.camera.values.player;
                if (!Entity_1.Entity.exists(player) || !(player instanceof TankBody_1.default))
                    return;
                // No AI
                if (this.inputs.isPossessing && this.accessLevel !== 3 /* config.AccessLevel.FullAccess */)
                    return;
                if ((flags & Enums_1.InputFlags.godmode) && (this.accessLevel >= 2 /* config.AccessLevel.BetaAccess */ || true)) {
                    player.name.nametag |= Enums_1.NametagFlags.cheats;
                    this.devCheatsUsed = 1;
                    player.setTank(player.currentTank < 0 ? Enums_1.Tank.Basic : DevTankDefinitions_1.DevTank.Developer);
                }
                if ((flags & Enums_1.InputFlags.rightclick) && !(previousFlags & Enums_1.InputFlags.rightclick) && player.currentTank === DevTankDefinitions_1.DevTank.Developer) {
                    player.position.x = this.inputs.mouse.x;
                    player.position.y = this.inputs.mouse.y;
                    player.setVelocity(0, 0);
                    player.state |= Entity_1.EntityStateFlags.needsCreate | Entity_1.EntityStateFlags.needsDelete;
                }
                if ((flags & Enums_1.InputFlags.switchtank) && !(previousFlags & Enums_1.InputFlags.switchtank)) {
                    player.name.nametag |= Enums_1.NametagFlags.cheats;
                    this.devCheatsUsed = 1;
                    let tank = player.currentTank;
                    if (tank >= 0) {
                        tank = (tank + TankDefinitions_1.default.length - 1) % TankDefinitions_1.default.length;
                        while (!TankDefinitions_1.default[tank] || (TankDefinitions_1.default[tank]?.flags.devOnly && this.accessLevel < 3 /* config.AccessLevel.FullAccess */)) {
                            tank = (tank + TankDefinitions_1.default.length - 1) % TankDefinitions_1.default.length;
                        }
                    }
                    else {
                        const isDeveloper = this.accessLevel === 3 /* config.AccessLevel.FullAccess */;
                        tank = ~tank;
                        tank = (tank + 1) % DevTankDefinitions_1.default.length;
                        while (!DevTankDefinitions_1.default[tank] || DevTankDefinitions_1.default[tank].flags.devOnly === true && !isDeveloper) {
                            tank = (tank + 1) % DevTankDefinitions_1.default.length;
                        }
                        tank = ~tank;
                    }
                    player.setTank(tank);
                }
                if (flags & Enums_1.InputFlags.levelup) {
                    if ((this.accessLevel === 3 /* config.AccessLevel.FullAccess */) || camera.camera.values.level < 45) {
                        player.name.nametag |= Enums_1.NametagFlags.cheats;
                        this.devCheatsUsed = 1;
                        camera.setLevel(camera.camera.values.level + 1);
                    }
                }
                if ((flags & Enums_1.InputFlags.suicide) && (!player.deletionAnimation || !player.deletionAnimation)) {
                    player.name.nametag |= Enums_1.NametagFlags.cheats;
                    this.devCheatsUsed = 1;
                    this.notify("You've killed " + (player.name.values.name === "" ? "an unnamed tank" : player.name.values.name));
                    camera.camera.killedBy = player.name.values.name;
                    player.destroy();
                }
                return;
            }
            case Enums_1.ServerBound.Spawn: {
                util.log("Client wants to spawn");
                if (Entity_1.Entity.exists(camera.camera.values.player) || (this.game.arena.arenaState >= Arena_1.ArenaState.CLOSING))
                    return;
                camera.camera.values.statsAvailable = 0;
                camera.camera.values.level = 1;
                for (let i = 0; i < Enums_1.StatCount; ++i) {
                    camera.camera.values.statLevels.values[i] = 0;
                }
                const name = r.stringNT().slice(0, 16);
                const tank = camera.camera.player = camera.relations.owner = camera.relations.parent = new TankBody_1.default(this.game, camera, this.inputs);
                tank.setTank(Enums_1.Tank.Basic);
                this.game.arena.spawnPlayer(tank, this);
                camera.setLevel(camera.camera.values.respawnLevel);
                tank.name.values.name = name;
                if (this.devCheatsUsed)
                    tank.name.values.nametag |= Enums_1.NametagFlags.cheats;
                // Force-send a creation to the client - Only if it is not new
                camera.state = Entity_1.EntityStateFlags.needsCreate | Entity_1.EntityStateFlags.needsDelete;
                camera.spectatee = null;
                this.inputs.isPossessing = false;
                return;
            }
            case Enums_1.ServerBound.StatUpgrade: {
                if (camera.camera.statsAvailable <= 0)
                    return;
                const tank = camera.camera.values.player;
                if (!Entity_1.Entity.exists(tank) || !(tank instanceof TankBody_1.default))
                    return;
                // No AI
                if (this.inputs.isPossessing)
                    return;
                const definition = (0, TankDefinitions_1.getTankById)(tank.currentTank);
                if (!definition || !definition.stats.length)
                    return;
                const statId = r.vi() ^ STAT_XOR;
                if (statId < 0 || statId >= Enums_1.StatCount)
                    return;
                // const chosenLimit = r.vi();
                const statLimit = camera.camera.values.statLimits.values[statId];
                if (camera.camera.values.statLevels.values[statId] >= statLimit)
                    return;
                camera.camera.statLevels[statId] += 1;
                camera.camera.statsAvailable -= 1;
                return;
            }
            case Enums_1.ServerBound.TankUpgrade: {
                const player = camera.camera.values.player;
                // No AI
                if (this.inputs.isPossessing)
                    return;
                if (!Entity_1.Entity.exists(player) || !(player instanceof TankBody_1.default))
                    return;
                const definition = (0, TankDefinitions_1.getTankById)(player.currentTank);
                const tankId = r.vi() ^ TANK_XOR;
                const tankDefinition = (0, TankDefinitions_1.getTankById)(tankId);
                if (!definition || !definition.upgrades.includes(tankId) || !tankDefinition || tankDefinition.levelRequirement > camera.camera.values.level)
                    return;
                player.setTank(tankId);
                return;
            }
            case Enums_1.ServerBound.ExtensionFound:
                util.log("Someone is cheating");
                return this.ban();
            case Enums_1.ServerBound.ToRespawn:
                // Doesn't matter if the player is alive or not in real diep.
                if (camera.camera.values.camera & Enums_1.CameraFlags.showDeathStats)
                    camera.camera.camera ^= Enums_1.CameraFlags.showDeathStats;
                // if (this.game.arena.arenaState !== ArenaState.OPEN) return this.terminate();
                return;
            case Enums_1.ServerBound.TakeTank: {
                /* AS OF NOVEMBER 9, THE FOLLOWING IS ONLY COMMENTED CODE
                    // AS OF OCTOBER 18
                    // This packet now will allow players to switch teams.
                    // if (Entity.exists(camera.camera.values.player)) this.notify("Someone has already taken that tank", 0x000000, 5000, "cant_claim_info");
                    const player = camera.camera.values.player;
                    if (!Entity.exists(player) || !player.relations || !player.style) return;

                    if (player.relations.team === this.game.arena) {
                        player.relations.team = camera;
                        player.style.color = Colors.Tank;
                        this.notify("Team switched to camera");
                    } else {
                        player.relations.team = this.game.arena;
                        player.style.color = Colors.Neutral;
                        this.notify("Team switched to arena");
                    }
                */
                if (!Entity_1.Entity.exists(camera.camera.values.player))
                    return;
                if (!this.game.entities.AIs.length)
                    return this.notify("Someone has already taken that tank", 0x000000, 5000, "cant_claim_info");
                if (!this.inputs.isPossessing) {
                    const x = camera.camera.values.player.position?.values.x || 0;
                    const y = camera.camera.values.player.position?.values.y || 0;
                    const AIs = Array.from(this.game.entities.AIs);
                    AIs.sort((a, b) => {
                        const { x: x1, y: y1 } = a.owner.getWorldPosition();
                        const { x: x2, y: y2 } = b.owner.getWorldPosition();
                        return ((x1 - x) ** 2 + (y1 - y) ** 2) - ((x2 - x) ** 2 + (y2 - y) ** 2);
                    });
                    for (let i = 0; i < AIs.length; ++i) {
                        if (AIs[i].state !== AI_1.AIState.possessed && ((!AIs[i].isTaken && AIs[i].owner.relations.values.team === camera.relations.values.team) || this.accessLevel === 3 /* config.AccessLevel.FullAccess */)) {
                            // if (AIs[i].state !== AIState.possessed && (AIs[i].owner.relations.values.team === camera.relations.values.team|| this.accessLevel === config.AccessLevel.FullAccess)) {
                            const ai = AIs[i];
                            this.inputs.deleted = true;
                            ai.inputs = this.inputs = new ClientInputs(this);
                            this.inputs.isPossessing = true;
                            ai.isTaken = true;
                            ai.state = AI_1.AIState.possessed;
                            // Silly workaround to change color of player when needed
                            if (camera.camera.values.player instanceof Object_1.default)
                                camera.camera.values.player.state |= camera.camera.values.player.style.state.color = 1;
                            camera.camera.tankOverride = ai.owner.name?.values.name || "";
                            camera.camera.tank = 53;
                            // AI stats, confirmed by Mounted Turret videos
                            for (let i = 0; i < Enums_1.StatCount; ++i)
                                camera.camera.statLevels[i] = 0;
                            for (let i = 0; i < Enums_1.StatCount; ++i)
                                camera.camera.statLimits[i] = 7;
                            for (let i = 0; i < Enums_1.StatCount; ++i)
                                camera.camera.statNames[i] = "";
                            camera.camera.killedBy = "";
                            camera.camera.player = ai.owner;
                            camera.camera.movementSpeed = ai.movementSpeed;
                            if (ai.owner instanceof TankBody_1.default) {
                                // If its a TankBody, set the stats, level, and tank to that of the TankBody
                                camera.camera.tank = ai.owner.cameraEntity.camera.values.tank;
                                camera.setLevel(ai.owner.cameraEntity.camera.values.level);
                                for (let i = 0; i < Enums_1.StatCount; ++i)
                                    camera.camera.statLevels[i] = ai.owner.cameraEntity.camera.statLevels.values[i];
                                for (let i = 0; i < Enums_1.StatCount; ++i)
                                    camera.camera.statLimits[i] = ai.owner.cameraEntity.camera.statLimits.values[i];
                                for (let i = 0; i < Enums_1.StatCount; ++i)
                                    camera.camera.statNames[i] = ai.owner.cameraEntity.camera.statNames.values[i];
                                camera.camera.FOV = 0.35;
                            }
                            else if (ai.owner instanceof AbstractBoss_1.default) {
                                camera.setLevel(75);
                                camera.camera.FOV = 0.25;
                            }
                            else {
                                camera.setLevel(30);
                                // this.camera.movementSpeed = 0;
                            }
                            camera.camera.statsAvailable = 0;
                            camera.camera.scorebar = 0;
                            this.notify("Press H to surrender control of your tank", 0x000000, 5000);
                            return;
                        }
                    }
                    this.notify("Someone has already taken that tank", 0x000000, 5000, "cant_claim_info");
                }
                else {
                    this.inputs.deleted = true;
                }
                return;
            }
            case Enums_1.ServerBound.TCPInit:
                return;
            default:
                util.log("Suspicious activies have been evaded");
                return this.ban();
        }
    }
    /** Sends a notification packet to the client. */
    notify(text, color = 0x000000, time = 4000, id = "") {
        this.write().u8(Enums_1.ClientBound.Notification).stringNT(text).u32(color).float(time).stringNT(id).send();
    }
    /** Terminates the connection and related things. */
    terminate() {
        if (this.terminated)
            return;
        this.ws.terminate();
        this.game.clients.delete(this);
        this.inputs.deleted = true;
        this.inputs.movement.magnitude = 0;
        this.terminated = true;
        this.game.ipCache[this.ipAddress] -= 1;
        if (this.discordId && this.game.discordCache[this.discordId]) {
            this.game.discordCache[this.discordId] -= 1;
            util.saveToVLog(`${this.toString()} terminated. ip: ` + this.ipAddressHash);
        }
        if (Entity_1.Entity.exists(this.camera))
            this.camera.delete();
    }
    /** Bans the ip from all servers until restart. */
    ban() {
        util.saveToLog("IP Banned", "Banned ||`" + JSON.stringify(this.ipAddress) + "`|| (<@" + this.discordId + ">) across all servers... " + this.toString(true), 0xEE326A);
        if (this.accessLevel >= config.unbannableLevelMinimum) {
            util.saveToLog("IP Ban Cancelled", "Cancelled ban on ||`" + JSON.stringify(this.ipAddress) + "`|| (<@" + this.discordId + ">) across all servers." + this.toString(true), 0x6A32EE);
            return;
        }
        // Lol
        this.game.ipCache[this.ipAddress] = Infinity;
        if (this.discordId)
            this.game.discordCache[this.discordId] = Infinity;
        for (let client of this.game.clients) {
            if (client.ipAddress === this.ipAddress) {
                client.terminate();
            }
        }
    }
    tick(tick) {
        for (let header = Enums_1.ServerBound.Init; header <= Enums_1.ServerBound.TakeTank; ++header) {
            if (header === Enums_1.ServerBound.Ping)
                continue;
            if (this.incomingCache[header].length === 1)
                this.handleIncoming(header, this.incomingCache[header][0]);
            else if (this.incomingCache[header].length > 1) {
                for (let i = 0, len = this.incomingCache[header].length; i < len; ++i)
                    this.handleIncoming(header, this.incomingCache[header][i]);
            }
            else
                continue;
            this.incomingCache[header].length = 0;
        }
        if (!this.camera) {
            if (tick === this.connectTick + 300) {
                return this.terminate();
            }
        }
        else if (this.inputs.deleted) {
            this.inputs = new ClientInputs(this);
            this.camera.camera.player = null;
            this.camera.camera.cameraX = this.camera.camera.cameraY = 0;
        }
        if (tick >= this.lastPingTick + 300) {
            return this.terminate();
        }
    }
    /** toString override from base Object. Adds debug info */
    toString(verbose = false) {
        const tokens = [];
        if (this.discordId)
            tokens.push("disc=<@" + this.discordId + ">");
        if (this.camera?.camera?.player?.name?.name)
            tokens.push("name=" + JSON.stringify(this.camera?.camera?.player?.name?.name));
        if (verbose) {
            if (this.ipAddress)
                tokens.push("ip=" + this.ipAddress);
            if (this.game.gamemode)
                tokens.push("game.gamemode=" + this.game.gamemode);
        }
        if (this.terminated)
            tokens.push("(terminated)");
        if (!tokens.length)
            return `Client(${this.accessLevel}) {}`;
        return `Client(${this.accessLevel}) { ${tokens.join(', ')} }`;
    }
}
exports.default = Client;
