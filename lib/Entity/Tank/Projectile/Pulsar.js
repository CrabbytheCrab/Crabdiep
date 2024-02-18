"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
class Pulsar extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle, inverse) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.shootAngle = shootAngle;
        this.bool = true;
        this.inverse = inverse;
    }
    tick(tick) {
        super.tick(tick);
        if (tick - this.spawnTick >= 6 && this.bool) {
            this.movementAngle = this.shootAngle + Math.PI;
            this.baseAccel *= 2;
            this.positionData.angle = this.shootAngle + Math.PI;
            this.bool = false;
        }
    }
}
exports.default = Pulsar;
