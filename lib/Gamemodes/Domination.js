"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Enums_1 = require("../Const/Enums");
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
        this.dominators = [];
        this.playerTeamMap = new Map();
        this.shapeScoreRewardMultiplier = 2.0;
        this.updateBounds(arenaSize * 2, arenaSize * 2);
        this.arenaData.values.flags |= 4;
        this.blueTeamBase = new TeamBase_1.default(game, new TeamEntity_1.TeamEntity(this.game, 3), -arenaSize + baseSize / 2, Math.random() > .5 ? (arenaSize - baseSize / 2) : -arenaSize + baseSize / 2, baseSize, baseSize);
        this.redTeamBase = new TeamBase_1.default(game, new TeamEntity_1.TeamEntity(this.game, 4), arenaSize - baseSize / 2, Math.random() > .5 ? (arenaSize - baseSize / 2) : -arenaSize + baseSize / 2, baseSize, baseSize);
        const dom1 = new Dominator_1.default(this, new TeamBase_1.default(game, this, arenaSize / 2.5, arenaSize / 2.5, domBaseSize, domBaseSize, false));
        dom1.nameData.name = "SE Dominator";
        const dom2 = new Dominator_1.default(this, new TeamBase_1.default(game, this, arenaSize / -2.5, arenaSize / 2.5, domBaseSize, domBaseSize, false));
        dom2.nameData.name = "SW Dominator";
        const dom3 = new Dominator_1.default(this, new TeamBase_1.default(game, this, arenaSize / -2.5, arenaSize / -2.5, domBaseSize, domBaseSize, false));
        dom3.nameData.name = "NW Dominator";
        const dom4 = new Dominator_1.default(this, new TeamBase_1.default(game, this, arenaSize / 2.5, arenaSize / -2.5, domBaseSize, domBaseSize, false));
        dom4.nameData.name = "NE Dominator";
        this.dominators.push(dom1, dom2, dom3, dom4);
    }
    updateScoreboard(scoreboardPlayers) {
        this.dominators.sort((m1, m2) => m2.healthData.values.health - m1.healthData.values.health);
        const length = Math.min(10, this.dominators.length);
        for (let i = 0; i < length; ++i) {
            const dominator = this.dominators[i];
            const team = dominator.relationsData.values.team;
            if (dominator.styleData.values.color === 2)
                this.arenaData.values.scoreboardColors[i] = 13;
            else
                this.arenaData.values.scoreboardColors[i] = dominator.styleData.values.color;
            this.arenaData.values.scoreboardNames[i] = dominator.nameData.name;
            this.arenaData.values.scoreboardTanks[i] = -1;
            this.arenaData.values.scoreboardScores[i] = dominator.healthData.values.health;
            this.arenaData.values.scoreboardSuffixes[i] = " HP";
        }
        this.arenaData.scoreboardAmount = length;
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
    tick(tick) {
        const length = Math.min(10, this.dominators.length);
        for (let i = 0; i < length; ++i) {
            const dominator = this.dominators[i];
            if (this.dominators[0].relationsData.values.team == this.dominators[1].relationsData.values.team &&
                this.dominators[1].relationsData.values.team == this.dominators[2].relationsData.values.team &&
                this.dominators[2].relationsData.values.team == this.dominators[3].relationsData.values.team &&
                this.dominators[3].relationsData.values.team == this.dominators[0].relationsData.values.team &&
                this.dominators[0].relationsData.values.team !== this.game.arena &&
                this.dominators[1].relationsData.values.team !== this.game.arena &&
                this.dominators[2].relationsData.values.team !== this.game.arena &&
                this.dominators[3].relationsData.values.team !== this.game.arena) {
                if (this.state === 0) {
                    const team = this.dominators[1].relationsData.values.team;
                    const isateam = team instanceof TeamEntity_1.TeamEntity;
                    if (this.dominators[1].relationsData.values.team !== null) {
                        if (this.dominators[1].relationsData.values.team.teamData !== null) {
                            let message = `${isateam ? team.teamName : (this.dominators[1].nameData?.values.name || "an unnamed tank")} HAS WON THE GAME`;
                            this.game.broadcast().u8(3).stringNT(message).u32(Enums_1.ColorsHexCode[this.dominators[1].styleData.color]).float(10000).stringNT("").send();
                        }
                    }
                    this.state = 1;
                    setTimeout(() => {
                        this.close();
                    }, 5000);
                }
            }
        }
        super.tick(tick);
    }
}
exports.default = DominationArena;
