"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamEntity = exports.ColorsTeamName = void 0;
const Entity_1 = require("../../Native/Entity");
const FieldGroups_1 = require("../../Native/FieldGroups");
exports.ColorsTeamName = {
    [0]: "BORDER",
    [1]: "BARREL",
    [2]: "TANK",
    [3]: "BLUE",
    [4]: "RED",
    [5]: "PURPLE",
    [6]: "GREEN",
    [7]: "SHINY",
    [8]: "SQUARE",
    [9]: "TRIANGLE",
    [10]: "PENTAGON",
    [11]: "CRASHER",
    [12]: "a mysterious group",
    [13]: "SCOREBOARD",
    [14]: "MAZE",
    [15]: "ENEMY",
    [16]: "SUNCHIP",
    [17]: "FALLEN",
    [18]: "Chip",
    [19]: "UNKNOWN"
};
class TeamEntity extends Entity_1.Entity {
    constructor(game, color, name = exports.ColorsTeamName[color]) {
        super(game);
        this.teamData = new FieldGroups_1.TeamGroup(this);
        this.teamData.values.teamColor = color;
        this.teamName = name;
    }
}
exports.TeamEntity = TeamEntity;
