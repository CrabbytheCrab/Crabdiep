"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BlackHoleAlt_1 = require("../Entity/Misc/BlackHoleAlt");
const TeamBase_1 = require("../Entity/Misc/TeamBase");
const TeamEntity_1 = require("../Entity/Misc/TeamEntity");
const Arena_1 = require("../Native/Arena");
const Sandbox_1 = require("./Sandbox");
const arenaSize = 10000;
const baseWidth = 3000;
const domBaseSize = baseWidth / 2;
const CELL_SIZE = 635;
const GRID_SIZE = 40;
class CustomShapeManager extends Sandbox_1.SandboxShapeManager {
    get wantedShapes() {
        let i = 0;
        for (const client of this.game.clients) {
            if (client.camera)
                i += 1;
        }
        return 0;
    }
}
class Sanctuary extends Arena_1.default {
    constructor(game) {
        super(game);
        this.timer = 900;
        this.celestial = new TeamEntity_1.TeamEntity(this.game, 11);
        this.shapes = new CustomShapeManager(this);
        this.playerTeamMap = new Map();
        this.maxtanklevel = 90;
        this.updateBounds(8000, 8000);
        this.celestialTeamBase = new TeamBase_1.default(game, new TeamEntity_1.TeamEntity(this.game, 11), 0, 0, 3000, 3000);
    }
    tick(tick) {
        super.tick(tick);
        this.timer--;
        if (this.timer <= 0) {
            const rand = Math.random();
            if (rand > 0.5) {
                new BlackHoleAlt_1.default(this.game, this.celestial, "scenexe", 1);
            }
            else {
                new BlackHoleAlt_1.default(this.game, this.celestial, "crossroads", 1);
            }
            this.timer = 900;
        }
    }
    spawnPlayer(tank, client) {
        const xOffset = (Math.random() - 0.5) * baseWidth;
        const base = this.playerTeamMap.get(client) || [this.celestialTeamBase][0];
        tank.relationsData.values.team = base.relationsData.values.team;
        tank.styleData.values.color = base.styleData.values.color;
        tank.positionData.values.x = base.positionData.values.x + xOffset;
        tank.positionData.values.y = base.positionData.values.y + xOffset;
        tank.setTank(tank.currentTank);
        this.playerTeamMap.set(client, base);
        if (client.camera)
            client.camera.relationsData.team = tank.relationsData.values.team;
    }
}
exports.default = Sanctuary;
