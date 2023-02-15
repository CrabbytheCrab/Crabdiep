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

import { Color, InputFlags, PhysicsFlags, StyleFlags } from "../../../Const/Enums";
import { BarrelDefinition, TankDefinition } from "../../../Const/TankDefinitions";
import { Entity } from "../../../Native/Entity";
import { AI, AIState, Inputs } from "../../AI";
import { BarrelBase } from "../TankBody";
import { PI2 } from "../../../util";
import AutoTurret from "../AutoTurret";

/**
 * The drone class represents the drone (projectile) entity in diep.
 */

const MinionBarrelDefinition2: BarrelDefinition = {
    angle:  3.141592653589793,
    offset: 0,
    size: 72,
    width: 34,
    delay: 0,
    reload: 0.5,
    recoil: 1,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.4,
        damage: 0.1,
        speed: 0.8,
        scatterRate: 2,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const Bombshot1: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 0,
    width: 85,
    delay: 0,
    reload: 100,
    recoil: 1,
    isTrapezoid: false,
    trapezoidDirection: 0,
    forceFire: true,
    bulletdie: true,
    addon: null,
    bullet: {
        type: "bullet",
        health: 1.5,
        damage: 1,
        speed: 1.2,
        scatterRate: 0.3,
        lifeLength: 0.45,
        sizeRatio: 1,
        absorbtionFactor: 0.3
    }
};
export default class BombDrone extends Bullet  implements BarrelBase {
    
    /** The AI of the drone (for AI mode) */
    public ai: AI;

    /** The drone's radius of resting state */
    public static MAX_RESTING_RADIUS = 400 ** 2;

    /** Used let the drone go back to the player in time. */
    public restCycle = true;

    /** Cached prop of the definition. */
    protected canControlDrones: boolean;
    /** The size ratio of the rocket. */
    public sizeFactor: number;
    /** The camera entity (used as team) of the rocket. */
    public cameraEntity: Entity;
    /** The reload time of the rocket's barrel. */
    public reloadTime = 1;
    /** The inputs for when to shoot or not. (Rocket) */
    public inputs = new Inputs();
    public canexplode: boolean;
    public primetimer: number;
        public canexploded: boolean;
    public death: boolean;
    public primetimer2: number;
    public skimmerBarrels: Barrel[];
    private minionBarrel: Barrel;
    public boom: boolean;
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.cameraEntity = tank.cameraEntity;

        const bulletDefinition = barrel.definition.bullet;
        this.canexploded = true
        this.usePosAngle = true;
        this.minionBarrel = new Barrel(this, MinionBarrelDefinition2)

        this.ai = new AI(this);
        this.ai.viewRange = 850 * tank.sizeFactor;
        this.ai.targetFilter = (targetPos) => (targetPos.x - this.tank.positionData.values.x) ** 2 + (targetPos.y - this.tank.positionData.values.y) ** 2 <= this.ai.viewRange ** 2; // (1000 ** 2) 1000 radius
        this.canControlDrones = typeof this.barrelEntity.definition.canControlDrones === 'boolean' && this.barrelEntity.definition.canControlDrones;
        this.physicsData.values.sides = bulletDefinition.sides ?? 3;
        this.physicsData.values.size *= 1.2;
        this.canexplode = false
        this.death = true
        this.boom = false 
       this.sizeFactor = this.physicsData.values.size / 50;

        this.primetimer2 = 0
        this.skimmerBarrels =[];
        this.primetimer = 0
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

        this.physicsData.values.pushFactor = 4;
        this.physicsData.values.absorbtionFactor = bulletDefinition.absorbtionFactor;

        this.baseSpeed /= 3;

        barrel.droneCount += 1;

        this.ai.movementSpeed = this.ai.aimSpeed = this.baseAccel;
        

        const atuo = new AutoTurret(this, {
            angle: 0,
            offset: 0,
            size: 0,
            width: 0,
            delay: 0.01,
            reload: 1.75,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            droneCount: 0,
            bullet: {
                type: "drone",
                sizeRatio: 1,
                health: 0.75,
                damage: 0.5,
                speed: 1,
                scatterRate: 1,
                lifeLength: 0.75,
                absorbtionFactor: 0.1
            }
        });
            atuo.baseSize *= 1.25
            atuo.positionData.values.angle = shootAngle
        //atuo.ai.passiveRotation = this.movementAngle
        atuo.styleData.values.flags |= StyleFlags.showsAboveParent;
        atuo.ai.viewRange = 0
        atuo.styleData.color = Color.Border
        const tickBase = atuo.tick;
        atuo.tick = (tick: number) => {
            if(this.canexplode == false){
                    this.primetimer++
                    if(this.primetimer == 60){
                        this.canexplode = true
                        atuo.styleData.color = Color.Box
    
                    } 
                }
            tickBase.call(atuo, tick);
        }
    }

    /** Extends LivingEntity.destroy - so that the drone count decreases for the barrel. */
    public destroy(animate=true) {
        if (!animate) this.barrelEntity.droneCount -= 1;
        if(this.canexplode == true){
            this.canexplode = false
                this.inputs = new Inputs();
                this.inputs.flags |= InputFlags.leftclick;
                    const skimmerBarrels: Barrel[] = this.skimmerBarrels =[]
                    for (let n = 0; n < 8; n++) {
                        const barr = new Barrel(this, {
                         ...Bombshot1,
                         angle: PI2 * (n / 8)
                     });
                     barr.physicsData.values.sides = 0
                     skimmerBarrels.push(barr);
             
                     } 
        }
        super.destroy(animate);
    }
    
    /** This allows for factory to hook in before the entity moves. */
    protected tickMixin(tick: number) {
        super.tick(tick);
    }

    public tick(tick: number) {
        const usingAI = !this.canControlDrones || this.tank.inputs.deleted || (!this.tank.inputs.attemptingShot() && !this.tank.inputs.attemptingRepel());
        const inputs = !usingAI ? this.tank.inputs : this.ai.inputs;

        if (usingAI && this.ai.state === AIState.idle) {
            const delta = {
                x: this.positionData.values.x - this.tank.positionData.values.x,
                y: this.positionData.values.y - this.tank.positionData.values.y
            }
            const base = this.baseAccel;

            // still a bit inaccurate, works though
            let unitDist = (delta.x ** 2 + delta.y ** 2) / BombDrone.MAX_RESTING_RADIUS;
            if (unitDist <= 1 && this.restCycle) {
                this.baseAccel /= 6;
                this.positionData.angle += 0.01 + 0.012 * unitDist;
            } else {
                const offset = Math.atan2(delta.y, delta.x) + Math.PI / 2
                delta.x = this.tank.positionData.values.x + Math.cos(offset) * this.tank.physicsData.values.size * 1.2 - this.positionData.values.x;
                delta.y = this.tank.positionData.values.y + Math.sin(offset) * this.tank.physicsData.values.size * 1.2 - this.positionData.values.y;
                this.positionData.angle = Math.atan2(delta.y, delta.x);
                if (unitDist < 0.5) this.baseAccel /= 3;
                this.restCycle = (delta.x ** 2 + delta.y ** 2) <= 4 * (this.tank.physicsData.values.size ** 2);
            }

            if (!Entity.exists(this.barrelEntity)) this.destroy();

            this.tickMixin(tick);

            this.baseAccel = base;

            return;
        } else {
            this.positionData.angle = Math.atan2(inputs.mouse.y - this.positionData.values.y, inputs.mouse.x - this.positionData.values.x);
            this.restCycle = false
        }


        
        if (this.canControlDrones && inputs.attemptingRepel()) {
            //this.positionData.angle += Math.PI; 
        }

        // So that switch tank works, as well as on death
        if (!Entity.exists(this.barrelEntity)) this.destroy();
        if(this.canexploded){
            if(this.tank.inputs.attemptingRepel() && this.canexplode == true){
                        this.canexploded = false
                    this.destroy()
  
            this.boom = true
            }
        }
        this.tickMixin(tick);
    }
}
