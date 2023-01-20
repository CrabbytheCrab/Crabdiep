"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Barrel");
const Drone_1 = require("./Drone");
const AI_1 = require("../../AI");
const MinionBarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 90,
    width: 75.6,
    delay: 0,
    reload: 3.25,
    recoil: 8,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 1,
        damage: 1,
        speed: 0.85,
        scatterRate: 1,
        lifeLength: 0.75,
        sizeRatio: 1,
        absorbtionFactor: 0.1
    }
};
class MegaMinion extends Drone_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.reloadTime = 1;
        this.inputs = new AI_1.Inputs();
        this.inputs = this.ai.inputs;
        this.ai.viewRange = 900;
        this.usePosAngle = false;
        this.physicsData.values.sides = 1;
        this.physicsData.values.size *= 1.2;
        if (this.physicsData.values.flags & 8)
            this.physicsData.values.flags ^= 8;
        if (this.physicsData.values.flags & 256)
            this.physicsData.values.flags ^= 256;
        this.physicsData.values.flags |= 32;
        this.sizeFactor = this.physicsData.values.size / 50;
        this.cameraEntity = tank.cameraEntity;
        this.minionBarrel = new Barrel_1.default(this, MinionBarrelDefinition);
        this.ai.movementSpeed = this.ai.aimSpeed = this.baseAccel;
    }
    tickMixin(tick) {
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;
        const usingAI = !this.canControlDrones || !this.tank.inputs.attemptingShot() && !this.tank.inputs.attemptingRepel();
        const inputs = !usingAI ? this.tank.inputs : this.ai.inputs;
        if (usingAI && this.ai.state === 0) {
            this.movementAngle = this.positionData.values.angle;
        }
        else {
            this.inputs.flags |= 1;
            const dist = inputs.mouse.distanceToSQ(this.positionData.values);
            if (dist < MegaMinion.FOCUS_RADIUS / 4) {
                this.movementAngle = this.positionData.values.angle + Math.PI;
            }
            else if (dist < MegaMinion.FOCUS_RADIUS) {
                this.movementAngle = this.positionData.values.angle;
            }
            else
                this.movementAngle = this.positionData.values.angle;
        }
        super.tickMixin(tick);
    }
}
exports.default = MegaMinion;
MegaMinion.FOCUS_RADIUS = 850 ** 2;
