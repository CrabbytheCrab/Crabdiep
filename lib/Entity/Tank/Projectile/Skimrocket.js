"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Barrel");
const Bullet_1 = require("./Bullet");
const AI_1 = require("../../AI");
const RocketBarrelDefinition = {
    angle: 2.6179938779914944,
    offset: 0,
    size: 70,
    width: 42,
    delay: 0,
    reload: 0.5,
    recoil: 4.5,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.4,
        damage: 3 / 5,
        speed: 1,
        scatterRate: 1,
        lifeLength: 0.4,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const RocketBarrelDefinition2 = {
    angle: 3.665191429188092,
    offset: 0,
    size: 70,
    width: 42,
    delay: 0,
    reload: 0.5,
    recoil: 4.5,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.4,
        damage: 3 / 5,
        speed: 1,
        scatterRate: 1,
        lifeLength: 0.4,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
class Launrocket extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.reloadTime = 1;
        this.inputs = new AI_1.Inputs();
        this.cameraEntity = tank.cameraEntity;
        this.sizeFactor = this.physicsData.values.size / 50;
        const skimmerBarrels = this.launrocketBarrel = [];
        const s1 = new class extends Barrel_1.default {
            resize() {
                super.resize();
                this.physicsData.values.width = this.definition.width;
            }
        }(this, { ...RocketBarrelDefinition });
        const s2 = new class extends Barrel_1.default {
            resize() {
                super.resize();
                this.physicsData.width = this.definition.width;
            }
        }(this, RocketBarrelDefinition2);
        s1.styleData.values.color = this.styleData.values.color;
        s2.styleData.values.color = this.styleData.values.color;
        skimmerBarrels.push(s1, s2);
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
exports.default = Launrocket;
