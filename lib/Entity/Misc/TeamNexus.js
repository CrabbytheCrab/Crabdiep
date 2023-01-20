"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NexusShield = void 0;
const config_1 = require("../../config");
const Enums_1 = require("../../Const/Enums");
const Entity_1 = require("../../Native/Entity");
const FieldGroups_1 = require("../../Native/FieldGroups");
const Live_1 = require("../Live");
const TankBody_1 = require("../Tank/TankBody");
const TeamBase_1 = require("./TeamBase");
class Nexus extends Live_1.default {
    constructor(game, x, y, team, config, bases) {
        super(game);
        this.nameData = new FieldGroups_1.NameGroup(this);
        this.sacrifices = new Set();
        this.shield = new NexusShield(game, this, config.shield, config.size * 1.5);
        this.team = team;
        this.config = config;
        this.relationsData.team = team;
        this.base = new TeamBase_1.default(game, team, x, y, config.size * 10, config.size * 10, false);
        this.bases = bases;
        this.styleData.color = team.teamData.teamColor;
        this.styleData.zIndex = this.shield.styleData.zIndex + 1;
        this.healthData.maxHealth = config.health;
        this.healthData.health = config.health;
        this.healthData.flags |= 1;
        this.regenPerTick = 0;
        this.physicsData.absorbtionFactor = 0;
        this.physicsData.pushFactor = 5.0;
        this.physicsData.sides = 6;
        this.physicsData.size = this.config.size;
        this.physicsData.flags |= 16;
        this.positionData.x = x;
        this.positionData.y = y;
        this.scoreReward = 100000;
    }
    notifyShieldBroke() {
        if (this.game.arena.state !== 0)
            return;
        const nexusPos = this.getWorldPosition();
        for (const client of this.game.clients) {
            if (!client.camera)
                continue;
            if (!(client.camera.cameraData.player instanceof TankBody_1.default))
                continue;
            const tank = client.camera.cameraData.player;
            if (tank.relationsData.team === this.relationsData.team) {
                client.notify(`Your team's nexus has lost it's shield (${Math.round(this.healthData.health)} hp remaining)`);
            }
            else {
                client.notify(`The other team's nexus has lost it's shield!`);
                const pos = tank.getWorldPosition();
                if (Math.sqrt(pos.distanceToSQ(nexusPos)) > 7000)
                    continue;
                tank.addAcceleration(Math.atan2(pos.y - nexusPos.y, pos.x - nexusPos.x), 500);
                tank.applyPhysics();
            }
        }
    }
    sacrifice(client) {
        if (!client.camera || !Entity_1.Entity.exists(client.camera.cameraData.player) || !Entity_1.Entity.exists(this))
            return;
        if (!(client.camera.cameraData.player instanceof Live_1.default))
            return;
        if (this.sacrifices.has(client)) {
            client.notify("Sacificing stopped by player.", 0xFFA500, 2000, 'cant_claim_info');
            this.sacrifices.delete(client);
            return;
        }
        if (Math.sqrt(client.camera.cameraData.player.getWorldPosition().distanceToSQ(this.getWorldPosition())) > 3000) {
            client.notify("Unable to sacrifice to the nexus, out of reach.", 0xFFA500, 2000, 'cant_claim_info');
            return;
        }
        this.sacrifices.add(client);
        client.notify("Sacificing started, stay close to the nexus.", 0xFFA500, 2000, 'cant_claim_info');
    }
    updateShield() {
        if (!Entity_1.Entity.exists(this.shield))
            return;
        if (!this.shield.isBroken)
            return;
        if (this.shield.brokenTick + config_1.tps * 30 > this.game.tick)
            return;
        this.shield.revive();
    }
    onDeath(killer) {
        if (!Entity_1.Entity.exists(this))
            return;
        if (Entity_1.Entity.exists(this.shield))
            this.shield.delete();
        if (Entity_1.Entity.exists(this.base))
            this.base.delete();
        this.bases.forEach(e => e.setPainful(false));
        this.game.broadcast()
            .u8(3)
            .stringNT(`${killer.nameData?.name || "An unnamed tank"} has destroyed the ${this.relationsData.team.teamName} Nexus!`)
            .u32(killer.teamData ? Enums_1.ColorsHexCode[killer.teamData.teamColor] : 0x000000)
            .float(30000)
            .stringNT("").send();
    }
    tick(tick) {
        if (this.shield.isBroken)
            this.nameData.name = `Nexus Shield recovers in ${(30 - (this.game.tick - this.shield.brokenTick) / config_1.tps).toFixed(2)} seconds`;
        else
            this.nameData.name = `Nexus (${Math.round(this.healthData.health)} Health)`;
        this.positionData.angle = -(tick * 0.01);
        this.updateShield();
        this.lastDamageTick = tick;
        for (const sacrifice of this.sacrifices) {
            if (!sacrifice.camera
                || !Entity_1.Entity.exists(sacrifice.camera.cameraData.player)
                || !Entity_1.Entity.exists(this)
                || !(sacrifice.camera.cameraData.player instanceof Live_1.default)
                || Math.sqrt(sacrifice.camera.cameraData.player.getWorldPosition().distanceToSQ(this.getWorldPosition())) > 3000) {
                sacrifice.notify("Sacificing stopped.", 0xFFA500, 2000, 'cant_claim_info');
                this.sacrifices.delete(sacrifice);
                continue;
            }
            const entity = sacrifice.camera.cameraData.player;
            const target = [this.shield, this].filter(e => e.healthData.health < e.healthData.maxHealth)[0];
            if (!target)
                continue;
            entity.lastDamageTick = tick;
            target.healthData.health += entity.healthData.health * entity.damagePerTick / 8 * 0.005;
            entity.healthData.health -= entity.healthData.health * 0.005;
        }
        super.tick(tick);
    }
}
exports.default = Nexus;
class NexusShield extends Live_1.default {
    constructor(game, nexus, health, size) {
        super(game);
        this.isBroken = false;
        this.brokenTick = 0;
        this.nexus = nexus;
        this.healthData.maxHealth = health;
        this.healthData.health = health;
        this.healthData.flags |= 1;
        this.regenPerTick = health * 0.0001;
        this.styleData.color = 0;
        this.styleData.opacity = 1.0;
        this.physicsData.absorbtionFactor = 0.0;
        this.physicsData.pushFactor = 1.0;
        this.physicsData.flags |= 16;
        this.physicsData.sides = 6;
        this.physicsData.size = size;
        this.scoreReward = 10000;
    }
    revive() {
        this.isBroken = false;
        this.healthData.health = this.healthData.maxHealth * 0.333;
        this.physicsData.sides = 6;
        this.lastDamageTick = this.game.tick;
    }
    onDeath(killer) {
        if (this.isBroken)
            return;
        this.healthData.health = this.healthData.maxHealth * 0.333;
        this.physicsData.sides = 0;
        this.isBroken = true;
        this.brokenTick = this.game.tick;
        this.nexus.notifyShieldBroke();
    }
    tick(tick) {
        this.relationsData.team = this.nexus.relationsData.team;
        this.relationsData.owner = this.nexus;
        this.positionData.x = this.nexus.positionData.x;
        this.positionData.y = this.nexus.positionData.y;
        this.positionData.angle = tick * 0.01;
        this.styleData.opacity = this.healthData.health / this.healthData.maxHealth;
        super.tick(tick);
    }
}
exports.NexusShield = NexusShield;
