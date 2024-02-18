"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Barrel");
const Bullet_1 = require("./Bullet");
const util_1 = require("../../../util");
const AutoTurret_1 = require("../AutoTurret");
const Entity_1 = require("../../../Native/Entity");
const AI_1 = require("../../AI");
const Bombshot1 = {
    angle: 0,
    offset: 0,
    size: 0,
    width: 73.5,
    delay: 0,
    reload: 100,
    recoil: 1,
    isTrapezoid: false,
    trapezoidDirection: 0,
    forceFire: true,
    bulletdie: true,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.9,
        damage: 1.4,
        speed: 0.8,
        scatterRate: 0.3,
        lifeLength: 0.65,
        sizeRatio: 1,
        absorbtionFactor: 0.3
    }
};
const Bombshot2 = {
    angle: 0,
    offset: 0,
    size: 0,
    width: 63,
    delay: 0,
    reload: 100,
    recoil: 1,
    bulletdie: true,
    isTrapezoid: false,
    forceFire: true,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.9,
        damage: 1,
        speed: 0.8,
        scatterRate: 0.3,
        lifeLength: 0.65,
        sizeRatio: 1,
        absorbtionFactor: 0.3
    }
};
const Bombshot3 = {
    angle: 0,
    offset: 0,
    size: 0,
    width: 126,
    delay: 0,
    reload: 100,
    recoil: 0,
    bulletdie: true,
    isTrapezoid: false,
    forceFire: true,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "explosion",
        health: 100,
        damage: 0.675,
        speed: 0,
        scatterRate: 0,
        lifeLength: 5,
        sizeRatio: 1,
        absorbtionFactor: 0
    }
};
const Bombshot4 = {
    angle: 0,
    offset: 0,
    size: 0,
    width: 69.3,
    delay: 0,
    reload: 100,
    recoil: 1,
    isTrapezoid: false,
    trapezoidDirection: 0,
    forceFire: true,
    bulletdie: true,
    addon: null,
    bullet: {
        type: "homing",
        health: 0.9,
        damage: 0.8,
        speed: 0.8,
        scatterRate: 0.3,
        lifeLength: 1.3,
        sizeRatio: 1,
        absorbtionFactor: 0.3
    }
};
class Mine extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle, parent) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.collisionEnd = 0;
        this.reloadTime = 1;
        this.inputs = new AI_1.Inputs();
        const bulletDefinition = barrel.definition.bullet;
        this.sizeFactor = this.physicsData.values.size / 50;
        this.parent = parent ?? tank;
        this.cameraEntity = tank.cameraEntity;
        this.death = true;
        this.boom = false;
        this.primetimer2 = 0;
        this.primetimer = 0;
        this.canControlDrones = typeof this.barrelEntity.definition.canControlDrones === 'boolean' && this.barrelEntity.definition.canControlDrones;
        this.megaturret = typeof this.barrelEntity.definition.megaturret === 'boolean' && this.barrelEntity.definition.megaturret;
        this.canexplode = false;
        this.baseSpeed = (barrel.bulletAccel / 2) + 30 - Math.random() * barrel.definition.bullet.scatterRate;
        this.baseAccel = 0;
        this.canexploded = true;
        this.physicsData.values.sides = bulletDefinition.sides ?? 4;
        if (this.physicsData.values.flags & 8)
            this.physicsData.values.flags ^= 8;
        this.physicsData.values.flags |= 32;
        if (this.tankDefinition && this.tankDefinition.id === 194) {
            this.styleData.values.flags |= 16;
            this.physicsData.values.flags |= 8;
            if (this.physicsData.values.flags & 32)
                this.physicsData.values.flags ^= 32;
        }
        this.styleData.values.flags &= ~128;
        this.skimmerBarrels = [];
        this.collisionEnd = this.lifeLength >> 3;
        this.lifeLength = (600 * barrel.definition.bullet.lifeLength) >> 3;
        if (tankDefinition && tankDefinition.id === -4)
            this.collisionEnd = this.lifeLength - 1;
        if (barrel.definition.bullet.lifeLength !== -1) {
            this.lifeLength = 88 * barrel.definition.bullet.lifeLength;
        }
        else {
            this.lifeLength = Infinity;
        }
        barrel.droneCount += 1;
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
            atuo.styleData.opacity = this.styleData.opacity;
            if (this.canexplode == false)
                if (this.tankDefinition && this.tankDefinition.id === 141) {
                    this.primetimer++;
                    if (this.primetimer == 30) {
                        this.canexplode = true;
                        atuo.styleData.color = 14;
                    }
                }
                else if (this.tankDefinition && this.tankDefinition.id === 193) {
                    this.primetimer++;
                    if (this.primetimer == 75) {
                        this.canexplode = true;
                        atuo.styleData.color = 14;
                    }
                }
                else if (this.tankDefinition && this.tankDefinition.id === 194) {
                    this.primetimer++;
                    if (this.primetimer == 30) {
                        this.canexplode = true;
                        atuo.styleData.color = 14;
                    }
                }
                else {
                    this.primetimer++;
                    if (this.primetimer == 60) {
                        this.canexplode = true;
                        atuo.styleData.color = 14;
                    }
                }
            tickBase.call(atuo, tick);
        };
        this.positionData.values.angle = Math.random() * util_1.PI2;
    }
    destroy(animate = true) {
        if (this.canexplode == true) {
            this.canexplode = false;
            if (this.tankDefinition && this.tankDefinition.id === 141) {
                const skimmerBarrels = this.skimmerBarrels = [];
                for (let n = 0; n < 8; n++) {
                    const barr = new Barrel_1.default(this, {
                        ...Bombshot2,
                        angle: util_1.PI2 * (n / 8)
                    });
                    barr.physicsData.values.sides = 0;
                    skimmerBarrels.push(barr);
                }
            }
            else if (this.tankDefinition && this.tankDefinition.id === 259) {
                const skimmerBarrels = this.skimmerBarrels = [];
                for (let n = 0; n < 6; n++) {
                    const barr = new Barrel_1.default(this, {
                        ...Bombshot4,
                        angle: util_1.PI2 * (n / 6)
                    });
                    barr.physicsData.values.sides = 0;
                    skimmerBarrels.push(barr);
                }
            }
            else if (this.tankDefinition && this.tankDefinition.id === 194) {
                if (this.boom == true) {
                    const skimmerBarrels = this.skimmerBarrels = [];
                    const barr = new Barrel_1.default(this, {
                        ...Bombshot3,
                        angle: 0
                    });
                    barr.physicsData.values.sides = 0;
                    const tickBase = barr.tick;
                    barr.tick = (tick) => {
                        barr.positionData.x = this.positionData.x;
                        barr.positionData.y = this.positionData.y;
                        tickBase.call(barr, tick);
                    };
                    skimmerBarrels.push(barr);
                }
            }
            else {
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
        }
        if (!animate)
            this.barrelEntity.droneCount -= 1;
        super.destroy(animate);
    }
    onKill(killedEntity) {
        if (typeof this.parent.onKill === 'function')
            this.parent.onKill(killedEntity);
    }
    tick(tick) {
        super.tick(tick);
        this.inputs = new AI_1.Inputs();
        this.inputs.flags |= 1;
        if (!Entity_1.Entity.exists(this.barrelEntity)) {
            this.canexploded = false;
            this.canexplode = false;
            this.boom = false;
            this.destroy();
        }
        ;
        if (this.canexploded) {
            if (this.tank.inputs.attemptingRepel() && this.canexplode == true) {
                this.canexploded = false;
                this.boom = true;
                this.destroy();
            }
        }
        if (tick - this.spawnTick === this.collisionEnd) {
            if (this.physicsData.values.flags & 32)
                this.physicsData.flags ^= 32;
            this.physicsData.values.flags |= 8;
        }
    }
}
exports.default = Mine;
