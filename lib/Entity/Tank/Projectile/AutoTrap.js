"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
const AI_1 = require("../../AI");
const AutoTurret_1 = require("../AutoTurret");
class AutoTrap extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this._currentTank = 0;
        this.inputs = new AI_1.Inputs();
        this.collisionEnd = 0;
        this.reloadTime = 1;
        this.canControlDrones = typeof this.barrelEntity.definition.canControlDrones === 'boolean' && this.barrelEntity.definition.canControlDrones;
        this.cameraEntity = tank.cameraEntity;
        this.megaturret = typeof this.barrelEntity.definition.megaturret === 'boolean' && this.barrelEntity.definition.megaturret;
        this.sizeFactor = this.physicsData.values.size / 50;
        if (this.megaturret || this.canControlDrones) {
            if (this.megaturret) {
                const atuo = new AutoTurret_1.default(this, {
                    angle: 0,
                    offset: 0,
                    size: 80,
                    width: 45,
                    delay: 0.01,
                    reload: 5.5,
                    recoil: 0,
                    isTrapezoid: false,
                    trapezoidDirection: 0,
                    addon: null,
                    bullet: {
                        type: "bullet",
                        sizeRatio: 1,
                        health: 0.8,
                        damage: 1.25,
                        speed: 1.3,
                        scatterRate: 0.3,
                        lifeLength: 1,
                        absorbtionFactor: 0.1
                    }
                });
                atuo.baseSize *= 1.35;
                atuo.positionData.values.angle = shootAngle;
                atuo.styleData.values.flags |= 64;
                atuo.ai.viewRange = 1500;
            }
            if (this.canControlDrones) {
                const atuo = new AutoTurret_1.default(this, {
                    angle: 0,
                    offset: 0,
                    size: 65,
                    width: 35,
                    delay: 0.01,
                    reload: 0.875,
                    recoil: 0,
                    isTrapezoid: true,
                    trapezoidDirection: 0,
                    addon: null,
                    bullet: {
                        type: "bullet",
                        sizeRatio: 1,
                        health: 0.75,
                        damage: 0.325,
                        speed: 1,
                        scatterRate: 2,
                        lifeLength: 0.75,
                        absorbtionFactor: 0.3
                    }
                });
                atuo.baseSize *= 1.25;
                atuo.positionData.values.angle = shootAngle;
                atuo.styleData.values.flags |= 64;
                atuo.ai.viewRange = 540;
            }
        }
        else {
            const atuo = new AutoTurret_1.default(this, {
                angle: 0,
                offset: 0,
                size: 65,
                width: 35,
                delay: 0.01,
                reload: 1.75,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 0.75,
                    damage: 0.5,
                    speed: 1,
                    scatterRate: 1,
                    lifeLength: 0.75,
                    absorbtionFactor: 0.1
                }
            });
            atuo.baseSize *= 1.25;
            atuo.positionData.values.angle = shootAngle;
            atuo.styleData.values.flags |= 64;
            atuo.ai.viewRange = 640;
        }
        this.baseSpeed = (barrel.bulletAccel / 2) + 30 - Math.random() * barrel.definition.bullet.scatterRate;
        this.baseAccel = 0;
        this.physicsData.values.sides = 3;
        if (this.physicsData.values.flags & 8)
            this.physicsData.values.flags ^= 8;
        this.physicsData.values.flags |= 32;
        this.styleData.values.flags |= 16;
        this.styleData.values.flags &= ~128;
        this.collisionEnd = this.lifeLength >> 3;
        this.lifeLength = (600 * barrel.definition.bullet.lifeLength) >> 3;
        if (tankDefinition && tankDefinition.id === -4)
            this.collisionEnd = this.lifeLength - 1;
        this.positionData.values.angle = Math.random() * Math.PI * 2;
    }
    tick(tick) {
        super.tick(tick);
        this.reloadTime = this.tank.reloadTime;
        if (tick - this.spawnTick === this.collisionEnd) {
            if (this.physicsData.values.flags & 32)
                this.physicsData.flags ^= 32;
            this.physicsData.values.flags |= 8;
        }
    }
}
exports.default = AutoTrap;
