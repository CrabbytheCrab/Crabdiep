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
const Drone_1 = require("./Drone");
const Enums_1 = require("../../../Const/Enums");
const AI_1 = require("../../AI");
/**
 * The drone class represents the drone (projectile) entity in diep.
 */
class NecromancerSquare extends Drone_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle, shape) {
        super(barrel, tank, tankDefinition, shootAngle);
        const bulletDefinition = barrel.definition.bullet;
        this.ai = new AI_1.AI(this);
        this.ai.viewRange = 900;
        this.physics.values.sides = shape.physics.values.sides;
        this.physics.values.size = shape.physics.values.size;
        /** @ts-ignore */
        this.damagePerTick *= shape.damagePerTick / 8;
        /** @ts-ignore */
        this.health.values.maxHealth = this.health.values.health *= (shape.damagePerTick / 8);
        // if (shape.isShiny) this.health.values.maxHealth = this.health.values.health *= 10
        this.style.values.color = tank.relations.values.team?.team?.values.teamColor || Enums_1.Colors.NecromancerSquare;
        if (this.physics.values.objectFlags & Enums_1.ObjectFlags.noOwnTeamCollision)
            this.physics.values.objectFlags ^= Enums_1.ObjectFlags.noOwnTeamCollision;
        this.physics.values.objectFlags |= Enums_1.ObjectFlags.onlySameOwnerCollision;
        // TODO(ABC):
        // No hardcoded - unless it is hardcoded in diep (all signs show that it might be so far)
        if (tankDefinition && tankDefinition.id === Enums_1.Tank.Battleship) {
            this.lifeLength = 88;
        }
        else {
            this.lifeLength = Infinity;
            if (this.physics.values.objectFlags & Enums_1.ObjectFlags.canEscapeArena)
                this.physics.values.objectFlags ^= Enums_1.ObjectFlags.canEscapeArena;
        }
        this.deathAccelFactor = 1;
        this.physics.values.pushFactor = 4;
        this.physics.values.absorbtionFactor = bulletDefinition.absorbtionFactor;
        this.baseSpeed = 0;
    }
}
exports.default = NecromancerSquare;
