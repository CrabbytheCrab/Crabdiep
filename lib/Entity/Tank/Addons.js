"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddonById = exports.GuardObject = exports.Addon = void 0;
const Object_1 = require("../Object");
const AutoTurret_1 = require("./AutoTurret");
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
        return new OverdriveAddon(1.15, this.owner);
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
    createAutoTurretsDisconnected(count) {
        const rotPerTick = AI_1.AI.PASSIVE_ROTATION;
        const MAX_ANGLE_RANGE = util_1.PI2;
        const rotator = this.createGuard(1, .1, 0, rotPerTick);
        rotator.turrets = [];
        const ROT_OFFSET = 1.8;
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
    createJoints(count) {
        const rotPerTick = AI_1.AI.PASSIVE_ROTATION;
        const MAX_ANGLE_RANGE = util_1.PI2;
        const rotator = this.createGuard(1, .1, 0, 0.01);
        rotator.joints = [];
        const ROT_OFFSET = 1.8;
        if (rotator.styleData.values.flags & 1)
            rotator.styleData.values.flags ^= 1;
        for (let i = 0; i < count; ++i) {
            const barr = new Barrel_1.default(this.owner, { ...jointpart, angle: util_1.PI2 * ((i / count) - 1 / (count * 2)) });
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
        const rotator = this.createGuard(1, .1, 0, rotPerTick);
        rotator.turrets = [];
        const ROT_OFFSET = 0.8;
        if (rotator.styleData.values.flags & 1)
            rotator.styleData.values.flags ^= 1;
        for (let i = 0; i < count; ++i) {
            const base = new AutoTurret_1.default(rotator, AutoTurretStalkDefinition);
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
    createAutoTrapTurrets(count) {
        const rotPerTick = AI_1.AI.PASSIVE_ROTATION;
        const MAX_ANGLE_RANGE = util_1.PI2 / 4;
        const rotator = this.createGuard(1, .1, 0, rotPerTick);
        rotator.turrets = [];
        const ROT_OFFSET = 0.8;
        if (rotator.styleData.values.flags & 1)
            rotator.styleData.values.flags ^= 1;
        for (let i = 0; i < count; ++i) {
            const base = new AutoTurret_1.default(rotator, AutoTurretTrapDefinition);
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
    width: 24,
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
const AutoTurretStalkDefinition = {
    angle: 0,
    offset: 0,
    size: 55,
    width: 38 * 0.7,
    delay: 0.01,
    reload: 1.25,
    recoil: 0,
    isTrapezoid: true,
    trapezoidDirection: 3.141592653589793,
    addon: null,
    bullet: {
        type: "bullet",
        health: 1,
        damage: 0.4,
        speed: 1.5,
        scatterRate: 0.3,
        lifeLength: 1.2,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const AutoTurretMegaDefinition = {
    angle: 0,
    offset: 0,
    size: 65,
    width: 70 * 0.7,
    delay: 0.01,
    reload: 2.5,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 1.5,
        damage: 1.2,
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
    size: 43,
    width: 45 * 0.7,
    delay: 0.01,
    reload: 3,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: "trapLauncher",
    bullet: {
        type: "trap",
        health: 1.5,
        damage: 1,
        speed: 2.5,
        scatterRate: 1,
        lifeLength: 2,
        sizeRatio: 0.8,
        absorbtionFactor: 0.75
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
class OverdriveAddon extends Addon {
    constructor(sizeRatio, owner) {
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
        oversquare.styleData.values.color = 0;
        oversquare.physicsData.values.sides = 6;
        oversquare.tick = () => {
            const size = this.owner.physicsData.values.size;
            oversquare.styleData.opacity = this.owner.styleData.opacity;
            oversquare.physicsData.size = sizeRatio * size;
            oversquare.positionData.x = offsetRatio * size;
        };
    }
}
class GuardObject extends Object_1.default {
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
class LauncherAddon2 extends Addon {
    constructor(owner) {
        super(owner);
        const launcher2 = new Object_1.default(this.game);
        const sizeRatio = 50 * Math.SQRT2 / 50;
        const widthRatio = 1.4;
        const size = this.owner.physicsData.values.size;
        launcher2.setParent(this.owner);
        launcher2.relationsData.values.owner = this.owner;
        launcher2.relationsData.values.team = this.owner.relationsData.values.team;
        launcher2.physicsData.values.size = sizeRatio * size;
        launcher2.physicsData.values.width = widthRatio * size;
        launcher2.positionData.values.x = launcher2.physicsData.values.size / 2;
        launcher2.styleData.values.color = 1;
        launcher2.physicsData.values.sides = 2;
        launcher2.tick = () => {
            const size = this.owner.physicsData.values.size;
            launcher2.physicsData.size = sizeRatio * size;
            launcher2.physicsData.width = widthRatio * size;
            launcher2.positionData.x = launcher2.physicsData.values.size / 2;
            launcher2.physicsData.size = sizeRatio * size;
            launcher2.physicsData.width = widthRatio * size;
            launcher2.positionData.x = launcher2.physicsData.values.size / 2;
        };
    }
}
class AutoTurretAddon extends Addon {
    constructor(owner) {
        super(owner);
        new AutoTurret_1.default(owner);
    }
}
class AutoSmasherAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(6, 1.15, 0, .1);
        const base = new AutoTurret_1.default(owner, {
            angle: 0,
            offset: 0,
            size: 60,
            width: 26.25,
            delay: 0,
            reload: 1.5,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "bullet",
                health: 1,
                damage: 0.8,
                speed: 1.2,
                scatterRate: 1,
                lifeLength: 1,
                sizeRatio: 1,
                absorbtionFactor: 0.5
            }
        });
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
class Joint3Addon extends Addon {
    constructor(owner) {
        super(owner);
        this.createJoints(3);
        this.createAutoTurretsDisconnected(3);
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
        this.createAutoTurrets(2);
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
            size: 65,
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
                damage: 1.25,
                speed: 1.5,
                scatterRate: 0.3,
                lifeLength: 1,
                absorbtionFactor: 0.1
            }
        });
        base.turret.styleData.zIndex += 2;
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
            width: 74 * 0.7,
            delay: 0,
            reload: 6,
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
        base.turret.styleData.zIndex += 2;
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
        this.createGuard(6, 1.45, 0, .1);
    }
}
class SawAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(4, 1.5, 0, .1);
    }
}
class BumperAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard2();
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
    bumper: BumperAddon,
    bigautoturret: THEBIGONE,
    joint3: Joint3Addon
};
