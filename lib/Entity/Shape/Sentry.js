"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sentry = void 0;
const AI_1 = require("../AI");
const Crasher_1 = require("./Crasher");
const AutoTurret_1 = require("../Tank/AutoTurret");
const Barrel_1 = require("../Tank/Barrel");
const Addons_1 = require("../Tank/Addons");
const util_1 = require("../../util");
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
    constructor(game, large = true) {
        super(game, large);
        this.cameraEntity = this;
        this.reloadTime = 4;
        this.sizeFactor = this.physicsData.values.size / 50;
        this.inputs = this.ai.inputs;
        this.isLarge = true;
        const rand = Math.random();
        if (rand < 0.16) {
            this.nameData.values.name = "Protective Crasher";
            let barsss;
            let GuardianSpawnerDefinition = {
                angle: Math.PI,
                offset: 0,
                size: 90,
                width: 63,
                delay: 0,
                reload: 0.5,
                recoil: 1,
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
                reload: 8,
                recoil: 1,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 6,
                    damage: 2,
                    speed: 1.5,
                    scatterRate: 0,
                    lifeLength: 1.25,
                    absorbtionFactor: 1
                }
            };
            barsss = new Barrel_1.default(this, GuardianSpawnerDefinition);
            barsss = new Barrel_1.default(this, GuardianSpawnerDefinition2);
        }
        else if (rand < 0.33) {
            this.nameData.values.name = "Guard Crasher";
            let barsss;
            let GuardianSpawnerDefinition = {
                angle: Math.PI,
                offset: 0,
                size: 90,
                width: 67.2,
                delay: 0,
                reload: 4,
                recoil: 0,
                isTrapezoid: true,
                trapezoidDirection: 0,
                addon: null,
                droneCount: 6,
                canControlDrones: true,
                bullet: {
                    type: "drone",
                    sizeRatio: 0.625,
                    health: 2.5,
                    damage: 1.25,
                    speed: 2,
                    scatterRate: 0,
                    lifeLength: 4,
                    absorbtionFactor: 0.8
                }
            };
            barsss = new Barrel_1.default(this, GuardianSpawnerDefinition);
        }
        else if (rand < 0.5) {
            this.nameData.values.name = "Beholding Crasher";
            let barsss;
            let GuardianSpawnerDefinition = {
                angle: Math.PI,
                offset: 0,
                size: 80,
                width: 79.8,
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
                offset: 40,
                size: 110,
                width: 33.6,
                delay: 0,
                reload: 1.2,
                recoil: 0.75,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 2,
                    damage: 0.5,
                    speed: 1,
                    scatterRate: 1,
                    lifeLength: 1.5,
                    absorbtionFactor: 0.6
                }
            };
            let GuardianSpawnerDefinition3 = {
                angle: 0,
                offset: -40,
                size: 110,
                width: 33.6,
                delay: 0.5,
                reload: 1.2,
                recoil: 0.75,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 2,
                    damage: 0.5,
                    speed: 1,
                    scatterRate: 1,
                    lifeLength: 1.5,
                    absorbtionFactor: 0.6
                }
            };
            barsss = new Barrel_1.default(this, GuardianSpawnerDefinition);
            barsss = new Barrel_1.default(this, GuardianSpawnerDefinition2);
            barsss = new Barrel_1.default(this, GuardianSpawnerDefinition3);
        }
        else if (rand < 0.66) {
            this.nameData.values.name = "Sentry Crasher";
            let barsss;
            let GuardianSpawnerDefinition = {
                angle: Math.PI,
                offset: 0,
                size: 100,
                width: 63,
                delay: 0,
                reload: 1,
                recoil: 1.25,
                isTrapezoid: true,
                trapezoidDirection: Math.PI,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1,
                    damage: 0.3,
                    speed: 1,
                    scatterRate: 1,
                    lifeLength: 0.5,
                    absorbtionFactor: 1
                }
            };
            barsss = new Barrel_1.default(this, GuardianSpawnerDefinition);
            let Auto1 = {
                angle: 0,
                offset: -0,
                size: 95,
                width: 42,
                delay: 0.01,
                reload: 4,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1.5,
                    damage: 1.6,
                    speed: 1,
                    scatterRate: 1,
                    lifeLength: 1,
                    absorbtionFactor: 0.1
                }
            };
            let Auto2 = {
                angle: 0.39269908169872414,
                offset: 0,
                size: 88,
                width: 42,
                delay: 0.01,
                reload: 4,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1.5,
                    damage: 1.6,
                    speed: 1,
                    scatterRate: 1,
                    lifeLength: 1,
                    absorbtionFactor: 0.1
                }
            };
            let Auto3 = {
                angle: -0.39269908169872414,
                offset: 0,
                size: 88,
                width: 42,
                delay: 0.01,
                reload: 4,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1.5,
                    damage: 1.6,
                    speed: 1,
                    scatterRate: 1,
                    lifeLength: 1,
                    absorbtionFactor: 0.1
                }
            };
            let Auto5 = {
                angle: 0,
                offset: 0,
                size: 65,
                width: 50.4,
                delay: 0.5,
                reload: 2,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1.25,
                    damage: 1.5,
                    speed: 2,
                    scatterRate: 0,
                    lifeLength: 1,
                    absorbtionFactor: 0.1
                }
            };
            let Auto6 = {
                angle: 0,
                offset: 0,
                size: 75,
                width: 50.4,
                delay: 0.01,
                reload: 2,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1.25,
                    damage: 1.5,
                    speed: 2,
                    scatterRate: 0,
                    lifeLength: 1,
                    absorbtionFactor: 0.1
                }
            };
            const MAX_ANGLE_RANGE = util_1.PI2 / 3;
            for (let i = 0; i < 2; ++i) {
                const base = [new AutoTurret_1.default(this, [Auto3, Auto2, Auto1])];
                base[0].influencedByOwnerInputs = true;
                base[0].baseSize *= 1.75;
                base[0].ai.viewRange = 2000;
                const angle = base[0].ai.inputs.mouse.angle = util_1.PI2 * ((i / 3) - (1 / 6));
                base[0].ai.passiveRotation = AI_1.AI.PASSIVE_ROTATION;
                base[0].positionData.values.y = this.physicsData.values.size * Math.sin(angle) * 0.8;
                base[0].positionData.values.x = this.physicsData.values.size * Math.cos(angle) * 0.8;
                if (base[0].styleData.values.flags & 64)
                    base[0].styleData.values.flags ^= 64;
                base[0].physicsData.values.flags |= 1;
                base[0].ai.targetFilter = (targetPos) => {
                    const pos = base[0].getWorldPosition();
                    const angleToTarget = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
                    const deltaAngle = (0, util_1.normalizeAngle)(angleToTarget - ((angle + this.positionData.values.angle)));
                    return deltaAngle < MAX_ANGLE_RANGE || deltaAngle > (util_1.PI2 - MAX_ANGLE_RANGE);
                };
                const tickBase = base[0].tick;
                base[0].tick = (tick) => {
                    base[0].positionData.y = this.physicsData.values.size * Math.sin(angle) * 0.8;
                    base[0].positionData.x = this.physicsData.values.size * Math.cos(angle) * 0.8;
                    if (base[0].ai.state === 0)
                        base[0].positionData.angle = angle + this.positionData.values.angle;
                    tickBase.call(base[0], tick);
                };
            }
        }
        else if (rand < 0.83) {
            this.nameData.values.name = "Spinner Crasher";
            let barsss;
            let GuardianSpawnerDefinition = {
                angle: Math.PI,
                offset: 0,
                size: 100,
                width: 63,
                delay: 0,
                reload: 0.5,
                recoil: 0,
                isTrapezoid: true,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1.5,
                    damage: 1.5,
                    speed: 2,
                    scatterRate: 3,
                    lifeLength: 0.8,
                    absorbtionFactor: 1
                }
            };
            let GuardianSpawnerDefinition2 = {
                angle: Math.PI - (2 * Math.PI / 3),
                offset: 0,
                size: 100,
                width: 63,
                delay: 0,
                reload: 0.5,
                recoil: 0,
                isTrapezoid: true,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1.5,
                    damage: 1.5,
                    speed: 2,
                    scatterRate: 3,
                    lifeLength: 0.5,
                    absorbtionFactor: 1
                }
            };
            let GuardianSpawnerDefinition3 = {
                angle: Math.PI + (2 * Math.PI / 3),
                offset: 0,
                size: 100,
                width: 63,
                delay: 0,
                reload: 0.5,
                recoil: 0,
                isTrapezoid: true,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1.5,
                    damage: 1.5,
                    speed: 2,
                    scatterRate: 3,
                    lifeLength: 0.5,
                    absorbtionFactor: 1
                }
            };
            this.canrotate = true;
            barsss = new Barrel_1.default(this, GuardianSpawnerDefinition);
            barsss = new Barrel_1.default(this, GuardianSpawnerDefinition2);
            barsss = new Barrel_1.default(this, GuardianSpawnerDefinition3);
        }
        else {
            let GuardianSpawnerDefinition = {
                angle: Math.PI,
                offset: 0,
                size: 120,
                width: 35,
                delay: 0,
                reload: 0.5,
                recoil: 0,
                isTrapezoid: true,
                trapezoidDirection: Math.PI,
                addon: null,
                droneCount: 0,
                bullet: {
                    type: "drone",
                    sizeRatio: 1,
                    health: 1.5,
                    damage: 1.5,
                    speed: 2,
                    scatterRate: 3,
                    lifeLength: 0.5,
                    absorbtionFactor: 1
                }
            };
            let GuardianSpawnerDefinition2 = {
                angle: Math.PI - (2 * Math.PI / 3),
                offset: 0,
                size: 120,
                width: 35,
                delay: 0,
                reload: 0.5,
                recoil: 0,
                isTrapezoid: true,
                trapezoidDirection: Math.PI,
                addon: null,
                droneCount: 0,
                bullet: {
                    type: "drone",
                    sizeRatio: 1,
                    health: 1.5,
                    damage: 1.5,
                    speed: 2,
                    scatterRate: 3,
                    lifeLength: 0.5,
                    absorbtionFactor: 1
                }
            };
            let GuardianSpawnerDefinition3 = {
                angle: Math.PI + (2 * Math.PI / 3),
                offset: 0,
                size: 120,
                width: 35,
                delay: 0,
                reload: 0.5,
                recoil: 0,
                isTrapezoid: true,
                trapezoidDirection: Math.PI,
                addon: null,
                droneCount: 0,
                bullet: {
                    type: "drone",
                    sizeRatio: 1,
                    health: 1.5,
                    damage: 1.5,
                    speed: 2,
                    scatterRate: 3,
                    lifeLength: 0.5,
                    absorbtionFactor: 1
                }
            };
            let barsss;
            barsss = new Barrel_1.default(this, GuardianSpawnerDefinition);
            barsss.styleData.color = 0;
            barsss = new Barrel_1.default(this, GuardianSpawnerDefinition2);
            barsss.styleData.color = 0;
            barsss = new Barrel_1.default(this, GuardianSpawnerDefinition3);
            barsss.styleData.color = 0;
            this.nameData.values.name = "Stalking Crasher";
            this.healthData.values.health = this.healthData.values.maxHealth = 175;
            this.physicsData.values.pushFactor = 4;
            this.damagePerTick = 40;
            this.targettingSpeed = 1.1;
            this.invis = true;
            new Addons_1.OverdriveAddon(1.8, this, 3);
        }
        this.healthData.values.health = this.healthData.values.maxHealth = 500;
        this.physicsData.values.size = 85 * Math.SQRT1_2;
        this.physicsData.values.sides = 3;
        this.physicsData.values.absorbtionFactor = 0.1;
        this.physicsData.values.pushFactor = 12;
        this.targettingSpeed = 1.4;
        this.styleData.values.color = 11;
        this.scoreReward = 450;
        this.damagePerTick = 20;
    }
}
exports.Sentry = Sentry;
