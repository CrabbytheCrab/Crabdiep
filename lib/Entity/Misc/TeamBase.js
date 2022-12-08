"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Live_1 = require("../Live");
class TeamBase extends Live_1.default {
    constructor(game, team, x, y, width, height, painful = true) {
        super(game);
        this.relationsData.values.team = team;
        this.positionData.values.x = x;
        this.positionData.values.y = y;
        this.physicsData.values.width = width;
        this.physicsData.values.size = height;
        this.physicsData.values.sides = 2;
        this.physicsData.values.flags |= 2 | 8 | 64;
        this.physicsData.values.pushFactor = 2;
        this.damagePerTick = 5;
        if (!painful) {
            this.physicsData.values.pushFactor = 0;
            this.damagePerTick = 0;
        }
        this.damageReduction = 0;
        this.physicsData.values.absorbtionFactor = 0;
        this.styleData.values.opacity = 0.1;
        this.styleData.values.borderWidth = 0;
        this.styleData.values.color = team.teamData.teamColor;
        this.styleData.values.flags |= 8 | 128;
        this.healthData.flags |= 1;
        this.healthData.health = this.healthData.values.maxHealth = 0xABCFF;
    }
    tick(tick) {
        this.lastDamageTick = tick;
    }
}
exports.default = TeamBase;
