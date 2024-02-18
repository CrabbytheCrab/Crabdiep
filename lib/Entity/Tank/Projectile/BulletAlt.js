"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Live_1 = require("../../Live");
class BulletAlt extends Live_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle, parent) {
        super(barrel.game);
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
        this.tankDefinition = tankDefinition;
        this.movementAngle = shootAngle;
        this.barrelEntity = barrel;
        this.spawnTick = barrel.game.tick;
        this.relationsData.values.owner = tank;
        tank.rootParent.styleData.zIndex = barrel.game.entities.zIndex++;
        const bulletDefinition = barrel.definition.bullet;
        const sizeFactor = tank.sizeFactor;
        const statLevels = tank.cameraEntity.cameraData?.values.statLevels.values;
        this.relationsData.values.team = barrel.relationsData.values.team;
        this.relationsData.values.owner = tank;
        this.physicsData.values.sides = bulletDefinition.sides ?? 1;
        this.physicsData.values.flags |= 8 | 256;
        if (tank.positionData.values.flags & 2)
            this.positionData.values.flags |= 2;
        this.physicsData.values.size = (barrel.physicsData.values.width / 2) * bulletDefinition.sizeRatio;
        this.styleData.values.color = bulletDefinition.color || tank.rootParent.styleData.values.color;
        this.styleData.values.flags |= 128;
        this.healthData.values.flags = 1;
        const bulletDamage = statLevels ? statLevels[2] : 0;
        const bulletPenetration = statLevels ? statLevels[3] : 0;
        this.physicsData.values.absorbtionFactor = bulletDefinition.absorbtionFactor;
        this.physicsData.values.pushFactor = ((7 / 3) + bulletDamage) * bulletDefinition.damage * bulletDefinition.absorbtionFactor;
        this.baseAccel = barrel.bulletAccel;
        this.baseSpeed = barrel.bulletAccel + 30 - Math.random() * bulletDefinition.scatterRate;
        this.healthData.values.health = this.healthData.values.maxHealth = (1.5 * bulletPenetration + 2) * bulletDefinition.health;
        this.damagePerTick = (7 + bulletDamage * 3) * bulletDefinition.damage;
        this.damageReduction = 0.25;
        this.lifeLength = bulletDefinition.lifeLength * 72;
        const { x, y } = tank.getWorldPosition();
        this.cangoThroughRope = true;
        this.positionData.values.x = x + (Math.cos(shootAngle) * barrel.physicsData.values.size) - Math.sin(shootAngle) * barrel.definition.offset * sizeFactor + Math.cos(shootAngle) * (barrel.definition.distance || 0);
        this.positionData.values.y = y + (Math.sin(shootAngle) * barrel.physicsData.values.size) + Math.cos(shootAngle) * barrel.definition.offset * sizeFactor + Math.sin(shootAngle) * (barrel.definition.distance || 0);
        this.movementAngle = 0;
    }
    onKill(killedEntity) {
        if (typeof this.parent.onKill === 'function')
            this.parent.onKill(killedEntity);
    }
    tick(tick) {
        super.tick(tick);
        if (tick === this.spawnTick + 1)
            this.addAcceleration(this.movementAngle, this.baseSpeed);
        else
            this.maintainVelocity(this.movementAngle, this.baseAccel);
        if (tick - this.spawnTick >= this.lifeLength)
            this.destroy(true);
        if ((this.relationsData.values.team?.entityState || 0) & 4)
            this.relationsData.values.team = null;
    }
}
exports.default = BulletAlt;
