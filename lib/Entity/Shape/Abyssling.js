"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractShape_1 = require("./AbstractShape");
const util = require("../../util");
const AI_1 = require("../AI");
const config_1 = require("../../config");
const TankBody_1 = require("../Tank/TankBody");
const Object_1 = require("../Object");
const Barrel_1 = require("../Tank/Barrel");
const AutoTurret_1 = require("../Tank/AutoTurret");
const GuardianSpawnerDefinition = {
    angle: 0,
    offset: 0,
    size: 135,
    width: 42 * 1.4,
    delay: 0,
    reload: 12,
    recoil: 1,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        sizeRatio: 1,
        health: 5,
        damage: 15,
        speed: 0.75,
        scatterRate: 1,
        lifeLength: 3,
        absorbtionFactor: 1
    }
};
const GuardianSpawnerDefinition2 = {
    angle: Math.PI,
    offset: 0,
    size: 70,
    width: 42 * 1.2,
    delay: 0,
    reload: 15,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: "trapLauncher",
    canControlDrones: true,
    bullet: {
        type: "trap",
        sizeRatio: 1,
        health: 40,
        damage: 1.2,
        speed: 1,
        scatterRate: 1,
        lifeLength: 8,
        absorbtionFactor: 0.5
    }
};
class Abyssling extends AbstractShape_1.default {
    constructor(game) {
        super(game);
        this.cameraEntity = this;
        this.reloadTime = 4;
        this.barrel = [];
        this.nameData.values.name = "Abyssling";
        this.healthData.values.health = this.healthData.values.maxHealth = 4500;
        this.physicsData.values.size = 140 * Math.SQRT1_2;
        this.physicsData.values.sides = 1;
        this.physicsData.values.absorbtionFactor = 0.1;
        this.physicsData.values.pushFactor = 12;
        this.sizeFactor = this.physicsData.values.size / 50;
        this.styleData.values.color = 12;
        this.noMultiplier = true;
        this.scoreReward = 20000;
        this.damagePerTick = 14;
        this.targettingSpeed = 0.65;
        this.ai = new AI_1.AI(this);
        this.ai.viewRange = 2000;
        this.ai.aimSpeed = (this.ai.movementSpeed = this.targettingSpeed);
        this.ai['_findTargetInterval'] = config_1.tps;
        this.inputs = this.ai.inputs;
        const size = this.physicsData.values.size;
        const pronounce = new Object_1.default(this.game);
        pronounce.setParent(this);
        pronounce.relationsData.values.owner = this;
        pronounce.relationsData.values.team = this.relationsData.values.team;
        pronounce.physicsData.values.size = size * 1.1;
        pronounce.styleData.values.color = 0;
        pronounce.physicsData.values.sides = 6;
        const tickBase = pronounce.tick;
        pronounce.tick = (tick) => {
            const size = this.physicsData.values.size;
            pronounce.physicsData.size = size * 1.1;
            pronounce.positionData.angle = Math.PI / 2;
            tickBase.call(pronounce, tick);
        };
        const pronounce2 = new Object_1.default(this.game);
        pronounce2.setParent(this);
        pronounce2.relationsData.values.owner = this;
        pronounce2.relationsData.values.team = this.relationsData.values.team;
        pronounce2.styleData.flags |= 64;
        pronounce2.physicsData.values.size = size;
        pronounce2.styleData.values.color = this.styleData.color;
        pronounce2.physicsData.values.sides = 6;
        const tickBase2 = pronounce2.tick;
        pronounce2.tick = (tick) => {
            const size = this.physicsData.values.size;
            pronounce2.physicsData.size = size;
            pronounce2.positionData.angle = Math.PI / 2;
            tickBase2.call(pronounce2, tick);
        };
        const pronounce3 = new Object_1.default(this.game);
        pronounce3.setParent(this);
        pronounce3.relationsData.values.owner = this;
        pronounce3.relationsData.values.team = this.relationsData.values.team;
        pronounce3.styleData.flags |= 64;
        pronounce3.physicsData.values.size = this.physicsData.values.size * 0.8;
        pronounce3.styleData.values.color = 0;
        pronounce3.physicsData.values.sides = 6;
        const tickBase3 = pronounce3.tick;
        pronounce3.tick = (tick) => {
            const size = this.physicsData.values.size * 0.8;
            pronounce3.positionData.angle = Math.PI / 2;
            pronounce3.physicsData.size = size;
            tickBase3.call(pronounce3, tick);
        };
        const pronounce4 = new Object_1.default(this.game);
        pronounce4.setParent(this);
        pronounce4.relationsData.values.owner = this;
        pronounce4.relationsData.values.team = this.relationsData.values.team;
        pronounce4.physicsData.values.size = size;
        pronounce4.styleData.flags |= 64;
        pronounce4.styleData.values.color = this.styleData.color;
        pronounce4.physicsData.values.sides = 6;
        const tickBase4 = pronounce4.tick;
        pronounce4.tick = (tick) => {
            const size = this.physicsData.values.size;
            pronounce4.physicsData.size = size * 0.7;
            pronounce4.positionData.angle = Math.PI / 2;
            tickBase4.call(pronounce4, tick);
        };
        for (let i = 0; i < 3; ++i) {
            this.barrel.push(new Barrel_1.default(this, {
                ...GuardianSpawnerDefinition2,
                angle: util.PI2 * ((i / 3) - 1 / 6)
            }));
        }
        for (let i = 0; i < 2; ++i) {
            this.barrel.push(new Barrel_1.default(this, {
                ...GuardianSpawnerDefinition2,
                angle: util.PI2 * (((i + 1) / 3))
            }));
        }
        this.barrel.push(new Barrel_1.default(this, GuardianSpawnerDefinition));
        const atuo = new AutoTurret_1.default(this, {
            angle: 0,
            offset: 0,
            size: 80,
            width: 42 * 0.9,
            delay: 0,
            reload: 3,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "bullet",
                sizeRatio: 1,
                health: 5,
                damage: 3,
                speed: 2,
                scatterRate: 0.3,
                lifeLength: 1,
                absorbtionFactor: 0.1,
            }
        });
        atuo.ai.viewRange = 1200;
        atuo.baseSize *= 1.2;
    }
    tick(tick) {
        this.ai.aimSpeed = 0;
        this.ai.movementSpeed = this.targettingSpeed;
        if (this.ai.state === 0) {
            this.doIdleRotate = true;
        }
        else {
            this.doIdleRotate = false;
            this.positionData.angle = Math.atan2(this.ai.inputs.mouse.y - this.positionData.values.y, this.ai.inputs.mouse.x - this.positionData.values.x);
            this.accel.add({
                x: this.ai.inputs.movement.x * this.targettingSpeed,
                y: this.ai.inputs.movement.y * this.targettingSpeed
            });
        }
        this.ai.inputs.movement.set({
            x: 0,
            y: 0
        });
        super.tick(tick);
    }
    onKill(entity) {
        if (entity instanceof TankBody_1.default) {
            this.scoreReward += entity.cameraEntity.cameraData.score / 2;
        }
        else {
            this.scoreReward += entity.scoreReward;
        }
    }
}
exports.default = Abyssling;
