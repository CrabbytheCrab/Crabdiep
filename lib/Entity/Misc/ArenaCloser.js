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
const TankBody_1 = require("../Tank/TankBody");
const Enums_1 = require("../../Const/Enums");
const Camera_1 = require("../../Native/Camera");
const AI_1 = require("../AI");
/**
 * Represents the Arena Closers that end the game.
 */
class ArenaCloser extends TankBody_1.default {
    constructor(game) {
        const inputs = new AI_1.Inputs();
        const camera = new Camera_1.CameraEntity(game);
        const setLevel = camera.setLevel;
        camera.setLevel = function (level) {
            setLevel.call(this, level);
            this.sizeFactor *= (ArenaCloser.BASE_SIZE / 50);
        };
        camera.sizeFactor = (ArenaCloser.BASE_SIZE / 50);
        super(game, camera, inputs);
        this.relations.values.team = game.arena;
        this.ai = new AI_1.AI(this);
        this.ai.inputs = inputs;
        this.ai.viewRange = Infinity;
        this.health.values.healthbar |= Enums_1.HealthbarFlags.hidden;
        this.setTank(Enums_1.Tank.ArenaCloser);
        const def = (this.definition = Object.assign({}, this.definition));
        def.maxHealth = 10000;
        // TODO(ABC):
        // Fix all the stats
        def.speed = 1;
        this.damageReduction = 0;
        this.damagePerTick = 200;
        this.name.values.name = "Arena Closer";
        this.physics.values.absorbtionFactor = 0;
        this.style.values.color = Enums_1.Colors.Neutral;
        this.position.values.motion |= Enums_1.MotionFlags.canMoveThroughWalls;
        camera.camera.values.player = this;
        for (let i = Enums_1.Stat.MovementSpeed; i < Enums_1.Stat.BodyDamage; ++i)
            camera.camera.values.statLevels.values[i] = 7;
        this.ai.aimSpeed = this.barrels[0].bulletAccel * 1.6;
    }
    tick(tick) {
        this.ai.movementSpeed = this.cameraEntity.camera.values.movementSpeed * 10;
        this.inputs = this.ai.inputs;
        if (this.ai.state === AI_1.AIState.idle) {
            const angle = this.position.values.angle + this.ai.passiveRotation;
            const mag = Math.sqrt((this.inputs.mouse.x - this.position.values.x) ** 2 + (this.inputs.mouse.y - this.position.values.y) ** 2);
            this.inputs.mouse.set({
                x: this.position.values.x + Math.cos(angle) * mag,
                y: this.position.values.y + Math.sin(angle) * mag
            });
        }
        super.tick(tick);
    }
}
exports.default = ArenaCloser;
/** Size of a level 0 Arena Closer. */
ArenaCloser.BASE_SIZE = 175;
