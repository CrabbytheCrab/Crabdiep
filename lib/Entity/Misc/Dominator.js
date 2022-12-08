"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Camera_1 = require("../../Native/Camera");
const AI_1 = require("../AI");
const Bullet_1 = require("../Tank/Projectile/Bullet");
const TankBody_1 = require("../Tank/TankBody");
class Dominator extends TankBody_1.default {
    constructor(arena, base, pTankId = null) {
        let tankId;
        if (pTankId === null) {
            const r = Math.random() * 5;
            if (r < 1)
                tankId = 91;
            else if (r < 2)
                tankId = 92;
            else if (r < 3)
                tankId = 106;
            else if (r < 4)
                tankId = 93;
            else
                tankId = 107;
        }
        else
            tankId = pTankId;
        const inputs = new AI_1.Inputs();
        const camera = new Camera_1.CameraEntity(arena.game);
        camera.setLevel(75);
        camera.sizeFactor = (Dominator.SIZE / 50);
        super(arena.game, camera, inputs);
        this.relationsData.values.team = arena;
        this.physicsData.values.size = Dominator.SIZE;
        this.styleData.values.color = 12;
        this.ai = new AI_1.AI(this, true);
        this.ai.inputs = inputs;
        this.ai.movementSpeed = 0;
        this.ai.viewRange = 2000;
        this.ai.doAimPrediction = true;
        this.setTank(tankId);
        const def = (this.definition = Object.assign({}, this.definition));
        def.speed = camera.cameraData.values.movementSpeed = 0;
        this.nameData.values.name = "Dominator";
        this.nameData.values.flags |= 1;
        this.physicsData.values.absorbtionFactor = 0;
        this.positionData.values.x = base.positionData.values.x;
        this.positionData.values.y = base.positionData.values.y;
        this.scoreReward = 0;
        camera.cameraData.values.player = this;
        this.base = base;
    }
    onDeath(killer) {
        if (this.relationsData.values.team === this.game.arena && killer instanceof TankBody_1.default) {
            this.relationsData.team = killer.relationsData.values.team || this.game.arena;
            this.styleData.color = this.relationsData.team.teamData?.teamColor || killer.styleData.values.color;
        }
        else {
            this.relationsData.team = this.game.arena;
            this.styleData.color = this.game.arena.teamData.teamColor;
        }
        this.base.styleData.color = this.styleData.values.color;
        this.base.relationsData.team = this.relationsData.values.team;
        ;
        this.healthData.health = this.healthData.values.maxHealth;
        for (let i = 1; i <= this.game.entities.lastId; ++i) {
            const entity = this.game.entities.inner[i];
            if (entity instanceof Bullet_1.default && entity.relationsData.values.owner === this)
                entity.destroy();
        }
        if (this.ai.state === 3) {
            this.ai.inputs.deleted = true;
            this.ai.inputs = this.inputs = new AI_1.Inputs();
            this.ai.state = 0;
        }
    }
    tick(tick) {
        if (!this.barrels.length)
            return super.tick(tick);
        this.ai.aimSpeed = this.barrels[0].bulletAccel;
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
exports.default = Dominator;
Dominator.SIZE = 160;
