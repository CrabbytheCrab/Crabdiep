"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Barrel");
const AI_1 = require("../../AI");
const Orbit_1 = require("./Orbit");
const RocketBarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 85,
    width: 50.4,
    delay: 0,
    reload: 1,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.55,
        damage: 0.5,
        speed: 1,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
class Orbitrocket extends Orbit_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle, mode, parent) {
        super(barrel, tank, tankDefinition, shootAngle, mode);
        this.reloadTime = 1;
        this.inputs = new AI_1.Inputs();
        this.change = true;
        this.parent = parent ?? tank;
        this.cameraEntity = tank.cameraEntity;
        this.sizeFactor = this.physicsData.values.size / 50;
        this.launrocketBarrel = new Barrel_1.default(this, { ...RocketBarrelDefinition });
    }
    tick(tick) {
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;
        super.tick(tick);
        if (!this.fire) {
            this.positionData.angle = Math.atan2(this.tank.inputs.mouse.y - this.positionData.y, this.tank.inputs.mouse.x - this.positionData.x);
        }
        else {
            this.positionData.angle = this.movementAngle + Math.PI;
        }
        if (this.deletionAnimation)
            return;
        if (!this.fire && this.tank.inputs.attemptingShot()) {
            this.inputs.flags |= 1;
        }
        else if (!this.fire && !this.tank.inputs.attemptingShot()) {
            if (this.inputs.flags && this.inputs.flags == 1)
                this.inputs.flags ^= 1;
        }
        else {
            this.inputs.flags |= 1;
        }
    }
}
exports.default = Orbitrocket;
