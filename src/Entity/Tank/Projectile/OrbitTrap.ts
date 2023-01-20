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

import { PhysicsFlags, Stat, StyleFlags } from "../../../Const/Enums";
import { getTankById, TankDefinition } from "../../../Const/TankDefinitions";
import { Entity } from "../../../Native/Entity";
import { AI, AIState } from "../../AI";
import TankBody, { BarrelBase } from "../TankBody";
import { CameraEntity } from "../../../Native/Camera";
import { PI2 } from "../../../util";

/**
 * The drone class represents the drone (projectile) entity in diep.
 */
export default class OrbitTrap extends Bullet {
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
    protected collisionEnd = 0;
    public angles : number
    public timer : number
    /** Cached prop of the definition. */
    protected canControlDrones: boolean;

    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel, tank, tankDefinition, shootAngle);
        //this.rotationPerTick = direction;
        OrbitTrap.dronecount = OrbitTrap.dronecount.filter(val => val !== this.num)
        OrbitTrap.dronecount.push()
        const bulletDefinition = barrel.definition.bullet;
        this.usePosAngle = false;
        this.ai = new AI(this);
        this.canControlDrones = typeof this.barrelEntity.definition.canControlDrones === 'boolean' && this.barrelEntity.definition.canControlDrones;
        this.physicsData.values.sides = bulletDefinition.sides ?? 3;
        //this.physicsData.values.flags |= PhysicsFlags.onlySameOwnerCollision;
        this.styleData.values.flags |= StyleFlags.isStar;
        this.styleData.values.flags &= ~StyleFlags.hasNoDmgIndicator;
        // TOD(ABCO:
        // No hardcoded - unless it is hardcoded in diep (all signs show that it might be so far)
        this.angles = 0
        this.timer = 0
        this.physicsData.values.pushFactor = 4;
        this.physicsData.values.absorbtionFactor = bulletDefinition.absorbtionFactor;
                this.baseSpeed = (barrel.bulletAccel / 2) + 30 - Math.random() * barrel.definition.bullet.scatterRate;
                this.baseSpeed /= 3;
        this.collisionEnd = this.lifeLength >> 3;
        this.lifeLength = (600 * barrel.definition.bullet.lifeLength) >> 3;
        TankBody.OrbCount += 1;
        this.num = TankBody.OrbCount
        this.ai.movementSpeed = this.ai.aimSpeed = this.baseAccel;
        this.positionData.values.angle = Math.random() * PI2;
        OrbitTrap.dronecount[this.num] += 1;
    }

    /** Extends LivingEntity.destroy - so that the drone count decreases for the barrel. */
    public destroy(animate=true) {

        super.destroy(animate);
    }
    
    /** This allows for factory to hook in before the entity moves. */
    protected tickMixin(tick: number) {
    }

    public tick(tick: number) {
        const statLevels = this.tank.cameraEntity.cameraData?.values.statLevels.values;

        const bulletSpeed = statLevels ? statLevels[Stat.BulletSpeed] : 0;
        let shifted = false;
        for (let n = 0; n < this.num; n++) {
            if (OrbitTrap.dronecount[n] === 0) {
                OrbitTrap.dronecount[this.num] -= 1;            
                this.num--;
                shifted = true;
                //only let it move down once at a time, prevents overlaps and weird stuff
                break;
            }
        }
        if (!shifted && OrbitTrap.dronecount[this.num] > 1) {
            //this.num++;
            OrbitTrap.dronecount[this.num] -= 1;
        }
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
            let angle = PI2 * ((this.num)/TankBody.OrbCount)
            const offset = (Math.atan2(delta.y, delta.x) + Math.PI/ 2)
            let dista = 3
                let angle2 = angle
                angle2 += tick * (0.2 + (0.3 * bulletSpeed/7))
                const offset2 =  Math.atan2(this.tank.positionData.values.y, this.tank.positionData.values.x ) +  Math.PI /(this.barrelEntity.droneCount/this.num)
                delta.x = this.tank.positionData.x +  (this.tank.physicsData.size  * Math.cos(angle + (tick * 0.1))) * dista -this.positionData.x;
                delta.y = this.tank.positionData.y +  (this.tank.physicsData.size  * Math.sin(angle + (tick * 0.1))) * dista - this.positionData.y
                this.positionData.angle += 0.1
                //this.movementAngle = Math.atan2(delta.y, delta.x);
                this.movementAngle =  Math.atan2(delta.y, delta.x);
            if(this.tank.inputs.attemptingRepel()){
        const inputs = this.tank.inputs;
                OrbitTrap.dronecount[this.num] -= 1;
                TankBody.OrbCount -= 1;
                this.fire = true
                this.angles = Math.atan2((inputs.mouse.y - this.positionData.values.y), (inputs.mouse.x - this.positionData.values.x));
                this.baseSpeed = (this.barrelEntity.bulletAccel / 2) + 30 - Math.random();
                this.movementAngle = this.angles
                this.baseAccel = 0.25
                this.addAcceleration(this.movementAngle, this.baseSpeed);
                //this.barrelEntity.droneCount =0
                this.lifeLength = (600 * this.barrelEntity.definition.bullet.lifeLength) >> 3;



            }
        }
        
        super.tick(tick);
        // So that switch tank works, as well as on death

        this.tickMixin(tick);
    }
}