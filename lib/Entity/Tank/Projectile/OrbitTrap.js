"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
const Entity_1 = require("../../../Native/Entity");
const TankBody_1 = require("../TankBody");
const util_1 = require("../../../util");
class OrbitTrap extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle, parent) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.fire = true;
        this.fire2 = false;
        this.collisionEnd = 0;
        this.barrel = barrel;
        this.parent = parent ?? tank;
        this.dista = 3;
        const bulletDefinition = barrel.definition.bullet;
        this.usePosAngle = false;
        if (this.parent instanceof TankBody_1.default) {
            this.parent.orbit2.push(this);
        }
        this.angles = 0;
        this.timer = 0;
        this.timer2 = 0;
        this.MouseX = 0;
        this.MouseY = 0;
        this.physicsData.values.absorbtionFactor = bulletDefinition.absorbtionFactor;
        this.parent.OrbCount += 1;
        this.num = this.parent.OrbCount;
        this.physicsData.values.sides = bulletDefinition.sides ?? 3;
        this.physicsData.values.flags |= 32;
        this.styleData.values.flags |= 16;
        this.styleData.values.flags &= ~128;
        this.collisionEnd = this.lifeLength >> 3;
        this.lifeLength = (600 * barrel.definition.bullet.lifeLength) >> 3;
        this.positionData.values.angle = Math.random() * util_1.PI2;
    }
    destroy(animate = true) {
        if (!animate)
            if (this.fire == false) {
                if (this.parent instanceof TankBody_1.default) {
                    this.parent.OrbCount -= 1;
                    this.parent.orbit2.splice(this.parent.orbit2.indexOf(this), 1);
                }
            }
        super.destroy(animate);
    }
    tickMixin(tick) {
    }
    tick(tick) {
        const statLevels = this.tank.cameraEntity.cameraData?.values.statLevels.values;
        const bulletSpeed = statLevels ? statLevels[4] : 0;
        if (this.fire == true) {
            this.timer++;
            if (this.timer == 5) {
                this.fire = false;
                this.timer = 2000;
            }
        }
        if (this.fire == false) {
            this.positionData.angle += 0.05;
            if (!Entity_1.Entity.exists(this.barrelEntity))
                this.destroy();
            this.lifeLength = Infinity;
            this.spawnTick = this.barrelEntity.game.tick;
            let angle = util_1.PI2 * ((this.num) / this.parent.OrbCount);
            const statLevels = this.tank.cameraEntity.cameraData?.values.statLevels.values;
            const bulletSpeed = statLevels ? statLevels[4] : 0;
            let multi = 0.03 + (0.02 * (bulletSpeed / 7));
            const delta = {
                x: this.positionData.values.x - this.tank.positionData.values.x,
                y: this.positionData.values.y - this.tank.positionData.values.y
            };
            delta.x = this.tank.positionData.x + (this.tank.physicsData.size * Math.cos(angle + (tick * 0.1))) * this.dista - this.positionData.x;
            delta.y = this.tank.positionData.y + (this.tank.physicsData.size * Math.sin(angle + (tick * 0.1))) * this.dista - this.positionData.y;
            this.movementAngle = Math.atan2(delta.y, delta.x);
            if (this.tank.inputs.attemptingRepel()) {
                const inputs = this.tank.inputs;
                this.fire = true;
                this.fire2 = true;
                this.num = 0;
                if (this.parent instanceof TankBody_1.default) {
                    this.parent.OrbCount -= 1;
                    this.parent.orbit2.splice(this.parent.orbit2.indexOf(this), 1);
                }
                this.MouseX = inputs.mouse.x;
                this.MouseY = inputs.mouse.y;
                this.angles = Math.atan2((this.MouseY - this.positionData.y), (this.MouseX - this.positionData.x));
                this.velocity.angle = this.angles;
                this.movementAngle = this.angles;
                this.baseAccel = 0.25;
                this.lifeLength = 72 * this.barrelEntity.definition.bullet.lifeLength;
            }
        }
        super.tick(tick);
        this.tickMixin(tick);
    }
}
exports.default = OrbitTrap;
OrbitTrap.FOCUS_RADIUS = 850 ** 2;
OrbitTrap.MAX_RESTING_RADIUS = 400 ** 2;
OrbitTrap.BASE_ROTATION = 0.1;
OrbitTrap.dronecount = new Array(100);
