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
import TankDefinitions from "../../Const/TankDefinitions";
import AbstractBoss from "./AbstractBoss";

import { Color, Tank } from "../../Const/Enums";
import { AI, AIState } from "../AI";
import { normalizeAngle, PI2 } from "../../util";
import AiTank from "../Misc/AiTank";

/**
 * Class which represents the boss "Titan"
 */

const TURN_TIMEOUT = 300;

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
        this.healthData.values.health = this.healthData.values.maxHealth = 6000;
        this.scoreReward = 45000 * this.game.arena.shapeScoreRewardMultiplier;
this.physicsData.pushFactor = 0
       /* for (const barrelDefinition of TankDefinitions[Tank.Booster].barrels) {

            const def = Object.assign({}, barrelDefinition, {});
            def.bullet = Object.assign({}, def.bullet, { speed: 1.7, health: 6.25 });
            this.barrels.push(new Barrel(this, def));
        }*/
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
        this.moveAroundMap()
        this.sizeFactor = this.physicsData.values.size / 50;
        if(this.ai.state == AIState.hasTarget) {
        // this.positionData.angle = Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x)
        this.timer--
         if(this.timer == 0){
            if(this.healthData.health <= this.healthData.maxHealth/10){

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
                this.timer = 60
            }
            }
        }
    }
}
