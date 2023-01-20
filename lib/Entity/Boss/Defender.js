"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Tank/Barrel");
const AutoTurret_1 = require("../Tank/AutoTurret");
const AbstractBoss_1 = require("./AbstractBoss");
const util_1 = require("../../util");
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
    size: 120,
    width: 71.4,
    delay: 0,
    reload: 4,
    recoil: 2,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: "trapLauncher",
    forceFire: true,
    bullet: {
        type: "trap",
        sizeRatio: 0.8,
        health: 12.5,
        damage: 4,
        speed: 5,
        scatterRate: 1,
        lifeLength: 8,
        absorbtionFactor: 1,
        color: 12
    }
};
const DEFENDER_SIZE = 150;
class Defender extends AbstractBoss_1.default {
    constructor(game) {
        super(game);
        this.trappers = [];
        this.movementSpeed = 0.35;
        this.nameData.values.name = 'Defender';
        this.styleData.values.color = 9;
        this.relationsData.values.team = this.game.arena;
        this.physicsData.values.size = DEFENDER_SIZE * Math.SQRT1_2;
        this.ai.viewRange = 0;
        this.sizeFactor = 1;
        this.physicsData.values.sides = 3;
        for (let i = 0; i < 3; ++i) {
            this.trappers.push(new Barrel_1.default(this, {
                ...DefenderDefinition,
                angle: util_1.PI2 * ((i / 3) - 1 / 6)
            }));
            const base = new AutoTurret_1.default(this, MountedTurretDefinition);
            base.influencedByOwnerInputs = true;
            const angle = base.ai.inputs.mouse.angle = util_1.PI2 * (i / 3);
            base.positionData.values.y = this.physicsData.values.size * Math.sin(angle) * 0.6;
            base.positionData.values.x = this.physicsData.values.size * Math.cos(angle) * 0.6;
            base.physicsData.values.flags |= 1;
            const tickBase = base.tick;
            base.tick = (tick) => {
                base.positionData.y = this.physicsData.values.size * Math.sin(angle) * 0.6;
                base.positionData.x = this.physicsData.values.size * Math.cos(angle) * 0.6;
                tickBase.call(base, tick);
            };
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
exports.default = Defender;
