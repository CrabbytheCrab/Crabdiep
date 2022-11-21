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
const Enums_1 = require("../Const/Enums");
const Dominator_1 = require("../Entity/Misc/Dominator");
const TeamBase_1 = require("../Entity/Misc/TeamBase");
const TeamEntity_1 = require("../Entity/Misc/TeamEntity");
const Arena_1 = require("../Native/Arena");
const arenaSize = 11150;
const baseSize = 3345;
const domBaseSize = baseSize / 2;
/**
 * Domination Gamemode Arena
 */
class DominationArena extends Arena_1.default {
    constructor(game) {
        super(game);
        /** Blue Team entity */
        this.blueTeam = new TeamEntity_1.TeamEntity(this.game, Enums_1.Colors.TeamBlue);
        /** Red Team entity */
        this.redTeam = new TeamEntity_1.TeamEntity(this.game, Enums_1.Colors.TeamRed);
        this.updateBounds(arenaSize * 2, arenaSize * 2);
        new TeamBase_1.default(game, this.blueTeam, -arenaSize + baseSize / 2, -arenaSize + baseSize / 2, baseSize, baseSize);
        new TeamBase_1.default(game, this.redTeam, arenaSize - baseSize / 2, arenaSize - baseSize / 2, baseSize, baseSize);
        new Dominator_1.default(this, new TeamBase_1.default(game, this, arenaSize / 2.5, arenaSize / 2.5, domBaseSize, domBaseSize, false));
        new Dominator_1.default(this, new TeamBase_1.default(game, this, arenaSize / -2.5, arenaSize / 2.5, domBaseSize, domBaseSize, false));
        new Dominator_1.default(this, new TeamBase_1.default(game, this, arenaSize / -2.5, arenaSize / -2.5, domBaseSize, domBaseSize, false));
        new Dominator_1.default(this, new TeamBase_1.default(game, this, arenaSize / 2.5, arenaSize / -2.5, domBaseSize, domBaseSize, false));
    }
    spawnPlayer(tank, client) {
        tank.position.values.y = arenaSize * Math.random() - arenaSize;
        const x = Math.random() * baseSize, y = Math.random() * baseSize;
        const chance = Math.random();
        if (chance < 0.5) {
            tank.relations.values.team = this.blueTeam;
            tank.style.values.color = this.blueTeam.team.values.teamColor;
            tank.position.values.x = -arenaSize + x;
            tank.position.values.y = -arenaSize + y;
        }
        else {
            tank.relations.values.team = this.redTeam;
            tank.style.values.color = this.redTeam.team.values.teamColor;
            tank.position.values.x = arenaSize - x;
            tank.position.values.y = arenaSize - y;
        }
        if (client.camera)
            client.camera.relations.team = tank.relations.values.team;
    }
}
exports.default = DominationArena;
