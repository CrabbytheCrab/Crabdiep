"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractBoss_1 = require("../../Boss/AbstractBoss");
const Addons_1 = require("../../Tank/Addons");
class FallenSpike extends AbstractBoss_1.default {
    constructor(game) {
        super(game);
        this.movementSpeed = 3.0;
        this.nameData.values.name = 'Fallen Spike';
        this.damagePerTick *= 2;
        if (Addons_1.AddonById.spike)
            new Addons_1.AddonById['spike'](this);
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
exports.default = FallenSpike;
