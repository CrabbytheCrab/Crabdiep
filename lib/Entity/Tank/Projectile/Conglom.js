"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Barrel");
const Bullet_1 = require("./Bullet");
const AI_1 = require("../../AI");
const SkimmerBarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 70,
    width: 42,
    delay: 0.25,
    reload: 4.5,
    droneCount: 200,
    recoil: 0,
    isTrapezoid: true,
    trapezoidDirection: Math.PI,
    addon: null,
    bullet: {
        type: "hive",
        health: 1.5,
        damage: 0.3,
        speed: 1,
        scatterRate: 1,
        lifeLength: 1.25,
        sizeRatio: 0.9,
        absorbtionFactor: 1
    }
};
class Spinner extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle, direction) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.reloadTime = 15;
        this.rotationPerTick = Spinner.BASE_ROTATION;
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
        s2Definition.angle = Math.PI / 5 * 2;
        const s2 = new class extends Barrel_1.default {
            resize() {
                super.resize();
            }
        }(this, s2Definition);
        const s3Definition = { ...SkimmerBarrelDefinition };
        s3Definition.angle = -Math.PI / 5 * 2;
        const s3 = new class extends Barrel_1.default {
            resize() {
                super.resize();
            }
        }(this, s3Definition);
        const s4Definition = { ...SkimmerBarrelDefinition };
        s4Definition.angle = Math.PI / 5 * 4;
        const s4 = new class extends Barrel_1.default {
            resize() {
                super.resize();
            }
        }(this, s4Definition);
        const s5Definition = { ...SkimmerBarrelDefinition };
        s5Definition.angle = -Math.PI / 5 * 4;
        const s5 = new class extends Barrel_1.default {
            resize() {
                super.resize();
            }
        }(this, s5Definition);
        skimmerBarrels.push(s1, s2, s3, s4, s5);
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
exports.default = Spinner;
Spinner.BASE_ROTATION = 0.2;
