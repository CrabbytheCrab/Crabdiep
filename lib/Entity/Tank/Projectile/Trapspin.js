"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Barrel");
const Bullet_1 = require("./Bullet");
const AI_1 = require("../../AI");
const SkimmerBarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 60,
    width: 42,
    delay: 0,
    reload: 1.5,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: "trapLauncher",
    bullet: {
        type: "trap",
        health: 1,
        damage: 2 / 5,
        speed: 0.8,
        scatterRate: 1,
        lifeLength: 1.5,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
class TrapSpinner extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle, direction) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.reloadTime = 15;
        this.rotationPerTick = TrapSpinner.BASE_ROTATION;
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
        s2Definition.angle += Math.PI / 1.5;
        const s2 = new class extends Barrel_1.default {
            resize() {
                super.resize();
            }
        }(this, s2Definition);
        const s3Definition = { ...SkimmerBarrelDefinition };
        s3Definition.angle -= Math.PI / 1.5;
        const s3 = new class extends Barrel_1.default {
            resize() {
                super.resize();
            }
        }(this, s3Definition);
        skimmerBarrels.push(s1, s2, s3);
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
exports.default = TrapSpinner;
TrapSpinner.BASE_ROTATION = 0.2;
