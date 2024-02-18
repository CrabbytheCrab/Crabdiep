"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Tank/Barrel");
const AbstractBoss_1 = require("./AbstractBoss");
let GuardianSpawnerDefinition = {
    angle: Math.PI,
    offset: 0,
    size: 95,
    width: 111.3,
    delay: 0,
    reload: 3,
    recoil: 1.75,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: "trapLauncher",
    forceFire: true,
    bullet: {
        type: "trap",
        sizeRatio: 0.8,
        health: 20,
        damage: 4,
        speed: 2,
        scatterRate: 1,
        lifeLength: 12,
        absorbtionFactor: 1
    }
};
let GuardianSpawnerDefinition2 = {
    angle: 0,
    offset: 30,
    size: 120,
    width: 42,
    delay: 0,
    reload: 1.8,
    recoil: 0.25,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        sizeRatio: 1,
        health: 8,
        damage: 0.5,
        speed: 1,
        scatterRate: 1,
        lifeLength: 1.5,
        absorbtionFactor: 0.6
    }
};
let GuardianSpawnerDefinition3 = {
    angle: 0,
    offset: -30,
    size: 120,
    width: 42,
    delay: 0.5,
    reload: 1.8,
    recoil: 0.25,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        sizeRatio: 1,
        health: 8,
        damage: 0.5,
        speed: 1,
        scatterRate: 1,
        lifeLength: 1.5,
        absorbtionFactor: 0.6
    }
};
let GuardianSpawnerDefinition4 = {
    angle: 0,
    offset: 45,
    size: 100,
    width: 42,
    delay: 0.25,
    reload: 1.8,
    recoil: 0.25,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        sizeRatio: 1,
        health: 8,
        damage: 0.5,
        speed: 1,
        scatterRate: 1,
        lifeLength: 1.5,
        absorbtionFactor: 0.6
    }
};
let GuardianSpawnerDefinition5 = {
    angle: 0,
    offset: -45,
    size: 100,
    width: 42,
    delay: 0.75,
    reload: 1.8,
    recoil: 0.25,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        sizeRatio: 1,
        health: 8,
        damage: 0.5,
        speed: 1,
        scatterRate: 1,
        lifeLength: 1.5,
        absorbtionFactor: 0.6
    }
};
const GUARDIAN_SIZE = 135;
class Beholder extends AbstractBoss_1.default {
    constructor(game) {
        super(game);
        this.nameData.values.name = 'Beholder';
        this.altName = 'Beholder of the Pentagons';
        this.styleData.values.color = 11;
        this.relationsData.values.team = this.game.arena;
        this.physicsData.values.size = GUARDIAN_SIZE * Math.SQRT1_2;
        this.physicsData.values.sides = 3;
        this.sizeFactor = 1.0;
        this.barrels.push(new Barrel_1.default(this, GuardianSpawnerDefinition4));
        this.barrels.push(new Barrel_1.default(this, GuardianSpawnerDefinition5));
        this.barrels.push(new Barrel_1.default(this, GuardianSpawnerDefinition));
        this.barrels.push(new Barrel_1.default(this, GuardianSpawnerDefinition2));
        this.barrels.push(new Barrel_1.default(this, GuardianSpawnerDefinition3));
    }
    moveAroundMap() {
        const x = this.positionData.values.x, y = this.positionData.values.y;
        if (this.ai.state === 0) {
            super.moveAroundMapShort();
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
exports.default = Beholder;
