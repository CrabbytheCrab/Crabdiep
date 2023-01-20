"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
class Flame extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.sized = this.physicsData.values.size;
        this.baseSpeed *= 0.8;
        this.physicsData.values.sides = 1;
        this.physicsData.values.absorbtionFactor = this.physicsData.values.pushFactor = 0;
        const statLevels = tank.cameraEntity.cameraData?.values.statLevels.values;
        const bulletDefinition = barrel.definition.bullet;
        const bulletPenetration = statLevels ? statLevels[3] : 0;
        this.healthData.values.health = this.healthData.values.maxHealth = bulletDefinition.health;
        this.lifeLength = bulletDefinition.lifeLength * 6 * ((1.5 * bulletPenetration) / 5 + 2);
    }
    tick(tick) {
        super.tick(tick);
        if (this.physicsData.size < this.sized * 8) {
            this.physicsData.size += this.sized / 8;
        }
    }
}
exports.default = Flame;
