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
const Enums_1 = require("../../Const/Enums");
const Live_1 = require("../Live");
/**
 * Represents Team Bases in game.
 */
class TeamBase extends Live_1.default {
    constructor(game, team, x, y, width, height, painful = true) {
        super(game);
        this.relations.values.team = team;
        this.position.values.x = x;
        this.position.values.y = y;
        this.physics.values.width = width;
        this.physics.values.size = height;
        this.physics.values.sides = 2;
        this.physics.values.objectFlags |= Enums_1.ObjectFlags.minimap | Enums_1.ObjectFlags.noOwnTeamCollision | Enums_1.ObjectFlags.base;
        this.physics.values.pushFactor = 2;
        this.damagePerTick = 5;
        if (!painful) {
            this.physics.values.pushFactor = 0;
            this.damagePerTick = 0;
        }
        this.damageReduction = 0;
        this.physics.values.absorbtionFactor = 0;
        this.style.values.opacity = 0.1;
        this.style.values.borderThickness = 0;
        this.style.values.color = team.team.teamColor;
        this.style.values.styleFlags |= Enums_1.StyleFlags.minimap2 | Enums_1.StyleFlags.noDmgIndicator;
        this.health.healthbar |= Enums_1.HealthbarFlags.hidden;
        this.health.health = this.health.values.maxHealth = 0xABCFF;
    }
    tick(tick) {
        // No animation. No regen
        this.lastDamageTick = tick;
    }
}
exports.default = TeamBase;
