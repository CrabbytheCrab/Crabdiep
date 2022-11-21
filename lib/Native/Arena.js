"use strict";
/*
    DiepCustom - custom tank game server that shares diep.io's WebSocket protocol
    Copyright (C) 2022 ABCxFF (github.com/ABCxFF)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <https://www.gnu.org/licenses/>
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArenaState = void 0;
const Manager_1 = require("../Entity/Shape/Manager");
const TankBody_1 = require("../Entity/Tank/TankBody");
const ArenaCloser_1 = require("../Entity/Misc/ArenaCloser");
const Camera_1 = require("./Camera");
const FieldGroups_1 = require("./FieldGroups");
const Entity_1 = require("./Entity");
const Enums_1 = require("../Const/Enums");
const util_1 = require("../util");
const Guardian_1 = require("../Entity/Boss/Guardian");
const Summoner_1 = require("../Entity/Boss/Summoner");
const FallenOverlord_1 = require("../Entity/Boss/FallenOverlord");
const FallenBooster_1 = require("../Entity/Boss/FallenBooster");
const Defender_1 = require("../Entity/Boss/Defender");
const config_1 = require("../config");
var ArenaState;
(function (ArenaState) {
    /** Alive, open */
    ArenaState[ArenaState["OPEN"] = 0] = "OPEN";
    /** Game ended - someone won */
    ArenaState[ArenaState["OVER"] = 1] = "OVER";
    /** Lobby starts to close */
    ArenaState[ArenaState["CLOSING"] = 2] = "CLOSING";
    /** Lobby closed */
    ArenaState[ArenaState["CLOSED"] = 3] = "CLOSED";
})(ArenaState = exports.ArenaState || (exports.ArenaState = {}));
/**
 * The Arena Entity, sent to the client and also used for internal calculations.
 */
class ArenaEntity extends Entity_1.Entity {
    constructor(game) {
        super(game);
        /** Always existant arena field group. Present in all arenas. */
        this.arena = new FieldGroups_1.ArenaGroup(this);
        /** Always existant team field group. Present in all (or maybe just ffa) arenas. */
        this.team = new FieldGroups_1.TeamGroup(this);
        /** Whether or not the arena allows new players to spawn. */
        this.arenaState = ArenaState.OPEN;
        /** The current boss spawned into the game */
        this.boss = null;
        /** Controller of all shapes in the arena. */
        this.shapes = new Manager_1.default(this);
        /** Padding between arena size and maximum movement border. */
        this.ARENA_PADDING = 200;
        this.updateBounds(this.width = 22300, this.height = 22300);
        this.arena.values.topY = -this.height / 2;
        this.arena.values.bottomY = this.height / 2;
        this.arena.values.leftX = -this.width / 2;
        this.arena.values.rightX = this.width / 2;
        this.arena.values.GUI = Enums_1.GUIFlags.gameReadyStart;
        this.team.values.teamColor = Enums_1.Colors.Neutral;
    }
    /**
     * Finds a spawnable location on the map.
     */
    findSpawnLocation() {
        const pos = {
            x: ~~(Math.random() * this.width - this.width / 2),
            y: ~~(Math.random() * this.height - this.height / 2),
        };
        findSpawn: for (let i = 0; i < 20; ++i) {
            const entities = this.game.entities.collisionManager.retrieve(pos.x, pos.y, 1000, 1000);
            // Only spawn < 1000 units away from player, unless we can't find a place to spawn
            for (let len = entities.length; --len >= 0;) {
                if (entities[len] instanceof TankBody_1.default && (entities[len].position.values.x - pos.x) ** 2 + (entities[len].position.values.y - pos.y) ** 2 < 1000000) { // 1000^2
                    pos.x = ~~(Math.random() * this.width - this.width / 2);
                    pos.y = ~~(Math.random() * this.height - this.height / 2);
                    continue findSpawn;
                }
            }
            break;
        }
        return pos;
    }
    /**
     * Updates the scoreboard / leaderboard arena fields.
     */
    updateScoreboard(scoreboardPlayers) {
        scoreboardPlayers.sort((p1, p2) => p2.score.values.score - p1.score.values.score);
        const scoreboardCount = this.arena.scoreboardAmount = Math.min(scoreboardPlayers.length, 10);
        if (scoreboardCount) {
            const leader = scoreboardPlayers[0];
            this.arena.leaderX = leader.position.values.x;
            this.arena.leaderY = leader.position.values.y;
            this.arena.GUI |= Enums_1.GUIFlags.showLeaderArrow;
        }
        else if (this.arena.values.GUI & Enums_1.GUIFlags.showLeaderArrow)
            this.arena.GUI ^= Enums_1.GUIFlags.showLeaderArrow;
        let i;
        for (i = 0; i < scoreboardCount; ++i) {
            const player = scoreboardPlayers[i];
            /** @ts-ignore */
            if (player.style.values.color === Enums_1.Colors.Tank)
                this.arena.values.scoreboardColors[i] = Enums_1.Colors.ScoreboardBar;
            /** @ts-ignore */
            else
                this.arena.values.scoreboardColors[i] = player.style.values.color;
            /** @ts-ignore */
            this.arena.values.scoreboardNames[i] = player.name.values.name;
            /** @ts-ignore */
            this.arena.values.scoreboardScores[i] = player.score.values.score;
            /** @ts-ignore */ // _currentTank only since ts ignore
            this.arena.values.scoreboardTanks[i] = player._currentTank;
        }
    }
    /**
     * Updates the size of the map. It should be the only way to modify arena size.
     */
    updateBounds(arenaWidth, arenaHeight) {
        this.width = arenaWidth;
        this.height = arenaHeight;
        this.arena.topY = -arenaHeight / 2;
        this.arena.bottomY = arenaHeight / 2;
        this.arena.leftX = -arenaWidth / 2;
        this.arena.rightX = arenaWidth / 2;
    }
    /**
     * Allows the arena to decide how players are spawned into the game.
     */
    spawnPlayer(tank, client) {
        const { x, y } = this.findSpawnLocation();
        tank.position.values.x = x;
        tank.position.values.y = y;
    }
    /**
     * Closes the arena.
     */
    close() {
        for (const client of this.game.clients) {
            client.notify("Arena closed: No players can join", 0xFF0000, -1);
        }
        this.arenaState = ArenaState.CLOSING;
        this.arena.GUI |= Enums_1.GUIFlags.noJoining;
        setTimeout(() => {
            const acCount = Math.floor(Math.sqrt(this.width) / 10);
            const radius = this.width * Math.SQRT1_2 + 500;
            for (let i = 0; i < acCount; ++i) {
                const ac = new ArenaCloser_1.default(this.game);
                const angle = (i / acCount) * Math.PI * 2;
                ac.position.values.x = Math.cos(angle) * radius;
                ac.position.values.y = Math.sin(angle) * radius;
                ac.position.values.angle = angle + Math.PI;
            }
            (0, util_1.saveToLog)("Arena Closing", "Arena running at `" + this.game.gamemode + "` is now closing.", 0xFFE869);
        }, 5000);
    }
    /** Spawns the boss into the arena */
    spawnBoss() {
        const TBoss = [Guardian_1.default, Summoner_1.default, FallenOverlord_1.default, FallenBooster_1.default, Defender_1.default][~~(Math.random() * 5)];
        this.boss = new TBoss(this.game);
    }
    tick(tick) {
        this.shapes.tick();
        if (this.game.tick >= 1 && (this.game.tick % config_1.bossSpawningInterval) === 0 && !this.boss) {
            this.spawnBoss();
        }
        if (this.arenaState === ArenaState.CLOSED)
            return;
        const players = [];
        for (let id = 0; id <= this.game.entities.lastId; ++id) {
            const entity = this.game.entities.inner[id];
            if (Entity_1.Entity.exists(entity) && entity instanceof TankBody_1.default && entity.cameraEntity instanceof Camera_1.default && entity.cameraEntity.camera.values.player === entity)
                players.push(entity);
        }
        // Sorts them too DONT FORGET
        this.updateScoreboard(players);
        if (players.length === 0 && this.arenaState === ArenaState.CLOSING) {
            this.arenaState = ArenaState.CLOSED;
            setTimeout(() => {
                this.game.end();
            }, 10000);
            return;
        }
    }
}
exports.default = ArenaEntity;
