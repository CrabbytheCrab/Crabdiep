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
import AbstractBoss from "../../Boss/AbstractBoss";
import LivingEntity from "../../Live";
import * as util from "../../../util";
import ObjectEntity from "../../Object";
import { VectorAbstract } from "../../../Physics/Vector";

/**
 * Barrel definition for the rocketeer rocket's barrel.
 */

/**
 * Represents all rocketeer rockets in game.
 */
export default class Vortex extends Bullet implements BarrelBase{
    /** The size ratio of the skimmer. */
    public sizeFactor: number;
    /** The camera entity (used as team) of the croc skimmer. */
    public cameraEntity: Entity;
    /** The reload time of the skimmer's barrel. */
    public reloadTime = 15;
    /** The inputs for when to shoot or not. (croc skimmer) */
    public inputs: Inputs;
    public succrange: number
    public targetFilter: (possibleTargetPos: VectorAbstract) => boolean;
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.cameraEntity = tank.cameraEntity;
        this.inputs = new Inputs()
        this.sizeFactor = this.physicsData.values.size / 50;
        this.targetFilter = () => true;
        this.succrange = this.physicsData.size * 6
    }
    
    public tick(tick: number) {
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;
        super.tick(tick);
        const closestDistSq = (this.succrange * 2) ** 2;
        const entities = this.game.entities.collisionManager.retrieve(this.positionData.x, this.positionData.y, this.succrange, this.succrange)
        for (let i = 0; i < entities.length; ++i) {
            const entity = entities[i];
            if (!(entity instanceof LivingEntity)) continue; // Check if the target is living

            if (entity.physicsData.values.flags & PhysicsFlags.isBase) continue; // Check if the target is a base
    
            if (entity.relationsData.values.team === this.relationsData.values.team || entity.physicsData.values.sides === 0) continue;
            if (!this.targetFilter(entity.positionData.values)) continue; // Custom check
            const distSq = (entity.positionData.values.x - this.positionData.x) ** 2 + (entity.positionData.values.y - this.positionData.y) ** 2;

            if (distSq < closestDistSq) {
                let kbAngle: number;
                let diffY = this.positionData.values.y - entity.positionData.values.y;
                let diffX = this.positionData.values.x - entity.positionData.values.x;
                if (diffX === 0 && diffY === 0) kbAngle = Math.random() * util.PI2;
                else {kbAngle = Math.atan2(diffY, diffX);
                entity.addAcceleration( kbAngle, this.physicsData.pushFactor)}
                if(entity instanceof Bullet){
                    entity.movementAngle = kbAngle;
                }
            }
        }
    }
}
