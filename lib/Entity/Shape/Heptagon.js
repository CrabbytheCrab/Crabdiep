"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractShape_1 = require("./AbstractShape");
class Heptagon extends AbstractShape_1.default {
    constructor(game, isAlpha = false, shiny = (Math.random() < 0.1) && !isAlpha) {
        super(game);
        this.nameData.values.name = isAlpha ? "Gamma Heptagon" : "Heptagon";
        this.healthData.values.health = this.healthData.values.maxHealth = (isAlpha ? 9500 : 900);
        this.physicsData.values.size = (isAlpha ? 460 : 145) * Math.SQRT1_2;
        this.physicsData.values.sides = 7;
        this.styleData.values.color = shiny ? 7 : 23;
        this.physicsData.values.absorbtionFactor = isAlpha ? 0.025 : 0.1;
        this.physicsData.values.pushFactor = 11;
        this.isAlpha = isAlpha;
        this.isShiny = shiny;
        this.damagePerTick = isAlpha ? 20 : 12;
        this.scoreReward = isAlpha ? 9500 : 1250;
        if (shiny) {
            this.scoreReward *= 8;
            this.healthData.values.health = this.healthData.values.maxHealth *= 2;
        }
    }
}
exports.default = Heptagon;
Heptagon.BASE_ROTATION = AbstractShape_1.default.BASE_ROTATION / 2;
Heptagon.BASE_ORBIT = AbstractShape_1.default.BASE_ORBIT / 2;
Heptagon.BASE_VELOCITY = AbstractShape_1.default.BASE_VELOCITY / 2;
