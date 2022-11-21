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
const Barrel_1 = require("../Tank/Barrel");
const TankDefinitions_1 = require("../../Const/TankDefinitions");
const AbstractBoss_1 = require("./AbstractBoss");
const Enums_1 = require("../../Const/Enums");
const AI_1 = require("../AI");
/**
 * Class which represents the boss "FallenOverlord"
 */
class FallenOverlord extends AbstractBoss_1.default {
    constructor(game) {
        super(game);
        this.name.values.name = 'Fallen Overlord';
        for (const barrelDefinition of TankDefinitions_1.default[Enums_1.Tank.Overlord].barrels) {
            const def = Object.assign({}, barrelDefinition, { droneCount: 7, reload: 0.25 });
            def.bullet = Object.assign({}, def.bullet, { sizeRatio: 0.5, speed: 1.7, damage: 0.5, health: 12.5 });
            this.barrels.push(new Barrel_1.default(this, def));
        }
    }
    tick(tick) {
        super.tick(tick);
        this.sizeFactor = this.physics.values.size / 50;
        if (this.ai.state !== AI_1.AIState.possessed) {
            this.inputs.flags = 0;
            this.position.angle += this.ai.passiveRotation;
        }
    }
}
exports.default = FallenOverlord;
