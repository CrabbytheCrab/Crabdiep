"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("../../Client");
const config_1 = require("../../config");
const Enums_1 = require("../../Const/Enums");
const Camera_1 = require("../../Native/Camera");
const AI_1 = require("../AI");
const TankBody_1 = require("../Tank/TankBody");
const TeamEntity_1 = require("./TeamEntity");
const POSSESSION_TIMER = config_1.tps * 60 * 10;
class Mothership extends TankBody_1.default {
    constructor(game) {
        const inputs = new AI_1.Inputs();
        const camera = new Camera_1.CameraEntity(game);
        camera.setLevel(140);
        super(game, camera, inputs);
        this.possessionStartTick = -1;
        this.relationsData.values.team = game.arena;
        this.styleData.values.color = 12;
        this.ai = new AI_1.AI(this, true);
        this.ai.inputs = inputs;
        this.ai.viewRange = 2000;
        this.positionData.values.x = 0;
        this.positionData.values.y = 0;
        this.setTank(204);
        this.nameData.values.name = "Mothership";
        this.scoreReward = 0;
        camera.cameraData.values.player = this;
        for (let i = 0; i < 7; ++i)
            camera.cameraData.values.statLevels.values[i] = 7;
        camera.cameraData.values.statLevels.values[7] = 1;
        const def = (this.definition = Object.assign({}, this.definition));
        def.maxHealth = 7008 - 418;
    }
    onDeath(killer) {
        const team = this.relationsData.values.team;
        const teamIsATeam = team instanceof TeamEntity_1.TeamEntity;
        const killerTeam = killer.relationsData.values.team;
        const killerTeamIsATeam = killerTeam instanceof TeamEntity_1.TeamEntity;
        this.game.broadcast()
            .u8(3)
            .stringNT(`${killerTeamIsATeam ? killerTeam.teamName : (killer.nameData?.values.name || "an unnamed tank")} has destroyed ${teamIsATeam ? team.teamName + "'s" : "a"} Mothership!`)
            .u32(killerTeamIsATeam ? Enums_1.ColorsHexCode[killerTeam.teamData.values.teamColor] : 0x000000)
            .float(-1)
            .stringNT("").send();
    }
    delete() {
        if (this.relationsData.values.team?.teamData)
            this.relationsData.values.team.teamData.flags &= ~1;
        this.ai.inputs.deleted = true;
        super.delete();
    }
    tick(tick) {
        if (!this.barrels.length)
            return super.tick(tick);
        this.inputs = this.ai.inputs;
        if (this.ai.state === 0) {
            const angle = this.positionData.values.angle + this.ai.passiveRotation;
            const mag = Math.sqrt((this.inputs.mouse.x - this.positionData.values.x) ** 2 + (this.inputs.mouse.y - this.positionData.values.y) ** 2);
            this.inputs.mouse.set({
                x: this.positionData.values.x + Math.cos(angle) * mag,
                y: this.positionData.values.y + Math.sin(angle) * mag
            });
        }
        else if (this.ai.state === 3 && this.possessionStartTick === -1) {
            this.possessionStartTick = tick;
        }
        if (this.possessionStartTick !== -1 && this.ai.state !== 3) {
            this.possessionStartTick = -1;
        }
        if (this.possessionStartTick !== -1) {
            if (this.possessionStartTick !== -1 && this.ai.state !== 3) {
                this.possessionStartTick = -1;
            }
            else if (this.inputs instanceof Client_1.ClientInputs) {
                if (tick - this.possessionStartTick >= POSSESSION_TIMER) {
                    this.inputs.deleted = true;
                }
                else if (tick - this.possessionStartTick === Math.floor(POSSESSION_TIMER - 10 * config_1.tps)) {
                    this.inputs.client.notify("You only have 10 seconds left in control of the Mothership", Enums_1.ColorsHexCode[this.styleData.values.color], 5000, "");
                }
            }
        }
        super.tick(tick);
    }
}
exports.default = Mothership;
