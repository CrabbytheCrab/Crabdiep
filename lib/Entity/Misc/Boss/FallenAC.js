"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../../Tank/Barrel");
const TankDefinitions_1 = require("../../../Const/TankDefinitions");
const AbstractBoss_1 = require("../../Boss/AbstractBoss");
class FallenAC extends AbstractBoss_1.default {
    constructor(game) {
        super(game);
        this.nameData.values.name = 'Fallen AC';
        this.movementSpeed = 20;
        for (const barrelDefinition of TankDefinitions_1.default[105].barrels) {
            this.barrels.push(new Barrel_1.default(this, barrelDefinition));
        }
    }
    moveAroundMap() {
        if (this.ai.state === 0) {
            this.positionData.angle += this.ai.passiveRotation;
            this.accel.set({ x: 0, y: 0 });
        }
        else {
            const x = this.positionData.values.x, y = this.positionData.values.y;
            this.positionData.angle = Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x);
        }
    }
    tick(tick) {
        super.tick(tick);
    }
}
exports.default = FallenAC;
