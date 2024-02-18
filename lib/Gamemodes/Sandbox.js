"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SandboxShapeManager = void 0;
const Arena_1 = require("../Native/Arena");
const Manager_1 = require("../Entity/Shape/Manager");
class SandboxShapeManager extends Manager_1.default {
    get wantedShapes() {
        let i = 0;
        for (const client of this.game.clients) {
            if (client.camera)
                i += 1;
        }
        return Math.floor(i * 12.5);
    }
}
exports.SandboxShapeManager = SandboxShapeManager;
class SandboxArena extends Arena_1.default {
    constructor(game) {
        super(game);
        this.shapes = new SandboxShapeManager(this);
        this.updateBounds(10000, 10000);
        this.arenaData.values.flags |= 16;
    }
    tick(tick) {
        super.tick(tick);
    }
}
exports.default = SandboxArena;
