"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Tank/Barrel");
const AbstractBoss_1 = require("./AbstractBoss");
const GuardianSpawnerDefinition = {
    angle: Math.PI,
    offset: 0,
    size: 120,
    width: 84,
    delay: 0,
    reload: 0.5,
    recoil: 1.25,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        sizeRatio: 1,
        health: 1,
        damage: 2,
        speed: 0.5,
        scatterRate: 3,
        lifeLength: 1.5,
        absorbtionFactor: 1
    }
};
const GuardianSpawnerDefinition2 = {
    angle: 0,
    offset: 0,
    size: 185,
    width: 84,
    delay: 0,
    reload: 3,
    recoil: 1,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        sizeRatio: 1,
        health: 7.5,
        damage: 3,
        speed: 1.5,
        scatterRate: 0.3,
        lifeLength: 1.5,
        absorbtionFactor: 1
    }
};
const GUARDIAN_SIZE = 135;
class Protector extends AbstractBoss_1.default {
    constructor(game) {
        super(game);
        this.nameData.values.name = 'Protector';
        this.altName = 'Protector of the Pentagons';
        this.styleData.values.color = 11;
        this.relationsData.values.team = this.game.arena;
        this.physicsData.values.size = GUARDIAN_SIZE * Math.SQRT1_2;
        this.physicsData.values.sides = 3;
        this.sizeFactor = 1.0;
        this.barrels.push(new Barrel_1.default(this, GuardianSpawnerDefinition));
        this.barrels.push(new Barrel_1.default(this, GuardianSpawnerDefinition2));
    }
    moveAroundMap() {
        const x = this.positionData.values.x, y = this.positionData.values.y;
        if (this.ai.state === 0) {
            super.moveAroundMap();
            this.positionData.angle = Math.atan2(this.inputs.movement.y, this.inputs.movement.x);
        }
        else {
            this.positionData.angle = Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x);
        }
    }
    tick(tick) {
        super.tick(tick);
        this.sizeFactor = (this.physicsData.values.size / Math.SQRT1_2) / GUARDIAN_SIZE;
    }
}
exports.default = Protector;
