"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Barrel");
const Bullet_1 = require("./Bullet");
const Entity_1 = require("../../../Native/Entity");
const AI_1 = require("../../AI");
const util_1 = require("../../../util");
const AutoTurret_1 = require("../AutoTurret");
const MinionBarrelDefinition2 = {
    angle: 3.141592653589793,
    offset: 0,
    size: 75,
    width: 44.4,
    delay: 0,
    reload: 1,
    recoil: 1.35,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    droneCount: 0,
    bullet: {
        type: "drone",
        health: 0.4,
        damage: 0.275,
        speed: 0.8,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const Bombshot1 = {
    angle: 0,
    offset: 0,
    size: 0,
    width: 85,
    delay: 0,
    reload: 1,
    recoil: 1,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 1.5,
        damage: 1,
        speed: 1.2,
        scatterRate: 0.3,
        lifeLength: 0.45,
        sizeRatio: 1,
        absorbtionFactor: 0.3
    }
};
class BombDrone extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.restCycle = true;
        this.reloadTime = 1;
        this.inputs = new AI_1.Inputs();
        this.cameraEntity = tank.cameraEntity;
        const bulletDefinition = barrel.definition.bullet;
        this.usePosAngle = true;
        this.minionBarrel = new Barrel_1.default(this, MinionBarrelDefinition2);
        this.minionBarrel.styleData.color = this.styleData.color;
        this.ai = new AI_1.AI(this);
        this.ai.viewRange = 850 * tank.sizeFactor;
        this.ai.targetFilter = (targetPos) => (targetPos.x - this.tank.positionData.values.x) ** 2 + (targetPos.y - this.tank.positionData.values.y) ** 2 <= this.ai.viewRange ** 2;
        this.canControlDrones = typeof this.barrelEntity.definition.canControlDrones === 'boolean' && this.barrelEntity.definition.canControlDrones;
        this.physicsData.values.sides = bulletDefinition.sides ?? 1;
        this.physicsData.values.size *= 1.2;
        this.canexplode = false;
        this.death = true;
        this.boom = false;
        this.sizeFactor = this.physicsData.values.size / 50;
        this.primetimer2 = 0;
        this.skimmerBarrels = [];
        this.primetimer = 0;
        if (this.physicsData.values.flags & 8)
            this.physicsData.values.flags ^= 8;
        this.physicsData.values.flags |= 32;
        this.styleData.values.flags &= ~128;
        if (barrel.definition.bullet.lifeLength !== -1) {
            this.lifeLength = 88 * barrel.definition.bullet.lifeLength;
        }
        else {
            this.lifeLength = Infinity;
            if (this.physicsData.values.flags & 256)
                this.physicsData.values.flags ^= 256;
        }
        this.deathAccelFactor = 1;
        this.physicsData.values.pushFactor = 4;
        this.physicsData.values.absorbtionFactor = bulletDefinition.absorbtionFactor;
        this.baseSpeed /= 3;
        barrel.droneCount += 1;
        this.ai.movementSpeed = this.ai.aimSpeed = this.baseAccel;
        const atuo = new AutoTurret_1.default(this, {
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
        atuo.baseSize *= 1.25;
        atuo.positionData.values.angle = shootAngle;
        atuo.styleData.values.flags |= 64;
        atuo.ai.viewRange = 0;
        atuo.styleData.color = 0;
        const tickBase = atuo.tick;
        atuo.tick = (tick) => {
            if (this.canexplode == false) {
                this.primetimer++;
                if (this.primetimer == 60) {
                    this.canexplode = true;
                    atuo.styleData.color = 14;
                }
            }
            tickBase.call(atuo, tick);
        };
    }
    destroy(animate = true) {
        if (!animate)
            this.barrelEntity.droneCount -= 1;
        super.destroy(animate);
    }
    tickMixin(tick) {
        super.tick(tick);
    }
    tick(tick) {
        const usingAI = !this.canControlDrones || this.tank.inputs.deleted || (!this.tank.inputs.attemptingShot() && !this.tank.inputs.attemptingRepel());
        const inputs = !usingAI ? this.tank.inputs : this.ai.inputs;
        if (usingAI && this.ai.state === 0) {
            const delta = {
                x: this.positionData.values.x - this.tank.positionData.values.x,
                y: this.positionData.values.y - this.tank.positionData.values.y
            };
            const base = this.baseAccel;
            let unitDist = (delta.x ** 2 + delta.y ** 2) / BombDrone.MAX_RESTING_RADIUS;
            if (unitDist <= 1 && this.restCycle) {
                this.baseAccel /= 6;
                this.positionData.angle += 0.01 + 0.012 * unitDist;
            }
            else {
                const offset = Math.atan2(delta.y, delta.x) + Math.PI / 2;
                delta.x = this.tank.positionData.values.x + Math.cos(offset) * this.tank.physicsData.values.size * 1.2 - this.positionData.values.x;
                delta.y = this.tank.positionData.values.y + Math.sin(offset) * this.tank.physicsData.values.size * 1.2 - this.positionData.values.y;
                this.positionData.angle = Math.atan2(delta.y, delta.x);
                if (unitDist < 0.5)
                    this.baseAccel /= 3;
                this.restCycle = (delta.x ** 2 + delta.y ** 2) <= 4 * (this.tank.physicsData.values.size ** 2);
            }
            if (!Entity_1.Entity.exists(this.barrelEntity))
                this.destroy();
            this.tickMixin(tick);
            this.baseAccel = base;
            return;
        }
        else {
            this.positionData.angle = Math.atan2(inputs.mouse.y - this.positionData.values.y, inputs.mouse.x - this.positionData.values.x);
            this.restCycle = false;
        }
        if (this.canControlDrones && inputs.attemptingRepel()) {
            this.positionData.angle += Math.PI;
        }
        if (!Entity_1.Entity.exists(this.barrelEntity))
            this.destroy();
        if (this.tank.inputs.attemptingRepel() && this.canexplode == true) {
            {
                this.inputs = new AI_1.Inputs();
                this.inputs.flags |= 1;
                const skimmerBarrels = this.skimmerBarrels = [];
                for (let n = 0; n < 8; n++) {
                    const barr = new Barrel_1.default(this, {
                        ...Bombshot1,
                        angle: util_1.PI2 * (n / 8)
                    });
                    barr.physicsData.values.sides = 0;
                    skimmerBarrels.push(barr);
                }
            }
            setTimeout(() => {
                this.destroy();
            }, 15);
            this.boom = true;
        }
        this.tickMixin(tick);
    }
}
exports.default = BombDrone;
BombDrone.MAX_RESTING_RADIUS = 400 ** 2;
