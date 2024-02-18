"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Barrel");
const Bullet_1 = require("./Bullet");
const AI_1 = require("../../AI");
const RocketBarrelDefinition = {
    angle: 2.6179938779914944,
    offset: 0,
    size: 70,
    width: 33.6,
    delay: 0,
    reload: 0.4,
    recoil: 2,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.4,
        damage: 0.2,
        speed: 1,
        scatterRate: 1,
        lifeLength: 0.2,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const RocketBarrelDefinition2 = {
    angle: 3.665191429188092,
    offset: 0,
    size: 70,
    width: 33.6,
    delay: 0,
    reload: 0.4,
    recoil: 2,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.4,
        damage: 0.2,
        speed: 1,
        scatterRate: 1,
        lifeLength: 0.2,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const RocketBarrelDefinition3 = {
    angle: Math.PI,
    offset: 0,
    size: 80,
    width: 42,
    delay: 0,
    reload: 0.4,
    recoil: 2,
    isTrapezoid: true,
    trapezoidDirection: Math.PI,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.4,
        damage: 0.5,
        speed: 1,
        scatterRate: 1,
        lifeLength: 0.2,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
class Snake extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle, direction) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.reloadTime = 1;
        this.inputs = new AI_1.Inputs();
        this.movedirection = direction;
        this.moveangle = shootAngle;
        this.cameraEntity = tank.cameraEntity;
        this.usePosAngle = true;
        this.sizeFactor = this.physicsData.values.size / 50;
        const skimmerBarrels = this.launrocketBarrel = [];
        const s1 = new class extends Barrel_1.default {
            resize() {
                super.resize();
            }
        }(this, { ...RocketBarrelDefinition });
        const s2 = new class extends Barrel_1.default {
            resize() {
                super.resize();
            }
        }(this, RocketBarrelDefinition2);
        const s3 = new class extends Barrel_1.default {
            resize() {
                super.resize();
            }
        }(this, RocketBarrelDefinition3);
        s1.styleData.values.color = this.styleData.values.color;
        s2.styleData.values.color = this.styleData.values.color;
        s3.styleData.values.color = this.styleData.values.color;
        skimmerBarrels.push(s1, s2, s3);
    }
    tick(tick) {
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;
        super.tick(tick);
        if (this.deletionAnimation)
            return;
        if (tick - this.spawnTick >= this.tank.reloadTime) {
            this.inputs.flags |= 1;
            if (this.movedirection == 1) {
                if (this.positionData.angle <= this.moveangle + Math.PI / 8) {
                    this.positionData.angle += (Math.PI / 8 * 0.05);
                }
                else {
                    this.movedirection = 0;
                }
            }
            if (this.movedirection == 0) {
                if (this.positionData.angle >= this.moveangle - Math.PI / 8) {
                    this.positionData.angle += (-Math.PI / 8 * 0.05);
                }
                else {
                    this.movedirection = 1;
                }
            }
        }
    }
}
exports.default = Snake;
