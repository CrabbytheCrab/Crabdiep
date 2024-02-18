"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Drone_1 = require("./Drone");
const util = require("../../../util");
const AI_1 = require("../../AI");
class NecromancerSquare extends Drone_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        const bulletDefinition = barrel.definition.bullet;
        this.invisibile = typeof this.barrelEntity.definition.invisibile === 'boolean' && this.barrelEntity.definition.invisibile;
        this.ai = new AI_1.AI(this);
        this.ai.viewRange = 900;
        this.physicsData.values.sides = 4;
        this.physicsData.values.size = 55 * Math.SQRT1_2;
        this.tank.DroneCount += 1;
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
    }
    static fromShape(barrel, tank, tankDefinition, shape) {
        const sunchip = new NecromancerSquare(barrel, tank, tankDefinition, shape.positionData.values.angle);
        sunchip.physicsData.values.sides = shape.physicsData.values.sides;
        sunchip.physicsData.values.size = shape.physicsData.values.size;
        sunchip.positionData.values.x = shape.positionData.values.x;
        sunchip.positionData.values.y = shape.positionData.values.y;
        sunchip.positionData.values.angle = shape.positionData.values.angle;
        const shapeDamagePerTick = shape['damagePerTick'];
        sunchip.baseSpeed = 0;
        sunchip.damagePerTick *= shapeDamagePerTick / 8;
        sunchip.healthData.values.maxHealth = (sunchip.healthData.values.health *= (shapeDamagePerTick / 8));
        return sunchip;
    }
    destroy(animate = true) {
        if (!animate)
            this.tank.DroneCount -= 1;
        super.destroy(animate);
    }
    tick(tick) {
        super.tick(tick);
        const dist = (this.positionData.x - this.tank.positionData.x) ** 2 + (this.positionData.y - this.tank.positionData.y) ** 2;
        if (this.invisibile == true) {
            if (dist > NecromancerSquare.INVIS_RADIUS / 2 || this.tank.inputs.attemptingShot() || this.tank.inputs.attemptingRepel() || this.ai.state == 1) {
                setTimeout(() => {
                    this.styleData.opacity += 0.05;
                }, 45);
                this.movementAngle = this.positionData.values.angle + Math.PI;
            }
            else
                this.styleData.opacity -= 0.025;
            this.styleData.opacity = util.constrain(this.styleData.values.opacity, 0, 1);
        }
    }
}
exports.default = NecromancerSquare;
NecromancerSquare.INVIS_RADIUS = 825 ** 2;
