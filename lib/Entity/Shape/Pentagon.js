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
/**
 * Pentagon entity class.
 */
class Pentagon extends AbstractShape_1.default {
    constructor(game, isAlpha = false, shiny = (Math.random() < 0.000001) && !isAlpha) {
        super(game);
        this.name.values.name = isAlpha ? "Alpha Pentagon" : "Pentagon";
        this.health.values.health = this.health.values.maxHealth = (isAlpha ? 3000 : 100);
        this.physics.values.size = (isAlpha ? 200 : 75) * Math.SQRT1_2;
        this.physics.values.sides = 5;
        this.style.values.color = shiny ? Enums_1.Colors.Shiny : Enums_1.Colors.EnemyPentagon;
        this.physics.values.absorbtionFactor = isAlpha ? 0.05 : 0.5;
        this.physics.values.pushFactor = 11;
        this.isAlpha = isAlpha;
        this.isShiny = shiny;
        this.damagePerTick = isAlpha ? 20 : 12;
        this.scoreReward = isAlpha ? 3000 : 130;
        if (shiny) {
            this.scoreReward *= 100;
            this.health.values.health = this.health.values.maxHealth *= 10;
        }
    }
}
exports.default = Pentagon;
Pentagon.BASE_ROTATION = AbstractShape_1.default.BASE_ROTATION / 2;
Pentagon.BASE_ORBIT = AbstractShape_1.default.BASE_ORBIT / 2;
Pentagon.BASE_VELOCITY = AbstractShape_1.default.BASE_VELOCITY / 2;
