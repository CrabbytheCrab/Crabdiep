"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = require("./Vector");
class Velocity extends Vector_1.default {
    constructor() {
        super(...arguments);
        this.previousPosition = new Vector_1.default();
        this.position = new Vector_1.default();
        this.firstTime = true;
    }
    updateVelocity() {
        this.x = this.position.x - this.previousPosition.x;
        this.y = this.position.y - this.previousPosition.y;
    }
    setPosition(newPosition) {
        this.previousPosition.set(this.position);
        this.position.set(newPosition);
        if (this.firstTime) {
            this.previousPosition.set(newPosition);
            this.firstTime = false;
        }
        this.updateVelocity();
    }
}
exports.default = Velocity;
