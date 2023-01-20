"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TankBody_1 = require("../Tank/TankBody");
const Camera_1 = require("../../Native/Camera");
const AI_1 = require("../AI");
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
        this.relationsData.values.team = game.arena;
        this.ai = new AI_1.AI(this);
        this.ai.inputs = inputs;
        this.ai.viewRange = Infinity;
        this.setTank(105);
        const def = (this.definition = Object.assign({}, this.definition));
        def.maxHealth = 10000;
        def.speed = 1;
        this.damagePerTick = 200;
        this.nameData.values.name = "Arena Closer";
        this.styleData.values.color = 12;
        this.positionData.values.flags |= 2;
        this.physicsData.values.flags |= 256;
        camera.cameraData.values.player = this;
        for (let i = 0; i < 5; ++i)
            camera.cameraData.values.statLevels.values[i] = 7;
        this.ai.aimSpeed = this.barrels[0].bulletAccel * 1.6;
        this.setInvulnerability(true);
    }
    tick(tick) {
        this.ai.movementSpeed = this.cameraEntity.cameraData.values.movementSpeed * 10;
        this.inputs = this.ai.inputs;
        if (this.ai.state === 0) {
            const angle = this.positionData.values.angle + this.ai.passiveRotation;
            const mag = Math.sqrt((this.inputs.mouse.x - this.positionData.values.x) ** 2 + (this.inputs.mouse.y - this.positionData.values.y) ** 2);
            this.inputs.mouse.set({
                x: this.positionData.values.x + Math.cos(angle) * mag,
                y: this.positionData.values.y + Math.sin(angle) * mag
            });
        }
        super.tick(tick);
    }
}
exports.default = ArenaCloser;
ArenaCloser.BASE_SIZE = 175;
