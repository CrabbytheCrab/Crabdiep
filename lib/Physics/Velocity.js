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
/**
 * UNDOCUMENTED FILE
 **/
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
