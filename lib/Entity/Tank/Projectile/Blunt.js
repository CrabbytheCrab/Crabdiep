"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
const AI_1 = require("../../AI");
const TankBody_1 = require("../TankBody");
const Addons_1 = require("../Addons");
const MazeWall_1 = require("../../Misc/MazeWall");
const AbstractShape_1 = require("../../Shape/AbstractShape");
const Live_1 = require("../../Live");
const util = require("../../../util");
class Blunt extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.reloadTime = 15;
        this.cameraEntity = tank.cameraEntity;
        this.inputs = new AI_1.Inputs();
        this.sizeFactor = this.physicsData.values.size / 50;
        this.deff = false;
        const bulletDefinition = barrel.definition.bullet;
        const statLevels = tank.cameraEntity.cameraData?.values.statLevels.values;
        const bulletDamage = statLevels ? statLevels[2] : 0;
        if (this.tankDefinition && this.tankDefinition.id == 244) {
            this.baseSpeed *= 2;
            this.baseAccel /= 2;
            this.physicsData.size *= 1 + ((0.5 * Math.random()) - 0.25);
            this.baseSpeed *= 1 + ((0.4 * Math.random()) - 0.2);
            this.baseAccel *= 1 + ((0.5 * Math.random()) - 0.25);
        }
        this.megaturret = typeof this.barrelEntity.definition.megaturret === 'boolean' && this.barrelEntity.definition.megaturret;
        if (tankDefinition && tankDefinition.id === 124) {
            new Addons_1.GuardObject(this.game, this, 6, 1.3, 0, .1);
            this.push = ((7 / 3) + bulletDamage) * bulletDefinition.damage * 3;
        }
        else if (tankDefinition && tankDefinition.id === 158) {
            this.positionData.flags = 2;
            this.deff = true;
            new Addons_1.GuardObject(this.game, this, 1, 1.75, 0, .1);
            this.push = ((7 / 3) + bulletDamage) * bulletDefinition.damage * 3.5;
        }
        else if (tankDefinition && tankDefinition.id === 244) {
            new Addons_1.GuardObject(this.game, this, 6, 1.15, 0, .1);
            this.push = ((7 / 3) + bulletDamage) * bulletDefinition.damage * 3;
        }
        else {
            new Addons_1.GuardObject(this.game, this, 6, 1.15, 0, .1);
            this.push = ((7 / 3) + bulletDamage) * bulletDefinition.damage * 2;
        }
        this.physicsData.pushFactor = 0;
    }
    tick(tick) {
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;
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
        if (this.tankDefinition && this.tankDefinition.id == 244) {
            if (tick <= this.spawnTick + 5) {
            }
            else {
                const bulletDefinition = this.barrelEntity.definition.bullet;
                const statLevels = this.tank.cameraEntity.cameraData?.values.statLevels.values;
                const bulletDamage = statLevels ? statLevels[2] : 0;
                const falloff = ((7 + bulletDamage * 3) * bulletDefinition.damage) / 2;
                this.damagePerTick = falloff;
            }
        }
        if (this.deff) {
            if (this.isPhysical && !(this.deletionAnimation)) {
                const collidedEntities = this.findCollisions();
                for (let i = 0; i < collidedEntities.length; ++i) {
                    if (collidedEntities[i] instanceof TankBody_1.default || collidedEntities[i] instanceof AbstractShape_1.default || collidedEntities[i] instanceof MazeWall_1.default) {
                        this.velocity.angle >= Math.PI / 2 ? this.velocity.angle = Math.atan2(collidedEntities[i].positionData.y - this.positionData.y, collidedEntities[i].positionData.x - this.positionData.x) + -Math.PI
                            : this.velocity.angle = Math.atan2(collidedEntities[i].positionData.y - this.positionData.y, collidedEntities[i].positionData.x - this.positionData.x) + Math.PI;
                        this.movementAngle = this.velocity.angle;
                        this.baseSpeed *= 1.5;
                    }
                }
            }
        }
    }
}
exports.default = Blunt;
