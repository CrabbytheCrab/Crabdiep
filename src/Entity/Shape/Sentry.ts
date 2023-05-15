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

import { Color, PositionFlags, StyleFlags } from "../../Const/Enums";
import { AI, AIState } from "../AI";
import { BarrelBase } from "../Tank/TankBody";
import Crasher from "./Crasher";
import { Entity } from "../../Native/Entity";
import AutoTurret from "../Tank/AutoTurret";
import { BarrelDefinition } from "../../Const/TankDefinitions";
import Barrel from "../Tank/Barrel";
import { OverdriveAddon, PronouncedAddon   } from "../Tank/Addons";
import { normalizeAngle, PI2 } from "../../util";

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
    public constructor(game: GameServer, large=true) {
        super(game, large);

        this.sizeFactor = this.physicsData.values.size / 50;
        this.inputs = this.ai.inputs;
        this.isLarge = true
        const rand = Math.random();
        if(rand < 0.16){
        this.nameData.values.name = "Protective Crasher";
            let barsss: Barrel;
            let GuardianSpawnerDefinition: BarrelDefinition = {
                angle: Math.PI,
                offset: 0,
                size: 90,
                width: 63,
                delay: 0,
                reload: 0.5,
                recoil: 1,
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
                reload: 8,
                recoil: 1,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 6,
                    damage: 2,
                    speed: 1.5,
                    scatterRate: 0,
                    lifeLength: 1.25,
                    absorbtionFactor: 1
                }
            };
            barsss = new Barrel(this, GuardianSpawnerDefinition);
            barsss = new Barrel(this, GuardianSpawnerDefinition2);

        }else if(rand < 0.33){
            this.nameData.values.name = "Guard Crasher";
            let barsss: Barrel;
            let GuardianSpawnerDefinition: BarrelDefinition = {
                angle: Math.PI,
                offset: 0,
                size: 90,
                width: 67.2,
                delay: 0,
                reload: 4,
                recoil: 0,
                isTrapezoid: true,
                trapezoidDirection: 0,
                addon: null,
                droneCount: 6,
                canControlDrones: true,
                bullet: {
                    type: "drone",
                    sizeRatio: 0.625,
                    health: 2.5,
                    damage: 1.25,
                    speed: 2,
                    scatterRate: 0,
                    lifeLength: 4,
                    absorbtionFactor: 0.8
                }
            };
            barsss = new Barrel(this, GuardianSpawnerDefinition);
        }
        else if(rand < 0.5){
        this.nameData.values.name = "Beholding Crasher";
            let barsss: Barrel;
            let GuardianSpawnerDefinition: BarrelDefinition = {
                angle: Math.PI,
                offset: 0,
                size: 80,
                width: 79.8,
                delay: 0,
                reload: 3,
                recoil: 1.75,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: "trapLauncher",
                bullet: {
                    type: "trap",
                    sizeRatio:0.8,
                    health: 8,
                    damage: 3,
                    speed: 2,
                    scatterRate: 1,
                    lifeLength: 1,
                    absorbtionFactor: 1
                }
            };
            let GuardianSpawnerDefinition2: BarrelDefinition = {
                angle: 0,
                offset: 40,
                size: 110,
                width: 33.6,
                delay: 0,
                reload: 1.2,
                recoil: 0.75,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 2,
                    damage: 0.5,
                    speed: 1,
                    scatterRate: 1,
                    lifeLength: 1.5,
                    absorbtionFactor: 0.6
                }
            };
            let GuardianSpawnerDefinition3: BarrelDefinition = {
                angle: 0,
                offset: -40,
                size: 110,
                width: 33.6,
                delay: 0.5,
                reload: 1.2,
                recoil: 0.75,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 2,
                    damage: 0.5,
                    speed: 1,
                    scatterRate: 1,
                    lifeLength: 1.5,
                    absorbtionFactor: 0.6
                }
            };
            barsss = new Barrel(this, GuardianSpawnerDefinition);
            barsss = new Barrel(this, GuardianSpawnerDefinition2);
            barsss = new Barrel(this, GuardianSpawnerDefinition3);
        }else if(rand < 0.66){
        this.nameData.values.name = "Sentry Crasher";

        let barsss: Barrel;
        let GuardianSpawnerDefinition: BarrelDefinition = {
            angle: Math.PI,
            offset: 0,
            size: 100,
            width: 63,
            delay: 0,
            reload: 1,
            recoil: 1.25,
            isTrapezoid: true,
            trapezoidDirection: Math.PI,
            addon: null,
            bullet: {
                type: "bullet",
                sizeRatio:1,
                health: 1,
                damage: 0.3,
                speed: 1,
                scatterRate: 1,
                lifeLength: 0.5,
                absorbtionFactor: 1
            }
        };
        barsss = new Barrel(this, GuardianSpawnerDefinition);
            let Auto1: BarrelDefinition = {
                angle: 0,
                offset: -0,
                size: 95,
                width: 42,
                delay: 0.01,
                reload: 4,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1.5,
                    damage: 1.6,
                    speed: 1,
                    scatterRate: 1,
                    lifeLength: 1,
                    absorbtionFactor: 0.1
                }
            };
            let Auto2: BarrelDefinition = {
                angle: 0.39269908169872414,
                offset: 0,
                size: 88,
                width: 42,
                delay: 0.01,
                reload: 4,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1.5,
                    damage: 1.6,
                    speed: 1,
                    scatterRate: 1,
                    lifeLength: 1,
                    absorbtionFactor: 0.1
                }
            };
            let Auto3: BarrelDefinition = {
                angle: -0.39269908169872414,
                offset: 0,
                size: 88,
                width: 42,
                delay: 0.01,
                reload: 4,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1.5,
                    damage: 1.6,
                    speed: 1,
                    scatterRate: 1,
                    lifeLength: 1,
                    absorbtionFactor: 0.1
                }
            };
            let Auto5: BarrelDefinition = {
                angle: 0,
                offset: 0,
                size: 65,
                width: 50.4,
                delay: 0.5,
                reload: 2,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1.25,
                    damage: 1.5,
                    speed: 2,
                    scatterRate: 0,
                    lifeLength: 1,
                    absorbtionFactor: 0.1
                }
            };
            let Auto6: BarrelDefinition = {
                angle: 0,
                offset: 0,
                size: 75,
                width: 50.4,
                delay: 0.01,
                reload: 2,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1.25,
                    damage: 1.5,
                    speed: 2,
                    scatterRate: 0,
                    lifeLength: 1,
                    absorbtionFactor: 0.1
                }
            };
            /*const atuo  = [new AutoTurret(this, [Auto3, Auto2,Auto1])];
            atuo[0].positionData.values.angle = this.positionData.angle
            atuo[0].baseSize *= 1.75
            atuo[0].positionData.values.angle = this.positionData.values.angle 
        //atuo.ai.passiveRotation = this.movementAngle
        atuo[0].styleData.values.flags |= StyleFlags.showsAboveParent;
        atuo[0].ai.viewRange = this.ai.viewRange*/

        const MAX_ANGLE_RANGE = PI2 / 3; // keep within 90º each side

        for (let i = 0; i < 2; ++i) {
            const base  = [new AutoTurret(this, [Auto3, Auto2,Auto1])];
            base[0].influencedByOwnerInputs = true;
            base[0].baseSize *= 1.75;
            base[0].ai.viewRange = 2000;
           const angle = base[0].ai.inputs.mouse.angle = PI2 * ((i / 3) - (1/6));
           base[0].ai.passiveRotation = AI.PASSIVE_ROTATION;
           base[0].positionData.values.y = this.physicsData.values.size * Math.sin(angle) * 0.8;
           base[0].positionData.values.x = this.physicsData.values.size * Math.cos(angle) * 0.8;

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
               base[0].positionData.y = this.physicsData.values.size * Math.sin(angle) * 0.8;
               base[0].positionData.x = this.physicsData.values.size * Math.cos(angle) * 0.8;
               if (base[0].ai.state === AIState.idle) base[0].positionData.angle = angle + this.positionData.values.angle
               tickBase.call(base[0], tick);
           }
       }
        }else if(rand < 0.83){
        this.nameData.values.name = "Spinner Crasher";
            let barsss: Barrel;
            let GuardianSpawnerDefinition: BarrelDefinition = {
                angle: Math.PI,
                offset: 0,
                size: 100,
                width: 63,
                delay: 0,
                reload: 0.5,
                recoil: 0,
                isTrapezoid: true,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1.5,
                    damage: 1.5,
                    speed: 2,
                    scatterRate: 3,
                    lifeLength: 0.8,
                    absorbtionFactor: 1
                }
            };
            let GuardianSpawnerDefinition2: BarrelDefinition = {
                angle: Math.PI - (2 * Math.PI/3),
                offset: 0,
                size: 100,
                width: 63,
                delay: 0,
                reload: 0.5,
                recoil: 0,
                isTrapezoid: true,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1.5,
                    damage: 1.5,
                    speed: 2,
                    scatterRate: 3,
                    lifeLength: 0.5,
                    absorbtionFactor: 1
                }
            };
            let GuardianSpawnerDefinition3: BarrelDefinition = {
                angle: Math.PI + (2 * Math.PI/3),
                offset: 0,
                size: 100,
                width: 63,
                delay: 0,
                reload: 0.5,
                recoil: 0,
                isTrapezoid: true,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1.5,
                    damage: 1.5,
                    speed: 2,
                    scatterRate: 3,
                    lifeLength: 0.5,
                    absorbtionFactor: 1
                }
            };
            this.canrotate = true
            barsss = new Barrel(this, GuardianSpawnerDefinition);
            barsss = new Barrel(this, GuardianSpawnerDefinition2);
            barsss = new Barrel(this, GuardianSpawnerDefinition3);
        }else{

            let GuardianSpawnerDefinition: BarrelDefinition = {
                angle: Math.PI,
                offset: 0,
                size: 120,
                width: 35,
                delay: 0,
                reload: 0.5,
                recoil: 0,
                isTrapezoid: true,
                trapezoidDirection: Math.PI,
                addon: null,
                droneCount: 0,
                bullet: {
                    type: "drone",
                    sizeRatio: 1,
                    health: 1.5,
                    damage: 1.5,
                    speed: 2,
                    scatterRate: 3,
                    lifeLength: 0.5,
                    absorbtionFactor: 1
                }
            };
            let GuardianSpawnerDefinition2: BarrelDefinition = {
                angle: Math.PI - (2 * Math.PI/3),
                offset: 0,
                size: 120,
                width: 35,
                delay: 0,
                reload: 0.5,
                recoil: 0,
                isTrapezoid: true,
                trapezoidDirection: Math.PI,
                addon: null,
                droneCount: 0,
                bullet: {
                    type: "drone",
                    sizeRatio: 1,
                    health: 1.5,
                    damage: 1.5,
                    speed: 2,
                    scatterRate: 3,
                    lifeLength: 0.5,
                    absorbtionFactor: 1
                }
            };
            let GuardianSpawnerDefinition3: BarrelDefinition = {
                angle: Math.PI + (2 * Math.PI/3),
                offset: 0,
                size: 120,
                width: 35,
                delay: 0,
                reload: 0.5,
                recoil: 0,
                isTrapezoid: true,
                trapezoidDirection: Math.PI,
                addon: null,
                droneCount: 0,
                bullet: {
                    type: "drone",
                    sizeRatio: 1,
                    health: 1.5,
                    damage: 1.5,
                    speed: 2,
                    scatterRate: 3,
                    lifeLength: 0.5,
                    absorbtionFactor: 1
                }
            };
            let barsss: Barrel;
            barsss = new Barrel(this, GuardianSpawnerDefinition);
            barsss.styleData.color = Color.Border
            barsss = new Barrel(this, GuardianSpawnerDefinition2);
            barsss.styleData.color = Color.Border
            barsss = new Barrel(this, GuardianSpawnerDefinition3);
            barsss.styleData.color = Color.Border
        this.nameData.values.name = "Stalking Crasher";
        this.healthData.values.health = this.healthData.values.maxHealth = 175;
        this.physicsData.values.pushFactor =  4;
        this.damagePerTick = 40;
        this.targettingSpeed = 1.1
        this.invis = true
        new OverdriveAddon(1.8, this,3);
        }

        //this.barsss = new Barrel(this, GuardianSpawnerDefinition2);
        //this.positionData.values.flags |= PositionFlags.canMoveThroughWalls;
        this.healthData.values.health = this.healthData.values.maxHealth = 500;
        this.physicsData.values.size =  85 * Math.SQRT1_2;
        this.physicsData.values.sides = 3;
        this.physicsData.values.absorbtionFactor = 0.1;
        this.physicsData.values.pushFactor =  12;
       
        this.targettingSpeed = 1.4;
        this.styleData.values.color = Color.EnemyCrasher;

        this.scoreReward = 450;
        this.damagePerTick = 20;
    }
}
