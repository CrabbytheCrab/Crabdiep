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

import { InputFlags, PhysicsFlags, Stat, StyleFlags } from "../../../Const/Enums";
import { getTankById, TankDefinition } from "../../../Const/TankDefinitions";
import { Entity } from "../../../Native/Entity";
import { AI, AIState } from "../../AI";
import TankBody, { BarrelBase } from "../TankBody";
import { CameraEntity } from "../../../Native/Camera";
import { PI2 } from "../../../util";
import ObjectEntity from "../../Object";
import { log } from "console";

/**
 * The drone class represents the drone (projectile) entity in diep.
 */
export default class Orbit extends Bullet {
    /** The AI of the drone (for AI mode) */
    public static FOCUS_RADIUS = 850 ** 2;
    public ai: AI;
    public fire: boolean = true
    /** The drone's radius of resting state */
    public static MAX_RESTING_RADIUS = 400 ** 2;
    public static BASE_ROTATION = 0.1;
    public static dronecount = new Array(100);
    //private rotationPerTick = Drone.BASE_ROTATION;
    /** Used let the drone go back to the player in time. */
    public num : number
    public angles : number
    public timer : number
    /** Cached prop of the definition. */
    protected canControlDrones: boolean;
    public mode:number
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number, mode: number, parent?: ObjectEntity) {
        super(barrel, tank, tankDefinition, shootAngle);
        //this.rotationPerTick = direction;
        this.parent = parent ?? tank;
        this.mode = mode
        const bulletDefinition = barrel.definition.bullet;
        this.usePosAngle = false;
        this.ai = new AI(this);
        if(this.parent instanceof TankBody){
        this.parent.orbit.push(this)
    }
        this.canControlDrones = typeof this.barrelEntity.definition.canControlDrones === 'boolean' && this.barrelEntity.definition.canControlDrones;
        this.physicsData.values.sides = bulletDefinition.sides ?? 1;
        // TOD(ABCO:
        // No hardcoded - unless it is hardcoded in diep (all signs show that it might be so far)
        this.deathAccelFactor = 1;
        this.angles = 0
        this.timer = 0
        this.physicsData.values.pushFactor = 4;
        this.physicsData.values.absorbtionFactor = bulletDefinition.absorbtionFactor;
       // this.baseSpeed /= 3;
        this.parent.OrbCount += 1;
        this.num = this.parent.OrbCount
        this.ai.movementSpeed = this.ai.aimSpeed = this.baseAccel;
    }

    /** Extends LivingEntity.destroy - so that the drone count decreases for the barrel. */
    public destroy(animate=true) {
        if (!animate)
        if(this.parent instanceof TankBody){
            this.parent.OrbCount -= 1;
            this.parent.orbit.slice(this.num)
            this.parent.orbit.splice(this.parent.orbit.indexOf(this),this.num)
        }
        super.destroy(animate);
    }
    
    /** This allows for factory to hook in before the entity moves. */
    protected tickMixin(tick: number) {
    }

    public tick(tick: number) {
        const statLevels = this.tank.cameraEntity.cameraData?.values.statLevels.values;

        const bulletSpeed = statLevels ? statLevels[Stat.BulletSpeed] : 0;
        if(this.fire == true){
            this.timer++
            if(this.timer == 5){
                this.fire = false
                this.timer = 2000
            }
        }
            if(this.fire == false){
                
            if (!Entity.exists(this.barrelEntity)) this.destroy()
            this.lifeLength = Infinity;
            this.spawnTick = this.barrelEntity.game.tick;
                const delta = {
                    x: this.positionData.values.x - this.tank.positionData.values.x,
                    y: this.positionData.values.y - this.tank.positionData.values.y
                }
                const delta2 = {
                    x: this.positionData.values.x - this.tank.positionData.values.x,
                    y: this.positionData.values.y - this.tank.positionData.values.y
                }
        const sizeFactor = this.tank.sizeFactor;
        const base = this.baseAccel;
            let angle = PI2 * ((this.num)/this.parent.OrbCount)
            const offset = (Math.atan2(delta.y, delta.x) + Math.PI/ 2)
            let dista = 3
            let multi = 0.05
            if(this.num > this.parent.OrbCount){
                //console.log(this.parent.OrbCount)
                //this.num = this.num - this.parent.OrbCount
            }
            if(this.num == 0 || this.num == null){
                //console.log("true2")
                //this.destroy()
               // this.num = this.parent.OrbCount
            }
            if (this.mode == 1){
                 dista = 5
                if(this.tank.inputs.attemptingRepel()){
                    dista = 10
                    //multi = 0.025
                }
            }
            if (this.mode == 2){
                dista = 1.75
            }
                let angle2 = angle
                angle2 += tick * (0.2 + (0.3 * bulletSpeed/7))
                const offset2 =  Math.atan2(this.tank.positionData.values.y, this.tank.positionData.values.x ) +  Math.PI /(this.barrelEntity.droneCount/this.num)
                this.positionData.x = this.tank.positionData.x +  (this.tank.physicsData.size  * Math.cos(angle + (tick * multi))) * dista
                this.positionData.y = this.tank.positionData.y +  (this.tank.physicsData.size  * Math.sin(angle + (tick * multi))) * dista
               
                //this.movementAngle = Math.atan2(delta.y, delta.x);
                //this.movementAngle =  Math.atan2(delta.y, delta.x);
            if(this.tank.inputs.attemptingRepel()){
                if (this.mode == 0 || this.mode == 2){
        const inputs = this.tank.inputs;
                    console.log(this.num)
                this.fire = true
                this.angles = Math.atan2((inputs.mouse.y - this.positionData.values.y), (inputs.mouse.x - this.positionData.values.x));
                this.movementAngle = this.angles
                this.addAcceleration(this.movementAngle, this.baseSpeed);
                //this.barrelEntity.droneCount =0
                this.lifeLength = 72 * this.barrelEntity.definition.bullet.lifeLength;


                }
            }
        }
        
        super.tick(tick);
        // So that switch tank works, as well as on death

        this.tickMixin(tick);
    }
}