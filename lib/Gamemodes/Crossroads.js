"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Arena_1 = require("../Native/Arena");
const Heptagon_1 = require("../Entity/Shape/Heptagon");
const Hexagon_1 = require("../Entity/Shape/Hexagon");
const Manager_1 = require("../Entity/Shape/Manager");
const Octagon_1 = require("../Entity/Shape/Octagon");
const Pentagon_1 = require("../Entity/Shape/Pentagon");
const Abyssling_1 = require("../Entity/Shape/Abyssling");
const TeamEntity_1 = require("../Entity/Misc/TeamEntity");
const BlackHoleAlt_1 = require("../Entity/Misc/BlackHoleAlt");
const Peacekeeper_1 = require("../Entity/Shape/Peacekeeper");
const Nonagon_1 = require("../Entity/Shape/Nonagon");
const Decagon_1 = require("../Entity/Shape/Decagon");
const CELL_SIZE = 500;
const GRID_SIZE = 40;
const ARENA_SIZE = CELL_SIZE * GRID_SIZE;
const SEED_AMOUNT = Math.floor(Math.random() * 30) + 30;
const TURN_CHANCE = 0.5;
const BRANCH_CHANCE = 0.5;
const TERMINATION_CHANCE = 0.3;
class CustomShapeManager extends Manager_1.default {
    spawnShape() {
        let shape;
        const rand2 = Math.random();
        const { x, y } = this.arena.findSpawnLocation();
        const rightX = this.arena.arenaData.values.rightX;
        const leftX = this.arena.arenaData.values.leftX;
        const rand = Math.random();
        if (Math.max(x, y) < rightX / 5 && Math.min(x, y) > leftX / 5) {
            if (rand < 0.15) {
                shape = new Decagon_1.default(this.game, Math.random() <= 0.1, Math.random() < 0.15);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
            else if (rand < 0.35) {
                shape = new Nonagon_1.default(this.game, Math.random() <= 0.2, Math.random() < 0.15);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
            else if (rand < 0.6) {
                shape = new Octagon_1.default(this.game, Math.random() <= 0.3, Math.random() < 0.15);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
            else {
                shape = new Heptagon_1.default(this.game, Math.random() <= 0.4, Math.random() < 0.15);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
        }
        else if (Math.max(x, y) < rightX / 3 && Math.min(x, y) > leftX / 3) {
            const rand = Math.random();
            if (rand < 0.05) {
                const isBig = true;
                shape = new Abyssling_1.default(this.game);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
            else {
                shape = new Hexagon_1.default(this.game, true, Math.random() < 0.05);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
        }
        else {
            const rand = Math.random();
            if (rand < 0.01) {
                shape = new Peacekeeper_1.default(this.game);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
            else if (rand < 0.06) {
                shape = new Octagon_1.default(this.game, Math.random() <= 0.01, Math.random() < 0.05);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
            else if (rand < 0.16) {
                shape = new Heptagon_1.default(this.game, Math.random() <= 0.025, Math.random() < 0.05);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
            else if (rand < 0.46) {
                shape = new Hexagon_1.default(this.game, Math.random() <= 0.075, Math.random() < 0.05);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
            else {
                shape = new Pentagon_1.default(this.game, Math.random() <= 0.3, Math.random() < 0.05);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
        }
        if (!shape.noMultiplier) {
            shape.scoreReward *= this.arena.shapeScoreRewardMultiplier;
            shape.healthData.maxHealth *= this.arena.shapeHeathMultiplier;
            shape.healthData.health *= this.arena.shapeHeathMultiplier;
        }
        return shape;
    }
}
const domBaseSize = 2230 / 2;
class Crossroads extends Arena_1.default {
    constructor(a) {
        super(a);
        this.SEEDS = [];
        this.WALLS = [];
        this.MAZE = new Uint8Array(GRID_SIZE * GRID_SIZE);
        this.shapes = new CustomShapeManager(this);
        this.celestial = new TeamEntity_1.TeamEntity(this.game, 11);
        this.timer = 900;
        this.shapeHeathMultiplier = 0.5;
        this.maxtanklevel = 60;
        this.shapeScoreRewardMultiplier = 0.75;
        this.updateBounds(ARENA_SIZE, ARENA_SIZE);
    }
    tick(tick) {
        super.tick(tick);
        this.timer--;
        if (this.timer <= 0) {
            new BlackHoleAlt_1.default(this.game, this.celestial, "scenexe", 3);
            this.timer = 900;
        }
    }
    spawnPlayer(tank, client) {
        if (client.camera) {
            if (client.camera.cameraData.isCelestial == true) {
                tank.relationsData.values.team = this.celestial;
                tank.definition.flags.isCelestial = true;
                tank.styleData.color = 11;
                client.camera.relationsData.team = tank.relationsData.values.team;
                tank.setTank(tank.currentTank);
            }
        }
    }
}
exports.default = Crossroads;
