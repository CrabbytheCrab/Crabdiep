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
export default class OrbitInverse extends Bullet {
    /** The AI of the drone (for AI mode) */
    public static FOCUS_RADIUS = 850 ** 2;
    public fire: boolean = true
    public fire2: boolean = false
    /** The drone's radius of resting state */
    public static MAX_RESTING_RADIUS = 400 ** 2;
    public static BASE_ROTATION = 0.1;
    public static dronecount = new Array(100);
    //private rotationPerTick = Drone.BASE_ROTATION;
    /** Used let the drone go back to the player in time. */
    public num : number
    public angles : number
    public timer : number
    public timer2 : number
    public MouseX : number
    public MouseY : number
    /** Cached prop of the definition. */

    public barrel: Barrel
    public mode:number
    public dista: number
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number, mode: number, parent?: ObjectEntity) {
        super(barrel, tank, tankDefinition, shootAngle);
        //this.rotationPerTick = direction;
        this.barrel = barrel
        this.parent = parent ?? tank;
        this.mode = mode
        this.dista = 0
        const bulletDefinition = barrel.definition.bullet;
        this.usePosAngle = false;
        if(this.parent instanceof TankBody){
        this.parent.orbitinv.push(this)
        }
        this.angles = 0
        this.timer = 0
        this.timer2 = 0
        this.MouseX = 0
        this.MouseY = 0
        this.physicsData.values.absorbtionFactor = bulletDefinition.absorbtionFactor;
       // this.baseSpeed /= 3;
        this.parent.OrbCount2 += 1;
        this.num = this.parent.OrbCount2
    }

    /** Extends LivingEntity.destroy - so that the drone count decreases for the barrel. */
    public destroy(animate=true) {
        if (!animate)
        if(this.parent instanceof TankBody){
            this.parent.OrbCount2 -= 1;
            this.parent.orbitinv.splice(this.parent.orbitinv.indexOf(this),1)
            //this.parent.orbit = this.parent.orbit.slice(this.num)
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
            let angle = PI2 * ((this.num)/this.parent.OrbCount2)
            const statLevels = this.tank.cameraEntity.cameraData?.values.statLevels.values;
            if (this.mode == 1){
                if(this.tank.inputs.attemptingShot()){
                   this.dista += (125 -  this.dista )* 0.05
                }else if (this.tank.inputs.attemptingRepel()){
                    this.dista += (15 -  this.dista) * 0.05
                }
                else{
                   this.dista += (50 -  this.dista) * 0.1
                    
                }
           }
            const bulletSpeed = statLevels ? statLevels[Stat.BulletSpeed] : 0;
            let multi = 0.05 + (0.1/7 * bulletSpeed)
            if (this.mode == 2){
                this.dista = 2
            }
            if (this.mode == 0){
                this.dista = 3
            }
            const delta = {
                x: this.positionData.values.x - this.tank.positionData.values.x,
                y: this.positionData.values.y - this.tank.positionData.values.y
            }
            if (this.mode == 1){
                const x1 = (this.tank.positionData.x +  (this.tank.physicsData.size  * Math.cos(angle + (tick *-multi))) * this.dista)
                const y1 = (this.tank.positionData.y +  (this.tank.physicsData.size  * Math.sin(angle + (tick * -multi))) * this.dista)
                this.positionData.x = this.tank.positionData.x + 0.1 * (x1 - this.tank.positionData.x)
                this.positionData.y = this.tank.positionData.y + 0.1 * (y1 - this.tank.positionData.y)
            }else{
                delta.x = this.tank.positionData.x +  (this.tank.physicsData.size  * Math.cos(angle + (tick * -0.1))) * this.dista -this.positionData.x;
                delta.y = this.tank.positionData.y +  (this.tank.physicsData.size  * Math.sin(angle + (tick * -0.1))) * this.dista - this.positionData.y
                this.movementAngle =  Math.atan2(delta.y, delta.x);
            }
            if(this.tank.inputs.attemptingRepel()){
                if (this.mode == 0 || this.mode == 2){
                    const inputs = this.tank.inputs;
                    this.fire = true
                    this.fire2 = true
                    this.MouseX = inputs.mouse.x
                    this.MouseY = inputs.mouse.y
                    this.angles = Math.atan2((this.MouseY - this.positionData.y), (this.MouseX - this.positionData.x));
                    this.velocity.angle = this.angles
                    this.movementAngle = this.angles
                    this.positionData.angle = this.angles
                    //this.addAcceleration(this.angles, this.baseSpeed);
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