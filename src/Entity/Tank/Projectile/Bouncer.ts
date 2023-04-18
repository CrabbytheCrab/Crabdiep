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

import { PhysicsFlags, PositionFlags, StyleFlags } from "../../../Const/Enums";
import { TankDefinition } from "../../../Const/TankDefinitions";
import TankBody, { BarrelBase } from "../TankBody";
import { DevTank } from "../../../Const/DevTankDefinitions";
import { PI2 } from "../../../util";
import ObjectEntity from "../../Object";
import LivingEntity from "../../Live";
import AbstractShape from "../../Shape/AbstractShape";
import MazeWall from "../../Misc/MazeWall";

/**
 * The trap class represents the trap (projectile) entity in diep.
 */
export default class Bouncer extends Bullet {
    /** Number of ticks before the trap cant collide with its own team. */
    protected collisionEnd = 0;
    protected parent: ObjectEntity;

    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number, parent?: ObjectEntity) {
        super(barrel, tank, tankDefinition, shootAngle);

        const bulletDefinition = barrel.definition.bullet;
        this.parent = parent ?? tank;
        this.positionData.flags = PositionFlags.canMoveThroughWalls

    
    }
    public onKill(killedEntity: LivingEntity) {
        // TODO(ABC):
        // Make this, work differently
        /** @ts-ignore */
        if (typeof this.parent.onKill === 'function') this.parent.onKill(killedEntity);
    }
    public tick(tick: number) {
        super.tick(tick);

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
}
