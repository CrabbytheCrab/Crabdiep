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

import Barrel from "../Barrel";
import Bullet from "./Bullet";

import { Color, PhysicsFlags, StyleFlags } from "../../../Const/Enums";
import { TankDefinition } from "../../../Const/TankDefinitions";
import TankBody, { BarrelBase } from "../TankBody";
import { DevTank } from "../../../Const/DevTankDefinitions";
import { PI2 } from "../../../util";
import ObjectEntity from "../../Object";
import { GuardObject } from "../Addons";
import LivingEntity from "../../Live";
import { Inputs } from "../../AI";

/**
 * The trap class represents the trap (projectile) entity in diep.
 */
export default class RopeSegment extends LivingEntity implements BarrelBase {
    /** Number of ticks before the trap cant collide with its own team. */
    protected collisionEnd = 0;
    public IsBig: boolean;
    public CanSpawn: boolean;
    public parent: TankBody;
    public sizeFactor: number;
    public seg: number;
    public cameraEntity = this;
    /** The reload time of the rocket's barrel. */
    public reloadTime = 1;
    /** The inputs for when to shoot or not. (Rocket) */
    public inputs: Inputs;
    public constructor(owner: TankBody) {
        super(owner.game);
        this.CanSpawn = true
        this.parent = owner;
        this.seg= 0
        this.IsBig = false
        this.sizeFactor = this.physicsData.values.size / 50;
        this.relationsData.owner = this.parent;
        this.inputs = new Inputs()
        this.relationsData.values.owner =  this.parent;
        this.positionData.x = this.parent.positionData.x;
        this.positionData.y = this.parent.positionData.y;
        if(this.IsBig){
        this.physicsData.pushFactor = 10;
                this.physicsData.sides = 6;    
                    this.damagePerTick = 10
        this.physicsData.size = this.parent.physicsData.size * 0.5
            
        }else{
        this.physicsData.size = this.parent.physicsData.size/8;
        }
         this.physicsData.pushFactor = 3;
        this.physicsData.absorbtionFactor = 0;
        this.physicsData.sides = 1;
        this.damagePerTick = 2
        this.physicsData.absorbtionFactor = 0.1;
        this.styleData.color =  this.parent.rootParent.styleData.color;
        this.damageReduction = 0
        this.physicsData.flags |= PhysicsFlags.noOwnTeamCollision | PhysicsFlags.canEscapeArena;
        this.relationsData.team = this.parent.relationsData.team;
        this.isAffectedByRope = true;
        
    }

    public onKill(killedEntity: LivingEntity) {
        // TODO(ABC):
        // Make this, work differently
        /** @ts-ignore */
        if (typeof this.parent.onKill === 'function') this.parent.onKill(killedEntity);
    }
    public tick(tick: number) {
        if(this.parent!= null){
            const delta = {
                x: this.positionData.x - this.parent.positionData.x,
                y: this.positionData.x - this.parent.positionData.y
            }
            const offset = Math.atan2(delta.y, delta.x) + Math.PI / 2
            delta.x = this.parent.positionData.values.x + Math.cos(offset) * this.parent.physicsData.values.size * 0.5 - this.positionData.values.x;
            delta.y = this.parent.positionData.values.y + Math.sin(offset) * this.parent.physicsData.values.size * 0.5 - this.positionData.values.y;
       // this.relationsData.owner = this.parent;
        //this.relationsData.team = this.parent.relationsData.team;
        this.positionData.angle += 0.1
        //Math.atan2(delta.y, delta.x)
           // this.parent.destroy()
        }
        if(this.IsBig){
            if(this.CanSpawn){
           this.styleData.color =  Color.Border
                        this.styleData.zIndex = this.parent.styleData.zIndex - 15 + this.seg
                                   const rotator = new GuardObject(this.game, this, 1, 1.75, 0, 0 )  as GuardObject;
        rotator.styleData.values.color =  this.parent.rootParent.styleData.color

        const offsetRatio = 0;
        const size = this.physicsData.values.size;
        rotator.relationsData.values.team = this.relationsData.values.team
       rotator.physicsData.size =  this.parent.physicsData.size;
       //rotator.positionData.values.x = offsetRatio * size;
        rotator.positionData.values.angle = 0;
        rotator.styleData.color =  Color.Barrel
        rotator.styleData.zIndex = this.parent.styleData.zIndex - 14 + this.seg
        rotator.styleData.flags |= StyleFlags.showsAboveParent;
                this.CanSpawn = false
            }
        this.physicsData.pushFactor = 10;
                this.physicsData.sides = 6;    
                    this.damagePerTick = 10
        this.physicsData.size = this.parent.physicsData.size
        }else{
                        if(this.CanSpawn){
                                       this.styleData.color =  Color.Barrel
                        this.styleData.zIndex = this.parent.styleData.zIndex - 15 + this.seg
                                            this.CanSpawn = false
            }
        this.physicsData.size = this.parent.physicsData.size/8;
        }
        super.tick(tick);
    }
}
