"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("../../../util");
const Bullet_1 = require("./Bullet");
const TankBody_1 = require("../TankBody");
const util_1 = require("../../../util");
class PillBox extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle, parent) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.collisionEnd = 0;
        this.usePosAngle = false;
        this.tic = 5;
        const bulletDefinition = barrel.definition.bullet;
        this.parent = parent ?? tank;
        this.XMouse = 0;
        this.YMouse = 0;
        if (this.parent instanceof TankBody_1.default) {
            this.XMouse = this.parent.inputs.mouse.x;
            this.YMouse = this.parent.inputs.mouse.y;
        }
        this.baseSpeed = (barrel.bulletAccel / 2) + 30 - Math.random() * barrel.definition.bullet.scatterRate;
        this.physicsData.values.sides = bulletDefinition.sides ?? 4;
        if (this.physicsData.values.flags & 8)
            this.physicsData.values.flags ^= 8;
        this.physicsData.values.flags |= 32;
        this.styleData.values.flags |= 16;
        this.styleData.values.flags &= ~128;
        this.angles = Math.atan2((this.YMouse - this.positionData.values.y), (this.XMouse - this.positionData.values.x));
        this.collisionEnd = this.lifeLength >> 3;
        this.lifeLength = (600 * barrel.definition.bullet.lifeLength) >> 3;
        this.positionData.values.angle = Math.random() * util_1.PI2;
    }
    onKill(killedEntity) {
        if (typeof this.parent.onKill === 'function')
            this.parent.onKill(killedEntity);
    }
    tick(tick) {
        super.tick(tick);
        const delta = {
            x: (this.XMouse - this.positionData.values.x),
            y: (this.YMouse - this.positionData.values.y)
        };
        if (this.tic != 0) {
            this.positionData.angle += util.constrain(util.constrain(this.velocity.angleComponent(this.movementAngle) * .05, 0, 0.5) - util.constrain(this.velocity.magnitude, 0, 0.2) * 0.5, 0, 0.8);
        }
        if (this.tic >= 0) {
            if (tick - this.spawnTick >= (this.lifeLength / 50)) {
                this.movementAngle += (Math.atan2(delta.y, delta.x) - this.movementAngle) * 0.75;
            }
        }
        let dist = (delta.x ** 2 + delta.y ** 2) / PillBox.MAX_RESTING_RADIUS;
        if (this.tic == 0) {
            this.baseAccel = 0;
            this.baseSpeed = 0;
            if (this.physicsData.values.flags & 32)
                this.physicsData.flags ^= 32;
            this.physicsData.values.flags |= 8;
        }
        if (dist < 1 && this.tic > 0) {
            this.tic--;
            this.baseAccel /= 2;
            this.baseSpeed /= 2;
        }
    }
}
exports.default = PillBox;
PillBox.MAX_RESTING_RADIUS = 400 ** 2;
