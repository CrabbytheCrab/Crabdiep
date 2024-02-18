"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Barrel");
const Drone_1 = require("./Drone");
const AI_1 = require("../../AI");
const AutoTurret_1 = require("../AutoTurret");
const MinionBarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 80,
    width: 50.4,
    delay: 0,
    reload: 1,
    recoil: 1.35,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.4,
        damage: 0.4,
        speed: 0.8,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const MinionBarrelDrone = {
    angle: Math.PI,
    offset: 0,
    size: 70,
    width: 42,
    delay: 0,
    reload: 4.5,
    recoil: 1,
    isTrapezoid: true,
    trapezoidDirection: 0,
    droneCount: 2,
    canControlDrones: false,
    addon: null,
    bullet: {
        type: "drone",
        health: 0.7,
        damage: 0.5,
        speed: 0.8,
        scatterRate: 1,
        lifeLength: -1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const MinionBarrelDefinition2 = {
    angle: 3.141592653589793,
    offset: 0,
    size: 73,
    width: 35,
    delay: 0.35,
    reload: 5,
    recoil: 0,
    droneCount: 2,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    canControlDrones: false,
    bullet: {
        type: "drone",
        health: 1.25,
        damage: 0.4,
        speed: 0.9,
        scatterRate: 1,
        lifeLength: -1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const MinionBarrelDefinition3 = {
    angle: 1.0471975511965976,
    offset: 0,
    size: 73,
    width: 35,
    delay: 0.35,
    reload: 5,
    recoil: 0,
    droneCount: 2,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    canControlDrones: false,
    bullet: {
        type: "drone",
        health: 1.25,
        damage: 0.4,
        speed: 0.9,
        scatterRate: 1,
        lifeLength: -1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const MinionBarrelDefinition4 = {
    angle: -1.0471975511965976,
    offset: 0,
    size: 73,
    width: 35,
    delay: 0.35,
    reload: 5,
    recoil: 0,
    droneCount: 2,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    canControlDrones: false,
    bullet: {
        type: "drone",
        health: 1.25,
        damage: 0.4,
        speed: 0.9,
        scatterRate: 1,
        lifeLength: -1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
class Minion extends Drone_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.reloadTime = 1;
        this.inputs = new AI_1.Inputs();
        this.idx = null;
        if (tankDefinition) {
            this.idx = tankDefinition.id;
        }
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
        this.sizeFactor = this.physicsData.values.size / 50;
        this.cameraEntity = tank.cameraEntity;
        if (tankDefinition && tankDefinition.id === 176) {
            const atuo = new AutoTurret_1.default(this, {
                angle: 0,
                offset: 0,
                size: 62,
                width: 35,
                delay: 0.01,
                reload: 5.5,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1,
                    damage: 0.8,
                    speed: 1.3,
                    scatterRate: 0.3,
                    lifeLength: 1,
                    absorbtionFactor: 0.1
                }
            });
            atuo.baseSize *= 1.15;
            this.minionBarrel = new Barrel_1.default(this, MinionBarrelDefinition2);
            this.minionBarrel = new Barrel_1.default(this, MinionBarrelDefinition3);
            this.minionBarrel = new Barrel_1.default(this, MinionBarrelDefinition4);
        }
        else {
            this.minionBarrel = new Barrel_1.default(this, MinionBarrelDefinition);
            if (tankDefinition && tankDefinition.id === 269) {
                this.minionBarrel = new Barrel_1.default(this, MinionBarrelDrone);
            }
        }
        this.ai.movementSpeed = this.ai.aimSpeed = this.baseAccel;
    }
    tickMixin(tick) {
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;
        if (this.idx === 176) {
            this.positionData.values.angle += 0.1;
        }
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
