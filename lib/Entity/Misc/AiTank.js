"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config");
const Camera_1 = require("../../Native/Camera");
const Vector_1 = require("../../Physics/Vector");
const AI_1 = require("../AI");
const TankBody_1 = require("../Tank/TankBody");
const POSSESSION_TIMER = config_1.tps * 60 * 10;
class AiTank extends TankBody_1.default {
    constructor(game, owner) {
        const inputs = new AI_1.Inputs();
        const camera = new Camera_1.CameraEntity(game);
        super(game, camera, inputs);
        this.possessionStartTick = -1;
        this.camera = camera;
        this.owner = owner;
        this.relationsData.values.team = game.arena;
        this.yes = true;
        this.styleData.values.color = 12;
        this.super = false;
        this.ai = new AI_1.AI(this, true);
        this.ai.inputs = inputs;
        this.ai.viewRange = 2000;
        this.positionData.values.x = 0;
        this.positionData.values.y = 0;
        this.nameData.values.name = "4I T4nK";
        camera.cameraData.values.player = this;
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
            const dist = new Vector_1.default(this.owner.positionData.x, this.owner.positionData.y).distanceToSQ(this.positionData.values);
            if (dist < AiTank.RETURN_RANGE) {
                this.inputs.mouse.set({
                    x: this.positionData.values.x + Math.cos(angle) * mag,
                    y: this.positionData.values.y + Math.sin(angle) * mag
                });
            }
            else {
                this.inputs.movement.set({
                    x: this.owner.positionData.x - this.positionData.x,
                    y: this.owner.positionData.y - this.positionData.y
                });
                this.inputs.movement.magnitude = 1;
                const angle2 = Math.atan2(this.owner.positionData.y - this.positionData.y, this.owner.positionData.x - this.positionData.x);
                this.inputs.mouse.set({
                    x: this.positionData.values.x + Math.cos(angle2) * mag,
                    y: this.positionData.values.y + Math.sin(angle2) * mag
                });
            }
        }
        else if (this.ai.state === 3 && this.possessionStartTick === -1) {
            this.possessionStartTick = tick;
        }
        if (this.possessionStartTick !== -1 && this.ai.state !== 3) {
            this.possessionStartTick = -1;
        }
        if (this.yes) {
            if (!this.super) {
                this.camera.setLevel(15);
                this.setTank(0);
                for (let i = 0; i < 0; ++i)
                    this.camera.cameraData.values.statLevels.values[i] = 2;
                this.camera.cameraData.values.statLevels.values[0] = 2;
                this.camera.cameraData.values.statLevels.values[1] = 2;
                this.camera.cameraData.values.statLevels.values[2] = 2;
                this.camera.cameraData.values.statLevels.values[3] = 2;
                const def = (this.definition = Object.assign({}, this.definition));
                def.maxHealth = 50;
            }
            else {
                this.camera.setLevel(30);
                for (let i = 0; i > 0; ++i)
                    this.camera.cameraData.values.statLevels.values[i] = 3;
                this.camera.cameraData.values.statLevels.values[0] = 2;
                const def = (this.definition = Object.assign({}, this.definition));
                def.maxHealth = 75;
                const tonk = Math.random();
                if (tonk < 0.1) {
                    this.setTank(16);
                    this.camera.cameraData.values.statLevels.values[1] = 5;
                    this.camera.cameraData.values.statLevels.values[2] = 5;
                    this.camera.cameraData.values.statLevels.values[3] = 6;
                    this.camera.cameraData.values.statLevels.values[4] = 1;
                    this.camera.cameraData.values.statLevels.values[0] = 3;
                }
                else if (tonk < 0.2) {
                    this.setTank(22);
                    this.camera.cameraData.values.statLevels.values[1] = 2;
                    this.camera.cameraData.values.statLevels.values[2] = 5;
                    this.camera.cameraData.values.statLevels.values[3] = 5;
                    this.camera.cameraData.values.statLevels.values[4] = 6;
                }
                else if (tonk < 0.3) {
                    this.setTank(27);
                    this.camera.cameraData.values.statLevels.values[1] = 4;
                    this.camera.cameraData.values.statLevels.values[2] = 4;
                    this.camera.cameraData.values.statLevels.values[3] = 4;
                    this.camera.cameraData.values.statLevels.values[4] = 6;
                }
                else if (tonk < 0.4) {
                    this.setTank(8);
                    this.camera.cameraData.values.statLevels.values[0] = 3;
                    this.camera.cameraData.values.statLevels.values[7] = 5;
                    this.camera.cameraData.values.statLevels.values[6] = 6;
                    this.camera.cameraData.values.statLevels.values[5] = 6;
                    this.ai.viewRange = 2400;
                }
                else if (tonk < 0.5) {
                    this.setTank(18);
                    this.camera.cameraData.values.statLevels.values[6] = 3;
                    this.camera.cameraData.values.statLevels.values[5] = 3;
                    this.camera.cameraData.values.statLevels.values[1] = 4;
                    this.camera.cameraData.values.statLevels.values[2] = 4;
                    this.camera.cameraData.values.statLevels.values[3] = 4;
                }
                else if (tonk < 0.6) {
                    this.setTank(21);
                    this.camera.cameraData.values.statLevels.values[1] = 6;
                    this.camera.cameraData.values.statLevels.values[2] = 4;
                    this.camera.cameraData.values.statLevels.values[3] = 4;
                    this.camera.cameraData.values.statLevels.values[4] = 4;
                }
                else if (tonk < 0.7) {
                    this.setTank(31);
                    this.camera.cameraData.values.statLevels.values[1] = 4;
                    this.camera.cameraData.values.statLevels.values[2] = 4;
                    this.camera.cameraData.values.statLevels.values[3] = 5;
                    this.camera.cameraData.values.statLevels.values[4] = 5;
                }
                else if (tonk < 0.8) {
                    this.setTank(13);
                    this.camera.cameraData.values.statLevels.values[1] = 2;
                    this.camera.cameraData.values.statLevels.values[2] = 6;
                    this.camera.cameraData.values.statLevels.values[3] = 5;
                    this.camera.cameraData.values.statLevels.values[4] = 4;
                    this.ai.viewRange = 2400;
                }
                else if (tonk < 0.9) {
                    this.setTank(9);
                    this.camera.cameraData.values.statLevels.values[1] = 5;
                    this.camera.cameraData.values.statLevels.values[2] = 4;
                    this.camera.cameraData.values.statLevels.values[3] = 4;
                    this.camera.cameraData.values.statLevels.values[4] = 5;
                }
                else {
                    this.setTank(10);
                    this.camera.cameraData.values.statLevels.values[1] = 6;
                    this.camera.cameraData.values.statLevels.values[2] = 6;
                    this.camera.cameraData.values.statLevels.values[3] = 6;
                    this.camera.cameraData.values.statLevels.values[4] = 0;
                }
            }
            this.yes = false;
        }
        super.tick(tick);
    }
}
exports.default = AiTank;
AiTank.RETURN_RANGE = 500 ** 2;
