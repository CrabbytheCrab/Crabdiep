"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Barrel");
const AI_1 = require("../../AI");
const HomingBullet_1 = require("./HomingBullet");
const RocketBarrelDefinition = {
    angle: Math.PI,
    offset: 0,
    size: 70,
    width: 37.8,
    delay: 0,
    reload: 0.5,
    recoil: 5,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.6,
        damage: 0.8,
        speed: 0.8,
        scatterRate: 1,
        lifeLength: 0.5,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
class Seakingrocket extends HomingBullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.reloadTime = 1;
        this.inputs = new AI_1.Inputs();
        this.cameraEntity = tank.cameraEntity;
        this.sizeFactor = this.physicsData.values.size / 50;
        const launrocketBarrel = this.launrocketBarrel = new Barrel_1.default(this, { ...RocketBarrelDefinition });
        launrocketBarrel.styleData.values.color = this.styleData.values.color;
    }
    tick(tick) {
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;
        super.tick(tick);
        if (this.deletionAnimation)
            return;
        if (tick - this.spawnTick >= this.tank.reloadTime)
            this.inputs.flags |= 1;
    }
}
exports.default = Seakingrocket;
