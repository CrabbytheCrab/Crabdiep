"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
class Explosion extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.sized = this.physicsData.values.size;
        this.baseAccel = 0;
        this.baseSpeed = 0;
        this.physicsData.values.sides = 1;
        this.physicsData.values.absorbtionFactor = 0;
        this.physicsData.values.pushFactor = 25;
        if (this.physicsData.values.flags & 8)
            this.physicsData.values.flags ^= 8;
    }
    destroy(animate = false) {
        super.destroy(animate);
    }
    tick(tick) {
        super.tick(tick);
        if (this.physicsData.size < this.sized * 20) {
            this.physicsData.size += this.sized * 2.5;
            this.styleData.opacity -= 1 / 8;
        }
        if (this.physicsData.size >= this.sized * 20) {
            this.destroy(false);
        }
    }
}
exports.default = Explosion;
