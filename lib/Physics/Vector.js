"use strict";
/*
    DiepCustom - custom tank game server that shares diep.io's WebSocket protocol
    Copyright (C) 2022 ABCxFF (github.com/ABCxFF)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <https://www.gnu.org/licenses/>
*/
Object.defineProperty(exports, "__esModule", { value: true });
;
class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    /** Returns true if the `Vector` only contains real numbers in the `x` and `y` property. */
    static isFinite(vector) {
        return Number.isFinite(vector.x) && Number.isFinite(vector.y);
    }
    /** Converts coordinates from the polar coordinate system to the cartesian coordinate system */
    static fromPolar(theta, distance) {
        return new Vector(distance * Math.cos(theta), distance * Math.sin(theta));
    }
    /** Replaces this vector's properties with another vector */
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
        // if angle is 0, it will get the x component
        // if angle is pi/2, it will get the y component
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
