"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Object_1 = require("../../Object");
class Partical extends Object_1.default {
    constructor(game, tank, shootAngle) {
        super(game);
        this.spawnTick = 0;
        this.baseAccel = 0;
        this.baseSpeed = 0;
        this.deathAccelFactor = 0.5;
        this.lifeLength = 0;
        this.movementAngle = 0;
        this.movementAngle = shootAngle;
        this.tank = tank;
        this.sized = this.physicsData.values.size;
        this.baseSpeed *= 0.8;
        this.physicsData.values.flags |= 8 | 256;
        this.positionData.values.flags |= 2;
        this.styleData.values.flags |= 128;
        this.physicsData.values.sides = 1;
        this.physicsData.values.absorbtionFactor = this.physicsData.values.pushFactor = 0;
        this.baseAccel = 30;
        this.baseSpeed = 30;
        this.physicsData.absorbtionFactor = 0;
        this.physicsData.pushFactor = 0;
        this.lifeLength = 100000;
        const { x, y } = tank.getWorldPosition();
        const sizeFactor = tank.sizeFactor;
        this.positionData.values.x = x + (Math.cos(shootAngle) * tank.physicsData.values.size) - Math.sin(shootAngle) * sizeFactor;
        this.positionData.values.y = y + (Math.sin(shootAngle) * tank.physicsData.values.size) + Math.cos(shootAngle) * sizeFactor;
        this.positionData.values.angle = shootAngle;
    }
    destroy(animate = true) {
        if (this.deletionAnimation) {
            this.deletionAnimation.frame = 0;
        }
        if (this.deletionAnimation) {
            this.deletionAnimation.frame = 0;
            this.styleData.opacity = 0;
        }
        super.destroy(animate);
    }
    tick(tick) {
        super.tick(tick);
        if (tick === this.spawnTick + 1)
            this.addAcceleration(this.movementAngle, this.baseSpeed);
        else
            this.maintainVelocity(this.movementAngle, this.baseAccel);
        this.styleData.opacity -= 0.05;
        if (this.styleData.opacity <= 0)
            this.destroy(false);
    }
}
exports.default = Partical;
