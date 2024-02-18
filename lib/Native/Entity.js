"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
class Entity {
    constructor(game) {
        this.entityState = 0;
        this.relationsData = null;
        this.barrelData = null;
        this.physicsData = null;
        this.healthData = null;
        this.arenaData = null;
        this.nameData = null;
        this.cameraData = null;
        this.positionData = null;
        this.styleData = null;
        this.scoreData = null;
        this.teamData = null;
        this.id = -1;
        this.hash = 0;
        this.preservedHash = 0;
        this.game = game;
        game.entities.add(this);
    }
    static exists(entity) {
        return entity instanceof Entity && entity.hash !== 0;
    }
    wipeState() {
        if (this.relationsData)
            this.relationsData.wipe();
        if (this.barrelData)
            this.barrelData.wipe();
        if (this.physicsData)
            this.physicsData.wipe();
        if (this.healthData)
            this.healthData.wipe();
        if (this.arenaData)
            this.arenaData.wipe();
        if (this.nameData)
            this.nameData.wipe();
        if (this.cameraData)
            this.cameraData.wipe();
        if (this.positionData)
            this.positionData.wipe();
        if (this.styleData)
            this.styleData.wipe();
        if (this.scoreData)
            this.scoreData.wipe();
        if (this.teamData)
            this.teamData.wipe();
        this.entityState = 0;
    }
    delete() {
        this.wipeState();
        this.game.entities.delete(this.id);
    }
    tick(tick) { }
    toString() {
        return `${this.constructor.name} <${this.id}, ${this.preservedHash}>${this.hash === 0 ? "(deleted)" : ""}`;
    }
    [Symbol.toPrimitive](type) {
        if (type === "string")
            return this.toString();
        return this.preservedHash * 0x10000 + this.id;
    }
}
exports.Entity = Entity;
