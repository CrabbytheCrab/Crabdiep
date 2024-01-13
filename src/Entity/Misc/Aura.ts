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
import { gamer } from "../..";
import ClientCamera from "../../Native/Camera";
import AbstractBoss from "../Boss/AbstractBoss";
/**
 * Only used for maze walls and nothing else.
 */
export default class Aura extends ObjectEntity{
    public owner: LivingEntity
    public size: number
    public constructor(game: GameServer, owner: LivingEntity, size: number) {
        super(game);
        this.owner = owner
        this.size = size
        //this.damagePerTick = 0
        //this.damageReduction = 0
        this.styleData.color = Color.EnemyTriangle
        this.styleData.opacity = owner.styleData.opacity/2
        this.positionData.values.x = this.owner.positionData.values.x;
        this.positionData.values.y = this.owner.positionData.values.y;
        this.physicsData.values.size = owner.physicsData.size * size;
        this.physicsData.values.sides = 1
        this.physicsData.pushFactor = 0
        this.physicsData.absorbtionFactor = 0
        this.relationsData.owner = this.owner;
        this.relationsData.values.owner =  this.owner;
        this.relationsData.team = this.owner.relationsData.team;
    }
    public tick(tick: number) {
        super.tick(tick);
        //if(this.physicsData.flags && PhysicsFlags.showsOnMap)this.physicsData.flags ^= PhysicsFlags.showsOnMap
        // It's cached
        this.styleData.opacity = this.owner.styleData.opacity/2
        this.physicsData.size = this.owner.physicsData.size * this.size;
        const entities = this.findCollisions()
        const collidedEntities = this.findCollisions();
        for (let i = 0; i < collidedEntities.length; ++i) {
            if (!(collidedEntities[i] instanceof LivingEntity)) continue;
            if(collidedEntities[i] instanceof TankBody || collidedEntities[i] instanceof AbstractShape ||collidedEntities[i] instanceof AbstractBoss){
                if (collidedEntities[i].relationsData.values.team !== this.relationsData.values.team) {
                    
                    collidedEntities[i].destroy()
                }
            }
        }

    }
}
