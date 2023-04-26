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

const RocketBarrelDefinition: BarrelDefinition = {
    angle: 2.6179938779914944,
    offset: 0,
    size: 70,
    width: 34,
    delay: 0,
    reload: 0.6,
    recoil: 2,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.4,
        damage: 0.2,
        speed: 1,
        scatterRate: 1,
        lifeLength: 0.2,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};


const RocketBarrelDefinition2: BarrelDefinition = {
    angle: 3.665191429188092,
    offset: 0,
    size: 70,
    width: 34,
    delay: 0,
    reload: 0.6,
    recoil: 2,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.4,
        damage: 0.2,
        speed: 1,
        scatterRate: 1,
        lifeLength: 0.2,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const RocketBarrelDefinition3: BarrelDefinition = {
    angle: Math.PI,
    offset: 0,
    size: 80,
    width: 48,
    delay: 0,
    reload: 0.6,
    recoil: 2,
    isTrapezoid: true,
    trapezoidDirection: Math.PI,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.4,
        damage: 0.5,
        speed: 1,
        scatterRate: 1,
        lifeLength: 0.2,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
/**
 * Represents all rocketeer rockets in game.
 */
export default class Snake extends Bullet implements BarrelBase {
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

    public movedirection:number
    public moveangle:number
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number, direction: number) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.movedirection = direction
        this.moveangle = shootAngle;
        this.cameraEntity = tank.cameraEntity;
        this.usePosAngle = true
        this.sizeFactor = this.physicsData.values.size / 50;
        const skimmerBarrels: Barrel[] = this.launrocketBarrel =[];
        const s1 = new class extends Barrel {
            // Keep the width constant
            protected resize() {
                super.resize();
            }
        }(this, {...RocketBarrelDefinition});
        const s2 = new class extends Barrel {
            // Keep the width constant
            protected resize() {
                super.resize();
            }
        }(this, RocketBarrelDefinition2);
        const s3 = new class extends Barrel {
            // Keep the width constant
            protected resize() {
                super.resize();
            }
        }(this, RocketBarrelDefinition3);
        s1.styleData.values.color = this.styleData.values.color;
        s2.styleData.values.color = this.styleData.values.color;
        s3.styleData.values.color = this.styleData.values.color;

        skimmerBarrels.push(s1, s2,s3);
    }

    public tick(tick: number) {
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;

        super.tick(tick);

        if (this.deletionAnimation) return;
        // not fully accurate
        if (tick - this.spawnTick >= this.tank.reloadTime){ this.inputs.flags |= InputFlags.leftclick;
            if(this.movedirection == 1){
                if(this.positionData.angle <= this.moveangle + Math.PI/8){
                    this.positionData.angle += (Math.PI/8 * 0.05)
                }else{
                    this.movedirection = 0
                }
            }
            if(this.movedirection == 0){
                if(this.positionData.angle >= this.moveangle - Math.PI/8){
                    this.positionData.angle +=  (-Math.PI/8 * 0.05)
                }else{
                    this.movedirection = 1
                }
            }
        }
    } 
}
