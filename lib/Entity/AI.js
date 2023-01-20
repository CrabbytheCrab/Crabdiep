"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AI = exports.Inputs = void 0;
const Vector_1 = require("../Physics/Vector");
const Live_1 = require("./Live");
const Object_1 = require("./Object");
const TankBody_1 = require("./Tank/TankBody");
const Entity_1 = require("../Native/Entity");
class Inputs {
    constructor() {
        this.flags = 0;
        this.mouse = new Vector_1.default();
        this.movement = new Vector_1.default();
        this.deleted = false;
    }
    attemptingShot() {
        return !!(this.flags & 1);
    }
    attemptingRepel() {
        return !!(this.flags & 128);
    }
}
exports.Inputs = Inputs;
class AI {
    constructor(owner, claimable) {
        this.isClaimable = false;
        this.passiveRotation = Math.random() < .5 ? AI.PASSIVE_ROTATION : -AI.PASSIVE_ROTATION;
        this.viewRange = 1700;
        this.state = 0;
        this.inputs = new Inputs();
        this.target = null;
        this.movementSpeed = 1;
        this.aimSpeed = 1;
        this.doAimPrediction = false;
        this._findTargetInterval = 2;
        this.owner = owner;
        this.game = owner.game;
        this._creationTick = this.game.tick;
        this.inputs.mouse.set({
            x: 20,
            y: 0
        });
        this.targetFilter = () => true;
        if (claimable)
            this.isClaimable = true;
        this.game.entities.AIs.push(this);
    }
    findTarget(tick) {
        if (this._findTargetInterval !== 0 && ((tick + this._creationTick) % this._findTargetInterval) !== 1) {
            return this.target || null;
        }
        const rootPos = this.owner.rootParent.positionData.values;
        const team = this.owner.relationsData.values.team;
        if (Entity_1.Entity.exists(this.target)) {
            if (team !== this.target.relationsData.values.team && this.target.physicsData.values.sides !== 0) {
                const targetDistSq = (this.target.positionData.values.x - rootPos.x) ** 2 + (this.target.positionData.values.y - rootPos.y) ** 2;
                if (this.targetFilter(this.target.positionData.values, this.target.relationsData.team) && targetDistSq < (this.viewRange ** 2) * 2)
                    return this.target;
            }
        }
        const root = this.owner.rootParent === this.owner && this.owner.relationsData.values.owner instanceof Object_1.default ? this.owner.relationsData.values.owner : this.owner.rootParent;
        const entities = this.viewRange === Infinity ? this.game.entities.inner.slice(0, this.game.entities.lastId) : this.game.entities.collisionManager.retrieve(root.positionData.values.x, root.positionData.values.y, this.viewRange, this.viewRange);
        let closestEntity = null;
        let closestDistSq = this.viewRange ** 2;
        for (let i = 0; i < entities.length; ++i) {
            const entity = entities[i];
            if (!(entity instanceof Live_1.default))
                continue;
            if (entity.physicsData.values.flags & 64)
                continue;
            if (!(entity.relationsData.values.owner === null || !(entity.relationsData.values.owner instanceof Object_1.default)))
                continue;
            if (entity.relationsData.values.team === team || entity.physicsData.values.sides === 0)
                continue;
            if (!this.targetFilter(entity.positionData.values, entity.relationsData.team))
                continue;
            if (entity instanceof TankBody_1.default) {
                if (!(closestEntity instanceof TankBody_1.default)) {
                    closestEntity = entity;
                    closestDistSq = (entity.positionData.values.x - rootPos.x) ** 2 + (entity.positionData.values.y - rootPos.y) ** 2;
                    continue;
                }
            }
            else if (closestEntity instanceof TankBody_1.default)
                continue;
            const distSq = (entity.positionData.values.x - rootPos.x) ** 2 + (entity.positionData.values.y - rootPos.y) ** 2;
            if (distSq < closestDistSq) {
                closestEntity = entity;
                closestDistSq = distSq;
            }
        }
        return this.target = closestEntity;
    }
    aimAt(target) {
        const movementSpeed = this.aimSpeed * 1.6;
        const ownerPos = this.owner.getWorldPosition();
        const pos = {
            x: target.positionData.values.x,
            y: target.positionData.values.y,
        };
        if (movementSpeed <= 0.001) {
            this.inputs.movement.set({
                x: pos.x - ownerPos.x,
                y: pos.y - ownerPos.y
            });
            this.inputs.mouse.set(pos);
            this.inputs.movement.magnitude = 1;
            return;
        }
        if (this.doAimPrediction) {
            const delta = {
                x: pos.x - ownerPos.x,
                y: pos.y - ownerPos.y
            };
            let dist = Math.sqrt(delta.x ** 2 + delta.y ** 2);
            if (dist === 0)
                dist = 1;
            const unitDistancePerp = {
                x: delta.y / dist,
                y: -delta.x / dist
            };
            let entPerpComponent = unitDistancePerp.x * target.velocity.x + unitDistancePerp.y * target.velocity.y;
            if (entPerpComponent > movementSpeed * 0.9)
                entPerpComponent = movementSpeed * 0.9;
            if (entPerpComponent < movementSpeed * -0.9)
                entPerpComponent = movementSpeed * -0.9;
            const directComponent = Math.sqrt(movementSpeed ** 2 - entPerpComponent ** 2);
            const offset = (entPerpComponent / directComponent * dist) / 2;
            this.inputs.mouse.set({
                x: pos.x + offset * unitDistancePerp.x,
                y: pos.y + offset * unitDistancePerp.y
            });
        }
        else {
            this.inputs.mouse.set({
                x: pos.x,
                y: pos.y
            });
        }
        this.inputs.movement.magnitude = 1;
        this.inputs.movement.angle = Math.atan2(this.inputs.mouse.y - ownerPos.y, this.inputs.mouse.x - ownerPos.x);
    }
    tick(tick) {
        if (this.state === 3) {
            if (!this.inputs.deleted)
                return;
            this.inputs = new Inputs();
        }
        const target = this.findTarget(tick);
        if (!target) {
            this.inputs.flags = 0;
            this.state = 0;
            const angle = this.inputs.mouse.angle + this.passiveRotation;
            this.inputs.mouse.set({
                x: Math.cos(angle) * 100,
                y: Math.sin(angle) * 100
            });
        }
        else {
            this.state = 1;
            this.inputs.flags |= 1;
            this.aimAt(target);
        }
    }
}
exports.AI = AI;
AI.PASSIVE_ROTATION = 0.01;
