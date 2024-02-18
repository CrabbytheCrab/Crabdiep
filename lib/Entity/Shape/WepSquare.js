"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Square_1 = require("./Square");
const Barrel_1 = require("../Tank/Barrel");
const AI_1 = require("../AI");
const config_1 = require("../../config");
const util_1 = require("../../util");
const GuardianSpawnerDefinition = {
    angle: Math.PI,
    offset: 0,
    size: 90,
    width: 56.7,
    delay: 0,
    reload: 2,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        sizeRatio: 1,
        health: 3,
        damage: 0.85,
        speed: 1.25,
        scatterRate: 1,
        lifeLength: 0.5,
        absorbtionFactor: 1,
        color: 12
    }
};
const GuardianSpawnerDefinition2 = {
    angle: Math.PI,
    offset: 0,
    size: 90,
    width: 60.9,
    delay: 0,
    reload: 6,
    recoil: 0,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    droneCount: 1,
    canControlDrones: true,
    bullet: {
        type: "drone",
        sizeRatio: 1,
        health: 3.5,
        damage: 1.5,
        speed: 1,
        scatterRate: 0,
        lifeLength: -1,
        absorbtionFactor: 1,
        sides: 4,
        color: 16
    }
};
class WepSquare extends Square_1.default {
    constructor(game, shiny = Math.random() < 0.000001) {
        super(game);
        this.cameraEntity = this;
        this.reloadTime = 4;
        this.barrel = [];
        const rand = Math.random();
        this.sizeFactor = this.physicsData.values.size / 50;
        this.ai = new AI_1.AI(this);
        this.ai.viewRange = 2000;
        this.ai.aimSpeed = (this.ai.movementSpeed);
        this.ai['_findTargetInterval'] = config_1.tps;
        this.inputs = this.ai.inputs;
        this.nameData.values.name = "Weaponized Square";
        this.healthData.values.health = this.healthData.values.maxHealth = 100;
        this.physicsData.values.size = 68.75 * Math.SQRT1_2;
        this.physicsData.values.sides = 4;
        this.styleData.values.color = shiny ? 7 : 8;
        this.physicsData.values.absorbtionFactor = 0.1;
        this.physicsData.values.pushFactor = 2;
        this.damagePerTick = 12;
        this.scoreReward = 100;
        this.isShiny = shiny;
        if (shiny) {
            this.scoreReward *= 20;
            this.healthData.values.health = this.healthData.values.maxHealth *= 5;
        }
        if (rand < 0.5) {
            for (let i = 0; i < 4; ++i) {
                this.barrel.push(new Barrel_1.default(this, {
                    ...GuardianSpawnerDefinition,
                    angle: util_1.PI2 * ((i / 4))
                }));
            }
        }
        else {
            for (let i = 0; i < 4; ++i) {
                this.barrel.push(new Barrel_1.default(this, {
                    ...GuardianSpawnerDefinition2,
                    angle: util_1.PI2 * ((i / 4))
                }));
            }
        }
    }
}
exports.default = WepSquare;
