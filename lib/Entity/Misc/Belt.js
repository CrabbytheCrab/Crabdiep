"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Object_1 = require("../Object");
const Live_1 = require("../Live");
const TeamBase_1 = require("./TeamBase");
const Bullet_1 = require("../Tank/Projectile/Bullet");
const BulletAlt_1 = require("../Tank/Projectile/BulletAlt");
const FieldGroups_1 = require("../../Native/FieldGroups");
class Belt extends Object_1.default {
    constructor(game, x, y, width, height, direction) {
        super(game);
        this.positionData.values.x = x;
        this.positionData.values.y = y;
        this.direction = direction;
        this.physicsData.values.width = width;
        this.physicsData.values.size = height;
        this.physicsData.values.sides = 2;
        this.physicsData.values.flags |= 2 | 64;
        this.physicsData.values.pushFactor = 0;
        this.physicsData.values.absorbtionFactor = 0;
        const ball = new Object_1.default(this.game);
        ball.nameData = new FieldGroups_1.NameGroup(ball);
        ball.nameData.values.name = "";
        ball.setParent(this);
        ball.physicsData.values.sides = 3;
        ball.styleData.values.color = 13;
        ball.physicsData.flags |= 2;
        ball.physicsData.values.size = 100;
        ball.positionData.angle = this.direction;
        ball.styleData.flags |= 64;
        ball.styleData.color = 25;
        ball.physicsData.values.absorbtionFactor = 1;
        this.styleData.values.borderWidth = 10;
        this.styleData.zIndex = 1;
        this.styleData.values.color = 22;
    }
    tick(tick) {
        const entities = this.findCollisions();
        for (let i = 0; i < entities.length; ++i) {
            const entity = entities[i];
            if (entity instanceof Live_1.default) {
                if (entity instanceof TeamBase_1.default) {
                }
                else {
                    if (entity instanceof Bullet_1.default) {
                        entity.movementAngle = this.direction;
                        entity.positionData.angle = this.direction;
                    }
                    if (entity instanceof BulletAlt_1.default) {
                        entity.movementAngle = this.direction;
                        entity.positionData.angle = this.direction;
                    }
                    entity.addAcceleration(this.direction, 10);
                }
            }
        }
    }
}
exports.default = Belt;
