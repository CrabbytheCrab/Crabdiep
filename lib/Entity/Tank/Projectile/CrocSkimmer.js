"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Barrel");
const Bullet_1 = require("./Bullet");
const AI_1 = require("../../AI");
const CrocSkimmerBarrelDefinition = {
    angle: Math.PI / 2,
    offset: 0,
    size: 70,
    width: 42,
    delay: 0,
    reload: 0.5,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.3,
        damage: 3 / 5,
        speed: .2,
        scatterRate: 1,
        lifeLength: 0.25,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
class CrocSkimmer extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.reloadTime = 15;
        this.cameraEntity = tank.cameraEntity;
        this.sizeFactor = this.physicsData.values.size / 50;
        const skimmerBarrels = this.skimmerBarrels = [];
        const s1 = new Barrel_1.default(this, { ...CrocSkimmerBarrelDefinition });
        const s2Definition = { ...CrocSkimmerBarrelDefinition };
        s2Definition.angle += Math.PI;
        const s2 = new Barrel_1.default(this, s2Definition);
        s1.styleData.values.color = this.styleData.values.color;
        s2.styleData.values.color = this.styleData.values.color;
        skimmerBarrels.push(s1, s2);
        this.inputs = new AI_1.Inputs();
        this.inputs.flags |= 1;
    }
    tick(tick) {
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;
        super.tick(tick);
        if (this.deletionAnimation)
            return;
    }
}
exports.default = CrocSkimmer;
