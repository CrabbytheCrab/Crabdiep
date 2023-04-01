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

import GameServer from "../../Game";
import ObjectEntity from "../Object";
import * as util from "../../util";

import { PhysicsFlags, Color, StyleFlags, Tank, PositionFlags, Stat, StatCount } from "../../Const/Enums";
import LivingEntity from "../Live";
import TankBody, { BarrelBase } from "../Tank/TankBody";
import { TeamEntity } from "./TeamEntity";
import { GuardObject } from "../Tank/Addons";
import { Entity } from "../../Native/Entity";
import { Inputs } from "../AI";
import Bullet from "../Tank/Projectile/Bullet";
import AbstractShape from "../Shape/AbstractShape";
import Partical from "../Tank/Projectile/Partical";
/**
 * Only used for maze walls and nothing else.
 */
export default class BlackHole extends ObjectEntity implements BarrelBase{
    public viewRange: number;
    public lifetime: number;
    public sizeFactor: number;
    public multiplier: number
    /** The camera entity (used as team) of the croc skimmer. */
    public cameraEntity: Entity = this;
public multiplierdirect: number
    /** The reload time of the skimmer's barrel. */
    public reloadTime = 15;
    public part:number
    /** The inputs for when to shoot or not. (croc skimmer) */
    public inputs: Inputs;
    public team: TeamEntity
    //public tank:TankBody
    public constructor(game: GameServer, team: TeamEntity) {
        super(game);
        this.multiplierdirect = 1
        this.team = team
      //  this.tank = 
      this.part = 5
      this.multiplier = 1
      const {x, y} = this.game.arena.findSpawnLocation()
      this.positionData.values.x = x;
      this.positionData.values.y = y;
        //this.damagePerTick = 0
        this.viewRange = 180
        this.inputs = new Inputs()
        this.sizeFactor = this.physicsData.values.size / 50;
        this.styleData.zIndex = 2
        //this.damageReduction = 0
        this.styleData.flags |= StyleFlags.hasNoDmgIndicator
        this.physicsData.values.size = 180;
        this.positionData.values.flags |= PositionFlags.absoluteRotation;
        this.physicsData.values.sides = 1;
       this.physicsData.flags   |= PhysicsFlags.showsOnMap;
        this.physicsData.pushFactor = -0.5;
        this.physicsData.values.absorbtionFactor = 0;
    this.lifetime = 2000
    //const rotator = new GuardObject(this.game, this, 3, 1.5, 0, 0.2)  
    const rotator = new ObjectEntity(game)
    if(rotator.physicsData.flags && PhysicsFlags.showsOnMap) rotator.physicsData.flags ^= PhysicsFlags.showsOnMap
    rotator.physicsData.sides = 0
    rotator.setParent(this)
    rotator.physicsData.values.size = this.physicsData.values.size;
    rotator.physicsData.values.absorbtionFactor = 0;
    rotator.relationsData.values.team = this;
    rotator.styleData.flags |= StyleFlags.isStar
    rotator.styleData.values.color = Color.White
    const tickStar = rotator.tick;
    rotator.tick = (tick: number) => {
    rotator.physicsData.size = ((this.physicsData.size * this.multiplier) - rotator.physicsData.size * 0.1)
    rotator.positionData.angle += 0.1
        tickStar.call(rotator, tick);
    }

    const rotator2 = new GuardObject(this.game, this, 1, 1.5, 0, 0)  ;
    rotator2.styleData.values.color = Color.White
    rotator2.styleData.values.flags |= StyleFlags.showsAboveParent
    rotator2.styleData.opacity = 0

    const tickBase = rotator2.tick;
    rotator2.tick = (tick: number) => {
        rotator2.physicsData.size = this.physicsData.size
      if(rotator2.physicsData.flags && PhysicsFlags.showsOnMap) rotator2.physicsData.flags   ^= PhysicsFlags.showsOnMap;

        if(this.lifetime <= 620){
            rotator2.styleData.opacity += 1/500
        }
        tickBase.call(rotator2, tick);
    }

    const rotator4 = new GuardObject(this.game, this, 1, 3, 0, 0)  
    rotator4.styleData.values.color = Color.kMaxColors
    rotator4.styleData.values.flags |= StyleFlags.showsAboveParent
    rotator4.styleData.opacity = 0

    const tickBase2 = rotator4.tick;
    rotator4.tick = (tick: number) => {
      if(rotator4.physicsData.flags && PhysicsFlags.showsOnMap) rotator4.physicsData.flags   ^= PhysicsFlags.showsOnMap;
      tickBase2.call(rotator4, tick);
    }
        this.styleData.values.color = Color.kMaxColors;
    }
    public destroy(animate = true) {
        super.destroy(animate);
        this.physicsData.pushFactor = 200
        const entities = this.game.entities.collisionManager.retrieve(this.positionData.values.x, this.positionData.values.y, this.viewRange, this.viewRange);
        for (let i = 0; i < entities.length; ++i) {
            const entity = entities[i];
            
            if (!(entity instanceof LivingEntity)) continue; // Check if the target is living

            if (entity.physicsData.values.flags & PhysicsFlags.isBase) continue; // Check if the target is a base

            if (!(entity.relationsData.values.owner === null || !(entity.relationsData.values.owner instanceof ObjectEntity))) continue; // Don't target entities who have an object owner
            if (entity instanceof TankBody) {
                if(!entity.definition.flags.isCelestial && entity.scoreData.score >= 146655){
                    this.receiveKnockback(entities[i]);
                    entity.setTank(Tank.Nova)
                    entity.styleData.values.flags |= StyleFlags.isFlashing;
                    entity.damageReduction = 0.0;
                    entity.damageReduction = 0;
                    entity.relationsData.values.team = this.team
                    entity.styleData.color = Color.EnemyCrasher
                    entity.cameraEntity.cameraData.values.spawnTick = 0
                    for (let i = 0; i < StatCount; ++i) entity.cameraEntity.cameraData.statLevels[i as Stat] = 0;
                    for (let i = 0; i < StatCount; ++i) entity.cameraEntity.cameraData.statLimits[i as Stat] = 10;
                    for (let i = 0; i < StatCount; ++i) entity.cameraEntity.cameraData.statsAvailable -=1
                    entity.cameraEntity.cameraData.statsAvailable += 35
                }
            }
        }
    }
    public tick(tick: number) {
        super.tick(tick);
        //if(this.physicsData.flags && PhysicsFlags.showsOnMap)this.physicsData.flags ^= PhysicsFlags.showsOnMap
        // It's cached
        this.part --
            if(this.part <= 0){
                    let partical = new Partical(this.game,this,Math.random()  * util.PI2)
                partical.styleData.zIndex = 1
                partical.physicsData.size = 40 + (Math.random() * 30)
                    partical.styleData.color = Color.White
                    partical.baseSpeed = partical.baseSpeed * (1 - (Math.random() * 0.4))
                    partical.baseAccel = partical.baseAccel * (1 - (Math.random() * 0.25))
                    partical.physicsData.sides = 1
                
        this.part = 2
        }
       /*     this.multiplier += 0.05 * this.multiplierdirect
        if(this.multiplier >= 2){
            this.multiplierdirect *= -1
        }
        if(this.multiplier <= 0.4){
            this.multiplierdirect *= -1
        }*/
        this.lifetime--
        if(this.lifetime <= 0){
            this.destroy()
            for(let i = 0; i < 30 + (Math.random() * 20); i++){
                let partical = new Partical(this.game,this,Math.random()  * util.PI2)
            partical.styleData.zIndex = this.styleData.zIndex - 1
            partical.physicsData.size = 50 + (Math.random() * 40)
                partical.styleData.color = Color.White
                partical.baseSpeed = partical.baseSpeed * (1.3 - (Math.random() * 0.3))
                partical.baseAccel = partical.baseAccel * (1.3 - (Math.random() * 0.2))
                partical.physicsData.sides = 1
            }
        }
        const entities = this.game.entities.collisionManager.retrieve(this.positionData.values.x, this.positionData.values.y, this.physicsData.size,this.physicsData.size);
        this.viewRange = this.physicsData.size
        for (let i = 0; i < entities.length; ++i) {
            const entity = entities[i];

            if (!(entity instanceof LivingEntity)) continue; // Check if the target is living
            if (entity instanceof AbstractShape || entity instanceof TankBody){

            }; // Check if the target is living


            if (entity.physicsData.values.flags & PhysicsFlags.isBase) continue; // Check if the target is a base

            if (!(entity.relationsData.values.owner === null || !(entity.relationsData.values.owner instanceof ObjectEntity))) continue; // Don't target entities who have an object owner
            if (entity instanceof TankBody) {
                if(!entity.definition.flags.isCelestial && entity.scoreData.score >= 146655){
                    let kbAngle: number;
                    let diffY = this.positionData.values.y - entity.positionData.values.y;
                    let diffX = this.positionData.values.x - entity.positionData.values.x;
                    // Prevents drone stacking etc
                    if (diffX === 0 && diffY === 0) kbAngle = Math.random() * util.PI2;
                    else kbAngle = Math.atan2(diffY, diffX);
                    //entity.addAcceleration( kbAngle, 0.5);
                }else{
                    let kbAngle: number;
                    let diffY = this.positionData.values.y - entity.positionData.values.y;
                    let diffX = this.positionData.values.x - entity.positionData.values.x;
                    // Prevents drone stacking etc
                    if (diffX === 0 && diffY === 0) kbAngle = Math.random() * util.PI2;
                    else kbAngle = Math.atan2(diffY, diffX);
                    //entity.addAcceleration( kbAngle, -2);

                }
            }
        }

    }
}
