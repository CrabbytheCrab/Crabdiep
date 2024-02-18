"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
const AI_1 = require("../../AI");
const Live_1 = require("../../Live");
const util = require("../../../util");
class Vortex extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.reloadTime = 15;
        this.cameraEntity = tank.cameraEntity;
        this.inputs = new AI_1.Inputs();
        this.sizeFactor = this.physicsData.values.size / 50;
        this.targetFilter = () => true;
        this.succrange = this.physicsData.size * 6;
    }
    tick(tick) {
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;
        super.tick(tick);
        const closestDistSq = (this.succrange * 2) ** 2;
        const entities = this.game.entities.collisionManager.retrieve(this.positionData.x, this.positionData.y, this.succrange, this.succrange);
        for (let i = 0; i < entities.length; ++i) {
            const entity = entities[i];
            if (!(entity instanceof Live_1.default))
                continue;
            if (entity.physicsData.values.flags & 64)
                continue;
            if (entity.relationsData.values.team === this.relationsData.values.team || entity.physicsData.values.sides === 0)
                continue;
            if (!this.targetFilter(entity.positionData.values))
                continue;
            const distSq = (entity.positionData.values.x - this.positionData.x) ** 2 + (entity.positionData.values.y - this.positionData.y) ** 2;
            if (distSq < closestDistSq) {
                let kbAngle;
                let diffY = this.positionData.values.y - entity.positionData.values.y;
                let diffX = this.positionData.values.x - entity.positionData.values.x;
                if (diffX === 0 && diffY === 0)
                    kbAngle = Math.random() * util.PI2;
                else {
                    kbAngle = Math.atan2(diffY, diffX);
                    entity.addAcceleration(kbAngle, this.physicsData.pushFactor);
                }
                if (entity instanceof Bullet_1.default) {
                    entity.movementAngle = kbAngle;
                }
            }
        }
    }
}
exports.default = Vortex;
