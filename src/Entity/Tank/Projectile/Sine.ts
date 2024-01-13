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

import { InputFlags } from "../../../Const/Enums";
import { Entity } from "../../../Native/Entity";
import { Inputs } from "../../AI";
import { BarrelDefinition, TankDefinition } from "../../../Const/TankDefinitions";
import { BarrelBase } from "../TankBody";
import AutoTurret from "../AutoTurret";

/**
 * Barrel definition for the rocketeer rocket's barrel.
 */

/**
 * Represents all rocketeer rockets in game.
 */
export default class Sine extends Bullet {
    /** The rocket's barrel */

    public movedirection:number
    public moveangle:number
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number, direction: number) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.movedirection = direction
        this.moveangle = shootAngle;
    }

    public tick(tick: number) {

        super.tick(tick);

        if (this.deletionAnimation) return;
        let y1 = (Math.sin(this.movementAngle * (Math.PI * tick)))
        let x1 = (Math.cos(this.movementAngle * (Math.PI * tick)))
        this.movementAngle =  Math.atan2(y1, x1);

    } 
}
