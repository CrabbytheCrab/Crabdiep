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

import { ObjectFlags, StyleFlags } from "../../../Const/Enums";
import { TankDefinition } from "../../../Const/TankDefinitions";
import { Entity } from "../../../Native/Entity";
import { AI, AIState } from "../../AI";
import { BarrelBase } from "../TankBody";

/**
 * The drone class represents the drone (projectile) entity in diep.
 */
export default class Drone extends Bullet {
    /** The AI of the drone (for AI mode) */
    public ai: AI;
    public boom: boolean = false
    /** The drone's radius of resting state */
    public static MAX_RESTING_RADIUS = 400 ** 2;
    public static BASE_ROTATION = 0.1;
    //private rotationPerTick = Drone.BASE_ROTATION;
    /** Used let the drone go back to the player in time. */

    /** Cached prop of the definition. */
    protected canControlDrones: boolean;

    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel, tank, tankDefinition, shootAngle);
        //this.rotationPerTick = direction;
        const bulletDefinition = barrel.definition.bullet;
        this.usePosAngle = false;
        this.ai = new AI(this);
        this.canControlDrones = typeof this.barrelEntity.definition.canControlDrones === 'boolean' && this.barrelEntity.definition.canControlDrones;
        this.physics.values.sides = bulletDefinition.sides ?? 5;
        if (this.physics.values.objectFlags & ObjectFlags.noOwnTeamCollision) this.physics.values.objectFlags ^= ObjectFlags.noOwnTeamCollision;
        this.physics.values.objectFlags |= ObjectFlags.onlySameOwnerCollision;
        this.style.values.styleFlags &= ~StyleFlags.noDmgIndicator;

        // TOD(ABCO:
        // No hardcoded - unless it is hardcoded in diep (all signs show that it might be so far)
        this.deathAccelFactor = 1;

        this.physics.values.pushFactor = 4;
        this.physics.values.absorbtionFactor = bulletDefinition.absorbtionFactor;

        this.baseSpeed /= 3;

        barrel.droneCount += 1;

        this.ai.movementSpeed = this.ai.aimSpeed = this.baseAccel;
        this.ai.isTaken = true;
    }

    /** Extends LivingEntity.destroy - so that the drone count decreases for the barrel. */
    public destroy(animate=true) {
        if (!animate) this.barrelEntity.droneCount -= 1;

        super.destroy(animate);
    }
    
    /** This allows for factory to hook in before the entity moves. */
    protected tickMixin(tick: number) {
    }

    public tick(tick: number) {
        if(tick - this.spawnTick >= this.lifeLength/4 && this.boom == false){
            this.movementAngle += Math.PI
            this.boom = true
        }
        this.position.angle += 0.3
        super.tick(tick);
        // So that switch tank works, as well as on death
        if (!Entity.exists(this.barrelEntity)) this.destroy();

        this.tickMixin(tick);
    }
}
