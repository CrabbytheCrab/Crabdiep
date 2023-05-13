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

import LivingEntity from "../../Live";
import Barrel from "../Barrel";

import { HealthFlags, PositionFlags, PhysicsFlags, Stat, StyleFlags, InputFlags } from "../../../Const/Enums";
import { TankDefinition } from "../../../Const/TankDefinitions";
import TankBody, { BarrelBase } from "../TankBody";
import { Entity, EntityStateFlags } from "../../../Native/Entity";
import ObjectEntity from "../../Object";
import Bullet from "./Bullet";
import { AI, AIState, Inputs } from "../../AI";
import { VectorAbstract } from "../../../Physics/Vector";

/**
 * The bullet class represents the bullet entity in diep.
 */
export default class HomingBullet extends Bullet {
    /** The barrel that the bullet is being shot from. */
    public inputs: Inputs = new Inputs();
    public target: ObjectEntity | null = null;
    public targetFilter: (possibleTargetPos: VectorAbstract) => boolean;
    public viewRange: number
    private _creationTick: number;
    public state = AIState.idle;
    public movementSpeed = 10000;
    public static DECTECTRANGE = 300 ** 2;

    public aimSpeed = 1000;
    /** If the AI should predict enemy's movements, and aim accordingly. */
    public doAimPrediction: boolean = false;
    private _findTargetInterval: number = 2;
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number, parent?: ObjectEntity) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.usePosAngle = true;
        this.viewRange = 450 * tank.sizeFactor
        this._creationTick = this.game.tick;
        this.targetFilter = () => true;
       // this.movementSpeed = this.aimSpeed = this.baseAccel;

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
        const target = this.findTarget(tick);
        if (!target) {
            this.state = AIState.idle;
            const base = this.baseAccel;

            this.baseAccel = base;


        this.tickMixin(tick);
            
            return;
            
        }
        if(target){
            this.state = AIState.hasTarget;
            //this.aimAt(target);
            const dist = (target.positionData.y - this.positionData.y) ** 2 + (target.positionData.x - this.positionData.x) ** 2
            if (dist > HomingBullet.DECTECTRANGE / 4) { // Half

            this.positionData.angle = Math.atan2(target.positionData.y - this.positionData.y, target.positionData.x - this.positionData.x);
            this.maintainVelocity(Math.atan2(target.positionData.y - this.positionData.y, target.positionData.x - this.positionData.x), this.baseAccel/2)
        }
    }
        this.tickMixin(tick);

    }
}
