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
exports.SandboxShapeManager = void 0;
const Arena_1 = require("../Native/Arena");
const Manager_1 = require("../Entity/Shape/Manager");
/**
 * Manage shape count
 */
class SandboxShapeManager extends Manager_1.default {
    get wantedShapes() {
        let i = 0;
        for (const client of this.game.clients) {
            if (client.camera)
                i += 1;
        }
        return Math.floor(i * 12.5);
    }
}
exports.SandboxShapeManager = SandboxShapeManager;
/**
 * Sandbox Gamemode Arena
 */
class SandboxArena extends Arena_1.default {
    constructor(game) {
        super(game);
        /** Limits shape count to floor(12.5 * player count) */
        this.shapes = new SandboxShapeManager(this);
        this.updateBounds(2500, 2500);
        // const w1 = new MazeWall(this.game, 0, 0, 500, 500);
    }
    tick(tick) {
        const arenaSize = Math.floor(25 * Math.sqrt(Math.max(this.game.clients.size, 1))) * 100;
        if (this.width !== arenaSize || this.height !== arenaSize)
            this.updateBounds(arenaSize, arenaSize);
        super.tick(tick);
    }
}
exports.default = SandboxArena;
