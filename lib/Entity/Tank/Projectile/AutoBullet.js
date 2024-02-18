"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
const AutoTurret_1 = require("../AutoTurret");
const AI_1 = require("../../AI");
class AutoBullet extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle, parent) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.reloadTime = 15;
        this.inputs = new AI_1.Inputs();
        this.cameraEntity = tank.cameraEntity;
        this.sizeFactor = this.physicsData.values.size / 50;
        if (tankDefinition && tankDefinition.id === 235) {
            const atuo = new AutoTurret_1.default(this, {
                angle: 0,
                offset: 0,
                size: 65,
                width: 33.6,
                delay: 0.2,
                reload: 1.75,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 0.8,
                    damage: 0.4,
                    speed: 1,
                    scatterRate: 1,
                    lifeLength: 0.75,
                    absorbtionFactor: 0.1
                }
            });
            atuo.baseSize *= 1.25;
            atuo.ai.viewRange = 1000;
            atuo.positionData.values.angle = shootAngle;
        }
        else if (tankDefinition && tankDefinition.id === 236) {
            const atuo = new AutoTurret_1.default(this, {
                angle: 0,
                offset: 0,
                size: 65,
                width: 50.4,
                delay: 0.2,
                reload: 4.5,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1,
                    damage: 1.2,
                    speed: 1.2,
                    scatterRate: 1,
                    lifeLength: 0.75,
                    absorbtionFactor: 0.1
                }
            });
            atuo.baseSize *= 1.25;
            atuo.positionData.values.angle = shootAngle;
            atuo.ai.viewRange = 1000;
        }
        else {
            const atuo = new AutoTurret_1.default(this, {
                angle: 0,
                offset: 0,
                size: 65,
                width: 33.6,
                delay: 0.2,
                reload: 1.75,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1,
                    damage: 0.4,
                    speed: 1.2,
                    scatterRate: 1,
                    lifeLength: 0.75,
                    absorbtionFactor: 0.1
                }
            });
            atuo.baseSize *= 1.25;
            atuo.positionData.values.angle = shootAngle;
            atuo.ai.viewRange = 1000;
        }
    }
    onKill(killedEntity) {
        if (typeof this.parent.onKill === 'function')
            this.parent.onKill(killedEntity);
    }
    tick(tick) {
        super.tick(tick);
    }
}
exports.default = AutoBullet;
