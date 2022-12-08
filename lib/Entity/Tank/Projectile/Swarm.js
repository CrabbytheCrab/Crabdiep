"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swarm = void 0;
const Drone_1 = require("./Drone");
class Swarm extends Drone_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.ai.viewRange = 850 * tank.sizeFactor * 2;
    }
}
exports.Swarm = Swarm;
