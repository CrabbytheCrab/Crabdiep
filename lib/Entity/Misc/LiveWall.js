"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Live_1 = require("../Live");
class LiveWall extends Live_1.default {
    constructor(game, x, y, width, height) {
        super(game);
        this.positionData.values.x = x;
        this.positionData.values.y = y;
        this.healthData.maxHealth = this.healthData.health = 5000;
        this.damagePerTick = 15;
        this.physicsData.values.width = width;
        this.physicsData.values.size = height;
        this.physicsData.values.sides = 2;
        this.physicsData.values.flags |= 16 | 2;
        this.physicsData.values.pushFactor = 2;
        this.physicsData.values.absorbtionFactor = 0;
        this.styleData.values.borderWidth = 10;
        this.styleData.values.color = 18;
    }
    tick(tick) {
        const maxHealthCache = this.healthData.values.maxHealth;
        this.styleData.opacity = this.healthData.health / maxHealthCache;
    }
    onDeath(killer) {
        if (this.physicsData.flags && 2)
            this.physicsData.flags ^= 2;
    }
}
exports.default = LiveWall;
