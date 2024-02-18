"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Tank/Barrel");
const AutoTurret_1 = require("../Tank/AutoTurret");
const AbstractBoss_1 = require("./AbstractBoss");
const util_1 = require("../../util");
const Addons_1 = require("../Tank/Addons");
const MountedTurretDefinition = {
    ...AutoTurret_1.AutoTurretDefinition,
    bullet: {
        ...AutoTurret_1.AutoTurretDefinition.bullet,
        speed: 2.3,
        damage: 0.75,
        health: 12.5,
        color: 12
    }
};
const DefenderDefinition = {
    angle: 0,
    offset: 0,
    size: 250,
    width: 119.7,
    delay: 0,
    reload: 7,
    recoil: 2,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: "trapLauncher",
    forceFire: true,
    bullet: {
        type: "trap",
        sizeRatio: 0.8,
        health: 20,
        damage: 8,
        speed: 5,
        scatterRate: 1,
        lifeLength: 8,
        absorbtionFactor: 1,
        color: 12
    }
};
const DefenderDefinition2 = {
    angle: 0,
    offset: 0,
    size: 225,
    width: 79.8,
    delay: 0,
    reload: 1,
    recoil: 0,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    forceFire: true,
    bullet: {
        type: "bullet",
        sizeRatio: 0.8,
        health: 5,
        damage: 3,
        speed: 1.5,
        scatterRate: 2,
        lifeLength: 1,
        absorbtionFactor: 0.8,
        color: 12
    }
};
const DEFENDER_SIZE = 275;
class Fortress extends AbstractBoss_1.default {
    constructor(game) {
        super(game);
        this.trappers = [];
        this.movementSpeed = 0.175;
        this.nameData.values.name = 'Castle';
        this.styleData.values.color = 0;
        this.relationsData.values.team = this.game.arena;
        this.physicsData.values.size = DEFENDER_SIZE * Math.SQRT1_2;
        this.healthData.values.health = this.healthData.values.maxHealth = 6000;
        this.scoreReward = 45000 * this.game.arena.shapeScoreRewardMultiplier;
        this.ai.viewRange = 0;
        this.sizeFactor = 1;
        this.physicsData.values.sides = 6;
        const rotator = new Addons_1.GuardObject(this.game, this, 6, 0.75, 0, -this.ai.passiveRotation);
        const offsetRatio = 0;
        const size = this.physicsData.values.size;
        rotator.relationsData.values.team = this.relationsData.values.team;
        rotator.styleData.values.color = 0;
        rotator.physicsData.values.sides = 6;
        rotator.physicsData.values.size = this.physicsData.values.size * 0.75;
        rotator.positionData.values.x = offsetRatio * size;
        rotator.positionData.values.angle = 0;
        rotator.joints = [];
        rotator.styleData.zIndex += 2;
        const atuo = new AutoTurret_1.default(rotator, {
            angle: 0,
            offset: 0,
            size: 150,
            width: 90.3,
            delay: 0,
            reload: 4,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "bullet",
                sizeRatio: 1,
                health: 4,
                damage: 3,
                speed: 2,
                scatterRate: 0.3,
                lifeLength: 1.75,
                absorbtionFactor: 0.1,
                color: 12
            }
        });
        atuo.ai.viewRange = 18200;
        atuo.styleData.values.flags |= 64;
        atuo.baseSize = 65;
        atuo.styleData.zIndex += 3;
        rotator.styleData.values.flags |= 64;
        if (rotator.styleData.values.flags & 64)
            rotator.styleData.values.flags |= 64;
        for (let i = 0; i < 6; ++i) {
            this.trappers.push(new Barrel_1.default(this, {
                ...DefenderDefinition,
                angle: util_1.PI2 * ((i / 6) - 1 / 12)
            }));
            const barr = new Barrel_1.default(rotator, { ...DefenderDefinition2, angle: util_1.PI2 * ((i / 6) - 1 / 12) });
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
exports.default = Fortress;
