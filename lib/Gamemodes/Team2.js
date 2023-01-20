"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chaoschance = void 0;
const Arena_1 = require("../Native/Arena");
const TeamBase_1 = require("../Entity/Misc/TeamBase");
const TeamEntity_1 = require("../Entity/Misc/TeamEntity");
const Dominator_1 = require("../Entity/Misc/Dominator");
const MazeWall_1 = require("../Entity/Misc/MazeWall");
const Manager_1 = require("../Entity/Shape/Manager");
const arenaSize = 11150;
const baseWidth = 2230;
const domBaseSize = baseWidth / 2;
class Chaoschance extends Manager_1.default {
    constructor(arena) {
        super(arena);
        this.sentrychance = 0;
    }
}
exports.Chaoschance = Chaoschance;
class Teams2Arena extends Arena_1.default {
    constructor(game) {
        super(game);
        this.playerTeamMap = new Map();
        this.updateBounds(arenaSize * 2, arenaSize * 2);
        this.blueTeamBase = new TeamBase_1.default(game, new TeamEntity_1.TeamEntity(this.game, 3), -arenaSize + baseWidth / 2, 0, arenaSize * 2, baseWidth);
        this.redTeamBase = new TeamBase_1.default(game, new TeamEntity_1.TeamEntity(this.game, 4), arenaSize - baseWidth / 2, 0, arenaSize * 2, baseWidth);
        new Dominator_1.default(this, new TeamBase_1.default(game, this, arenaSize / 2.5, 0, domBaseSize * 3, domBaseSize, false));
        new Dominator_1.default(this, new TeamBase_1.default(game, this, -arenaSize / 2.5, 0, domBaseSize * 3, domBaseSize, false));
        new MazeWall_1.default(this.game, -arenaSize / 2.5, -arenaSize / 5 - 278.75, domBaseSize * 2.5, domBaseSize);
        new MazeWall_1.default(this.game, arenaSize / 2.5, -arenaSize / 5 - 278.75, domBaseSize * 2.5, domBaseSize);
        new MazeWall_1.default(this.game, -arenaSize / 2.5, arenaSize / 5 + 278.75, domBaseSize * 2.5, domBaseSize);
        new MazeWall_1.default(this.game, arenaSize / 2.5, arenaSize / 5 + 278.75, domBaseSize * 2.5, domBaseSize);
        new MazeWall_1.default(this.game, -arenaSize / 5 + 2230, -arenaSize / 2.5, domBaseSize, domBaseSize * 7);
        new MazeWall_1.default(this.game, -arenaSize / 5 + 2230, arenaSize / 2.5, domBaseSize, domBaseSize * 7);
        this.shapeScoreRewardMultiplier = 3.0;
    }
    spawnPlayer(tank, client) {
        tank.positionData.values.y = arenaSize * Math.random() - arenaSize;
        const xOffset = (Math.random() - 0.5) * baseWidth;
        const base = this.playerTeamMap.get(client) || [this.blueTeamBase, this.redTeamBase][0 | Math.random() * 2];
        tank.relationsData.values.team = base.relationsData.values.team;
        tank.styleData.values.color = base.styleData.values.color;
        tank.positionData.values.x = base.positionData.values.x + xOffset;
        this.playerTeamMap.set(client, base);
        if (client.camera)
            client.camera.relationsData.team = tank.relationsData.values.team;
    }
}
exports.default = Teams2Arena;
