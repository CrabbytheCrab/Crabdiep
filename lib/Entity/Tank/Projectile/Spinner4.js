"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Barrel");
const Bullet_1 = require("./Bullet");
const AI_1 = require("../../AI");
const SkimmerBarrelDefinition = {
    angle: Math.PI / 2,
    offset: 0,
    size: 75,
    width: 49.578,
    delay: 0,
    reload: 0.2,
    recoil: 0,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.3,
        damage: 2 / 5,
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
        const s3Definition = { ...SkimmerBarrelDefinition };
        s3Definition.angle += Math.PI / 2;
        const s3 = new class extends Barrel_1.default {
            resize() {
                super.resize();
            }
        }(this, s3Definition);
        const s4Definition = { ...SkimmerBarrelDefinition };
        s4Definition.angle -= Math.PI / 2;
        const s4 = new class extends Barrel_1.default {
            resize() {
                super.resize();
            }
        }(this, s4Definition);
        s1.styleData.values.color = this.styleData.values.color;
        s2.styleData.values.color = this.styleData.values.color;
        s3.styleData.values.color = this.styleData.values.color;
        s4.styleData.values.color = this.styleData.values.color;
        skimmerBarrels.push(s1, s2, s3, s4);
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
Skimmer.BASE_ROTATION = 0.4;
