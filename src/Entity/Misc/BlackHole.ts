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

import { PhysicsFlags, Color, StyleFlags, Tank, PositionFlags } from "../../Const/Enums";
import LivingEntity from "../Live";
import TankBody, { BarrelBase } from "../Tank/TankBody";
import { TeamEntity } from "./TeamEntity";
import { GuardObject } from "../Tank/Addons";
import { Entity } from "../../Native/Entity";
import { Inputs } from "../AI";
/**
 * Only used for maze walls and nothing else.
 */
export default class BlackHole extends ObjectEntity implements BarrelBase{
    public viewRange: number;
    public lifetime: number;
    public sizeFactor: number;
    /** The camera entity (used as team) of the croc skimmer. */
    public cameraEntity: Entity = this;

    /** The reload time of the skimmer's barrel. */
    public reloadTime = 15;
    /** The inputs for when to shoot or not. (croc skimmer) */
    public inputs: Inputs;
    public team: TeamEntity
    //public tank:TankBody
    public constructor(game: GameServer, team: TeamEntity) {
        super(game);
        this.team = team
      //  this.tank = 
      const {x, y} = this.game.arena.findSpawnLocation()
      this.positionData.values.x = x;
      this.positionData.values.y = y;
        //this.damagePerTick = 0
        this.viewRange = 180
        this.inputs = new Inputs()
        this.sizeFactor = this.physicsData.values.size / 50;
        
        //this.damageReduction = 0
        this.styleData.flags |= StyleFlags.hasNoDmgIndicator
        this.physicsData.values.size = 180;
        this.positionData.values.flags |= PositionFlags.absoluteRotation;
        this.physicsData.values.sides = 1;
       this.physicsData.flags   |= PhysicsFlags.showsOnMap;
        this.physicsData.pushFactor = -0.5;
        this.physicsData.values.absorbtionFactor = 0;
    this.lifetime = 2000
    const rotator = new GuardObject(this.game, this, 3, 1.5, 0, 0.2)  
    rotator.styleData.values.color = Color.White

    const rotator2 = new GuardObject(this.game, this, 1, 1.5, 0, 0)  
    rotator2.styleData.values.color = Color.White
    rotator2.styleData.values.flags |= StyleFlags.showsAboveParent
    rotator2.styleData.opacity = 0
    this.relationsData.values.team = new TeamEntity(this.game, Color.EnemyCrasher, "Celestial");

    const tickBase = rotator2.tick;
    rotator2.tick = (tick: number) => {
        rotator2.physicsData.sides = this.physicsData.sides
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
                    entity.relationsData.values.team = this.team
                    entity.styleData.color = Color.EnemyCrasher
                }
            }
        }
    }
    public tick(tick: number) {
        super.tick(tick);

        //if(this.physicsData.flags && PhysicsFlags.showsOnMap)this.physicsData.flags ^= PhysicsFlags.showsOnMap
        // It's cached
        this.lifetime--
        if(this.lifetime <= 0)this.destroy()
        const entities = this.game.entities.collisionManager.retrieve(this.positionData.values.x, this.positionData.values.y, this.viewRange, this.viewRange);
        for (let i = 0; i < entities.length; ++i) {
            const entity = entities[i];

            if (!(entity instanceof LivingEntity)) continue; // Check if the target is living

            if (entity.physicsData.values.flags & PhysicsFlags.isBase) continue; // Check if the target is a base

            if (!(entity.relationsData.values.owner === null || !(entity.relationsData.values.owner instanceof ObjectEntity))) continue; // Don't target entities who have an object owner
            if (entity instanceof TankBody) {
                if(!entity.definition.flags.isCelestial && entity.scoreData.score >= 146655){
                    this.receiveKnockback(entities[i]);
                }
            }
        }

    }
}
