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
import { InputFlags } from "../../../Const/Enums";
import { ObjectFlags, StyleFlags } from "../../../Const/Enums";
import {BarrelDefinition, TankDefinition } from "../../../Const/TankDefinitions";
import { BarrelBase } from "../TankBody";
import { DevTank } from "../../../Const/DevTankDefinitions";
import AutoTurret from "../AutoTurret";
import { Entity } from "../../../Native/Entity";
/**
 * The trap class represents the trap (projectile) entity in diep.
 */
export default class Trap extends Bullet implements BarrelBase {
    private turreta: AutoTurret;
    public sizeFactor: number;
    public cameraEntity: Entity;
    public inputs = new Inputs();
    /** Number of ticks before the trap cant collide with its own team. */
    protected collisionEnd = 0;
    public reloadTime = 1;

    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel, tank, tankDefinition, shootAngle);


        this.cameraEntity = tank.cameraEntity;

        this.sizeFactor = this.physics.values.size / 50;
        const atuo = this.turreta = new AutoTurret(this, {
            angle: 0,
            offset: 0,
            size: 50,
            width: 26.25,
            delay: 0,
            reload: 2,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "bullet",
                sizeRatio: 1,
                health: 0.75,
                damage: 0.5,
                speed: 0.8,
                scatterRate: 0,
                lifeLength: 0.75,
                absorbtionFactor: 0.1
            }
        });
        atuo.position.values.angle = shootAngle
        //atuo.ai.passiveRotation = this.movementAngle
        atuo.style.values.styleFlags |= StyleFlags.aboveParent;
        atuo.ai.viewRange = 640

        this.baseSpeed = (barrel.bulletAccel / 2) + 30 - Math.random() * barrel.definition.bullet.scatterRate;
        this.baseAccel = 0;
        this.physics.values.sides = 3;
        if (this.physics.values.objectFlags & ObjectFlags.noOwnTeamCollision) this.physics.values.objectFlags ^= ObjectFlags.noOwnTeamCollision;
        this.physics.values.objectFlags |= ObjectFlags.onlySameOwnerCollision;
        this.style.values.styleFlags |=  StyleFlags.star;
        this.style.values.styleFlags &= ~StyleFlags.noDmgIndicator;

        this.collisionEnd = this.lifeLength >> 3;
        this.lifeLength = (600 * barrel.definition.bullet.lifeLength) >> 3;
        if (tankDefinition && tankDefinition.id === DevTank.Bouncy) this.collisionEnd = this.lifeLength - 1;
        
        // Check this?
        this.position.values.angle = Math.random() * Math.PI * 2;
    }

    public tick(tick: number) {
        super.tick(tick);
        this.reloadTime = this.tank.reloadTime;
        if (tick - this.spawnTick === this.collisionEnd) {
            if (this.physics.values.objectFlags & ObjectFlags.onlySameOwnerCollision) this.physics.objectFlags ^= ObjectFlags.onlySameOwnerCollision;
            this.physics.values.objectFlags |= ObjectFlags.noOwnTeamCollision;
        }
    }
}
