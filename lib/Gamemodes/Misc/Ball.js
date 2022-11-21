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
const Arena_1 = require("../../Native/Arena");
const Object_1 = require("../../Entity/Object");
const Pentagon_1 = require("../../Entity/Shape/Pentagon");
const Enums_1 = require("../../Const/Enums");
const FieldGroups_1 = require("../../Native/FieldGroups");
const Sandbox_1 = require("../Sandbox");
/**
 * Only spawns crashers
 */
class CustomShapeManager extends Sandbox_1.SandboxShapeManager {
    spawnShape() {
        const { x, y } = this.arena.findSpawnLocation();
        const penta = new Pentagon_1.default(this.game, Math.random() < 0.25, Math.random() < 0.1);
        penta.position.values.x = Math.sign(x) * (Math.abs(x) - 200);
        penta.position.values.y = Math.sign(y) * (Math.abs(y) - 200);
        penta.relations.values.owner = penta.relations.values.team = this.arena;
        return penta;
    }
}
/**
 * Ball Gamemode Arena
 */
class BallArena extends Arena_1.default {
    constructor(game) {
        super(game);
        /** Controller of all shapes in the arena. */
        this.shapes = new CustomShapeManager(this);
        this.updateBounds(2500, 2500);
        const ball = new Object_1.default(game);
        ball.name = new FieldGroups_1.NameGroup(ball);
        ball.name.values.name = "im pacman";
        ball.physics.values.sides = 1;
        ball.style.values.color = Enums_1.Colors.ScoreboardBar;
        ball.physics.values.size = 100;
        ball.physics.values.absorbtionFactor = 10;
        ball.physics.values.objectFlags |= Enums_1.ObjectFlags.base | Enums_1.ObjectFlags.noOwnTeamCollision;
        ball.relations.values.team = ball;
    }
}
exports.default = BallArena;
