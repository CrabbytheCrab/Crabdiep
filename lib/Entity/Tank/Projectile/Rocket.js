"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Barrel");
const Bullet_1 = require("./Bullet");
const AI_1 = require("../../AI");
const RocketBarrelDefinition = {
    angle: Math.PI,
    offset: 0,
    size: 70,
    width: 54.239,
    delay: 0,
    reload: 0.15,
    recoil: 0,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.3,
        damage: 0.6,
        speed: 1.5,
        scatterRate: 5,
        lifeLength: 0.1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const RocketBarrelDefinition2 = {
    angle: Math.PI,
    offset: 0,
    size: 0,
    width: 0,
    delay: 0,
    reload: 0.15,
    recoil: 4,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0,
        damage: 0,
        speed: 0,
        scatterRate: 0,
        lifeLength: 0,
        sizeRatio: 0,
        absorbtionFactor: 0
    }
};
class Rocket extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.reloadTime = 1;
        this.inputs = new AI_1.Inputs();
        this.cameraEntity = tank.cameraEntity;
        this.sizeFactor = this.physicsData.values.size / 50;
        const rocketBarrel = this.rocketBarrel = new Barrel_1.default(this, { ...RocketBarrelDefinition });
        const rocketBarrel2 = this.rocketBarrel = new Barrel_1.default(this, { ...RocketBarrelDefinition2 });
        rocketBarrel.styleData.values.color = this.styleData.values.color;
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
exports.default = Rocket;
