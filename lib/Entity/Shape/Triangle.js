"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractShape_1 = require("./AbstractShape");
class Triangle extends AbstractShape_1.default {
    constructor(game, shiny = Math.random() < 0.000001) {
        super(game);
        this.nameData.values.name = "Triangle";
        this.healthData.values.health = this.healthData.values.maxHealth = 30;
        this.physicsData.values.size = 55 * Math.SQRT1_2;
        this.physicsData.values.sides = 3;
        this.styleData.values.color = shiny ? 7 : 9;
        this.damagePerTick = 8;
        this.scoreReward = 25;
        this.isShiny = shiny;
        if (shiny) {
            this.scoreReward *= 100;
            this.healthData.values.health = this.healthData.values.maxHealth *= 10;
        }
    }
}
exports.default = Triangle;
