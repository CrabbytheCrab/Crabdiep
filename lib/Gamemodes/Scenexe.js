"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BlackHole_1 = require("../Entity/Misc/BlackHole");
const BlackHoleAlt_1 = require("../Entity/Misc/BlackHoleAlt");
const TeamEntity_1 = require("../Entity/Misc/TeamEntity");
const Decagon_1 = require("../Entity/Shape/Decagon");
const Heptagon_1 = require("../Entity/Shape/Heptagon");
const Hexagon_1 = require("../Entity/Shape/Hexagon");
const Manager_1 = require("../Entity/Shape/Manager");
const Nonagon_1 = require("../Entity/Shape/Nonagon");
const Octagon_1 = require("../Entity/Shape/Octagon");
const Peacekeeper_1 = require("../Entity/Shape/Peacekeeper");
const Pentagon_1 = require("../Entity/Shape/Pentagon");
const Square_1 = require("../Entity/Shape/Square");
const Triangle_1 = require("../Entity/Shape/Triangle");
const Arena_1 = require("../Native/Arena");
const arenaSize = 10000;
const baseWidth = 2230;
const domBaseSize = baseWidth / 2;
const CELL_SIZE = 635;
const GRID_SIZE = 40;
class CustomShapeManager extends Manager_1.default {
    spawnShape() {
        let shape;
        const rand2 = Math.random();
        const { x, y } = this.arena.findSpawnLocation();
        const rightX = this.arena.arenaData.values.rightX;
        const leftX = this.arena.arenaData.values.leftX;
        const rand = Math.random();
        if (Math.max(x, y) < rightX / 4 && Math.min(x, y) > leftX / 4) {
            if (rand < 0.02) {
                shape = new Peacekeeper_1.default(this.game);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
            else if (rand < 0.12) {
                shape = new Decagon_1.default(this.game, Math.random() <= 0.1, Math.random() < 0.005);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
            else if (rand < 0.27) {
                shape = new Nonagon_1.default(this.game, Math.random() <= 0.1, Math.random() < 0.005);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
            else if (rand < 0.42) {
                shape = new Octagon_1.default(this.game, Math.random() <= 0.1, Math.random() < 0.005);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
            else if (rand < 0.62) {
                shape = new Heptagon_1.default(this.game, Math.random() <= 0.1, Math.random() < 0.005);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
            else {
                shape = new Hexagon_1.default(this.game, Math.random() <= 0.1, Math.random() < 0.005);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
        }
        else {
            const rand = Math.random();
            if (rand < .05) {
                shape = new Hexagon_1.default(this.game, false, Math.random() < 0.0025);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
            else if (rand < .15) {
                shape = new Pentagon_1.default(this.game, Math.random() < 0.001, Math.random() < 0.0025);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
            else if (rand < .35) {
                shape = new Triangle_1.default(this.game, Math.random() < 0.0025);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
            else {
                shape = new Square_1.default(this.game, Math.random() < 0.0025);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
        }
        shape.scoreReward *= this.arena.shapeScoreRewardMultiplier;
        return shape;
    }
}
class Scenexe extends Arena_1.default {
    constructor(game) {
        super(game);
        this.timer = 600;
        this.celestial = new TeamEntity_1.TeamEntity(this.game, 11);
        this.shapes = new CustomShapeManager(this);
        this.maxtanklevel = 60;
        this.updateBounds(24000, 24000);
    }
    tick(tick) {
        super.tick(tick);
        this.timer--;
        if (this.timer <= 0) {
            const rand = Math.random();
            if (rand > 0.5) {
                new BlackHole_1.default(this.game, this.celestial);
            }
            else {
                new BlackHoleAlt_1.default(this.game, this.celestial, "crossroads", 3);
            }
            this.timer = 600;
        }
    }
    spawnPlayer(tank, client) {
        tank.positionData.values.y = arenaSize * Math.random() - arenaSize;
        const xOffset = (Math.random() - 0.5) * baseWidth;
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
exports.default = Scenexe;
