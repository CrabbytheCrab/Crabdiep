"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Triangle_1 = require("./Triangle");
const Barrel_1 = require("../Tank/Barrel");
const AI_1 = require("../AI");
const config_1 = require("../../config");
const util_1 = require("../../util");
const AutoTurret_1 = require("../Tank/AutoTurret");
const GuardianSpawnerDefinition = {
    angle: Math.PI,
    offset: 0,
    size: 90,
    width: 47,
    delay: 0,
    reload: 6,
    recoil: 0,
    isTrapezoid: true,
    trapezoidDirection: 3.141592653589793,
    addon: null,
    droneCount: 3,
    bullet: {
        type: "drone",
        sizeRatio: 1,
        health: 1,
        damage: 2,
        speed: 1.8,
        scatterRate: 0,
        lifeLength: -1,
        absorbtionFactor: 0.5,
        color: 12
    }
};
const GuardianSpawnerDefinition2 = {
    angle: Math.PI,
    offset: 0,
    size: 70,
    width: 62,
    delay: 0,
    reload: 4.5,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    forceFire: true,
    addon: "trapLauncher",
    canControlDrones: true,
    bullet: {
        type: "trap",
        sizeRatio: 1,
        health: 1,
        damage: 2,
        speed: 1,
        scatterRate: 1,
        lifeLength: 1,
        absorbtionFactor: 0.5,
        color: 12
    }
};
class WepTriangle extends Triangle_1.default {
    constructor(game, shiny = Math.random() < 0.000001) {
        super(game);
        this.cameraEntity = this;
        this.reloadTime = 4;
        this.barrel = [];
        const rand = Math.random();
        this.sizeFactor = this.physicsData.values.size / 50;
        this.ai = new AI_1.AI(this);
        this.ai.viewRange = 800;
        this.ai.aimSpeed = (this.ai.movementSpeed);
        this.ai['_findTargetInterval'] = config_1.tps;
        this.inputs = this.ai.inputs;
        this.nameData.values.name = "Weaponized Triangle";
        this.healthData.values.health = this.healthData.values.maxHealth = 210;
        this.physicsData.values.size = 68.75 * Math.SQRT1_2;
        this.physicsData.values.sides = 3;
        this.styleData.values.color = shiny ? 7 : 9;
        this.physicsData.values.absorbtionFactor = 0.1;
        this.physicsData.values.pushFactor = 2;
        this.damagePerTick = 14;
        this.scoreReward = 250;
        this.isShiny = shiny;
        if (shiny) {
            this.scoreReward *= 100;
            this.healthData.values.health = this.healthData.values.maxHealth *= 10;
        }
        if (rand < 0.5) {
            for (let i = 0; i < 3; ++i) {
                this.barrel.push(new Barrel_1.default(this, {
                    ...GuardianSpawnerDefinition,
                    angle: util_1.PI2 * ((i / 3) - 1 / 6)
                }));
            }
        }
        else {
            const atuo = new AutoTurret_1.default(this, {
                angle: 0,
                offset: 0,
                size: 70,
                width: 40,
                delay: 0,
                reload: 1,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1,
                    damage: 1,
                    speed: 1.5,
                    scatterRate: 0.3,
                    lifeLength: 1,
                    absorbtionFactor: 0.1,
                    color: 12
                }
            });
            atuo.ai.viewRange = 800;
            atuo.baseSize *= 1.125;
            for (let i = 0; i < 3; ++i) {
                this.barrel.push(new Barrel_1.default(this, {
                    ...GuardianSpawnerDefinition2,
                    angle: util_1.PI2 * ((i / 3) - 1 / 6)
                }));
            }
        }
    }
}
exports.default = WepTriangle;
