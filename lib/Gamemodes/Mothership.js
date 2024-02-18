"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mothership_1 = require("../Entity/Misc/Mothership");
const TeamEntity_1 = require("../Entity/Misc/TeamEntity");
const Arena_1 = require("../Native/Arena");
const Entity_1 = require("../Native/Entity");
const util_1 = require("../util");
const arenaSize = 11150;
const TEAM_COLORS = [3, 4];
class MothershipArena extends Arena_1.default {
    constructor(game) {
        super(game);
        this.teams = [];
        this.motherships = [];
        this.playerTeamMotMap = new Map();
        this.shapeScoreRewardMultiplier = 3.0;
        this.arenaData.values.flags |= 4;
        let randAngle = Math.random() * util_1.PI2;
        for (const teamColor of TEAM_COLORS) {
            const team = new TeamEntity_1.TeamEntity(this.game, teamColor);
            this.teams.push(team);
            const mot = new Mothership_1.default(this.game);
            this.motherships.push(mot);
            mot.relationsData.values.team = team;
            mot.styleData.values.color = team.teamData.values.teamColor;
            mot.positionData.values.x = Math.cos(randAngle) * arenaSize * 0.75;
            mot.positionData.values.y = Math.sin(randAngle) * arenaSize * 0.75;
            randAngle += util_1.PI2 / TEAM_COLORS.length;
        }
        this.updateBounds(arenaSize * 2, arenaSize * 2);
    }
    spawnPlayer(tank, client) {
        if (!this.motherships.length && !this.playerTeamMotMap.has(client)) {
            const team = this.teams[~~(Math.random() * this.teams.length)];
            const { x, y } = this.findSpawnLocation();
            tank.positionData.values.x = x;
            tank.positionData.values.y = y;
            tank.relationsData.values.team = team;
            tank.styleData.values.color = team.teamData.teamColor;
            return;
        }
        const mothership = this.playerTeamMotMap.get(client) || this.motherships[~~(Math.random() * this.motherships.length)];
        this.playerTeamMotMap.set(client, mothership);
        tank.relationsData.values.team = mothership.relationsData.values.team;
        tank.styleData.values.color = mothership.styleData.values.color;
        if (Entity_1.Entity.exists(mothership)) {
            tank.positionData.values.x = mothership.positionData.values.x;
            tank.positionData.values.y = mothership.positionData.values.y;
        }
        else {
            const { x, y } = this.findSpawnLocation();
            tank.positionData.values.x = x;
            tank.positionData.values.y = y;
        }
        if (client.camera)
            client.camera.relationsData.team = tank.relationsData.values.team;
    }
    updateScoreboard(scoreboardPlayers) {
        this.motherships.sort((m1, m2) => m2.healthData.values.health - m1.healthData.values.health);
        const length = Math.min(10, this.motherships.length);
        for (let i = 0; i < length; ++i) {
            const mothership = this.motherships[i];
            const team = mothership.relationsData.values.team;
            const isTeamATeam = team instanceof TeamEntity_1.TeamEntity;
            if (isTeamATeam) {
                team.teamData.mothershipX = mothership.positionData.values.x;
                team.teamData.mothershipY = mothership.positionData.values.y;
                team.teamData.flags |= 1;
            }
            if (mothership.styleData.values.color === 2)
                this.arenaData.values.scoreboardColors[i] = 13;
            else
                this.arenaData.values.scoreboardColors[i] = mothership.styleData.values.color;
            this.arenaData.values.scoreboardNames[i] = isTeamATeam ? team.teamName : `Mothership ${i + 1}`;
            this.arenaData.values.scoreboardTanks[i] = -1;
            this.arenaData.values.scoreboardScores[i] = mothership.healthData.values.health;
            this.arenaData.values.scoreboardSuffixes[i] = " HP";
        }
        this.arenaData.scoreboardAmount = length;
    }
    tick(tick) {
        for (let i = this.motherships.length; i-- > 0;) {
            const mot = this.motherships[i];
            if (!Entity_1.Entity.exists(mot)) {
                const pop = this.motherships.pop();
                if (pop && i < this.motherships.length)
                    this.motherships[i] = pop;
            }
        }
        if (this.motherships.length <= 1) {
            if (this.state === 0) {
                this.state = 1;
                setTimeout(() => {
                    this.close();
                }, 5000);
            }
        }
        super.tick(tick);
    }
}
exports.default = MothershipArena;
