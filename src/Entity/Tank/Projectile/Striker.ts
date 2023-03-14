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
import TankBody, { BarrelBase } from "../TankBody";
import { DevTank } from "../../../Const/DevTankDefinitions";
import { PI2 } from "../../../util";
import ObjectEntity from "../../Object";
import LivingEntity from "../../Live";
import { AI, AIState, Inputs } from "../../AI";
import { VectorAbstract } from "../../../Physics/Vector";
import { Entity } from "../../../Native/Entity";

/**
 * The trap class represents the trap (projectile) entity in diep.
 */
export default class Striker extends Bullet {
    /** Number of ticks before the trap cant collide with its own team. */
    protected collisionEnd = 0;
    protected parent: ObjectEntity;
public timer: number
public turn: number
public target: ObjectEntity | null = null;
public targetFilter: (possibleTargetPos: VectorAbstract) => boolean;
public viewRange: number
private _creationTick: number;
public movementSpeed = 1;
/** The speed at which the ai can reach the target. */
public aimSpeed = 1;
public inputs: Inputs = new Inputs();
public state = AIState.idle;

/** If the AI should predict enemy's movements, and aim accordingly. */
public doAimPrediction: boolean = false;
private _findTargetInterval: number = 2;
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number, parent?: ObjectEntity) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.timer = 45
        this._creationTick = this.game.tick;
        this.targetFilter = () => true;
        this.usePosAngle = true;
        this.usePosAngle = true;
        this.turn = this.movementAngle
        const bulletDefinition = barrel.definition.bullet;
        
        this.parent = parent ?? tank;
        this.viewRange = 675;
        this.baseSpeed = (barrel.bulletAccel / 2) + 30 - Math.random() * barrel.definition.bullet.scatterRate;
        this.baseAccel = 0;
        this.physicsData.values.sides = bulletDefinition.sides ?? 6;
        if (this.physicsData.values.flags & PhysicsFlags.noOwnTeamCollision) this.physicsData.values.flags ^= PhysicsFlags.noOwnTeamCollision;
        this.physicsData.values.flags |= PhysicsFlags.onlySameOwnerCollision;
      //  this.styleData.values.flags |= StyleFlags.isStar;
        this.styleData.values.flags &= ~StyleFlags.hasNoDmgIndicator;

        this.collisionEnd = this.lifeLength >> 3;
        this.lifeLength = (600 * barrel.definition.bullet.lifeLength) >> 3;
        if (tankDefinition && tankDefinition.id === DevTank.Bouncy) this.collisionEnd = this.lifeLength - 1;
        this.movementSpeed = this.aimSpeed = this.baseAccel;
        // Check this?
    }
    public onKill(killedEntity: LivingEntity) {
        // TODO(ABC):
        // Make this, work differently
        /** @ts-ignore */
        if (typeof this.parent.onKill === 'function') this.parent.onKill(killedEntity);
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
            if (entity instanceof TankBody) {
                if (!(closestEntity instanceof TankBody)) {
                    closestEntity = entity;
                    closestDistSq = (entity.positionData.values.x - rootPos.x) ** 2 + (entity.positionData.values.y - rootPos.y) ** 2;
                    continue;
                }
            } else if (closestEntity instanceof TankBody) continue;

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


    public tick(tick: number) {
        super.tick(tick);
        this.isViewed = true
        this.positionData.angle += 0.3
        const usingAI = this.tank.inputs.deleted || (!this.tank.inputs.attemptingRepel());
        const inputs = !usingAI ? this.tank.inputs : this.inputs;
        const target = this.findTarget(tick);

        this.timer --
       /* if(!this.ai.target){
           this.movementAngle =  this.turn 
        }*/
        if(target && !this.tank.inputs.attemptingRepel()){
            this.state = AIState.hasTarget;
            this.inputs.flags |= InputFlags.leftclick;
                this.aimAt(target);
        this.movementAngle = Math.atan2(inputs.mouse.y - this.positionData.values.y, inputs.mouse.x - this.positionData.values.x);}
        if(this.timer == 0){
            this.timer = 45
            this.addAcceleration(this.movementAngle, this.baseSpeed * 1.5);
            //this.turn = this.movementAngle
        }else if(this.tank.inputs.attemptingRepel()){
        this.movementAngle = Math.atan2(this.tank.inputs.mouse.y - this.positionData.values.y, this.tank.inputs.mouse.x - this.positionData.values.x);
        }else{
            this.inputs.flags = 0;
            this.state = AIState.idle;
            const base = this.baseAccel;
        }
        if (tick - this.spawnTick === this.collisionEnd) {
            if (this.physicsData.values.flags & PhysicsFlags.onlySameOwnerCollision) this.physicsData.flags ^= PhysicsFlags.onlySameOwnerCollision;
            this.physicsData.values.flags |= PhysicsFlags.noOwnTeamCollision;
        }
    }
}