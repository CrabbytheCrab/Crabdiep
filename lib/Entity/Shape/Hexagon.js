"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractShape_1 = require("./AbstractShape");
class Hexagon extends AbstractShape_1.default {
    constructor(game, isAlpha = false, shiny = (Math.random() < 0.1) && !isAlpha) {
        super(game);
        this.nameData.values.name = isAlpha ? "Beta Hexagon" : "Hexagon";
        this.healthData.values.health = this.healthData.values.maxHealth = (isAlpha ? 6000 : 300);
        this.physicsData.values.size = (isAlpha ? 340 : 100) * Math.SQRT1_2;
        this.physicsData.values.sides = 6;
        this.styleData.values.color = shiny ? 7 : 20;
        this.physicsData.values.absorbtionFactor = isAlpha ? 0.025 : 0.1;
        this.physicsData.values.pushFactor = 11;
        this.isAlpha = isAlpha;
        this.isShiny = shiny;
        this.damagePerTick = isAlpha ? 20 : 12;
        this.scoreReward = isAlpha ? 6000 : 800;
        if (shiny) {
            this.scoreReward *= 8;
            this.healthData.values.health = this.healthData.values.maxHealth *= 2;
        }
    }
}
exports.default = Hexagon;
Hexagon.BASE_ROTATION = AbstractShape_1.default.BASE_ROTATION / 2;
Hexagon.BASE_ORBIT = AbstractShape_1.default.BASE_ORBIT / 2;
Hexagon.BASE_VELOCITY = AbstractShape_1.default.BASE_VELOCITY / 2;
