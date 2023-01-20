"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MazeWall_1 = require("../Entity/Misc/MazeWall");
const TeamBase_1 = require("../Entity/Misc/TeamBase");
const TeamEntity_1 = require("../Entity/Misc/TeamEntity");
const TeamNexus_1 = require("../Entity/Misc/TeamNexus");
const Manager_1 = require("../Entity/Shape/Manager");
const Pentagon_1 = require("../Entity/Shape/Pentagon");
const Square_1 = require("../Entity/Shape/Square");
const Triangle_1 = require("../Entity/Shape/Triangle");
const TankBody_1 = require("../Entity/Tank/TankBody");
const Arena_1 = require("../Native/Arena");
const Entity_1 = require("../Native/Entity");
const util_1 = require("../util");
const ARENA_WIDTH = 25000;
const ARENA_HEIGHT = 20000;
const BASE_WIDTH = 5000;
const BASE_HEIGHT = 2000;
const NEXUS_CONFIG = {
    health: 20000,
    shield: 5000,
    size: 160
};
class EventShapeManager extends Manager_1.default {
    constructor() {
        super(...arguments);
        this.shapeEntities = [];
    }
    spawnShape() {
        const r = Math.random();
        let shape;
        if (r > 0.8)
            shape = new Pentagon_1.default(this.game, Math.random() < 0.05, Math.random() < 0.001);
        else if (r > 0.5)
            shape = new Triangle_1.default(this.game, Math.random() < 0.01);
        else
            shape = new Square_1.default(this.game, Math.random() < 0.05);
        shape.positionData.x = Math.random() > 0.5 ? Math.random() * this.wantedShapes * 5 : -Math.random() * this.wantedShapes * 5;
        shape.positionData.y = Math.random() > 0.5 ? Math.random() * this.wantedShapes * 5 : -Math.random() * this.wantedShapes * 5;
        shape.relationsData.owner = shape.relationsData.team = this.arena;
        return shape;
    }
    get wantedShapes() {
        return 0;
    }
    tick() {
        for (let i = 0; i < this.wantedShapes; ++i) {
            if (!this.shapeEntities[i])
                this.shapeEntities.push(this.spawnShape());
            else if (!Entity_1.Entity.exists(this.shapeEntities[i]))
                (0, util_1.removeFast)(this.shapeEntities, i);
        }
    }
}
class EventArena extends Arena_1.default {
    constructor(game) {
        super(game);
        this.playerTeamMap = new Map();
        this.shapes = new EventShapeManager(this);
        this.updateBounds(ARENA_WIDTH, ARENA_HEIGHT);
        this.blueTeam = new TeamEntity_1.TeamEntity(this.game, 3);
        this.redTeam = new TeamEntity_1.TeamEntity(this.game, 4);
        this.blueTeamBaseLeft = new TeamBase_1.default(game, this.blueTeam, -ARENA_WIDTH / 2 + BASE_WIDTH / 2, -ARENA_HEIGHT / 2 + BASE_HEIGHT / 2, BASE_HEIGHT, BASE_WIDTH);
        this.blueTeamBaseRight = new TeamBase_1.default(game, this.blueTeam, ARENA_WIDTH / 2 - BASE_WIDTH / 2, -ARENA_HEIGHT / 2 + BASE_HEIGHT / 2, BASE_HEIGHT, BASE_WIDTH);
        this.redTeamBaseLeft = new TeamBase_1.default(game, this.redTeam, -ARENA_WIDTH / 2 + BASE_WIDTH / 2, ARENA_HEIGHT / 2 - BASE_HEIGHT / 2, BASE_HEIGHT, BASE_WIDTH);
        this.redTeamBaseRight = new TeamBase_1.default(game, this.redTeam, ARENA_WIDTH / 2 - BASE_WIDTH / 2, ARENA_HEIGHT / 2 - BASE_HEIGHT / 2, BASE_HEIGHT, BASE_WIDTH);
        new TeamBase_1.default(game, new TeamEntity_1.TeamEntity(this.game, 10), 0, 0, this.shapes.wantedShapes * 10, this.shapes.wantedShapes * 10, false);
        this.blueTeamNexus = new TeamNexus_1.default(game, 0, -ARENA_HEIGHT / 2 + NEXUS_CONFIG.size * 5, this.blueTeam, NEXUS_CONFIG, [this.blueTeamBaseLeft, this.blueTeamBaseRight]);
        this.redTeamNexus = new TeamNexus_1.default(game, 0, ARENA_HEIGHT / 2 - NEXUS_CONFIG.size * 5, this.redTeam, NEXUS_CONFIG, [this.redTeamBaseLeft, this.redTeamBaseRight]);
        new MazeWall_1.default(game, 0, -ARENA_HEIGHT / 2 + NEXUS_CONFIG.size * 20, 1000, 5000);
        new MazeWall_1.default(game, 0, ARENA_HEIGHT / 2 - NEXUS_CONFIG.size * 20, 1000, 5000);
        new MazeWall_1.default(game, -ARENA_WIDTH / 2 + 1500, 0, 10000, 3000);
        new MazeWall_1.default(game, ARENA_WIDTH / 2 - 1500, 0, 10000, 3000);
    }
    spawnPlayer(tank, client) {
        let team = this.playerTeamMap.get(client) || [this.blueTeamNexus, this.redTeamNexus][0 | Math.random() * 2];
        this.playerTeamMap.set(client, team);
        if (!Entity_1.Entity.exists(team)) {
            tank.setTank(-12);
            if (client.camera)
                client.camera.setLevel(0);
            tank.positionData.x = 0;
            tank.positionData.y = 0;
            return;
        }
        const xOffset = (Math.random() - 0.5) * BASE_WIDTH, yOffset = (Math.random() - 0.5) * BASE_HEIGHT;
        const base = team.bases[0 | Math.random() * 2];
        tank.relationsData.values.team = base.relationsData.values.team;
        tank.styleData.values.color = base.styleData.values.color;
        tank.positionData.values.x = base.positionData.values.x + xOffset;
        tank.positionData.values.y = base.positionData.values.y + yOffset;
        if (client.camera)
            client.camera.relationsData.team = tank.relationsData.values.team;
    }
    updateScoreboard() {
        const writeNexusHealth = (nexus, i) => {
            this.arenaData.scoreboardColors[i] = nexus.styleData.color;
            this.arenaData.scoreboardNames[i] = `${nexus.relationsData.team.teamName} Nexus`;
            this.arenaData.scoreboardTanks[i] = -1;
            this.arenaData.scoreboardScores[i] = nexus.healthData.health;
            this.arenaData.scoreboardSuffixes[i] = " HP";
        };
        const writePlayerCount = (count, team, i) => {
            this.arenaData.scoreboardColors[i] = team.teamData.teamColor;
            this.arenaData.scoreboardNames[i] = team.teamName;
            this.arenaData.scoreboardTanks[i] = -1;
            this.arenaData.scoreboardScores[i] = count;
            this.arenaData.scoreboardSuffixes[i] = " players";
        };
        const blueAlive = Entity_1.Entity.exists(this.blueTeamNexus);
        const redAlive = Entity_1.Entity.exists(this.redTeamNexus);
        if (blueAlive && redAlive) {
            if (this.blueTeamNexus.healthData.health > this.redTeamNexus.healthData.health) {
                writeNexusHealth(this.blueTeamNexus, 0);
                writeNexusHealth(this.redTeamNexus, 1);
            }
            else {
                writeNexusHealth(this.redTeamNexus, 0);
                writeNexusHealth(this.blueTeamNexus, 1);
            }
        }
        else if (blueAlive && !redAlive) {
            writeNexusHealth(this.blueTeamNexus, 0);
            let playerCount = 0;
            for (const client of this.game.clients) {
                if (!client.camera || !(client.camera.cameraData.player instanceof TankBody_1.default) || !Entity_1.Entity.exists(client.camera.cameraData.player))
                    continue;
                if (client.camera.cameraData.player.relationsData.team !== this.redTeam)
                    continue;
                ++playerCount;
                client.camera.cameraData.score += 10;
                client.camera.cameraData.player.styleData.opacity = 1;
            }
            if (!playerCount && this.state === 0)
                this.close();
            writePlayerCount(playerCount, this.redTeam, 1);
        }
        else if (!blueAlive && redAlive) {
            writeNexusHealth(this.redTeamNexus, 0);
            let playerCount = 0;
            for (const client of this.game.clients) {
                if (!client.camera || !(client.camera.cameraData.player instanceof TankBody_1.default) || !Entity_1.Entity.exists(client.camera.cameraData.player))
                    continue;
                if (client.camera.cameraData.player.relationsData.team !== this.blueTeam)
                    continue;
                ++playerCount;
                client.camera.cameraData.score += 10;
                client.camera.cameraData.player.styleData.opacity = 1;
            }
            if (!playerCount && this.state === 0)
                this.close();
            writePlayerCount(playerCount, this.blueTeam, 1);
        }
        else {
            let bluePlayers = 0, redPlayers = 0;
            for (const client of this.game.clients) {
                if (!client.camera || !(client.camera.cameraData.player instanceof TankBody_1.default) || !Entity_1.Entity.exists(client.camera.cameraData.player))
                    continue;
                if (client.camera.cameraData.player.relationsData.team === this.redTeam)
                    ++redPlayers;
                else if (client.camera.cameraData.player.relationsData.team === this.blueTeam)
                    ++bluePlayers;
                client.camera.cameraData.score += 10;
                client.camera.cameraData.player.styleData.opacity = 1;
            }
            if ((!bluePlayers || !redPlayers) && this.state === 0)
                this.close();
            if (bluePlayers > redPlayers) {
                writePlayerCount(bluePlayers, this.blueTeam, 0);
                writePlayerCount(redPlayers, this.redTeam, 1);
            }
            else {
                writePlayerCount(redPlayers, this.redTeam, 0);
                writePlayerCount(bluePlayers, this.blueTeam, 1);
            }
        }
        this.arenaData.scoreboardAmount = 2;
    }
    tick(tick) {
        this.shapes.tick();
        this.updateScoreboard();
        if (this.state === 2) {
            let players = 0;
            for (const client of this.game.clients) {
                if (client.camera
                    && Entity_1.Entity.exists(client.camera.cameraData.player)
                    && client.camera.cameraData.player instanceof TankBody_1.default)
                    ++players;
            }
            if (players)
                return;
            this.state = 3;
            setTimeout(() => {
                this.game.end();
            }, 5000);
            return;
        }
    }
}
exports.default = EventArena;
