"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractShape_1 = require("./AbstractShape");
const AI_1 = require("../AI");
const config_1 = require("../../config");
class Crasher extends AbstractShape_1.default {
    constructor(game, large = false) {
        super(game);
        this.nameData.values.name = "Crasher";
        this.healthData.values.health = this.healthData.values.maxHealth = large ? 30 : 10;
        this.physicsData.values.size = (large ? 55 : 35) * Math.SQRT1_2;
        this.physicsData.values.sides = 3;
        this.physicsData.values.absorbtionFactor = large ? 0.1 : 2;
        this.physicsData.values.pushFactor = large ? 12 : 8;
        this.styleData.values.color = 11;
        this.scoreReward = large ? 25 : 15;
        this.damagePerTick = 8;
        this.isLarge = large;
        this.targettingSpeed = large ? 2.64 : 2.602;
        this.ai = new AI_1.AI(this);
        this.ai.viewRange = 2000;
        this.ai.aimSpeed = (this.ai.movementSpeed = this.targettingSpeed);
        this.ai['_findTargetInterval'] = config_1.tps;
    }
    tick(tick) {
        this.ai.aimSpeed = 0;
        this.ai.movementSpeed = this.targettingSpeed;
        if (this.ai.state === 0) {
            this.doIdleRotate = true;
        }
        else {
            this.doIdleRotate = false;
            this.positionData.angle = Math.atan2(this.ai.inputs.mouse.y - this.positionData.values.y, this.ai.inputs.mouse.x - this.positionData.values.x);
            this.accel.add({
                x: this.ai.inputs.movement.x * this.targettingSpeed,
                y: this.ai.inputs.movement.y * this.targettingSpeed
            });
        }
        this.ai.inputs.movement.set({
            x: 0,
            y: 0
        });
        super.tick(tick);
    }
}
exports.default = Crasher;
