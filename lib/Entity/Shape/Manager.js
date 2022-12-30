"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Crasher_1 = require("./Crasher");
const Pentagon_1 = require("./Pentagon");
const Triangle_1 = require("./Triangle");
const Square_1 = require("./Square");
const AbstractShape_1 = require("./AbstractShape");
const Sentry_1 = require("./Sentry");
const WepTriangle_1 = require("./WepTriangle");
const WepSquare_1 = require("./WepSquare");
const WepPentagon_1 = require("./WepPentagon");
class ShapeManager {
    constructor(arena) {
        this.sentrychance = 0.1;
        this.weaponchance = 0.04;
        this.alphachance = 0.5;
        this.arena = arena;
        this.game = arena.game;
    }
    spawnShape() {
        let shape;
        const rand2 = Math.random();
        const { x, y } = this.arena.findSpawnLocation();
        const rightX = this.arena.arenaData.values.rightX;
        const leftX = this.arena.arenaData.values.leftX;
        if (Math.max(x, y) < rightX / 10 && Math.min(x, y) > leftX / 10) {
            if (rand2 < this.weaponchance * 1.25) {
                if (rand2 < this.alphachance && this.game.pentalord == false) {
                    shape = new WepPentagon_1.default(this.game, true);
                    shape.positionData.values.x = x;
                    shape.positionData.values.y = y;
                    shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
                    this.game.pentalord = true;
                }
                else {
                    shape = new WepPentagon_1.default(this.game, false);
                    shape.positionData.values.x = x;
                    shape.positionData.values.y = y;
                    shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
                }
            }
            else {
                shape = new Pentagon_1.default(this.game, Math.random() <= 0.05);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
        }
        else if (Math.max(x, y) < rightX / 5 && Math.min(x, y) > leftX / 5) {
            const rand = Math.random();
            if (rand < this.sentrychance) {
                const isBig = true;
                shape = new Sentry_1.Sentry(this.game, isBig);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
            else {
                const isBig = Math.random() < .2;
                shape = new Crasher_1.default(this.game, isBig);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
        }
        else {
            const rand = Math.random();
            if (rand < .04) {
                if (rand2 < this.weaponchance) {
                    shape = new WepPentagon_1.default(this.game);
                    shape.positionData.values.x = x;
                    shape.positionData.values.y = y;
                    shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
                }
                else {
                    shape = new Pentagon_1.default(this.game);
                    shape.positionData.values.x = x;
                    shape.positionData.values.y = y;
                    shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
                }
            }
            else if (rand < .20) {
                if (rand2 < this.weaponchance) {
                    shape = new WepTriangle_1.default(this.game);
                    shape.positionData.values.x = x;
                    shape.positionData.values.y = y;
                    shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
                }
                else {
                    shape = new Triangle_1.default(this.game);
                    shape.positionData.values.x = x;
                    shape.positionData.values.y = y;
                    shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
                }
            }
            else {
                if (rand2 < this.weaponchance) {
                    shape = new WepSquare_1.default(this.game);
                    shape.positionData.values.x = x;
                    shape.positionData.values.y = y;
                    shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
                }
                else {
                    shape = new Square_1.default(this.game);
                    shape.positionData.values.x = x;
                    shape.positionData.values.y = y;
                    shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
                }
            }
        }
        shape.scoreReward *= this.arena.shapeScoreRewardMultiplier;
        return shape;
    }
    killAll() {
        const entities = this.game.entities.inner;
        const lastId = this.game.entities.lastId;
        for (let id = 0; id <= lastId; ++id) {
            const entity = entities[id];
            if (entity instanceof AbstractShape_1.default)
                entity.delete();
        }
    }
    get wantedShapes() {
        return 1000;
    }
    tick() {
        const wantedShapes = this.wantedShapes;
        let count = 0;
        for (let id = 1; id <= this.game.entities.lastId; ++id) {
            const entity = this.game.entities.inner[id];
            if (entity instanceof AbstractShape_1.default) {
                count += 1;
            }
        }
        while (count < wantedShapes) {
            this.spawnShape();
            count += 1;
        }
    }
}
exports.default = ShapeManager;
