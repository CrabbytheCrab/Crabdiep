"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Barrel");
const Entity_1 = require("../../../Native/Entity");
const AI_1 = require("../../AI");
const Live_1 = require("../../Live");
const util = require("../../../util");
const MinionBarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 95,
    width: 42,
    delay: 0,
    reload: 1,
    recoil: 1,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 1,
        damage: 0.5,
        speed: 1,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
class Multibox extends Live_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle, parent) {
        super(barrel.game);
        this.reloadTime = 1;
        this.inputs = new AI_1.Inputs();
        this.spawnTick = 0;
        this.baseAccel = 0;
        this.baseSpeed = 0;
        this.deathAccelFactor = 0.5;
        this.lifeLength = 0;
        this.movementAngle = 0;
        this.tankDefinition = null;
        this.usePosAngle = false;
        this.parent = parent ?? tank;
        this.tank = tank;
        this.idx = null;
        this.barrelEntity = barrel;
        if (tankDefinition) {
            this.idx = tankDefinition.id;
        }
        const bulletDefinition = barrel.definition.bullet;
        this.usePosAngle = false;
        this.physicsData.values.sides = bulletDefinition.sides ?? 1;
        this.physicsData.values.size *= 1.2;
        this.physicsData.values.flags |= 8;
        if (this.physicsData.values.flags & 256)
            this.physicsData.values.flags ^= 256;
        this.sizeFactor = this.physicsData.values.size / 50;
        this.cameraEntity = tank.cameraEntity;
        this.minionBarrel = new Barrel_1.default(this, MinionBarrelDefinition);
        const statLevels = tank.cameraEntity.cameraData?.values.statLevels.values;
        const tanklevel = tank.cameraEntity.cameraData?.values.level;
        const bulletDamage = statLevels ? statLevels[5] : 0;
        const bulletPenetration = statLevels ? statLevels[6] : 0;
        const bulletSpeed = statLevels ? statLevels[0] : 0;
        this.styleData.values.flags &= ~128;
        this.physicsData.values.pushFactor = 8;
        this.physicsData.values.absorbtionFactor = bulletDefinition.absorbtionFactor;
        this.physicsData.values.size = tank.physicsData.values.size;
        if (barrel.definition.bullet.lifeLength !== -1) {
            this.lifeLength = 88 * barrel.definition.bullet.lifeLength;
        }
        else {
            this.lifeLength = Infinity;
            if (this.physicsData.values.flags & 256)
                this.physicsData.values.flags ^= 256;
        }
        if (tanklevel) {
            this.baseAccel = 0;
            this.baseSpeed = barrel.bulletAccel + 30 - Math.random() * bulletDefinition.scatterRate;
            this.healthData.values.health = (50 + 2 * (tanklevel - 1) + bulletPenetration * 20) * 0.25;
            this.healthData.values.maxHealth = (50 + 2 * (tanklevel - 1) + bulletPenetration * 20) * 0.25;
        }
        this.damagePerTick = bulletDamage * 6 + 20;
        this.damageReduction = 1;
        if (this.healthData.values.flags && 1)
            this.healthData.values.flags ^= 1;
        this.movementAngle = shootAngle;
        const { x, y } = tank.getWorldPosition();
        const sizeFactor = tank.sizeFactor;
        this.relationsData.values.team = barrel.relationsData.values.team;
        this.relationsData.values.owner = tank;
        this.positionData.values.x = x + (Math.cos(shootAngle) * barrel.physicsData.values.size) - Math.sin(shootAngle) * barrel.definition.offset * sizeFactor + Math.cos(shootAngle) * (barrel.definition.distance || 0);
        this.positionData.values.y = y + (Math.sin(shootAngle) * barrel.physicsData.values.size) + Math.cos(shootAngle) * barrel.definition.offset * sizeFactor + Math.sin(shootAngle) * (barrel.definition.distance || 0);
        this.positionData.values.angle = shootAngle;
        this.styleData.values.color = bulletDefinition.color || tank.rootParent.styleData.values.color;
        barrel.droneCount += 1;
        this.addAcceleration(this.movementAngle, this.baseSpeed / 2);
    }
    destroy(animate = true) {
        if (!animate)
            this.barrelEntity.droneCount -= 1;
        super.destroy(animate);
    }
    tick(tick) {
        super.tick(tick);
        if (this.physicsData.values.flags & 8)
            setTimeout(() => { this.physicsData.values.flags ^= 8; }, 180);
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;
        const statLevels = this.tank.cameraEntity.cameraData?.values.statLevels.values;
        const regen = statLevels ? statLevels[7] : 0;
        this.positionData.angle = Math.atan2(this.tank.inputs.mouse.y - this.tank.positionData.values.y, this.tank.inputs.mouse.x - this.tank.positionData.values.x);
        this.regenPerTick = (this.healthData.values.maxHealth * 4 * (regen) + this.healthData.values.maxHealth) / 25000;
        const bulletSpeed = statLevels ? statLevels[0] : 0;
        const flags = this.tank.inputs.flags;
        const movement = {
            x: 0,
            y: 0
        };
        if (flags & 2)
            movement.y -= 1;
        if (flags & 8)
            movement.y += 1;
        if (flags & 16)
            movement.x += 1;
        if (flags & 4)
            movement.x -= 1;
        const angle = Math.atan2(movement.y, movement.x);
        const angle2 = Math.atan2(this.positionData.y - this.tank.positionData.y, this.positionData.x - this.tank.positionData.x);
        const magnitude = util.constrain(Math.sqrt(movement.x ** 2 + movement.y ** 2), -1, 1);
        this.inputs.movement.angle = angle;
        if (this.tank.cameraEntity.cameraData) {
            if (!this.tank.inputs.attemptingRepel()) {
                this.addAcceleration(angle, magnitude * this.tank.cameraEntity.cameraData.values.movementSpeed, false);
            }
            else {
                this.addAcceleration(angle2, -1 * this.tank.cameraEntity.cameraData.values.movementSpeed, false);
            }
        }
        if (!Entity_1.Entity.exists(this.barrelEntity))
            this.destroy();
        if (this.tank.inputs.attemptingShot()) {
            this.inputs.flags |= 1;
        }
        else {
            if (this.inputs.flags && 1)
                this.inputs.flags ^= 1;
        }
        const maxHealthCache = this.healthData.values.maxHealth;
        if (this.healthData.values.health === maxHealthCache)
            this.healthData.health = this.healthData.maxHealth;
        else if (this.healthData.values.maxHealth !== maxHealthCache) {
            this.healthData.health *= this.healthData.values.maxHealth / maxHealthCache;
        }
    }
}
exports.default = Multibox;
Multibox.FOCUS_RADIUS = 850 ** 2;
