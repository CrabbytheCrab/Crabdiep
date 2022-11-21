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
const Enums_1 = require("../../../Const/Enums");
const Entity_1 = require("../../../Native/Entity");
const AI_1 = require("../../AI");
/**
 * The drone class represents the drone (projectile) entity in diep.
 */
class Drone extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.boom = false;
        //this.rotationPerTick = direction;
        const bulletDefinition = barrel.definition.bullet;
        this.usePosAngle = false;
        this.ai = new AI_1.AI(this);
        this.canControlDrones = typeof this.barrelEntity.definition.canControlDrones === 'boolean' && this.barrelEntity.definition.canControlDrones;
        this.physics.values.sides = bulletDefinition.sides ?? 5;
        if (this.physics.values.objectFlags & Enums_1.ObjectFlags.noOwnTeamCollision)
            this.physics.values.objectFlags ^= Enums_1.ObjectFlags.noOwnTeamCollision;
        this.physics.values.objectFlags |= Enums_1.ObjectFlags.onlySameOwnerCollision;
        this.style.values.styleFlags &= ~Enums_1.StyleFlags.noDmgIndicator;
        // TOD(ABCO:
        // No hardcoded - unless it is hardcoded in diep (all signs show that it might be so far)
        this.deathAccelFactor = 1;
        this.physics.values.pushFactor = 4;
        this.physics.values.absorbtionFactor = bulletDefinition.absorbtionFactor;
        this.baseSpeed /= 3;
        barrel.droneCount += 1;
        this.ai.movementSpeed = this.ai.aimSpeed = this.baseAccel;
        this.ai.isTaken = true;
    }
    /** Extends LivingEntity.destroy - so that the drone count decreases for the barrel. */
    destroy(animate = true) {
        if (!animate)
            this.barrelEntity.droneCount -= 1;
        super.destroy(animate);
    }
    /** This allows for factory to hook in before the entity moves. */
    tickMixin(tick) {
    }
    tick(tick) {
        if (tick - this.spawnTick >= this.lifeLength / 4 && this.boom == false) {
            this.movementAngle += Math.PI;
            this.boom = true;
        }
        this.position.angle += 0.3;
        super.tick(tick);
        // So that switch tank works, as well as on death
        if (!Entity_1.Entity.exists(this.barrelEntity))
            this.destroy();
        this.tickMixin(tick);
    }
}
exports.default = Drone;
/** The drone's radius of resting state */
Drone.MAX_RESTING_RADIUS = 400 ** 2;
Drone.BASE_ROTATION = 0.1;
