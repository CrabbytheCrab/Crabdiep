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
import ObjectEntity from "../../Object";
import Vector from "../../../Physics/Vector";

/**
 * Barrel definition for the rocketeer rocket's barrel.
 */

const RocketBarrelDefinition: BarrelDefinition = {
    angle: Math.PI +  Math.PI / 5,
    offset: 0,
    size: 70,
    width: 37.8,
    delay: 0.5,
    reload: 0.75,
    recoil: 4,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.6,
        damage: 0.8,
        speed: 0.8,
        scatterRate: 1,
        lifeLength: 0.5,
        sizeRatio: 1,
        absorbtionFactor: 0.5
    }
};


const RocketBarrelDefinition2: BarrelDefinition = {
    angle: Math.PI -  Math.PI / 5,
    offset: 0,
    size: 70,
    width: 37.8,
    delay: 0.5,
    reload: 0.75,
    recoil: 4,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.6,
        damage: 0.8,
        speed: 0.8,
        scatterRate: 1,
        lifeLength: 0.5,
        sizeRatio: 1,
        absorbtionFactor: 0.5
    }
};
/**
 * Represents all rocketeer rockets in game.
 */
export default class Skimmer extends Bullet implements BarrelBase {
    /** The rocket's barrel */
    private launrocketBarrel: Barrel[];

    /** The size ratio of the rocket. */
    public sizeFactor: number;
    /** The camera entity (used as team) of the rocket. */
    public cameraEntity: Entity;
    /** The reload time of the rocket's barrel. */
    public reloadTime = 1;
    /** The inputs for when to shoot or not. (Rocket) */
    public inputs = new Inputs();


    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel, tank, tankDefinition, shootAngle);
        
        this.cameraEntity = tank.cameraEntity;
        this.sizeFactor = this.physicsData.values.size / 50;
        const skimmerBarrels: Barrel[] = this.launrocketBarrel =[];
        const s1 = new class extends Barrel {
            // Keep the width constant
            protected resize() {
                super.resize();
               // this.physicsData.values.width = this.definition.width
                // this.physicsData.state.width = 0;
            }
        }(this, {...RocketBarrelDefinition});
        const s2 = new class extends Barrel {
            // Keep the width constant
            protected resize() {
                super.resize();
               // this.physicsData.width = this.definition.width
            }
        }(this, RocketBarrelDefinition2);

        s1.styleData.values.color = this.styleData.values.color;
        s2.styleData.values.color = this.styleData.values.color;

        skimmerBarrels.push(s1, s2);
    }

    public tick(tick: number) {
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;

        super.tick(tick);

        if (this.deletionAnimation) return;
        // not fully accurate
        this.inputs.flags |= InputFlags.leftclick;
        // Only accurate on current version, but we dont want that
        // if (!Entity.exists(this.barrelEntity.rootParent) && (this.inputs.flags & InputFlags.leftclick)) this.inputs.flags ^= InputFlags.leftclick; 

    }
}