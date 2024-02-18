"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
const Entity_1 = require("../../../Native/Entity");
const TankBody_1 = require("../TankBody");
const util_1 = require("../../../util");
class Orbit extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle, mode, parent) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.fire = true;
        this.fire2 = false;
        this.barrel = barrel;
        this.parent = parent ?? tank;
        this.mode = mode;
        this.dista = 0;
        const bulletDefinition = barrel.definition.bullet;
        this.usePosAngle = false;
        if (this.parent instanceof TankBody_1.default) {
            this.parent.orbit.push(this);
        }
        this.angles = 0;
        this.timer = 0;
        this.timer2 = 0;
        this.MouseX = 0;
        this.MouseY = 0;
        this.physicsData.values.absorbtionFactor = bulletDefinition.absorbtionFactor;
        this.parent.OrbCount += 1;
        this.num = this.parent.OrbCount;
    }
    destroy(animate = true) {
        if (!animate)
            if (this.parent instanceof TankBody_1.default) {
                this.parent.OrbCount -= 1;
                this.parent.orbit.splice(this.parent.orbit.indexOf(this), 1);
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
            if (!Entity_1.Entity.exists(this.barrelEntity))
                this.destroy();
            this.lifeLength = Infinity;
            this.spawnTick = this.barrelEntity.game.tick;
            let angle = util_1.PI2 * ((this.num) / this.parent.OrbCount);
            const statLevels = this.tank.cameraEntity.cameraData?.values.statLevels.values;
            if (this.mode == 1) {
                if (this.tank.inputs.attemptingShot()) {
                    this.dista += (125 - this.dista) * 0.05;
                }
                else if (this.tank.inputs.attemptingRepel()) {
                    this.dista += (15 - this.dista) * 0.05;
                }
                else {
                    this.dista += (50 - this.dista) * 0.1;
                }
            }
            const bulletSpeed = statLevels ? statLevels[4] : 0;
            let multi = 0.05 + (0.1 / 7 * bulletSpeed);
            if (this.mode == 2) {
                this.dista = 2;
            }
            if (this.mode == 0) {
                this.dista = 3;
            }
            const delta = {
                x: this.positionData.values.x - this.tank.positionData.values.x,
                y: this.positionData.values.y - this.tank.positionData.values.y
            };
            if (this.mode == 1) {
                const x1 = (this.tank.positionData.x + (this.tank.physicsData.size * Math.cos(angle + (tick * multi))) * this.dista);
                const y1 = (this.tank.positionData.y + (this.tank.physicsData.size * Math.sin(angle + (tick * multi))) * this.dista);
                this.positionData.x = this.tank.positionData.x + 0.1 * (x1 - this.tank.positionData.x);
                this.positionData.y = this.tank.positionData.y + 0.1 * (y1 - this.tank.positionData.y);
            }
            else {
                delta.x = this.tank.positionData.x + (this.tank.physicsData.size * Math.cos(angle + (tick * 0.1))) * this.dista - this.positionData.x;
                delta.y = this.tank.positionData.y + (this.tank.physicsData.size * Math.sin(angle + (tick * 0.1))) * this.dista - this.positionData.y;
                this.movementAngle = Math.atan2(delta.y, delta.x);
            }
            if (this.tank.inputs.attemptingRepel()) {
                if (this.mode == 0 || this.mode == 2) {
                    const inputs = this.tank.inputs;
                    this.fire = true;
                    this.fire2 = true;
                    this.MouseX = inputs.mouse.x;
                    this.MouseY = inputs.mouse.y;
                    this.angles = Math.atan2((this.MouseY - this.positionData.y), (this.MouseX - this.positionData.x));
                    this.velocity.angle = this.angles;
                    this.movementAngle = this.angles;
                    this.positionData.angle = this.angles;
                    this.lifeLength = 72 * this.barrelEntity.definition.bullet.lifeLength;
                }
            }
        }
        super.tick(tick);
        this.tickMixin(tick);
    }
}
exports.default = Orbit;
Orbit.FOCUS_RADIUS = 850 ** 2;
Orbit.MAX_RESTING_RADIUS = 400 ** 2;
Orbit.BASE_ROTATION = 0.1;
Orbit.dronecount = new Array(100);
