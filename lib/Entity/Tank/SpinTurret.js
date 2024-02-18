"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoTurretDefinition = void 0;
const Object_1 = require("../Object");
const Barrel_1 = require("./Barrel");
const FieldGroups_1 = require("../../Native/FieldGroups");
const Live_1 = require("../Live");
exports.AutoTurretDefinition = {
    angle: 0,
    offset: 0,
    size: 55,
    width: 42 * 0.7,
    delay: 0.01,
    reload: 1,
    recoil: 0,
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
class SpinTurret extends Object_1.default {
    constructor(owner, barrelDefinition = exports.AutoTurretDefinition, baseSize = 25, spin = 0.1) {
        super(owner.game);
        this.nameData = new FieldGroups_1.NameGroup(this);
        this.turret = [];
        this.reloadTime = 15;
        this.cameraEntity = owner.cameraEntity;
        this.inputs = owner.inputs;
        this.spin = spin;
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
        if (!(barrelDefinition instanceof Array))
            barrelDefinition = [barrelDefinition];
        for (const def of barrelDefinition) {
            this.turret = [new Barrel_1.default(this, def)];
            this.turret[0].physicsData.values.flags |= 4;
        }
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
        this.physicsData.size = this.baseSize * this.sizeFactor;
        this.positionData.angle += this.spin;
    }
}
exports.default = SpinTurret;
