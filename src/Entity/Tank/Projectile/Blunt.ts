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

import { InputFlags, PhysicsFlags, PositionFlags, Stat, Tank } from "../../../Const/Enums";
import { BarrelDefinition, TankDefinition } from "../../../Const/TankDefinitions";
import { Entity } from "../../../Native/Entity";
import { Inputs } from "../../AI";
import TankBody, { BarrelBase } from "../TankBody";
import { GuardObject } from "../Addons";
import MazeWall from "../../Misc/MazeWall";
import AbstractShape from "../../Shape/AbstractShape";
/**
 * Barrel definition for the rocketeer rocket's barrel.
 */

/**
 * Represents all rocketeer rockets in game.
 */
export default class Blunt extends Bullet implements BarrelBase{
    /** The size ratio of the skimmer. */
    public sizeFactor: number;
    /** The camera entity (used as team) of the croc skimmer. */
    public cameraEntity: Entity;
    /** The reload time of the skimmer's barrel. */
    public reloadTime = 15;
    public deff: boolean
    /** The inputs for when to shoot or not. (croc skimmer) */
    public inputs: Inputs;
    protected megaturret: boolean;
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.cameraEntity = tank.cameraEntity;
        this.inputs = new Inputs()
        this.sizeFactor = this.physicsData.values.size / 50;
        this.deff = false
        const bulletDefinition = barrel.definition.bullet;
        const statLevels = tank.cameraEntity.cameraData?.values.statLevels.values;
        const bulletDamage = statLevels ? statLevels[Stat.BulletDamage] : 0;
        if (this.tankDefinition && this.tankDefinition.id == Tank.FunEnder){
        
            this.baseSpeed *= 2
            this.baseAccel /= 2
            this.physicsData.size *= 1 + ((0.5 * Math.random()) -0.25)
            this.baseSpeed *= 1 + ((0.4 * Math.random()) -0.2)
            this.baseAccel *= 1 + ((0.5 * Math.random()) -0.25)
        }
    
        this.megaturret = typeof this.barrelEntity.definition.megaturret === 'boolean' && this.barrelEntity.definition.megaturret;
        if (tankDefinition && tankDefinition.id === Tank.Pounder){
            new GuardObject(this.game, this, 6, 1.3, 0, .1);
            this.physicsData.values.pushFactor = ((7 / 3) + bulletDamage) * bulletDefinition.damage  * 6;
        }else        if (tankDefinition && tankDefinition.id === Tank.Flinger){
            this.positionData.flags = PositionFlags.canMoveThroughWalls
            this.deff = true
            new GuardObject(this.game, this, 1, 1.75, 0, .1);
            //this.baseAccel = (35 * 3) * this.barrelEntity.definition.bullet.speed;
            this.physicsData.values.pushFactor = ((7 / 3) + bulletDamage) * bulletDefinition.damage  * 10;
        }else        if (tankDefinition && tankDefinition.id === Tank.FunEnder){
            new GuardObject(this.game, this, 6, 1.15, 0, .1);
            this.physicsData.values.pushFactor = ((7 / 3) + bulletDamage) * bulletDefinition.damage  * 6;
        }else{
            new GuardObject(this.game, this, 6, 1.15, 0, .1);
            this.physicsData.values.pushFactor =  ((7 / 3) + bulletDamage) * bulletDefinition.damage  * 4;
        }
    }
    
    public tick(tick: number) {
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;
        super.tick(tick);
        if (this.tankDefinition && this.tankDefinition.id == Tank.FunEnder){
            if (tick <= this.spawnTick + 5){
            }else{
                const bulletDefinition = this.barrelEntity.definition.bullet;
                const statLevels = this.tank.cameraEntity.cameraData?.values.statLevels.values;
                const bulletDamage = statLevels ? statLevels[Stat.BulletDamage] : 0;
                const falloff = ((7 + bulletDamage * 3) * bulletDefinition.damage)/2;
                this.damagePerTick = falloff   
            }
        }
    if (this.deff){
        if (this.isPhysical && !(this.deletionAnimation)) {
            const collidedEntities = this.findCollisions();
            for (let i = 0; i < collidedEntities.length; ++i) {
                if (collidedEntities[i] instanceof TankBody || collidedEntities[i] instanceof AbstractShape || collidedEntities[i] instanceof MazeWall){
                    this.velocity.angle >= Math.PI/2? this.velocity.angle = Math.atan2(collidedEntities[i].positionData.y - this.positionData.y, collidedEntities[i].positionData.x - this.positionData.x) +  -Math.PI 
                    : this.velocity.angle = Math.atan2(collidedEntities[i].positionData.y - this.positionData.y, collidedEntities[i].positionData.x - this.positionData.x) + Math.PI
                    this.movementAngle = this.velocity.angle
                    this.baseSpeed *= 1.5
                }
            }
        }
    }
    }
}
