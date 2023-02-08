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
import { Inputs } from "../../AI";
import { InputFlags, Tank } from "../../../Const/Enums";
import { PhysicsFlags, StyleFlags } from "../../../Const/Enums";
import {BarrelDefinition, TankDefinition } from "../../../Const/TankDefinitions";
import { BarrelBase } from "../TankBody";
import { DevTank } from "../../../Const/DevTankDefinitions";
import AutoTurret from "../AutoTurret";
import { Entity } from "../../../Native/Entity";
import { normalizeAngle } from "../../../util";
/**
 * The trap class represents the trap (projectile) entity in diep.
 */
const TrapBarrelDefinition1: BarrelDefinition = {
    angle: 0,
    offset: -17,
    size: 65,
    width: 28,
    delay: 0.01,
    reload: 1,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        sizeRatio: 1,
        health: 0.75,
        damage: 0.325,
        speed: 1,
        scatterRate: 2,
        lifeLength: 0.75,
        absorbtionFactor: 0.3
    }
};
const TrapBarrelDefinition2: BarrelDefinition = {
    angle: 0,
    offset: 17,
    size: 65,
    width: 30,
    delay: 0.51,
    reload: 1,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        sizeRatio: 1,
        health: 0.75,
        damage: 0.325,
        speed: 1,
        scatterRate: 2,
        lifeLength: 0.75,
        absorbtionFactor: 0.3
    }
};

const TrapBarrelDefinition3: BarrelDefinition = {
    angle: 0,
    offset: -20,
    size: 70,
    width: 25,
    delay: 0.01,
    reload: 2.5,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        sizeRatio: 1,
        health: 0.675,
        damage: 0.4,
        speed: 1,
        scatterRate: 1,
        lifeLength: 0.75,
        absorbtionFactor: 0.1
    }
};
const TrapBarrelDefinition4: BarrelDefinition = {
    angle: 0,
    offset: 20,
    size: 70,
    width: 25,
    delay: 0.51,
    reload: 2.5,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        sizeRatio: 1,
        health: 0.675,
        damage: 0.4,
        speed: 1,
        scatterRate: 1,
        lifeLength: 0.75,
        absorbtionFactor: 0.1
    }
};
export default class AutoTrap extends Bullet implements BarrelBase {
    public sizeFactor: number;
    public cameraEntity: Entity;
    private _currentTank: Tank | DevTank = Tank.Basic;
    protected megaturret: boolean;
    protected canControlDrones: boolean;
    public inputs = new Inputs();
    
    /** Number of ticks before the trap cant collide with its own team. */
    protected collisionEnd = 0;
    public reloadTime = 1;

    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel, tank, tankDefinition, shootAngle);

        this.canControlDrones = typeof this.barrelEntity.definition.canControlDrones === 'boolean' && this.barrelEntity.definition.canControlDrones;

        this.cameraEntity = tank.cameraEntity;
        this.megaturret = typeof this.barrelEntity.definition.megaturret === 'boolean' && this.barrelEntity.definition.megaturret;

        this.sizeFactor = this.physicsData.values.size / 50;
            if ( tankDefinition && tankDefinition.id === Tank.Raider){
            const atuo = new AutoTurret(this, {
                angle: 0,
                offset: 0,
                size: 80,
                width: 45,
                delay: 0.01,
                reload: 5.5,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 0.8,
                    damage: 1.25,
                    speed: 1.3,
                    scatterRate: 0.3,
                    lifeLength: 1,
                    absorbtionFactor: 0.1
                }
            });
                atuo.baseSize *= 1.425
                atuo.positionData.values.angle = shootAngle
            //atuo.ai.passiveRotation = this.movementAngle
            atuo.styleData.values.flags |= StyleFlags.showsAboveParent;
            atuo.ai.viewRange = 1500
        }
        else if(tankDefinition && tankDefinition.id === Tank.Fabricator){
            const atuo = new AutoTurret(this, {
                angle: 0,
                offset: 0,
                size: 65,
                width: 35,
                delay: 0.01,
                reload: 0.875,
                recoil: 0,
                isTrapezoid: true,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 0.75,
                    damage: 0.325,
                    speed: 1,
                    scatterRate: 2,
                    lifeLength: 0.75,
                    absorbtionFactor: 0.3
                }
            });
                atuo.baseSize *= 1.25
                atuo.positionData.values.angle = shootAngle
            //atuo.ai.passiveRotation = this.movementAngle
            atuo.styleData.values.flags |= StyleFlags.showsAboveParent;
            atuo.ai.viewRange = 540
        }
        else if(tankDefinition && tankDefinition.id === Tank.Meteor){
            const atuo  = [new AutoTurret(this, [TrapBarrelDefinition1, TrapBarrelDefinition2])];
                atuo[0].baseSize *= 1.35
                atuo[0].positionData.values.angle = shootAngle
            //atuo.ai.passiveRotation = this.movementAngle
            atuo[0].styleData.values.flags |= StyleFlags.showsAboveParent;
            atuo[0].ai.viewRange = 540
        }
        else if(tankDefinition && tankDefinition.id === Tank.Arsenal){
            const atuo  = [new AutoTurret(this, [TrapBarrelDefinition3, TrapBarrelDefinition4])];
                atuo[0].baseSize *= 1.25
                atuo[0].positionData.values.angle = shootAngle
            //atuo.ai.passiveRotation = this.movementAngle
            atuo[0].styleData.values.flags |= StyleFlags.showsAboveParent;
            atuo[0].ai.viewRange = 640
        }
        else{
        const atuo = new AutoTurret(this, {
            angle: 0,
            offset: 0,
            size: 65,
            width: 35,
            delay: 0.01,
            reload: 1.75,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "bullet",
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
        atuo.ai.viewRange = 640
    }
        this.baseSpeed = (barrel.bulletAccel / 2) + 30 - Math.random() * barrel.definition.bullet.scatterRate;
        this.baseAccel = 0;
        this.physicsData.values.sides = 3;
        if (this.physicsData.values.flags & PhysicsFlags.noOwnTeamCollision) this.physicsData.values.flags ^= PhysicsFlags.noOwnTeamCollision;
        this.physicsData.values.flags |= PhysicsFlags.onlySameOwnerCollision;
        this.styleData.values.flags |=  StyleFlags.isStar;
        this.styleData.values.flags &= ~StyleFlags.hasNoDmgIndicator;

        this.collisionEnd = this.lifeLength >> 3;
        this.lifeLength = (600 * barrel.definition.bullet.lifeLength) >> 3;
        if (tankDefinition && tankDefinition.id === DevTank.Bouncy) this.collisionEnd = this.lifeLength - 1;
        
        // Check this?
        this.positionData.values.angle = Math.random() * Math.PI * 2;
    }

    public tick(tick: number) {
        super.tick(tick);
        this.reloadTime = this.tank.reloadTime;
        if (tick - this.spawnTick === this.collisionEnd) {
            if (this.physicsData.values.flags & PhysicsFlags.onlySameOwnerCollision) this.physicsData.flags ^= PhysicsFlags.onlySameOwnerCollision;
            this.physicsData.values.flags |= PhysicsFlags.noOwnTeamCollision;
        }
    }
}
