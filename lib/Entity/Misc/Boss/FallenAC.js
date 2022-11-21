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
const Barrel_1 = require("../../Tank/Barrel");
const TankDefinitions_1 = require("../../../Const/TankDefinitions");
const AbstractBoss_1 = require("../../Boss/AbstractBoss");
const Enums_1 = require("../../../Const/Enums");
const AI_1 = require("../../AI");
/**
 * Class which represents a funny Fallen AC boss
 */
class FallenAC extends AbstractBoss_1.default {
    constructor(game) {
        super(game);
        this.name.values.name = 'Fallen AC';
        this.movementSpeed = 20;
        for (const barrelDefinition of TankDefinitions_1.default[Enums_1.Tank.ArenaCloser].barrels) {
            this.barrels.push(new Barrel_1.default(this, barrelDefinition));
        }
    }
    moveAroundMap() {
        if (this.ai.state === AI_1.AIState.idle) {
            this.position.angle += this.ai.passiveRotation;
            this.accel.set({ x: 0, y: 0 });
        }
        else {
            const x = this.position.values.x, y = this.position.values.y;
            this.position.angle = Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x);
        }
    }
    tick(tick) {
        super.tick(tick);
    }
}
exports.default = FallenAC;
