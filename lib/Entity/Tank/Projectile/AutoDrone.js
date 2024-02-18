"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
const Entity_1 = require("../../../Native/Entity");
const AI_1 = require("../../AI");
const AutoTurret_1 = require("../AutoTurret");
class AutoDrone extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.restCycle = true;
        this.inputs = new AI_1.Inputs();
        this.reloadTime = 15;
        const bulletDefinition = barrel.definition.bullet;
        this.megaturret = typeof this.barrelEntity.definition.megaturret === 'boolean' && this.barrelEntity.definition.megaturret;
        this.usePosAngle = true;
        this.cameraEntity = tank.cameraEntity;
        if (this.megaturret) {
            const atuo = new AutoTurret_1.default(this, {
                angle: 0,
                offset: 0,
                size: 85,
                width: 46.2,
                delay: 0.01,
                reload: 3,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1.15,
                    damage: 0.8,
                    speed: 0.9,
                    scatterRate: 1,
                    lifeLength: 0.75,
                    absorbtionFactor: 0.1
                }
            });
            atuo.positionData.values.angle = shootAngle;
            atuo.baseSize *= 1.35;
            atuo.ai.viewRange = 1500;
        }
        else {
            const atuo = new AutoTurret_1.default(this, {
                angle: 0,
                offset: 0,
                size: 65,
                width: 33.6,
                delay: 0.01,
                reload: 1.2,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 0.8,
                    damage: 0.45,
                    speed: 1.2,
                    scatterRate: 1,
                    lifeLength: 0.75,
                    absorbtionFactor: 0.1
                }
            });
            atuo.baseSize *= 1.25;
            atuo.positionData.values.angle = shootAngle;
            atuo.ai.viewRange = 1000;
        }
        this.sizeFactor = this.physicsData.values.size / 50;
        this.ai = new AI_1.AI(this);
        this.ai.viewRange = 850 * tank.sizeFactor;
        this.ai.targetFilter = (targetPos) => (targetPos.x - this.tank.positionData.values.x) ** 2 + (targetPos.y - this.tank.positionData.values.y) ** 2 <= this.ai.viewRange ** 2;
        this.canControlDrones = typeof this.barrelEntity.definition.canControlDrones === 'boolean' && this.barrelEntity.definition.canControlDrones;
        this.physicsData.values.sides = bulletDefinition.sides ?? 3;
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
            let unitDist = (delta.x ** 2 + delta.y ** 2) / AutoDrone.MAX_RESTING_RADIUS;
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
        this.tickMixin(tick);
    }
}
exports.default = AutoDrone;
AutoDrone.MAX_RESTING_RADIUS = 400 ** 2;
