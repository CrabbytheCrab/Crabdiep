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
const AI_1 = require("../AI");
const FieldGroups_1 = require("../../Native/FieldGroups");
const Live_1 = require("../Live");
const TankBody_1 = require("../Tank/TankBody");
/**
 * Possible targets for movement
 */
var Target;
(function (Target) {
    Target[Target["None"] = -1] = "None";
    Target[Target["BottomRight"] = 0] = "BottomRight";
    Target[Target["TopRight"] = 1] = "TopRight";
    Target[Target["TopLeft"] = 2] = "TopLeft";
    Target[Target["BottomLeft"] = 3] = "BottomLeft";
})(Target || (Target = {}));
class BossMovementControl {
    constructor(boss) {
        /** Current target on the map. */
        this.target = Target.None;
        this.boss = boss;
    }
    moveBoss() {
        const { x, y } = this.boss.position.values;
        if (this.target === Target.None) {
            if (x >= 0 && y >= 0) {
                this.target = Target.BottomRight;
            }
            else if (x <= 0 && y >= 0) {
                this.target = Target.BottomLeft;
            }
            else if (x <= 0 && y <= 0) {
                this.target = Target.TopLeft;
            }
            else /*if (x >= 0 && y <= 0)*/ {
                this.target = Target.TopRight;
            }
        }
        const target = this.target === Target.BottomRight ?
            { x: 3 * this.boss.game.arena.arena.values.rightX / 4, y: 3 * this.boss.game.arena.arena.values.bottomY / 4 } : this.target === Target.BottomLeft ?
            { x: 3 * this.boss.game.arena.arena.values.leftX / 4, y: 3 * this.boss.game.arena.arena.values.bottomY / 4 } : this.target === Target.TopLeft ?
            { x: 3 * this.boss.game.arena.arena.values.leftX / 4, y: 3 * this.boss.game.arena.arena.values.topY / 4 } :
            { x: 3 * this.boss.game.arena.arena.values.rightX / 4, y: 3 * this.boss.game.arena.arena.values.topY / 4 };
        // Target becomes delta now
        target.x = (target.x - x);
        target.y = (target.y - y);
        const dist = target.x ** 2 + target.y ** 2;
        if (dist < 90000 /* 300 ** 2*/)
            this.target = (this.target + 1) % 4;
        else {
            const angle = Math.atan2(target.y, target.x);
            this.boss.inputs.movement.x = Math.cos(angle);
            this.boss.inputs.movement.y = Math.sin(angle);
        }
    }
}
/**
 * Class which represents all the bosses.
 */
class AbstractBoss extends Live_1.default {
    constructor(game) {
        super(game);
        /** Always existant name field group, present in all bosses. */
        this.name = new FieldGroups_1.NameGroup(this);
        /** Alternate name, eg Guardian and Guardian of the Pentagons to appear in notifications" */
        this.altName = "";
        /** The active change in size from the base size to the current. Contributes to barrel and addon sizes. */
        this.sizeFactor = 1;
        /** The reload time calculation property. Used for calculating reload of barrels. */
        this.reloadTime = 15;
        /** The boss's "camera entity" */
        this.cameraEntity = this;
        /** Whether or not the broadcast message was sent "The ___ has spawned!" */
        this.hasBeenWelcomed = false;
        /** List of the boss barrels. */
        this.barrels = [];
        /** The speed to maintain during movement. */
        this.movementSpeed = 0.5;
        /** The thing that controls map wide movement. */
        this.movementControl = new BossMovementControl(this);
        const { x, y } = this.game.arena.findSpawnLocation();
        this.position.values.x = x;
        this.position.values.y = y;
        this.relations.values.team = this.cameraEntity;
        this.physics.values.absorbtionFactor = 0.05;
        this.position.values.motion |= Enums_1.MotionFlags.absoluteRotation;
        this.scoreReward = 30000;
        this.damagePerTick = 60;
        this.ai = new AI_1.AI(this);
        this.ai.viewRange = 2000;
        this.inputs = this.ai.inputs;
        // default eh
        this.style.values.color = Enums_1.Colors.Fallen;
        this.physics.values.sides = 1;
        this.physics.values.size = 50 * Math.pow(1.01, 75 - 1);
        this.reloadTime = 15 * Math.pow(0.914, 7);
        this.sizeFactor = this.physics.values.size / 50;
        this.health.values.health = this.health.values.maxHealth = 3000;
    }
    // For map wide movement
    moveAroundMap() {
        this.movementControl.moveBoss();
    }
    /** See LivingEntity.onDeath
     * This broadcasts when people kill it
     * Will set game.arena.boss to null, so that the next boss can spawn
     */
    onDeath(killer) {
        // Reset arena.boss
        if (this.game.arena.boss === this)
            this.game.arena.boss = null;
        const killerName = (killer instanceof TankBody_1.default && killer.name.values.name) || "an unnamed tank";
        this.game.broadcast()
            .u8(Enums_1.ClientBound.Notification)
            .stringNT(`The ${this.altName || this.name.values.name} has been defeated by ${killerName}!`)
            .u32(0x000000)
            .float(10000)
            .stringNT("").send();
    }
    tick(tick) {
        // Force
        if (this.inputs !== this.ai.inputs)
            this.inputs = this.ai.inputs;
        this.ai.movementSpeed = this.movementSpeed;
        if (this.ai.state !== AI_1.AIState.possessed)
            this.moveAroundMap();
        else {
            const x = this.position.values.x, y = this.position.values.y;
            this.position.angle = Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x);
        }
        this.accel.add({
            x: this.inputs.movement.x * this.movementSpeed,
            y: this.inputs.movement.y * this.movementSpeed,
        });
        this.inputs.movement.set({
            x: 0,
            y: 0
        });
        this.regenPerTick = this.health.values.maxHealth / 25000;
        // So the name can be set in an extended constructor
        if (!this.hasBeenWelcomed) {
            let message = "An unnamed boss has spawned!";
            if (this.name.values.name) {
                message = `The ${this.altName || this.name.values.name} has spawned!`;
            }
            this.game.broadcast().u8(Enums_1.ClientBound.Notification).stringNT(message).u32(0x000000).float(10000).stringNT("").send();
            this.hasBeenWelcomed = true;
        }
        super.tick(tick);
    }
}
exports.default = AbstractBoss;
