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

import { Color, InputFlags, PhysicsFlags, State, StyleFlags, Tank } from "../../Const/Enums";
import { AIState } from "../AI";
import ObjectEntity from "../Object";
import LivingEntity from "../Live";
import * as util from "../../util";
import { Entity } from "../../Native/Entity";
import Bullet from "../Tank/Projectile/Bullet";

/**
 * Class which represents the boss "Basher"
 */
let GuardianSpawnerDefinition: BarrelDefinition = {
    angle: Math.PI /6 * 4.5,
    offset: 0,
    size: 80,
    width: 42,
    delay: 0,
    reload: 0.25,
    recoil: 1,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    forceFire: false,
    inverseFire:true,
    bullet: {
        type: "bullet",
        sizeRatio:0.8,
        health: 5,
        damage: 4,
        speed: 1,
        scatterRate: 3,
        lifeLength: 0.25,
        absorbtionFactor: 1
    }
};
let GuardianSpawnerDefinition2: BarrelDefinition = {
    angle: -Math.PI /6 * 4.5,
    offset: 0,
    size: 80,
    width: 42,
    delay: 0,
    reload: 0.25,
    recoil: 1,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    forceFire: false,
    inverseFire:true,
    bullet: {
        type: "bullet",
        sizeRatio:0.8,
        health: 5,
        damage: 4,
        speed: 1,
        scatterRate: 3,
        lifeLength: 0.25,
        absorbtionFactor: 1
    }
};

let GuardianSpawnerDefinition3: BarrelDefinition = {
    angle: -Math.PI /6 * 5,
    offset: 0,
    size: 0,
    width: 42,
    delay: 0,
    reload: 0.25,
    recoil: 1,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    forceFire: false,
    inverseFire:true,
    droneCount:0,
    bullet: {
        type: "drone",
        sizeRatio:1.75,
        health: 10,
        damage: 3,
        speed: 1.5,
        scatterRate: 0,
        lifeLength: 4,
        absorbtionFactor: 2
    }
};
const DEFENDER_SIZE = 200;

export default class Basher extends AbstractBoss {
    public timer: number
    public state: number
    public attackAmount :number
    public rand : number
    public attacktimer:number
    public constructor(game: GameServer) {
        super(game);
        this.physicsData.values.size = DEFENDER_SIZE * Math.SQRT1_2;
        this.attackAmount = 0
        this.timer = 0
        this.rand = 0
        this.state = 0
        this.attacktimer = 0
        this.nameData.values.name = 'Basher';
        this.styleData.color = Color.Neutral
        this.healthData.values.health = this.healthData.values.maxHealth = 3000;
        this.scoreReward = 45000 * this.game.arena.shapeScoreRewardMultiplier;
        this.physicsData.sides = 1
        this.relationsData.values.team = this.game.arena;
        const size = this.physicsData.values.size;
        this.movementSpeed = 1.5
        const pronounced = new LivingEntity(this.game);
        this.physicsData.absorbtionFactor = 0
        pronounced.styleData.flags |= StyleFlags.hasNoDmgIndicator
        this.customMovement = true
        this.barrels.push(new Barrel(this, GuardianSpawnerDefinition));
        this.barrels.push(new Barrel(this, GuardianSpawnerDefinition2));
        this.barrels.push(new Barrel(this, GuardianSpawnerDefinition3));

       // pronounced.setParent(this);
        pronounced.relationsData.values.team = this.relationsData.values.team
        pronounced.physicsData.values.size =  size;
        pronounced.damagePerTick = 100
        pronounced.damageReduction = 0
        pronounced.physicsData.pushFactor = 40
        pronounced.styleData.values.color = Color.Border;
        pronounced.physicsData.values.sides = 6;
        pronounced.positionData.values.x = size * 1.2
        const tickBase = pronounced.tick;
        pronounced.tick = (tick:number) => {
        // super.tick(tick);
            const size = this.physicsData.values.size;
            pronounced.physicsData.size = size;
            pronounced.positionData.y = this.positionData.y + (size * Math.sin(this.positionData.angle) * 1.2)
            pronounced.positionData.x = this.positionData.x + (size * Math.cos(this.positionData.angle) * 1.2);
            pronounced.positionData.angle = this.positionData.angle
            pronounced.styleData.zIndex = this.styleData.zIndex + 1
            pronounced.styleData.opacity = this.styleData.opacity
            if (!Entity.exists(this)) pronounced.delete();

            tickBase.call(pronounced, tick);

            
        }

    }
    public shortAngleDist(a0:number,a1:number) {
        var max = Math.PI*2;
        var da = (a1 - a0) % max;
        return 2*da % max - da;
    }
    public Attack(){
        this.timer ++
        if(this.timer <= 45){
            this.inputs.flags |= InputFlags.rightclick
            this.inputs.movement.x = Math.cos(this.positionData.angle);
            this.inputs.movement.y = Math.sin(this.positionData.angle);
            this.accel.add({
                x: this.inputs.movement.x * this.movementSpeed * 5,
                y: this.inputs.movement.y * this.movementSpeed * 5,
            });
        }
        if(this.timer > 45){
            if (this.inputs.flags & InputFlags.rightclick) this.inputs.flags ^= InputFlags.rightclick
        }
        if(this.timer == 180){
            this.timer = 0
            this.state = State.idle
        }
    }
    public megaAttack(){
        this.timer ++
        if(this.timer == 1) this.rand = Math.PI/6 * (Math.random() - 0.5)
        if(this.timer < 15){
            const x = this.positionData.values.x,
            y = this.positionData.values.y

            this.positionData.angle =this.angleLerp(this.positionData.angle,Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x) + this.rand,0.2)
        }
        if(this.timer <= 45 && this.timer >= 15){
            this.inputs.flags |= InputFlags.rightclick
            this.inputs.movement.x = Math.cos(this.positionData.angle);
            this.inputs.movement.y = Math.sin(this.positionData.angle);
            this.accel.add({
                x: this.inputs.movement.x * this.movementSpeed * 5,
                y: this.inputs.movement.y * this.movementSpeed * 5,
            });
        }
        if(this.timer > 45){
            if (this.inputs.flags & InputFlags.rightclick) this.inputs.flags ^= InputFlags.rightclick
        }
        if(this.timer >= 60 && this.attackAmount <= 8){
            this.timer = 0
            this.attackAmount ++
        } 
        if(this.timer >= 180 && this.attackAmount >= 8){
            this.timer = 0
            this.attackAmount = 0
            this.state = State.idle
        } 
    }
    public megaAttackAlt(){
        this.timer ++
        if(this.timer < 15){
            const x = this.positionData.values.x,
            y = this.positionData.values.y

            this.positionData.angle =this.angleLerp(this.positionData.angle,Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x),0.2)
        }
        if(this.timer <= 45){
            this.inputs.flags |= InputFlags.rightclick
            this.inputs.movement.x = Math.cos(this.positionData.angle);
            this.inputs.movement.y = Math.sin(this.positionData.angle);
            this.accel.add({
                x: this.inputs.movement.x * this.movementSpeed * 5,
                y: this.inputs.movement.y * this.movementSpeed * 5,
            });
        }
        if(this.timer > 45){
            if (this.inputs.flags & InputFlags.rightclick) this.inputs.flags ^= InputFlags.rightclick
        }
        if(this.timer >= 45 && this.attackAmount <= 16){
            this.timer = 0
            this.attackAmount ++
        } 
        if(this.timer >= 120 && this.attackAmount >= 16){
            this.timer = 0
            this.attackAmount = 0
            this.state = State.idle
        } 
    }
    public angleLerp(a0:number,a1:number,t:number) {
        return a0 + this.shortAngleDist(a0,a1)*t;
    }
    protected moveAroundMap() {
        if(this.state == State.prepare){
            this.timer ++
            this.attacktimer = 0
            if(this.timer <= 30){
                const x = this.positionData.values.x,
                y = this.positionData.values.y
                this.positionData.angle  =this.angleLerp(this.positionData.angle,Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x),0.2)
            }
            if(this.timer >= 30){
                this.inputs.movement.x = Math.cos(this.positionData.angle);
                this.inputs.movement.y = Math.sin(this.positionData.angle);
                this.accel.add({
                    x: this.inputs.movement.x * this.movementSpeed * -0.75,
                    y: this.inputs.movement.y * this.movementSpeed * -0.75,
                });
            }
            if(this.timer == 120){
                this.timer = 0
                this.state = State.attack
            }
        }
        if(this.state == State.attack2){
            this.megaAttack()
        }
        if(this.state == State.attack){
            this.Attack()
        }
        const x = this.positionData.values.x,
        y = this.positionData.values.y
          if (this.ai.state === AIState.idle) {
            if(this.state == State.idle){
              super.moveAroundMap();
                this.accel.add({
                    x: this.inputs.movement.x * this.movementSpeed,
                    y: this.inputs.movement.y * this.movementSpeed,
                });
              this.positionData.angle = Math.atan2(this.inputs.movement.y, this.inputs.movement.x)
            }
          } else {
            if(this.state == State.idle){
                    this.positionData.angle  =this.angleLerp(this.positionData.angle,Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x),0.2)
                    this.inputs.movement.x = Math.cos(this.positionData.angle);
                    this.inputs.movement.y = Math.sin(this.positionData.angle);
                    this.accel.add({
                        x: this.inputs.movement.x * this.movementSpeed,
                        y: this.inputs.movement.y * this.movementSpeed,
                    });
                this.timer ++
                if(this.timer == 300){
                    this.timer = 0
                    if(this.healthData.values.health <= this.healthData.values.maxHealth/2){
                        this.state = State.attack2
                    }else{
                        this.state = State.prepare
                    }
                }
            }
        }
      }
  
      public tick(tick: number) {
          super.tick(tick);
          this.sizeFactor = this.physicsData.values.size / 50;
        
    }
}
