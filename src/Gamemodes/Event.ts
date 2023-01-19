import Client from "../Client";
import { DevTank } from "../Const/DevTankDefinitions";
import { Color, ValidScoreboardIndex } from "../Const/Enums";
import MazeWall from "../Entity/Misc/MazeWall";
import TeamBase from "../Entity/Misc/TeamBase";
import { TeamEntity } from "../Entity/Misc/TeamEntity";
import Nexus, { NexusConfig } from "../Entity/Misc/TeamNexus";
import AbstractShape from "../Entity/Shape/AbstractShape";
import ShapeManager from "../Entity/Shape/Manager";
import Pentagon from "../Entity/Shape/Pentagon";
import Square from "../Entity/Shape/Square";
import Triangle from "../Entity/Shape/Triangle";
import TankBody from "../Entity/Tank/TankBody";
import GameServer from "../Game";
import ArenaEntity, { ArenaState } from "../Native/Arena";
import { Entity } from "../Native/Entity";
import { removeFast } from "../util";

const ARENA_WIDTH = 25000;
const ARENA_HEIGHT = 20000;
const BASE_WIDTH = 5000;
const BASE_HEIGHT = 2000;

const NEXUS_CONFIG: NexusConfig = {
    health: 20000,
    shield: 5000,
    size: 160
}

class EventShapeManager extends ShapeManager {
    private shapeEntities: AbstractShape[] = [];
    private lowerShapeEntities: AbstractShape[] = [];

    protected spawnShape(): AbstractShape {
        const r = Math.random();
        let shape;
        if(r > 0.8) shape = new Pentagon(this.game, Math.random() > 0.97);
        else if(r > 0.5) shape = new Triangle(this.game);
        else shape = new Square(this.game);
        shape.positionData.x = Math.random() > 0.5 ? Math.random() * this.wantedShapes * 5 : -Math.random() * this.wantedShapes * 5;
        shape.positionData.y = Math.random() > 0.5 ? Math.random() * this.wantedShapes * 5 : -Math.random() * this.wantedShapes * 5;
        shape.relationsData.owner = shape.relationsData.team = this.arena;
        return shape;
    }

    protected spawnLowerShape(): AbstractShape {
        const shape = new [Square, Triangle][0 | Math.random() * 2](this.game, false);
        shape.positionData.x = Math.random() > 0.5 ? Math.random() * ARENA_WIDTH / 1.5 : -Math.random() * ARENA_WIDTH / 1.5;
        shape.positionData.y = Math.random() > 0.5 ? Math.random() * ARENA_HEIGHT / 1.5 : -Math.random() * ARENA_HEIGHT / 1.5;
        shape.relationsData.owner = shape.relationsData.team = this.arena;
        return shape;
    }

    public get wantedShapes() {
        return 250;
    }

    public get wantedLowerShapes() {
        return 250 + this.game.clients.size * 10;
    }

    public tick() {
        for(let i = 0; i < this.wantedShapes; ++i) {
            if(!this.shapeEntities[i]) this.shapeEntities.push(this.spawnShape());
            else if(!Entity.exists(this.shapeEntities[i])) removeFast(this.shapeEntities, i); // deal with this next tick :P
        }

        for(let i = 0; i < this.wantedLowerShapes; ++i) {
            if(!this.lowerShapeEntities[i]) this.lowerShapeEntities.push(this.spawnLowerShape());
            else if(!Entity.exists(this.lowerShapeEntities[i])) removeFast(this.lowerShapeEntities, i); // deal with this next tick :P
        }
    }
}

export default class EventArena extends ArenaEntity {
    public blueTeamBaseLeft: TeamBase;
    public blueTeamBaseRight: TeamBase;
    public redTeamBaseLeft: TeamBase;
    public redTeamBaseRight: TeamBase;
    public blueTeamNexus: Nexus;
    public redTeamNexus: Nexus;
    public playerTeamMap: Map<Client, Nexus> = new Map();
    protected shapes: EventShapeManager = new EventShapeManager(this);
    public blueTeam: TeamEntity;
    public redTeam: TeamEntity;

    constructor(game: GameServer) {
        super(game);
        this.updateBounds(ARENA_WIDTH, ARENA_HEIGHT);

        this.blueTeam = new TeamEntity(this.game, Color.TeamBlue);
        this.redTeam = new TeamEntity(this.game, Color.TeamRed);

        this.blueTeamBaseLeft = new TeamBase(
            game, 
            this.blueTeam,
            -ARENA_WIDTH / 2 + BASE_WIDTH / 2,
            -ARENA_HEIGHT / 2 + BASE_HEIGHT / 2,
            BASE_HEIGHT,
            BASE_WIDTH
        );

        this.blueTeamBaseRight = new TeamBase(
            game,
            this.blueTeam,
            ARENA_WIDTH / 2 - BASE_WIDTH / 2,
            -ARENA_HEIGHT / 2 + BASE_HEIGHT / 2,
            BASE_HEIGHT,
            BASE_WIDTH
        );

        this.redTeamBaseLeft = new TeamBase(
            game,
            this.redTeam,
            -ARENA_WIDTH / 2 + BASE_WIDTH / 2,
            ARENA_HEIGHT / 2 - BASE_HEIGHT / 2,
            BASE_HEIGHT,
            BASE_WIDTH
        );

        this.redTeamBaseRight = new TeamBase(
            game,
            this.redTeam,
            ARENA_WIDTH / 2 - BASE_WIDTH / 2,
            ARENA_HEIGHT / 2 - BASE_HEIGHT / 2,
            BASE_HEIGHT,
            BASE_WIDTH
        );

        new TeamBase(
            game,
            new TeamEntity(this.game, Color.EnemyPentagon),
            0,
            0,
            this.shapes.wantedShapes * 10,
            this.shapes.wantedShapes * 10,
            false
        );

        this.blueTeamNexus = new Nexus(
            game,
            0,
            -ARENA_HEIGHT / 2 + NEXUS_CONFIG.size * 5,
            this.blueTeam,
            NEXUS_CONFIG,
            [this.blueTeamBaseLeft, this.blueTeamBaseRight]
        );

        this.redTeamNexus = new Nexus(
            game,
            0,
            ARENA_HEIGHT / 2 - NEXUS_CONFIG.size * 5,
            this.redTeam,
            NEXUS_CONFIG,
            [this.redTeamBaseLeft, this.redTeamBaseRight]
        );

        new MazeWall(game, 0, -ARENA_HEIGHT / 2 + NEXUS_CONFIG.size * 20, 1000, 5000);
        new MazeWall(game, 0, ARENA_HEIGHT / 2 - NEXUS_CONFIG.size * 20, 1000, 5000);
        new MazeWall(game, -ARENA_WIDTH / 2 + 1500, 0, 10000, 3000);
        new MazeWall(game, ARENA_WIDTH / 2 - 1500, 0, 10000, 3000);
    }

    public spawnPlayer(tank: TankBody, client: Client) {
        let team = this.playerTeamMap.get(client) || [this.blueTeamNexus, this.redTeamNexus][0 | Math.random() * 2];
        this.playerTeamMap.set(client, team);

        if(!Entity.exists(team)) {
            tank.setTank(DevTank.Spectator);
            if(client.camera) client.camera.setLevel(0);
            tank.positionData.x = 0;
            tank.positionData.y = 0;
            return;
        }

        const xOffset = (Math.random() - 0.5) * BASE_WIDTH,
            yOffset = (Math.random() - 0.5) * BASE_HEIGHT;
                
        const base = team.bases[0 | Math.random() * 2];
        tank.relationsData.values.team = base.relationsData.values.team;
        tank.styleData.values.color = base.styleData.values.color;
        tank.positionData.values.x = base.positionData.values.x + xOffset;
        tank.positionData.values.y = base.positionData.values.y + yOffset;
        if (client.camera) client.camera.relationsData.team = tank.relationsData.values.team;
    }

    protected updateScoreboard(): void {
        const writeNexusHealth = (nexus: Nexus, i: ValidScoreboardIndex) => {
            this.arenaData.scoreboardColors[i] = nexus.styleData.color;
            this.arenaData.scoreboardNames[i] = `${(nexus.relationsData.team as TeamEntity).teamName} Nexus`;
            this.arenaData.scoreboardTanks[i] = -1;
            this.arenaData.scoreboardScores[i] = nexus.healthData.health;
            this.arenaData.scoreboardSuffixes[i] = " HP";
        }
        
        const writePlayerCount = (count: number, team: TeamEntity, i: ValidScoreboardIndex) => {
            this.arenaData.scoreboardColors[i] = team.teamData.teamColor;
            this.arenaData.scoreboardNames[i] = team.teamName;
            this.arenaData.scoreboardTanks[i] = -1;
            this.arenaData.scoreboardScores[i] = count;
            this.arenaData.scoreboardSuffixes[i] = " players";
        }

        const blueAlive = Entity.exists(this.blueTeamNexus);
        const redAlive = Entity.exists(this.redTeamNexus);
        if(blueAlive && redAlive) {
            if(this.blueTeamNexus.healthData.health > this.redTeamNexus.healthData.health) {
                writeNexusHealth(this.blueTeamNexus, 0);
                writeNexusHealth(this.redTeamNexus, 1);
            } else {
                writeNexusHealth(this.redTeamNexus, 0);
                writeNexusHealth(this.blueTeamNexus, 1);
            }
        } else if(blueAlive && !redAlive) {
            writeNexusHealth(this.blueTeamNexus, 0);
            let playerCount = 0;
            for(const client of this.game.clients) {
                if(!client.camera || !(client.camera.cameraData.player instanceof TankBody) || !Entity.exists(client.camera.cameraData.player)) continue;
                if(client.camera.cameraData.player.relationsData.team !== this.redTeam) continue;
                ++playerCount;
                client.camera.cameraData.score += 10;
                client.camera.cameraData.player.styleData.opacity = 1;
            }
            if(!playerCount && this.state === ArenaState.OPEN) this.close();
            writePlayerCount(playerCount, this.redTeam, 1);
        } else if(!blueAlive && redAlive) {
            writeNexusHealth(this.redTeamNexus, 0);
            let playerCount = 0;
            for(const client of this.game.clients) {
                if(!client.camera || !(client.camera.cameraData.player instanceof TankBody) || !Entity.exists(client.camera.cameraData.player)) continue;
                if(client.camera.cameraData.player.relationsData.team !== this.blueTeam) continue;
                ++playerCount;
                client.camera.cameraData.score += 10;
                client.camera.cameraData.player.styleData.opacity = 1;
            }
            if(!playerCount && this.state === ArenaState.OPEN) this.close();
            writePlayerCount(playerCount, this.blueTeam, 1);
        } else {
            let bluePlayers = 0, redPlayers = 0;
            for(const client of this.game.clients) {
                if(!client.camera || !(client.camera.cameraData.player instanceof TankBody) || !Entity.exists(client.camera.cameraData.player)) continue;
                if(client.camera.cameraData.player.relationsData.team === this.redTeam) ++redPlayers;              
                else if(client.camera.cameraData.player.relationsData.team === this.blueTeam) ++bluePlayers;
                client.camera.cameraData.score += 10;
                client.camera.cameraData.player.styleData.opacity = 1;
            }
            if((!bluePlayers || !redPlayers) && this.state === ArenaState.OPEN) this.close();
            if(bluePlayers > redPlayers) {
                writePlayerCount(bluePlayers, this.blueTeam, 0);
                writePlayerCount(redPlayers, this.redTeam, 1);
            } else {
                writePlayerCount(redPlayers, this.redTeam, 0);
                writePlayerCount(bluePlayers, this.blueTeam, 1);
            }
        }
        this.arenaData.scoreboardAmount = 2;
    }

    public tick(tick: number): void {
        this.shapes.tick();
        this.updateScoreboard();
        if (this.state === ArenaState.CLOSING) {
            let players = 0;
            for(const client of this.game.clients) {
                if(client.camera
                    && Entity.exists(client.camera.cameraData.player) 
                    && client.camera.cameraData.player instanceof TankBody
                    && client.camera.cameraData.player.physicsData.sides > 0
                ) ++players;
            }
            if(players) return;

			this.state = ArenaState.CLOSED;

			setTimeout(() => {
				this.game.end();
			}, 5000);
			return;
		}
    }
}