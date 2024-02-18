"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractShape_1 = require("./AbstractShape");
class Nonagon extends AbstractShape_1.default {
    constructor(game, isAlpha = false, shiny = (Math.random() < 0.1) && !isAlpha) {
        super(game);
        this.nameData.values.name = isAlpha ? "Epsilon Nonagon" : "Nonagon";
        this.healthData.values.health = this.healthData.values.maxHealth = (isAlpha ? 29000 : 7800);
        this.physicsData.values.size = (isAlpha ? 630 : 280) * Math.SQRT1_2;
        this.physicsData.values.sides = 9;
        this.styleData.values.color = shiny ? 7 : 27;
        this.physicsData.values.absorbtionFactor = isAlpha ? 0.0 : 0.025;
        this.physicsData.values.pushFactor = 11;
        this.isAlpha = isAlpha;
        this.isShiny = shiny;
        this.damagePerTick = isAlpha ? 28 : 16;
        this.scoreReward = isAlpha ? 29000 : 9200;
        if (shiny) {
            this.scoreReward *= 8;
            this.healthData.values.health = this.healthData.values.maxHealth *= 2;
        }
    }
}
exports.default = Nonagon;
Nonagon.BASE_ROTATION = AbstractShape_1.default.BASE_ROTATION / 2;
Nonagon.BASE_ORBIT = AbstractShape_1.default.BASE_ORBIT / 2;
Nonagon.BASE_VELOCITY = AbstractShape_1.default.BASE_VELOCITY / 2;
