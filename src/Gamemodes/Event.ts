import Client from "../Client";
import { tps } from "../config";
import { ArenaFlags, Color, PhysicsFlags, ValidScoreboardIndex } from "../Const/Enums";
import TeamBase from "../Entity/Misc/TeamBase";
import { TeamEntity } from "../Entity/Misc/TeamEntity";
import Nexus, { NexusConfig } from "../Entity/Misc/TeamNexus";
import AbstractShape from "../Entity/Shape/AbstractShape";
import Crasher from "../Entity/Shape/Crasher";
import ShapeManager from "../Entity/Shape/Manager";
import Pentagon from "../Entity/Shape/Pentagon";
import { Sentry } from "../Entity/Shape/Sentry";
import Square from "../Entity/Shape/Square";
import Triangle from "../Entity/Shape/Triangle";
import WepPentagon from "../Entity/Shape/WepPentagon";
import WepSquare from "../Entity/Shape/WepSquare";
import WepTriangle from "../Entity/Shape/WepTriangle";
import TankBody from "../Entity/Tank/TankBody";
import GameServer from "../Game";
import ArenaEntity, { ArenaState } from "../Native/Arena";
import { Entity } from "../Native/Entity";
import { saveToLog } from "../util";

const ARENA_SIZE = 20000;
const BASE_SIZE = 2000;

const NEXUS_CONFIG: NexusConfig = {
    health: 20000,
    shield: 5000,
    size: 160
}

class EventShapeManager extends ShapeManager {
    private shapeEntities: AbstractShape[] = [];
    private weaponizesShapeEntities: AbstractShape[] = [];

    protected spawnShape(): AbstractShape {
        const TShape = [Pentagon, Triangle, Square][~~(Math.random() * 3)];
        const shape = new TShape(this.game, Math.random() < 0.05, Math.random() < 0.01);
        shape.positionData.x = Math.random() > 0.5 ? Math.random() * this.wantedShapes * 5 : -Math.random() * this.wantedShapes * 5;
        shape.positionData.y = Math.random() > 0.5 ? Math.random() * this.wantedShapes * 5 : -Math.random() * this.wantedShapes * 5;
        shape.relationsData.owner = shape.relationsData.team = this.arena;
        return shape;
    }

    private spawnWeaponizedShape() {
        const TShape = [WepPentagon, WepTriangle, WepSquare][~~(Math.random() * 3)];
        const shape = new TShape(this.game, false, false);
        const angle = Math.random() * 2 * Math.PI;
        const arena = this.arena as EventArena;
        do {
            shape.positionData.x = Math.random() > 0.5 ? this.arena.width / 2.5 * Math.cos(angle) : -this.arena.width / 3 * Math.cos(angle);
            shape.positionData.x += Math.random() > 0.5 ? Math.random() * Math.pow(this.wantedWeaponizedShapes, 2) : -Math.random() * Math.pow(this.wantedWeaponizedShapes, 2);
            shape.positionData.y = Math.random() > 0.5 ? this.arena.height / 2.5 * Math.sin(angle) : -this.arena.height / 3 * Math.sin(angle);
            shape.positionData.y += Math.random() > 0.5 ? Math.random() * Math.pow(this.wantedWeaponizedShapes, 2) : -Math.random() * Math.pow(this.wantedWeaponizedShapes, 2);
        } while(Math.sqrt(shape.getWorldPosition().distanceToSQ(arena.blueTeamNexus.getWorldPosition())) > 4000 && Math.sqrt(shape.getWorldPosition().distanceToSQ(arena.redTeamNexus.getWorldPosition())) > 4000);
        shape.relationsData.owner = shape.relationsData.team = this.arena;
        shape.scoreReward *= this.arena.shapeScoreRewardMultiplier;
        return shape;
    }

    protected get wantedShapes() {
        if(this.arena.state !== ArenaState.OPEN) return 0;
        return 100;
    }

    private get wantedWeaponizedShapes() {
        if(this.arena.state !== ArenaState.OPEN) return 0;
        return 50;
    }

    public tick() {
        this.shapeEntities = this.shapeEntities.filter(e => Entity.exists(e));
        
        for(let i = this.shapeEntities.length; i < this.wantedShapes; ++i) {
            this.shapeEntities.push(this.spawnShape());
        }

        this.weaponizesShapeEntities = this.weaponizesShapeEntities.filter(e => Entity.exists(e));

        for(let i = this.weaponizesShapeEntities.length; i < this.wantedWeaponizedShapes; ++i) {
            this.weaponizesShapeEntities.push(this.spawnWeaponizedShape());
        }
    }
}

export default class EventArena extends ArenaEntity {
    /** Blue Team entity */
    public blueTeamBase: TeamBase;
    /** Red Team entity */
    public redTeamBase: TeamBase;

    public blueTeamNexus: Nexus;
    public redTeamNexus: Nexus;

    public playerTeamMap: Map<Client, TeamBase> = new Map();

    private closingTick: number = 0;

    protected shapes: EventShapeManager = new EventShapeManager(this);

    constructor(game: GameServer) {
        super(game);
        this.updateBounds(ARENA_SIZE, ARENA_SIZE);
        this.blueTeamBase = new TeamBase(game, new TeamEntity(this.game, Color.TeamBlue), 0, -ARENA_SIZE / 2 + BASE_SIZE / 2, BASE_SIZE, BASE_SIZE, false);
        this.blueTeamNexus = new Nexus(game, this.blueTeamBase, NEXUS_CONFIG);
        this.redTeamBase = new TeamBase(game, new TeamEntity(this.game, Color.TeamRed), 0, ARENA_SIZE / 2 - BASE_SIZE / 2, BASE_SIZE, BASE_SIZE, false);
        this.redTeamNexus = new Nexus(game, this.redTeamBase, NEXUS_CONFIG);
    }

    public spawnPlayer(tank: TankBody, client: Client) {
        if(!this.playerTeamMap.get(client) && client.connectTick + tps * 120 > this.game.tick) {
            client.notify("Welcome player, destroy the enemy Nexus to win the game.", 0xFF00FF, 10000);
            setTimeout(() => client.notify("Press H to sacrifice yourself to your team's Nexus. You have to be close to it to perform the sacrifice.", 0xFF00FF, 10000), 4000);
            setTimeout(() => client.notify("Your sacrifice will result in the Nexus regenerating it's shield (2x) and health (0.1x) according to your health.", 0xFF00FF, 10000), 8000);
        }

        tank.positionData.values.y = ARENA_SIZE * Math.random() - ARENA_SIZE;

        const xOffset = (Math.random() - 0.5) * BASE_SIZE,
            yOffset = (Math.random() - 0.5) * BASE_SIZE;

        const base = this.playerTeamMap.get(client) || [this.blueTeamBase, this.redTeamBase][0|Math.random()*2];
        tank.relationsData.values.team = base.relationsData.values.team;
        tank.styleData.values.color = base.styleData.values.color;
        tank.positionData.values.x = base.positionData.values.x + xOffset;
        tank.positionData.values.y = base.positionData.values.y + yOffset;
        this.playerTeamMap.set(client, base);

        if (client.camera) client.camera.relationsData.team = tank.relationsData.values.team;
    }

    public close(): void {
        for (const client of this.game.clients) {
			client.notify("Arena closed: No players can join", 0xFF0000, -1);
            client.notify("Teams disabled, you are now on your own.");
		}

		this.state = ArenaState.CLOSING;
		this.arenaData.flags |= ArenaFlags.noJoining;
        saveToLog("Arena Closing", "Arena running at `" + this.game.gamemode + "` is now closing.", 0xFFE869);

        this.closingTick = this.game.tick + tps * 60;

        this.blueTeamBase.delete();
        this.blueTeamNexus.destroy();
        this.redTeamBase.delete();
        this.redTeamNexus.destroy();

        for(const client of this.game.clients) {
            if(!(client.camera?.cameraData.player instanceof TankBody)) continue;
            client.camera.cameraData.player.relationsData.team = client.camera;
            client.camera.cameraData.player.relationsData.owner = client.camera;
        }
    }

    protected updateScoreboard(scoreboardPlayers: TankBody[]): void {
        if(this.state === ArenaState.OPEN) {
            const scoreboard = [];
            if(this.blueTeamNexus.healthData.health > this.redTeamNexus.healthData.health) {
                scoreboard.push(this.blueTeamNexus);
                scoreboard.push(this.redTeamNexus);
            } else {
                scoreboard.push(this.redTeamNexus);
                scoreboard.push(this.blueTeamNexus);
            }
            for(let i = 0; i < scoreboard.length + 1; ++i) {
                const nexus = scoreboard.shift() as Nexus;
                this.arenaData.scoreboardColors[i as ValidScoreboardIndex] = nexus.styleData.color;
                this.arenaData.scoreboardNames[i as ValidScoreboardIndex] = `${(nexus.relationsData.team as TeamEntity).teamName}'s Nexus`;
                this.arenaData.scoreboardTanks[i as ValidScoreboardIndex] = -1;
                this.arenaData.scoreboardScores[i as ValidScoreboardIndex] = nexus.healthData.health;
                this.arenaData.scoreboardSuffixes[i as ValidScoreboardIndex] = " HP";
            }
            this.arenaData.scoreboardAmount = 2;
            return;
        }
        else super.updateScoreboard(scoreboardPlayers);
        
        for(const client of this.game.clients) {
            if(!client.camera) continue;
            if(client.camera.cameraData.player instanceof TankBody) {
                client.camera.cameraData.score += 10;
                if(this.game.tick > this.closingTick) 
                    client.camera.cameraData.player.healthData.health -= client.camera.cameraData.player.healthData.maxHealth * 0.01;
                continue;
            }
            client.camera.spectatee = scoreboardPlayers[0];
        }
    }

    public tick(tick: number): void {
        if (this.state === ArenaState.CLOSING) {
            this.shapes.killAll();
            if(this.boss) this.boss.destroy();
            this.updateBounds(this.width * 0.998, this.height * 0.998);
        }

        super.tick(tick);
    }
}