"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
class Flame extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.baseSpeed *= 2;
        this.baseAccel = 0;
        this.damageReduction = 1;
        this.physicsData.values.sides = 4;
        this.physicsData.values.absorbtionFactor = this.physicsData.values.pushFactor = 0;
        this.lifeLength = 25 * barrel.definition.bullet.lifeLength;
    }
    destroy(animate) {
        super.destroy(false);
    }
    tick(tick) {
        super.tick(tick);
        this.damageReduction += 1 / 25;
        this.styleData.opacity -= 1 / 25;
    }
}
exports.default = Flame;
