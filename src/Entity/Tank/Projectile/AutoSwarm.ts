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

import { TankDefinition } from "../../../Const/TankDefinitions";
import { Entity } from "../../../Native/Entity";
import { Inputs } from "../../AI";
import AutoTurret from "../AutoTurret";
import Barrel from "../Barrel";
import { BarrelBase } from "../TankBody";
import Drone from "./Drone";

/**
 * The Swarm class represents the swarm (projectile) entity in diep - think BattleShip
 */
export class AutoSwarm extends Drone  implements BarrelBase {
    public sizeFactor: number;
    public cameraEntity: Entity;
    public inputs = new Inputs();
    /** Number of ticks before the trap cant collide with its own team. */
    public reloadTime = 15;
    
    public constructor(barrel: Barrel,  tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.cameraEntity = tank.cameraEntity;
        this.sizeFactor = this.physicsData.values.size / 50;
        this.ai.viewRange = 850 * tank.sizeFactor * 2;

        const atuo = new AutoTurret(this, {
            angle: 0,
            offset: 0,
            size: 65,
            width: 35,
            delay: 0.01,
            reload: 2.5,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "bullet",
                sizeRatio: 1,
                health: 1,
                damage: 0.275,
                speed: 1.8,
                scatterRate: 1,
                lifeLength: 0.75,
                absorbtionFactor: 0.1
            }
        });
            atuo.baseSize *= 1.25
          //  atuo.positionData.values.angle = shootAngle
            atuo.ai.viewRange = 1200
    }

    // TODO:
    // Add the custom resting state AI (after fixing real drone's)
}
