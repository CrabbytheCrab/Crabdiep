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
exports.TeamEntity = exports.ColorsTeamName = void 0;
const Enums_1 = require("../../Const/Enums");
const Entity_1 = require("../../Native/Entity");
const FieldGroups_1 = require("../../Native/FieldGroups");
exports.ColorsTeamName = {
    [Enums_1.Colors.Border]: "BORDER",
    [Enums_1.Colors.Barrel]: "BARREL",
    [Enums_1.Colors.Tank]: "TANK",
    [Enums_1.Colors.TeamBlue]: "BLUE",
    [Enums_1.Colors.TeamRed]: "RED",
    [Enums_1.Colors.TeamPurple]: "PURPLE",
    [Enums_1.Colors.TeamGreen]: "GREEN",
    [Enums_1.Colors.Shiny]: "SHINY",
    [Enums_1.Colors.EnemySquare]: "SQUARE",
    [Enums_1.Colors.EnemyTriangle]: "TRIANGLE",
    [Enums_1.Colors.EnemyPentagon]: "PENTAGON",
    [Enums_1.Colors.EnemyCrasher]: "CRASHER",
    [Enums_1.Colors.Neutral]: "a mysterious group",
    [Enums_1.Colors.ScoreboardBar]: "SCOREBOARD",
    [Enums_1.Colors.Box]: "MAZE",
    [Enums_1.Colors.EnemyTank]: "ENEMY",
    [Enums_1.Colors.NecromancerSquare]: "SUNCHIP",
    [Enums_1.Colors.Fallen]: "FALLEN",
    [Enums_1.Colors.kMaxColors]: "UNKNOWN"
};
class TeamEntity extends Entity_1.Entity {
    constructor(game, color, name = exports.ColorsTeamName[color]) {
        super(game);
        /** This group makes `this` a team entity in the first place. */
        this.team = new FieldGroups_1.TeamGroup(this);
        this.team.values.teamColor = color;
        this.teamName = name;
    }
}
exports.TeamEntity = TeamEntity;
