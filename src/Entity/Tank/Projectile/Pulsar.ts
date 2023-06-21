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

import LivingEntity from "../../Live";
import Barrel from "../Barrel";

import { HealthFlags, PositionFlags, PhysicsFlags, Stat, StyleFlags } from "../../../Const/Enums";
import { TankDefinition } from "../../../Const/TankDefinitions";
import { BarrelBase } from "../TankBody";
import { EntityStateFlags } from "../../../Native/Entity";
import ObjectEntity from "../../Object";
import Bullet from "./Bullet";

/**
 * The bullet class represents the bullet entity in diep.
 */
export default class Pulsar extends Bullet {
    public bool: Boolean
    public inverse: number
    public shootAngle: number
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number, inverse:number) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.shootAngle = shootAngle
        this.bool = true
        this.inverse = inverse
    }
    public tick(tick: number) {
        super.tick(tick);
        if(tick - this.spawnTick >= 6 && this.bool){
            this.movementAngle = this.shootAngle + Math.PI
            this.baseAccel *= 2
            this.positionData.angle = this.inverse + Math.PI
            this.bool = false
        }
    }
}
