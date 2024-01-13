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

import { InputFlags, PhysicsFlags, StyleFlags, Tank } from "../../../Const/Enums";
import { TankDefinition } from "../../../Const/TankDefinitions";
import { Entity } from "../../../Native/Entity";
import { AI, AIState, Inputs } from "../../AI";
import TankBody, { BarrelBase } from "../TankBody";
import ObjectEntity from "../../Object";
import { VectorAbstract } from "../../../Physics/Vector";
import LivingEntity from "../../Live";
import MazeWall from "../../Misc/MazeWall";
import AbstractShape from "../../Shape/AbstractShape";
import Bouncer from "./Bouncer";

/**
 * The drone class represents the drone (projectile) entity in diep.
 */
export default class CrackShot extends Bullet {
    /** The AI of the drone (for AI mode) */


    /** Number of ticks before the trap cant collide with its own team. */
    protected collisionEnd = 0;
    public shoot = false
    public multicrack = true
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel, tank, tankDefinition, shootAngle);

        const bulletDefinition = barrel.definition.bullet;
        
        //this.ai = new AI(this);
        //this.ai.targetFilter = (targetPos) => (targetPos.x - this.positionData.x) ** 2 + (targetPos.y - this.positionData.y) ** 2 <= this.ai.viewRange ** 2; // (1000 ** 2) 1000 radius
        this.physicsData.values.sides = bulletDefinition.sides ?? 1;
        if (this.physicsData.values.flags & PhysicsFlags.noOwnTeamCollision) this.physicsData.values.flags ^= PhysicsFlags.noOwnTeamCollision;
        this.physicsData.values.flags |= PhysicsFlags.onlySameOwnerCollision;
        this.styleData.values.flags &= ~StyleFlags.hasNoDmgIndicator;

        this.deathAccelFactor = 1;

        this.physicsData.values.pushFactor = 2;
        this.physicsData.values.absorbtionFactor = bulletDefinition.absorbtionFactor;

        this.baseSpeed /= 2
        this.collisionEnd = this.lifeLength >> 3;

        //this.ai.movementSpeed = this.ai.aimSpeed = this.baseAccel;
    }

    /** Extends LivingEntity.destroy - so that the drone count decreases for the barrel. */
    public destroy(animate=true) {
        if (!animate) this.barrelEntity.droneCount -= 1;

        super.destroy(animate);
    }
    

    /** This allows for factory to hook in before the entity moves. */
    protected tickMixin(tick: number) {
        super.tick(tick);
    }

    public tick(tick: number) {
        super.tick(tick);
        if(this.tankDefinition && this.tankDefinition.id == Tank.Rebounder){
            if (this.isPhysical && !(this.deletionAnimation)) {
                const collidedEntities = this.findCollisions();
                for (let i = 0; i < collidedEntities.length; ++i) {
                    if (collidedEntities[i] instanceof TankBody || collidedEntities[i] instanceof AbstractShape || collidedEntities[i] instanceof MazeWall){
                        this.velocity.angle >= Math.PI/2? this.velocity.angle = Math.atan2(collidedEntities[i].positionData.y - this.positionData.y, collidedEntities[i].positionData.x - this.positionData.x) +  -Math.PI 
                        : this.velocity.angle = Math.atan2(collidedEntities[i].positionData.y - this.positionData.y, collidedEntities[i].positionData.x - this.positionData.x) + Math.PI
                        this.movementAngle = this.velocity.angle
                    }
                }
            }
        }
        const inputs = this.tank.inputs;
        if (tick - this.spawnTick >= this.collisionEnd) {
            if(this.tank.inputs.attemptingRepel()){
                this.positionData.angle = Math.atan2(inputs.mouse.y - this.positionData.values.y, inputs.mouse.x - this.positionData.values.x);
                if(!this.shoot){
                    this.shoot = true
                    if(this.tankDefinition && this.tankDefinition.id == Tank.Helix && this.multicrack){
                        const bullet = new CrackShot(this.barrelEntity,this.tank,this.tankDefinition,this.positionData.angle)
                        bullet.physicsData.size *= 0.75
                        bullet.baseSpeed *= 1.5
                        bullet.baseAccel *= 1.5
                        bullet.positionData.x = this.positionData.x
                        bullet.positionData.y = this.positionData.y
                        bullet.multicrack = false
                    }else if(this.tankDefinition && this.tankDefinition.id == Tank.Rebounder){
                        const bullet = new Bouncer(this.barrelEntity,this.tank,this.tankDefinition,this.positionData.angle,this.tank)
                        bullet.damagePerTick *= 0.75
                        bullet.physicsData.size *= 0.75
                        bullet.baseSpeed *= 1.5
                        bullet.positionData.x = this.positionData.x
                        bullet.positionData.y = this.positionData.y
                    }else{                    
                        const bullet = new Bullet(this.barrelEntity,this.tank,this.tankDefinition,this.positionData.angle,this.tank)
                        bullet.damagePerTick *= 0.75
                        bullet.physicsData.size *= 0.75
                        bullet.baseSpeed *= 1.5
                        bullet.positionData.x = this.positionData.x
                        bullet.positionData.y = this.positionData.y
                    }
                }
                this.destroy()
            }
        }
    }
}
