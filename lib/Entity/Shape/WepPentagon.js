"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractShape_1 = require("./AbstractShape");
const TankBody_1 = require("../Tank/TankBody");
const AI_1 = require("../AI");
const config_1 = require("../../config");
const AutoTurret_1 = require("../Tank/AutoTurret");
const Pentagon_1 = require("./Pentagon");
const util_1 = require("../../util");
const Barrel_1 = require("../Tank/Barrel");
const GuardianSpawnerDefinition = {
    angle: 0,
    offset: 0,
    size: 80,
    width: 65.1,
    delay: 0,
    reload: 8,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: "trapLauncher",
    forceFire: true,
    bullet: {
        type: "trap",
        sizeRatio: 0.8,
        health: 5,
        damage: 1.25,
        speed: 2,
        scatterRate: 1,
        lifeLength: 1,
        absorbtionFactor: 1,
        color: 12
    }
};
const GuardianSpawnerDefinition2 = {
    angle: 0,
    offset: 0,
    size: 125,
    width: 105,
    delay: 0,
    reload: 8,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    forceFire: true,
    addon: "trapLauncher",
    bullet: {
        type: "trap",
        sizeRatio: 0.8,
        health: 8,
        damage: 4,
        speed: 2,
        scatterRate: 1,
        lifeLength: 4.5,
        absorbtionFactor: 0.1,
        color: 12
    }
};
const GuardianSpawnerDefinition3 = {
    angle: 0,
    offset: 0,
    size: 230,
    width: 126,
    delay: 2,
    reload: 18,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: "minionLauncher",
    droneCount: 2,
    canControlDrones: true,
    bullet: {
        type: "pentadrone",
        sizeRatio: 1,
        health: 6,
        damage: 2,
        speed: 1,
        scatterRate: 0,
        lifeLength: -1,
        absorbtionFactor: 1,
    }
};
class WepPentagon extends Pentagon_1.default {
    constructor(game, isAlpha = false, shiny = (Math.random() < 0.000001) && !isAlpha) {
        super(game);
        this.cameraEntity = this;
        this.trappers = [];
        this.base = [];
        this.reloadTime = 4;
        this.hasBeenWelcomed = false;
        this.isAlpha = isAlpha;
        this.sizeFactor = this.physicsData.values.size / 50;
        this.ai = new AI_1.AI(this);
        this.ai.viewRange = this.isAlpha ? 2500 : 2000;
        this.ai.aimSpeed = (this.ai.movementSpeed);
        this.ai['_findTargetInterval'] = config_1.tps;
        this.inputs = this.ai.inputs;
        this.nameData.values.name = this.isAlpha ? "Penta Lord" : "Weaponized Pentagon";
        if (this.isAlpha) {
            if (this.nameData.values.flags & 1)
                this.nameData.values.flags ^= 1;
            if (!this.hasBeenWelcomed) {
                let message = "The Penta Lord has spawned!";
                this.game.broadcast().u8(3).stringNT(message).u32(0x000000).float(10000).stringNT("").send();
                this.hasBeenWelcomed = true;
            }
            const atuo = new AutoTurret_1.default(this, {
                angle: 0,
                offset: 0,
                size: 151.2,
                width: 100,
                delay: 0,
                reload: 13,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 40,
                    damage: 3,
                    speed: 1.5,
                    scatterRate: 0.3,
                    lifeLength: 1,
                    absorbtionFactor: 0.1,
                    color: 12
                }
            });
            atuo.ai.viewRange = 2500;
            atuo.styleData.values.flags |= 64;
            const MAX_ANGLE_RANGE = util_1.PI2 / 4;
            atuo.baseSize = 80;
            for (let i = 0; i < 5; ++i) {
                const base = [new AutoTurret_1.default(this, GuardianSpawnerDefinition2)];
                base[0].influencedByOwnerInputs = true;
                base[0].baseSize = 80;
                base[0].ai.viewRange = 2500;
                const angle = base[0].ai.inputs.mouse.angle = util_1.PI2 * (i / 5);
                base[0].ai.passiveRotation = AI_1.AI.PASSIVE_ROTATION;
                base[0].positionData.values.y = this.physicsData.values.size * Math.sin(angle) * 1.1;
                base[0].positionData.values.x = this.physicsData.values.size * Math.cos(angle) * 1.1;
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
                    base[0].positionData.y = this.physicsData.values.size * Math.sin(angle) * 1.1;
                    base[0].positionData.x = this.physicsData.values.size * Math.cos(angle) * 1.1;
                    if (base[0].ai.state === 0)
                        base[0].positionData.angle = angle + this.positionData.values.angle;
                    tickBase.call(base[0], tick);
                };
            }
            for (let i = 0; i < 5; ++i) {
                this.trappers.push(new Barrel_1.default(this, {
                    ...GuardianSpawnerDefinition3,
                    angle: util_1.PI2 * ((i / 5) - 1 / 10)
                }));
            }
        }
        if (!this.isAlpha) {
            const atuo = new AutoTurret_1.default(this, {
                angle: 0,
                offset: 0,
                size: 80,
                width: 42,
                delay: 0,
                reload: 3,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 2,
                    damage: 1.5,
                    speed: 2,
                    scatterRate: 0.3,
                    lifeLength: 1,
                    absorbtionFactor: 0.1,
                    color: 12
                }
            });
            atuo.ai.viewRange = 2000;
            atuo.styleData.values.flags |= 64;
            atuo.baseSize = 35;
            for (let i = 0; i < 5; ++i) {
                this.trappers.push(new Barrel_1.default(this, {
                    ...GuardianSpawnerDefinition,
                    angle: util_1.PI2 * ((i / 5) - 1 / 10)
                }));
            }
        }
        this.healthData.values.health = this.healthData.values.maxHealth = (this.isAlpha ? 3000 : 1500);
        this.physicsData.values.size = (this.isAlpha ? 225 : 93.75) * Math.SQRT1_2;
        this.physicsData.values.sides = 5;
        this.styleData.values.color = shiny ? 7 : 10;
        this.physicsData.values.absorbtionFactor = this.isAlpha ? 0 : 0.1;
        this.physicsData.values.pushFactor = 2;
        this.isShiny = shiny;
        this.damagePerTick = this.isAlpha ? 60 : 16;
        this.scoreReward = this.isAlpha ? 30000 : 1500;
        if (shiny) {
            this.scoreReward *= 20;
            this.healthData.values.health = this.healthData.values.maxHealth *= 5;
        }
    }
    onDeath(killer) {
        if (this.isAlpha) {
            this.game.pentalord = false;
            const killerName = (killer instanceof TankBody_1.default && killer.nameData.values.name) || "an unnamed tank";
            this.game.broadcast()
                .u8(3)
                .stringNT(`The ${this.nameData.values.name} has been defeated by ${killerName}!`)
                .u32(0x000000)
                .float(10000)
                .stringNT("").send();
        }
    }
}
exports.default = WepPentagon;
WepPentagon.BASE_ROTATION = AbstractShape_1.default.BASE_ROTATION / 2;
WepPentagon.BASE_ORBIT = AbstractShape_1.default.BASE_ORBIT / 2;
WepPentagon.BASE_VELOCITY = AbstractShape_1.default.BASE_VELOCITY / 2;
