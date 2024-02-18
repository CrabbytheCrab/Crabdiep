"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
const Object_1 = require("../../Object");
const Live_1 = require("../../Live");
const AI_1 = require("../../AI");
const Entity_1 = require("../../../Native/Entity");
class Striker extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle, parent) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.collisionEnd = 0;
        this.target = null;
        this.movementSpeed = 1;
        this.aimSpeed = 1;
        this.inputs = new AI_1.Inputs();
        this.state = 0;
        this.doAimPrediction = false;
        this._findTargetInterval = 2;
        this.timer = 45;
        this._creationTick = this.game.tick;
        this.targetFilter = () => true;
        this.usePosAngle = true;
        this.usePosAngle = true;
        this.turn = this.movementAngle;
        const bulletDefinition = barrel.definition.bullet;
        this.parent = parent ?? tank;
        this.viewRange = 675;
        this.baseSpeed = (barrel.bulletAccel / 2) + 30 - Math.random() * barrel.definition.bullet.scatterRate;
        this.baseAccel = 0;
        this.physicsData.values.sides = bulletDefinition.sides ?? 6;
        if (this.physicsData.values.flags & 8)
            this.physicsData.values.flags ^= 8;
        this.physicsData.values.flags |= 32;
        this.styleData.values.flags &= ~128;
        this.collisionEnd = this.lifeLength >> 3;
        this.lifeLength = (600 * barrel.definition.bullet.lifeLength) >> 3;
        if (tankDefinition && tankDefinition.id === -4)
            this.collisionEnd = this.lifeLength - 1;
        this.movementSpeed = this.aimSpeed = this.baseAccel;
    }
    onKill(killedEntity) {
        if (typeof this.parent.onKill === 'function')
            this.parent.onKill(killedEntity);
    }
    findTarget(tick) {
        if (this._findTargetInterval !== 0 && ((tick + this._creationTick) % this._findTargetInterval) !== 1) {
            return this.target || null;
        }
        const rootPos = this.rootParent.positionData.values;
        const team = this.relationsData.values.team;
        if (Entity_1.Entity.exists(this.target)) {
            if (team !== this.target.relationsData.values.team && this.target.physicsData.values.sides !== 0) {
                const targetDistSq = (this.target.positionData.values.x - rootPos.x) ** 2 + (this.target.positionData.values.y - rootPos.y) ** 2;
                if (this.targetFilter(this.target.positionData.values) && targetDistSq < (this.viewRange ** 2) * 2)
                    return this.target;
            }
        }
        const root = this;
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
            if (entity.styleData.opacity < 0.5)
                continue;
            if (!this.targetFilter(entity.positionData.values))
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
        const ownerPos = this.getWorldPosition();
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
        super.tick(tick);
        this.isViewed = true;
        this.positionData.angle += 0.3;
        const usingAI = this.tank.inputs.deleted || (!this.tank.inputs.attemptingRepel());
        const inputs = !usingAI ? this.tank.inputs : this.inputs;
        const target = this.findTarget(tick);
        this.timer--;
        if (target && !this.tank.inputs.attemptingRepel()) {
            this.state = 1;
            this.inputs.flags |= 1;
            this.aimAt(target);
            this.movementAngle = Math.atan2(inputs.mouse.y - this.positionData.values.y, inputs.mouse.x - this.positionData.values.x);
        }
        if (this.timer == 0) {
            this.timer = 45;
            this.addAcceleration(this.movementAngle, this.baseSpeed * 1.5);
        }
        else if (this.tank.inputs.attemptingRepel()) {
            this.movementAngle = Math.atan2(this.tank.inputs.mouse.y - this.positionData.values.y, this.tank.inputs.mouse.x - this.positionData.values.x);
        }
        else {
            this.inputs.flags = 0;
            this.state = 0;
            const base = this.baseAccel;
        }
        if (tick - this.spawnTick === this.collisionEnd) {
            if (this.physicsData.values.flags & 32)
                this.physicsData.flags ^= 32;
            this.physicsData.values.flags |= 8;
        }
    }
}
exports.default = Striker;
