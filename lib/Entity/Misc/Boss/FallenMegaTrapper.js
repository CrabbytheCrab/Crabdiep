"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../../Tank/Barrel");
const TankDefinitions_1 = require("../../../Const/TankDefinitions");
const AbstractBoss_1 = require("../../Boss/AbstractBoss");
class FallenMegaTrapper extends AbstractBoss_1.default {
    constructor(game) {
        super(game);
        this.movementSpeed = 1;
        this.nameData.values.name = 'Fallen Mega Trapper';
        for (const barrelDefinition of TankDefinitions_1.default[83].barrels) {
            const def = Object.assign({}, barrelDefinition, { reload: 4 });
            def.bullet = Object.assign({}, def.bullet, { speed: 1.7, damage: 20, health: 20, });
            this.barrels.push(new Barrel_1.default(this, def));
        }
        this.ai.aimSpeed = this.barrels[0].bulletAccel;
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
exports.default = FallenMegaTrapper;
