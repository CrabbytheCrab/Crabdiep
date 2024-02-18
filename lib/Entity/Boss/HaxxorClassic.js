"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractBoss_1 = require("./AbstractBoss");
const AI_1 = require("../AI");
const util_1 = require("../../util");
const AiTank_1 = require("../Misc/AiTank");
const Object_1 = require("../Object");
const AutoTurret_1 = require("../Tank/AutoTurret");
const TURN_TIMEOUT = 300;
const MountedTurretDefinition = {
    ...AutoTurret_1.AutoTurretDefinition,
    width: 10.5,
    size: 25,
    bullet: {
        ...AutoTurret_1.AutoTurretDefinition.bullet,
        speed: 1.5,
        damage: 3,
        health: 3
    }
};
class HaxxorClassic extends AbstractBoss_1.default {
    constructor(game) {
        super(game);
        this.movementSpeed = 0;
        this.doIdleRotate = true;
        this.orbitRate = (Math.random() < .5 ? -1 : 1) * this.constructor.BASE_ORBIT;
        this.rotationRate = (Math.random() < .5 ? -1 : 1) * this.constructor.BASE_ROTATION;
        this.shapeVelocity = this.constructor.BASE_VELOCITY;
        this.timer = 60;
        this.isTurning = 0;
        this.targetTurningAngle = 0;
        this.physicsData.values.size = 200 * Math.SQRT1_2;
        this.orbitAngle = this.positionData.values.angle = (Math.random() * util_1.PI2);
        this.physicsData.sides = 8;
        this.styleData.color = 13;
        this.relationsData.values.team = this.game.arena;
        this.nameData.values.name = 'H4XX0R';
        this.physicsData.absorbtionFactor = 0;
        this.healthData.values.health = this.healthData.values.maxHealth = 4000;
        this.scoreReward = 45000 * this.game.arena.shapeScoreRewardMultiplier;
        this.physicsData.pushFactor = 0;
        const pronounce = new Object_1.default(this.game);
        const size = this.physicsData.values.size;
        pronounce.setParent(this);
        pronounce.relationsData.values.owner = this;
        pronounce.relationsData.values.team = this.relationsData.values.team;
        pronounce.physicsData.values.size = size * 1.2;
        pronounce.styleData.values.color = 0;
        pronounce.physicsData.values.sides = 8;
        const tickBase = pronounce.tick;
        pronounce.tick = (tick) => {
            const size = this.physicsData.values.size;
            pronounce.physicsData.size = size * 1.2;
            tickBase.call(pronounce, tick);
        };
        const pronounce2 = new Object_1.default(this.game);
        pronounce2.setParent(this);
        pronounce2.relationsData.values.owner = this;
        pronounce2.relationsData.values.team = this.relationsData.values.team;
        pronounce2.physicsData.values.size = size * 0.8;
        pronounce2.styleData.values.color = 1;
        pronounce2.styleData.values.flags |= 64;
        pronounce2.physicsData.values.sides = 8;
        const tickBase2 = pronounce2.tick;
        pronounce2.tick = (tick) => {
            const size = this.physicsData.values.size;
            pronounce2.physicsData.size = size * 0.8;
            tickBase2.call(pronounce2, tick);
        };
        const pronounce3 = new Object_1.default(this.game);
        pronounce3.setParent(this);
        pronounce3.relationsData.values.owner = this;
        pronounce3.relationsData.values.team = this.relationsData.values.team;
        pronounce3.physicsData.values.size = size * 0.75;
        pronounce3.styleData.values.color = 22;
        pronounce3.styleData.values.flags |= 64;
        pronounce3.physicsData.values.sides = 1;
        const tickBase3 = pronounce3.tick;
        pronounce3.tick = (tick) => {
            const size = this.physicsData.values.size;
            pronounce3.physicsData.size = size * 0.75;
            tickBase3.call(pronounce3, tick);
        };
        for (let i = 0; i < 8; ++i) {
            const base = new AutoTurret_1.default(this, MountedTurretDefinition);
            base.influencedByOwnerInputs = true;
            const MAX_ANGLE_RANGE = util_1.PI2 / 16;
            base.baseSize *= 0.325;
            const angle = base.ai.inputs.mouse.angle = util_1.PI2 * (i / 8);
            base.ai.targetFilter = (targetPos) => {
                const pos = base.getWorldPosition();
                const angleToTarget = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
                const deltaAngle = (0, util_1.normalizeAngle)(angleToTarget - ((angle + this.positionData.values.angle)));
                return deltaAngle < MAX_ANGLE_RANGE || deltaAngle > (util_1.PI2 - MAX_ANGLE_RANGE);
            };
            base.positionData.values.y = this.physicsData.values.size * Math.sin(angle) * 1.35;
            base.positionData.values.x = this.physicsData.values.size * Math.cos(angle) * 1.35;
            base.physicsData.values.flags |= 1;
            const tickBase = base.tick;
            base.tick = (tick) => {
                base.positionData.y = this.physicsData.values.size * Math.sin(angle) * 1.35;
                base.positionData.x = this.physicsData.values.size * Math.cos(angle) * 1.35;
                tickBase.call(base, tick);
                if (base.ai.state === 0)
                    base.positionData.angle = angle + this.positionData.values.angle;
            };
        }
    }
    turnTo(angle) {
        if ((0, util_1.normalizeAngle)(this.orbitAngle - angle) < 0.20)
            return;
        this.targetTurningAngle = angle;
        this.isTurning = TURN_TIMEOUT;
    }
    moveAroundMap() {
        const y = this.positionData.values.y;
        const x = this.positionData.values.x;
        if (this.isTurning === 0) {
            if (x > this.game.arena.arenaData.values.rightX - 400
                || x < this.game.arena.arenaData.values.leftX + 400
                || y < this.game.arena.arenaData.values.topY + 400
                || y > this.game.arena.arenaData.values.bottomY - 400) {
                this.turnTo(Math.PI + Math.atan2(y, x));
            }
            else if (x > this.game.arena.arenaData.values.rightX - 500) {
                this.turnTo(Math.sign(this.orbitRate) * Math.PI / 2);
            }
            else if (x < this.game.arena.arenaData.values.leftX + 500) {
                this.turnTo(-1 * Math.sign(this.orbitRate) * Math.PI / 2);
            }
            else if (y < this.game.arena.arenaData.values.topY + 500) {
                this.turnTo(this.orbitRate > 0 ? 0 : Math.PI);
            }
            else if (y > this.game.arena.arenaData.values.bottomY - 500) {
                this.turnTo(this.orbitRate > 0 ? Math.PI : 0);
            }
        }
        this.positionData.angle += this.rotationRate;
        this.orbitAngle += this.orbitRate + (this.isTurning === TURN_TIMEOUT ? this.orbitRate * 10 : 0);
        if (this.isTurning === TURN_TIMEOUT && (((this.orbitAngle - this.targetTurningAngle) % (util_1.PI2)) + (util_1.PI2)) % (util_1.PI2) < 0.20) {
            this.isTurning -= 1;
        }
        else if (this.isTurning !== TURN_TIMEOUT && this.isTurning !== 0)
            this.isTurning -= 1;
        this.maintainVelocity(this.orbitAngle, this.shapeVelocity);
    }
    tick(tick) {
        super.tick(tick);
        this.styleData.zIndex = 1;
        this.moveAroundMap();
        this.sizeFactor = this.physicsData.values.size / 50;
        if (this.ai.state == 1) {
            this.timer--;
            if (this.timer == 0) {
                if (this.healthData.health <= this.healthData.maxHealth / 5) {
                    const tonk = new AiTank_1.default(this.game, this);
                    tonk.positionData.values.x = this.rootParent.positionData.values.x;
                    tonk.positionData.values.y = this.rootParent.positionData.values.y;
                    tonk.relationsData = this.rootParent.relationsData;
                    tonk.styleData.color = this.rootParent.styleData.color;
                    tonk.super = true;
                    this.timer = 60;
                }
                else {
                    const tonk = new AiTank_1.default(this.game, this);
                    tonk.positionData.values.x = this.rootParent.positionData.values.x;
                    tonk.positionData.values.y = this.rootParent.positionData.values.y;
                    tonk.relationsData = this.rootParent.relationsData;
                    tonk.styleData.color = this.rootParent.styleData.color;
                    tonk.super = false;
                    this.timer = 45;
                }
            }
        }
    }
}
exports.default = HaxxorClassic;
HaxxorClassic.BASE_ROTATION = AI_1.AI.PASSIVE_ROTATION;
HaxxorClassic.BASE_ORBIT = 0.005;
HaxxorClassic.BASE_VELOCITY = 1;
