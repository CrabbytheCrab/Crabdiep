"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Barrel");
const Drone_1 = require("./Drone");
const AI_1 = require("../../AI");
const MinionBarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 100,
    width: 42,
    delay: 0,
    reload: 3,
    recoil: 1.35,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 2,
        damage: 3.5,
        speed: 3,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 0.4
    }
};
const MinionBarrelDefinition2 = {
    angle: -0.39269908169872414,
    offset: 0,
    size: 90,
    width: 42,
    delay: 0.5,
    reload: 3,
    recoil: 1.35,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 2,
        damage: 3.5,
        speed: 3,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 0.4
    }
};
const MinionBarrelDefinition3 = {
    angle: 0.39269908169872414,
    offset: 0,
    size: 90,
    width: 42,
    delay: 0.5,
    reload: 3,
    recoil: 1.35,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 2,
        damage: 3.5,
        speed: 3,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 0.4
    }
};
const MinionBarrelDefinition4 = {
    angle: 0,
    offset: -26,
    size: 90,
    width: 46.2,
    delay: 0,
    reload: 1,
    recoil: 0.65,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.35,
        damage: 0.3,
        speed: 1,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const MinionBarrelDefinition5 = {
    angle: 0,
    offset: 26,
    size: 90,
    width: 46.2,
    delay: 0.5,
    reload: 1,
    recoil: 0.65,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.35,
        damage: 0.3,
        speed: 1,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const MinionBarrelDefinition6 = {
    angle: 0.39269908169872414,
    offset: 0,
    size: 80,
    width: 46.2,
    delay: 0.5,
    reload: 1,
    recoil: 0.65,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.4,
        damage: 0.325,
        speed: 1,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
class Minion extends Drone_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.reloadTime = 1;
        this.inputs = new AI_1.Inputs();
        const bulletDefinition = barrel.definition.bullet;
        this.inputs = this.ai.inputs;
        this.ai.viewRange = 900;
        this.usePosAngle = false;
        this.physicsData.values.sides = bulletDefinition.sides ?? 1;
        this.physicsData.values.size *= 1.2;
        if (this.physicsData.values.flags & 8)
            this.physicsData.values.flags ^= 8;
        if (this.physicsData.values.flags & 256)
            this.physicsData.values.flags ^= 256;
        this.physicsData.values.flags |= 32;
        this.megaturret = typeof this.barrelEntity.definition.megaturret === 'boolean' && this.barrelEntity.definition.megaturret;
        this.sizeFactor = this.physicsData.values.size / 50;
        this.cameraEntity = tank.cameraEntity;
        if (this.megaturret) {
            this.minionBarrel = new Barrel_1.default(this, MinionBarrelDefinition5);
            this.minionBarrel = new Barrel_1.default(this, MinionBarrelDefinition4);
        }
        else {
            this.minionBarrel = new Barrel_1.default(this, MinionBarrelDefinition3);
            this.minionBarrel = new Barrel_1.default(this, MinionBarrelDefinition2);
            this.minionBarrel = new Barrel_1.default(this, MinionBarrelDefinition);
        }
        this.ai.movementSpeed = this.ai.aimSpeed = this.baseAccel;
    }
    tickMixin(tick) {
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;
        const usingAI = !this.canControlDrones || !this.tank.inputs.attemptingShot() && !this.tank.inputs.attemptingRepel();
        const inputs = !usingAI ? this.tank.inputs : this.ai.inputs;
        if (usingAI && this.ai.state === 0) {
            this.movementAngle = this.positionData.values.angle;
        }
        else {
            this.inputs.flags |= 1;
            const dist = inputs.mouse.distanceToSQ(this.positionData.values);
            if (dist < Minion.FOCUS_RADIUS / 4) {
                this.movementAngle = this.positionData.values.angle + Math.PI;
            }
            else if (dist < Minion.FOCUS_RADIUS) {
                this.movementAngle = this.positionData.values.angle;
            }
            else
                this.movementAngle = this.positionData.values.angle;
        }
        super.tickMixin(tick);
    }
}
exports.default = Minion;
Minion.FOCUS_RADIUS = 850 ** 2;
