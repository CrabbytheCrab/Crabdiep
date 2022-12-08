"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Arena_1 = require("../../Native/Arena");
const AI_1 = require("../../Entity/AI");
const Camera_1 = require("../../Native/Camera");
const TankBody_1 = require("../../Entity/Tank/TankBody");
const Sandbox_1 = require("../Sandbox");
class SpikeboxArena extends Arena_1.default {
    constructor(game) {
        super(game);
        this.shapes = new Sandbox_1.SandboxShapeManager(this);
        this.updateBounds(2500, 2500);
        const spike = new TankBody_1.default(this.game, new Camera_1.CameraEntity(this.game), new AI_1.Inputs());
        spike.cameraEntity.cameraData.player = spike;
        spike.setTank(86);
        spike.styleData.flags &= ~4;
        spike.physicsData.flags |= 64;
        spike.damageReduction = 0;
        Object.defineProperty(spike, "damagePerTick", {
            get() {
                return 0;
            },
            set() { }
        });
        spike.physicsData.values.pushFactor = 24;
        spike.physicsData.absorbtionFactor = 0.0;
        spike.cameraEntity.setLevel(101);
        spike.styleData.color = 3;
    }
    tick(tick) {
        const arenaSize = Math.floor(25 * Math.sqrt(Math.max(this.game.clients.size, 1))) * 100;
        if (this.width !== arenaSize || this.height !== arenaSize)
            this.updateBounds(arenaSize, arenaSize);
        super.tick(tick);
    }
}
exports.default = SpikeboxArena;
