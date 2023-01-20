"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
const AI_1 = require("../../AI");
class Drone2 extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.boom = false;
        this.boom2 = false;
        const bulletDefinition = barrel.definition.bullet;
        this.usePosAngle = false;
        this.ai = new AI_1.AI(this);
        this.canControlDrones = typeof this.barrelEntity.definition.canControlDrones === 'boolean' && this.barrelEntity.definition.canControlDrones;
        this.physicsData.values.sides = bulletDefinition.sides ?? 5;
        if (this.physicsData.values.flags & 8)
            this.physicsData.values.flags ^= 8;
        this.physicsData.values.flags |= 32;
        this.styleData.values.flags &= ~128;
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
        if (!this.canControlDrones) {
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
                let unitDist = (delta.x ** 2 + delta.y ** 2) / Drone2.MAX_RESTING_RADIUS;
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
        if (this.canControlDrones) {
            if (tick - this.spawnTick >= this.lifeLength / 16 && this.boom == false) {
                const delta = {
                    x: this.positionData.values.x - this.tank.positionData.values.x,
                    y: this.positionData.values.y - this.tank.positionData.values.y
                };
                const base = this.baseAccel;
                const dist = Math.atan2(delta.y, delta.x);
                if (dist < Drone2.FOCUS_RADIUS / 4) {
                    this.movementAngle = this.positionData.values.angle + Math.PI;
                }
                else if (dist < Drone2.FOCUS_RADIUS) {
                    this.movementAngle = this.positionData.values.angle;
                }
                else
                    this.movementAngle = this.positionData.values.angle;
                let unitDist = (delta.x ** 2 + delta.y ** 2) / Drone2.MAX_RESTING_RADIUS;
                const offset = Math.atan2(delta.y, delta.x) + Math.PI / 2;
                delta.x = this.tank.positionData.values.x + Math.cos(offset) * this.tank.physicsData.values.size * 3 - this.positionData.values.x;
                delta.y = this.tank.positionData.values.y + Math.sin(offset) * this.tank.physicsData.values.size * 3 - this.positionData.values.y;
                this.movementAngle = Math.atan2(delta.y, delta.x);
                if (unitDist < 0.1) {
                }
                this.baseAccel = base;
            }
        }
        this.positionData.angle += 0.3;
        super.tick(tick);
        this.tickMixin(tick);
    }
}
exports.default = Drone2;
Drone2.FOCUS_RADIUS = 850 ** 2;
Drone2.MAX_RESTING_RADIUS = 400 ** 2;
Drone2.BASE_ROTATION = 0.1;
