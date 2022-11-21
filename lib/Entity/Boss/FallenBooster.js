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
 * Class which represents the boss "FallenBooster"
 */
class FallenBooster extends AbstractBoss_1.default {
    constructor(game) {
        super(game);
        /** The speed to maintain during movement. */
        this.movementSpeed = 1;
        this.name.values.name = 'Fallen Booster';
        for (const barrelDefinition of TankDefinitions_1.default[Enums_1.Tank.Booster].barrels) {
            const def = Object.assign({}, barrelDefinition, {});
            def.bullet = Object.assign({}, def.bullet, { speed: 1.7, health: 6.25 });
            this.barrels.push(new Barrel_1.default(this, def));
        }
    }
    moveAroundMap() {
        const x = this.position.values.x, y = this.position.values.y;
        if (this.ai.state === AI_1.AIState.idle) {
            super.moveAroundMap();
            this.position.angle = Math.atan2(this.inputs.movement.y, this.inputs.movement.x);
        }
        else {
            this.position.angle = Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x);
        }
    }
    tick(tick) {
        super.tick(tick);
        this.sizeFactor = this.physics.values.size / 50;
    }
}
exports.default = FallenBooster;
