"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Tank/Barrel");
const AutoTurret_1 = require("../Tank/AutoTurret");
const AbstractBoss_1 = require("./AbstractBoss");
const util_1 = require("../../util");
const Addons_1 = require("../Tank/Addons");
const MountedTurretDefinition = {
    ...AutoTurret_1.AutoTurretDefinition,
    reload: 1.5,
    size: 80,
    bullet: {
        ...AutoTurret_1.AutoTurretDefinition.bullet,
        speed: 2.3,
        damage: 1.2,
        health: 8,
        color: 12
    }
};
const DefenderDefinition = {
    angle: 0,
    offset: 0,
    size: 330,
    width: 130.2,
    delay: 0,
    reload: 5,
    recoil: 2,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: "trapLauncher",
    forceFire: true,
    bullet: {
        type: "blunttrap",
        sizeRatio: 0.8,
        health: 4,
        damage: 5,
        speed: 1.5,
        scatterRate: 1,
        lifeLength: 2,
        absorbtionFactor: 0.25,
        color: 12
    }
};
const DefenderDefinition2 = {
    angle: 0,
    offset: 0,
    size: 240,
    width: 69.3,
    delay: 0,
    reload: 6,
    recoil: 0,
    isTrapezoid: true,
    trapezoidDirection: 3.141592653589793,
    addon: null,
    forceFire: true,
    bullet: {
        type: "homing",
        sizeRatio: 1,
        health: 3,
        damage: 2,
        speed: 1.5,
        scatterRate: 0.3,
        lifeLength: 2,
        absorbtionFactor: 0,
        color: 12
    }
};
const DEFENDER_SIZE = 275;
class Mecha extends AbstractBoss_1.default {
    constructor(game) {
        super(game);
        this.trappers = [];
        this.movementSpeed = 0.175;
        this.nameData.values.name = 'Mechanical Traveler';
        this.styleData.values.color = 18;
        this.relationsData.values.team = this.game.arena;
        this.physicsData.values.size = DEFENDER_SIZE * Math.SQRT1_2;
        this.healthData.values.health = this.healthData.values.maxHealth = 6000;
        this.scoreReward = 45000 * this.game.arena.shapeScoreRewardMultiplier;
        this.ai.viewRange = 0;
        this.sizeFactor = 1;
        this.physicsData.values.sides = 8;
        const rotator = new Addons_1.GuardObject(this.game, this, 5, 0.75, 0, -this.ai.passiveRotation);
        rotator.styleData.values.color = 18;
        rotator.physicsData.values.sides = 8;
        const offsetRatio = 0;
        const size = this.physicsData.values.size;
        rotator.relationsData.values.team = this.relationsData.values.team;
        rotator.physicsData.values.size = this.physicsData.values.size * 0.75;
        rotator.positionData.values.x = offsetRatio * size;
        rotator.positionData.values.angle = 0;
        rotator.joints = [];
        rotator.styleData.zIndex += 2;
        rotator.styleData.values.flags |= 64;
        if (rotator.styleData.values.flags & 64)
            rotator.styleData.values.flags |= 64;
        for (let i = 0; i < 4; ++i) {
            const base = new AutoTurret_1.default(rotator, MountedTurretDefinition);
            base.influencedByOwnerInputs = true;
            const angle = base.ai.inputs.mouse.angle = util_1.PI2 * (i / 4);
            base.positionData.values.y = rotator.physicsData.values.size * Math.sin(angle) * 0.8;
            base.positionData.values.x = rotator.physicsData.values.size * Math.cos(angle) * 0.8;
            base.physicsData.values.flags |= 1;
            const tickBase = base.tick;
            base.tick = (tick) => {
                base.positionData.y = rotator.physicsData.values.size * Math.sin(angle) * 0.8;
                base.positionData.x = rotator.physicsData.values.size * Math.cos(angle) * 0.8;
                if (base.ai.state === 0)
                    base.positionData.angle = angle + rotator.positionData.values.angle;
                tickBase.call(base, tick);
            };
        }
        for (let i = 0; i < 8; ++i) {
            this.trappers.push(new Barrel_1.default(this, {
                ...DefenderDefinition,
                angle: util_1.PI2 * ((i / 8) - 1 / 16)
            }));
            const barr = new Barrel_1.default(rotator, { ...DefenderDefinition2, angle: util_1.PI2 * ((i / 8) - 1 / 16) });
            const tickBase2 = barr.tick;
            barr.positionData.values.y += rotator.physicsData.values.size * Math.sin(0.01);
            barr.positionData.values.x += rotator.physicsData.values.size * Math.cos(0.01);
            barr.tick = (tick) => {
                barr.positionData.y += rotator.physicsData.values.size * Math.sin(0.01);
                barr.positionData.x += rotator.physicsData.values.size * Math.cos(0.01);
                tickBase2.call(barr, tick);
            };
            rotator.joints.push(barr);
        }
    }
    tick(tick) {
        super.tick(tick);
        this.sizeFactor = (this.physicsData.values.size / Math.SQRT1_2) / DEFENDER_SIZE;
        if (this.ai.state !== 3) {
            this.positionData.angle += this.ai.passiveRotation * Math.PI * Math.SQRT1_2;
        }
    }
}
exports.default = Mecha;
