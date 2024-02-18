"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Object_1 = require("../Object");
const Live_1 = require("../Live");
const TankBody_1 = require("../Tank/TankBody");
const AI_1 = require("../AI");
const RiftEnd_1 = require("./RiftEnd");
class Rift extends Object_1.default {
    constructor(game, posx, posy, x, y) {
        super(game);
        this.cameraEntity = this;
        this.reloadTime = 15;
        this.multiplierdirect = 1;
        this.multiplierdirect2 = 1;
        this.x = x;
        this.y = y;
        this.positionData.x = posx;
        this.positionData.y = posy;
        this.part = 5;
        this.multiplier = 1;
        this.multiplier2 = 1;
        this.multiplierlerp = 1;
        this.multiplierlerp2 = 1;
        this.viewRange = 180;
        this.inputs = new AI_1.Inputs();
        this.sizeFactor = this.physicsData.values.size / 50;
        this.styleData.zIndex = 2;
        this.styleData.flags |= 128;
        this.physicsData.values.size = 180;
        this.positionData.values.flags |= 1;
        this.physicsData.values.size = 75;
        this.exit = new RiftEnd_1.default(this.game, this.x, this.y, 0, 0);
        this.physicsData.values.sides = 4;
        this.physicsData.pushFactor = 0;
        this.physicsData.values.absorbtionFactor = 0;
        this.lifetime = 600;
        const rotator = new Object_1.default(game);
        if (rotator.physicsData.flags && 2)
            rotator.physicsData.flags ^= 2;
        rotator.physicsData.sides = this.physicsData.sides;
        rotator.setParent(this);
        rotator.physicsData.values.size = (this.physicsData.size * 1.3);
        rotator.physicsData.values.absorbtionFactor = 0;
        rotator.relationsData.values.team = this;
        rotator.styleData.values.color = 11;
        rotator.styleData.opacity = 0.3;
        const tickStar = rotator.tick;
        rotator.tick = (tick) => {
            if (rotator.physicsData.flags && 2)
                rotator.physicsData.flags ^= 2;
            rotator.physicsData.size = (((this.physicsData.size * 1.3) * this.multiplierlerp2) - rotator.physicsData.size * 0.1);
            tickStar.call(rotator, tick);
        };
        this.styleData.values.color = 11;
    }
    destroy(animate = true) {
        super.destroy(animate);
        this.physicsData.pushFactor = 200;
        const entities = this.findCollisions();
        for (let i = 0; i < entities.length; ++i) {
            const entity = entities[i];
            if (!(entity instanceof Live_1.default))
                continue;
            if (entity.physicsData.values.flags & 64)
                continue;
            if (!(entity.relationsData.values.owner === null || !(entity.relationsData.values.owner instanceof Object_1.default)))
                continue;
        }
    }
    tick(tick) {
        super.tick(tick);
        this.positionData.angle += 0.1;
        this.multiplierlerp += (this.multiplier - this.multiplierlerp) * 0.1;
        this.multiplierlerp2 += (this.multiplier2 - this.multiplierlerp2) * 0.1;
        this.multiplier += 0.1 * this.multiplierdirect;
        if (this.multiplier >= 2.5) {
            this.multiplierdirect *= -1;
        }
        if (this.multiplier <= 0.2) {
            this.multiplierdirect *= -1;
        }
        this.multiplier2 += 0.025 * this.multiplierdirect;
        if (this.multiplier2 >= 2.5) {
            this.multiplierdirect2 *= -1;
        }
        if (this.multiplier2 <= 0.5) {
            this.multiplierdirect2 *= -1;
        }
        this.lifetime--;
        if (this.lifetime <= 0) {
            this.destroy();
        }
        const entities = this.findCollisions();
        this.viewRange = this.physicsData.size;
        for (let i = 0; i < entities.length; ++i) {
            const entity = entities[i];
            if (!(entity instanceof Live_1.default))
                continue;
            if (entity instanceof TankBody_1.default) {
                if (entity.cameraEntity.cameraData.flags && 4) {
                    entity.setVelocity(0, 0);
                    setTimeout(() => {
                        entity.setVelocity(0, 0);
                        const { x, y } = this.exit.getWorldPosition();
                        entity.positionData.x = x;
                        entity.positionData.y = y, 2;
                    });
                    setTimeout(() => {
                        entity.setVelocity(0, 0);
                        const { x, y } = this.exit.getWorldPosition();
                        entity.positionData.x = x;
                        entity.positionData.y = y, 1;
                    });
                    const { x, y } = this.exit.getWorldPosition();
                    entity.positionData.x = x;
                    entity.positionData.y = y;
                    entity.entityState |= 2 | 4;
                }
            }
        }
    }
}
exports.default = Rift;
