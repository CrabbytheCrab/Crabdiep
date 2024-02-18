"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Object_1 = require("../Object");
class BounceWall extends Object_1.default {
    constructor(game, x, y, width, height) {
        super(game);
        this.positionData.values.x = x;
        this.positionData.values.y = y;
        this.physicsData.values.width = width;
        this.physicsData.values.size = height;
        this.physicsData.values.sides = 2;
        this.physicsData.values.flags |= 16 | 2;
        this.physicsData.values.pushFactor = 35;
        this.physicsData.values.absorbtionFactor = 0;
        this.styleData.values.borderWidth = 10;
        this.styleData.values.color = 0;
    }
}
exports.default = BounceWall;
