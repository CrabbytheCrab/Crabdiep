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
const Enums_1 = require("../../Const/Enums");
const Camera_1 = require("../../Native/Camera");
const AI_1 = require("../AI");
const Bullet_1 = require("../Tank/Projectile/Bullet");
const TankBody_1 = require("../Tank/TankBody");
/**
 * Dominator Tank
 */
class Dominator extends TankBody_1.default {
    constructor(arena, base, pTankId = null) {
        let tankId;
        if (pTankId === null) {
            const r = Math.random() * 3;
            if (r < 1)
                tankId = Enums_1.Tank.DominatorD;
            else if (r < 2)
                tankId = Enums_1.Tank.DominatorG;
            else
                tankId = Enums_1.Tank.DominatorT;
        }
        else
            tankId = pTankId;
        const inputs = new AI_1.Inputs();
        const camera = new Camera_1.CameraEntity(arena.game);
        camera.setLevel(75);
        camera.sizeFactor = (Dominator.SIZE / 50);
        super(arena.game, camera, inputs);
        this.relations.values.team = arena;
        this.physics.values.size = Dominator.SIZE;
        // TODO(ABC):
        // Add setTeam method for this
        this.style.values.color = Enums_1.Colors.Neutral;
        this.ai = new AI_1.AI(this);
        this.ai.inputs = inputs;
        this.ai.movementSpeed = 0;
        this.ai.viewRange = 2000;
        this.setTank(tankId);
        const def = (this.definition = Object.assign({}, this.definition));
        def.speed = camera.camera.values.movementSpeed = 0;
        this.name.values.name = "Dominator";
        this.name.values.nametag |= Enums_1.NametagFlags.hidden;
        this.physics.values.absorbtionFactor = 0;
        this.position.values.x = base.position.values.x;
        this.position.values.y = base.position.values.y;
        this.scoreReward = 0;
        camera.camera.values.player = this;
        this.base = base;
    }
    onDeath(killer) {
        if (this.relations.values.team === this.game.arena && killer instanceof TankBody_1.default) {
            this.relations.team = killer.relations.values.team || this.game.arena;
            this.style.color = this.relations.team.team?.teamColor || killer.style.values.color;
        }
        else {
            this.relations.team = this.game.arena;
            this.style.color = this.game.arena.team.teamColor;
        }
        this.base.style.color = this.style.values.color;
        this.base.relations.team = this.relations.values.team;
        ;
        this.health.health = this.health.values.maxHealth;
        for (let i = 1; i <= this.game.entities.lastId; ++i) {
            const entity = this.game.entities.inner[i];
            if (entity instanceof Bullet_1.default && entity.relations.values.owner === this)
                entity.destroy();
        }
        if (this.ai.state === AI_1.AIState.possessed) {
            this.ai.inputs.deleted = true;
            this.ai.inputs = this.inputs = new AI_1.Inputs();
            this.ai.state = AI_1.AIState.idle;
        }
    }
    tick(tick) {
        if (!this.barrels.length)
            return super.tick(tick);
        this.ai.aimSpeed = this.barrels[0].bulletAccel;
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
exports.default = Dominator;
/** Size of a dominator */
Dominator.SIZE = 160;
