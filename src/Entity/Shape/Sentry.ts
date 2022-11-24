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

import GameServer from "../../Game";
import LivingEntity from "../Live";
import AbstractShape from "./AbstractShape";

import { Colors, MotionFlags } from "../../Const/Enums";
import { AI, AIState } from "../AI";
import { BarrelBase } from "../Tank/TankBody";
import Crasher from "./Crasher";
import { Entity } from "../../Native/Entity";
import AutoTurret from "../Tank/AutoTurret";
import { BarrelDefinition } from "../../Const/TankDefinitions";
import Barrel from "../Tank/Barrel";

/**
 * Crasher entity class.
 */
 let GuardianSpawnerDefinition2: BarrelDefinition = {
    angle: Math.PI,
    offset: 0,
    size: 0,
    width: 0,
    delay: 0,
    reload: 0.25,
    recoil: 1,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    droneCount: 0,
    canControlDrones: true,
    bullet: {
        type: "drone",
        sizeRatio: 21 / (71.4 / 2),
        health: 1.5,
        damage: 0.5,
        speed: 2,
        scatterRate: 1,
        lifeLength: 1.5,
        absorbtionFactor: 1
    }
};
 export class Sentry extends Crasher implements BarrelBase {
    public sizeFactor: number;
    public cameraEntity: Entity = this;
    public inputs;
    public reloadTime = 4;
    public constructor(game: GameServer, large=false) {
        super(game, large);

        this.sizeFactor = this.physics.values.size / 50;
        this.inputs = this.ai.inputs;
        this.isLarge = false
        const rand = Math.random();
        if(rand < 0.5){
            let barsss: Barrel;
            let GuardianSpawnerDefinition: BarrelDefinition = {
                angle: Math.PI,
                offset: 0,
                size: 90,
                width: 63,
                delay: 0,
                reload: 1,
                recoil: 3,
                isTrapezoid: true,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio:1,
                    health: 1,
                    damage: 1,
                    speed: 0.5,
                    scatterRate: 3,
                    lifeLength: 1.5,
                    absorbtionFactor: 1
                }
            };
            let GuardianSpawnerDefinition2: BarrelDefinition = {
                angle: 0,
                offset: 0,
                size: 140,
                width: 63,
                delay: 0,
                reload: 3,
                recoil: 1,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1.5,
                    damage: 1,
                    speed: 1.5,
                    scatterRate: 3,
                    lifeLength: 1.5,
                    absorbtionFactor: 1
                }
            };
            barsss = new Barrel(this, GuardianSpawnerDefinition);
            barsss = new Barrel(this, GuardianSpawnerDefinition2);

        }else{
            let barsss: Barrel;
            let GuardianSpawnerDefinition: BarrelDefinition = {
                angle: Math.PI,
                offset: 0,
                size: 90,
                width: 89.25,
                delay: 0,
                reload: 9,
                recoil: 1,
                isTrapezoid: true,
                trapezoidDirection: 0,
                addon: null,
                droneCount: 12,
                canControlDrones: true,
                bullet: {
                    type: "drone",
                    sizeRatio: 21 / (71.4 / 2),
                    health: 1.5,
                    damage: 0.5,
                    speed: 2,
                    scatterRate: 0,
                    lifeLength: 1.5,
                    absorbtionFactor: 1
                }
            };
            barsss = new Barrel(this, GuardianSpawnerDefinition);
        }

        //this.barsss = new Barrel(this, GuardianSpawnerDefinition2);
        this.position.values.motion |= MotionFlags.canMoveThroughWalls;
        this.health.values.health = this.health.values.maxHealth = 500;
        this.physics.values.size =  85 * Math.SQRT1_2;
        this.physics.values.sides = 3;
        this.physics.values.absorbtionFactor = 0.1;
        this.physics.values.pushFactor =  18;

        this.style.values.color = Colors.EnemyCrasher;

        this.scoreReward = 1000;
        this.damagePerTick = 10;

        this.ai = new AI(this);
        this.ai.viewRange = 2000;
        this.ai.isTaken = true;
        this.ai.aimSpeed = (this.ai.movementSpeed = this.targettingSpeed);
  }
}
