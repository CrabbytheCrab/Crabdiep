"use strict";
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
const Object_1 = require("./Entity/Object");
const TankDefinitions_1 = require("./Const/TankDefinitions");
const DevTankDefinitions_1 = require("./Const/DevTankDefinitions");
const TankBody_1 = require("./Entity/Tank/TankBody");
const Vector_1 = require("./Physics/Vector");
const Entity_1 = require("./Native/Entity");
const Enums_1 = require("./Const/Enums");
const AI_1 = require("./Entity/AI");
const AbstractBoss_1 = require("./Entity/Boss/AbstractBoss");
const Commands_1 = require("./Const/Commands");
const _1 = require(".");
const Rift_1 = require("./Entity/Misc/Rift");
const TANK_XOR = config.magicNum % TankDefinitions_1.TankCount;
const STAT_XOR = config.magicNum % Enums_1.StatCount;
const PING_PACKET = new Uint8Array([5]);
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
class ClientInputs extends AI_1.Inputs {
    constructor(client) {
        super();
        this.cachedFlags = 0;
        this.isPossessing = false;
        this.client = client;
    }
}
exports.ClientInputs = ClientInputs;
class Client {
    constructor(game, ws, ipAddress) {
        this.terminated = false;
        this.accessLevel = config.devTokens["*"];
        this.incomingCache = Array(9 + 1).fill(null).map(() => []);
        this.inputs = new ClientInputs(this);
        this.camera = null;
        this.discordId = null;
        this.devCheatsUsed = false;
        this.isInvulnerable = false;
        this.damageReductionCache = 1;
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
                return this.terminate();
            const header = data[0];
            if (header === 5) {
                this.lastPingTick = this.game.tick;
                this.ws.send(PING_PACKET);
            }
            else if (header >= 0 && header <= 9) {
                if (this.incomingCache[header].length) {
                    if (header === 1) {
                        const r = new Reader_1.default(data);
                        r.at = 1;
                        const flags = r.vu();
                        this.inputs.cachedFlags |= flags & 0b110111100001;
                    }
                    else if (header === 3) {
                        this.incomingCache[header].push(data);
                    }
                    return;
                }
                this.incomingCache[header][0] = data;
            }
            else {
                util.log("Sus activies have been avoidezd");
                return this.ban();
            }
        });
    }
    write() {
        return new WSWriterStream(this.ws);
    }
    handleIncoming(header, data) {
        if (this.terminated)
            return;
        const r = new Reader_1.default(data);
        r.at = 1;
        const camera = this.camera;
        if (header === 0) {
            if (camera)
                return this.terminate();
            const buildHash = r.stringNT();
            const pw = r.stringNT();
            if (buildHash !== config.buildHash) {
                util.log("Kicking client. Invalid build hash " + JSON.stringify(buildHash));
                util.saveToVLog(this.toString() + " being kicked, wrong version hash " + JSON.stringify(buildHash));
                this.write().u8(1).stringNT(config.buildHash).send();
                setTimeout(() => this.terminate(), 100);
                return;
            }
            if (config.devPasswordHash && (0, crypto_1.createHash)('sha256').update(pw).digest('hex') === config.devPasswordHash) {
                this.accessLevel = 3;
                util.saveToLog("Developer Connected", "A client connected to the server (`" + this.game.gamemode + "`) with `full` access.", 0x5A65EA);
            }
            else if (Auth_1.default && pw) {
                if (!Auth_1.default.verifyCode(pw))
                    return this.terminate();
                const [id, perm] = pw.split('v');
                this.discordId = id;
                this.accessLevel = config.devTokens[id] ?? parseInt(perm) ?? config.devTokens["*"];
                util.saveToLog("Client Connected", this.toString() + " connected to the server (`" + this.game.gamemode + "`) with a level " + this.accessLevel + " access.", 0x5FF7B9);
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
            else {
                this.accessLevel = config.defaultAccessLevel;
            }
            if (this.accessLevel === -1) {
                util.saveToLog("Client Terminated 2", "Possibly unknown, client terminated due to lack of authentication:: " + this.toString(), 0x6EAE23);
                return this.terminate();
            }
            this.write().u8(7).vi(this.accessLevel).send();
            this.write().u8(4).stringNT(this.game.gamemode).stringNT(config.host).send();
            this.write().u8(10).vu(Game_1.default.globalPlayerCount).send();
            this.camera = new Camera_1.default(this.game, this);
            return;
        }
        if (!Entity_1.Entity.exists(camera))
            return;
        switch (header) {
            case 0: throw new Error('0x0::How?');
            case 5: throw new Error('0x5::How?');
            case 1: {
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
                if (flags & 512) {
                    movement.x = r.vf();
                    movement.y = r.vf();
                    if (!Vector_1.default.isFinite(movement))
                        return;
                }
                else {
                    if (flags & 2)
                        movement.y -= 1;
                    if (flags & 8)
                        movement.y += 1;
                    if (flags & 16)
                        movement.x += 1;
                    if (flags & 4)
                        movement.x -= 1;
                }
                if (movement.x || movement.y) {
                    const angle = Math.atan2(movement.y, movement.x);
                    const magnitude = util.constrain(Math.sqrt(movement.x ** 2 + movement.y ** 2), -1, 1);
                    this.inputs.movement.magnitude = magnitude;
                    this.inputs.movement.angle = angle;
                }
                const player = camera.cameraData.values.player;
                if (!Entity_1.Entity.exists(player) || !(player instanceof TankBody_1.default))
                    return;
                if (this.inputs.isPossessing && this.accessLevel !== 3)
                    return;
                if ((flags & 32)) {
                    if (this.accessLevel >= 2) {
                        this.setHasCheated(true);
                        player.setTank(player.currentTank < 0 ? 0 : -1);
                    }
                    else if (this.game.arena.arenaData.values.flags & 16) {
                        if (this.accessLevel === 3 || (this.game.clients.size === 1 && this.game.arena.state === 0)) {
                            this.setHasCheated(true);
                            player.setInvulnerability(!player.isInvulnerable);
                            this.notify(`God mode: ${player.isInvulnerable ? "ON" : "OFF"}`, 0x000000, 1000, 'godmode');
                        }
                    }
                }
                if ((flags & 128) && !(previousFlags & 128) && player.currentTank === -1) {
                    player.positionData.x = this.inputs.mouse.x;
                    player.positionData.y = this.inputs.mouse.y;
                    player.setVelocity(0, 0);
                    player.entityState |= 2 | 4;
                }
                if ((flags & 128) && !(previousFlags & 128) && player.currentTank === 276 && !player.coolDown) {
                    player.positionData.x = this.inputs.mouse.x;
                    player.positionData.y = this.inputs.mouse.y;
                    player.setVelocity(0, 0);
                    player.entityState |= 2 | 4;
                    player.coolDown = true;
                    setTimeout(() => {
                        player.coolDown = false;
                        this.notify("You can use your ability again");
                    }, 10000);
                }
                if ((flags & 128) && !(previousFlags & 128) && player.currentTank === 282 && !player.coolDown) {
                    new Rift_1.default(this.game, player.positionData.x, player.positionData.y, player.inputs.mouse.x, player.inputs.mouse.y);
                    player.entityState |= 2 | 4;
                    player.coolDown = true;
                    setTimeout(() => {
                        player.coolDown = false;
                        this.notify("You can use your ability again");
                    }, 12000);
                }
                if ((flags & 1024) && !(previousFlags & 1024)) {
                    if (this.accessLevel >= 2 || (this.game.arena.arenaData.values.flags & 16)) {
                        this.setHasCheated(true);
                        let tank = player.currentTank;
                        if (tank >= 0) {
                            tank = (tank + TankDefinitions_1.default.length - 1) % TankDefinitions_1.default.length;
                            while (!TankDefinitions_1.default[tank] || (TankDefinitions_1.default[tank]?.flags.devOnly && this.accessLevel < 3)) {
                                tank = (tank + TankDefinitions_1.default.length - 1) % TankDefinitions_1.default.length;
                            }
                        }
                        else {
                            const isDeveloper = this.accessLevel === 3;
                            tank = ~tank;
                            tank = (tank + 1) % DevTankDefinitions_1.default.length;
                            while (!DevTankDefinitions_1.default[tank] || DevTankDefinitions_1.default[tank].flags.devOnly === true && !isDeveloper) {
                                tank = (tank + 1) % DevTankDefinitions_1.default.length;
                            }
                            tank = ~tank;
                        }
                        player.setTank(tank);
                    }
                }
                if (flags & 256) {
                    if (camera.cameraData.values.level < camera.maxlevel) {
                        if (camera.game.gamemode == "scenexe" || camera.game.gamemode == "crossroads" || camera.game.gamemode == "sanctuary") { }
                        else {
                            camera.setLevel(camera.cameraData.values.level + 1);
                        }
                    }
                }
                if ((flags & 64) && (!player.deletionAnimation || !player.deletionAnimation)) {
                    if (this.accessLevel >= 2 || (this.game.arena.arenaData.values.flags & 16)) {
                        this.setHasCheated(true);
                        this.notify("You've killed " + (player.nameData.values.name === "" ? "an unnamed tank" : player.nameData.values.name));
                        camera.cameraData.killedBy = player.nameData.values.name;
                        player.destroy();
                    }
                }
                return;
            }
            case 2: {
                util.log("Client wants to spawn");
                if (Entity_1.Entity.exists(camera.cameraData.values.player) || (this.game.arena.state >= 2))
                    return;
                camera.cameraData.values.statsAvailable = 0;
                camera.cameraData.values.level = 1;
                for (let i = 0; i < Enums_1.StatCount; ++i) {
                    camera.cameraData.values.statLevels.values[i] = 0;
                }
                const name = r.stringNT().slice(0, 16);
                const tank = camera.cameraData.player = camera.relationsData.owner = camera.relationsData.parent = new TankBody_1.default(this.game, camera, this.inputs);
                tank.setTank(0);
                this.game.arena.spawnPlayer(tank, this);
                camera.cameraData.score = camera.cameraData.values.respawnLevel;
                camera.cameraData.isCelestial = false;
                tank.nameData.values.name = name;
                if (this.hasCheated())
                    this.setHasCheated(true);
                camera.entityState = 2 | 4;
                camera.spectatee = null;
                this.inputs.isPossessing = false;
                if (this.game.gamemode == "crossroads" || this.game.gamemode == "sanctuary") {
                    _1.gamer.get("scenexe").transferClient(this);
                }
                return;
            }
            case 3: {
                if (camera.cameraData.statsAvailable <= 0)
                    return;
                const tank = camera.cameraData.values.player;
                if (!Entity_1.Entity.exists(tank) || !(tank instanceof TankBody_1.default))
                    return;
                if (this.inputs.isPossessing)
                    return;
                const definition = (0, TankDefinitions_1.getTankById)(tank.currentTank);
                if (!definition || !definition.stats.length)
                    return;
                const statId = r.vi() ^ STAT_XOR;
                if (statId < 0 || statId >= Enums_1.StatCount)
                    return;
                const statLimit = camera.cameraData.values.statLimits.values[statId];
                if (camera.cameraData.values.statLevels.values[statId] >= statLimit)
                    return;
                camera.cameraData.statLevels[statId] += 1;
                camera.cameraData.statsAvailable -= 1;
                return;
            }
            case 4: {
                const player = camera.cameraData.values.player;
                if (this.inputs.isPossessing)
                    return;
                if (!Entity_1.Entity.exists(player) || !(player instanceof TankBody_1.default))
                    return;
                const definition = (0, TankDefinitions_1.getTankById)(player.currentTank);
                const tankId = r.vi() ^ TANK_XOR;
                const tankDefinition = (0, TankDefinitions_1.getTankById)(tankId);
                if (!definition || !definition.upgrades.includes(tankId) || !tankDefinition || tankDefinition.levelRequirement > camera.cameraData.values.level)
                    return;
                player.setTank(tankId);
                return;
            }
            case 7:
                util.log("Someone is cheating");
                return this.ban();
            case 8:
                camera.cameraData.flags &= ~2;
                return;
            case 9: {
                if (!Entity_1.Entity.exists(camera.cameraData.values.player))
                    return;
                if (!this.game.entities.AIs.length)
                    return this.notify("Someone has already taken that tank", 0x000000, 5000, "cant_claim_info");
                if (!this.inputs.isPossessing) {
                    const x = camera.cameraData.values.player.positionData?.values.x || 0;
                    const y = camera.cameraData.values.player.positionData?.values.y || 0;
                    const AIs = Array.from(this.game.entities.AIs);
                    AIs.sort((a, b) => {
                        const { x: x1, y: y1 } = a.owner.getWorldPosition();
                        const { x: x2, y: y2 } = b.owner.getWorldPosition();
                        return ((x1 - x) ** 2 + (y1 - y) ** 2) - ((x2 - x) ** 2 + (y2 - y) ** 2);
                    });
                    for (let i = 0; i < AIs.length; ++i) {
                        if ((AIs[i].state !== 3) && ((AIs[i].owner.relationsData.values.team === camera.relationsData.values.team && AIs[i].isClaimable) || this.accessLevel === 3)) {
                            if (!this.possess(AIs[i]))
                                continue;
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
            case 6:
                if (!config.enableCommands)
                    return;
                const cmd = r.stringNT();
                const argsLength = r.u8();
                const args = [];
                for (let i = 0; i < argsLength; ++i) {
                    args.push(r.stringNT());
                }
                (0, Commands_1.executeCommand)(this, cmd, args);
                return;
            default:
                util.log("Sus activies have been evaded");
                return this.ban();
        }
    }
    setHasCheated(value) {
        const player = this.camera?.cameraData.values.player;
        if (player && player.nameData) {
            if (value)
                player.nameData.flags |= 2;
            else
                player.nameData.flags &= ~2;
        }
        this.devCheatsUsed = value;
    }
    hasCheated() {
        return this.devCheatsUsed;
    }
    possess(ai) {
        if (!this.camera?.cameraData || ai.state === 3)
            return false;
        this.inputs.deleted = true;
        ai.inputs = this.inputs = new ClientInputs(this);
        this.inputs.isPossessing = true;
        ai.state = 3;
        if (this.camera?.cameraData.values.player instanceof Object_1.default) {
            const color = this.camera.cameraData.values.player.styleData.values.color;
            this.camera.cameraData.values.player.styleData.values.color = -1;
            this.camera.cameraData.values.player.styleData.color = color;
        }
        this.camera.cameraData.tankOverride = ai.owner.nameData?.values.name || "";
        this.camera.cameraData.tank = 53;
        for (let i = 0; i < Enums_1.StatCount; ++i)
            this.camera.cameraData.statLevels[i] = 0;
        for (let i = 0; i < Enums_1.StatCount; ++i)
            this.camera.cameraData.statLimits[i] = 7;
        for (let i = 0; i < Enums_1.StatCount; ++i)
            this.camera.cameraData.statNames[i] = "";
        this.camera.cameraData.killedBy = "";
        this.camera.cameraData.player = ai.owner;
        this.camera.cameraData.movementSpeed = ai.movementSpeed;
        if (ai.owner instanceof TankBody_1.default) {
            this.camera.cameraData.tank = ai.owner.cameraEntity.cameraData.values.tank;
            this.camera.setLevel(ai.owner.cameraEntity.cameraData.values.level);
            for (let i = 0; i < Enums_1.StatCount; ++i)
                this.camera.cameraData.statLevels[i] = ai.owner.cameraEntity.cameraData.statLevels.values[i];
            for (let i = 0; i < Enums_1.StatCount; ++i)
                this.camera.cameraData.statLimits[i] = ai.owner.cameraEntity.cameraData.statLimits.values[i];
            for (let i = 0; i < Enums_1.StatCount; ++i)
                this.camera.cameraData.statNames[i] = ai.owner.cameraEntity.cameraData.statNames.values[i];
            this.camera.cameraData.FOV = ai.owner.cameraEntity.cameraData.FOV;
        }
        else if (ai.owner instanceof AbstractBoss_1.default) {
            this.camera.setLevel(75);
            this.camera.cameraData.FOV = 0.35;
        }
        else {
            this.camera.setLevel(30);
        }
        this.camera.cameraData.statsAvailable = 0;
        this.camera.cameraData.score = 0;
        return true;
    }
    notify(text, color = 0x000000, time = 4000, id = "") {
        this.write().u8(3).stringNT(text).u32(color).float(time).stringNT(id).send();
    }
    notifypeepeepoopoo() {
        this.write().u8(12).send();
    }
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
    ban() {
        util.saveToLog("IP Banned", "Banned ||`" + JSON.stringify(this.ipAddress) + "`|| (<@" + this.discordId + ">) across all servers... " + this.toString(true), 0xEE326A);
        if (this.accessLevel >= config.unbannableLevelMinimum) {
            util.saveToLog("IP Ban Cancelled", "Cancelled ban on ||`" + JSON.stringify(this.ipAddress) + "`|| (<@" + this.discordId + ">) across all servers." + this.toString(true), 0x6A32EE);
            return;
        }
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
        for (let header = 0; header <= 9; ++header) {
            if (header === 5)
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
            this.camera.cameraData.player = null;
            this.camera.cameraData.respawnLevel = 0;
            this.camera.cameraData.cameraX = this.camera.cameraData.cameraY = 0;
            this.camera.cameraData.flags &= ~2;
        }
        if (tick >= this.lastPingTick + 60 * config.tps) {
            return this.terminate();
        }
    }
    toString(verbose = false) {
        const tokens = [];
        if (this.discordId)
            tokens.push("disc=<@" + this.discordId + ">");
        if (this.camera?.cameraData?.player?.nameData?.name)
            tokens.push("name=" + JSON.stringify(this.camera?.cameraData?.player?.nameData?.name));
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
