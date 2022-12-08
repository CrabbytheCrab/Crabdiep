"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Dominator_1 = require("../Entity/Misc/Dominator");
const TeamBase_1 = require("../Entity/Misc/TeamBase");
const TeamEntity_1 = require("../Entity/Misc/TeamEntity");
const Arena_1 = require("../Native/Arena");
const arenaSize = 11150;
const baseSize = 3345;
const domBaseSize = baseSize / 2;
class DominationArena extends Arena_1.default {
    constructor(game) {
        super(game);
        this.playerTeamMap = new Map();
        this.shapeScoreRewardMultiplier = 2.0;
        this.updateBounds(arenaSize * 2, arenaSize * 2);
        this.arenaData.values.flags |= 4;
        this.blueTeamBase = new TeamBase_1.default(game, new TeamEntity_1.TeamEntity(this.game, 3), -arenaSize + baseSize / 2, -arenaSize + baseSize / 2, baseSize, baseSize);
        this.redTeamBase = new TeamBase_1.default(game, new TeamEntity_1.TeamEntity(this.game, 4), arenaSize - baseSize / 2, arenaSize - baseSize / 2, baseSize, baseSize);
        new Dominator_1.default(this, new TeamBase_1.default(game, this, arenaSize / 2.5, arenaSize / 2.5, domBaseSize, domBaseSize, false));
        new Dominator_1.default(this, new TeamBase_1.default(game, this, arenaSize / -2.5, arenaSize / 2.5, domBaseSize, domBaseSize, false));
        new Dominator_1.default(this, new TeamBase_1.default(game, this, arenaSize / -2.5, arenaSize / -2.5, domBaseSize, domBaseSize, false));
        new Dominator_1.default(this, new TeamBase_1.default(game, this, arenaSize / 2.5, arenaSize / -2.5, domBaseSize, domBaseSize, false));
    }
    spawnPlayer(tank, client) {
        tank.positionData.values.y = arenaSize * Math.random() - arenaSize;
        const xOffset = (Math.random() - 0.5) * baseSize, yOffset = (Math.random() - 0.5) * baseSize;
        const base = this.playerTeamMap.get(client) || [this.blueTeamBase, this.redTeamBase][0 | Math.random() * 2];
        tank.relationsData.values.team = base.relationsData.values.team;
        tank.styleData.values.color = base.styleData.values.color;
        tank.positionData.values.x = base.positionData.values.x + xOffset;
        tank.positionData.values.y = base.positionData.values.y + yOffset;
        this.playerTeamMap.set(client, base);
        if (client.camera)
            client.camera.relationsData.team = tank.relationsData.values.team;
    }
}
exports.default = DominationArena;
