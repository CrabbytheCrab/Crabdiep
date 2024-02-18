"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TankBody_1 = require("../TankBody");
const Addons_1 = require("../Addons");
const Live_1 = require("../../Live");
const AI_1 = require("../../AI");
const AbstractBoss_1 = require("../../Boss/AbstractBoss");
const AbstractShape_1 = require("../../Shape/AbstractShape");
class RopeSegment extends Live_1.default {
    constructor(owner) {
        super(owner.game);
        this.collisionEnd = 0;
        this.cameraEntity = this;
        this.reloadTime = 1;
        this.CanSpawn = true;
        this.parent = owner;
        this.seg = 0;
        this.IsBig = false;
        this.physicsData.flags |= 64;
        this.styleData.flags |= 128;
        this.sizeFactor = this.physicsData.values.size / 50;
        this.relationsData.owner = this.parent;
        this.inputs = new AI_1.Inputs();
        this.relationsData.values.owner = this.parent;
        this.positionData.x = this.parent.positionData.x;
        this.positionData.y = this.parent.positionData.y;
        if (this.IsBig) {
            this.physicsData.pushFactor = 10;
            this.physicsData.sides = 1;
            this.damagePerTick = 10;
            this.physicsData.size = this.parent.physicsData.size * 1.25;
        }
        else {
            this.physicsData.size = this.parent.physicsData.size / 8;
        }
        this.physicsData.pushFactor = 3;
        this.physicsData.absorbtionFactor = 0;
        this.physicsData.sides = 1;
        this.damagePerTick = 2;
        this.physicsData.absorbtionFactor = 0.1;
        this.positionData.values.flags |= 2;
        this.damageReduction = 0;
        this.physicsData.flags |= 8 | 256;
        this.relationsData.team = this.parent.relationsData.team;
        this.isAffectedByRope = true;
    }
    destroy(animate = true) {
        if (!animate)
            this.parent.segments.splice(this.parent.segments.indexOf(this), 1);
        super.destroy(animate);
    }
    onKill(killedEntity) {
        if (typeof this.parent.onKill === 'function')
            this.parent.onKill(killedEntity);
    }
    tick(tick) {
        if (this.parent.canchain) {
            this.destroy();
        }
        const statLevels = this.parent.cameraEntity.cameraData?.values.statLevels.values;
        const bodyDamage = statLevels ? statLevels[5] : 0;
        if (this.parent != null) {
            const delta = {
                x: this.positionData.x - this.parent.positionData.x,
                y: this.positionData.x - this.parent.positionData.y
            };
            const offset = Math.atan2(delta.y, delta.x) + Math.PI / 2;
            delta.x = this.parent.positionData.values.x + Math.cos(offset) * this.parent.physicsData.values.size * 0.5 - this.positionData.values.x;
            delta.y = this.parent.positionData.values.y + Math.sin(offset) * this.parent.physicsData.values.size * 0.5 - this.positionData.values.y;
        }
        if (this.IsBig) {
            let rot = Math.atan2(this.parent.inputs.mouse.y - this.positionData.y, this.parent.inputs.mouse.x - this.positionData.x);
            this.physicsData.sides = 1;
            this.styleData.color = 1;
            if (this.CanSpawn) {
                this.styleData.zIndex = this.parent.styleData.zIndex - 5;
                const rotator = new Addons_1.GuardObject(this.game, this, 6, 1.15, 0, 0.1);
                rotator.styleData.zIndex = this.parent.styleData.zIndex - 6;
                const offsetRatio = 0;
                const size = this.physicsData.values.size;
                rotator.relationsData.values.team = this.relationsData.values.team;
                rotator.positionData.values.angle = 0;
                const rotator2 = new Addons_1.GuardObject(this.game, this, 1, 1, 0.2, 0.1);
                rotator2.styleData.zIndex = this.parent.styleData.zIndex - 6;
                rotator2.styleData.color = this.parent.rootParent.styleData.color;
                rotator2.styleData.values.flags |= 64;
                this.CanSpawn = false;
            }
            this.physicsData.pushFactor = 8;
            this.damagePerTick = 0;
            this.bodyDamage = 5 + (bodyDamage);
            this.physicsData.size = this.parent.physicsData.size * 1.5;
            const collidedEntities = this.findCollisions();
            for (let i = 0; i < collidedEntities.length; ++i) {
                if (collidedEntities[i] instanceof TankBody_1.default || collidedEntities[i] instanceof AbstractShape_1.default || collidedEntities[i] instanceof AbstractBoss_1.default) {
                    if (collidedEntities[i].relationsData.values.team !== this.relationsData.values.team) {
                        Live_1.default.applyDamagealt(collidedEntities[i], this);
                    }
                }
            }
        }
        else {
            if (this.CanSpawn) {
                this.styleData.color = 1;
                this.styleData.zIndex = this.parent.styleData.zIndex - 25 + this.seg;
                this.CanSpawn = false;
            }
            this.physicsData.pushFactor = 0;
            this.physicsData.size = this.parent.physicsData.size / 8;
            this.damagePerTick = 0;
        }
        super.tick(tick);
    }
}
exports.default = RopeSegment;
