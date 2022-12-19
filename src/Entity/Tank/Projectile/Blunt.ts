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
import { BarrelDefinition, TankDefinition } from "../../../Const/TankDefinitions";
import { Entity } from "../../../Native/Entity";
import { Inputs } from "../../AI";
import { BarrelBase } from "../TankBody";
import { GuardObject } from "../Addons";
/**
 * Barrel definition for the rocketeer rocket's barrel.
 */

/**
 * Represents all rocketeer rockets in game.
 */
export default class Blunt extends Bullet implements BarrelBase{
    /** The size ratio of the skimmer. */
    public sizeFactor: number;
    /** The camera entity (used as team) of the croc skimmer. */
    public cameraEntity: Entity;
    /** The reload time of the skimmer's barrel. */
    public reloadTime = 15;
    /** The inputs for when to shoot or not. (croc skimmer) */
    public inputs: Inputs;
    protected megaturret: boolean;
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.cameraEntity = tank.cameraEntity;
        this.inputs = new Inputs()
        this.sizeFactor = this.physicsData.values.size / 50;
        this.megaturret = typeof this.barrelEntity.definition.megaturret === 'boolean' && this.barrelEntity.definition.megaturret;
        if ( this.megaturret){
            new GuardObject(this.game, this, 6, 1.45, 0, .1);
            this.physicsData.values.pushFactor *= 50;
        }else{
            new GuardObject(this.game, this, 6, 1.15, 0, .1);
            this.physicsData.values.pushFactor *= 25;
        }
    }
    
    public tick(tick: number) {
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;
        super.tick(tick);
    }
}
