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

import { PhysicsFlags, PositionFlags, StyleFlags, Tank } from "../../../Const/Enums";
import { TankDefinition } from "../../../Const/TankDefinitions";
import TankBody, { BarrelBase } from "../TankBody";
import { DevTank } from "../../../Const/DevTankDefinitions";
import { PI2 } from "../../../util";
import ObjectEntity from "../../Object";
import LivingEntity from "../../Live";
import AbstractShape from "../../Shape/AbstractShape";
import MazeWall from "../../Misc/MazeWall";
import AbstractBoss from "../../Boss/AbstractBoss";

/**
 * The trap class represents the trap (projectile) entity in diep.
 */
export default class Leach extends Bullet {
    /** Number of ticks before the trap cant collide with its own team. */
    protected collisionEnd = 0;
    protected parent: ObjectEntity;

    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number, parent?: ObjectEntity) {
        super(barrel, tank, tankDefinition, shootAngle);

        const bulletDefinition = barrel.definition.bullet;
        this.parent = parent ?? tank;

    
    }
    public onKill(killedEntity: LivingEntity) {
        // TODO(ABC):
        // Make this, work differently
        /** @ts-ignore */
        if (typeof this.parent.onKill === 'function') this.parent.onKill(killedEntity);
        if (this.tankDefinition && this.tankDefinition.id === Tank.Restorer){
            if(this.parent.healthData != null){
                if(killedEntity instanceof AbstractShape){
                this.parent.healthData.health += this.parent.healthData.maxHealth/16
                }else if (killedEntity instanceof TankBody || killedEntity instanceof AbstractBoss){
                this.parent.healthData.health += this.parent.healthData.maxHealth/4
                }
            }
        }
    }
    public tick(tick: number) {
        super.tick(tick);

        if (this.isPhysical && !(this.deletionAnimation)) {
        if (this.tankDefinition && this.tankDefinition.id !== Tank.Restorer){
                const collidedEntities = this.findCollisions();
                for (let i = 0; i < collidedEntities.length; ++i) {
                    if (collidedEntities[i] instanceof TankBody || collidedEntities[i] instanceof AbstractShape || collidedEntities[i] instanceof AbstractBoss){
                        if(this.parent.healthData != null){
                            if(this.parent.healthData.health > this.damagePerTick/4){
                                this.parent.healthData.health += this.damagePerTick/4
                            }
                        }
                    }
                }
            }
        }
    }
}
