"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sentry = void 0;
const Crasher_1 = require("./Crasher");
const Barrel_1 = require("../Tank/Barrel");
let GuardianSpawnerDefinition2 = {
    angle: Math.PI,
    offset: 0,
    size: 0,
    width: 0,
    delay: 0,
    reload: 0.25,
    recoil: 1,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    droneCount: 0,
    canControlDrones: true,
    bullet: {
        type: "drone",
        sizeRatio: 21 / (71.4 / 2),
        health: 1.5,
        damage: 0.5,
        speed: 2,
        scatterRate: 1,
        lifeLength: 1.5,
        absorbtionFactor: 1
    }
};
class Sentry extends Crasher_1.default {
    constructor(game, large = false) {
        super(game, large);
        this.cameraEntity = this;
        this.reloadTime = 4;
        this.sizeFactor = this.physicsData.values.size / 50;
        this.inputs = this.ai.inputs;
        this.isLarge = true;
        const rand = Math.random();
        if (rand < 0.33) {
            let barsss;
            let GuardianSpawnerDefinition = {
                angle: Math.PI,
                offset: 0,
                size: 90,
                width: 63,
                delay: 0,
                reload: 1,
                recoil: 1.25,
                isTrapezoid: true,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1,
                    damage: 1,
                    speed: 0.5,
                    scatterRate: 3,
                    lifeLength: 1.5,
                    absorbtionFactor: 1
                }
            };
            let GuardianSpawnerDefinition2 = {
                angle: 0,
                offset: 0,
                size: 140,
                width: 63,
                delay: 0,
                reload: 3,
                recoil: 1,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1.5,
                    damage: 1,
                    speed: 1.5,
                    scatterRate: 1,
                    lifeLength: 1.5,
                    absorbtionFactor: 1
                }
            };
            barsss = new Barrel_1.default(this, GuardianSpawnerDefinition);
            barsss = new Barrel_1.default(this, GuardianSpawnerDefinition2);
        }
        else if (rand < 0.66) {
            let barsss;
            let GuardianSpawnerDefinition = {
                angle: Math.PI,
                offset: 0,
                size: 90,
                width: 67.2,
                delay: 0,
                reload: 9,
                recoil: 1,
                isTrapezoid: true,
                trapezoidDirection: 0,
                addon: null,
                droneCount: 12,
                canControlDrones: true,
                bullet: {
                    type: "drone",
                    sizeRatio: 0.75,
                    health: 1.5,
                    damage: 0.5,
                    speed: 2,
                    scatterRate: 0,
                    lifeLength: -1,
                    absorbtionFactor: 1
                }
            };
            barsss = new Barrel_1.default(this, GuardianSpawnerDefinition);
        }
        else {
            let barsss;
            let GuardianSpawnerDefinition = {
                angle: Math.PI,
                offset: 0,
                size: 80,
                width: 80,
                delay: 0,
                reload: 3,
                recoil: 1.75,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: "trapLauncher",
                bullet: {
                    type: "trap",
                    sizeRatio: 0.8,
                    health: 8,
                    damage: 3,
                    speed: 2,
                    scatterRate: 1,
                    lifeLength: 1,
                    absorbtionFactor: 1
                }
            };
            let GuardianSpawnerDefinition2 = {
                angle: 0,
                offset: 0.4,
                size: 140,
                width: 50,
                delay: 0,
                reload: 1.5,
                recoil: 0.75,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1,
                    damage: 0.5,
                    speed: 1,
                    scatterRate: 1,
                    lifeLength: 1.5,
                    absorbtionFactor: 1
                }
            };
            let GuardianSpawnerDefinition3 = {
                angle: 0,
                offset: -0.4,
                size: 130,
                width: 50,
                delay: 0.33,
                reload: 1.5,
                recoil: 0.75,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1,
                    damage: 0.5,
                    speed: 1,
                    scatterRate: 1,
                    lifeLength: 1.5,
                    absorbtionFactor: 1
                }
            };
            let GuardianSpawnerDefinition4 = {
                angle: 0,
                offset: -0.4,
                size: 120,
                width: 50,
                delay: 0.66,
                reload: 1.5,
                recoil: 0.75,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1,
                    damage: 0.5,
                    speed: 1,
                    scatterRate: 0,
                    lifeLength: 1.5,
                    absorbtionFactor: 1
                }
            };
            barsss = new Barrel_1.default(this, GuardianSpawnerDefinition);
            barsss = new Barrel_1.default(this, GuardianSpawnerDefinition2);
            barsss = new Barrel_1.default(this, GuardianSpawnerDefinition3);
            barsss = new Barrel_1.default(this, GuardianSpawnerDefinition4);
        }
        this.healthData.values.health = this.healthData.values.maxHealth = 500;
        this.physicsData.values.size = 85 * Math.SQRT1_2;
        this.physicsData.values.sides = 3;
        this.physicsData.values.absorbtionFactor = 0.1;
        this.physicsData.values.pushFactor = 18;
        this.targettingSpeed = 1.4;
        this.styleData.values.color = 11;
        this.scoreReward = 500;
        this.damagePerTick = 12;
    }
}
exports.Sentry = Sentry;
