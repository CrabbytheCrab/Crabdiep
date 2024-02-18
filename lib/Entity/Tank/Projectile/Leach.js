"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
const TankBody_1 = require("../TankBody");
const AbstractShape_1 = require("../../Shape/AbstractShape");
const AbstractBoss_1 = require("../../Boss/AbstractBoss");
class Leach extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle, parent) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.collisionEnd = 0;
        const bulletDefinition = barrel.definition.bullet;
        this.parent = parent ?? tank;
    }
    onKill(killedEntity) {
        if (typeof this.parent.onKill === 'function')
            this.parent.onKill(killedEntity);
        if (this.tankDefinition && this.tankDefinition.id === 263) {
            if (this.parent.healthData != null) {
                if (killedEntity instanceof AbstractShape_1.default) {
                    this.parent.healthData.health += this.parent.healthData.maxHealth / 16;
                }
                else if (killedEntity instanceof TankBody_1.default || killedEntity instanceof AbstractBoss_1.default) {
                    this.parent.healthData.health += this.parent.healthData.maxHealth / 4;
                }
            }
        }
    }
    tick(tick) {
        super.tick(tick);
        if (this.isPhysical && !(this.deletionAnimation)) {
            if (this.tankDefinition && this.tankDefinition.id !== 263) {
                const collidedEntities = this.findCollisions();
                for (let i = 0; i < collidedEntities.length; ++i) {
                    if (collidedEntities[i] instanceof TankBody_1.default || collidedEntities[i] instanceof AbstractShape_1.default || collidedEntities[i] instanceof AbstractBoss_1.default) {
                        if (this.parent.healthData != null) {
                            if (this.parent.healthData.health > this.damagePerTick / 4) {
                                this.parent.healthData.health += this.damagePerTick / 4;
                            }
                        }
                    }
                }
            }
        }
    }
}
exports.default = Leach;
