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
import * as util from "../../util";

import { Color, PositionFlags, StyleFlags } from "../../Const/Enums";
import { AI, AIState } from "../AI";
import { tps } from "../../config";
import { Entity } from "../../Native/Entity";
import TankBody, { BarrelBase } from "../Tank/TankBody";
import ObjectEntity from "../Object";
import { BarrelDefinition } from "../../Const/TankDefinitions";
import Barrel from "../Tank/Barrel";
import AutoTurret from "../Tank/AutoTurret";

/**
 * Crasher entity class.
 */
const GuardianSpawnerDefinition: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 135,
    width: 42 * 1.4,
    delay: 0,
    reload: 12,
    recoil: 1,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        sizeRatio:1,
        health: 5,
        damage: 15,
        speed: 0.75,
        scatterRate: 1,
        lifeLength: 3,
        absorbtionFactor: 1
    }
};
const GuardianSpawnerDefinition2: BarrelDefinition = {
    angle: Math.PI,
    offset: 0,
    size: 70,
    width: 42 * 1.2,
    delay: 0,
    reload: 15,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: "trapLauncher",
    canControlDrones: true,
    bullet: {
        type: "trap",
        sizeRatio:1,
        health: 40,
        damage: 1.2,
        speed: 1,
        scatterRate: 1,
        lifeLength: 8,
        absorbtionFactor: 0.5
    }
};
export default class Abyssling extends AbstractShape implements BarrelBase {
    /** Controls the artificial intelligence of the crasher */
    public ai: AI;
    /** The max speed the crasher can move when targetting a player.s */
    public targettingSpeed: number;
    public sizeFactor: number;
    public cameraEntity: Entity = this;
    public inputs;
    public reloadTime = 4;
    public barrel: Barrel [] = []
    public constructor(game: GameServer) {
        super(game);

        this.nameData.values.name = "Abyssling";
       // this.positionData.values.flags |= PositionFlags.canMoveThroughWalls;
        this.healthData.values.health = this.healthData.values.maxHealth = 4500;
        this.physicsData.values.size = 140 * Math.SQRT1_2;
        this.physicsData.values.sides = 1;
        this.physicsData.values.absorbtionFactor = 0.1;
        this.physicsData.values.pushFactor =    12;
        this.sizeFactor = this.physicsData.values.size / 50;

        this.styleData.values.color = Color.Neutral;
        this.noMultiplier = true
        this.scoreReward =  20000;
        this.damagePerTick = 14;
        this.targettingSpeed = 0.65;

        this.ai = new AI(this);
        this.ai.viewRange = 2000;
        this.ai.aimSpeed = (this.ai.movementSpeed = this.targettingSpeed);
        this.ai['_findTargetInterval'] = tps;
        this.inputs = this.ai.inputs;

        const size = this.physicsData.values.size;

        const pronounce = new ObjectEntity(this.game);
        pronounce.setParent(this);
        pronounce.relationsData.values.owner = this;
        pronounce.relationsData.values.team = this.relationsData.values.team

        pronounce.physicsData.values.size = size * 1.1;

        pronounce.styleData.values.color = Color.Border;
        pronounce.physicsData.values.sides = 6;
        const tickBase = pronounce.tick;
        pronounce.tick = (tick: number) => {
            const size = this.physicsData.values.size;

            pronounce.physicsData.size = size * 1.1;
            pronounce.positionData.angle = Math.PI/2;
            tickBase.call(pronounce, tick);
        }

        const pronounce2 = new ObjectEntity(this.game);
        pronounce2.setParent(this);
        pronounce2.relationsData.values.owner = this;
        pronounce2.relationsData.values.team = this.relationsData.values.team
        pronounce2.styleData.flags |= StyleFlags.showsAboveParent;

        pronounce2.physicsData.values.size = size;

        pronounce2.styleData.values.color = this.styleData.color;
        pronounce2.physicsData.values.sides = 6;
        const tickBase2 = pronounce2.tick;
        pronounce2.tick = (tick: number) => {
            const size = this.physicsData.values.size;

            pronounce2.physicsData.size = size;
            pronounce2.positionData.angle = Math.PI/2;
            tickBase2.call(pronounce2, tick);
        }

        const pronounce3 = new ObjectEntity(this.game);
        pronounce3.setParent(this);
        pronounce3.relationsData.values.owner = this;
        pronounce3.relationsData.values.team = this.relationsData.values.team
        pronounce3.styleData.flags |= StyleFlags.showsAboveParent;

        pronounce3.physicsData.values.size = this.physicsData.values.size * 0.8;

        pronounce3.styleData.values.color = Color.Border;
        pronounce3.physicsData.values.sides = 6;
        const tickBase3 = pronounce3.tick;
        pronounce3.tick = (tick: number) => {
            const size = this.physicsData.values.size * 0.8;
            pronounce3.positionData.angle = Math.PI/2;

            pronounce3.physicsData.size = size;
            tickBase3.call(pronounce3, tick);
        }
        const pronounce4 = new ObjectEntity(this.game);

        pronounce4.setParent(this);
        pronounce4.relationsData.values.owner = this;
        pronounce4.relationsData.values.team = this.relationsData.values.team

        pronounce4.physicsData.values.size = size;
        pronounce4.styleData.flags |= StyleFlags.showsAboveParent;

        pronounce4.styleData.values.color = this.styleData.color;
        pronounce4.physicsData.values.sides = 6;
        const tickBase4 = pronounce4.tick;
        pronounce4.tick = (tick: number) => {
            const size = this.physicsData.values.size;

            pronounce4.physicsData.size = size * 0.7;
            pronounce4.positionData.angle = Math.PI/2;
            tickBase4.call(pronounce4, tick);
        }

        for (let i = 0; i < 3; ++i) {
            // Add trap launcher
            this.barrel.push(new Barrel(this, {
                ...GuardianSpawnerDefinition2,
                angle: util.PI2 * ((i / 3) - 1 / 6)
            }));
        }
        for (let i = 0; i < 2; ++i) {
            // Add trap launcher
            this.barrel.push(new Barrel(this, {
                ...GuardianSpawnerDefinition2,
                angle: util.PI2 * (((i+ 1) / 3))
            }));
        }
        this.barrel.push(new Barrel(this,GuardianSpawnerDefinition,));

        const atuo = new AutoTurret(this, {
            angle: 0,
            offset: 0,
            size: 80,
            width: 42 * 0.9,
            delay: 0,
            reload: 3,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "bullet",
                sizeRatio: 1,
                health: 5,
                damage: 3,
                speed: 2,
                scatterRate: 0.3,
                lifeLength: 1,
                absorbtionFactor: 0.1,
            }
        });
        atuo.ai.viewRange = 1200;
        atuo.baseSize *= 1.2
    }

    tick(tick: number) {
        this.ai.aimSpeed = 0;
        this.ai.movementSpeed = this.targettingSpeed;

        if (this.ai.state === AIState.idle) {
            this.doIdleRotate = true;
            //this.positionData.angle += this.rotationRate - this.positionData.angle * 0.1;
        } else {
            this.doIdleRotate = false;

            this.positionData.angle =   Math.atan2(this.ai.inputs.mouse.y - this.positionData.values.y, this.ai.inputs.mouse.x - this.positionData.values.x)
            this.accel.add({
                x: this.ai.inputs.movement.x * this.targettingSpeed,
                y: this.ai.inputs.movement.y * this.targettingSpeed
            });
        }
        this.ai.inputs.movement.set({
            x: 0,
            y: 0
        })

        super.tick(tick);
    }
    public onKill(entity: LivingEntity) {
        if (entity instanceof TankBody){
        this.scoreReward += entity.cameraEntity.cameraData.score/2;}else{
            this.scoreReward += entity.scoreReward;
        }
    }
}
