"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Barrel");
const Bullet_1 = require("./Bullet");
const AI_1 = require("../../AI");
const SkimmerBarrelDefinition = {
    angle: Math.PI / 2,
    offset: 0,
    size: 66.526,
    width: 37.967,
    delay: 0,
    reload: 0.35,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.3,
        damage: 3 / 5,
        speed: 1.1,
        scatterRate: 1,
        lifeLength: 0.25,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
class Skimmer extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle, direction) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.reloadTime = 15;
        this.rotationPerTick = Skimmer.BASE_ROTATION;
        this.rotationPerTick = direction;
        this.cameraEntity = tank.cameraEntity;
        this.sizeFactor = this.physicsData.values.size / 50;
        const skimmerBarrels = this.skimmerBarrels = [];
        const s1 = new class extends Barrel_1.default {
            resize() {
                super.resize();
            }
        }(this, { ...SkimmerBarrelDefinition });
        const s2Definition = { ...SkimmerBarrelDefinition };
        s2Definition.angle += Math.PI;
        const s2 = new class extends Barrel_1.default {
            resize() {
                super.resize();
            }
        }(this, s2Definition);
        s1.styleData.values.color = this.styleData.values.color;
        s2.styleData.values.color = this.styleData.values.color;
        skimmerBarrels.push(s1, s2);
        this.inputs = new AI_1.Inputs();
        this.inputs.flags |= 1;
    }
    tick(tick) {
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;
        this.positionData.angle += this.rotationPerTick;
        super.tick(tick);
        if (this.deletionAnimation)
            return;
    }
}
exports.default = Skimmer;
Skimmer.BASE_ROTATION = 0.1;
