"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
const AI_1 = require("../../AI");
const Addons_1 = require("../Addons");
class Blunt extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.reloadTime = 15;
        this.cameraEntity = tank.cameraEntity;
        this.inputs = new AI_1.Inputs();
        this.sizeFactor = this.physicsData.values.size / 50;
        this.megaturret = typeof this.barrelEntity.definition.megaturret === 'boolean' && this.barrelEntity.definition.megaturret;
        if (this.megaturret) {
            new Addons_1.GuardObject(this.game, this, 6, 1.45, 0, .1);
            this.physicsData.values.pushFactor *= 25;
        }
        else {
            new Addons_1.GuardObject(this.game, this, 6, 1.15, 0, .1);
            this.physicsData.values.pushFactor *= 10;
        }
    }
    tick(tick) {
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;
        super.tick(tick);
    }
}
exports.default = Blunt;
