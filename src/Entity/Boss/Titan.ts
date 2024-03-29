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

import { Color, PositionFlags, State, StyleFlags, Tank } from "../../Const/Enums";
import { AI, AIState } from "../AI";
import { normalizeAngle, PI2 } from "../../util";
import AiTank from "../Misc/AiTank";
import ObjectEntity from "../Object";
import AutoTurret, { AutoTurretDefinition } from "../Tank/AutoTurret";
import TankBody from "../Tank/TankBody";

/**
 * Class which represents the boss "Titan"
 */

const TURN_TIMEOUT = 300;
const MountedTurretDefinition: BarrelDefinition = {
    ...AutoTurretDefinition,
    width: 10.5,
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
    protected static BASE_VELOCITY = 3;
    
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

    public timer2: number
    public state: number
    public attackAmount :number
    public rand : number
    public attacktimer:number
    public angleX:number
    public angleY:number
    public posX:number
    public posY:number
    public constructor(game: GameServer) {
        super(game);
        this.physicsData.values.size = 200 * Math.SQRT1_2;
        this.orbitAngle = this.positionData.values.angle = (Math.random() * PI2);
        this.physicsData.sides = 8
        this.styleData.color = Color.ScoreboardBar
        this.nameData.values.name = 'H4XX0R';
        this.attackAmount = 0
        this.timer2 = 0
        this.angleX = 0
        this.angleY = 0
        this.posX = 0
        this.posY = 0
        this.rand = 0
        this.state = 0
        this.attacktimer = 0
        this.physicsData.absorbtionFactor = 0
        this.healthData.values.health = this.healthData.values.maxHealth = 4500;
        this.scoreReward = 45000 * this.game.arena.shapeScoreRewardMultiplier;
        this.physicsData.pushFactor = 0

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
            if(this.state == State.idle){
                if(this.healthData.health <= this.healthData.maxHealth/5){
                this.maintainVelocity(this.orbitAngle, this.shapeVelocity * 3);
                }else{
                    this.maintainVelocity(this.orbitAngle, this.shapeVelocity)
                }
            }
           // this.positionData.angle = Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x)
    }
    public Attack(){
        this.timer2 ++
        if(this.timer2 <= 45){
            this.inputs.movement.x = Math.cos(Math.atan2(this.angleY - this.posY,this.angleX - this.posX));
            this.inputs.movement.y = Math.sin(Math.atan2(this.angleY - this.posY,this.angleX - this.posX));
            this.accel.add({
                x: this.inputs.movement.x * 5,
                y: this.inputs.movement.y * 5,
            });
        }
        if(this.timer2 >= 45){
            this.timer2 = 0
            this.state = State.idle
        }
    }

    public Attack2(){
        this.timer2 ++
        if(this.timer2 <= 45){
            this.inputs.movement.x = Math.cos(Math.atan2(this.angleY - this.posY,this.angleX - this.posX));
            this.inputs.movement.y = Math.sin(Math.atan2(this.angleY - this.posY,this.angleX - this.posX));
            this.accel.add({
                x: this.inputs.movement.x * 5,
                y: this.inputs.movement.y * 5,
            });
        }
        if(this.timer2 == 5 || this.timer2 == 10 || this.timer2 == 15 || this.timer2 == 20|| this.timer2 == 25|| this.timer2 == 30|| this.timer2 == 35|| this.timer2 == 40|| this.timer2 == 45){
            const tonk = new AiTank(this.game,this)
            tonk.positionData.values.x = this.rootParent.positionData.values.x
            tonk.positionData.values.y = this.rootParent.positionData.values.y
            tonk.relationsData = this.rootParent.relationsData
            tonk.styleData.color = this.rootParent.styleData.color
            tonk.super = false
        }
        if(this.timer2 >= 45){
            this.timer2 = 0
            this.state = State.idle
        }
    }
    public tick(tick: number) {
        super.tick(tick);
        this.styleData.zIndex = 1
        this.moveAroundMap()
        this.sizeFactor = this.physicsData.values.size / 50;
        if(this.state == State.attack){
            this.Attack()
        }
        if(this.state == State.attack2){
            this.Attack2()
        }
        if(this.ai.state == AIState.hasTarget) {
            if(this.state == State.idle){
                if(this.ai.target instanceof TankBody){
                    this.timer2 ++
                    if(this.healthData.health <= this.healthData.maxHealth/5){
                        if(this.timer2 >= 150){
                            this.angleX = this.ai.inputs.mouse.x
                            this.angleY = this.ai.inputs.mouse.y
                            this.posX = this.positionData.x
                            this.posY = this.positionData.y
                            this.state = State.attack2
                            this.timer2 = 0
                        }
                    }else{
                        if(this.timer2 >= 90){
                            this.angleX = this.ai.inputs.mouse.x
                            this.angleY = this.ai.inputs.mouse.y
                            this.posX = this.positionData.x
                            this.posY = this.positionData.y
                            this.state = State.attack
                            this.timer2 = 0
                        }
                    }
                }
                this.timer--
                if(this.timer == 0){
                    if(this.healthData.health <= this.healthData.maxHealth/5){
                        this.timer = 150
                        for(let i = 0; i < 3; i++){    
                            setTimeout(() =>{
                                const tonk = new AiTank(this.game,this)
                                tonk.positionData.values.x = this.rootParent.positionData.values.x
                                tonk.positionData.values.y = this.rootParent.positionData.values.y
                                tonk.relationsData = this.rootParent.relationsData
                                tonk.styleData.color = this.rootParent.styleData.color
                                tonk.super = true
                            }, 300 * i)
                        }
                    }else{
                        this.timer = 30
                        const tonk = new AiTank(this.game,this)
                        tonk.positionData.values.x = this.rootParent.positionData.values.x
                        tonk.positionData.values.y = this.rootParent.positionData.values.y
                        tonk.relationsData = this.rootParent.relationsData
                        tonk.styleData.color = this.rootParent.styleData.color
                        tonk.super = false
                    }
                }
            }
        }
    }
}
