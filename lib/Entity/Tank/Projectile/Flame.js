"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
class Flame extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.sized = this.physicsData.values.size;
        this.baseSpeed *= 0.4;
        this.baseAccel *= 0.4;
        this.physicsData.values.sides = 4;
        this.physicsData.values.absorbtionFactor = this.physicsData.values.pushFactor = 0;
        const statLevels = tank.cameraEntity.cameraData?.values.statLevels.values;
        const bulletDefinition = barrel.definition.bullet;
        const bulletPenetration = statLevels ? statLevels[3] : 0;
        this.lifeLength = bulletDefinition.lifeLength * 6 * ((13) / 5 + 2);
    }
    tick(tick) {
        super.tick(tick);
        if (this.tankDefinition && this.tankDefinition.id === 121) {
            if (this.physicsData.size < this.sized * 12) {
                this.physicsData.size += this.sized / 3;
                this.baseAccel *= 1.05;
                this.baseSpeed *= 1.05;
            }
        }
        else {
            if (this.physicsData.size < this.sized * 10) {
                this.baseAccel *= 1.05;
                this.baseSpeed *= 1.05;
                this.physicsData.size += this.sized / 5;
            }
        }
    }
}
exports.default = Flame;
