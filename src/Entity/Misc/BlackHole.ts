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
import TankBody from "../Tank/TankBody";
import { TeamEntity } from "./TeamEntity";
/**
 * Only used for maze walls and nothing else.
 */
export default class BlackHole extends ObjectEntity {
    public viewRange: number;
    public lifetime: number;
    //public tank:TankBody
    public constructor(game: GameServer) {
        super(game);
      //  this.tank = 
      const {x, y} = this.game.arena.findSpawnLocation()
      this.positionData.values.x = x;
      this.positionData.values.y = y;
        //this.damagePerTick = 0
        this.viewRange = 180
        //this.damageReduction = 0
        this.styleData.zIndex = 0
        this.styleData.flags |= StyleFlags.hasNoDmgIndicator
        this.physicsData.values.size = 180;
        this.positionData.values.flags |= PositionFlags.absoluteRotation;
        this.physicsData.values.sides = 1;
        //this.physicsData.flags   |= PhysicsFlags.showsOnMap;
        this.physicsData.pushFactor = -2;
        this.physicsData.values.absorbtionFactor = 0;
this.lifetime = 1500
        this.styleData.values.color = Color.kMaxColors;
    }
    public tick(tick: number) {
        super.tick(tick);
        this.isViewed = true
        //if(this.physicsData.flags && PhysicsFlags.showsOnMap)this.physicsData.flags ^= PhysicsFlags.showsOnMap
        // It's cached
        this.styleData.opacity -= 1/1500
        const entities = this.game.entities.collisionManager.retrieve(this.positionData.values.x, this.positionData.values.y, this.viewRange, this.viewRange);
        for (let i = 0; i < entities.length; ++i) {
            this.lifetime--
            if(this.lifetime <= 0)this.destroy(false)
            const entity = entities[i];
            this.receiveKnockback(entities[i]);

            if (!(entity instanceof LivingEntity)) continue; // Check if the target is living

            if (entity.physicsData.values.flags & PhysicsFlags.isBase) continue; // Check if the target is a base

            if (!(entity.relationsData.values.owner === null || !(entity.relationsData.values.owner instanceof ObjectEntity))) continue; // Don't target entities who have an object owner
            if (entity instanceof TankBody) {
                if(!entity.definition.flags.isCelestial && entity.scoreData.score >= 146655){
                    entity.setTank(Tank.Nova)
                    entity.relationsData.values.team = new TeamEntity(this.game, Color.EnemyCrasher)
                    entity.styleData.color = Color.EnemyCrasher
                }
            }
        }

    }
}
