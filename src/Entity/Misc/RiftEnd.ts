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

import GameServer, { DiepGamemodeID } from "../../Game";
import ObjectEntity from "../Object";
import * as util from "../../util";

import { PhysicsFlags, Color, StyleFlags, Tank, PositionFlags, Stat, StatCount, CameraFlags } from "../../Const/Enums";
import LivingEntity from "../Live";
import TankBody, { BarrelBase } from "../Tank/TankBody";
import { TeamEntity } from "./TeamEntity";
import { GuardObject } from "../Tank/Addons";
import { Entity, EntityStateFlags } from "../../Native/Entity";
import { Inputs } from "../AI";
import Bullet from "../Tank/Projectile/Bullet";
import AbstractShape from "../Shape/AbstractShape";
import Partical from "../Tank/Projectile/Partical";
import { gamer } from "../..";
import ClientCamera from "../../Native/Camera";
import AbstractBoss from "../Boss/AbstractBoss";
/**
 * Only used for maze walls and nothing else.
 */
export default class RiftEnd extends ObjectEntity implements BarrelBase{
    public viewRange: number;
    public lifetime: number;
    public sizeFactor: number;
    public multiplier: number
    public multiplier2: number
    public multiplierlerp: number
    public multiplierlerp2: number
    /** The camera entity (used as team) of the croc skimmer. */
    public cameraEntity: Entity = this;
public multiplierdirect: number
public multiplierdirect2: number
    /** The reload time of the skimmer's barrel. */
    public reloadTime = 15;
    public part:number
    /** The inputs for when to shoot or not. (croc skimmer) */
    public inputs: Inputs;
    public x: number
    //public tank:TankBody
    public y: number
    public constructor(game:GameServer, posx : number, posy: number,x:number,y:number) {
        super(game);
        this.multiplierdirect = 1
        this.multiplierdirect2 = 1
        this.x = x
        this.y = y
        this.positionData.x = posx
        this.positionData.y = posy
      //  this.tank = 
      this.part = 5
      this.multiplier = 1
      this.multiplier2 = 1
      this.multiplierlerp = 1
      this.multiplierlerp2 = 1
        //this.damagePerTick = 0
        this.viewRange = 180
        this.inputs = new Inputs()
        this.sizeFactor = this.physicsData.values.size / 50;
        this.styleData.zIndex = 2
        //this.damageReduction = 0
        this.styleData.flags |= StyleFlags.hasNoDmgIndicator
        this.physicsData.values.size = 180;
        this.positionData.values.flags |= PositionFlags.absoluteRotation;
            this.physicsData.values.size = 40;


        this.physicsData.values.sides = 4;
        this.physicsData.pushFactor = 0;
        this.physicsData.values.absorbtionFactor = 0;
    this.lifetime = 600
    //const rotator = new GuardObject(this.game, this, 3, 1.5, 0, 0.2)  
        const rotator = new ObjectEntity(game)
        if(rotator.physicsData.flags && PhysicsFlags.showsOnMap) rotator.physicsData.flags ^= PhysicsFlags.showsOnMap
        rotator.physicsData.sides = this.physicsData.sides
        rotator.setParent(this)
        rotator.physicsData.values.size = (this.physicsData.size * 1.3);
        rotator.physicsData.values.absorbtionFactor = 0;
        rotator.relationsData.values.team = this;
        rotator.styleData.values.color = Color.EnemyCrasher
        rotator.styleData.opacity = 0.3
        const tickStar = rotator.tick;
        rotator.tick = (tick: number) => {
        if(rotator.physicsData.flags && PhysicsFlags.showsOnMap) rotator.physicsData.flags ^= PhysicsFlags.showsOnMap
        rotator.physicsData.size = (((this.physicsData.size * 1.3) * this.multiplierlerp2) - rotator.physicsData.size * 0.1)
            tickStar.call(rotator, tick);
        }
        this.styleData.values.color = Color.EnemyCrasher
    }
    
    public destroy(animate = true) {
        super.destroy(animate);
        this.physicsData.pushFactor = 200
        const entities =this.findCollisions()
        for (let i = 0; i < entities.length; ++i) {
            const entity = entities[i];
            
            if (!(entity instanceof LivingEntity)) continue; // Check if the target is living

            if (entity.physicsData.values.flags & PhysicsFlags.isBase) continue; // Check if the target is a base

            if (!(entity.relationsData.values.owner === null || !(entity.relationsData.values.owner instanceof ObjectEntity))) continue; // Don't target entities who have an object owner
        }
    }
    public tick(tick: number) {
        super.tick(tick);
        //if(this.physicsData.flags && PhysicsFlags.showsOnMap)this.physicsData.flags ^= PhysicsFlags.showsOnMap
        // It's cached
        this.positionData.angle += 0.1
        this.multiplierlerp += (this.multiplier - this.multiplierlerp) * 0.1
        this.multiplierlerp2 += (this.multiplier2 - this.multiplierlerp2) * 0.1
            this.multiplier += 0.1 * this.multiplierdirect
        if(this.multiplier >= 2.5){
            this.multiplierdirect *= -1
        }
        if(this.multiplier <= 0.2){
            this.multiplierdirect *= -1
        }
        this.multiplier2 += 0.025 * this.multiplierdirect
        if(this.multiplier2 >= 2.5){
            this.multiplierdirect2 *= -1
        }
        if(this.multiplier2 <= 0.5){
            this.multiplierdirect2 *= -1
        }
        this.lifetime--
        if(this.lifetime <= 0){
            this.destroy()
        }
    }
}
