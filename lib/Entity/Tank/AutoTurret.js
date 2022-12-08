"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoTurretDefinition = void 0;
const Object_1 = require("../Object");
const Barrel_1 = require("./Barrel");
const AI_1 = require("../AI");
const FieldGroups_1 = require("../../Native/FieldGroups");
const Live_1 = require("../Live");
exports.AutoTurretDefinition = {
    angle: 0,
    offset: 0,
    size: 55,
    width: 42 * 0.7,
    delay: 0.01,
    reload: 1,
    recoil: 0.3,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 1,
        damage: 0.3,
        speed: 1.2,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
class AutoTurret extends Object_1.default {
    constructor(owner, turretDefinition = exports.AutoTurretDefinition, baseSize = 25) {
        super(owner.game);
        this.nameData = new FieldGroups_1.NameGroup(this);
        this.influencedByOwnerInputs = false;
        this.reloadTime = 15;
        this.cameraEntity = owner.cameraEntity;
        this.ai = new AI_1.AI(this);
        this.ai.doAimPrediction = true;
        this.inputs = this.ai.inputs;
        this.owner = owner;
        this.setParent(owner);
        this.relationsData.values.owner = owner;
        this.relationsData.values.team = owner.relationsData.values.team;
        this.physicsData.values.sides = 1;
        this.baseSize = baseSize;
        this.physicsData.values.size = this.baseSize * this.sizeFactor;
        this.styleData.values.color = 1;
        this.styleData.values.flags |= 64;
        this.positionData.values.flags |= 1;
        this.nameData.values.name = "Mounted Turret";
        this.nameData.values.flags |= 1;
        this.turret = new Barrel_1.default(this, turretDefinition);
        this.turret.physicsData.values.flags |= 4;
    }
    get sizeFactor() {
        return this.owner.sizeFactor;
    }
    onKill(killedEntity) {
        if (!(this.owner instanceof Live_1.default))
            return;
        this.owner.onKill(killedEntity);
    }
    tick(tick) {
        if (this.inputs !== this.ai.inputs)
            this.inputs = this.ai.inputs;
        if (this.ai.state === 1)
            this.ai.passiveRotation = Math.random() < .5 ? AI_1.AI.PASSIVE_ROTATION : -AI_1.AI.PASSIVE_ROTATION;
        this.physicsData.size = this.baseSize * this.sizeFactor;
        this.ai.aimSpeed = this.turret.bulletAccel;
        this.ai.movementSpeed = 0;
        this.reloadTime = this.owner.reloadTime;
        let useAI = !(this.influencedByOwnerInputs && (this.owner.inputs.attemptingRepel() || this.owner.inputs.attemptingShot()));
        if (!useAI) {
            const { x, y } = this.getWorldPosition();
            let flip = this.owner.inputs.attemptingRepel() ? -1 : 1;
            const deltaPos = { x: (this.owner.inputs.mouse.x - x) * flip, y: (this.owner.inputs.mouse.y - y) * flip };
            if (this.ai.targetFilter({ x: x + deltaPos.x, y: y + deltaPos.y }) === false)
                useAI = true;
            else {
                this.inputs.flags |= 1;
                this.positionData.angle = Math.atan2(deltaPos.y, deltaPos.x);
                this.ai.state = 1;
            }
        }
        if (useAI) {
            if (this.ai.state === 0) {
                this.positionData.angle += this.ai.passiveRotation;
                this.turret.attemptingShot = false;
            }
            else {
                const { x, y } = this.getWorldPosition();
                this.positionData.angle = Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x);
            }
        }
    }
}
exports.default = AutoTurret;
