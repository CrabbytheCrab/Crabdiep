"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
const Entity_1 = require("../../../Native/Entity");
const AI_1 = require("../../AI");
class Drone2 extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.boom = false;
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
            if (tick - this.spawnTick >= this.lifeLength / 4 && this.boom == false) {
                this.movementAngle += Math.PI;
                this.boom = true;
            }
        }
        if (this.canControlDrones) {
            if (tick - this.spawnTick >= this.lifeLength / 6 && this.boom == false) {
                this.movementAngle += Math.PI;
                this.boom = true;
            }
        }
        this.positionData.angle += 0.3;
        super.tick(tick);
        if (!Entity_1.Entity.exists(this.barrelEntity))
            this.destroy();
        this.tickMixin(tick);
    }
}
exports.default = Drone2;
Drone2.MAX_RESTING_RADIUS = 400 ** 2;
Drone2.BASE_ROTATION = 0.1;
