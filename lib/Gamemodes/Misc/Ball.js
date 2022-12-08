"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Arena_1 = require("../../Native/Arena");
const Object_1 = require("../../Entity/Object");
const Pentagon_1 = require("../../Entity/Shape/Pentagon");
const FieldGroups_1 = require("../../Native/FieldGroups");
const Sandbox_1 = require("../Sandbox");
class CustomShapeManager extends Sandbox_1.SandboxShapeManager {
    spawnShape() {
        const { x, y } = this.arena.findSpawnLocation();
        const penta = new Pentagon_1.default(this.game, Math.random() < 0.25, Math.random() < 0.1);
        penta.positionData.values.x = Math.sign(x) * (Math.abs(x) - 200);
        penta.positionData.values.y = Math.sign(y) * (Math.abs(y) - 200);
        penta.relationsData.values.owner = penta.relationsData.values.team = this.arena;
        return penta;
    }
}
class BallArena extends Arena_1.default {
    constructor(game) {
        super(game);
        this.shapes = new CustomShapeManager(this);
        this.arenaData.values.flags |= 16;
        this.updateBounds(2500, 2500);
        const ball = new Object_1.default(game);
        ball.nameData = new FieldGroups_1.NameGroup(ball);
        ball.nameData.values.name = "im pacman";
        ball.physicsData.values.sides = 1;
        ball.styleData.values.color = 13;
        ball.physicsData.values.size = 100;
        ball.physicsData.values.absorbtionFactor = 10;
        ball.physicsData.values.flags |= 64 | 8;
        ball.relationsData.values.team = ball;
    }
}
exports.default = BallArena;
