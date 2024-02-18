"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
const util_1 = require("../../../util");
class Trap extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle, parent) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.collisionEnd = 0;
        const bulletDefinition = barrel.definition.bullet;
        this.parent = parent ?? tank;
        this.baseSpeed = (barrel.bulletAccel / 2) + 30 - Math.random() * barrel.definition.bullet.scatterRate;
        this.baseAccel = 0;
        this.physicsData.values.sides = bulletDefinition.sides ?? 3;
        this.physicsData.values.flags |= 32;
        this.styleData.values.flags |= 16;
        this.styleData.values.flags &= ~128;
        this.collisionEnd = this.lifeLength >> 3;
        this.lifeLength = (600 * barrel.definition.bullet.lifeLength) >> 3;
        if (tankDefinition && tankDefinition.id === -4)
            this.collisionEnd = this.lifeLength - 1;
        this.positionData.values.angle = Math.random() * util_1.PI2;
    }
    onKill(killedEntity) {
        if (typeof this.parent.onKill === 'function')
            this.parent.onKill(killedEntity);
    }
    tick(tick) {
        super.tick(tick);
        if (tick - this.spawnTick === this.collisionEnd) {
            this.physicsData.flags |= 32;
            this.physicsData.values.flags |= 8;
        }
    }
}
exports.default = Trap;
