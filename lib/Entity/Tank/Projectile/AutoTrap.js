"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
const AI_1 = require("../../AI");
const Enums_1 = require("../../../Const/Enums");
const DevTankDefinitions_1 = require("../../../Const/DevTankDefinitions");
const AutoTurret_1 = require("../AutoTurret");
/**
 * The trap class represents the trap (projectile) entity in diep.
 */
class Trap extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.inputs = new AI_1.Inputs();
        /** Number of ticks before the trap cant collide with its own team. */
        this.collisionEnd = 0;
        this.reloadTime = 1;
        this.cameraEntity = tank.cameraEntity;
        this.sizeFactor = this.physics.values.size / 50;
        const atuo = this.turreta = new AutoTurret_1.default(this, {
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
        atuo.position.values.angle = shootAngle;
        //atuo.ai.passiveRotation = this.movementAngle
        atuo.style.values.styleFlags |= Enums_1.StyleFlags.aboveParent;
        atuo.ai.viewRange = 640;
        this.baseSpeed = (barrel.bulletAccel / 2) + 30 - Math.random() * barrel.definition.bullet.scatterRate;
        this.baseAccel = 0;
        this.physics.values.sides = 3;
        if (this.physics.values.objectFlags & Enums_1.ObjectFlags.noOwnTeamCollision)
            this.physics.values.objectFlags ^= Enums_1.ObjectFlags.noOwnTeamCollision;
        this.physics.values.objectFlags |= Enums_1.ObjectFlags.onlySameOwnerCollision;
        this.style.values.styleFlags |= Enums_1.StyleFlags.star;
        this.style.values.styleFlags &= ~Enums_1.StyleFlags.noDmgIndicator;
        this.collisionEnd = this.lifeLength >> 3;
        this.lifeLength = (600 * barrel.definition.bullet.lifeLength) >> 3;
        if (tankDefinition && tankDefinition.id === DevTankDefinitions_1.DevTank.Bouncy)
            this.collisionEnd = this.lifeLength - 1;
        // Check this?
        this.position.values.angle = Math.random() * Math.PI * 2;
    }
    tick(tick) {
        super.tick(tick);
        this.reloadTime = this.tank.reloadTime;
        if (tick - this.spawnTick === this.collisionEnd) {
            if (this.physics.values.objectFlags & Enums_1.ObjectFlags.onlySameOwnerCollision)
                this.physics.objectFlags ^= Enums_1.ObjectFlags.onlySameOwnerCollision;
            this.physics.values.objectFlags |= Enums_1.ObjectFlags.noOwnTeamCollision;
        }
    }
}
exports.default = Trap;
