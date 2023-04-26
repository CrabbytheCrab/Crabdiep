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
import { PhysicsFlags, Stat, StyleFlags, Tank } from "../../../Const/Enums";

import { TankDefinition } from "../../../Const/TankDefinitions";
import { BarrelBase } from "../TankBody";

export default class Grower extends Bullet {
    public sized: number
    public acc:number
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.sized = this.physicsData.values.size
        this.acc = this.baseAccel

    }

    public tick(tick: number) {

        super.tick(tick);
        if (this.tankDefinition && this.tankDefinition.id === Tank.SteamRoller){
            if (this.physicsData.size < this.sized * 6){
                this.physicsData.size += this.sized/30
                this.damageReduction -= 0.15/180
                this.baseAccel -= this.acc/270

            }
        }else{
            if (this.physicsData.size < this.sized * 4){
                this.physicsData.size += this.sized/20
                this.baseAccel -= this.acc/80
            }
        }
        //this.damageReduction += 1 / 25;
        //this.styleData.opacity -= 1 / 25;
    }
}
