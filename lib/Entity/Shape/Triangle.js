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
const AbstractShape_1 = require("./AbstractShape");
const Enums_1 = require("../../Const/Enums");
class Triangle extends AbstractShape_1.default {
    constructor(game, shiny = Math.random() < 0.000001) {
        super(game);
        this.name.values.name = "Triangle";
        this.health.values.health = this.health.values.maxHealth = 30;
        this.physics.values.size = 55 * Math.SQRT1_2;
        this.physics.values.sides = 3;
        this.style.values.color = shiny ? Enums_1.Colors.Shiny : Enums_1.Colors.EnemyTriangle;
        this.damagePerTick = 8;
        this.scoreReward = 25;
        this.isShiny = shiny;
        if (shiny) {
            this.scoreReward *= 100;
            this.health.values.health = this.health.values.maxHealth *= 10;
        }
    }
}
exports.default = Triangle;
