"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    static isFinite(vector) {
        return Number.isFinite(vector.x) && Number.isFinite(vector.y);
    }
    static fromPolar(theta, distance) {
        return new Vector(distance * Math.cos(theta), distance * Math.sin(theta));
    }
    set(vector) {
        this.x = vector.x;
        this.y = vector.y;
    }
    add(vector) {
        this.x += vector.x,
            this.y += vector.y;
    }
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }
    distanceToSQ(vector) {
        return (vector.x - this.x) ** 2 + (vector.y - this.y) ** 2;
    }
    angleComponent(angle) {
        return Math.cos(this.angle - angle) * this.magnitude;
    }
    set angle(angle) {
        const currentMag = this.magnitude;
        this.set({
            x: Math.cos(angle) * currentMag,
            y: Math.sin(angle) * currentMag
        });
    }
    set magnitude(magnitude) {
        const currentDir = this.angle;
        this.set({
            x: Math.cos(currentDir) * magnitude,
            y: Math.sin(currentDir) * magnitude
        });
    }
    get magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    get angle() {
        return Math.atan2(this.y, this.x);
    }
}
exports.default = Vector;
