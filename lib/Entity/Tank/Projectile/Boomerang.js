"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Barrel");
const Bullet_1 = require("./Bullet");
const AI_1 = require("../../AI");
const BoomBarrelDefinition = {
    angle: Math.PI / 3 + Math.PI / 6,
    offset: 0,
    size: 90,
    width: 49.578,
    delay: 0,
    reload: 0.5,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.5,
        damage: 2 / 5,
        speed: 0.8,
        scatterRate: 1,
        lifeLength: 0.25,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
class Boomerang extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.boom = false;
        this.boom2 = false;
        this.reloadTime = 1;
        this.inputs = new AI_1.Inputs();
        this.cameraEntity = tank.cameraEntity;
        this.sizeFactor = this.physicsData.values.size / 50;
        const bulletDefinition = barrel.definition.bullet;
        this.usePosAngle = false;
        if (this.physicsData.values.flags & 8)
            this.physicsData.values.flags ^= 8;
        this.physicsData.values.flags |= 32;
        this.ai = new AI_1.AI(this);
        this.canControlDrones = typeof this.barrelEntity.definition.canControlDrones === 'boolean' && this.barrelEntity.definition.canControlDrones;
        this.physicsData.values.sides = bulletDefinition.sides ?? 5;
        if (this.physicsData.values.flags & 8)
            this.physicsData.values.flags ^= 8;
        this.physicsData.values.flags |= 32;
        this.styleData.values.flags &= ~128;
        const skimmerBarrels = this.skimmerBarrels = [];
        if (tankDefinition && tankDefinition.id === 186) {
            const s1 = new class extends Barrel_1.default {
                resize() {
                    super.resize();
                }
            }(this, { ...BoomBarrelDefinition });
            const s2Definition = { ...BoomBarrelDefinition };
            s2Definition.angle += Math.PI / 1.5;
            const s2 = new class extends Barrel_1.default {
                resize() {
                    super.resize();
                }
            }(this, s2Definition);
            const s3Definition = { ...BoomBarrelDefinition };
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
        this.deathAccelFactor = 1;
        this.physicsData.values.pushFactor = 4;
        this.physicsData.values.absorbtionFactor = bulletDefinition.absorbtionFactor;
        this.baseSpeed /= 3;
        barrel.droneCount += 1;
        this.ai.movementSpeed = this.ai.aimSpeed = this.baseAccel;
    }
    destroy(animate = true) {
        if (!animate)
            this.barrelEntity.droneCount -= 1;
        super.destroy(animate);
    }
    tickMixin(tick) {
    }
    tick(tick) {
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;
        if (this.tankDefinition && this.tankDefinition.id === 137 || this.tankDefinition && this.tankDefinition.id === 203) {
            if (tick - this.spawnTick >= this.lifeLength / 24 && this.boom == false) {
                const delta = {
                    x: this.positionData.values.x - this.tank.positionData.values.x,
                    y: this.positionData.values.y - this.tank.positionData.values.y
                };
                const base = this.baseAccel;
                const dist = Math.atan2(delta.y, delta.x);
                if (dist < Boomerang.FOCUS_RADIUS / 4) {
                    this.movementAngle = this.positionData.values.angle + Math.PI;
                }
                else if (dist < Boomerang.FOCUS_RADIUS) {
                    this.movementAngle = this.positionData.values.angle;
                }
                else
                    this.movementAngle = this.positionData.values.angle;
                let unitDist = (delta.x ** 2 + delta.y ** 2) / Boomerang.MAX_RESTING_RADIUS;
                const offset = Math.atan2(delta.y, delta.x) + Math.PI / 2;
                delta.x = this.tank.positionData.values.x + Math.cos(offset) * this.tank.physicsData.values.size * 3 - this.positionData.values.x;
                delta.y = this.tank.positionData.values.y + Math.sin(offset) * this.tank.physicsData.values.size * 3 - this.positionData.values.y;
                this.movementAngle = Math.atan2(delta.y, delta.x);
                if (unitDist < 0.1) {
                }
                this.baseAccel = base;
            }
        }
        else if (this.tankDefinition && this.tankDefinition.id === 95) {
            if (tick - this.spawnTick >= this.lifeLength / 4 && this.boom == false) {
                if (this.boom2 == false) {
                    this.boom2 = true;
                    const delta = {
                        x: this.positionData.values.x - this.tank.positionData.values.x,
                        y: this.positionData.values.y - this.tank.positionData.values.y
                    };
                    const base = this.baseAccel;
                    let unitDist = (delta.x ** 2 + delta.y ** 2) / Boomerang.MAX_RESTING_RADIUS;
                    const offset = Math.atan2(delta.y, delta.x) + Math.PI / 2;
                    delta.x = this.tank.positionData.values.x + Math.cos(offset) * this.tank.physicsData.values.size * 0.5 - this.positionData.values.x;
                    delta.y = this.tank.positionData.values.y + Math.sin(offset) * this.tank.physicsData.values.size * 0.5 - this.positionData.values.y;
                    this.movementAngle = Math.atan2(delta.y, delta.x);
                    this.baseAccel = base;
                    this.baseAccel *= 1.5;
                }
            }
        }
        else {
            if (tick - this.spawnTick >= this.lifeLength / 8 && this.boom == false) {
                if (this.boom2 == false) {
                    this.boom2 = true;
                    this.baseAccel *= 1.5;
                }
                const delta = {
                    x: this.positionData.values.x - this.tank.positionData.values.x,
                    y: this.positionData.values.y - this.tank.positionData.values.y
                };
                const base = this.baseAccel;
                let unitDist = (delta.x ** 2 + delta.y ** 2) / Boomerang.MAX_RESTING_RADIUS;
                const offset = Math.atan2(delta.y, delta.x) + Math.PI / 2;
                delta.x = this.tank.positionData.values.x + Math.cos(offset) * this.tank.physicsData.values.size * 0.5 - this.positionData.values.x;
                delta.y = this.tank.positionData.values.y + Math.sin(offset) * this.tank.physicsData.values.size * 0.5 - this.positionData.values.y;
                this.movementAngle = Math.atan2(delta.y, delta.x);
                if (unitDist < 0.1) {
                    this.baseAccel /= 3;
                    this.destroy();
                }
                this.baseAccel = base;
            }
        }
        if (this.tankDefinition && this.tankDefinition.id === 186) {
            this.positionData.angle += 0.1;
        }
        else {
            this.positionData.angle += 0.3;
        }
        super.tick(tick);
        this.tickMixin(tick);
    }
}
exports.default = Boomerang;
Boomerang.FOCUS_RADIUS = 850 ** 2;
Boomerang.MAX_RESTING_RADIUS = 400 ** 2;
Boomerang.BASE_ROTATION = 0.1;
