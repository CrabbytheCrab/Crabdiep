"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Trap_1 = require("./Trap");
const AI_1 = require("../../AI");
const Addons_1 = require("../Addons");
class BluntTrap extends Trap_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.reloadTime = 15;
        this.collisionEnd = 0;
        this.cameraEntity = tank.cameraEntity;
        this.inputs = new AI_1.Inputs();
        this.sizeFactor = this.physicsData.values.size / 50;
        const smash = new Addons_1.GuardObject(this.game, this, 6, 0.65, 0, .1);
        smash.styleData.values.flags |= 64;
        if (smash.styleData.values.flags & 64)
            smash.styleData.values.flags |= 64;
        this.physicsData.values.pushFactor *= 12.5;
        this.tank = tank;
        const bulletDefinition = barrel.definition.bullet;
    }
    tick(tick) {
        super.tick(tick);
        if (tick - this.spawnTick === this.collisionEnd) {
            if (this.physicsData.values.flags & 32)
                this.physicsData.flags ^= 32;
            this.physicsData.values.flags |= 8;
        }
    }
}
exports.default = BluntTrap;
