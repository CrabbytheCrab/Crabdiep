"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("../util");
const Velocity_1 = require("../Physics/Velocity");
const Vector_1 = require("../Physics/Vector");
const FieldGroups_1 = require("../Native/FieldGroups");
const Entity_1 = require("../Native/Entity");
class DeletionAnimation {
    constructor(entity) {
        this.frame = 5;
        this.entity = entity;
    }
    tick() {
        if (this.frame === -1)
            throw new Error("Animation failed. Entity should be gone by now");
        switch (this.frame) {
            case 0: {
                this.entity.destroy(false);
                this.frame = -1;
                return;
            }
            case 5:
                this.entity.styleData.opacity = 1 - (1 / 6);
            default:
                this.entity.physicsData.size *= 1.1;
                this.entity.styleData.opacity -= 1 / 6;
                if (this.entity.styleData.values.opacity < 0)
                    this.entity.styleData.opacity = 0;
                break;
        }
        this.frame -= 1;
    }
}
class ObjectEntity extends Entity_1.Entity {
    constructor(game) {
        super(game);
        this.relationsData = new FieldGroups_1.RelationsGroup(this);
        this.physicsData = new FieldGroups_1.PhysicsGroup(this);
        this.positionData = new FieldGroups_1.PositionGroup(this);
        this.styleData = new FieldGroups_1.StyleGroup(this);
        this.deletionAnimation = null;
        this.isPhysical = true;
        this.isChild = false;
        this.children = [];
        this.rootParent = this;
        this.isViewed = false;
        this.velocity = new Velocity_1.default();
        this.accel = new Vector_1.default();
        this._queryId = -1;
        this.cachedCollisions = [];
        this.cachedTick = 0;
        this.styleData.zIndex = game.entities.zIndex++;
    }
    onKill(entity) { }
    destroy(animate = true) {
        if (!animate) {
            if (this.deletionAnimation)
                this.deletionAnimation = null;
            this.delete();
        }
        else if (!this.deletionAnimation) {
            this.deletionAnimation = new DeletionAnimation(this);
        }
    }
    delete() {
        if (this.isChild) {
            util.removeFast(this.rootParent.children, this.rootParent.children.indexOf(this));
        }
        else {
            for (const child of this.children) {
                child.isChild = false;
                child.delete();
            }
            this.children = [];
        }
        super.delete();
    }
    addAcceleration(angle, acceleration, negateFriction = false) {
        if (negateFriction) {
            const frictionComponent = this.velocity.angleComponent(angle) * .1;
            acceleration += frictionComponent;
        }
        this.accel.add(Vector_1.default.fromPolar(angle, acceleration));
    }
    setVelocity(angle, magnitude) {
        this.velocity.setPosition(this.positionData.values);
        this.velocity.set(Vector_1.default.fromPolar(angle, magnitude));
    }
    maintainVelocity(angle, maxSpeed) {
        this.accel.add(Vector_1.default.fromPolar(angle, maxSpeed * 0.1));
    }
    applyPhysics() {
        if (!this.isViewed) {
            this.accel.set(new Vector_1.default(0, 0));
            return;
        }
        this.addAcceleration(this.velocity.angle, this.velocity.magnitude * -0.1);
        this.velocity.add(this.accel);
        if (this.velocity.magnitude < 0.01)
            this.velocity.magnitude = 0;
        else if (this.deletionAnimation)
            this.velocity.magnitude /= 2;
        this.positionData.x += this.velocity.x;
        this.positionData.y += this.velocity.y;
        this.accel.set(new Vector_1.default(0, 0));
        if (!(this.physicsData.values.flags & 256)) {
            const arena = this.game.arena;
            xPos: {
                if (this.positionData.values.x < arena.arenaData.values.leftX - arena.ARENA_PADDING)
                    this.positionData.x = arena.arenaData.values.leftX - arena.ARENA_PADDING;
                else if (this.positionData.values.x > arena.arenaData.values.rightX + arena.ARENA_PADDING)
                    this.positionData.x = arena.arenaData.values.rightX + arena.ARENA_PADDING;
                else
                    break xPos;
                this.velocity.position.x = this.positionData.values.x;
            }
            yPos: {
                if (this.positionData.values.y < arena.arenaData.values.topY - arena.ARENA_PADDING)
                    this.positionData.y = arena.arenaData.values.topY - arena.ARENA_PADDING;
                else if (this.positionData.values.y > arena.arenaData.values.bottomY + arena.ARENA_PADDING)
                    this.positionData.y = arena.arenaData.values.bottomY + arena.ARENA_PADDING;
                else
                    break yPos;
                this.velocity.position.y = this.positionData.values.y;
            }
        }
    }
    receiveKnockback(entity) {
        let kbMagnitude = this.physicsData.values.absorbtionFactor * entity.physicsData.values.pushFactor;
        let kbAngle;
        let diffY = this.positionData.values.y - entity.positionData.values.y;
        let diffX = this.positionData.values.x - entity.positionData.values.x;
        if (diffX === 0 && diffY === 0)
            kbAngle = Math.random() * util.PI2;
        else
            kbAngle = Math.atan2(diffY, diffX);
        if ((entity.physicsData.values.flags & 16 || entity.physicsData.values.flags & 64) && !(this.positionData.values.flags & 2)) {
            this.accel.magnitude *= 0.3;
            this.velocity.magnitude *= 0.3;
            kbMagnitude /= 0.3;
        }
        if (entity.physicsData.values.sides === 2) {
            if (this.positionData.values.flags & 2) {
                kbMagnitude = 0;
            }
            else if ((!(entity.physicsData.values.flags & 64) || entity.physicsData.values.pushFactor !== 0) && this.relationsData.values.owner instanceof ObjectEntity && !(Entity_1.Entity.exists(this.relationsData.values.team) && this.relationsData.values.team === entity.relationsData.values.team)) {
                this.velocity.setPosition(this.positionData.values);
                this.setVelocity(0, 0);
                this.destroy(true);
                return;
            }
            else {
                const relA = Math.cos(kbAngle + entity.positionData.values.angle) / entity.physicsData.values.size;
                const relB = Math.sin(kbAngle + entity.positionData.values.angle) / entity.physicsData.values.width;
                if (Math.abs(relA) <= Math.abs(relB)) {
                    if (relB < 0) {
                        this.addAcceleration(Math.PI * 3 / 2, kbMagnitude);
                    }
                    else {
                        this.addAcceleration(Math.PI * 1 / 2, kbMagnitude);
                    }
                }
                else {
                    if (relA < 0) {
                        this.addAcceleration(Math.PI, kbMagnitude);
                    }
                    else {
                        this.addAcceleration(0, kbMagnitude);
                    }
                }
            }
        }
        else {
            this.addAcceleration(kbAngle, kbMagnitude);
        }
    }
    findCollisions() {
        if (this.cachedTick === this.game.tick)
            return this.cachedCollisions;
        this.cachedTick = this.game.tick;
        this.cachedCollisions = [];
        if (this.hash === 0)
            return [];
        if (this.physicsData.values.sides === 0)
            return [];
        const entities = this.game.entities.collisionManager.retrieveEntitiesByEntity(this);
        for (let i = 0; i < entities.length; ++i) {
            const entity = entities[i];
            if (entity === this)
                continue;
            if (entity.deletionAnimation)
                continue;
            if (entity.relationsData.values.team === this.relationsData.values.team) {
                if ((entity.physicsData.values.flags & 8) ||
                    (this.physicsData.values.flags & 8))
                    continue;
                if (entity.relationsData.values.owner !== this.relationsData.values.owner) {
                    if ((entity.physicsData.values.flags & 32) ||
                        (this.physicsData.values.flags & 32))
                        continue;
                }
            }
            if (this.relationsData.values.team === this.game.arena && (entity.physicsData.values.flags & 64))
                continue;
            if (entity.physicsData.values.sides === 0)
                continue;
            if (entity.physicsData.values.sides === 2 && this.physicsData.values.sides === 2) {
            }
            else if (this.physicsData.values.sides !== 2 && entity.physicsData.values.sides === 2) {
                const dX = util.constrain(this.positionData.values.x, entity.positionData.values.x - entity.physicsData.values.size / 2, entity.positionData.values.x + entity.physicsData.values.size / 2) - this.positionData.values.x;
                const dY = util.constrain(this.positionData.values.y, entity.positionData.values.y - entity.physicsData.values.width / 2, entity.positionData.values.y + entity.physicsData.values.width / 2) - this.positionData.values.y;
                if (dX ** 2 + dY ** 2 <= this.physicsData.size ** 2)
                    this.cachedCollisions.push(entity);
            }
            else if (this.physicsData.values.sides === 2 && entity.physicsData.values.sides !== 2) {
                const dX = util.constrain(entity.positionData.values.x, this.positionData.values.x - this.physicsData.values.size / 2, this.positionData.values.x + this.physicsData.values.size / 2) - entity.positionData.values.x;
                const dY = util.constrain(entity.positionData.values.y, this.positionData.values.y - this.physicsData.values.width / 2, this.positionData.values.y + this.physicsData.values.width / 2) - entity.positionData.values.y;
                if (dX ** 2 + dY ** 2 <= entity.physicsData.size ** 2)
                    this.cachedCollisions.push(entity);
            }
            else {
                if ((entity.positionData.values.x - this.positionData.values.x) ** 2 + (entity.positionData.values.y - this.positionData.values.y) ** 2 <= (entity.physicsData.values.size + this.physicsData.values.size) ** 2) {
                    this.cachedCollisions.push(entity);
                }
            }
        }
        return this.cachedCollisions;
    }
    setParent(parent) {
        this.relationsData.parent = parent;
        this.rootParent = parent.rootParent;
        this.rootParent.children.push(this);
        this.isChild = true;
        this.isPhysical = false;
    }
    getWorldPosition() {
        let pos = new Vector_1.default(this.positionData.values.x, this.positionData.values.y);
        let entity = this;
        while (entity.relationsData.values.parent instanceof ObjectEntity) {
            if (!(entity.relationsData.values.parent.positionData.values.flags & 1))
                pos.angle += entity.positionData.values.angle;
            entity = entity.relationsData.values.parent;
            pos.x += entity.positionData.values.x;
            pos.y += entity.positionData.values.y;
        }
        return pos;
    }
    tick(tick) {
        this.velocity.setPosition(this.positionData.values);
        this.deletionAnimation?.tick();
        if (this.isPhysical && !(this.deletionAnimation)) {
            const collidedEntities = this.findCollisions();
            for (let i = 0; i < collidedEntities.length; ++i) {
                this.receiveKnockback(collidedEntities[i]);
            }
        }
        if (this.isViewed)
            for (let i = 0; i < this.children.length; ++i)
                this.children[i].tick(tick);
    }
}
exports.default = ObjectEntity;
