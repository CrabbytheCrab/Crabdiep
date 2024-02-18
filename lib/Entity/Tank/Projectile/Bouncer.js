"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
const TankBody_1 = require("../TankBody");
const AbstractShape_1 = require("../../Shape/AbstractShape");
const MazeWall_1 = require("../../Misc/MazeWall");
class Bouncer extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle, parent) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.collisionEnd = 0;
        const bulletDefinition = barrel.definition.bullet;
        this.parent = parent ?? tank;
        this.positionData.flags = 2;
    }
    onKill(killedEntity) {
        if (typeof this.parent.onKill === 'function')
            this.parent.onKill(killedEntity);
    }
    tick(tick) {
        super.tick(tick);
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
}
exports.default = Bouncer;
