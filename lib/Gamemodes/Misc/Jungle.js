"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Arena_1 = require("../../Native/Arena");
const TeamEntity_1 = require("../../Entity/Misc/TeamEntity");
const Sandbox_1 = require("../Sandbox");
class JungleShapeManager extends Sandbox_1.SandboxShapeManager {
    spawnShape() {
        const shape = super.spawnShape();
        shape.physicsData.values.size *= 2.6;
        shape.healthData.values.health = (shape.healthData.values.maxHealth *= 4.3);
        shape.physicsData.values.absorbtionFactor /= 6;
        shape.scoreReward *= 19;
        return shape;
    }
}
class JungleArena extends Arena_1.default {
    constructor(game) {
        super(game);
        this.shapes = new JungleShapeManager(this);
        this.playerTeam = new TeamEntity_1.TeamEntity(game, 3);
        this.updateBounds(2500, 2500);
    }
    spawnPlayer(tank, client) {
        super.spawnPlayer(tank, client);
        tank.relationsData.values.team = this.playerTeam;
        tank.styleData.values.color = this.playerTeam.teamData.values.teamColor;
        if (client.camera)
            client.camera.relationsData.team = tank.relationsData.values.team;
    }
    tick(tick) {
        const arenaSize = Math.floor(25 * Math.sqrt(Math.max(this.game.clients.size, 1))) * 100;
        if (this.width !== arenaSize || this.height !== arenaSize)
            this.updateBounds(arenaSize, arenaSize);
        super.tick(tick);
    }
}
exports.default = JungleArena;
