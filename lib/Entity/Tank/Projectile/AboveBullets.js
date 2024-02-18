"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
class AboveBullets extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle, parent) {
        super(barrel, tank, tankDefinition, shootAngle);
        const bulletDefinition = barrel.definition.bullet;
        this.parent = parent ?? tank;
        this.styleData.values.flags |= 64;
    }
    onKill(killedEntity) {
        if (typeof this.parent.onKill === 'function')
            this.parent.onKill(killedEntity);
    }
    tick(tick) {
        super.tick(tick);
        this.styleData.flags |= 64;
    }
}
exports.default = AboveBullets;
