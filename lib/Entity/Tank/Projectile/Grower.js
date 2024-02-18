"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("../../../util");
const Bullet_1 = require("./Bullet");
class Grower extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.sized = this.physicsData.values.size;
        this.acc = this.baseAccel;
        this.split = true;
    }
    tick(tick) {
        super.tick(tick);
        if (this.tankDefinition && this.tankDefinition.id === 230) {
            if (this.physicsData.size < this.sized * 6) {
                this.physicsData.size += this.sized / 30;
                this.damageReduction = util.constrain(this.damageReduction -= 0.2 / 160, 0.05, 1);
                this.baseAccel -= this.acc / 270;
            }
        }
        else if (this.tankDefinition && this.tankDefinition.id === 252) {
            if (this.physicsData.size < this.sized * 3) {
                this.physicsData.size += this.sized / 20;
                this.baseAccel -= this.acc / 80;
            }
            else {
                if (this.split) {
                    this.split = false;
                    this.destroy();
                    const Grow = new Bullet_1.default(this.barrelEntity, this.tank, this.tankDefinition, this.positionData.angle + Math.PI / 2);
                    Grow.damagePerTick = this.damagePerTick / 2;
                    Grow.positionData.x = this.positionData.x;
                    Grow.positionData.y = this.positionData.y;
                    const Grow2 = new Bullet_1.default(this.barrelEntity, this.tank, this.tankDefinition, this.positionData.angle - Math.PI / 2);
                    Grow2.damagePerTick = this.damagePerTick / 2;
                    Grow2.positionData.x = this.positionData.x;
                    Grow2.positionData.y = this.positionData.y;
                    const Grow3 = new Bullet_1.default(this.barrelEntity, this.tank, this.tankDefinition, this.positionData.angle + Math.PI);
                    Grow3.damagePerTick = this.damagePerTick / 2;
                    Grow3.positionData.x = this.positionData.x;
                    Grow3.positionData.y = this.positionData.y;
                    const Grow4 = new Bullet_1.default(this.barrelEntity, this.tank, this.tankDefinition, this.positionData.angle);
                    Grow4.damagePerTick = this.damagePerTick / 2;
                    Grow4.positionData.x = this.positionData.x;
                    Grow4.positionData.y = this.positionData.y;
                }
            }
        }
        else {
            if (this.physicsData.size < this.sized * 4) {
                this.physicsData.size += this.sized / 20;
                this.baseAccel -= this.acc / 80;
            }
        }
    }
}
exports.default = Grower;
