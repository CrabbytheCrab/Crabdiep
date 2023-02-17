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

import { InputFlags, Tank } from "../../../Const/Enums";
import { PhysicsFlags, StyleFlags } from "../../../Const/Enums";
import {BarrelDefinition, TankDefinition } from "../../../Const/TankDefinitions";
import { Entity } from "../../../Native/Entity";
import { AI, AIState, Inputs } from "../../AI";
import { BarrelBase } from "../TankBody";
import { CameraEntity } from "../../../Native/Camera";

/**
 * The drone class represents the drone (projectile) entity in diep.
 */

const BoomBarrelDefinition: BarrelDefinition = {
    angle: Math.PI / 3 +  Math.PI / 6,
    offset: 0,
    size: 90,
    width: 49.578,
    delay: 0,
    reload: 0.325,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.3,
        damage: 2 / 5,
        speed: 0.8,
        scatterRate: 1,
        lifeLength: 0.25,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
export default class Boomerang extends Bullet  implements BarrelBase{
    /** The AI of the drone (for AI mode) */
    public static FOCUS_RADIUS = 850 ** 2;
    public ai: AI;
    private skimmerBarrels: Barrel[];
    //public def: TankDefinition | null;
    public boom: boolean = false
    public boom2: boolean = false
        public sizeFactor: number;
    /** The camera entity (used as team) of the rocket. */
    public cameraEntity: Entity;
    /** The reload time of the rocket's barrel. */
    public reloadTime = 1;
    /** The inputs for when to shoot or not. (Rocket) */
    public inputs = new Inputs();
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
      //  this.def = tankDefinition
        this.cameraEntity = tank.cameraEntity;
        this.sizeFactor = this.physicsData.values.size / 50;
        const bulletDefinition = barrel.definition.bullet;
        this.usePosAngle = false;
        if (this.physicsData.values.flags & PhysicsFlags.noOwnTeamCollision) this.physicsData.values.flags ^= PhysicsFlags.noOwnTeamCollision;
        this.physicsData.values.flags |= PhysicsFlags.onlySameOwnerCollision;
        this.ai = new AI(this);
        this.canControlDrones = typeof this.barrelEntity.definition.canControlDrones === 'boolean' && this.barrelEntity.definition.canControlDrones;
        this.physicsData.values.sides = bulletDefinition.sides ?? 5;
        if (this.physicsData.values.flags & PhysicsFlags.noOwnTeamCollision) this.physicsData.values.flags ^= PhysicsFlags.noOwnTeamCollision;
        this.physicsData.values.flags |= PhysicsFlags.onlySameOwnerCollision;
        this.styleData.values.flags &= ~StyleFlags.hasNoDmgIndicator;
        const skimmerBarrels: Barrel[] = this.skimmerBarrels =[];
            if ( tankDefinition && tankDefinition.id === Tank.Eroder){
                        const s1 = new class extends Barrel {
            // Keep the width constant
            protected resize() {
                super.resize();
               // this.physicsData.values.width = this.definition.width
                // this.physicsData.state.width = 0;
            }
        }(this, {...BoomBarrelDefinition});
        const s2Definition = {...BoomBarrelDefinition};
        s2Definition.angle += Math.PI/1.5
        const s2 = new class extends Barrel {
            // Keep the width constant
            protected resize() {
                super.resize();
                //this.physicsData.width = this.definition.width
            }
        }(this, s2Definition);
        const s3Definition = {...BoomBarrelDefinition};
        s3Definition.angle -= Math.PI/1.5
        const s3 = new class extends Barrel {
            // Keep the width constant
            protected resize() {
                super.resize();
                //this.physicsData.width = this.definition.width
            }
        }(this, s3Definition);

        skimmerBarrels.push(s1, s2,s3);

        this.inputs = new Inputs();
        this.inputs.flags |= InputFlags.leftclick;
        }
        // TOD(ABCO:
        // No hardcoded - unless it is hardcoded in diep (all signs show that it might be so far)
        this.deathAccelFactor = 1;

        this.physicsData.values.pushFactor = 4;
        this.physicsData.values.absorbtionFactor = bulletDefinition.absorbtionFactor;

        this.baseSpeed /= 3;

        barrel.droneCount += 1;

        this.ai.movementSpeed = this.ai.aimSpeed = this.baseAccel;
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
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;
        if (this.tankDefinition && this.tankDefinition.id === Tank.Orbiter){
            if(tick - this.spawnTick >= this.lifeLength/24 && this.boom == false){


                const delta = {
                    x: this.positionData.values.x - this.tank.positionData.values.x,
                    y: this.positionData.values.y - this.tank.positionData.values.y
                }
                const base = this.baseAccel;
                const dist = Math.atan2(delta.y, delta.x)

                if (dist < Boomerang.FOCUS_RADIUS / 4) { // Half
                    this.movementAngle = this.positionData.values.angle + Math.PI;
                } else if (dist < Boomerang.FOCUS_RADIUS) {
                   this.movementAngle = this.positionData.values.angle;
                } else this.movementAngle = this.positionData.values.angle;
                let unitDist = (delta.x ** 2 + delta.y ** 2) / Boomerang.MAX_RESTING_RADIUS;
                const offset = Math.atan2(delta.y, delta.x) + Math.PI / 2
                delta.x = this.tank.positionData.values.x + Math.cos(offset) * this.tank.physicsData.values.size * 3 - this.positionData.values.x;
                delta.y = this.tank.positionData.values.y + Math.sin(offset) * this.tank.physicsData.values.size * 3 - this.positionData.values.y;
                this.movementAngle = Math.atan2(delta.y, delta.x);
                
                if (unitDist < 0.1){
                    //this.movementAngle = this.positionData.values.angle + Math.PI;
                    // this.baseAccel /= 3;
                //this.destroy()
            }
                    this.baseAccel = base;

            }
        }else{
            if(tick - this.spawnTick >= this.lifeLength/8 && this.boom == false){
                if(this.boom2 == false){
                    this.boom2 = true
                this.baseAccel *= 1.5}
                const delta = {
                    x: this.positionData.values.x - this.tank.positionData.values.x,
                    y: this.positionData.values.y - this.tank.positionData.values.y
                }
                const base = this.baseAccel;
            
                let unitDist = (delta.x ** 2 + delta.y ** 2) / Boomerang.MAX_RESTING_RADIUS;
                const offset = Math.atan2(delta.y, delta.x) + Math.PI / 2
                delta.x = this.tank.positionData.values.x + Math.cos(offset) * this.tank.physicsData.values.size * 0.5 - this.positionData.values.x;
                delta.y = this.tank.positionData.values.y + Math.sin(offset) * this.tank.physicsData.values.size * 0.5 - this.positionData.values.y;
                this.movementAngle = Math.atan2(delta.y, delta.x);
                if (unitDist < 0.1){ this.baseAccel /= 3;
                this.destroy()}
                    this.baseAccel = base;

            }
         }
       if (this.tankDefinition && this.tankDefinition.id === Tank.Eroder) {
                    this.positionData.angle += 0.1;
        }else{
        this.positionData.angle += 0.3}
        super.tick(tick);
        // So that switch tank works, as well as on death

        this.tickMixin(tick);
    }
}
