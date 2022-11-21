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
const Arena_1 = require("../Native/Arena");
const TeamBase_1 = require("../Entity/Misc/TeamBase");
const TeamEntity_1 = require("../Entity/Misc/TeamEntity");
const Enums_1 = require("../Const/Enums");
const arenaSize = 11150;
const baseWidth = 2007;
// const arenaSize = 2000;
// const baseWidth = 407;
/**
 * Teams2 Gamemode Arena
 */
class Teams2Arena extends Arena_1.default {
    /** Limits shape count 100 */
    //     protected shapes: ShapeManager = new class extends ShapeManager {
    //     protected get wantedShapes() {
    //         return 64;
    //     }
    // }(this);
    constructor(game) {
        super(game);
        /** Blue Team entity */
        this.blueTeam = new TeamEntity_1.TeamEntity(this.game, Enums_1.Colors.TeamBlue);
        /** Red Team entity */
        this.redTeam = new TeamEntity_1.TeamEntity(this.game, Enums_1.Colors.TeamRed);
        this.updateBounds(arenaSize * 2, arenaSize * 2);
        new TeamBase_1.default(game, this.blueTeam, -arenaSize + baseWidth / 2, 0, arenaSize * 2, baseWidth);
        new TeamBase_1.default(game, this.redTeam, arenaSize - baseWidth / 2, 0, arenaSize * 2, baseWidth);
    }
    spawnPlayer(tank, client) {
        tank.position.values.y = arenaSize * Math.random() - arenaSize;
        const x = Math.random() * baseWidth;
        if (Math.random() < 0.5) {
            tank.relations.values.team = this.blueTeam;
            tank.style.values.color = this.blueTeam.team.values.teamColor;
            tank.position.values.x = -arenaSize + x;
        }
        else {
            tank.relations.values.team = this.redTeam;
            tank.style.values.color = this.redTeam.team.values.teamColor;
            tank.position.values.x = arenaSize - x;
        }
        if (client.camera)
            client.camera.relations.team = tank.relations.values.team;
    }
}
exports.default = Teams2Arena;
