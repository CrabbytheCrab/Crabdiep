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
import { PhysicsFlags, Stat, StyleFlags, Tank } from "../../../Const/Enums";

import { TankDefinition } from "../../../Const/TankDefinitions";
import { BarrelBase } from "../TankBody";

export default class Shotgun extends Bullet {
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel, tank, tankDefinition, shootAngle);
        if (this.tankDefinition && this.tankDefinition.id != Tank.Blunderbuss){
        
        this.baseSpeed *= 2
        this.baseAccel /= 2
        this.physicsData.size *= 1 + ((0.5 * Math.random()) -0.25)
        this.baseSpeed *= 1 + ((0.4 * Math.random()) -0.2)
        this.baseAccel *= 1 + ((0.5 * Math.random()) -0.25)
        }else{
            this.baseSpeed *= 1 + ((0.2 * Math.random()) -0.1)
            this.baseAccel *= 1 + ((0.3 * Math.random()) -0.15)
        }

    }

    public tick(tick: number) {
        if (this.tankDefinition && this.tankDefinition.id != Tank.Blunderbuss){
            if (tick <= this.spawnTick + 5){
            }else{
                const bulletDefinition = this.barrelEntity.definition.bullet;
                const statLevels = this.tank.cameraEntity.cameraData?.values.statLevels.values;
                const bulletDamage = statLevels ? statLevels[Stat.BulletDamage] : 0;
                const falloff = ((7 + bulletDamage * 3) * bulletDefinition.damage)/2;
                this.damagePerTick = falloff
            if (this.tankDefinition && this.tankDefinition.id === Tank.MegaCannon){
                this.destroy()
            }
                
            }
        }
        super.tick(tick);
    }
}
