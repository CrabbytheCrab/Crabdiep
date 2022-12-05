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

export default class WepTriangle extends Triangle implements BarrelBase {
    public sizeFactor: number;
    public cameraEntity: Entity = this;
    public inputs;
    public reloadTime = 4;
    ai: AI;
    public constructor(game: GameServer, shiny=Math.random() < 0.000001) {
        super(game);
        
        this.sizeFactor = this.physicsData.values.size / 50;
        this.ai = new AI(this);
        this.ai.viewRange = 800;
        this.ai.aimSpeed = (this.ai.movementSpeed);
        this.ai['_findTargetInterval'] = tps;
        this.inputs = this.ai.inputs;
        this.nameData.values.name = "Weaponized Triangle";
        this.healthData.values.health = this.healthData.values.maxHealth = 210;
        this.physicsData.values.size = 55 * Math.SQRT1_2;
        this.physicsData.values.sides = 3;
        this.styleData.values.color = shiny ? Color.Shiny : Color.EnemyTriangle;

        this.damagePerTick = 8;
        this.scoreReward = 250;
        this.isShiny = shiny;

        if (shiny) {
            this.scoreReward *= 100;
            this.healthData.values.health = this.healthData.values.maxHealth *= 10;
        }



        let barsss: Barrel;
        let GuardianSpawnerDefinition: BarrelDefinition = {
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
            droneCount: 6,
            canControlDrones: true,
            bullet: {
                type: "drone",
                sizeRatio:1,
                health: 1,
                damage: 1,
                speed: 1.8,
                scatterRate: 0,
                lifeLength: 1.5,
                absorbtionFactor: 0.5
            }
        };
        let GuardianSpawnerDefinition2: BarrelDefinition = {
            angle: Math.PI/3,
            offset: 0,
            size: 90,
            width: 47,
            delay: 0,
            reload: 6,
            recoil: 0,
            isTrapezoid: true,
            trapezoidDirection: 3.141592653589793,
            addon: null,
            droneCount: 6,
            canControlDrones: true,
            bullet: {
                type: "drone",
                sizeRatio:1,
                health: 1,
                damage: 1,
                speed: 1.8,
                scatterRate: 0,
                lifeLength: 1.5,
                absorbtionFactor: 0.5
            }
        };
        let GuardianSpawnerDefinition3: BarrelDefinition = {
            angle: Math.PI/-3,
            offset: 0,
            size: 90,
            width: 47,
            delay: 0,
            reload: 6,
            recoil: 0,
            isTrapezoid: true,
            trapezoidDirection: 3.141592653589793,
            addon: null,
            droneCount: 6,
            canControlDrones: true,
            bullet: {
                type: "drone",
                sizeRatio:1,
                health: 1,
                damage: 1,
                speed: 1.8,
                scatterRate: 0,
                lifeLength: 1.5,
                absorbtionFactor: 0.5
            }
        };
        barsss = new Barrel(this, GuardianSpawnerDefinition);
        barsss = new Barrel(this, GuardianSpawnerDefinition2);
        barsss = new Barrel(this, GuardianSpawnerDefinition3);
    }
}
