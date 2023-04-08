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
import Barrel from "../Tank/Barrel";
import TankDefinitions, { BarrelDefinition } from "../../Const/TankDefinitions";
import AbstractBoss from "./AbstractBoss";

import { Color, PositionFlags, StyleFlags, Tank } from "../../Const/Enums";
import { AI, AIState } from "../AI";
import { normalizeAngle, PI2 } from "../../util";
import AiTank from "../Misc/AiTank";
import ObjectEntity from "../Object";
import AutoTurret, { AutoTurretDefinition } from "../Tank/AutoTurret";

/**
 * Class which represents the boss "Titan"
 */

const TURN_TIMEOUT = 300;
const MountedTurretDefinition: BarrelDefinition = {
    ...AutoTurretDefinition,
    width: 10,
    size: 25,
    bullet: {
    
        ...AutoTurretDefinition.bullet,
        speed: 1.5,
        damage: 3,
        health: 3
    }
};
export default class Titan extends AbstractBoss {
    /** The speed to maintain during movement. */
    public movementSpeed = 0;
    protected static BASE_ROTATION = AI.PASSIVE_ROTATION;
    /** Used to calculate the speed at which the shape orbits. Radians Per Tick. */
    protected static BASE_ORBIT = 0.005;
    /** The velocity of the shape's orbits. */
    protected static BASE_VELOCITY = 1;
    
    protected doIdleRotate: boolean = true;
    /** The current direction of the shape's orbit. */
    protected orbitAngle: number;
    /** The decided orbit rate, based on the constructor's BASE_ORBIT. *//* @ts-ignore */
    protected orbitRate = (Math.random() < .5 ? -1 : 1) * this.constructor.BASE_ORBIT
    /** The decided rotation rate, based on the constructor's BASE_ROTATION. *//* @ts-ignore */
    public rotationRate = (Math.random() < .5 ? -1 : 1) * this.constructor.BASE_ROTATION
    /** The decided velocity of the shape, based on the constructor's BASE_VELOCITY. *//* @ts-ignore */
    protected shapeVelocity = this.constructor.BASE_VELOCITY;
public timer = 60
    /** Whether or not the tank is turning */
    protected isTurning: number = 0;
    /** The destination for the angle of the shape's orbit - it slowly becomes this */
    protected targetTurningAngle: number = 0;
    public constructor(game: GameServer) {
        super(game);
        this.physicsData.values.size = 200 * Math.SQRT1_2;
        this.orbitAngle = this.positionData.values.angle = (Math.random() * PI2);
this.physicsData.sides = 8
this.styleData.color = Color.ScoreboardBar
this.relationsData.values.team = this.game.arena;
this.nameData.values.name = 'H4XX0R';
        this.physicsData.absorbtionFactor = 0
        this.healthData.values.health = this.healthData.values.maxHealth = 4000;
        this.scoreReward = 45000 * this.game.arena.shapeScoreRewardMultiplier;
this.physicsData.pushFactor = 0
       /* for (const barrelDefinition of TankDefinitions[Tank.Booster].barrels) {

            const def = Object.assign({}, barrelDefinition, {});
            def.bullet = Object.assign({}, def.bullet, { speed: 1.7, health: 6.25 });
            this.barrels.push(new Barrel(this, def));
        }*/










        const pronounce = new ObjectEntity(this.game);
        const size = this.physicsData.values.size;

        pronounce.setParent(this);
        pronounce.relationsData.values.owner = this;
        pronounce.relationsData.values.team = this.relationsData.values.team

        pronounce.physicsData.values.size = size * 1.2;

        pronounce.styleData.values.color = Color.Border;
        pronounce.physicsData.values.sides = 8;
        const tickBase = pronounce.tick;

        pronounce.tick = (tick: number) => {
            const size = this.physicsData.values.size;

            pronounce.physicsData.size = size * 1.2;
            tickBase.call(pronounce, tick);
        }


        const pronounce2 = new ObjectEntity(this.game);

        pronounce2.setParent(this);
        pronounce2.relationsData.values.owner = this;
        pronounce2.relationsData.values.team = this.relationsData.values.team

        pronounce2.physicsData.values.size = size * 0.8;

            pronounce2.styleData.values.color = Color.Barrel;
            pronounce2.styleData.values.flags |= StyleFlags.showsAboveParent
        pronounce2.physicsData.values.sides = 8;
        const tickBase2 = pronounce2.tick;

        pronounce2.tick = (tick: number) => {
            const size = this.physicsData.values.size;

            pronounce2.physicsData.size = size * 0.8;
            tickBase2.call(pronounce2, tick);
        }



        const pronounce3 = new ObjectEntity(this.game);

        pronounce3.setParent(this);
        pronounce3.relationsData.values.owner = this;
        pronounce3.relationsData.values.team = this.relationsData.values.team

        pronounce3.physicsData.values.size = size * 0.75;

        pronounce3.styleData.values.color = Color.kMaxColors;
        pronounce3.styleData.values.flags |= StyleFlags.showsAboveParent
        pronounce3.physicsData.values.sides = 1;
        const tickBase3 = pronounce3.tick;

        pronounce3.tick = (tick: number) => {
            const size = this.physicsData.values.size;

            pronounce3.physicsData.size = size * 0.75;
            tickBase3.call(pronounce3, tick);
        }






        for (let i = 0; i < 8; ++i) {
            // TODO:
            // Maybe make this into a class of itself - DefenderAutoTurret
            const base = new AutoTurret(this, MountedTurretDefinition);
            base.influencedByOwnerInputs = true;
            const MAX_ANGLE_RANGE = PI2 / 16; // keep within 90º each side
base.baseSize *= 0.325
            const angle = base.ai.inputs.mouse.angle = PI2 * (i / 8);
            base.ai.targetFilter = (targetPos) => {
                const pos = base.getWorldPosition();
                const angleToTarget = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
                
                const deltaAngle = normalizeAngle(angleToTarget - ((angle + this.positionData.values.angle)));

                return deltaAngle < MAX_ANGLE_RANGE || deltaAngle > (PI2 - MAX_ANGLE_RANGE);
            }
            base.positionData.values.y = this.physicsData.values.size * Math.sin(angle) * 1.35;
            base.positionData.values.x = this.physicsData.values.size * Math.cos(angle) * 1.35;

            base.physicsData.values.flags |= PositionFlags.absoluteRotation;

            const tickBase = base.tick;
            base.tick = (tick: number) => {
                base.positionData.y = this.physicsData.values.size * Math.sin(angle) * 1.35;
                base.positionData.x = this.physicsData.values.size * Math.cos(angle) * 1.35;

                tickBase.call(base, tick);
                if (base.ai.state === AIState.idle) base.positionData.angle = angle + this.positionData.values.angle;
            }
        }
    }
    protected turnTo(angle: number) {
        if (normalizeAngle(this.orbitAngle - angle) < 0.20) return;
        this.targetTurningAngle = angle;
        this.isTurning = TURN_TIMEOUT;
    }
    protected moveAroundMap() {
            const y = this.positionData.values.y;
            const x = this.positionData.values.x;
    
            // goes down too much
            if (this.isTurning === 0) {
                if (x > this.game.arena.arenaData.values.rightX - 400
                    || x < this.game.arena.arenaData.values.leftX + 400
                    || y < this.game.arena.arenaData.values.topY + 400
                    || y > this.game.arena.arenaData.values.bottomY - 400) {
                    this.turnTo(Math.PI + Math.atan2(y, x));
                } else if (x > this.game.arena.arenaData.values.rightX - 500) {
                    this.turnTo(Math.sign(this.orbitRate) * Math.PI / 2);
                } else if (x < this.game.arena.arenaData.values.leftX + 500) {
                    this.turnTo(-1 * Math.sign(this.orbitRate) * Math.PI / 2);
                } else if (y < this.game.arena.arenaData.values.topY + 500) {
                    this.turnTo(this.orbitRate > 0 ? 0 : Math.PI);
                } else if (y > this.game.arena.arenaData.values.bottomY - 500) {
                    this.turnTo(this.orbitRate > 0 ? Math.PI : 0);
                }
            }
            this.positionData.angle += this.rotationRate;
            this.orbitAngle += this.orbitRate + (this.isTurning === TURN_TIMEOUT ? this.orbitRate * 10 : 0);
            if (this.isTurning === TURN_TIMEOUT && (((this.orbitAngle - this.targetTurningAngle) % (PI2)) + (PI2)) % (PI2) < 0.20) {
                this.isTurning -= 1;
            } else if (this.isTurning !== TURN_TIMEOUT && this.isTurning !== 0) this.isTurning -= 1;
    
            // convert from angle to orbit angle: angle / (10 / 3)
            // convert from orbit angle to angle: orbitAngle * (10 / 3)
            this.maintainVelocity(this.orbitAngle, this.shapeVelocity);
           // this.positionData.angle = Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x)
    }

    public tick(tick: number) {
        super.tick(tick);
        this.styleData.zIndex = 1
        this.moveAroundMap()
        this.sizeFactor = this.physicsData.values.size / 50;
        if(this.ai.state == AIState.hasTarget) {
        // this.positionData.angle = Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x)
        this.timer--
         if(this.timer == 0){
            if(this.healthData.health <= this.healthData.maxHealth/5){

             const tonk = new AiTank(this.game)
             tonk.positionData.values.x = this.rootParent.positionData.values.x
             tonk.positionData.values.y = this.rootParent.positionData.values.y
             tonk.relationsData = this.rootParent.relationsData
             tonk.styleData.color = this.rootParent.styleData.color
                tonk.super = true
             //tonk.setParent(this)
             this.timer = 60
            }else{
                const tonk = new AiTank(this.game)
                tonk.positionData.values.x = this.rootParent.positionData.values.x
                tonk.positionData.values.y = this.rootParent.positionData.values.y
                tonk.relationsData = this.rootParent.relationsData
                tonk.styleData.color = this.rootParent.styleData.color
                   tonk.super = false
                //tonk.setParent(this)
                this.timer = 45
            }
            }
        }
    }
}
