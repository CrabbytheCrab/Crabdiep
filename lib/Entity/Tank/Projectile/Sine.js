"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
class Sine extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle, direction) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.movedirection = direction;
        this.moveangle = shootAngle;
    }
    tick(tick) {
        super.tick(tick);
        if (this.deletionAnimation)
            return;
        let y1 = (Math.sin(this.movementAngle * (Math.PI * tick)));
        let x1 = (Math.cos(this.movementAngle * (Math.PI * tick)));
        this.movementAngle = Math.atan2(y1, x1);
    }
}
exports.default = Sine;
