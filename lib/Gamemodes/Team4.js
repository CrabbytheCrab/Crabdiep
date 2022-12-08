"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Arena_1 = require("../Native/Arena");
const TeamBase_1 = require("../Entity/Misc/TeamBase");
const TeamEntity_1 = require("../Entity/Misc/TeamEntity");
const arenaSize = 11150;
const baseSize = 3345;
class Teams4Arena extends Arena_1.default {
    constructor(game) {
        super(game);
        this.playerTeamMap = new Map();
        this.updateBounds(arenaSize * 2, arenaSize * 2);
        this.blueTeamBase = new TeamBase_1.default(game, new TeamEntity_1.TeamEntity(this.game, 3), -arenaSize + baseSize / 2, -arenaSize + baseSize / 2, baseSize, baseSize);
        this.redTeamBase = new TeamBase_1.default(game, new TeamEntity_1.TeamEntity(this.game, 4), arenaSize - baseSize / 2, arenaSize - baseSize / 2, baseSize, baseSize);
        this.greenTeamBase = new TeamBase_1.default(game, new TeamEntity_1.TeamEntity(this.game, 6), -arenaSize + baseSize / 2, arenaSize - baseSize / 2, baseSize, baseSize);
        this.purpleTeamBase = new TeamBase_1.default(game, new TeamEntity_1.TeamEntity(this.game, 5), arenaSize - baseSize / 2, -arenaSize + baseSize / 2, baseSize, baseSize);
    }
    spawnPlayer(tank, client) {
        tank.positionData.values.y = arenaSize * Math.random() - arenaSize;
        const xOffset = (Math.random() - 0.5) * baseSize, yOffset = (Math.random() - 0.5) * baseSize;
        const base = this.playerTeamMap.get(client) || [this.blueTeamBase, this.redTeamBase, this.greenTeamBase, this.purpleTeamBase][0 | Math.random() * 4];
        tank.relationsData.values.team = base.relationsData.values.team;
        tank.styleData.values.color = base.styleData.values.color;
        tank.positionData.values.x = base.positionData.values.x + xOffset;
        tank.positionData.values.y = base.positionData.values.y + yOffset;
        this.playerTeamMap.set(client, base);
        if (client.camera)
            client.camera.relationsData.team = tank.relationsData.values.team;
    }
}
exports.default = Teams4Arena;
