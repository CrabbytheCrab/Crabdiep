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
const AutoTurret_1 = require("../Tank/AutoTurret");
const AbstractBoss_1 = require("./AbstractBoss");
const Enums_1 = require("../../Const/Enums");
const AI_1 = require("../AI");
/**
 * Definitions (stats and data) of the mounted turret on Defender
 *
 * Defender's gun
 */
const MountedTurretDefinition = {
    ...AutoTurret_1.AutoTurretDefinition,
    bullet: {
        ...AutoTurret_1.AutoTurretDefinition.bullet,
        speed: 2,
        damage: 0.75,
        health: 12.5,
        color: Enums_1.Colors.Neutral
    }
};
/**
 * Definitions (stats and data) of the trap launcher on Defender
 */
const DefenderDefinition = {
    angle: 0,
    offset: 0,
    size: 120,
    width: 71.4,
    delay: 0,
    reload: 4,
    recoil: 2,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: "trapLauncher",
    forceFire: true,
    bullet: {
        type: "trap",
        sizeRatio: 0.8,
        health: 12.5,
        damage: 4,
        speed: 3,
        scatterRate: 1,
        lifeLength: 5,
        absorbtionFactor: 1,
        color: Enums_1.Colors.Neutral
    }
};
// The size of a Defender by default
const DEFENDER_SIZE = 150;
/**
 * Class which represents the boss "Defender"
 */
class Defender extends AbstractBoss_1.default {
    constructor(game) {
        super(game);
        /** Defender's trap launchers */
        this.trappers = [];
        /** See AbstractBoss.movementSpeed */
        this.movementSpeed = 0.35;
        this.name.values.name = 'Defender';
        this.style.values.color = Enums_1.Colors.EnemyTriangle;
        this.relations.values.team = this.game.arena;
        this.physics.values.size = DEFENDER_SIZE * Math.SQRT1_2;
        this.sizeFactor = 1;
        this.physics.values.sides = 3;
        for (let i = 0; i < 3; ++i) {
            // Add trap launcher
            this.trappers.push(new Barrel_1.default(this, {
                ...DefenderDefinition,
                angle: Math.PI * 2 * ((i / 3) + 1 / 6)
            }));
            // TODO:
            // Maybe make this into a class of itself - DefenderAutoTurret
            const base = new AutoTurret_1.default(this, MountedTurretDefinition);
            const angle = base.ai.inputs.mouse.angle = Math.PI * 2 * (i / 3);
            base.position.values.y = this.physics.values.size * Math.sin(angle) * 0.6;
            base.position.values.x = this.physics.values.size * Math.cos(angle) * 0.6;
            base.physics.values.objectFlags |= Enums_1.MotionFlags.absoluteRotation;
            const tickBase = base.tick;
            base.tick = (tick) => {
                base.position.y = this.physics.values.size * Math.sin(angle) * 0.6;
                base.position.x = this.physics.values.size * Math.cos(angle) * 0.6;
                tickBase.call(base, tick);
            };
        }
    }
    tick(tick) {
        super.tick(tick);
        this.sizeFactor = (this.physics.values.size / Math.SQRT1_2) / DEFENDER_SIZE;
        if (this.ai.state !== AI_1.AIState.possessed) {
            this.inputs.flags = 0;
            this.position.angle += this.ai.passiveRotation * 1.5;
        }
    }
}
exports.default = Defender;
