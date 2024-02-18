"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Live_1 = require("../../Live");
const Trap_1 = require("./Trap");
const AI_1 = require("../../AI");
const Addons_1 = require("../Addons");
const util = require("../../../util");
class BluntTrap extends Trap_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.reloadTime = 15;
        this.collisionEnd = 0;
        this.cameraEntity = tank.cameraEntity;
        this.inputs = new AI_1.Inputs();
        this.sizeFactor = this.physicsData.values.size / 50;
        const smash = new Addons_1.GuardObject(this.game, this, 3, 2, this.positionData.angle, 0);
        smash.styleData.flags |= 16;
        const bulletDefinition = barrel.definition.bullet;
        const statLevels = tank.cameraEntity.cameraData?.values.statLevels.values;
        const bulletDamage = statLevels ? statLevels[2] : 0;
        this.push = ((7 / 3) + bulletDamage) * bulletDefinition.damage * 2.5;
        this.physicsData.values.pushFactor = 0;
        this.tank = tank;
    }
    tick(tick) {
        super.tick(tick);
        const entities = this.findCollisions();
        for (let i = 0; i < entities.length; ++i) {
            const entity = entities[i];
            if (!(entity instanceof Live_1.default))
                continue;
            let kbAngle;
            let diffY = this.positionData.values.y - entity.positionData.values.y;
            let diffX = this.positionData.values.x - entity.positionData.values.x;
            if (diffX === 0 && diffY === 0)
                kbAngle = Math.random() * util.PI2;
            else {
                kbAngle = Math.atan2(diffY, diffX);
                entity.addAcceleration(kbAngle, -this.push * entity.physicsData.absorbtionFactor);
            }
        }
        if (tick - this.spawnTick === this.collisionEnd) {
            if (this.physicsData.values.flags & 32)
                this.physicsData.flags ^= 32;
            this.physicsData.values.flags |= 8;
        }
    }
}
exports.default = BluntTrap;
