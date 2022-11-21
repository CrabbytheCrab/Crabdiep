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
const Arena_1 = require("../../Native/Arena");
const Enums_1 = require("../../Const/Enums");
const Dominator_1 = require("../../Entity/Misc/Dominator");
const TeamBase_1 = require("../../Entity/Misc/TeamBase");
const Sandbox_1 = require("../Sandbox");
/**
 * Sandbox Gamemode Arena
 */
class SpikeboxArena extends Arena_1.default {
    constructor(game) {
        super(game);
        /** Limits shape count to floor(12.5 * player count) */
        this.shapes = new Sandbox_1.SandboxShapeManager(this);
        this.updateBounds(2500, 2500);
        // const spike = new TankBody(this.game, new CameraEntity(this.game), new Inputs());
        // spike.cameraEntity.camera.player = spike;
        // spike.setTank(Tank.Spike);
        // spike.style.styleFlags &= ~StyleFlags.invincibility;
        // spike.physics.objectFlags |= ObjectFlags.base;
        // /* @ts-ignore */
        // spike.damageReduction = 0;
        // Object.defineProperty(spike, "damagePerTick", {
        //     get() {
        //         return 0;
        //     },
        //     set() {}
        // });
        // spike.physics.values.pushFactor = 24;
        // spike.physics.absorbtionFactor = 0.0;
        // spike.cameraEntity.setLevel(101);
        // spike.style.color = Colors.TeamBlue;
        const spike = new Dominator_1.default(this, new TeamBase_1.default(game, this, 0, 0, 750, 750, false), Enums_1.Tank.Spike);
        spike.name.nametag &= ~Enums_1.NametagFlags.hidden;
    }
    tick(tick) {
        const arenaSize = Math.floor(25 * Math.sqrt(Math.max(this.game.clients.size, 1))) * 100;
        if (this.width !== arenaSize || this.height !== arenaSize)
            this.updateBounds(arenaSize, arenaSize);
        super.tick(tick);
    }
}
exports.default = SpikeboxArena;
