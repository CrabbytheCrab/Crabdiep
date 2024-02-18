"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Barrel");
const Drone_1 = require("./Drone");
const AI_1 = require("../../AI");
const Entity_1 = require("../../../Native/Entity");
const Bullet_1 = require("./Bullet");
class NecromancerWepSquare extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.reloadTime = 15;
        this.inputs = new AI_1.Inputs();
        this.restCycle = true;
        const bulletDefinition = barrel.definition.bullet;
        this.physicsData.values.size = 55 * Math.SQRT1_2;
        this.usePosAngle = false;
        this.tank.DroneCount += 1;
        this.ai = new AI_1.AI(this);
        this.ai.viewRange = 850 * tank.sizeFactor;
        this.ai.targetFilter = (targetPos) => (targetPos.x - this.tank.positionData.values.x) ** 2 + (targetPos.y - this.tank.positionData.values.y) ** 2 <= this.ai.viewRange ** 2;
        this.canControlDrones = typeof this.barrelEntity.definition.canControlDrones === 'boolean' && this.barrelEntity.definition.canControlDrones;
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
        this.cameraEntity = tank.cameraEntity;
        this.sizeFactor = this.physicsData.values.size / 50;
        this.invisibile = typeof this.barrelEntity.definition.invisibile === 'boolean' && this.barrelEntity.definition.invisibile;
        this.ai = new AI_1.AI(this);
        this.ai.viewRange = 900;
        this.physicsData.values.sides = 4;
        this.styleData.values.color = tank.relationsData.values.team?.teamData?.values.teamColor || 16;
        if (this.physicsData.values.flags & 8)
            this.physicsData.values.flags ^= 8;
        this.physicsData.values.flags |= 32;
        if (tankDefinition && tankDefinition.id === 41) {
            this.lifeLength = 88;
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
        this.ai.movementSpeed = this.ai.aimSpeed = this.baseAccel;
        const skimmerBarrels = this.skimmerBarrels = [];
        const SkimmerBarrelDefinition = {
            angle: 0,
            offset: 0,
            size: 70,
            width: 42 * 1.1,
            delay: 0,
            reload: 1.5,
            recoil: 1.35 * 1.5,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "bullet",
                health: 0.4,
                damage: 0.4,
                speed: 0.8,
                scatterRate: 1,
                lifeLength: 1,
                sizeRatio: 1,
                absorbtionFactor: 1
            }
        };
        const s1 = new class extends Barrel_1.default {
            resize() {
                super.resize();
                this.physicsData.values.width = this.definition.width;
                this.physicsData.size = this.definition.size;
            }
        }(this, { ...SkimmerBarrelDefinition });
        skimmerBarrels.push(s1);
    }
    ;
    static fromShape(barrel, tank, tankDefinition, shape) {
        const wepsunchip = new NecromancerWepSquare(barrel, tank, tankDefinition, shape.positionData.values.angle);
        wepsunchip.physicsData.values.sides = shape.physicsData.values.sides;
        wepsunchip.physicsData.values.size = shape.physicsData.values.size;
        wepsunchip.positionData.values.x = shape.positionData.values.x;
        wepsunchip.positionData.values.y = shape.positionData.values.y;
        wepsunchip.positionData.values.angle = shape.positionData.values.angle;
        wepsunchip.baseSpeed = 0;
        const shapeDamagePerTick = shape['damagePerTick'];
        wepsunchip.damagePerTick *= shapeDamagePerTick / 8;
        wepsunchip.healthData.values.maxHealth = (wepsunchip.healthData.values.health *= (shapeDamagePerTick / 8));
        return wepsunchip;
    }
    tickMixin(tick) {
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;
        const usingAI = !this.canControlDrones || !this.tank.inputs.attemptingShot() && !this.tank.inputs.attemptingRepel();
        const inputs = !usingAI ? this.tank.inputs : this.ai.inputs;
        if (usingAI && this.ai.state === 0) {
            this.movementAngle = this.positionData.values.angle;
        }
        else {
            this.inputs.flags |= 1;
            const dist = inputs.mouse.distanceToSQ(this.positionData.values);
            if (dist < 850 ** 2 / 4) {
                this.movementAngle = this.positionData.values.angle + Math.PI;
            }
            else if (dist < 850 ** 2) {
                this.movementAngle = this.positionData.values.angle;
            }
            else
                this.movementAngle = this.positionData.values.angle;
        }
        super.tick(tick);
    }
    tick(tick) {
        const usingAI = !this.canControlDrones || this.tank.inputs.deleted || (!this.tank.inputs.attemptingShot() && !this.tank.inputs.attemptingRepel());
        const inputs = !usingAI ? this.tank.inputs : this.ai.inputs;
        this.reloadTime = this.tank.reloadTime;
        if (usingAI && this.ai.state === 0) {
            if (this.inputs.flags && this.inputs.flags == 1)
                this.inputs.flags ^= 1;
            const delta = {
                x: this.positionData.values.x - this.tank.positionData.values.x,
                y: this.positionData.values.y - this.tank.positionData.values.y
            };
            const base = this.baseAccel;
            let unitDist = (delta.x ** 2 + delta.y ** 2) / Drone_1.default.MAX_RESTING_RADIUS;
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
            this.inputs.flags |= 1;
            this.positionData.angle = Math.atan2(inputs.mouse.y - this.positionData.values.y, inputs.mouse.x - this.positionData.values.x);
            this.restCycle = false;
        }
        if (this.canControlDrones && inputs.attemptingRepel()) {
            this.inputs.flags |= 1;
            this.positionData.angle += Math.PI;
        }
        if (!Entity_1.Entity.exists(this.barrelEntity))
            this.destroy();
        this.tickMixin(tick);
    }
    destroy(animate = true) {
        if (!animate)
            this.tank.DroneCount -= 1;
        super.destroy(animate);
    }
}
exports.default = NecromancerWepSquare;
NecromancerWepSquare.BASE_ROTATION = 0.2;
NecromancerWepSquare.MAX_RESTING_RADIUS = 400 ** 2;
