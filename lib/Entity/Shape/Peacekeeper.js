"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractShape_1 = require("./AbstractShape");
const AI_1 = require("../AI");
const config_1 = require("../../config");
const TankBody_1 = require("../Tank/TankBody");
const Object_1 = require("../Object");
const Barrel_1 = require("../Tank/Barrel");
const AutoTurret_1 = require("../Tank/AutoTurret");
const GuardianSpawnerDefinition = {
    angle: 0,
    offset: 0,
    size: 105,
    width: 42 * 1.2,
    delay: 0,
    reload: 9,
    recoil: 1,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        sizeRatio: 1,
        health: 1.5,
        damage: 15,
        speed: 1.5,
        scatterRate: 0.3,
        lifeLength: 1,
        absorbtionFactor: 0.5
    }
};
const GuardianSpawnerDefinition2 = {
    angle: Math.PI,
    offset: 0,
    size: 70,
    width: 42 * 1.2,
    delay: 0,
    reload: 0.5,
    recoil: 1,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        sizeRatio: 1,
        health: 1.5,
        damage: 1.5,
        speed: 2,
        scatterRate: 3,
        lifeLength: 0.2,
        absorbtionFactor: 1
    }
};
class Peacekeeper extends AbstractShape_1.default {
    constructor(game) {
        super(game);
        this.cameraEntity = this;
        this.reloadTime = 4;
        this.barrel = [];
        this.nameData.values.name = "Peacekeeper";
        this.healthData.values.health = this.healthData.values.maxHealth = 500;
        this.physicsData.values.size = 90 * Math.SQRT1_2;
        this.physicsData.values.sides = 3;
        this.physicsData.values.absorbtionFactor = 0.1;
        this.physicsData.values.pushFactor = 12;
        this.sizeFactor = this.physicsData.values.size / 50;
        this.styleData.values.color = 12;
        this.noMultiplier = true;
        this.scoreReward = 6000;
        this.damagePerTick = 8;
        this.targettingSpeed = 1;
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
        pronounce.physicsData.values.size = size * 1.25;
        pronounce.styleData.values.color = 0;
        pronounce.physicsData.values.sides = 3;
        const tickBase = pronounce.tick;
        pronounce.tick = (tick) => {
            const size = this.physicsData.values.size;
            pronounce.physicsData.size = size * 1.25;
            tickBase.call(pronounce, tick);
        };
        this.barrel.push(new Barrel_1.default(this, GuardianSpawnerDefinition));
        this.barrel.push(new Barrel_1.default(this, GuardianSpawnerDefinition2));
        const pronounce2 = new Object_1.default(this.game);
        const sizeRatio = 65 / 50;
        const widthRatio = (42 * 1.2) / 50;
        const offsetRatio = 20 / 50;
        pronounce2.setParent(this);
        pronounce2.relationsData.values.owner = this;
        pronounce2.relationsData.values.team = this.relationsData.values.team;
        pronounce2.physicsData.values.size = sizeRatio * size;
        pronounce2.physicsData.values.width = widthRatio * size;
        pronounce2.positionData.values.x = offsetRatio * size;
        pronounce2.positionData.values.angle = Math.PI;
        pronounce2.styleData.values.color = 1;
        pronounce2.physicsData.values.flags |= 1;
        pronounce2.physicsData.values.sides = 2;
        pronounce2.tick = () => {
            const size = this.physicsData.values.size;
            pronounce2.physicsData.size = sizeRatio * size;
            pronounce2.physicsData.width = widthRatio * size;
            pronounce2.positionData.x = offsetRatio * size;
        };
        const atuo = new AutoTurret_1.default(this, {
            angle: 0,
            offset: 0,
            size: 70,
            width: 42 * 0.85,
            delay: 0,
            reload: 3,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "bullet",
                sizeRatio: 1,
                health: 2,
                damage: 3,
                speed: 2,
                scatterRate: 0.3,
                lifeLength: 1,
                absorbtionFactor: 0.1,
            }
        });
        atuo.ai.viewRange = 2000;
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
exports.default = Peacekeeper;
