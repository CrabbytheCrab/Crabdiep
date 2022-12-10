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

import { Color } from "../../Const/Enums";
import Triangle from "./Triangle";
import { BarrelBase } from "../Tank/TankBody";
import Barrel from "../Tank/Barrel";
import { Entity } from "../../Native/Entity";
import { BarrelDefinition } from "../../Const/TankDefinitions";
import { AI } from "../AI";
import { tps } from "../../config";
import AbstractShape from "./AbstractShape";
import { PI2 } from "../../util";
import { TrapLauncher } from "../Tank/BarrelAddons";
import AutoTurret from "../Tank/AutoTurret";

const GuardianSpawnerDefinition: BarrelDefinition = {
    angle: Math.PI,
    offset: 0,
    size: 90,
    width: 47,
    delay: 0,
    reload: 6,
    recoil: 0,
    isTrapezoid: true,
    trapezoidDirection: 3.141592653589793,
    addon: null,
    droneCount: 3,
    canControlDrones: true,
    bullet: {
        type: "drone",
        sizeRatio:1,
        health: 1,
        damage: 2,
        speed: 1.8,
        scatterRate: 0,
        lifeLength: -1,
        absorbtionFactor: 0.5,
        color: Color.Neutral
    }
};

const GuardianSpawnerDefinition2: BarrelDefinition = {
    angle: Math.PI,
    offset: 0,
    size: 70,
    width: 62,
    delay: 0,
    reload: 4.5,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    forceFire: true,
    addon: "trapLauncher",
    canControlDrones: true,
    bullet: {
        type: "trap",
        sizeRatio:1,
        health: 1,
        damage: 2,
        speed: 1,
        scatterRate: 1,
        lifeLength: 1,
        absorbtionFactor: 0.5,
        color: Color.Neutral
    }
};
export default class WepTriangle extends Triangle implements BarrelBase {
    public sizeFactor: number;
    public cameraEntity: Entity = this;
    public inputs;
    public reloadTime = 4;
    ai: AI;
    barrel: Barrel[] = []
    public constructor(game: GameServer, shiny=Math.random() < 0.000001) {
        super(game);
        const rand = Math.random();
    
        this.sizeFactor = this.physicsData.values.size / 50;
        this.ai = new AI(this);
        this.ai.viewRange = 800;
        this.ai.aimSpeed = (this.ai.movementSpeed);
        this.ai['_findTargetInterval'] = tps;
        this.inputs = this.ai.inputs;
        this.nameData.values.name = "Weaponized Triangle";
        this.healthData.values.health = this.healthData.values.maxHealth = 210;
        this.physicsData.values.size = 68.75 * Math.SQRT1_2;
        this.physicsData.values.sides = 3;
        this.styleData.values.color = shiny ? Color.Shiny : Color.EnemyTriangle;
        this.physicsData.values.absorbtionFactor = 0.1;
        this.physicsData.values.pushFactor = 120;
        this.damagePerTick = 14;
        this.scoreReward = 250;
        this.isShiny = shiny;

        if (shiny) {
            this.scoreReward *= 100;
            this.healthData.values.health = this.healthData.values.maxHealth *= 10;
        }


        if(rand < 0.5){
            for (let i = 0; i < 3; ++i) {
                // Add trap launcher
                this.barrel.push(new Barrel(this, {
                    ...GuardianSpawnerDefinition,
                    angle: PI2 * ((i / 3) - 1 / 6)
                }));
            }
        }else{
            const atuo = new AutoTurret(this, {
                angle: 0,
                offset: 0,
                size: 70,
                width: 40,
                delay: 0,
                reload: 1,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1,
                    damage: 1,
                    speed: 1.5,
                    scatterRate: 0.3,
                    lifeLength: 1,
                    absorbtionFactor: 0.1,
                    color: Color.Neutral
                }
            });
            atuo.ai.viewRange = 800;
            atuo.baseSize *= 1.125
            for (let i = 0; i < 3; ++i) {
                // Add trap launcher
                this.barrel.push(new Barrel(this, {
                    ...GuardianSpawnerDefinition2,
                    angle: PI2 * ((i / 3) - 1 / 6)
                }));
            }
        }
    }
}
