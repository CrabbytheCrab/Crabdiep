"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Object_1 = require("../Object");
const Live_1 = require("../Live");
const TankBody_1 = require("../Tank/TankBody");
const AbstractShape_1 = require("../Shape/AbstractShape");
const AbstractBoss_1 = require("../Boss/AbstractBoss");
class Aura extends Object_1.default {
    constructor(game, owner, size) {
        super(game);
        this.owner = owner;
        this.size = size;
        this.styleData.color = 9;
        this.styleData.opacity = owner.styleData.opacity / 2;
        this.positionData.values.x = this.owner.positionData.values.x;
        this.positionData.values.y = this.owner.positionData.values.y;
        this.physicsData.values.size = owner.physicsData.size * size;
        this.physicsData.values.sides = 1;
        this.physicsData.pushFactor = 0;
        this.physicsData.absorbtionFactor = 0;
        this.relationsData.owner = this.owner;
        this.relationsData.values.owner = this.owner;
        this.relationsData.team = this.owner.relationsData.team;
    }
    tick(tick) {
        super.tick(tick);
        this.styleData.opacity = this.owner.styleData.opacity / 2;
        this.physicsData.size = this.owner.physicsData.size * this.size;
        const entities = this.findCollisions();
        const collidedEntities = this.findCollisions();
        for (let i = 0; i < collidedEntities.length; ++i) {
            if (!(collidedEntities[i] instanceof Live_1.default))
                continue;
            if (collidedEntities[i] instanceof TankBody_1.default || collidedEntities[i] instanceof AbstractShape_1.default || collidedEntities[i] instanceof AbstractBoss_1.default) {
                if (collidedEntities[i].relationsData.values.team !== this.relationsData.values.team) {
                    collidedEntities[i].destroy();
                }
            }
        }
    }
}
exports.default = Aura;
