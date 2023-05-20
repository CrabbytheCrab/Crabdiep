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

import LivingEntity from "../../Live";
import Barrel from "../Barrel";

import { HealthFlags, PositionFlags, PhysicsFlags, Stat, StyleFlags, Tank } from "../../../Const/Enums";
import { TankDefinition } from "../../../Const/TankDefinitions";
import { BarrelBase } from "../TankBody";
import { Entity, EntityStateFlags } from "../../../Native/Entity";
import ObjectEntity from "../../Object";
import Bullet from "./Bullet";
import AutoTurret from "../AutoTurret";
import { Inputs } from "../../AI";

/**
 * The bullet class represents the bullet entity in diep.
 */
export default class AutoBullet extends Bullet implements BarrelBase{
    /** The barrel that the bullet is being shot from. */
    public sizeFactor: number;
    public reloadTime = 15;
    public cameraEntity: Entity;
    public inputs = new Inputs();
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number, parent?: ObjectEntity) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.cameraEntity = tank.cameraEntity;
        this.sizeFactor = this.physicsData.values.size / 50;
        if(tankDefinition && tankDefinition.id === Tank.Mecha){
            const atuo = new AutoTurret(this, {
                angle: 0,
                offset: 0,
                size: 65,
                width: 33.6,
                delay: 0.2,
                reload: 1.75,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 0.8,
                    damage: 0.4,
                    speed: 1,
                    scatterRate: 1,
                    lifeLength: 0.75,
                    absorbtionFactor: 0.1
                }
            });
                atuo.baseSize *= 1.25
            //  atuo.positionData.values.angle = shootAngle
                atuo.ai.viewRange = 1000
                atuo.positionData.values.angle = shootAngle
        
        }
        else if(tankDefinition && tankDefinition.id === Tank.Actuator){
            const atuo = new AutoTurret(this, {
                angle: 0,
                offset: 0,
                size: 65,
                width: 50.4,
                delay: 0.2,
                reload: 4.5,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1,
                    damage: 1.2,
                    speed: 1.2,
                    scatterRate: 1,
                    lifeLength: 0.75,
                    absorbtionFactor: 0.1
                }
            });
                atuo.baseSize *= 1.25
            //  atuo.positionData.values.angle = shootAngle
                atuo.positionData.values.angle = shootAngle
                atuo.ai.viewRange = 1000
        }
        else
        {
            const atuo = new AutoTurret(this, {
                angle: 0,
                offset: 0,
                size: 65,
                width: 33.6,
                delay: 0.2,
                reload: 1.75,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1,
                    damage: 0.4,
                    speed: 1.2,
                    scatterRate: 1,
                    lifeLength: 0.75,
                    absorbtionFactor: 0.1
                }
            });
                atuo.baseSize *= 1.25
            //  atuo.positionData.values.angle = shootAngle
                atuo.positionData.values.angle = shootAngle
                atuo.ai.viewRange = 1000
        }
    }
    /** Extends LivingEntity.onKill - passes kill to the owner. */
    public onKill(killedEntity: LivingEntity) {
        // TODO(ABC):
        // Make this, work differently
        /** @ts-ignore */
        if (typeof this.parent.onKill === 'function') this.parent.onKill(killedEntity);
    }

    public tick(tick: number) {
        super.tick(tick);
    }
}
