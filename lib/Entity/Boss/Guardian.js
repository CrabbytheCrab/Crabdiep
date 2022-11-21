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
const Barrel_1 = require("../Tank/Barrel");
const AbstractBoss_1 = require("./AbstractBoss");
const Enums_1 = require("../../Const/Enums");
const AI_1 = require("../AI");
const GuardianSpawnerDefinition = {
    angle: Math.PI,
    offset: 0,
    size: 100,
    width: 71.4,
    delay: 0,
    reload: 0.25,
    recoil: 1,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    droneCount: 24,
    canControlDrones: true,
    bullet: {
        type: "drone",
        sizeRatio: 21 / (71.4 / 2),
        health: 12.5,
        damage: 0.5,
        speed: 1.7,
        scatterRate: 1,
        lifeLength: 1.5,
        absorbtionFactor: 1
    }
};
// The size of Guardian by default
const GUARDIAN_SIZE = 135;
/**
 * Class which represents the boss "Guardian"
 */
class Guardian extends AbstractBoss_1.default {
    constructor(game) {
        super(game);
        this.name.values.name = 'Guardian';
        this.altName = 'Guardian of the Pentagons';
        this.style.values.color = Enums_1.Colors.EnemyCrasher;
        this.relations.values.team = this.game.arena;
        this.physics.values.size = GUARDIAN_SIZE * Math.SQRT1_2;
        this.physics.values.sides = 3;
        this.sizeFactor = 1.0;
        this.barrels.push(new Barrel_1.default(this, GuardianSpawnerDefinition));
    }
    moveAroundMap() {
        super.moveAroundMap();
        this.position.angle = Math.atan2(this.inputs.movement.y, this.inputs.movement.x);
    }
    tick(tick) {
        super.tick(tick);
        // Let it scale with the guardian
        this.sizeFactor = (this.physics.values.size / Math.SQRT1_2) / GUARDIAN_SIZE;
        if (this.ai.state !== AI_1.AIState.possessed) {
            this.inputs.flags = 0;
        }
    }
}
exports.default = Guardian;
