"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
const Entity_1 = require("../../../Native/Entity");
const AI_1 = require("../../AI");
class Hive extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.restCycle = true;
        const bulletDefinition = barrel.definition.bullet;
        this.usePosAngle = true;
        this.ai = new AI_1.AI(this);
        this.ai.viewRange = 900 * tank.sizeFactor;
        this.ai.targetFilter = (targetPos) => (targetPos.x - this.positionData.x) ** 2 + (targetPos.y - this.positionData.y) ** 2 <= this.ai.viewRange ** 2;
        this.canControlDrones = typeof this.barrelEntity.definition.canControlDrones === 'boolean' && this.barrelEntity.definition.canControlDrones;
        this.physicsData.values.sides = bulletDefinition.sides ?? 3;
        if (this.physicsData.values.flags & 8)
            this.physicsData.values.flags ^= 8;
        this.physicsData.values.flags |= 32;
        this.styleData.values.flags &= ~128;
        if (barrel.definition.bullet.lifeLength !== -1) {
            this.lifeLength = 88 * barrel.definition.bullet.lifeLength;
        }
        else {
            this.lifeLength = Infinity;
            if (this.physicsData.values.flags & 256)
                this.physicsData.values.flags ^= 256;
        }
        this.deathAccelFactor = 1;
        this.physicsData.values.pushFactor = 2;
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
        super.tick(tick);
    }
    tick(tick) {
        const usingAI = !this.canControlDrones || this.tank.inputs.deleted || (!this.tank.inputs.attemptingShot() && !this.tank.inputs.attemptingRepel());
        const inputs = !usingAI ? this.tank.inputs : this.ai.inputs;
        if (usingAI && this.ai.state === 0) {
            const delta = {
                x: this.positionData.values.x - this.tank.positionData.values.x,
                y: this.positionData.values.y - this.tank.positionData.values.y
            };
            const base = this.baseAccel;
            if (!Entity_1.Entity.exists(this.barrelEntity))
                this.destroy();
            this.tickMixin(tick);
            this.baseAccel = base;
            return;
        }
        else {
            this.positionData.angle = Math.atan2(inputs.mouse.y - this.positionData.values.y, inputs.mouse.x - this.positionData.values.x);
            this.restCycle = false;
        }
        if (this.canControlDrones && inputs.attemptingRepel()) {
            this.positionData.angle += Math.PI;
        }
        if (!Entity_1.Entity.exists(this.barrelEntity))
            this.destroy();
        this.tickMixin(tick);
    }
}
exports.default = Hive;
Hive.MAX_RESTING_RADIUS = 400 ** 2;
