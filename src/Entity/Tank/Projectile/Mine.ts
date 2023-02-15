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

import { Color, InputFlags, PhysicsFlags, Stat, StyleFlags } from "../../../Const/Enums";
import { BarrelDefinition, TankDefinition } from "../../../Const/TankDefinitions";
import { BarrelBase } from "../TankBody";
import { DevTank } from "../../../Const/DevTankDefinitions";
import { PI2 } from "../../../util";
import ObjectEntity from "../../Object";
import LivingEntity from "../../Live";
import AutoTurret from "../AutoTurret";
import { Entity } from "../../../Native/Entity";
import { Inputs } from "../../AI";

/**
 * The trap class represents the trap (projectile) entity in diep.
 */
const Bombshot1: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 0,
    width: 75,
    delay: 0,
    reload: 1,
    recoil: 1,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.9,
        damage: 1.4,
        speed: 0.8,
        scatterRate: 0.3,
        lifeLength: 0.65,
        sizeRatio: 1,
        absorbtionFactor: 0.3
    }
};
const Bombshot2: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 0,
    width: 45,
    delay: 0,
    reload: 1,
    recoil: 1,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.85,
        damage: 0.85,
        speed: 0.8,
        scatterRate: 0.3,
        lifeLength: 0.65,
        sizeRatio: 1,
        absorbtionFactor: 0.3
    }
};
export default class Mine extends Bullet implements BarrelBase {
    /** Number of ticks before the trap cant collide with its own team. */
    protected collisionEnd = 0;
    protected parent: ObjectEntity;
    public death: boolean;
    public sizeFactor: number;
    public reloadTime = 1;
    public cameraEntity: Entity;
    public inputs = new Inputs();
    protected megaturret: boolean;
    protected canControlDrones: boolean;
    public canexploded: boolean;
    public primetimer: number;
    public primetimer2: number;
    public boom: boolean;
    public canexplode: boolean;
    public skimmerBarrels: Barrel[];
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number, parent?: ObjectEntity) {
        super(barrel, tank, tankDefinition, shootAngle);
        const bulletDefinition = barrel.definition.bullet;
        this.sizeFactor = this.physicsData.values.size / 50;
        this.parent = parent ?? tank;
        this.cameraEntity = tank.cameraEntity;
        this.death = true
        this.boom = false
        this.primetimer2 = 0
        this.primetimer = 0
        this.canControlDrones = typeof this.barrelEntity.definition.canControlDrones === 'boolean' && this.barrelEntity.definition.canControlDrones;
        this.megaturret = typeof this.barrelEntity.definition.megaturret === 'boolean' && this.barrelEntity.definition.megaturret;
        this.canexplode = false
        this.baseSpeed = (barrel.bulletAccel / 2) + 30 - Math.random() * barrel.definition.bullet.scatterRate;
        this.baseAccel = 0;
        this.canexploded = true
        this.physicsData.values.sides = bulletDefinition.sides ?? 4;
        if (this.physicsData.values.flags & PhysicsFlags.noOwnTeamCollision) this.physicsData.values.flags ^= PhysicsFlags.noOwnTeamCollision;
        this.physicsData.values.flags |= PhysicsFlags.onlySameOwnerCollision;
        this.styleData.values.flags |= StyleFlags.isStar;
        this.styleData.values.flags &= ~StyleFlags.hasNoDmgIndicator;
        this.skimmerBarrels =[];
        this.collisionEnd = this.lifeLength >> 3;
        this.lifeLength = (600 * barrel.definition.bullet.lifeLength) >> 3;
        if (tankDefinition && tankDefinition.id === DevTank.Bouncy) this.collisionEnd = this.lifeLength - 1;
        
        const atuo = new AutoTurret(this, {
            angle: 0,
            offset: 0,
            size: 0,
            width: 0,
            delay: 0.01,
            reload: 1.75,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            droneCount: 0,
            bullet: {
                type: "drone",
                sizeRatio: 1,
                health: 0.75,
                damage: 0.5,
                speed: 1,
                scatterRate: 1,
                lifeLength: 0.75,
                absorbtionFactor: 0.1
            }
        });
            atuo.baseSize *= 1.25
            atuo.positionData.values.angle = shootAngle
        //atuo.ai.passiveRotation = this.movementAngle
        atuo.styleData.values.flags |= StyleFlags.showsAboveParent;
        atuo.ai.viewRange = 0
        atuo.styleData.color = Color.Border
        const tickBase = atuo.tick;
        atuo.tick = (tick: number) => {
            if(this.canexplode == false)
            if(this.canControlDrones){
                this.primetimer++
                if(this.primetimer == 30){
                    this.canexplode = true
                    atuo.styleData.color = Color.Box

                }}else{
                    this.primetimer++
                    if(this.primetimer == 60){
                        this.canexplode = true
                        atuo.styleData.color = Color.Box
    
                    } 
                }
            tickBase.call(atuo, tick);
        }
        // Check this?
        this.positionData.values.angle = Math.random() * PI2;
    }
    public destroy(animate=true) {
        super.destroy(animate);
    }
    public onKill(killedEntity: LivingEntity) {
        // TODO(ABC):
        // Make this, work differently
        /** @ts-ignore */
        if (typeof this.parent.onKill === 'function') this.parent.onKill(killedEntity);
    }
    public tick(tick: number) {
        super.tick(tick);
        this.inputs = new Inputs();
        this.inputs.flags |= InputFlags.leftclick;
        if(this.canexploded){
        if(this.tank.inputs.attemptingRepel() && this.canexplode == true){
            this.canexploded = false
            if ( this.megaturret || this.canControlDrones){
                if ( this.megaturret){
            }
            if(this.canControlDrones){
                const skimmerBarrels: Barrel[] = this.skimmerBarrels =[]
                for (let n = 0; n < 8; n++) {
                    const barr = new Barrel(this, {
                     ...Bombshot2,
                     angle: PI2 * (n / 8)
                 });
                 barr.physicsData.values.sides = 0
                 skimmerBarrels.push(barr);
         
                 }
        }
    } else{
                const skimmerBarrels: Barrel[] = this.skimmerBarrels =[]
                for (let n = 0; n < 8; n++) {
                    const barr = new Barrel(this, {
                     ...Bombshot1,
                     angle: PI2 * (n / 8)
                 });
                 barr.physicsData.values.sides = 0
                 skimmerBarrels.push(barr);
         
                 } 
                
                 
        }
            setTimeout(() => {
                this.destroy()
            }, 45);

        this.boom = true
        }
    }
        if (tick - this.spawnTick === this.collisionEnd) {
            if (this.physicsData.values.flags & PhysicsFlags.onlySameOwnerCollision) this.physicsData.flags ^= PhysicsFlags.onlySameOwnerCollision;
            this.physicsData.values.flags |= PhysicsFlags.noOwnTeamCollision;
        }
    }
}
