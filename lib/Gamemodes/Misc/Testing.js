"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Arena_1 = require("../../Native/Arena");
const Manager_1 = require("../../Entity/Shape/Manager");
const TankBody_1 = require("../../Entity/Tank/TankBody");
const Camera_1 = require("../../Native/Camera");
const AI_1 = require("../../Entity/AI");
const FallenSpike_1 = require("../../Entity/Misc/Boss/FallenSpike");
const FallenOverlord_1 = require("../../Entity/Boss/FallenOverlord");
class ZeroShapeManager extends Manager_1.default {
    get wantedShapes() {
        return 0;
    }
}
class TestingArena extends Arena_1.default {
    constructor(game) {
        super(game);
        this.shapes = new ZeroShapeManager(this);
        this.updateBounds(4000, 4000);
        this.arenaData.values.flags |= 16;
        setTimeout(() => {
            new FallenOverlord_1.default(game);
            new FallenSpike_1.default(game);
        }, 5000);
    }
    spawnPlayer(tank, client) {
        tank.setTank(-12);
    }
    spawnTestTank(id) {
        const testTank = new TankBody_1.default(this.game, new Camera_1.CameraEntity(this.game), new AI_1.Inputs());
        testTank.cameraEntity.cameraData.player = testTank;
        testTank.setTank(id);
        testTank.cameraEntity.setLevel(45);
        return testTank;
    }
}
exports.default = TestingArena;
