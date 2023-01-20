"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Tank/Barrel");
const TankDefinitions_1 = require("../../Const/TankDefinitions");
const AbstractBoss_1 = require("./AbstractBoss");
class FallenPuker extends AbstractBoss_1.default {
    constructor(game) {
        super(game);
        this.movementSpeed = 1.8;
        this.nameData.values.name = 'Fallen Puker';
        for (const barrelDefinition of TankDefinitions_1.default[34].barrels) {
            const def = Object.assign({}, barrelDefinition, { recoil: 0.35, width: 35, isTrapezoid: true, reload: 0.35 });
            def.bullet = Object.assign({}, def.bullet, { speed: 1, health: 3.25, scatterRate: 2.5 });
            this.barrels.push(new Barrel_1.default(this, def));
        }
    }
    moveAroundMap() {
        const x = this.positionData.values.x, y = this.positionData.values.y;
        if (this.ai.state === 0) {
            super.moveAroundMap();
            this.positionData.angle = Math.atan2(this.inputs.movement.y, this.inputs.movement.x);
        }
        else {
            this.positionData.angle = Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x);
        }
    }
    tick(tick) {
        super.tick(tick);
        this.sizeFactor = this.physicsData.values.size / 50;
    }
}
exports.default = FallenPuker;
