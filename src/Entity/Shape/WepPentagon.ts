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
import AbstractShape from "./AbstractShape";

import { Color, PositionFlags, StyleFlags } from "../../Const/Enums";
import { BarrelBase } from "../Tank/TankBody";
import { Entity } from "../../Native/Entity";
import { AI, AIState, Inputs } from "../AI";
import { tps } from "../../config";
import AutoTurret, { AutoTurretDefinition } from "../Tank/AutoTurret";
import Pentagon from "./Pentagon";
import { BarrelDefinition } from "../../Const/TankDefinitions";
import { normalizeAngle, PI2 } from "../../util";
import Barrel from "../Tank/Barrel";


const GuardianSpawnerDefinition: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 80,
    width: 65,
    delay: 0,
    reload: 6,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: "trapLauncher",
    forceFire: true,
    bullet: {
        type: "trap",
        sizeRatio:0.8,
        health: 3,
        damage: 1.25,
        speed: 2,
        scatterRate: 1,
        lifeLength: 2,
        absorbtionFactor: 1,
        color: Color.Neutral
    }
};

const GuardianSpawnerDefinition2: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 150,
    width: 120,
    delay: 0,
    reload: 6,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    forceFire: true,
    addon: "trapLauncher",
    bullet: {
        type: "trap",
        sizeRatio:0.8,
        health: 4,
        damage: 3,
        speed: 2,
        scatterRate: 1,
        lifeLength: 2,
        absorbtionFactor: 0.1,
        color: Color.Neutral
    }
};
const GuardianSpawnerDefinition3: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 300,
    width: 120,
    delay: 0,
    reload: 4,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: "minionLauncher",
    droneCount: 1,
    bullet: {
        type: "pentadrone",
        sizeRatio:1,
        health: 5,
        damage: 4,
        speed: 3,
        scatterRate: 0,
        lifeLength: -1,
        absorbtionFactor: 1,
    }
};
const GuardianSpawnerDefinition4: BarrelDefinition = {
    angle: 0,
    offset: 30,
    size: 180,
    width: 40,
    delay: 0,
    reload: 1,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        sizeRatio:1,
        health: 1,
        damage: 1.25,
        speed: 2,
        scatterRate: 1,
        lifeLength: 2,
        absorbtionFactor: 1,
        color: Color.Neutral
    }
};
/**
 * Pentagon entity class.
 */
export default class WepPentagon extends Pentagon implements BarrelBase {
    /** If the pentagon is an alpha pentagon or not */
    public isAlpha: boolean;
    protected static BASE_ROTATION = AbstractShape.BASE_ROTATION / 2;
    protected static BASE_ORBIT = AbstractShape.BASE_ORBIT / 2;
    protected static BASE_VELOCITY = AbstractShape.BASE_VELOCITY / 2;
    public sizeFactor: number;
    public cameraEntity: Entity = this;
    public inputs;
    private trappers: Barrel[] = [];
    private base: AutoTurret[] = [];
    public reloadTime = 4;
    ai: AI;
    public constructor(game: GameServer, isAlpha=false, shiny=(Math.random() < 0.000001) && !isAlpha) {
        super(game);
        this.sizeFactor = this.physicsData.values.size/50;
        this.ai = new AI(this);
        this.ai.viewRange = 800;
        this.ai.aimSpeed = (this.ai.movementSpeed);
        this.ai['_findTargetInterval'] = tps;
        this.inputs = this.ai.inputs;       
        this.nameData.values.name = isAlpha ? "Omega Pentagon" : "Weaponized Pentagon";
        if(isAlpha){
        const atuo = new AutoTurret(this, {
            angle: 0,
            offset: 0,
            size: 150,
            width: 120,
            delay: 0,
            reload: 4,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "bullet",
                sizeRatio: 1,
                health: 4,
                damage: 3,
                speed: 2,
                scatterRate: 0.3,
                lifeLength: 1.75,
                absorbtionFactor: 0.1,
                color: Color.Neutral
            }
        });
        atuo.ai.viewRange = 800;
        //atuo.ai.passiveRotation = this.movementAngle
        atuo.styleData.values.flags |= StyleFlags.showsAboveParent;
        const MAX_ANGLE_RANGE = PI2 / 4; // keep within 90º each side
        atuo.baseSize = 100;
        for (let i = 0; i < 5; ++i) {
             const base  = [new AutoTurret(this, GuardianSpawnerDefinition2)];
             base[0].influencedByOwnerInputs = true;
             base[0].baseSize = 100;
             base[0].ai.viewRange = 800;
            const angle = base[0].ai.inputs.mouse.angle = PI2 * (i / 5);
            base[0].ai.passiveRotation = AI.PASSIVE_ROTATION;
            base[0].positionData.values.y = this.physicsData.values.size * Math.sin(angle) * 1.1;
            base[0].positionData.values.x = this.physicsData.values.size * Math.cos(angle) * 1.1;

            if (base[0].styleData.values.flags & StyleFlags.showsAboveParent) base[0].styleData.values.flags ^= StyleFlags.showsAboveParent;
            base[0].physicsData.values.flags |= PositionFlags.absoluteRotation;
            base[0].ai.targetFilter = (targetPos) => {
                const pos = base[0].getWorldPosition();
                const angleToTarget = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
                
                const deltaAngle = normalizeAngle(angleToTarget - ((angle + this.positionData.values.angle)));

                return deltaAngle < MAX_ANGLE_RANGE || deltaAngle > (PI2 - MAX_ANGLE_RANGE);
            }
            const tickBase = base[0].tick;
            base[0].tick = (tick: number) => {
                base[0].positionData.y = this.physicsData.values.size * Math.sin(angle) * 1.1;
                base[0].positionData.x = this.physicsData.values.size * Math.cos(angle) * 1.1;
                if (base[0].ai.state === AIState.idle) base[0].positionData.angle = angle + this.positionData.values.angle
                tickBase.call(base[0], tick);
            }
        }
        for (let i = 0; i < 5; ++i) {
            // Add trap launcher
            this.trappers.push(new Barrel(this, {
                ...GuardianSpawnerDefinition3,
                angle: PI2 * ((i / 5) - 1 / 10)
            }));
        }
    }
        if(!isAlpha){
            const atuo = new AutoTurret(this, {
                angle: 0,
                offset: 0,
                size: 80,
                width: 43.5,
                delay: 0,
                reload: 3,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 2,
                    damage: 1.5,
                    speed: 2,
                    scatterRate: 0.3,
                    lifeLength: 1,
                    absorbtionFactor: 0.1,
                    color: Color.Neutral
                }
            });
            atuo.ai.viewRange = 800;
            //atuo.ai.passiveRotation = this.movementAngle
            atuo.styleData.values.flags |= StyleFlags.showsAboveParent;
            atuo.baseSize = 35;
            for (let i = 0; i < 5; ++i) {
                // Add trap launcher
                this.trappers.push(new Barrel(this, {
                    ...GuardianSpawnerDefinition,
                    angle: PI2 * ((i / 5) - 1 / 10)
                }));
            }
            }
        this.healthData.values.health = this.healthData.values.maxHealth = (isAlpha ? 15000 : 1700);
        this.physicsData.values.size = (isAlpha ? 300 : 93.75) * Math.SQRT1_2;
        this.physicsData.values.sides = 5;
        this.styleData.values.color = shiny ? Color.Shiny : Color.EnemyPentagon;

        this.physicsData.values.absorbtionFactor = isAlpha ? 0.05 : 0.5;
        this.physicsData.values.pushFactor = 11;

        this.isAlpha = isAlpha;
        this.isShiny = shiny;

        this.damagePerTick = isAlpha ? 20 : 12;
        this.scoreReward = isAlpha ? 20000 : 2000;
        
        if (shiny) {
            this.scoreReward *= 100;
            this.healthData.values.health = this.healthData.values.maxHealth *= 10;
        }
    }
}