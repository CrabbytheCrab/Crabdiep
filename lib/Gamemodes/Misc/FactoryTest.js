"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Arena_1 = require("../../Native/Arena");
const AI_1 = require("../../Entity/AI");
const Camera_1 = require("../../Native/Camera");
const TankBody_1 = require("../../Entity/Tank/TankBody");
const Sandbox_1 = require("../Sandbox");
class FactoryTestArena extends Arena_1.default {
    constructor(game) {
        super(game);
        this.shapes = new Sandbox_1.SandboxShapeManager(this);
        this.updateBounds(2500, 2500);
        const nimdac = this.nimdac = new TankBody_1.default(this.game, new Camera_1.CameraEntity(this.game), new AI_1.Inputs());
        nimdac.cameraEntity.cameraData.player = nimdac;
        nimdac.setTank(79);
        nimdac.barrels[0].droneCount = 6;
        nimdac.styleData.flags &= ~4;
        nimdac.physicsData.flags |= 64;
        nimdac.damageReduction = 0;
        nimdac.damagePerTick = 0;
        Object.defineProperty(nimdac, "damagePerTick", {
            get() {
                return 0;
            },
            set() { }
        });
        nimdac.physicsData.values.pushFactor = 50;
        nimdac.physicsData.absorbtionFactor = 0.0;
        nimdac.cameraEntity.setLevel(150);
        nimdac.styleData.color = 12;
        nimdac.nameData.name = "The Factory";
    }
    spawnPlayer(tank, client) {
        if (!this.nimdac || !this.nimdac.barrels[0]) {
            return super.spawnPlayer(tank, client);
        }
        const { x, y } = this.nimdac.getWorldPosition();
        const barrel = this.nimdac.barrels[0];
        const shootAngle = barrel.definition.angle + this.nimdac.positionData.values.angle;
        tank.positionData.values.x = x + (Math.cos(shootAngle) * barrel.physicsData.values.size * 0.5) - Math.sin(shootAngle) * barrel.definition.offset * this.nimdac.sizeFactor;
        tank.positionData.values.y = y + (Math.sin(shootAngle) * barrel.physicsData.values.size * 0.5) + Math.cos(shootAngle) * barrel.definition.offset * this.nimdac.sizeFactor;
        tank.addAcceleration(shootAngle, 40);
    }
    tick(tick) {
        const arenaSize = Math.floor(25 * Math.sqrt(Math.max(this.game.clients.size, 1))) * 100;
        if (this.width !== arenaSize || this.height !== arenaSize)
            this.updateBounds(arenaSize, arenaSize);
        if (this.nimdac && this.nimdac.inputs) {
            this.nimdac.inputs.mouse.magnitude = 5;
            this.nimdac.inputs.mouse.angle += 0.03;
        }
        super.tick(tick);
    }
}
exports.default = FactoryTestArena;
