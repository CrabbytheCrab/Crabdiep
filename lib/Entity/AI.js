"use strict";
/*
    DiepCustom - custom tank game server that shares diep.io's WebSocket protocol
    Copyright (C) 2022 ABCxFF (github.com/ABCxFF)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <https://www.gnu.org/licenses/>
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.AI = exports.Inputs = exports.AIState = void 0;
const Vector_1 = require("../Physics/Vector");
const Live_1 = require("./Live");
const Object_1 = require("./Object");
const TankBody_1 = require("./Tank/TankBody");
const Enums_1 = require("../Const/Enums");
const Entity_1 = require("../Native/Entity");
// Beware
// The logic in this file is somewhat messed up
/**
 * Used for simplifying the current state of the AI.
 * - `idle`: When the AI is idle
 * - `target`: When the AI has found a target
 */
var AIState;
(function (AIState) {
    AIState[AIState["idle"] = 0] = "idle";
    AIState[AIState["hasTarget"] = 1] = "hasTarget";
    AIState[AIState["possessed"] = 3] = "possessed";
})(AIState = exports.AIState || (exports.AIState = {}));
/**
 * Inputs are the shared thing between AIs and Clients. Both use inputs
 * and both can replace eachother.
 */
class Inputs {
    constructor() {
        /**
         * InputFlags.
         */
        this.flags = 0;
        /** Mouse position */
        this.mouse = new Vector_1.default();
        /** Movement direction */
        this.movement = new Vector_1.default();
        /** Whether the inputs are deleted or not. */
        this.deleted = false;
    }
    attemptingShot() {
        return !!(this.flags & Enums_1.InputFlags.leftclick);
    }
    attemptingRepel() {
        return !!(this.flags & Enums_1.InputFlags.rightclick);
    }
}
exports.Inputs = Inputs;
/**
 * The Intelligence behind Auto Turrets.
 */
class AI {
    constructor(owner) {
        /** Whether or not the AI is available for taking... */
        this.isTaken = false;
        /** Specific rotation of the AI in passive mode. */
        this.passiveRotation = Math.random() < .5 ? AI.PASSIVE_ROTATION : -AI.PASSIVE_ROTATION;
        /** View range in diep units. */
        this.viewRange = 1700;
        /** The state of the AI. */
        this.state = AIState.idle;
        /** The inputs, which are more like outputs for the AI. */
        this.inputs = new Inputs();
        /** The AI's target. */
        this.target = null;
        /** The speed at which the ai's owner can move. */
        this.movementSpeed = 1;
        /** The speed at which the ai can reach the target. */
        this.aimSpeed = 1;
        this.owner = owner;
        this.game = owner.game;
        this.inputs.mouse.set({
            x: 20,
            y: 0
        });
        this.targetFilter = () => true;
        this.game.entities.AIs.push(this);
    }
    /* Finds the closest entity in a different team */
    findTarget() {
        const rootPos = this.owner.rootParent.position.values;
        const team = this.owner.relations.values.team;
        if (Entity_1.Entity.exists(this.target)) {
            // If the AI already has a valid target within view distance, it's not necessary to find a new one
            // Make sure the target hasn't changed teams, and is existant (sides != 0)
            if (team !== this.target.relations.values.team && this.target.physics.values.sides !== 0) {
                // confirm its within range
                const targetDistSq = (this.target.position.values.x - rootPos.x) ** 2 + (this.target.position.values.y - rootPos.y) ** 2;
                if (this.targetFilter(this.target) && targetDistSq < (this.viewRange ** 2) * 2)
                    return this.target; // this range is inaccurate i think
            }
        }
        // const entities = this.game.entities.inner.slice(0, this.game.entities.lastId);
        const root = this.owner.rootParent === this.owner && this.owner.relations.values.owner instanceof Object_1.default ? this.owner.relations.values.owner : this.owner.rootParent;
        const entities = this.viewRange === Infinity ? this.game.entities.inner.slice(0, this.game.entities.lastId) : this.game.entities.collisionManager.retrieve(root.position.values.x, root.position.values.y, this.viewRange, this.viewRange);
        let closestEntity = null;
        let closestDistSq = this.viewRange ** 2;
        for (let i = 0; i < entities.length; ++i) {
            const entity = entities[i];
            if (!(entity instanceof Live_1.default))
                continue; // Check if the target is living
            if (entity.physics.values.objectFlags & Enums_1.ObjectFlags.base)
                continue; // Check if the target is a base
            if (!(entity.relations.values.owner === null || !(entity.relations.values.owner instanceof Object_1.default)))
                continue; // Don't target entities who have an object owner
            if (entity.relations.values.team === team || entity.physics.values.sides === 0)
                continue;
            if (!this.targetFilter(entity))
                continue; // Custom check
            if (entity instanceof TankBody_1.default)
                return this.target = entity;
            const distSq = (entity.position.values.x - rootPos.x) ** 2 + (entity.position.values.y - rootPos.y) ** 2;
            if (distSq < closestDistSq) {
                closestEntity = entity;
                closestDistSq = distSq;
            }
        }
        return this.target = closestEntity;
    }
    /** Aims and predicts at the target. */
    aimAt(target) {
        const movementSpeed = this.aimSpeed * 1.6;
        const ownerPos = this.owner.getWorldPosition();
        const pos = {
            x: target.position.values.x,
            y: target.position.values.y,
        };
        if (movementSpeed <= 0.001) { // Pls no weirdness
            this.inputs.movement.set({
                x: pos.x - ownerPos.x,
                y: pos.y - ownerPos.y
            });
            this.inputs.mouse.set(pos);
            // this.inputs.movement.angle = Math.atan2(delta.y, delta.x);
            this.inputs.movement.magnitude = 1;
            return;
        }
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
        const offset = (entPerpComponent / directComponent * dist) / 32;
        this.inputs.mouse.set({
            x: pos.x + offset * unitDistancePerp.x,
            y: pos.y + offset * unitDistancePerp.y
        });
        this.inputs.movement.magnitude = 1;
        this.inputs.movement.angle = Math.atan2(this.inputs.mouse.y - ownerPos.y, this.inputs.mouse.x - ownerPos.x);
    }
    tick(tick) {
        // If its being posessed, but its possessor is deleted... then just restart;
        if (this.state === AIState.possessed) {
            if (!this.inputs.deleted)
                return;
            this.inputs = new Inputs();
            this.isTaken = false; // Only possessed when not taken
        }
        const target = this.findTarget();
        if (!target) {
            this.inputs.flags = 0;
            this.state = AIState.idle;
            const angle = this.inputs.mouse.angle + this.passiveRotation;
            this.inputs.mouse.set({
                x: Math.cos(angle) * 100,
                y: Math.sin(angle) * 100
            });
        }
        else {
            this.state = AIState.hasTarget;
            this.inputs.flags |= Enums_1.InputFlags.leftclick;
            this.aimAt(target);
        }
    }
}
exports.AI = AI;
/** Default static rotation that Auto Turrets rotate when in passive mode. */
AI.PASSIVE_ROTATION = 0.01;
