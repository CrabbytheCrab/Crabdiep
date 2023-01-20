"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
const AI_1 = require("../../AI");
class Striker extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle, parent) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.collisionEnd = 0;
        this.timer = 45;
        this.usePosAngle = false;
        this.turn = this.movementAngle;
        const bulletDefinition = barrel.definition.bullet;
        this.parent = parent ?? tank;
        this.ai = new AI_1.AI(this);
        this.ai.viewRange = 400;
        this.baseSpeed = (barrel.bulletAccel / 2) + 30 - Math.random() * barrel.definition.bullet.scatterRate;
        this.baseAccel = 0;
        this.physicsData.values.sides = bulletDefinition.sides ?? 6;
        if (this.physicsData.values.flags & 8)
            this.physicsData.values.flags ^= 8;
        this.physicsData.values.flags |= 32;
        this.styleData.values.flags &= ~128;
        this.collisionEnd = this.lifeLength >> 3;
        this.lifeLength = (600 * barrel.definition.bullet.lifeLength) >> 3;
        if (tankDefinition && tankDefinition.id === -4)
            this.collisionEnd = this.lifeLength - 1;
        this.ai.movementSpeed = this.ai.aimSpeed = this.baseAccel;
        this.ai.passiveRotation += 0.1;
    }
    onKill(killedEntity) {
        if (typeof this.parent.onKill === 'function')
            this.parent.onKill(killedEntity);
    }
    tick(tick) {
        super.tick(tick);
        this.positionData.angle += 0.3;
        const usingAI = this.tank.inputs.deleted || (!this.tank.inputs.attemptingShot() && !this.tank.inputs.attemptingRepel());
        const inputs = this.ai.inputs;
        this.timer--;
        if (!this.ai.target) {
            this.movementAngle = this.turn;
        }
        if (this.ai.target) {
            this.movementAngle = Math.atan2(inputs.mouse.y - this.positionData.values.y, inputs.mouse.x - this.positionData.values.x);
        }
        if (this.timer == 0) {
            this.timer = 45;
            this.addAcceleration(this.movementAngle, this.baseSpeed * 1.5);
            this.turn = this.movementAngle;
        }
        if (tick - this.spawnTick === this.collisionEnd) {
            if (this.physicsData.values.flags & 32)
                this.physicsData.flags ^= 32;
            this.physicsData.values.flags |= 8;
        }
    }
}
exports.default = Striker;
