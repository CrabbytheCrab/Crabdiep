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
import { PhysicsFlags, Stat, StyleFlags } from "../../../Const/Enums";

import { TankDefinition } from "../../../Const/TankDefinitions";
import { BarrelBase } from "../TankBody";

export default class Explosion extends Bullet {
    public sized: number
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.sized = this.physicsData.values.size
        this.baseAccel = 0
        this.baseSpeed = 0;
        
        this.physicsData.values.sides = 1;
        this.physicsData.values.absorbtionFactor = 0;
        this.physicsData.values.pushFactor = 25;
        if (this.physicsData.values.flags & PhysicsFlags.noOwnTeamCollision) this.physicsData.values.flags ^= PhysicsFlags.noOwnTeamCollision;
    }
    public destroy(animate=false) {
        super.destroy(animate);
    }
    public tick(tick: number) {
        super.tick(tick);
        if (this.physicsData.size < this.sized * 20){
        this.physicsData.size += this.sized * 2
        this.styleData.opacity -= 1 / 10;
    }
        if (this.physicsData.size >= this.sized * 20){
            this.destroy(false)
        }
        //this.damageReduction += 1 / 25;
        //this.styleData.opacity -= 1 / 25;
    }
}
