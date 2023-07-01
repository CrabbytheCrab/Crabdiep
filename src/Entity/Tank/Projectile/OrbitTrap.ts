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
export default class OrbitTrap extends Bullet {
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
    protected collisionEnd = 0;

    public barrel: Barrel
    public dista: number
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number, parent?: ObjectEntity) {
        super(barrel, tank, tankDefinition, shootAngle);
        //this.rotationPerTick = direction;
        this.barrel = barrel
        this.parent = parent ?? tank;
        this.dista = 3
        const bulletDefinition = barrel.definition.bullet;
        this.usePosAngle = false;
        if(this.parent instanceof TankBody){
        this.parent.orbit2.push(this)
        }
        this.angles = 0
        this.timer = 0
        this.timer2 = 0
        this.MouseX = 0
        this.MouseY = 0
        this.physicsData.values.absorbtionFactor = bulletDefinition.absorbtionFactor;
       // this.baseSpeed /= 3;
        this.parent.OrbCount += 1;
        this.num = this.parent.OrbCount
        this.physicsData.values.sides = bulletDefinition.sides ?? 3;
        //if (this.physicsData.values.flags & PhysicsFlags.noOwnTeamCollision) this.physicsData.values.flags ^= PhysicsFlags.noOwnTeamCollision;
        this.physicsData.values.flags |= PhysicsFlags.onlySameOwnerCollision;
        this.styleData.values.flags |= StyleFlags.isStar;
        this.styleData.values.flags &= ~StyleFlags.hasNoDmgIndicator;
        this.collisionEnd = this.lifeLength >> 3;
        this.lifeLength = (600 * barrel.definition.bullet.lifeLength) >> 3;
        this.positionData.values.angle = Math.random() * PI2;

    }

    /** Extends LivingEntity.destroy - so that the drone count decreases for the barrel. */
    public destroy(animate=true) {
        if (!animate)
        if(this.fire == false){
            if(this.parent instanceof TankBody){
                this.parent.OrbCount -= 1;
                this.parent.orbit2.splice(this.parent.orbit2.indexOf(this),1)
                //this.parent.orbit = this.parent.orbit.slice(this.num)
            }
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
                this.positionData.angle += 0.05
            if (!Entity.exists(this.barrelEntity)) this.destroy()
            this.lifeLength = Infinity;
            this.spawnTick = this.barrelEntity.game.tick;
            let angle = PI2 * ((this.num)/this.parent.OrbCount)
            const statLevels = this.tank.cameraEntity.cameraData?.values.statLevels.values;
            const bulletSpeed = statLevels ? statLevels[Stat.BulletSpeed] : 0;
            let multi = 0.03 + (0.02 * (bulletSpeed/7))
            const delta = {
                x: this.positionData.values.x - this.tank.positionData.values.x,
                y: this.positionData.values.y - this.tank.positionData.values.y
            }
            delta.x = this.tank.positionData.x +  (this.tank.physicsData.size  * Math.cos(angle + (tick * 0.1))) * this.dista -this.positionData.x;
            delta.y = this.tank.positionData.y +  (this.tank.physicsData.size  * Math.sin(angle + (tick * 0.1))) * this.dista - this.positionData.y
            this.movementAngle =  Math.atan2(delta.y, delta.x);
            if(this.tank.inputs.attemptingRepel()){
                const inputs = this.tank.inputs;
                this.fire = true
                this.fire2 = true
                this.num = 0
                if(this.parent instanceof TankBody){
                    this.parent.OrbCount -= 1;
                    this.parent.orbit2.splice(this.parent.orbit2.indexOf(this),1)
                    //this.parent.orbit = this.parent.orbit.slice(this.num)
                }
                this.MouseX = inputs.mouse.x
                this.MouseY = inputs.mouse.y
                this.angles = Math.atan2((this.MouseY - this.positionData.y), (this.MouseX - this.positionData.x));
                this.velocity.angle = this.angles
                this.movementAngle = this.angles
                this.baseAccel = 0.25
                this.lifeLength = 72 * this.barrelEntity.definition.bullet.lifeLength;
            }
        }
        
        super.tick(tick);
        // So that switch tank works, as well as on death

        this.tickMixin(tick);
    }
}