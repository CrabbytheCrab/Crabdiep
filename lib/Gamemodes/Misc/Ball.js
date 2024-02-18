"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Arena_1 = require("../../Native/Arena");
const FieldGroups_1 = require("../../Native/FieldGroups");
const Sandbox_1 = require("../Sandbox");
const Live_1 = require("../../Entity/Live");
const MazeWall_1 = require("../../Entity/Misc/MazeWall");
const TeamBase_1 = require("../../Entity/Misc/TeamBase");
const TeamEntity_1 = require("../../Entity/Misc/TeamEntity");
const Belt_1 = require("../../Entity/Misc/Belt");
const BounceWall_1 = require("../../Entity/Misc/BounceWall");
const LiveWall_1 = require("../../Entity/Misc/LiveWall");
const arenaSize = 11150;
const baseWidth = 2230;
const domBaseSize = baseWidth / 2;
const CELL_SIZE = 635;
const GRID_SIZE = 40;
const ARENA_SIZE = CELL_SIZE * GRID_SIZE;
class CustomShapeManager extends Sandbox_1.SandboxShapeManager {
    get wantedShapes() {
        let i = 0;
        for (const client of this.game.clients) {
            if (client.camera)
                i += 1;
        }
        return 0;
    }
}
const TEAM_COLORS = [3, 4];
class BallArena extends Arena_1.default {
    constructor(game) {
        super(game);
        this.shapes = new CustomShapeManager(this);
        this.motherships = [];
        this.teams = [];
        this.playerTeamMap = new Map();
        this.RedScore = 0;
        this.BlueScore = 0;
        this.updateBounds(15000, 5000);
        new Belt_1.default(this.game, -1000, -1750, 500, 1000, 0);
        new Belt_1.default(this.game, 1000, 1750, 500, 1000, Math.PI);
        new LiveWall_1.default(this.game, -2875, -1750, 500, 250);
        new LiveWall_1.default(this.game, 2875, 1750, 500, 250);
        const wall = new MazeWall_1.default(this.game, 0, -2700, 400, 15000);
        wall.physicsData.flags |= 256;
        const wall2 = new MazeWall_1.default(this.game, 0, 2700, 400, 15000);
        wall2.physicsData.flags |= 256;
        new MazeWall_1.default(this.game, -1750, -750, 1500, 2500);
        new MazeWall_1.default(this.game, 1750, 750, 1500, 2500);
        new Belt_1.default(this.game, -5750, 1625, 1750, 1000, 0);
        new Belt_1.default(this.game, -5750, -1625, 1750, 1000, 0);
        new BounceWall_1.default(this.game, -4875, -0, 500, 250);
        new MazeWall_1.default(this.game, -5125, -0, 750, 250);
        new Belt_1.default(this.game, 5750, 1625, 1750, 1000, Math.PI);
        new Belt_1.default(this.game, 5750, -1625, 1750, 1000, Math.PI);
        new BounceWall_1.default(this.game, 4875, -0, 500, 250);
        new MazeWall_1.default(this.game, 5125, -0, 750, 250);
        new MazeWall_1.default(this.game, 1750, 2250, 500, 2500);
        new MazeWall_1.default(this.game, -1750, -2250, 500, 2500);
        new MazeWall_1.default(this.game, -1750, 500, 1000, 2500);
        new MazeWall_1.default(this.game, 1750, -500, 1000, 2500);
        new MazeWall_1.default(this.game, -1250, 2250, 500, 3500);
        new MazeWall_1.default(this.game, 1250, -2250, 500, 3500);
        this.blueTeamBase = new TeamBase_1.default(game, new TeamEntity_1.TeamEntity(this.game, 3), -7500 + 1250 / 2, 0, 5000, 1250);
        this.redTeamBase = new TeamBase_1.default(game, new TeamEntity_1.TeamEntity(this.game, 4), 7500 - 1250 / 2, 0, 5000, 1250);
        this.scoreneeded = new Live_1.default(this.game);
        this.motherships.push(this.scoreneeded);
        this.scoreneeded.relationsData.values.team = this.game.arena;
        this.scoreneeded.styleData.values.color = 13;
        this.scoreneeded.positionData.values.x = 10000;
        this.scoreneeded.positionData.values.y = 10000;
        this.scoreneeded.MAXDRONES = 5;
        this.rSCore = new Live_1.default(this.game);
        this.motherships.push(this.rSCore);
        this.rSCore.relationsData.values.team = this.redTeamBase;
        this.rSCore.styleData.values.color = this.redTeamBase.styleData.values.color;
        this.rSCore.positionData.values.x = 10000;
        this.rSCore.positionData.values.y = 10000;
        this.rSCore.MAXDRONES = 0;
        this.bSCore = new Live_1.default(this.game);
        this.motherships.push(this.bSCore);
        this.bSCore.relationsData.values.team = this.blueTeamBase;
        this.bSCore.styleData.values.color = this.blueTeamBase.styleData.values.color;
        this.bSCore.positionData.values.x = 10000;
        this.bSCore.positionData.values.y = 10000;
        this.bSCore.MAXDRONES = 0;
        this.balls();
    }
    balls() {
        const ball = new Live_1.default(this.game);
        ball.nameData = new FieldGroups_1.NameGroup(ball);
        ball.nameData.values.name = "Smashtards when they die to intended game mechanics(Its a bug and should be removed)";
        ball.nameData.flags |= 1;
        ball.physicsData.values.sides = 1;
        ball.styleData.values.color = 13;
        ball.styleData.values.flags |= 128;
        ball.styleData.flags |= 128;
        ball.physicsData.values.size = 120;
        ball.physicsData.values.absorbtionFactor = 1.5;
        ball.damagePerTick = 1000;
        ball.physicsData.pushFactor = 4;
        ball.damageReduction = 0;
        ball.physicsData.values.sides = 1;
        ball.entityState |= 2 | 4;
        const tickBase = ball.tick;
        ball.tick = (tick) => {
            this.arenaData.leaderX = ball.positionData.x;
            this.arenaData.leaderY = ball.positionData.y;
            tickBase.call(ball, tick);
            const entities = ball.findCollisions();
            if (this.BlueScore >= 5) {
                ball.delete();
                let message = `BLUE TEAM HAS WON THE GAME`;
                this.game.broadcast().u8(3).stringNT(message).u32(3).float(10000).stringNT("").send();
                this.state = 1;
                setTimeout(() => {
                    this.close();
                }, 5000);
            }
            if (this.RedScore >= 5) {
                ball.delete();
                let message = `RED TEAM HAS WON THE GAME`;
                this.game.broadcast().u8(3).stringNT(message).u32(4).float(10000).stringNT("").send();
                this.state = 1;
                setTimeout(() => {
                    this.close();
                }, 5000);
            }
            for (let i = 0; i < entities.length; ++i) {
                const entity = entities[i];
                if (entity instanceof TeamBase_1.default) {
                    if (entity.styleData.color == 4) {
                        if (this.BlueScore < 5) {
                            this.bSCore.MAXDRONES++;
                            this.BlueScore++;
                            ball.delete();
                            this.balls();
                        }
                    }
                    else if (entity.styleData.color == 3) {
                        if (this.RedScore < 5) {
                            this.RedScore++;
                            this.rSCore.MAXDRONES++;
                            ball.delete();
                            this.balls();
                        }
                    }
                }
            }
        };
    }
    updateScoreboard(scoreboardPlayers) {
        this.motherships.sort((m1, m2) => m2.MAXDRONES - m1.MAXDRONES);
        const length = Math.min(10, this.motherships.length);
        for (let i = 0; i < length; ++i) {
            const mothership = this.motherships[i];
            const team = mothership.relationsData.values.team;
            const isTeamATeam = team instanceof TeamEntity_1.TeamEntity;
            if (isTeamATeam) {
                team.teamData.mothershipX = mothership.positionData.values.x;
                team.teamData.mothershipY = mothership.positionData.values.y;
            }
            if (mothership.styleData.values.color === 2)
                this.arenaData.values.scoreboardColors[i] = 13;
            else
                this.arenaData.values.scoreboardColors[i] = mothership.styleData.values.color;
            this.arenaData.values.scoreboardNames[i] = isTeamATeam ? team.teamName : `Team Points`;
            if (i == 0) {
                this.arenaData.values.scoreboardNames[i] = `Points Needed to Win`;
            }
            this.arenaData.values.scoreboardTanks[i] = -1;
            this.arenaData.values.scoreboardScores[i] = mothership.MAXDRONES;
            this.arenaData.values.scoreboardSuffixes[i] = " Points";
        }
        this.arenaData.scoreboardAmount = length;
    }
    spawnPlayer(tank, client) {
        tank.positionData.values.y = 5000 * Math.random() - 5000;
        const xOffset = (Math.random() - 0.5) * 1250, yOffset = (Math.random() - 0.5) * 5000;
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
exports.default = BallArena;
