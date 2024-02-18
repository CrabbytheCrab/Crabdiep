"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Tank/Barrel");
const TankDefinitions_1 = require("../../Const/TankDefinitions");
const AbstractBoss_1 = require("./AbstractBoss");
class FallenOverlord extends AbstractBoss_1.default {
    constructor(game) {
        super(game);
        this.nameData.values.name = 'Fallen Overlord';
        for (const barrelDefinition of TankDefinitions_1.default[71].barrels) {
            const def = Object.assign({}, barrelDefinition, { droneCount: 5, reload: 2, delay: 8 });
            def.bullet = Object.assign({}, def.bullet, { sizeRatio: 1, speed: 1.4, damage: 0.65, health: 15 });
            this.barrels.push(new Barrel_1.default(this, def));
        }
    }
    tick(tick) {
        super.tick(tick);
        this.sizeFactor = this.physicsData.values.size / 50;
        if (this.ai.state !== 3) {
            this.positionData.angle += this.ai.passiveRotation;
        }
    }
}
exports.default = FallenOverlord;
