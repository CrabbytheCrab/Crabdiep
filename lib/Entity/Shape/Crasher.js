"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractShape_1 = require("./AbstractShape");
const util = require("../../util");
const AI_1 = require("../AI");
const config_1 = require("../../config");
class Crasher extends AbstractShape_1.default {
    constructor(game, large = false) {
        super(game);
        this.nameData.values.name = "Crasher";
        this.canrotate = false;
        this.invis = false;
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
        if (this.invis) {
            if (this.styleData.opacity >= 0.75) {
                this.targettingSpeed += 3 - this.targettingSpeed * 0.05;
                this.targettingSpeed = util.constrain(this.targettingSpeed, 0, 3);
            }
            else {
                this.targettingSpeed = 0.2;
            }
            if (this.ai.state === 1) {
                this.styleData.opacity += 0.1;
                this.damageReduction = 1;
            }
            else {
                this.damageReduction = 0.1;
                this.styleData.opacity -= 0.025;
            }
            this.styleData.opacity = util.constrain(this.styleData.values.opacity, 0.05, 1);
        }
        if (this.ai.state === 0) {
            this.doIdleRotate = true;
        }
        else {
            this.doIdleRotate = false;
            if (!this.canrotate) {
                this.positionData.angle =
                    Math.atan2(this.ai.inputs.mouse.y - this.positionData.values.y, this.ai.inputs.mouse.x - this.positionData.values.x);
            }
            else {
                this.positionData.angle += 0.4 - this.rotationRate * 0.05;
            }
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
