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
const TeamEntity_1 = require("../../Entity/Misc/TeamEntity");
const Enums_1 = require("../../Const/Enums");
const Sandbox_1 = require("../Sandbox");
/**
 * Manage shape count
 */
class JungleShapeManager extends Sandbox_1.SandboxShapeManager {
    spawnShape() {
        const shape = super.spawnShape();
        shape.physics.values.size *= 2.6;
        shape.health.values.health = (shape.health.values.maxHealth *= 4.3);
        shape.physics.values.absorbtionFactor /= 6;
        shape.scoreReward *= 19;
        return shape;
    }
}
/**
 * Sandbox Gamemode Arena
 */
class JungleArena extends Arena_1.default {
    constructor(game) {
        super(game);
        /** Limits shape count to floor(12.5 * player count) */
        this.shapes = new JungleShapeManager(this);
        this.playerTeam = new TeamEntity_1.TeamEntity(game, Enums_1.Colors.TeamBlue);
        this.updateBounds(2500, 2500);
    }
    spawnPlayer(tank, client) {
        super.spawnPlayer(tank, client);
        tank.relations.values.team = this.playerTeam;
        tank.style.values.color = this.playerTeam.team.values.teamColor;
        if (client.camera)
            client.camera.relations.team = tank.relations.values.team;
    }
    tick(tick) {
        const arenaSize = Math.floor(25 * Math.sqrt(Math.max(this.game.clients.size, 1))) * 100;
        if (this.width !== arenaSize || this.height !== arenaSize)
            this.updateBounds(arenaSize, arenaSize);
        super.tick(tick);
    }
}
exports.default = JungleArena;
