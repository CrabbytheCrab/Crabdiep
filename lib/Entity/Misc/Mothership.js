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
const Client_1 = require("../../Client");
const config_1 = require("../../config");
const Enums_1 = require("../../Const/Enums");
const Camera_1 = require("../../Native/Camera");
const AI_1 = require("../AI");
const TankBody_1 = require("../Tank/TankBody");
const TeamEntity_1 = require("./TeamEntity");
const POSSESSION_TIMER = config_1.tps * 60 * 10;
/**
 * Mothership Entity
 */
class Mothership extends TankBody_1.default {
    constructor(arena) {
        const inputs = new AI_1.Inputs();
        const camera = new Camera_1.CameraEntity(arena.game);
        camera.setLevel(140);
        super(arena.game, camera, inputs);
        /** If the mothership's AI ever gets possessed, this is the tick that the possession started. */
        this.possessionStartTick = -1;
        this.relations.values.team = arena;
        this.style.values.color = Enums_1.Colors.Neutral;
        this.ai = new AI_1.AI(this);
        this.ai.inputs = inputs;
        this.ai.viewRange = 2000;
        this.position.values.x = 0;
        this.position.values.y = 0;
        this.setTank(Enums_1.Tank.Mothership);
        this.name.values.name = "Mothership";
        this.scoreReward = 0;
        camera.camera.values.player = this;
        for (let i = Enums_1.Stat.MovementSpeed; i < Enums_1.Stat.HealthRegen; ++i)
            camera.camera.values.statLevels.values[i] = 7;
        camera.camera.values.statLevels.values[Enums_1.Stat.HealthRegen] = 1;
        const def = (this.definition = Object.assign({}, this.definition));
        // 418 is what the normal health increase for stat/level would be, so we just subtract it and force it 7k
        def.maxHealth = 7008 - 418;
    }
    onDeath(killer) {
        const team = this.relations.values.team;
        const teamIsATeam = team instanceof TeamEntity_1.TeamEntity;
        const killerTeam = killer.relations.values.team;
        const killerTeamIsATeam = killerTeam instanceof TeamEntity_1.TeamEntity;
        // UNCOMMENT TO ALLOW SOLO KILLS
        // if (!killerTeamIsATeam) return;
        this.game.broadcast()
            .u8(Enums_1.ClientBound.Notification)
            // If mothership has a team name, use it, otherwise just say has destroyed a mothership
            .stringNT(`${killerTeamIsATeam ? killerTeam.teamName : (killer.name?.values.name || "an unnamed tank")} has destroyed ${teamIsATeam ? team.teamName + "'s" : "a"} Mothership!`)
            .u32(killerTeamIsATeam ? Enums_1.ColorsHexCode[killerTeam.team.values.teamColor] : 0x000000)
            .float(-1)
            .stringNT("").send();
    }
    delete() {
        // No more mothership arrow - seems like in old diep this wasn't the case - we should probably keep though
        if (this.relations.values.team?.team)
            this.relations.values.team.team.mothership &= ~Enums_1.MothershipFlags.hasMothership;
        super.delete();
    }
    tick(tick) {
        if (!this.barrels.length)
            return super.tick(tick);
        this.inputs = this.ai.inputs;
        if (this.ai.state === AI_1.AIState.idle) {
            const angle = this.position.values.angle + this.ai.passiveRotation;
            const mag = Math.sqrt((this.inputs.mouse.x - this.position.values.x) ** 2 + (this.inputs.mouse.y - this.position.values.y) ** 2);
            this.inputs.mouse.set({
                x: this.position.values.x + Math.cos(angle) * mag,
                y: this.position.values.y + Math.sin(angle) * mag
            });
        }
        else if (this.ai.state === AI_1.AIState.possessed && this.possessionStartTick === -1) {
            this.possessionStartTick = tick;
        }
        if (this.possessionStartTick !== -1 && this.ai.state !== AI_1.AIState.possessed) {
            this.possessionStartTick = -1;
        }
        // after 10 minutes, kick out the person possessing
        if (this.possessionStartTick !== -1) {
            if (this.possessionStartTick !== -1 && this.ai.state !== AI_1.AIState.possessed) {
                this.possessionStartTick = -1;
            }
            else if (this.inputs instanceof Client_1.ClientInputs) {
                if (tick - this.possessionStartTick >= POSSESSION_TIMER) {
                    this.inputs.deleted = true;
                }
                else if (tick - this.possessionStartTick === Math.floor(POSSESSION_TIMER - 10 * config_1.tps)) {
                    this.inputs.client.notify("You only have 10 seconds left in control of the Mothership", Enums_1.ColorsHexCode[this.style.values.color], 5000, "");
                }
            }
        }
        super.tick(tick);
    }
}
exports.default = Mothership;
