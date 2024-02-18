"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
const TankBody_1 = require("../TankBody");
const MazeWall_1 = require("../../Misc/MazeWall");
const AbstractShape_1 = require("../../Shape/AbstractShape");
const Bouncer_1 = require("./Bouncer");
class CrackShot extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.collisionEnd = 0;
        this.shoot = false;
        this.multicrack = true;
        const bulletDefinition = barrel.definition.bullet;
        this.physicsData.values.sides = bulletDefinition.sides ?? 1;
        if (this.physicsData.values.flags & 8)
            this.physicsData.values.flags ^= 8;
        this.physicsData.values.flags |= 32;
        this.styleData.values.flags &= ~128;
        this.deathAccelFactor = 1;
        this.physicsData.values.pushFactor = 2;
        this.physicsData.values.absorbtionFactor = bulletDefinition.absorbtionFactor;
        this.baseSpeed /= 2;
        this.collisionEnd = this.lifeLength >> 3;
    }
    destroy(animate = true) {
        if (!animate)
            this.barrelEntity.droneCount -= 1;
        super.destroy(animate);
    }
    tickMixin(tick) {
        super.tick(tick);
    }
    tick(tick) {
        super.tick(tick);
        if (this.tankDefinition && this.tankDefinition.id == 291) {
            if (this.isPhysical && !(this.deletionAnimation)) {
                const collidedEntities = this.findCollisions();
                for (let i = 0; i < collidedEntities.length; ++i) {
                    if (collidedEntities[i] instanceof TankBody_1.default || collidedEntities[i] instanceof AbstractShape_1.default || collidedEntities[i] instanceof MazeWall_1.default) {
                        this.velocity.angle >= Math.PI / 2 ? this.velocity.angle = Math.atan2(collidedEntities[i].positionData.y - this.positionData.y, collidedEntities[i].positionData.x - this.positionData.x) + -Math.PI
                            : this.velocity.angle = Math.atan2(collidedEntities[i].positionData.y - this.positionData.y, collidedEntities[i].positionData.x - this.positionData.x) + Math.PI;
                        this.movementAngle = this.velocity.angle;
                    }
                }
            }
        }
        const inputs = this.tank.inputs;
        if (tick - this.spawnTick >= this.collisionEnd) {
            if (this.tank.inputs.attemptingRepel()) {
                this.positionData.angle = Math.atan2(inputs.mouse.y - this.positionData.values.y, inputs.mouse.x - this.positionData.values.x);
                if (!this.shoot) {
                    this.shoot = true;
                    if (this.tankDefinition && this.tankDefinition.id == 197 && this.multicrack) {
                        const bullet = new CrackShot(this.barrelEntity, this.tank, this.tankDefinition, this.positionData.angle);
                        bullet.physicsData.size *= 0.75;
                        bullet.baseSpeed *= 1.5;
                        bullet.baseAccel *= 1.5;
                        bullet.positionData.x = this.positionData.x;
                        bullet.positionData.y = this.positionData.y;
                        bullet.multicrack = false;
                    }
                    else if (this.tankDefinition && this.tankDefinition.id == 291) {
                        const bullet = new Bouncer_1.default(this.barrelEntity, this.tank, this.tankDefinition, this.positionData.angle, this.tank);
                        bullet.damagePerTick *= 0.75;
                        bullet.physicsData.size *= 0.75;
                        bullet.baseSpeed *= 1.5;
                        bullet.positionData.x = this.positionData.x;
                        bullet.positionData.y = this.positionData.y;
                    }
                    else {
                        const bullet = new Bullet_1.default(this.barrelEntity, this.tank, this.tankDefinition, this.positionData.angle, this.tank);
                        bullet.damagePerTick *= 0.75;
                        bullet.physicsData.size *= 0.75;
                        bullet.baseSpeed *= 1.5;
                        bullet.positionData.x = this.positionData.x;
                        bullet.positionData.y = this.positionData.y;
                    }
                }
                this.destroy();
            }
        }
    }
}
exports.default = CrackShot;
