"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddonById = exports.PronouncedAddon = exports.AutoTurretDefinition = exports.LauncherTallAddon = exports.SpinnerBarrelAddon = exports.GliderAddon = exports.LauncherAddon = exports.GuardObject3 = exports.GuardObject2 = exports.GuardObject = exports.OverdriveAddon = exports.Addon = void 0;
const Object_1 = require("../Object");
const AutoTurret_1 = require("./AutoTurret");
const TankBody_1 = require("./TankBody");
const AI_1 = require("../AI");
const Live_1 = require("../Live");
const util_1 = require("../../util");
const Barrel_1 = require("./Barrel");
class Addon {
    constructor(owner) {
        this.owner = owner;
        this.game = owner.game;
    }
    createGuard(sides, sizeRatio, offsetAngle, radiansPerTick) {
        return new GuardObject(this.game, this.owner, sides, sizeRatio, offsetAngle, radiansPerTick);
    }
    createGuard2() {
        return new OverdriveAddon(1.15, this.owner, 6);
    }
    createGuard3() {
        return new OverdriveAddon(1.15, this.owner, 3);
    }
    createAutoTurrets(count) {
        const rotPerTick = AI_1.AI.PASSIVE_ROTATION;
        const MAX_ANGLE_RANGE = util_1.PI2 / 4;
        const rotator = this.createGuard(1, .1, 0, rotPerTick);
        rotator.turrets = [];
        const ROT_OFFSET = 0.8;
        if (rotator.styleData.values.flags & 1)
            rotator.styleData.values.flags ^= 1;
        for (let i = 0; i < count; ++i) {
            const base = new AutoTurret_1.default(rotator, AutoTurretMiniDefinition);
            base.influencedByOwnerInputs = true;
            const angle = base.ai.inputs.mouse.angle = util_1.PI2 * (i / count);
            base.ai.passiveRotation = rotPerTick;
            base.ai.targetFilter = (targetPos) => {
                const pos = base.getWorldPosition();
                const angleToTarget = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
                const deltaAngle = (0, util_1.normalizeAngle)(angleToTarget - ((angle + rotator.positionData.values.angle)));
                return deltaAngle < MAX_ANGLE_RANGE || deltaAngle > (util_1.PI2 - MAX_ANGLE_RANGE);
            };
            base.positionData.values.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
            base.positionData.values.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;
            if (base.styleData.values.flags & 64)
                base.styleData.values.flags ^= 64;
            base.physicsData.values.flags |= 1;
            const tickBase = base.tick;
            base.tick = (tick) => {
                base.positionData.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
                base.positionData.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;
                tickBase.call(base, tick);
                if (base.ai.state === 0)
                    base.positionData.angle = angle + rotator.positionData.values.angle;
            };
            rotator.turrets.push(base);
        }
        return rotator;
    }
    createAutoAutoTurrets(count) {
        const rotPerTick = AI_1.AI.PASSIVE_ROTATION;
        const MAX_ANGLE_RANGE = util_1.PI2 / 4;
        const rotator = this.createGuard(1, .1, 0, rotPerTick);
        rotator.turrets = [];
        const ROT_OFFSET = 0.8;
        if (rotator.styleData.values.flags & 1)
            rotator.styleData.values.flags ^= 1;
        for (let i = 0; i < count; ++i) {
            const base = new AutoTurret_1.default(rotator, AutoAutoTurretMiniDefinition);
            base.influencedByOwnerInputs = true;
            const angle = base.ai.inputs.mouse.angle = util_1.PI2 * (i / count);
            base.ai.passiveRotation = rotPerTick;
            base.ai.targetFilter = (targetPos) => {
                const pos = base.getWorldPosition();
                const angleToTarget = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
                const deltaAngle = (0, util_1.normalizeAngle)(angleToTarget - ((angle + rotator.positionData.values.angle)));
                return deltaAngle < MAX_ANGLE_RANGE || deltaAngle > (util_1.PI2 - MAX_ANGLE_RANGE);
            };
            base.positionData.values.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
            base.positionData.values.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;
            if (base.styleData.values.flags & 64)
                base.styleData.values.flags ^= 64;
            base.physicsData.values.flags |= 1;
            const tickBase = base.tick;
            base.tick = (tick) => {
                base.positionData.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
                base.positionData.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;
                tickBase.call(base, tick);
                if (base.ai.state === 0)
                    base.positionData.angle = angle + rotator.positionData.values.angle;
            };
            rotator.turrets.push(base);
        }
        return rotator;
    }
    createAutoTurrets1(count) {
        const rotPerTick = AI_1.AI.PASSIVE_ROTATION;
        const MAX_ANGLE_RANGE = util_1.PI2 / 4;
        const rotator = this.createGuard(1, .1, 0, rotPerTick);
        rotator.turrets = [];
        const ROT_OFFSET = 0.8;
        if (rotator.styleData.values.flags & 1)
            rotator.styleData.values.flags ^= 1;
        for (let i = 0; i < count; ++i) {
            const base = new AutoTurret_1.default(this.owner, AutoTurretMiniDefinition);
            base.influencedByOwnerInputs = true;
            const angle = base.ai.inputs.mouse.angle = util_1.PI2 * ((i / count) - 1 / (count * 2));
            base.ai.targetFilter = (targetPos) => {
                const pos = base.getWorldPosition();
                const angleToTarget = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
                const deltaAngle = (0, util_1.normalizeAngle)(angleToTarget - ((angle + this.owner.positionData.values.angle)));
                return deltaAngle < MAX_ANGLE_RANGE || deltaAngle > (util_1.PI2 - MAX_ANGLE_RANGE);
            };
            base.positionData.values.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
            base.positionData.values.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;
            if (base.styleData.values.flags & 64)
                base.styleData.values.flags ^= 64;
            base.physicsData.values.flags |= 1;
            const tickBase = base.tick;
            base.tick = (tick) => {
                base.positionData.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
                base.positionData.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;
                tickBase.call(base, tick);
                if (base.ai.state === 0)
                    base.positionData.angle = angle + this.owner.positionData.values.angle;
            };
            rotator.turrets.push(base);
        }
        return rotator;
    }
    createAutoMachineTurrets(count) {
        const rotPerTick = AI_1.AI.PASSIVE_ROTATION * 6;
        const MAX_ANGLE_RANGE = util_1.PI2 / 4;
        const rotator = this.createGuard(1, .1, 0, rotPerTick);
        rotator.turrets = [];
        const ROT_OFFSET = 0.8;
        if (rotator.styleData.values.flags & 1)
            rotator.styleData.values.flags ^= 1;
        for (let i = 0; i < count; ++i) {
            const base = new AutoTurret_1.default(rotator, { ...AutoTurretMiniDefinition, reload: 0.5, isTrapezoid: true,
                bullet: {
                    type: "bullet",
                    health: 0.875,
                    damage: 0.3,
                    speed: 1.2,
                    scatterRate: 3,
                    lifeLength: 1,
                    sizeRatio: 1,
                    absorbtionFactor: 1
                } });
            base.influencedByOwnerInputs = true;
            const angle = base.ai.inputs.mouse.angle = util_1.PI2 * ((i / count) - 1 / (count * 2));
            base.ai.passiveRotation = rotPerTick;
            base.ai.targetFilter = (targetPos) => {
                const pos = base.getWorldPosition();
                const angleToTarget = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
                const deltaAngle = (0, util_1.normalizeAngle)(angleToTarget - ((angle + rotator.positionData.values.angle)));
                return deltaAngle < MAX_ANGLE_RANGE || deltaAngle > (util_1.PI2 - MAX_ANGLE_RANGE);
            };
            base.positionData.values.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
            base.positionData.values.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;
            if (base.styleData.values.flags & 64)
                base.styleData.values.flags ^= 64;
            base.physicsData.values.flags |= 1;
            const tickBase = base.tick;
            base.tick = (tick) => {
                base.positionData.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
                base.positionData.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;
                tickBase.call(base, tick);
                if (base.ai.state === 0)
                    base.positionData.angle = angle + rotator.positionData.values.angle;
            };
            rotator.turrets.push(base);
        }
        return rotator;
    }
    createAutoTurretsWeak(count) {
        const rotPerTick = AI_1.AI.PASSIVE_ROTATION;
        const MAX_ANGLE_RANGE = util_1.PI2 / 4;
        const rotator = this.createGuard(1, .1, 0, rotPerTick);
        rotator.turrets = [];
        const ROT_OFFSET = 0.8;
        if (rotator.styleData.values.flags & 1)
            rotator.styleData.values.flags ^= 1;
        for (let i = 0; i < count; ++i) {
            const base = new AutoTurret_1.default(this.owner, { ...AutoTurretMiniDefinition, reload: 1, delay: 0.25 });
            base.influencedByOwnerInputs = false;
            const angle = base.ai.inputs.mouse.angle = util_1.PI2 * ((i / count) - 1 / (count * 2));
            base.ai.targetFilter = (targetPos) => {
                const pos = base.getWorldPosition();
                const angleToTarget = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
                const deltaAngle = (0, util_1.normalizeAngle)(angleToTarget - ((angle + this.owner.positionData.values.angle)));
                return deltaAngle < MAX_ANGLE_RANGE || deltaAngle > (util_1.PI2 - MAX_ANGLE_RANGE);
            };
            base.positionData.values.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
            base.positionData.values.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;
            if (base.styleData.values.flags & 64)
                base.styleData.values.flags ^= 64;
            base.physicsData.values.flags |= 1;
            const tickBase = base.tick;
            base.tick = (tick) => {
                base.positionData.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
                base.positionData.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;
                tickBase.call(base, tick);
                if (base.ai.state === 0)
                    base.positionData.angle = angle + this.owner.positionData.values.angle;
            };
            rotator.turrets.push(base);
        }
        return rotator;
    }
    createAutoTurretsDisconnected(count) {
        const rotPerTick = AI_1.AI.PASSIVE_ROTATION;
        const MAX_ANGLE_RANGE = util_1.PI2;
        const MAX_ANGLE_RANGE2 = util_1.PI2;
        const rotator = new GuardObject3(this.game, this.owner, 1, .1, 0, rotPerTick);
        rotator.turrets = [];
        rotator.styleData.values.zIndex += 2;
        const ROT_OFFSET = 1.8;
        rotator.styleData.values.flags |= 64;
        if (rotator.styleData.values.flags & 1)
            rotator.styleData.values.flags ^= 1;
        if (rotator.styleData.values.flags & 64)
            rotator.styleData.values.flags |= 64;
        const tickBaserot = rotator.tick;
        rotator.tick = (tick) => {
            if (rotator.styleData.zIndex !== this.owner.styleData.zIndex + 1) {
                rotator.styleData.zIndex = this.owner.styleData.zIndex + 5;
            }
            tickBaserot.call(rotator, tick);
        };
        for (let i = 0; i < count; ++i) {
            const base = new AutoTurret_1.default(rotator, { ...AutoTurretMiniDefinitionabove, reload: 1.2 });
            base.styleData.values.zIndex += 2;
            base.turret[0].styleData.values.zIndex += 2;
            base.influencedByOwnerInputs = true;
            base.relationsData.owner = this.owner;
            base.styleData.values.flags |= 64;
            const angle = base.ai.inputs.mouse.angle = util_1.PI2 * (i / count);
            base.ai.passiveRotation = rotPerTick;
            base.ai.targetFilter = (targetPos) => {
                const pos = base.getWorldPosition();
                const angleToTarget = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
                const deltaAngle = (0, util_1.normalizeAngle)(angleToTarget - ((angle + rotator.positionData.values.angle)));
                return deltaAngle < MAX_ANGLE_RANGE || deltaAngle > (util_1.PI2 - MAX_ANGLE_RANGE);
            };
            base.positionData.values.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
            base.positionData.values.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;
            base.physicsData.values.flags |= 1;
            const tickBase = base.tick;
            base.tick = (tick) => {
                base.positionData.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
                base.positionData.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;
                tickBase.call(base, tick);
                if (base.ai.state === 0)
                    base.positionData.angle = angle + rotator.positionData.values.angle;
            };
            rotator.turrets.push(base);
        }
        return rotator;
    }
    createJoints(count) {
        const rotPerTick = AI_1.AI.PASSIVE_ROTATION;
        const MAX_ANGLE_RANGE = util_1.PI2;
        const rotator = this.createGuard(1, .1, 0, 0.01);
        rotator.joints = [];
        const ROT_OFFSET = 1.8;
        if (rotator.styleData.values.flags & 1)
            rotator.styleData.values.flags ^= 1;
        for (let i = 0; i < count; ++i) {
            const barr = new Barrel_1.default(rotator, { ...jointpart, angle: util_1.PI2 * ((i / count)) });
            const tickBase2 = barr.tick;
            barr.positionData.values.y += rotator.physicsData.values.size * Math.sin(MAX_ANGLE_RANGE);
            barr.positionData.values.x += rotator.physicsData.values.size * Math.cos(MAX_ANGLE_RANGE);
            barr.tick = (tick) => {
                barr.positionData.y += rotator.physicsData.values.size * Math.sin(MAX_ANGLE_RANGE);
                barr.positionData.x += rotator.physicsData.values.size * Math.cos(MAX_ANGLE_RANGE);
                tickBase2.call(barr, tick);
            };
            rotator.joints.push(barr);
        }
        return rotator;
    }
    createDrones(count) {
        const rotPerTick = AI_1.AI.PASSIVE_ROTATION;
        const MAX_ANGLE_RANGE = util_1.PI2;
        const rotator = this.createGuard(1, .1, 0, 0.01);
        rotator.joints = [];
        const ROT_OFFSET = 1.8;
        if (rotator.styleData.values.flags & 1)
            rotator.styleData.values.flags ^= 1;
        for (let i = 0; i < count; ++i) {
            const barr = new Barrel_1.default(this.owner, { ...dronebarrel, angle: util_1.PI2 * ((i / count)) });
            const tickBase2 = barr.tick;
            barr.positionData.values.y += rotator.physicsData.values.size * Math.sin(MAX_ANGLE_RANGE);
            barr.positionData.values.x += rotator.physicsData.values.size * Math.cos(MAX_ANGLE_RANGE);
            barr.tick = (tick) => {
                barr.positionData.y += rotator.physicsData.values.size * Math.sin(MAX_ANGLE_RANGE);
                barr.positionData.x += rotator.physicsData.values.size * Math.cos(MAX_ANGLE_RANGE);
                tickBase2.call(barr, tick);
            };
            rotator.joints.push(barr);
        }
        return rotator;
    }
    createAutoStalkerTurrets(count) {
        const rotPerTick = AI_1.AI.PASSIVE_ROTATION;
        const MAX_ANGLE_RANGE = util_1.PI2 / 4;
        const rotator = this.createGuard(1, 1.5, 0, rotPerTick);
        rotator.turrets = [];
        rotator.styleData.values.color = 1;
        const ROT_OFFSET = 0.8;
        if (rotator.styleData.values.flags & 1)
            rotator.styleData.values.flags ^= 1;
        for (let i = 0; i < count; ++i) {
            const base = new AutoTurret_1.default(rotator, AutoTurretStalkDefinition);
            base.influencedByOwnerInputs = true;
            base.baseSize *= 1.1;
            const angle = base.ai.inputs.mouse.angle = util_1.PI2 * (i / count);
            base.ai.passiveRotation = rotPerTick;
            base.ai.targetFilter = (targetPos) => {
                const pos = base.getWorldPosition();
                const angleToTarget = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
                const deltaAngle = (0, util_1.normalizeAngle)(angleToTarget - ((angle + rotator.positionData.values.angle)));
                return deltaAngle < MAX_ANGLE_RANGE || deltaAngle > (util_1.PI2 - MAX_ANGLE_RANGE);
            };
            base.positionData.values.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
            base.positionData.values.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;
            if (base.styleData.values.flags & 64)
                base.styleData.values.flags ^= 64;
            base.physicsData.values.flags |= 1;
            const tickBase = base.tick;
            base.tick = (tick) => {
                base.positionData.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
                base.positionData.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;
                tickBase.call(base, tick);
                if (base.ai.state === 0)
                    base.positionData.angle = angle + rotator.positionData.values.angle;
            };
            rotator.turrets.push(base);
        }
        return rotator;
    }
    createAutoTrapTurrets(count) {
        const rotPerTick = AI_1.AI.PASSIVE_ROTATION * 3;
        const MAX_ANGLE_RANGE = util_1.PI2 / 4;
        const rotator = this.createGuard(1, .1, 0, rotPerTick);
        rotator.turrets = [];
        const ROT_OFFSET = 0.8;
        if (rotator.styleData.values.flags & 1)
            rotator.styleData.values.flags ^= 1;
        for (let i = 0; i < count; ++i) {
            const base = new AutoTurret_1.default(rotator, AutoTurretTrapDefinition);
            base.influencedByOwnerInputs = true;
            base.baseSize *= 1.125;
            const angle = base.ai.inputs.mouse.angle = util_1.PI2 * (i / count);
            base.ai.passiveRotation = rotPerTick;
            base.ai.targetbullets = true;
            base.ai.targetFilter = (targetPos) => {
                const pos = base.getWorldPosition();
                const angleToTarget = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
                const deltaAngle = (0, util_1.normalizeAngle)(angleToTarget - ((angle + rotator.positionData.values.angle)));
                return deltaAngle < MAX_ANGLE_RANGE || deltaAngle > (util_1.PI2 - MAX_ANGLE_RANGE);
            };
            base.positionData.values.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
            base.positionData.values.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;
            if (base.styleData.values.flags & 64)
                base.styleData.values.flags ^= 64;
            base.physicsData.values.flags |= 1;
            const tickBase = base.tick;
            base.tick = (tick) => {
                base.positionData.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
                base.positionData.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;
                tickBase.call(base, tick);
                if (base.ai.state === 0)
                    base.positionData.angle = angle + rotator.positionData.values.angle;
            };
            rotator.turrets.push(base);
        }
        return rotator;
    }
    createMegaAutoTurrets(count) {
        const rotPerTick = AI_1.AI.PASSIVE_ROTATION;
        const MAX_ANGLE_RANGE = util_1.PI2 / 4;
        const rotator = this.createGuard(1, .1, 0, rotPerTick);
        rotator.turrets = [];
        const ROT_OFFSET = 0.8;
        if (rotator.styleData.values.flags & 1)
            rotator.styleData.values.flags ^= 1;
        for (let i = 0; i < count; ++i) {
            const base = new AutoTurret_1.default(rotator, AutoTurretMegaDefinition);
            base.influencedByOwnerInputs = true;
            base.baseSize *= 1.25;
            const angle = base.ai.inputs.mouse.angle = util_1.PI2 * (i / count);
            base.ai.passiveRotation = rotPerTick;
            base.ai.targetFilter = (targetPos) => {
                const pos = base.getWorldPosition();
                const angleToTarget = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
                const deltaAngle = (0, util_1.normalizeAngle)(angleToTarget - ((angle + rotator.positionData.values.angle)));
                return deltaAngle < MAX_ANGLE_RANGE || deltaAngle > (util_1.PI2 - MAX_ANGLE_RANGE);
            };
            base.positionData.values.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
            base.positionData.values.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;
            if (base.styleData.values.flags & 64)
                base.styleData.values.flags ^= 64;
            base.physicsData.values.flags |= 1;
            const tickBase = base.tick;
            base.tick = (tick) => {
                base.positionData.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
                base.positionData.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;
                tickBase.call(base, tick);
                if (base.ai.state === 0)
                    base.positionData.angle = angle + rotator.positionData.values.angle;
            };
            rotator.turrets.push(base);
        }
        return rotator;
    }
}
exports.Addon = Addon;
const jointpart = {
    angle: 0,
    offset: 0,
    size: 100,
    width: 25.2,
    delay: 0,
    reload: 8,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    droneCount: 0,
    bullet: {
        type: "pentadrone",
        sizeRatio: 1,
        health: 5,
        damage: 4,
        speed: 3,
        scatterRate: 0,
        lifeLength: -1,
        absorbtionFactor: 1,
    }
};
const dronebarrel = {
    angle: 0,
    offset: 0,
    size: 95,
    width: 42,
    delay: 0,
    reload: 1.2,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        sizeRatio: 1,
        health: 1,
        damage: 0.65,
        speed: 1,
        scatterRate: 1,
        lifeLength: 1,
        absorbtionFactor: 1,
    }
};
const AutoTurretStalkDefinition = {
    angle: 0,
    offset: 0,
    size: 65,
    width: 42 * 0.7,
    delay: 0.01,
    reload: 1.5,
    recoil: 0,
    isTrapezoid: true,
    trapezoidDirection: 3.141592653589793,
    addon: null,
    bullet: {
        type: "bullet",
        health: 1,
        damage: 0.5,
        speed: 1.7,
        scatterRate: 0.3,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const AutoTurretMegaDefinition = {
    angle: 0,
    offset: 0,
    size: 65,
    width: 71.4 * 0.7,
    delay: 0.01,
    reload: 2.5,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 1.35,
        damage: 1.15,
        speed: 0.85,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 0.5
    }
};
const AutoTurretTrapDefinition = {
    angle: 0,
    offset: 0,
    size: 40,
    width: 56.7 * 0.7,
    delay: 0.01,
    reload: 3,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: "noScale",
    bullet: {
        type: "trap",
        health: 1.75,
        damage: 1,
        speed: 2.5,
        scatterRate: 1,
        lifeLength: 2.25,
        sizeRatio: 0.8,
        absorbtionFactor: 0.8
    }
};
const AutoTurretMiniDefinition = {
    angle: 0,
    offset: 0,
    size: 55,
    width: 42 * 0.7,
    delay: 0.01,
    reload: 1,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 1,
        damage: 0.4,
        speed: 1.2,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const AutoTurretMiniDefinitionabove = {
    angle: 0,
    offset: 0,
    size: 55,
    width: 42 * 0.7,
    delay: 0.01,
    reload: 1,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "abovebullet",
        health: 1,
        damage: 0.4,
        speed: 1.2,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const AutoAutoTurretMiniDefinition = {
    angle: 0,
    offset: 0,
    size: 55,
    width: 42 * 0.7,
    delay: 0.01,
    reload: 2,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: "autoLauncher",
    bullet: {
        type: "autobullet",
        health: 1,
        damage: 0.4,
        speed: 0.9,
        scatterRate: 1,
        lifeLength: 1.2,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
class OverdriveAddon extends Addon {
    constructor(sizeRatio, owner, sides) {
        super(owner);
        sizeRatio *= Math.SQRT1_2;
        this.sizeRatio = sizeRatio;
        const oversquare = new Object_1.default(this.game);
        const offsetRatio = 0;
        const size = this.owner.physicsData.values.size;
        oversquare.setParent(this.owner);
        oversquare.relationsData.values.owner = this.owner;
        oversquare.relationsData.values.team = this.owner.relationsData.values.team;
        oversquare.physicsData.values.size = sizeRatio * size;
        oversquare.positionData.values.x = offsetRatio * size;
        oversquare.positionData.values.angle = 0;
        oversquare.styleData.zIndex -= 2;
        oversquare.styleData.values.color = 0;
        oversquare.physicsData.values.sides = sides;
        oversquare.tick = () => {
            const size = this.owner.physicsData.values.size;
            oversquare.styleData.opacity = this.owner.styleData.opacity;
            oversquare.physicsData.size = sizeRatio * size;
            oversquare.positionData.x = offsetRatio * size;
        };
    }
}
exports.OverdriveAddon = OverdriveAddon;
class GuardObject extends Live_1.default {
    constructor(game, owner, sides, sizeRatio, offsetAngle, radiansPerTick) {
        super(game);
        this.damagePerTick = 10;
        this.owner = owner;
        this.inputs = owner.inputs;
        this.cameraEntity = owner.cameraEntity;
        sizeRatio *= Math.SQRT1_2;
        this.sizeRatio = sizeRatio;
        this.radiansPerTick = radiansPerTick;
        this.setParent(owner);
        this.relationsData.values.owner = owner;
        this.relationsData.values.team = owner.relationsData.values.team;
        this.styleData.values.color = 0;
        this.positionData.values.flags |= 1;
        this.positionData.values.angle = offsetAngle;
        this.physicsData.values.sides = sides;
        this.reloadTime = owner.reloadTime;
        this.physicsData.values.size = owner.physicsData.values.size * sizeRatio;
    }
    get sizeFactor() {
        return this.owner.sizeFactor;
    }
    onKill(killedEntity) {
        if (!(this.owner instanceof Live_1.default))
            return;
        this.owner.onKill(killedEntity);
    }
    tick(tick) {
        this.reloadTime = this.owner.reloadTime;
        this.physicsData.size = this.sizeRatio * this.owner.physicsData.values.size;
        this.positionData.angle += this.radiansPerTick;
    }
}
exports.GuardObject = GuardObject;
class GuardObject2 extends Object_1.default {
    constructor(game, owner, sides, sizeRatio, offsetAngle, radiansPerTick) {
        super(game);
        this.owner = owner;
        this.inputs = owner.inputs;
        this.cameraEntity = owner.cameraEntity;
        sizeRatio *= Math.SQRT1_2;
        this.sizeRatio = sizeRatio;
        this.radiansPerTick = radiansPerTick;
        this.setParent(owner);
        this.relationsData.values.owner = owner;
        this.relationsData.values.team = owner.relationsData.values.team;
        this.styleData.zIndex += 2;
        this.styleData.flags |= 64;
        this.styleData.values.color = 0;
        this.positionData.values.flags |= 1;
        this.positionData.values.angle = offsetAngle;
        this.physicsData.values.sides = sides;
        this.reloadTime = owner.reloadTime;
        this.physicsData.values.size = owner.physicsData.values.size * sizeRatio;
    }
    get sizeFactor() {
        return this.owner.sizeFactor;
    }
    onKill(killedEntity) {
        if (!(this.owner instanceof Live_1.default))
            return;
        this.owner.onKill(killedEntity);
    }
    tick(tick) {
        this.reloadTime = this.owner.reloadTime;
        this.physicsData.size = this.sizeRatio * this.owner.physicsData.values.size;
        this.positionData.angle = this.owner.positionData.angle;
    }
}
exports.GuardObject2 = GuardObject2;
class GuardObject3 extends Object_1.default {
    constructor(game, owner, sides, sizeRatio, offsetAngle, radiansPerTick) {
        super(game);
        this.owner = owner;
        this.inputs = owner.inputs;
        this.cameraEntity = owner.cameraEntity;
        sizeRatio *= Math.SQRT1_2;
        this.sizeRatio = sizeRatio;
        this.radiansPerTick = radiansPerTick;
        this.setParent(owner);
        this.relationsData.values.owner = owner;
        this.relationsData.values.team = owner.relationsData.values.team;
        this.styleData.zIndex += 2;
        this.styleData.flags |= 64;
        this.styleData.values.color = 0;
        this.positionData.values.flags |= 1;
        this.positionData.values.angle = offsetAngle;
        this.physicsData.values.sides = sides;
        this.reloadTime = owner.reloadTime;
        this.physicsData.values.size = owner.physicsData.values.size * sizeRatio;
    }
    get sizeFactor() {
        return this.owner.sizeFactor;
    }
    onKill(killedEntity) {
        if (!(this.owner instanceof Live_1.default))
            return;
        this.owner.onKill(killedEntity);
    }
    tick(tick) {
        this.reloadTime = this.owner.reloadTime;
        this.physicsData.size = this.sizeRatio * this.owner.physicsData.values.size;
        this.positionData.angle += this.radiansPerTick;
    }
}
exports.GuardObject3 = GuardObject3;
class SpikeAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(3, 1.3, 0, 0.17);
        this.createGuard(3, 1.3, Math.PI / 3, 0.17);
        this.createGuard(3, 1.3, Math.PI / 6, 0.17);
        this.createGuard(3, 1.3, Math.PI / 2, 0.17);
    }
}
class DomBaseAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(6, 1.24, 0, 0);
    }
}
class SmasherAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(6, 1.15, 0, .1);
    }
}
class VampSmasherAddon extends Addon {
    constructor(owner) {
        super(owner);
        const atuo = new AutoTurret_1.default(owner, {
            angle: 0,
            offset: 0,
            size: 0,
            width: 0,
            delay: 0.01,
            reload: 1.75,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            droneCount: 0,
            bullet: {
                type: "drone",
                sizeRatio: 1,
                health: 0.75,
                damage: 0.5,
                speed: 1,
                scatterRate: 1,
                lifeLength: 0.75,
                absorbtionFactor: 0.1
            }
        });
        atuo.ai.viewRange = 0;
        atuo.styleData.color = 26;
        const b = this.createGuard(3, 1.4, 0, .1);
        b.styleData.color = 26;
        const c = this.createGuard(3, 1.4, -Math.PI / 3, .1);
        c.styleData.color = 26;
        this.createGuard(6, 1.15, 0, .1);
    }
}
class OverDriveAddon extends Addon {
    constructor(owner) {
        super(owner);
        const b = new GuardObject2(this.game, this.owner, 4, 0.55, 0, 0);
        ;
        b.styleData.color = 1;
    }
}
class RotatorAddon extends Addon {
    constructor(owner) {
        super(owner);
        const rotator = new GuardObject3(this.game, owner, 1, 0.75, 0, 0.1);
        rotator.styleData.color = 1;
        const offsetRatio = 40 / 50;
        const size = this.owner.physicsData.values.size;
        rotator.physicsData.size = owner.sizeFactor * 25;
        rotator.positionData.angle = owner.positionData.angle;
        const tickBase2 = rotator.tick;
        rotator.tick = (tick) => {
            rotator.physicsData.size = owner.sizeFactor * 25;
            tickBase2.call(rotator, tick);
        };
        for (let i = 0; i < 2; ++i) {
            const AutoTurretDefinition = {
                angle: util_1.PI2 / 2 * i + Math.PI / 2,
                offset: 0,
                size: 55,
                width: 42 * 0.7,
                delay: 0.01,
                reload: 1,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    health: 1,
                    damage: 0.3,
                    speed: 1.2,
                    scatterRate: 1,
                    lifeLength: 1,
                    sizeRatio: 1,
                    absorbtionFactor: 1
                }
            };
            const base = new Barrel_1.default(rotator, AutoTurretDefinition);
        }
    }
}
class WhirlygigAddon extends Addon {
    constructor(owner) {
        super(owner);
        const rotator = new GuardObject3(this.game, owner, 1, 0.75, 0, 0.1);
        rotator.styleData.color = 1;
        const offsetRatio = 40 / 50;
        const size = this.owner.physicsData.values.size;
        rotator.physicsData.size = owner.sizeFactor * 25;
        rotator.positionData.angle = owner.positionData.angle;
        const tickBase2 = rotator.tick;
        rotator.tick = (tick) => {
            rotator.physicsData.size = owner.sizeFactor * 25;
            tickBase2.call(rotator, tick);
        };
        for (let i = 0; i < 4; ++i) {
            const AutoTurretDefinition = {
                angle: util_1.PI2 / 4 * i,
                offset: 0,
                size: 55,
                width: 42 * 0.7,
                delay: 0.01,
                reload: 1,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    health: 1,
                    damage: 0.3,
                    speed: 1.2,
                    scatterRate: 1,
                    lifeLength: 1,
                    sizeRatio: 1,
                    absorbtionFactor: 1
                }
            };
            const base = new Barrel_1.default(rotator, AutoTurretDefinition);
        }
    }
}
class SpinnerAddon extends Addon {
    constructor(owner) {
        super(owner);
        const rotator = new GuardObject3(this.game, owner, 1, 0.75, 0, 0.1);
        rotator.styleData.color = 1;
        const offsetRatio = 40 / 50;
        const size = this.owner.physicsData.values.size;
        rotator.physicsData.size = owner.sizeFactor * 25;
        rotator.positionData.angle = owner.positionData.angle;
        const tickBase2 = rotator.tick;
        rotator.tick = (tick) => {
            rotator.physicsData.size = owner.sizeFactor * 25;
            tickBase2.call(rotator, tick);
        };
        for (let i = 0; i < 3; ++i) {
            const AutoTurretDefinition = {
                angle: util_1.PI2 / 3 * i,
                offset: 0,
                size: 55,
                width: 42 * 0.7,
                delay: 0.01,
                reload: 1,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    health: 1,
                    damage: 0.3,
                    speed: 1.2,
                    scatterRate: 1,
                    lifeLength: 1,
                    sizeRatio: 1,
                    absorbtionFactor: 1
                }
            };
            const base = new Barrel_1.default(rotator, AutoTurretDefinition);
        }
        for (let i = 0; i < 3; ++i) {
            const AutoTurretDefinition = {
                angle: util_1.PI2 / 3 * i + util_1.PI2 / 6,
                offset: 0,
                size: 55,
                width: 42 * 0.7,
                delay: 0.51,
                reload: 1,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    health: 1,
                    damage: 0.3,
                    speed: 1.2,
                    scatterRate: 1,
                    lifeLength: 1,
                    sizeRatio: 1,
                    absorbtionFactor: 1
                }
            };
            const base = new Barrel_1.default(rotator, AutoTurretDefinition);
        }
    }
}
class RotaryAddon extends Addon {
    constructor(owner) {
        super(owner);
        const rotator = new GuardObject3(this.game, owner, 1, 0.75, 0, 0);
        rotator.styleData.color = 1;
        const offsetRatio = 40 / 50;
        const size = this.owner.physicsData.values.size;
        rotator.physicsData.size = owner.sizeFactor * 25;
        rotator.positionData.angle = owner.positionData.angle;
        const tickBase2 = rotator.tick;
        rotator.tick = (tick) => {
            rotator.physicsData.size = owner.sizeFactor * 25;
            rotator.positionData.angle += ((1 - owner.reloadspeed) * 0.5);
            tickBase2.call(rotator, tick);
        };
        for (let i = 0; i < 4; ++i) {
            const AutoTurretDefinition = {
                angle: util_1.PI2 / 4 * i,
                offset: 0,
                size: 55,
                width: 42 * 0.7,
                delay: 0.01,
                reload: 1,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    health: 0.45,
                    damage: 0.5,
                    speed: 1.1,
                    scatterRate: 1,
                    lifeLength: 0.5,
                    sizeRatio: 1,
                    absorbtionFactor: 1
                }
            };
            const base = new Barrel_1.default(rotator, AutoTurretDefinition);
        }
    }
}
class BumperAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(1, 1.75, 0, .1);
    }
}
class WhirlwindAddon extends Addon {
    constructor(owner) {
        super(owner);
        const x = this.createGuard(1, 1.75, 0, .1);
        x.styleData.color = 1;
    }
}
class MultiBoxAddon extends Addon {
    constructor(owner) {
        super(owner);
        const pronounce = new Object_1.default(this.game);
        const size = this.owner.physicsData.values.size;
        pronounce.setParent(this.owner);
        pronounce.relationsData.values.owner = this.owner;
        pronounce.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce.physicsData.values.size = size * 0.5;
        pronounce.styleData.flags |= 64;
        pronounce.styleData.values.color = owner.styleData.values.color;
        pronounce.physicsData.values.sides = 1;
        const tickBase = pronounce.tick;
        pronounce.tick = (tick) => {
            const size = this.owner.physicsData.values.size;
            pronounce.physicsData.size = size * 0.5;
            tickBase.call(pronounce, tick);
        };
    }
}
class MultiBoxxerAddon extends Addon {
    constructor(owner) {
        super(owner);
        const pronounce = new Object_1.default(this.game);
        const size = this.owner.physicsData.values.size;
        pronounce.setParent(this.owner);
        pronounce.relationsData.values.owner = this.owner;
        pronounce.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce.physicsData.values.size = size * 0.5;
        pronounce.styleData.flags |= 64;
        pronounce.styleData.values.color = owner.styleData.values.color;
        pronounce.physicsData.values.sides = 1;
        const tickBase = pronounce.tick;
        pronounce.tick = (tick) => {
            const size = this.owner.physicsData.values.size;
            pronounce.physicsData.size = size * 0.5;
            tickBase.call(pronounce, tick);
        };
        const pronounce2 = new Object_1.default(this.game);
        pronounce2.setParent(this.owner);
        pronounce2.relationsData.values.owner = this.owner;
        pronounce2.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce2.physicsData.values.size = size * 0.25;
        pronounce2.styleData.flags |= 64;
        pronounce2.styleData.values.color = owner.styleData.values.color;
        pronounce2.physicsData.values.sides = 1;
        const tickBase2 = pronounce2.tick;
        pronounce2.tick = (tick) => {
            const size = this.owner.physicsData.values.size;
            pronounce2.physicsData.size = size * 0.25;
            tickBase2.call(pronounce2, tick);
        };
    }
}
class LandmineAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(6, 1.15, 0, .1);
        this.createGuard(6, 1.15, 0, .05);
    }
}
class LauncherAddon extends Addon {
    constructor(owner) {
        super(owner);
        const launcher = new Object_1.default(this.game);
        const sizeRatio = 65.5 * Math.SQRT2 / 50;
        const widthRatio = 33.6 / 50;
        const size = this.owner.physicsData.values.size;
        launcher.setParent(this.owner);
        launcher.relationsData.values.owner = this.owner;
        launcher.relationsData.values.team = this.owner.relationsData.values.team;
        launcher.physicsData.values.size = sizeRatio * size;
        launcher.physicsData.values.width = widthRatio * size;
        launcher.positionData.values.x = launcher.physicsData.values.size / 2;
        launcher.styleData.values.color = 1;
        launcher.physicsData.values.flags |= 1;
        launcher.physicsData.values.sides = 2;
        launcher.tick = () => {
            const size = this.owner.physicsData.values.size;
            launcher.physicsData.size = sizeRatio * size;
            launcher.physicsData.width = widthRatio * size;
            launcher.positionData.x = launcher.physicsData.values.size / 2;
        };
    }
}
exports.LauncherAddon = LauncherAddon;
class GliderAddon extends Addon {
    constructor(owner) {
        super(owner);
        const launcher = new Object_1.default(this.game);
        const sizeRatio = 65.5 * Math.SQRT2 / 50;
        const widthRatio = 33.6 / 50;
        const size = this.owner.physicsData.values.size;
        launcher.setParent(this.owner);
        launcher.relationsData.values.owner = this.owner;
        launcher.relationsData.values.team = this.owner.relationsData.values.team;
        launcher.positionData.values.angle = Math.PI;
        launcher.physicsData.values.size = sizeRatio * size;
        launcher.physicsData.values.width = widthRatio * size;
        launcher.positionData.values.x = launcher.physicsData.values.size / 2;
        launcher.styleData.values.color = 1;
        launcher.physicsData.values.flags |= 1;
        launcher.physicsData.values.sides = 2;
        launcher.tick = () => {
            const size = this.owner.physicsData.values.size;
            launcher.physicsData.size = sizeRatio * size;
            launcher.physicsData.width = widthRatio * size;
            launcher.positionData.x = launcher.physicsData.values.size / 2;
        };
    }
}
exports.GliderAddon = GliderAddon;
class SpinnerBarrelAddon extends Addon {
    constructor(owner) {
        super(owner);
        const launcher = new Object_1.default(this.game);
        const sizeRatio = 65.5 * Math.SQRT2 / 50;
        const widthRatio = 26.88 / 50;
        const size = this.owner.physicsData.values.size;
        launcher.setParent(this.owner);
        launcher.relationsData.values.owner = this.owner;
        launcher.relationsData.values.team = this.owner.relationsData.values.team;
        launcher.physicsData.values.size = sizeRatio * size;
        launcher.physicsData.values.width = widthRatio * size;
        launcher.positionData.values.x = launcher.physicsData.values.size / 2;
        launcher.styleData.values.color = 1;
        launcher.physicsData.values.flags |= 1;
        launcher.physicsData.values.sides = 2;
        launcher.tick = () => {
            const size = this.owner.physicsData.values.size;
            launcher.physicsData.size = sizeRatio * size;
            launcher.physicsData.width = widthRatio * size;
            launcher.positionData.x = launcher.physicsData.values.size / 2;
        };
    }
}
exports.SpinnerBarrelAddon = SpinnerBarrelAddon;
class LauncherTallAddon extends Addon {
    constructor(owner) {
        super(owner);
        const launcher = new Object_1.default(this.game);
        const sizeRatio = 80 * Math.SQRT2 / 50;
        const widthRatio = 32.8571428571 / 50;
        const size = this.owner.physicsData.values.size;
        launcher.setParent(this.owner);
        launcher.relationsData.values.owner = this.owner;
        launcher.relationsData.values.team = this.owner.relationsData.values.team;
        launcher.physicsData.values.size = sizeRatio * size;
        launcher.physicsData.values.width = widthRatio * size;
        launcher.positionData.values.x = launcher.physicsData.values.size / 2;
        launcher.styleData.values.color = 1;
        launcher.physicsData.values.flags |= 1;
        launcher.physicsData.values.sides = 2;
        launcher.tick = () => {
            const size = this.owner.physicsData.values.size;
            launcher.physicsData.size = sizeRatio * size;
            launcher.physicsData.width = widthRatio * size;
            launcher.positionData.x = launcher.physicsData.values.size / 2;
        };
    }
}
exports.LauncherTallAddon = LauncherTallAddon;
class LauncherSmallAddon extends Addon {
    constructor(owner) {
        super(owner);
        const launcher = new Object_1.default(this.game);
        const sizeRatio = 65.5 * Math.SQRT2 / 50;
        const widthRatio = 39.375 / 50;
        const size = this.owner.physicsData.values.size;
        launcher.setParent(this.owner);
        launcher.relationsData.values.owner = this.owner;
        launcher.relationsData.values.team = this.owner.relationsData.values.team;
        launcher.styleData.zIndex += 1;
        launcher.physicsData.values.size = sizeRatio * size;
        launcher.physicsData.values.width = widthRatio * size;
        launcher.positionData.values.x = launcher.physicsData.values.size / 2;
        launcher.styleData.values.color = 1;
        launcher.physicsData.values.sides = 2;
        launcher.tick = () => {
            const size = this.owner.physicsData.values.size;
            launcher.physicsData.size = sizeRatio * size;
            launcher.physicsData.width = widthRatio * size;
            launcher.positionData.x = launcher.physicsData.values.size / 2;
        };
    }
}
class Launcher2SmallAddon extends Addon {
    constructor(owner) {
        super(owner);
        const launcher = new Object_1.default(this.game);
        const sizeRatio = 65.5 * Math.SQRT2 / 50;
        const widthRatio = 39.375 / 50;
        const size = this.owner.physicsData.values.size;
        launcher.setParent(this.owner);
        launcher.relationsData.values.owner = this.owner;
        launcher.relationsData.values.team = this.owner.relationsData.values.team;
        launcher.styleData.zIndex += 1;
        launcher.physicsData.values.size = sizeRatio * size;
        launcher.physicsData.values.width = widthRatio * size;
        launcher.positionData.values.x = launcher.physicsData.values.size / 2;
        launcher.styleData.values.color = 1;
        launcher.physicsData.values.sides = 2;
        launcher.tick = () => {
            const size = this.owner.physicsData.values.size;
            launcher.physicsData.size = sizeRatio * size;
            launcher.physicsData.width = widthRatio * size;
            launcher.positionData.x = launcher.physicsData.values.size / 2;
        };
    }
}
class LauncherAddon2 extends Addon {
    constructor(owner) {
        super(owner);
        for (let i = 0; i < 3; ++i) {
            const angle = util_1.PI2 * ((i / 3));
            const angle2 = util_1.PI2 * ((i / 3) - 1 / (6));
            const launcher = new Object_1.default(this.game);
            const sizeRatio = 65.5 * Math.SQRT2 / 50;
            const widthRatio = 31.5 / 50;
            const size = this.owner.physicsData.values.size;
            launcher.setParent(this.owner);
            launcher.relationsData.values.owner = this.owner;
            launcher.relationsData.values.team = this.owner.relationsData.values.team;
            launcher.physicsData.values.size = sizeRatio * size;
            launcher.physicsData.values.width = widthRatio * size;
            launcher.positionData.values.x = launcher.physicsData.values.size / 2;
            launcher.styleData.values.color = 1;
            launcher.physicsData.values.sides = 2;
            launcher.positionData.angle = angle;
            const tickBase2 = launcher.tick;
            launcher.positionData.values.x = Math.cos(angle) * this.owner.physicsData.values.size;
            launcher.positionData.values.y = Math.sin(angle) * this.owner.physicsData.values.size;
            launcher.tick = (tick) => {
                const size = this.owner.physicsData.values.size;
                launcher.physicsData.size = sizeRatio * size;
                launcher.physicsData.width = widthRatio * size;
                launcher.positionData.x = Math.cos(angle) * launcher.physicsData.values.size / 2;
                launcher.positionData.y = Math.sin(angle) * launcher.physicsData.values.size / 2;
                tickBase2.call(launcher, tick);
            };
        }
    }
}
class AutoTurretAddon extends Addon {
    constructor(owner) {
        super(owner);
        if (this.owner instanceof TankBody_1.default) {
            if (this.owner.currentTank == 253) {
                const turret = new AutoTurret_1.default(owner, exports.AutoTurretDefinition);
                turret.influencedByOwnerInputs = true;
            }
            else {
                new AutoTurret_1.default(owner);
            }
        }
        else {
            new AutoTurret_1.default(owner);
        }
    }
}
exports.AutoTurretDefinition = {
    angle: 0,
    offset: 0,
    size: 55,
    width: 42 * 0.7,
    delay: 0.01,
    reload: 1,
    recoil: 0.3,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 1,
        damage: 1,
        speed: 1.2,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
class AutoTurretControllAddon extends Addon {
    constructor(owner) {
        super(owner);
        const turret = new AutoTurret_1.default(owner, exports.AutoTurretDefinition);
        turret.influencedByOwnerInputs = true;
    }
}
class PsiAddon extends Addon {
    constructor(owner) {
        super(owner);
        const atuo = new AutoTurret_1.default(owner, {
            angle: 0,
            offset: 0,
            size: 0,
            width: 0,
            delay: 0.01,
            reload: 1.75,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            droneCount: 0,
            bullet: {
                type: "drone",
                sizeRatio: 1,
                health: 0.75,
                damage: 0.5,
                speed: 1,
                scatterRate: 1,
                lifeLength: 0.75,
                absorbtionFactor: 0.1
            }
        });
        atuo.baseSize *= 1;
        atuo.ai.viewRange = 0;
        atuo.styleData.color = 21;
    }
}
class VampAddon extends Addon {
    constructor(owner) {
        super(owner);
        const atuo = new AutoTurret_1.default(owner, {
            angle: 0,
            offset: 0,
            size: 0,
            width: 0,
            delay: 0.01,
            reload: 1.75,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            droneCount: 0,
            bullet: {
                type: "drone",
                sizeRatio: 1,
                health: 0.75,
                damage: 0.5,
                speed: 1,
                scatterRate: 1,
                lifeLength: 0.75,
                absorbtionFactor: 0.1
            }
        });
        atuo.ai.viewRange = 0;
        atuo.styleData.color = 26;
    }
}
class AutoVampAddon extends Addon {
    constructor(owner) {
        super(owner);
        const base = new AutoTurret_1.default(owner, [{
                angle: 0,
                offset: 0,
                size: 60,
                width: 21 * 0.7,
                delay: 0.01,
                reload: 2,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "leach",
                    health: 1,
                    damage: 0.5,
                    speed: 1.2,
                    scatterRate: 1,
                    lifeLength: 1,
                    sizeRatio: 1,
                    absorbtionFactor: 0.5
                }
            }, {
                angle: 0,
                offset: 0,
                size: 40,
                width: 42 * 0.7,
                delay: 0.01,
                reload: 1,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                droneCount: 0,
                bullet: {
                    type: "drone",
                    health: 1,
                    damage: 0.2,
                    speed: 1.2,
                    scatterRate: 1,
                    lifeLength: 1,
                    sizeRatio: 1,
                    absorbtionFactor: 0.5
                }
            }]);
        const atuo = new AutoTurret_1.default(owner, {
            angle: 0,
            offset: 0,
            size: 0,
            width: 0,
            delay: 0.01,
            reload: 1.75,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            droneCount: 0,
            bullet: {
                type: "drone",
                sizeRatio: 1,
                health: 0.75,
                damage: 0.5,
                speed: 1,
                scatterRate: 1,
                lifeLength: 0.75,
                absorbtionFactor: 0.1
            }
        });
        atuo.ai.viewRange = 0;
        atuo.baseSize *= 0.5;
        atuo.styleData.color = 26;
    }
}
class AutoSmasherAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(6, 1.15, 0, .1);
        const base = new AutoTurret_1.default(owner, {
            angle: 0,
            offset: 0,
            size: 55,
            width: 42 * 0.7,
            delay: 0.01,
            reload: 1,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "bullet",
                health: 1,
                damage: 0.6,
                speed: 1.2,
                scatterRate: 1,
                lifeLength: 1,
                sizeRatio: 1,
                absorbtionFactor: 0.5
            }
        });
        base.influencedByOwnerInputs = true;
    }
}
class Auto5Addon extends Addon {
    constructor(owner) {
        super(owner);
        this.createAutoTurrets(5);
    }
}
class Auto3Addon extends Addon {
    constructor(owner) {
        super(owner);
        this.createAutoTurrets(3);
    }
}
class AutoAuto3Addon extends Addon {
    constructor(owner) {
        super(owner);
        this.createAutoAutoTurrets(3);
    }
}
class Auto1Addon extends Addon {
    constructor(owner) {
        super(owner);
        this.createAutoTurrets1(1);
    }
}
class Joint3Addon extends Addon {
    constructor(owner) {
        super(owner);
        this.createJoints(3);
        this.createAutoTurretsDisconnected(3);
    }
}
class Banshee extends Addon {
    constructor(owner) {
        super(owner);
        this.createAutoTurretsWeak(3);
    }
}
class PronouncedAddon extends Addon {
    constructor(owner) {
        super(owner);
        const pronounce = new Object_1.default(this.game);
        const sizeRatio = 50 / 50;
        const widthRatio = 42 / 50;
        const offsetRatio = 40 / 50;
        const size = this.owner.physicsData.values.size;
        pronounce.setParent(this.owner);
        pronounce.relationsData.values.owner = this.owner;
        pronounce.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce.physicsData.values.size = sizeRatio * size;
        pronounce.physicsData.values.width = widthRatio * size;
        pronounce.positionData.values.x = offsetRatio * size;
        pronounce.positionData.values.angle = Math.PI;
        pronounce.styleData.values.color = 1;
        pronounce.physicsData.values.flags |= 1;
        pronounce.physicsData.values.sides = 2;
        pronounce.tick = () => {
            const size = this.owner.physicsData.values.size;
            pronounce.physicsData.size = sizeRatio * size;
            pronounce.physicsData.width = widthRatio * size;
            pronounce.positionData.x = offsetRatio * size;
        };
    }
}
exports.PronouncedAddon = PronouncedAddon;
class PronouncedAddon2 extends Addon {
    constructor(owner) {
        super(owner);
        const pronounce = new Object_1.default(this.game);
        const sizeRatio = 50 / 50;
        const widthRatio = 54.6 / 50;
        const offsetRatio = 40 / 50;
        const size = this.owner.physicsData.values.size;
        pronounce.setParent(this.owner);
        pronounce.relationsData.values.owner = this.owner;
        pronounce.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce.physicsData.values.size = sizeRatio * size;
        pronounce.physicsData.values.width = widthRatio * size;
        pronounce.positionData.values.x = offsetRatio * size;
        pronounce.positionData.values.angle = Math.PI;
        pronounce.styleData.values.color = 1;
        pronounce.physicsData.values.flags |= 1;
        pronounce.physicsData.values.sides = 2;
        pronounce.tick = () => {
            const size = this.owner.physicsData.values.size;
            pronounce.physicsData.size = sizeRatio * size;
            pronounce.physicsData.width = widthRatio * size;
            pronounce.positionData.x = offsetRatio * size;
        };
    }
}
class PronouncedDomAddon extends Addon {
    constructor(owner) {
        super(owner);
        const pronounce = new Object_1.default(this.game);
        const sizeRatio = 22 / 50;
        const widthRatio = 35 / 50;
        const offsetRatio = 50 / 50;
        const size = this.owner.physicsData.values.size;
        pronounce.setParent(this.owner);
        pronounce.relationsData.values.owner = this.owner;
        pronounce.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce.physicsData.values.size = sizeRatio * size;
        pronounce.physicsData.values.width = widthRatio * size;
        pronounce.positionData.values.x = offsetRatio * size;
        pronounce.positionData.values.angle = Math.PI;
        pronounce.styleData.values.color = 1;
        pronounce.physicsData.values.flags |= 1;
        pronounce.physicsData.values.sides = 2;
        pronounce.tick = () => {
            const size = this.owner.physicsData.values.size;
            pronounce.physicsData.size = sizeRatio * size;
            pronounce.physicsData.width = widthRatio * size;
            pronounce.positionData.x = offsetRatio * size;
        };
    }
}
class WeirdSpikeAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(3, 1.5, 0, 0.17);
        this.createGuard(3, 1.5, 0, -0.16);
    }
}
class Auto2Addon extends Addon {
    constructor(owner) {
        super(owner);
        this.createAutoMachineTurrets(2);
        const base = new AutoTurret_1.default(owner, {
            angle: 0,
            offset: 0,
            size: 55,
            width: 42 * 0.7,
            delay: 0.01,
            reload: 0.5,
            recoil: 0,
            isTrapezoid: true,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "bullet",
                health: 0.875,
                damage: 0.3,
                speed: 1.2,
                scatterRate: 3,
                lifeLength: 1,
                sizeRatio: 1,
                absorbtionFactor: 1
            }
        });
        base.influencedByOwnerInputs = true;
    }
}
class Auto7Addon extends Addon {
    constructor(owner) {
        super(owner);
        this.createAutoTurrets(7);
    }
}
class AutoRocketAddon extends Addon {
    constructor(owner) {
        super(owner);
        const base = new AutoTurret_1.default(owner, {
            angle: 0,
            offset: 0,
            size: 55,
            width: 42 * 0.7,
            delay: 0,
            reload: 4,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "bullet",
                sizeRatio: 1,
                health: 0.85,
                damage: 1.2,
                speed: 1.4,
                scatterRate: 0.3,
                lifeLength: 1,
                absorbtionFactor: 0.1
            }
        });
        base.turret[0].styleData.zIndex += 2;
        new LauncherAddon(base);
    }
}
class SpieskAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(4, 1.3, 0, 0.17);
        this.createGuard(4, 1.3, Math.PI / 6, 0.17);
        this.createGuard(4, 1.3, 2 * Math.PI / 6, 0.17);
    }
}
class THEBIGONE extends Addon {
    constructor(owner) {
        super(owner);
        const base = new AutoTurret_1.default(owner, {
            angle: 0,
            offset: 0,
            size: 96,
            width: 75.6 * 0.7,
            delay: 0,
            reload: 8,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "bullet",
                sizeRatio: 1,
                health: 1.85,
                damage: 1.25,
                speed: 1.5,
                scatterRate: 0.3,
                lifeLength: 1,
                absorbtionFactor: 0.1
            }
        });
        base.turret[0].styleData.zIndex += 2;
        base.baseSize *= 1.5;
        base.ai.viewRange = 1800;
        new LauncherAddon(base);
    }
}
class Mega3Addon extends Addon {
    constructor(owner) {
        super(owner);
        this.createMegaAutoTurrets(3);
    }
}
class Auto4Addon extends Addon {
    constructor(owner) {
        super(owner);
        this.createAutoTrapTurrets(4);
    }
}
class Stalker3Addon extends Addon {
    constructor(owner) {
        super(owner);
        this.createAutoStalkerTurrets(3);
    }
}
class MegaSmasherAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(6, 1.3, 0, .1);
    }
}
class BelphegorAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(12, 1.15, 0, .1);
    }
}
class SawAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(4, 1.55, Math.PI / 8, .15);
    }
}
class SpornAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(9, 1.35, Math.PI / 8, .3);
    }
}
class RammerAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard2();
    }
}
class ChasmAddon extends Addon {
    constructor(owner) {
        super(owner);
        const pronounce = new Object_1.default(this.game);
        const size = this.owner.physicsData.values.size;
        pronounce.setParent(this.owner);
        pronounce.relationsData.values.owner = this.owner;
        pronounce.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce.physicsData.values.size = size * 1.2;
        pronounce.styleData.values.color = 0;
        pronounce.physicsData.values.sides = 3;
        const tickBase = pronounce.tick;
        pronounce.tick = (tick) => {
            const size = this.owner.physicsData.values.size;
            pronounce.physicsData.size = size * 1.2;
            tickBase.call(pronounce, tick);
        };
        const pronounce2 = new Object_1.default(this.game);
        pronounce2.setParent(this.owner);
        pronounce2.relationsData.values.owner = this.owner;
        pronounce2.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce2.physicsData.values.size = size * 0.75;
        pronounce2.styleData.values.color = this.owner.styleData.color;
        pronounce2.styleData.values.flags |= 64;
        pronounce2.physicsData.values.sides = 3;
        const tickBase2 = pronounce2.tick;
        pronounce2.tick = (tick) => {
            const size = this.owner.physicsData.values.size;
            pronounce2.physicsData.size = size * 0.75;
            tickBase2.call(pronounce2, tick);
        };
        const pronounce3 = new Object_1.default(this.game);
        pronounce3.setParent(this.owner);
        pronounce3.relationsData.values.owner = this.owner;
        pronounce3.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce3.physicsData.values.size = size * 0.5;
        pronounce3.styleData.values.color = this.owner.styleData.color;
        pronounce3.styleData.values.flags |= 64;
        pronounce3.physicsData.values.sides = 3;
        const tickBase3 = pronounce3.tick;
        pronounce3.tick = (tick) => {
            const size = this.owner.physicsData.values.size;
            pronounce3.physicsData.size = size * 0.5;
            tickBase3.call(pronounce3, tick);
        };
    }
}
class VoidAddon extends Addon {
    constructor(owner) {
        super(owner);
        const pronounce = new Object_1.default(this.game);
        const size = this.owner.physicsData.values.size;
        pronounce.setParent(this.owner);
        pronounce.relationsData.values.owner = this.owner;
        pronounce.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce.physicsData.values.size = size * 1.4;
        pronounce.styleData.values.color = 0;
        pronounce.physicsData.values.sides = 3;
        const tickBase = pronounce.tick;
        pronounce.tick = (tick) => {
            const size = this.owner.physicsData.values.size;
            pronounce.physicsData.size = size * 1.4;
            tickBase.call(pronounce, tick);
        };
        const pronounce2 = new Object_1.default(this.game);
        pronounce2.setParent(this.owner);
        pronounce2.relationsData.values.owner = this.owner;
        pronounce2.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce2.physicsData.values.size = size * 0.75;
        pronounce2.styleData.values.color = this.owner.styleData.color;
        pronounce2.styleData.values.flags |= 64;
        pronounce2.physicsData.values.sides = 3;
        const tickBase2 = pronounce2.tick;
        pronounce2.tick = (tick) => {
            const size = this.owner.physicsData.values.size;
            pronounce2.physicsData.size = size * 0.75;
            tickBase2.call(pronounce2, tick);
        };
        const pronounce3 = new Object_1.default(this.game);
        pronounce3.setParent(this.owner);
        pronounce3.relationsData.values.owner = this.owner;
        pronounce3.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce3.physicsData.values.size = size * 0.5;
        pronounce3.styleData.values.color = this.owner.styleData.color;
        pronounce3.styleData.values.flags |= 64;
        pronounce3.physicsData.values.sides = 3;
        const tickBase3 = pronounce3.tick;
        pronounce3.tick = (tick) => {
            const size = this.owner.physicsData.values.size;
            pronounce3.physicsData.size = size * 0.5;
            tickBase3.call(pronounce3, tick);
        };
    }
}
class CometAddon extends Addon {
    constructor(owner) {
        super(owner);
        const pronounce = new Object_1.default(this.game);
        const size = this.owner.physicsData.values.size;
        pronounce.setParent(this.owner);
        pronounce.relationsData.values.owner = this.owner;
        pronounce.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce.physicsData.values.size = size * 1.2;
        pronounce.styleData.values.color = 0;
        pronounce.physicsData.values.sides = 3;
        const tickBase = pronounce.tick;
        pronounce.tick = (tick) => {
            const size = this.owner.physicsData.values.size;
            pronounce.physicsData.size = size * 1.2;
            tickBase.call(pronounce, tick);
        };
        const pronounce2 = new Object_1.default(this.game);
        pronounce2.setParent(this.owner);
        pronounce2.relationsData.values.owner = this.owner;
        pronounce2.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce2.physicsData.values.size = size * 0.925;
        pronounce2.positionData.values.angle = Math.PI;
        pronounce2.styleData.values.color = 0;
        pronounce2.styleData.values.flags |= 64 | 16;
        pronounce2.physicsData.values.sides = 3;
        const tickBase2 = pronounce2.tick;
        pronounce2.tick = (tick) => {
            const size = this.owner.physicsData.values.size;
            pronounce2.physicsData.size = size * 0.8;
            tickBase2.call(pronounce2, tick);
        };
        const pronounce3 = new Object_1.default(this.game);
        pronounce3.setParent(this.owner);
        pronounce3.relationsData.values.owner = this.owner;
        pronounce3.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce3.physicsData.values.size = size * 0.5;
        pronounce3.styleData.values.color = this.owner.styleData.color;
        pronounce3.styleData.values.flags |= 64;
        pronounce3.physicsData.values.sides = 3;
        const tickBase3 = pronounce3.tick;
        pronounce3.tick = (tick) => {
            const size = this.owner.physicsData.values.size;
            pronounce3.physicsData.size = size * 0.5;
            tickBase3.call(pronounce3, tick);
        };
    }
}
class AbyssAddon extends Addon {
    constructor(owner) {
        super(owner);
        const pronounce = new Object_1.default(this.game);
        const size = this.owner.physicsData.values.size;
        pronounce.setParent(this.owner);
        pronounce.relationsData.values.owner = this.owner;
        pronounce.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce.physicsData.values.size = size * 1.2;
        pronounce.styleData.values.color = 0;
        pronounce.physicsData.values.sides = 3;
        const tickBase = pronounce.tick;
        pronounce.tick = (tick) => {
            const size = this.owner.physicsData.values.size;
            pronounce.physicsData.size = size * 1.2;
            tickBase.call(pronounce, tick);
        };
        const pronounce2 = new Object_1.default(this.game);
        pronounce2.setParent(this.owner);
        pronounce2.relationsData.values.owner = this.owner;
        pronounce2.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce2.physicsData.values.size = size * 0.8;
        pronounce2.styleData.values.color = this.owner.styleData.color;
        pronounce2.styleData.values.flags |= 64;
        pronounce2.physicsData.values.sides = 3;
        const tickBase2 = pronounce2.tick;
        pronounce2.tick = (tick) => {
            const size = this.owner.physicsData.values.size;
            pronounce2.physicsData.size = size * 0.8;
            tickBase2.call(pronounce2, tick);
        };
        const pronounce3 = new Object_1.default(this.game);
        pronounce3.setParent(this.owner);
        pronounce3.relationsData.values.owner = this.owner;
        pronounce3.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce3.physicsData.values.size = size * 0.6;
        pronounce3.styleData.values.color = this.owner.styleData.color;
        pronounce3.styleData.values.flags |= 64;
        pronounce3.physicsData.values.sides = 3;
        const tickBase3 = pronounce3.tick;
        pronounce3.tick = (tick) => {
            const size = this.owner.physicsData.values.size;
            pronounce3.physicsData.size = size * 0.6;
            tickBase3.call(pronounce3, tick);
        };
        const pronounce4 = new Object_1.default(this.game);
        pronounce4.setParent(this.owner);
        pronounce4.relationsData.values.owner = this.owner;
        pronounce4.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce4.physicsData.values.size = size * 0.4;
        pronounce4.styleData.values.color = this.owner.styleData.color;
        pronounce4.styleData.values.flags |= 64;
        pronounce4.physicsData.values.sides = 3;
        const tickBase4 = pronounce4.tick;
        pronounce4.tick = (tick) => {
            const size = this.owner.physicsData.values.size;
            pronounce4.physicsData.size = size * 0.4;
            tickBase4.call(pronounce4, tick);
        };
        const pronounce5 = new Object_1.default(this.game);
        pronounce5.setParent(this.owner);
        pronounce5.relationsData.values.owner = this.owner;
        pronounce5.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce5.physicsData.values.size = size * 0.2;
        pronounce5.styleData.values.color = this.owner.styleData.color;
        pronounce5.styleData.values.flags |= 64;
        pronounce5.physicsData.values.sides = 3;
        const tickBase5 = pronounce5.tick;
        pronounce5.tick = (tick) => {
            const size = this.owner.physicsData.values.size;
            pronounce5.physicsData.size = size * 0.2;
            tickBase5.call(pronounce5, tick);
        };
    }
}
class RiftAddon extends Addon {
    constructor(owner) {
        super(owner);
        const pronounce = new Object_1.default(this.game);
        const size = this.owner.physicsData.values.size;
        pronounce.setParent(this.owner);
        pronounce.relationsData.values.owner = this.owner;
        pronounce.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce.physicsData.values.size = size * 1.2;
        pronounce.styleData.values.color = 0;
        pronounce.physicsData.values.sides = 3;
        const tickBase = pronounce.tick;
        pronounce.tick = (tick) => {
            const size = this.owner.physicsData.values.size;
            pronounce.physicsData.size = size * 1.2;
            tickBase.call(pronounce, tick);
        };
        const pronounce2 = new Object_1.default(this.game);
        pronounce2.setParent(this.owner);
        pronounce2.relationsData.values.owner = this.owner;
        pronounce2.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce2.styleData.values.color = 1;
        pronounce2.physicsData.values.size = size * 0.75;
        pronounce2.positionData.angle = Math.PI;
        pronounce2.styleData.values.flags |= 64;
        pronounce2.physicsData.values.sides = 6;
        const tickBase2 = pronounce2.tick;
        pronounce2.tick = (tick) => {
            const size = this.owner.physicsData.values.size;
            pronounce2.physicsData.size = size * 0.75;
            tickBase2.call(pronounce2, tick);
        };
        const pronounce3 = new Object_1.default(this.game);
        pronounce3.setParent(this.owner);
        pronounce3.relationsData.values.owner = this.owner;
        pronounce3.relationsData.values.team = this.owner.relationsData.values.team;
        pronounce3.physicsData.values.size = size * 0.5;
        pronounce3.styleData.values.color = 24;
        pronounce3.positionData.angle = Math.PI;
        pronounce3.styleData.values.flags |= 64;
        pronounce3.physicsData.values.sides = 6;
        const tickBase3 = pronounce3.tick;
        pronounce3.tick = (tick) => {
            const size = this.owner.physicsData.values.size;
            pronounce3.physicsData.size = size * 0.5;
            tickBase3.call(pronounce3, tick);
        };
    }
}
class BoostAddon extends Addon {
    constructor(owner) {
        super(owner);
        const atuo = new AutoTurret_1.default(owner, {
            angle: 0,
            offset: 0,
            size: 0,
            width: 0,
            delay: 0.01,
            reload: 1.75,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            droneCount: 0,
            bullet: {
                type: "drone",
                sizeRatio: 1,
                health: 0.75,
                damage: 0.5,
                speed: 1,
                scatterRate: 1,
                lifeLength: 0.75,
                absorbtionFactor: 0.1
            }
        });
        const atuo2 = new AutoTurret_1.default(owner, {
            angle: 0,
            offset: 0,
            size: 0,
            width: 0,
            delay: 0.01,
            reload: 1.75,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            droneCount: 0,
            bullet: {
                type: "drone",
                sizeRatio: 1,
                health: 0.75,
                damage: 0.5,
                speed: 1,
                scatterRate: 1,
                lifeLength: 0.75,
                absorbtionFactor: 0.1
            }
        });
        atuo.baseSize *= 1;
        atuo2.baseSize *= 0.5;
        atuo.ai.viewRange = 0;
        atuo2.ai.viewRange = 0;
        atuo.styleData.color = 1;
        atuo2.styleData.color = 8;
        const offsetRatio = -30 / 50;
        atuo.tick = () => {
            const size = this.owner.physicsData.values.size;
            atuo.physicsData.size = size * 0.6;
            atuo.positionData.x = offsetRatio * size;
        };
        atuo2.tick = () => {
            const size = this.owner.physicsData.values.size;
            atuo2.physicsData.size = size * 0.4;
            atuo2.positionData.x = offsetRatio * size;
        };
    }
}
class TeleAddon extends Addon {
    constructor(owner) {
        super(owner);
        const atuo = new AutoTurret_1.default(owner, {
            angle: 0,
            offset: 0,
            size: 0,
            width: 0,
            delay: 0.01,
            reload: 1.75,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            droneCount: 0,
            bullet: {
                type: "drone",
                sizeRatio: 1,
                health: 0.75,
                damage: 0.5,
                speed: 1,
                scatterRate: 1,
                lifeLength: 0.75,
                absorbtionFactor: 0.1
            }
        });
        const atuo2 = new AutoTurret_1.default(owner, {
            angle: 0,
            offset: 0,
            size: 0,
            width: 0,
            delay: 0.01,
            reload: 1.75,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            droneCount: 0,
            bullet: {
                type: "drone",
                sizeRatio: 1,
                health: 0.75,
                damage: 0.5,
                speed: 1,
                scatterRate: 1,
                lifeLength: 0.75,
                absorbtionFactor: 0.1
            }
        });
        atuo.baseSize *= 1;
        atuo2.baseSize *= 0.5;
        atuo.ai.viewRange = 0;
        atuo2.ai.viewRange = 0;
        atuo.styleData.color = 1;
        atuo2.styleData.color = 24;
        const offsetRatio = -30 / 50;
        atuo.tick = () => {
            const size = this.owner.physicsData.values.size;
            atuo.physicsData.size = size * 0.6;
            atuo.positionData.x = offsetRatio * size;
        };
        atuo2.tick = () => {
            const size = this.owner.physicsData.values.size;
            atuo2.physicsData.size = size * 0.4;
            atuo2.positionData.x = offsetRatio * size;
        };
    }
}
exports.AddonById = {
    spike: SpikeAddon,
    dombase: DomBaseAddon,
    launcher: LauncherAddon,
    dompronounced: PronouncedDomAddon,
    auto5: Auto5Addon,
    auto3: Auto3Addon,
    autosmasher: AutoSmasherAddon,
    pronounced: PronouncedAddon,
    smasher: SmasherAddon,
    landmine: LandmineAddon,
    autoturret: AutoTurretAddon,
    microsmasher: SmasherAddon,
    tele: TeleAddon,
    boost: BoostAddon,
    chainer: SmasherAddon,
    autoturret3: AutoTurretControllAddon,
    vampire: VampAddon,
    spinner: SpinnerAddon,
    chasm: ChasmAddon,
    void: VoidAddon,
    comet: CometAddon,
    abyss: AbyssAddon,
    weirdspike: WeirdSpikeAddon,
    auto7: Auto7Addon,
    auto2: Auto2Addon,
    autorocket: AutoRocketAddon,
    spiesk: SpieskAddon,
    laucher2: LauncherAddon2,
    megasmasher: MegaSmasherAddon,
    saw: SawAddon,
    mega3: Mega3Addon,
    stalker3: Stalker3Addon,
    auto4: Auto4Addon,
    rammer: RammerAddon,
    bumper: BumperAddon,
    launchersmall: LauncherSmallAddon,
    bigautoturret: THEBIGONE,
    joint3: Joint3Addon,
    overdrive: OverDriveAddon,
    droneturret: Banshee,
    pronounced2: PronouncedAddon2,
    cuck: Auto1Addon,
    launchertall: LauncherTallAddon,
    psiEye: PsiAddon,
    sporn: SpornAddon,
    autoauto3: AutoAuto3Addon,
    glider: GliderAddon,
    autovamp: AutoVampAddon,
    vampsmasher: VampSmasherAddon,
    launcheralt: Launcher2SmallAddon,
    rift: RiftAddon,
    whirlwind: WhirlwindAddon,
    multibox: MultiBoxAddon,
    tool: MultiBoxAddon,
    bentbox: MultiBoxAddon,
    bees: MultiBoxAddon,
    multiboxxer: MultiBoxxerAddon,
    rotary: RotaryAddon,
    rotator: RotatorAddon,
    whirlygig: WhirlygigAddon,
    belphegor: BelphegorAddon,
    spinnerbarrel: SpinnerBarrelAddon
};
