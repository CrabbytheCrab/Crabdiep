"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractShape_1 = require("./AbstractShape");
class Pentagon extends AbstractShape_1.default {
    constructor(game, isAlpha = false, shiny = (Math.random() < 0.000001) && !isAlpha) {
        super(game);
        this.nameData.values.name = isAlpha ? "Alpha Pentagon" : "Pentagon";
        this.healthData.values.health = this.healthData.values.maxHealth = (isAlpha ? 3000 : 100);
        this.physicsData.values.size = (isAlpha ? 200 : 75) * Math.SQRT1_2;
        this.physicsData.values.sides = 5;
        this.styleData.values.color = shiny ? 7 : 10;
        this.physicsData.values.absorbtionFactor = isAlpha ? 0.05 : 0.5;
        this.physicsData.values.pushFactor = 11;
        this.isAlpha = isAlpha;
        this.isShiny = shiny;
        this.damagePerTick = isAlpha ? 20 : 12;
        this.scoreReward = isAlpha ? 3000 : 130;
        if (shiny) {
            this.scoreReward *= 100;
            this.healthData.values.health = this.healthData.values.maxHealth *= 10;
        }
    }
}
exports.default = Pentagon;
Pentagon.BASE_ROTATION = AbstractShape_1.default.BASE_ROTATION / 2;
Pentagon.BASE_ORBIT = AbstractShape_1.default.BASE_ORBIT / 2;
Pentagon.BASE_VELOCITY = AbstractShape_1.default.BASE_VELOCITY / 2;
