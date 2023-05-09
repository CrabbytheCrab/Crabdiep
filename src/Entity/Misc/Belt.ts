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

import { PhysicsFlags, Color, StyleFlags } from "../../Const/Enums";
import LivingEntity from "../Live";
import TeamBase from "./TeamBase";
import Bullet from "../Tank/Projectile/Bullet";
import BulletAlt from "../Tank/Projectile/BulletAlt";
import { NameGroup } from "../../Native/FieldGroups";
/**
 * Only used for maze walls and nothing else.
 */
export default class Belt extends ObjectEntity {
    public direction:number
    public constructor(game: GameServer, x: number, y: number, width: number, height: number, direction: number) {
        super(game);

        this.positionData.values.x = x;
        this.positionData.values.y = y;
        this.direction = direction
        this.physicsData.values.width = width;
        this.physicsData.values.size = height;
        this.physicsData.values.sides = 2;
        this.physicsData.values.flags |= PhysicsFlags.showsOnMap | PhysicsFlags.isBase;
        this.physicsData.values.pushFactor = 0;
        this.physicsData.values.absorbtionFactor = 0;
        const ball = new ObjectEntity(this.game);
        ball.nameData = new NameGroup(ball);
        ball.nameData.values.name = ""
        ball.setParent(this)
        ball.physicsData.values.sides = 3;
        ball.styleData.values.color = Color.ScoreboardBar;
        ball.physicsData.flags |= PhysicsFlags.showsOnMap
        ball.physicsData.values.size = 100;
        ball.positionData.angle = this.direction
        ball.styleData.flags |= StyleFlags.showsAboveParent
        ball.styleData.color = Color.White
        ball.physicsData.values.absorbtionFactor = 1;
        this.styleData.values.borderWidth = 10;
        this.styleData.zIndex = 1
        this.styleData.values.color = Color.kMaxColors;
    }
    public tick(tick: number): void {
        const entities = this.findCollisions()
        for (let i = 0; i < entities.length; ++i) {
            const entity = entities[i];
            if(entity instanceof LivingEntity){
                if(entity instanceof TeamBase){
                }else{
                    if(entity instanceof Bullet){
                        entity.movementAngle = this.direction
                        entity.positionData.angle = this.direction
                    }
                    if(entity instanceof BulletAlt){
                        entity.movementAngle = this.direction
                        entity.positionData.angle = this.direction
                    }
                entity.addAcceleration( this.direction, 10);
                }
            }

        }
    }
}
