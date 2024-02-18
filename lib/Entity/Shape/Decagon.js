"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractShape_1 = require("./AbstractShape");
class Decagon extends AbstractShape_1.default {
    constructor(game, isAlpha = false, shiny = (Math.random() < 0.1) && !isAlpha) {
        super(game);
        this.nameData.values.name = isAlpha ? "Zeta Decagon" : "Decagon";
        this.healthData.values.health = this.healthData.values.maxHealth = (isAlpha ? 64000 : 12500);
        this.physicsData.values.size = (isAlpha ? 740 : 360) * Math.SQRT1_2;
        this.physicsData.values.sides = 10;
        this.styleData.values.color = shiny ? 7 : 28;
        this.physicsData.values.absorbtionFactor = isAlpha ? 0.0 : 0.025;
        this.physicsData.values.pushFactor = 11;
        this.isAlpha = isAlpha;
        this.isShiny = shiny;
        this.damagePerTick = isAlpha ? 28 : 16;
        this.scoreReward = isAlpha ? 64000 : 16000;
        if (shiny) {
            this.scoreReward *= 8;
            this.healthData.values.health = this.healthData.values.maxHealth *= 2;
        }
    }
}
exports.default = Decagon;
Decagon.BASE_ROTATION = AbstractShape_1.default.BASE_ROTATION / 2;
Decagon.BASE_ORBIT = AbstractShape_1.default.BASE_ORBIT / 2;
Decagon.BASE_VELOCITY = AbstractShape_1.default.BASE_VELOCITY / 2;
