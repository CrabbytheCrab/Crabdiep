"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Live_1 = require("../Live");
const FieldGroups_1 = require("../../Native/FieldGroups");
const AI_1 = require("../AI");
const util_1 = require("../../util");
const TURN_TIMEOUT = 300;
class AbstractShape extends Live_1.default {
    constructor(game) {
        super(game);
        this.nameData = new FieldGroups_1.NameGroup(this);
        this.isShiny = false;
        this.doIdleRotate = true;
        this.orbitRate = (Math.random() < .5 ? -1 : 1) * this.constructor.BASE_ORBIT;
        this.rotationRate = (Math.random() < .5 ? -1 : 1) * this.constructor.BASE_ROTATION;
        this.shapeVelocity = this.constructor.BASE_VELOCITY;
        this.isTurning = 0;
        this.targetTurningAngle = 0;
        this.relationsData.values.team = game.arena;
        this.nameData.values.flags = 1;
        this.positionData.values.flags |= 1;
        this.orbitAngle = this.positionData.values.angle = (Math.random() * util_1.PI2);
    }
    turnTo(angle) {
        if ((0, util_1.normalizeAngle)(this.orbitAngle - angle) < 0.20)
            return;
        this.targetTurningAngle = angle;
        this.isTurning = TURN_TIMEOUT;
    }
    tick(tick) {
        if (!this.doIdleRotate) {
            return super.tick(tick);
        }
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
        super.tick(tick);
    }
}
exports.default = AbstractShape;
AbstractShape.BASE_ROTATION = AI_1.AI.PASSIVE_ROTATION;
AbstractShape.BASE_ORBIT = 0.005;
AbstractShape.BASE_VELOCITY = 1;
