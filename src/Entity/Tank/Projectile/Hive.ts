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

import Barrel from "../Barrel";
import Bullet from "./Bullet";

import { InputFlags, PhysicsFlags, StyleFlags } from "../../../Const/Enums";
import { TankDefinition } from "../../../Const/TankDefinitions";
import { Entity } from "../../../Native/Entity";
import { AI, AIState, Inputs } from "../../AI";
import TankBody, { BarrelBase } from "../TankBody";
import ObjectEntity from "../../Object";
import { VectorAbstract } from "../../../Physics/Vector";
import LivingEntity from "../../Live";

/**
 * The drone class represents the drone (projectile) entity in diep.
 */
export default class Hive extends Bullet {
    /** The AI of the drone (for AI mode) */

    /** The drone's radius of resting state */
    public static MAX_RESTING_RADIUS = 400 ** 2;
    public state = AIState.idle;
    public inputs: Inputs = new Inputs();

    /** Used let the drone go back to the player in time. */
    private restCycle = true;

    /** Cached prop of the definition. */
    protected canControlDrones: boolean;
    public target: ObjectEntity | null = null;
    public targetFilter: (possibleTargetPos: VectorAbstract) => boolean;
    public viewRange: number
    private _creationTick: number;
    public movementSpeed = 1;
    /** The speed at which the ai can reach the target. */
    public aimSpeed = 1;
    /** If the AI should predict enemy's movements, and aim accordingly. */
    public doAimPrediction: boolean = false;
    private _findTargetInterval: number = 2;
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel, tank, tankDefinition, shootAngle);

        const bulletDefinition = barrel.definition.bullet;
        this.viewRange = 900
        this._creationTick = this.game.tick;
        this.targetFilter = () => true;
        this.usePosAngle = true;
        
        //this.ai = new AI(this);
        this.viewRange = 900 * tank.sizeFactor;
        //this.ai.targetFilter = (targetPos) => (targetPos.x - this.positionData.x) ** 2 + (targetPos.y - this.positionData.y) ** 2 <= this.ai.viewRange ** 2; // (1000 ** 2) 1000 radius
        this.canControlDrones = typeof this.barrelEntity.definition.canControlDrones === 'boolean' && this.barrelEntity.definition.canControlDrones;
        this.physicsData.values.sides = bulletDefinition.sides ?? 3;
        if (this.physicsData.values.flags & PhysicsFlags.noOwnTeamCollision) this.physicsData.values.flags ^= PhysicsFlags.noOwnTeamCollision;
        this.physicsData.values.flags |= PhysicsFlags.onlySameOwnerCollision;
        this.styleData.values.flags &= ~StyleFlags.hasNoDmgIndicator;

        if (barrel.definition.bullet.lifeLength !== -1) {
            this.lifeLength = 88 * barrel.definition.bullet.lifeLength;
        } else {
            this.lifeLength = Infinity;
            if (this.physicsData.values.flags & PhysicsFlags.canEscapeArena) this.physicsData.values.flags ^= PhysicsFlags.canEscapeArena;
        }
        this.deathAccelFactor = 1;

        this.physicsData.values.pushFactor = 2;
        this.physicsData.values.absorbtionFactor = bulletDefinition.absorbtionFactor;

        this.baseSpeed /= 3;

        barrel.droneCount += 1;
        this.movementSpeed = this.aimSpeed = this.baseAccel;

        //this.ai.movementSpeed = this.ai.aimSpeed = this.baseAccel;
    }

    /** Extends LivingEntity.destroy - so that the drone count decreases for the barrel. */
    public destroy(animate=true) {
        if (!animate) this.barrelEntity.droneCount -= 1;

        super.destroy(animate);
    }
    

    public findTarget(tick: number) {
        // If there's a target interval, wait a cycle till looking for new target
        if (this._findTargetInterval !== 0 && ((tick + this._creationTick) % this._findTargetInterval) !== 1)  {
            return this.target || null;
        }

        const rootPos = this.rootParent.positionData.values;
        const team = this.relationsData.values.team;

        // TODO(speed): find a way to speed up
        if (Entity.exists(this.target)) {

            // If the AI already has a valid target within view distance, it's not necessary to find a new one

            // Make sure the target hasn't changed teams, and is existant (sides != 0)
            if (team !== this.target.relationsData.values.team && this.target.physicsData.values.sides !== 0) {
                // confirm its within range
                const targetDistSq = (this.target.positionData.values.x - rootPos.x) ** 2 + (this.target.positionData.values.y - rootPos.y) ** 2;
                if (this.targetFilter(this.target.positionData.values) && targetDistSq < (this.viewRange ** 2) * 2) return this.target; // this range is inaccurate i think

            }
        }

        // const entities = this.game.entities.inner.slice(0, this.game.entities.lastId);
        const root = this
        const entities = this.viewRange === Infinity ? this.game.entities.inner.slice(0, this.game.entities.lastId) : this.game.entities.collisionManager.retrieve(root.positionData.values.x, root.positionData.values.y, this.viewRange, this.viewRange);

        let closestEntity = null;
        let closestDistSq = this.viewRange ** 2;

        for (let i = 0; i < entities.length; ++i) {

            const entity = entities[i];

            if (!(entity instanceof LivingEntity)) continue; // Check if the target is living

            if (entity.physicsData.values.flags & PhysicsFlags.isBase) continue; // Check if the target is a base

            if (!(entity.relationsData.values.owner === null || !(entity.relationsData.values.owner instanceof ObjectEntity))) continue; // Don't target entities who have an object owner

            if (entity.relationsData.values.team === team || entity.physicsData.values.sides === 0) continue;

            if (!this.targetFilter(entity.positionData.values)) continue; // Custom check

            // TODO(ABC): Find out why this was put here
            /*if (entity instanceof TankBody) {
                if (!(closestEntity instanceof TankBody)) {
                    closestEntity = entity;
                    closestDistSq = (entity.positionData.values.x - rootPos.x) ** 2 + (entity.positionData.values.y - rootPos.y) ** 2;
                    continue;
                }
            } else if (closestEntity instanceof TankBody) continue;*/

            const distSq = (entity.positionData.values.x - rootPos.x) ** 2 + (entity.positionData.values.y - rootPos.y) ** 2;

            if (distSq < closestDistSq) {
                closestEntity = entity;
                closestDistSq = distSq;
            }
        }

        return this.target = closestEntity;
    }

    public aimAt(target: ObjectEntity) {

        const movementSpeed = this.aimSpeed * 1.6;
        const ownerPos = this.getWorldPosition();

        const pos = {
            x: target.positionData.values.x,
            y: target.positionData.values.y,
        }

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
        if (this.doAimPrediction) {
            const delta = {
                x: pos.x - ownerPos.x,
                y: pos.y - ownerPos.y
            }

            let dist = Math.sqrt(delta.x ** 2 + delta.y ** 2);
            if (dist === 0) dist = 1;

            const unitDistancePerp = {
                x: delta.y / dist,
                y: -delta.x / dist
            }

            let entPerpComponent = unitDistancePerp.x * target.velocity.x + unitDistancePerp.y * target.velocity.y;

            if (entPerpComponent > movementSpeed * 0.9) entPerpComponent = movementSpeed * 0.9;

            if (entPerpComponent < movementSpeed * -0.9) entPerpComponent = movementSpeed * -0.9;

            const directComponent = Math.sqrt(movementSpeed ** 2 - entPerpComponent ** 2);
            const offset = (entPerpComponent / directComponent * dist) / 2;

            this.inputs.mouse.set({
                x: pos.x + offset * unitDistancePerp.x,
                y: pos.y + offset * unitDistancePerp.y
            });

        } else {
            this.inputs.mouse.set({
                x: pos.x,
                y: pos.y
            });
        }

        this.inputs.movement.magnitude = 1;
        this.inputs.movement.angle = Math.atan2(this.inputs.mouse.y - ownerPos.y, this.inputs.mouse.x - ownerPos.x);
    }

    /** This allows for factory to hook in before the entity moves. */
    protected tickMixin(tick: number) {
        super.tick(tick);
    }

    public tick(tick: number) {
        super.tick(tick);
        const usingAI = !this.canControlDrones || this.tank.inputs.deleted || (!this.tank.inputs.attemptingShot() && !this.tank.inputs.attemptingRepel());
        const inputs = !usingAI ? this.tank.inputs : this.inputs;

            this.inputs = new Inputs();
            const target = this.findTarget(tick);

        if (!target) {
            this.inputs.flags = 0;
            this.state = AIState.idle;
            const base = this.baseAccel;

            // still a bit inaccurate, works though


            if (!Entity.exists(this.barrelEntity)) this.destroy();

            //this.tickMixin(tick);

            this.baseAccel = base;

            return;
        } else if(target){
            this.state = AIState.hasTarget;
            this.inputs.flags |= InputFlags.leftclick;
                this.aimAt(target);
                //this.positionData.angle = Math.atan2(inputs.mouse.y - this.positionData.values.y, inputs.mouse.x - this.positionData.values.x);
                this.restCycle = false


                const delta = {
                    x: this.positionData.values.x - target.positionData.values.x,
                    y: this.positionData.values.y - target.positionData.values.y
                }
                const base = this.baseAccel;
    
                // still a bit inaccurate, works though
                let unitDist = (delta.x ** 2 + delta.y ** 2) / Hive.MAX_RESTING_RADIUS;
                if (unitDist <= 1 && this.restCycle) {
                    //this.baseAccel /= 6;
                    this.positionData.angle += 0.01 + 0.04 * unitDist;
                } else {
                    const offset = Math.atan2(delta.y, delta.x) + Math.PI / 2
                    delta.x = target.positionData.values.x + Math.cos(offset) * target.physicsData.values.size * 0.5 - this.positionData.values.x;
                    delta.y = target.positionData.values.y + Math.sin(offset) * target.physicsData.values.size * 0.5 - this.positionData.values.y;
                    this.positionData.angle = Math.atan2(delta.y, delta.x);
                   // if (unitDist < 0.5) this.baseAccel /= 3;
                    this.restCycle = (delta.x ** 2 + delta.y ** 2) <= 4 * (target.physicsData.values.size ** 2);
                }
    
                if (!Entity.exists(this.barrelEntity)) this.destroy();
    
               // this.tickMixin(tick);
    
                this.baseAccel = base;
    
                return;
        }


        
        if (this.canControlDrones && inputs.attemptingRepel()) {
            this.positionData.angle += Math.PI; 
        }

        // So that switch tank works, as well as on death
        if (!Entity.exists(this.barrelEntity)) this.destroy();

        //this.tickMixin(tick);
    }
}
