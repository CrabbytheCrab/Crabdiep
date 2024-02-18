"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Tank/Barrel");
const AbstractBoss_1 = require("./AbstractBoss");
const Live_1 = require("../Live");
const Entity_1 = require("../../Native/Entity");
let GuardianSpawnerDefinition = {
    angle: Math.PI / 6 * 4.5,
    offset: 0,
    size: 80,
    width: 42,
    delay: 0,
    reload: 0.25,
    recoil: 1,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    forceFire: false,
    inverseFire: true,
    bullet: {
        type: "bullet",
        sizeRatio: 0.8,
        health: 5,
        damage: 4,
        speed: 1,
        scatterRate: 3,
        lifeLength: 0.25,
        absorbtionFactor: 1
    }
};
let GuardianSpawnerDefinition2 = {
    angle: -Math.PI / 6 * 4.5,
    offset: 0,
    size: 80,
    width: 42,
    delay: 0,
    reload: 0.25,
    recoil: 1,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    forceFire: false,
    inverseFire: true,
    bullet: {
        type: "bullet",
        sizeRatio: 0.8,
        health: 5,
        damage: 4,
        speed: 1,
        scatterRate: 3,
        lifeLength: 0.25,
        absorbtionFactor: 1
    }
};
let GuardianSpawnerDefinition3 = {
    angle: -Math.PI / 6 * 5,
    offset: 0,
    size: 0,
    width: 42,
    delay: 0,
    reload: 0.25,
    recoil: 1,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    forceFire: false,
    inverseFire: true,
    droneCount: 0,
    bullet: {
        type: "drone",
        sizeRatio: 1.75,
        health: 10,
        damage: 3,
        speed: 1.5,
        scatterRate: 0,
        lifeLength: 4,
        absorbtionFactor: 2
    }
};
const DEFENDER_SIZE = 200;
class Basher extends AbstractBoss_1.default {
    constructor(game) {
        super(game);
        this.physicsData.values.size = DEFENDER_SIZE * Math.SQRT1_2;
        this.attackAmount = 0;
        this.timer = 0;
        this.rand = 0;
        this.state = 0;
        this.attacktimer = 0;
        this.nameData.values.name = 'Basher';
        this.styleData.color = 12;
        this.healthData.values.health = this.healthData.values.maxHealth = 3000;
        this.scoreReward = 45000 * this.game.arena.shapeScoreRewardMultiplier;
        this.physicsData.sides = 1;
        this.relationsData.values.team = this.game.arena;
        const size = this.physicsData.values.size;
        this.movementSpeed = 1.5;
        const pronounced = new Live_1.default(this.game);
        this.physicsData.absorbtionFactor = 0;
        pronounced.styleData.flags |= 128;
        this.customMovement = true;
        this.barrels.push(new Barrel_1.default(this, GuardianSpawnerDefinition));
        this.barrels.push(new Barrel_1.default(this, GuardianSpawnerDefinition2));
        this.barrels.push(new Barrel_1.default(this, GuardianSpawnerDefinition3));
        pronounced.relationsData.values.team = this.relationsData.values.team;
        pronounced.physicsData.values.size = size;
        pronounced.damagePerTick = 100;
        pronounced.damageReduction = 0;
        pronounced.physicsData.pushFactor = 40;
        pronounced.styleData.values.color = 0;
        pronounced.physicsData.values.sides = 6;
        pronounced.positionData.values.x = size * 1.2;
        const tickBase = pronounced.tick;
        pronounced.tick = (tick) => {
            const size = this.physicsData.values.size;
            pronounced.physicsData.size = size;
            pronounced.positionData.y = this.positionData.y + (size * Math.sin(this.positionData.angle) * 1.2);
            pronounced.positionData.x = this.positionData.x + (size * Math.cos(this.positionData.angle) * 1.2);
            pronounced.positionData.angle = this.positionData.angle;
            pronounced.styleData.zIndex = this.styleData.zIndex + 1;
            pronounced.styleData.opacity = this.styleData.opacity;
            if (!Entity_1.Entity.exists(this))
                pronounced.delete();
            tickBase.call(pronounced, tick);
        };
    }
    shortAngleDist(a0, a1) {
        var max = Math.PI * 2;
        var da = (a1 - a0) % max;
        return 2 * da % max - da;
    }
    Attack() {
        this.timer++;
        if (this.timer <= 45) {
            this.inputs.flags |= 128;
            this.inputs.movement.x = Math.cos(this.positionData.angle);
            this.inputs.movement.y = Math.sin(this.positionData.angle);
            this.accel.add({
                x: this.inputs.movement.x * this.movementSpeed * 5,
                y: this.inputs.movement.y * this.movementSpeed * 5,
            });
        }
        if (this.timer > 45) {
            if (this.inputs.flags & 128)
                this.inputs.flags ^= 128;
        }
        if (this.timer == 180) {
            this.timer = 0;
            this.state = 0;
        }
    }
    megaAttack() {
        this.timer++;
        if (this.timer == 1)
            this.rand = Math.PI / 6 * (Math.random() - 0.5);
        if (this.timer < 15) {
            const x = this.positionData.values.x, y = this.positionData.values.y;
            this.positionData.angle = this.angleLerp(this.positionData.angle, Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x) + this.rand, 0.2);
        }
        if (this.timer <= 45 && this.timer >= 15) {
            this.inputs.flags |= 128;
            this.inputs.movement.x = Math.cos(this.positionData.angle);
            this.inputs.movement.y = Math.sin(this.positionData.angle);
            this.accel.add({
                x: this.inputs.movement.x * this.movementSpeed * 5,
                y: this.inputs.movement.y * this.movementSpeed * 5,
            });
        }
        if (this.timer > 45) {
            if (this.inputs.flags & 128)
                this.inputs.flags ^= 128;
        }
        if (this.timer >= 60 && this.attackAmount <= 8) {
            this.timer = 0;
            this.attackAmount++;
        }
        if (this.timer >= 180 && this.attackAmount >= 8) {
            this.timer = 0;
            this.attackAmount = 0;
            this.state = 0;
        }
    }
    megaAttackAlt() {
        this.timer++;
        if (this.timer < 15) {
            const x = this.positionData.values.x, y = this.positionData.values.y;
            this.positionData.angle = this.angleLerp(this.positionData.angle, Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x), 0.2);
        }
        if (this.timer <= 45) {
            this.inputs.flags |= 128;
            this.inputs.movement.x = Math.cos(this.positionData.angle);
            this.inputs.movement.y = Math.sin(this.positionData.angle);
            this.accel.add({
                x: this.inputs.movement.x * this.movementSpeed * 5,
                y: this.inputs.movement.y * this.movementSpeed * 5,
            });
        }
        if (this.timer > 45) {
            if (this.inputs.flags & 128)
                this.inputs.flags ^= 128;
        }
        if (this.timer >= 45 && this.attackAmount <= 16) {
            this.timer = 0;
            this.attackAmount++;
        }
        if (this.timer >= 120 && this.attackAmount >= 16) {
            this.timer = 0;
            this.attackAmount = 0;
            this.state = 0;
        }
    }
    angleLerp(a0, a1, t) {
        return a0 + this.shortAngleDist(a0, a1) * t;
    }
    moveAroundMap() {
        if (this.state == 2) {
            this.timer++;
            this.attacktimer = 0;
            if (this.timer <= 30) {
                const x = this.positionData.values.x, y = this.positionData.values.y;
                this.positionData.angle = this.angleLerp(this.positionData.angle, Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x), 0.2);
            }
            if (this.timer >= 30) {
                this.inputs.movement.x = Math.cos(this.positionData.angle);
                this.inputs.movement.y = Math.sin(this.positionData.angle);
                this.accel.add({
                    x: this.inputs.movement.x * this.movementSpeed * -0.75,
                    y: this.inputs.movement.y * this.movementSpeed * -0.75,
                });
            }
            if (this.timer == 120) {
                this.timer = 0;
                this.state = 1;
            }
        }
        if (this.state == 3) {
            this.megaAttack();
        }
        if (this.state == 1) {
            this.Attack();
        }
        const x = this.positionData.values.x, y = this.positionData.values.y;
        if (this.ai.state === 0) {
            if (this.state == 0) {
                super.moveAroundMap();
                this.accel.add({
                    x: this.inputs.movement.x * this.movementSpeed,
                    y: this.inputs.movement.y * this.movementSpeed,
                });
                this.positionData.angle = Math.atan2(this.inputs.movement.y, this.inputs.movement.x);
            }
        }
        else {
            if (this.state == 0) {
                this.positionData.angle = this.angleLerp(this.positionData.angle, Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x), 0.2);
                this.inputs.movement.x = Math.cos(this.positionData.angle);
                this.inputs.movement.y = Math.sin(this.positionData.angle);
                this.accel.add({
                    x: this.inputs.movement.x * this.movementSpeed,
                    y: this.inputs.movement.y * this.movementSpeed,
                });
                this.timer++;
                if (this.timer == 300) {
                    this.timer = 0;
                    if (this.healthData.values.health <= this.healthData.values.maxHealth / 2) {
                        this.state = 3;
                    }
                    else {
                        this.state = 2;
                    }
                }
            }
        }
    }
    tick(tick) {
        super.tick(tick);
        this.sizeFactor = this.physicsData.values.size / 50;
    }
}
exports.default = Basher;
