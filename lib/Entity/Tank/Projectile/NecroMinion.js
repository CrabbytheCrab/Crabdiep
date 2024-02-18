"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Drone_1 = require("./Drone");
const AI_1 = require("../../AI");
const Minion_1 = require("./Minion");
const MinionBarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 80,
    width: 50.4,
    delay: 0,
    reload: 1,
    recoil: 1.35,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.4,
        damage: 0.4,
        speed: 0.8,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
class NecroMinion extends Drone_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.minionBarrel = [];
        this.reloadTime = 1;
        this.inputs = new AI_1.Inputs();
        this.idx = null;
        if (tankDefinition) {
            this.idx = tankDefinition.id;
        }
        const bulletDefinition = barrel.definition.bullet;
        this.inputs = this.ai.inputs;
        this.ai.viewRange = 900;
        this.usePosAngle = false;
        this.physicsData.values.sides = bulletDefinition.sides ?? 1;
        this.physicsData.values.size *= 1.2;
        if (this.physicsData.values.flags & 8)
            this.physicsData.values.flags ^= 8;
        if (this.physicsData.values.flags & 256)
            this.physicsData.values.flags ^= 256;
        this.physicsData.values.flags |= 32;
        this.sizeFactor = this.physicsData.values.size / 50;
        this.cameraEntity = tank.cameraEntity;
        this.ai.movementSpeed = this.ai.aimSpeed = this.baseAccel;
    }
    static fromTank(barrel, tank, tankDefinition, shape) {
        const chip = new NecroMinion(barrel, tank, tankDefinition, shape.positionData.values.angle);
        chip.physicsData.values.sides = shape.physicsData.values.sides;
        chip.physicsData.values.size = shape.physicsData.values.size;
        chip.positionData.values.x = shape.positionData.values.x;
        chip.positionData.values.y = shape.positionData.values.y;
        chip.positionData.values.angle = shape.positionData.values.angle;
        const shapeDamagePerTick = shape.damagePerTick;
        chip.damagePerTick *= shapeDamagePerTick / 8;
        chip.healthData.values.maxHealth = (chip.healthData.values.health *= (shapeDamagePerTick / 8));
        return chip;
    }
    tickMixin(tick) {
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;
        if (this.idx === 176) {
            this.positionData.values.angle += 0.1;
        }
        const usingAI = !this.canControlDrones || !this.tank.inputs.attemptingShot() && !this.tank.inputs.attemptingRepel();
        const inputs = !usingAI ? this.tank.inputs : this.ai.inputs;
        if (usingAI && this.ai.state === 0) {
            this.movementAngle = this.positionData.values.angle;
        }
        else {
            this.inputs.flags |= 1;
            const dist = inputs.mouse.distanceToSQ(this.positionData.values);
            if (dist < Minion_1.default.FOCUS_RADIUS / 4) {
                this.movementAngle = this.positionData.values.angle + Math.PI;
            }
            else if (dist < Minion_1.default.FOCUS_RADIUS) {
                this.movementAngle = this.positionData.values.angle;
            }
            else
                this.movementAngle = this.positionData.values.angle;
        }
        super.tickMixin(tick);
    }
}
exports.default = NecroMinion;
NecroMinion.FOCUS_RADIUS = 850 ** 2;
