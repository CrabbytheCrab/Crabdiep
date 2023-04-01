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
import { HealthFlags, PhysicsFlags, PositionFlags, Stat, StyleFlags } from "../../../Const/Enums";

import { TankDefinition } from "../../../Const/TankDefinitions";
import { BarrelBase } from "../TankBody";
import ObjectEntity from "../../Object";
import GameServer from "../../../Game";

export default class Partical extends ObjectEntity{
    public sized: number
    protected spawnTick = 0;
    /** Speed the bullet will accelerate at. */
    public baseAccel = 0;
    /** Starting velocity of the bullet. */
    public baseSpeed = 0;
    /** Percent of accel applied when dying. */
    protected deathAccelFactor = 0.5;
    /** Life length in ticks before the bullet dies. */
    protected tank: BarrelBase;
    protected lifeLength = 0;
    /** Angle the projectile is shot at. */
    protected movementAngle = 0;
    public constructor(game: GameServer,tank: BarrelBase, shootAngle: number) {
        super(game);
        this.movementAngle = shootAngle;
        this.tank = tank;

        this.sized = this.physicsData.values.size
        this.baseSpeed *= 0.8;
        this.physicsData.values.flags |= PhysicsFlags.noOwnTeamCollision | PhysicsFlags.canEscapeArena;
        this.positionData.values.flags |= PositionFlags.canMoveThroughWalls
        this.styleData.values.flags |= StyleFlags.hasNoDmgIndicator;
        this.physicsData.values.sides = 1;
        this.physicsData.values.absorbtionFactor = this.physicsData.values.pushFactor = 0;
        this.baseAccel = 30;
        this.baseSpeed = 30
        this.physicsData.absorbtionFactor = 0
        this.physicsData.pushFactor = 0
        this.lifeLength = 100000
        const {x, y} = tank.getWorldPosition();
        const sizeFactor = tank.sizeFactor;
        
        this.positionData.values.x = x + (Math.cos(shootAngle) * tank.physicsData.values.size) - Math.sin(shootAngle) * sizeFactor;
        this.positionData.values.y = y + (Math.sin(shootAngle) * tank.physicsData.values.size) + Math.cos(shootAngle) * sizeFactor;
        this.positionData.values.angle = shootAngle;
    }
    public destroy(animate=true) {
        if (this.deletionAnimation) {
            this.deletionAnimation.frame = 0;
        }
        if (this.deletionAnimation) {
            this.deletionAnimation.frame = 0;
            this.styleData.opacity = 0;
        }
    super.destroy(animate);
}
    public tick(tick: number) {
        super.tick(tick);
        if (tick === this.spawnTick + 1) this.addAcceleration(this.movementAngle, this.baseSpeed);
        else this.maintainVelocity(this.movementAngle, this.baseAccel);
        this.styleData.opacity -= 0.05
        if(this.styleData.opacity <= 0)this.destroy()
        //this.damageReduction += 1 / 25;
        //this.styleData.opacity -= 1 / 25;
    }
}
