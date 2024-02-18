"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractBoss_1 = require("../Entity/Boss/AbstractBoss");
const Basher_1 = require("../Entity/Boss/Basher");
const Beholder_1 = require("../Entity/Boss/Beholder");
const Defender_1 = require("../Entity/Boss/Defender");
const FallenBooster_1 = require("../Entity/Boss/FallenBooster");
const FallenOverlord_1 = require("../Entity/Boss/FallenOverlord");
const FallenPuker_1 = require("../Entity/Boss/FallenPuker");
const Guardian_1 = require("../Entity/Boss/Guardian");
const Protector_1 = require("../Entity/Boss/Protector");
const Summoner_1 = require("../Entity/Boss/Summoner");
const Titan_1 = require("../Entity/Boss/Titan");
const TeamEntity_1 = require("../Entity/Misc/TeamEntity");
const AbstractShape_1 = require("../Entity/Shape/AbstractShape");
const Abyssling_1 = require("../Entity/Shape/Abyssling");
const Peacekeeper_1 = require("../Entity/Shape/Peacekeeper");
const Sentry_1 = require("../Entity/Shape/Sentry");
const WepPentagon_1 = require("../Entity/Shape/WepPentagon");
const Arena_1 = require("../Native/Arena");
const Entity_1 = require("../Native/Entity");
const Sandbox_1 = require("./Sandbox");
const arenaSize = 10000;
const baseWidth = 3000;
const domBaseSize = baseWidth / 2;
const CELL_SIZE = 635;
const GRID_SIZE = 40;
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
class BossBash extends Arena_1.default {
    constructor(game) {
        super(game);
        this.shapes = new CustomShapeManager(this);
        this.playerTeamMap = new Map();
        this.waveEntities = [];
        this.nonwaveEntities = [];
        this.updateBounds(8000, 8000);
        this.nextwave = false;
        this.wave = 0;
        this.hpMultiplier = 0.5;
        this.difficulty = 1;
        this.waveDuration = 0;
        this.clearDuration = 0;
        this.isCleared = true;
    }
    Boss() {
        const rand = Math.random();
        if (rand < .1 * (this.difficulty / 10)) {
            const TBoss = [Titan_1.default, Basher_1.default, Summoner_1.default, WepPentagon_1.default][~~(Math.random() * 4)];
            if (TBoss == WepPentagon_1.default) {
                this.shape = new WepPentagon_1.default(this.game, true);
                this.shape.positionData.values.x = this.findSpawnLocation().x;
                this.shape.positionData.values.y = this.findSpawnLocation().y;
                this.shape.healthData.maxHealth *= this.difficulty;
                this.shape.healthData.health *= this.difficulty;
                this.shape.styleData.flags |= 8;
                this.shape.physicsData.flags |= 2;
                this.waveEntities.push(this.shape);
            }
            else {
                this.shape = new TBoss(this.game);
                this.shape.positionData.values.x = this.findSpawnLocation().x;
                this.shape.positionData.values.y = this.findSpawnLocation().y;
                this.shape.healthData.maxHealth *= this.difficulty;
                this.shape.healthData.health *= this.difficulty;
                this.shape.styleData.flags |= 8;
                this.shape.physicsData.flags |= 2;
                this.waveEntities.push(this.shape);
            }
        }
        else {
            const TBoss = [Guardian_1.default, Protector_1.default, Beholder_1.default, Defender_1.default, FallenBooster_1.default, FallenPuker_1.default, FallenOverlord_1.default, Abyssling_1.default][~~(Math.random() * 7)];
            this.shape = new TBoss(this.game);
            this.shape.positionData.values.x = this.findSpawnLocation().x;
            this.shape.positionData.values.y = this.findSpawnLocation().y;
            this.shape.relationsData.team = this.game.arena;
            this.shape.healthData.maxHealth *= this.difficulty;
            this.shape.healthData.health *= this.difficulty;
            this.shape.styleData.flags |= 8;
            this.shape.physicsData.flags |= 2;
            this.waveEntities.push(this.shape);
        }
    }
    Shape() {
        const rand = Math.random();
        if (rand < .05 * (this.difficulty / 10)) {
            const TShape = [Peacekeeper_1.default, Peacekeeper_1.default][~~(Math.random() * 2)];
            this.shape = new TShape(this.game);
            this.shape.positionData.values.x = this.findSpawnLocation().x;
            this.shape.positionData.values.y = this.findSpawnLocation().y;
            if (this.shape instanceof Peacekeeper_1.default) {
                this.shape.healthData.maxHealth *= 3 * this.difficulty;
                this.shape.healthData.health *= 3 * this.difficulty;
                this.nonwaveEntities.push(this.shape);
            }
        }
        else {
            const TShape = [Sentry_1.Sentry, Sentry_1.Sentry][~~(Math.random() * 2)];
            this.shape = new TShape(this.game);
            this.shape.positionData.values.x = this.findSpawnLocation().x;
            this.shape.positionData.values.y = this.findSpawnLocation().y;
            this.shape.healthData.maxHealth *= 1.5 * this.difficulty;
            this.shape.healthData.health *= 1.5 * this.difficulty;
            this.nonwaveEntities.push(this.shape);
        }
    }
    updateScoreboard(scoreboardPlayers) {
        this.waveEntities.sort((m1, m2) => (m2.healthData.values.health / m2.healthData.values.maxHealth) - (m1.healthData.values.health / m1.healthData.values.maxHealth));
        const length = Math.min(10, this.waveEntities.length);
        const leader = this.waveEntities[0];
        if (leader) {
            if (leader instanceof AbstractBoss_1.default || leader instanceof AbstractShape_1.default) {
                this.arenaData.leaderX = leader.positionData.values.x;
                this.arenaData.leaderY = leader.positionData.values.y;
                this.arenaData.flags |= 2;
            }
        }
        else if (this.arenaData.values.flags & 2)
            this.arenaData.flags ^= 2;
        for (let i = 0; i < length; ++i) {
            const mothership = this.waveEntities[i];
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
            if (mothership instanceof AbstractBoss_1.default || mothership instanceof AbstractShape_1.default)
                this.arenaData.values.scoreboardNames[i] = isTeamATeam ? team.teamName : `${mothership.nameData.name}`;
            this.arenaData.values.scoreboardTanks[i] = -1;
            this.arenaData.values.scoreboardScores[i] = mothership.healthData.values.health / mothership.healthData.values.maxHealth * 100;
            this.arenaData.values.scoreboardSuffixes[i] = "% HP";
        }
        this.arenaData.scoreboardAmount = length;
    }
    tick(tick) {
        super.tick(tick);
        if (this.nextwave) {
            this.nextwave = false;
            for (let i = 0; i < this.difficulty; ++i) {
                this.Boss();
            }
            for (let i = 0; i < this.difficulty * 3; ++i) {
                this.Shape();
            }
        }
        for (let i = this.waveEntities.length; i-- > 0;) {
            const mot = this.waveEntities[i];
            if (!Entity_1.Entity.exists(mot)) {
                const pop = this.waveEntities.pop();
                if (pop && i < this.waveEntities.length)
                    this.waveEntities[i] = pop;
            }
        }
        for (let i = this.nonwaveEntities.length; i-- > 0;) {
            const mot = this.nonwaveEntities[i];
            if (this.isCleared)
                mot.destroy(true);
            if (!Entity_1.Entity.exists(mot)) {
                const pop = this.nonwaveEntities.pop();
                if (pop && i < this.nonwaveEntities.length)
                    this.nonwaveEntities[i] = pop;
            }
        }
        if (this.isCleared) {
            this.clearDuration++;
            if (this.clearDuration >= 300) {
                this.game.broadcast()
                    .u8(3);
                this.wave++;
                let message = `Wave ${this.wave} is starting!`;
                this.game.broadcast().u8(3).stringNT(message).u32(0xFF0000).float(10000).stringNT("").send();
                this.clearDuration = 0;
                if (this.difficulty >= 10) {
                    this.difficulty = 10;
                    this.hpMultiplier += (0.25 * (this.hpMultiplier / 4));
                }
                else {
                    if (this.wave > 1)
                        this.hpMultiplier += (0.25 * (this.hpMultiplier / 8));
                    if (this.wave > 1)
                        this.difficulty += (0.75 * (this.wave / 8));
                }
                for (let i = 0; i < this.difficulty; ++i) {
                    this.Boss();
                }
                if (this.wave < 10) {
                    for (let i = 0; i < this.difficulty * 2; ++i) {
                        this.Shape();
                    }
                }
                this.isCleared = false;
            }
        }
        if (!this.isCleared) {
            if (this.waveEntities.length <= 0) {
                this.game.broadcast()
                    .u8(3);
                let message = `Wave ${this.wave} has been completed!`;
                this.game.broadcast().u8(3).stringNT(message).u32(0x00FF00).float(10000).stringNT("").send();
                this.isCleared = true;
            }
        }
    }
}
exports.default = BossBash;
