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
import Square from "./Square";
import { BarrelBase } from "../Tank/TankBody";
import Barrel from "../Tank/Barrel";
import { Entity } from "../../Native/Entity";
import { BarrelDefinition } from "../../Const/TankDefinitions";
import { AI } from "../AI";
import { tps } from "../../config";
import AbstractShape from "./AbstractShape";
import { PI2 } from "../../util";
const GuardianSpawnerDefinition: BarrelDefinition = {
    angle: Math.PI,
    offset: 0,
    size: 90,
    width: 57,
    delay: 0,
    reload: 2,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        sizeRatio:1,
        health: 5,
        damage: 0.85,
        speed: 1.25,
        scatterRate: 1,
        lifeLength: 0.5,
        absorbtionFactor: 1,
        color: Color.Neutral
    }
};

const GuardianSpawnerDefinition2: BarrelDefinition = {
    angle: Math.PI,
    offset: 0,
    size: 90,
    width: 60,
    delay: 0,
    reload: 6,
    recoil: 0,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    droneCount: 1,
    bullet: {
        type: "drone",
        sizeRatio:1,
        health: 3.5,
        damage: 1.5,
        speed: 1,
        scatterRate: 0,
        lifeLength: -1,
        absorbtionFactor: 1,
        sides: 4,
        color: Color.NecromancerSquare
    }
};
export default class WepSquare extends Square implements BarrelBase {
    public sizeFactor: number;
    public cameraEntity: Entity = this;
    public inputs;
    public reloadTime = 4;
    barrel: Barrel[] = []
    ai: AI;
    public constructor(game: GameServer, shiny=Math.random() < 0.000001) {
        super(game);
        const rand = Math.random();
        this.sizeFactor = this.physicsData.values.size / 50;
        this.ai = new AI(this);
        this.ai.viewRange = 1000;
        this.ai.aimSpeed = (this.ai.movementSpeed);
        this.ai['_findTargetInterval'] = tps;
        this.inputs = this.ai.inputs;
        this.nameData.values.name = "Weaponized Square";
        this.healthData.values.health = this.healthData.values.maxHealth = 100;
        this.physicsData.values.size = 68.75 * Math.SQRT1_2;
        this.physicsData.values.sides = 4;
        this.styleData.values.color = shiny ? Color.Shiny : Color.EnemySquare;
        this.physicsData.values.absorbtionFactor = 0.1;
        this.physicsData.values.pushFactor = 2;
        this.damagePerTick = 12;
        this.scoreReward = 100;
        this.isShiny = shiny;

        if (shiny) {
            this.scoreReward *= 100;
            this.healthData.values.health = this.healthData.values.maxHealth *= 10;
        }



        if(rand < 0.5){
            for (let i = 0; i < 4; ++i) {
                // Add trap launcher
                this.barrel.push(new Barrel(this, {
                    ...GuardianSpawnerDefinition,
                    angle: PI2 * ((i / 4))
                }));
            }
        }else{
            for (let i = 0; i < 4; ++i) {
                // Add trap launcher
                this.barrel.push(new Barrel(this, {
                    ...GuardianSpawnerDefinition2,
                    angle: PI2 * ((i / 4))
                }));
            }
        }
    }
}