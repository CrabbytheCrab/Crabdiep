"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Barrel_1 = require("../Tank/Barrel");
const AbstractBoss_1 = require("./AbstractBoss");
const util_1 = require("../../util");
const SummonerSpawnerDefinition = {
    angle: Math.PI,
    offset: 0,
    size: 135,
    width: 71.4,
    delay: 0,
    reload: 0.25,
    recoil: 1,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    droneCount: 7,
    canControlDrones: true,
    bullet: {
        type: "drone",
        sizeRatio: 55 * Math.SQRT1_2 / (71.4 / 2),
        health: 12.5,
        damage: 0.5,
        speed: 1.7,
        scatterRate: 1,
        lifeLength: -1,
        absorbtionFactor: 1,
        color: 16,
        sides: 4
    }
};
const SUMMONER_SIZE = 150;
class Summoner extends AbstractBoss_1.default {
    constructor(game) {
        super(game);
        this.spawners = [];
        this.nameData.values.name = 'Summoner';
        this.styleData.values.color = 8;
        this.relationsData.values.team = this.game.arena;
        this.physicsData.values.size = SUMMONER_SIZE * Math.SQRT1_2;
        this.sizeFactor = 1;
        this.physicsData.values.sides = 4;
        for (let i = 0; i < 4; ++i) {
            this.spawners.push(new Barrel_1.default(this, {
                ...SummonerSpawnerDefinition,
                angle: util_1.PI2 * ((i / 4) - 1 / 4)
            }));
        }
    }
    tick(tick) {
        super.tick(tick);
        this.sizeFactor = (this.physicsData.values.size / Math.SQRT1_2) / SUMMONER_SIZE;
        if (this.ai.state !== 3) {
            this.positionData.angle += this.ai.passiveRotation;
        }
    }
}
exports.default = Summoner;
