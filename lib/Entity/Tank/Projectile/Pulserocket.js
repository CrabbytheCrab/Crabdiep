"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Barrel");
const Bullet_1 = require("./Bullet");
const AI_1 = require("../../AI");
const RocketBarrelDefinition = {
    angle: Math.PI,
    offset: 0,
    size: 70,
    width: 33.6,
    delay: 0,
    reload: 0.75,
    recoil: 10,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "pulsar",
        health: 0.75,
        damage: 0.5,
        speed: 1.25,
        scatterRate: 4,
        lifeLength: 2,
        sizeRatio: 1.5,
        absorbtionFactor: 1
    }
};
class Pulserocket extends Bullet_1.default {
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
exports.default = Pulserocket;
