"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraEntity = void 0;
const TankBody_1 = require("../Entity/Tank/TankBody");
const Object_1 = require("../Entity/Object");
const Entity_1 = require("./Entity");
const FieldGroups_1 = require("./FieldGroups");
const Enums_1 = require("../Const/Enums");
const TankDefinitions_1 = require("../Const/TankDefinitions");
const util_1 = require("../util");
const UpcreateCompiler_1 = require("./UpcreateCompiler");
class CameraEntity extends Entity_1.Entity {
    constructor() {
        super(...arguments);
        this.cameraData = new FieldGroups_1.CameraGroup(this);
        this.maxlevel = 45;
        this.sizeFactor = 1;
    }
    setLevel(level) {
        const previousLevel = this.cameraData.values.level;
        this.cameraData.level = level;
        this.sizeFactor = Math.pow(1.01, level - 1);
        this.cameraData.levelbarMax = level < this.maxlevel ? 1 : 0;
        if (level <= this.maxlevel) {
            this.cameraData.score = (0, Enums_1.levelToScore)(level, this);
            const player = this.cameraData.values.player;
            if (Entity_1.Entity.exists(player) && player instanceof TankBody_1.default) {
                player.scoreData.score = this.cameraData.values.score;
                player.scoreReward = this.cameraData.values.score;
            }
        }
        const statIncrease = ClientCamera.calculateStatCount(level, this) - ClientCamera.calculateStatCount(previousLevel, this);
        this.cameraData.statsAvailable += statIncrease;
        this.setFieldFactor((0, TankDefinitions_1.getTankById)(this.cameraData.values.tank)?.fieldFactor || 1);
    }
    setFieldFactor(fieldFactor) {
        this.cameraData.FOV = (.55 * fieldFactor) / Math.pow(1.01, (this.cameraData.values.level - 1) / 2);
    }
    tick(tick) {
        if (Entity_1.Entity.exists(this.cameraData.values.player)) {
            const levelToScoreTable = Array(this.maxlevel).fill(0);
            for (let i = 1; i < this.maxlevel; ++i) {
                const player = this.cameraData.values.player;
                if (Entity_1.Entity.exists(player) && player instanceof TankBody_1.default) {
                    if (player.definition.flags.isCelestial) {
                        levelToScoreTable[i] = levelToScoreTable[i - 1] + (90 / 9 * 1.06 ** (i - 1) * Math.min(31, i));
                    }
                    else {
                        levelToScoreTable[i] = levelToScoreTable[i - 1] + (90 / 9 * 1.06 ** (i - 1) * Math.min(31, i));
                    }
                }
            }
            const focus = this.cameraData.values.player;
            if (!(this.cameraData.values.flags & 1) && focus instanceof Object_1.default) {
                this.cameraData.cameraX = focus.rootParent.positionData.values.x;
                this.cameraData.cameraY = focus.rootParent.positionData.values.y;
            }
            if (this.cameraData.values.player instanceof TankBody_1.default) {
                const player = this.cameraData.values.player;
                const score = this.cameraData.values.score;
                let newLevel = this.cameraData.values.level;
                while (newLevel < levelToScoreTable.length && score - (0, Enums_1.levelToScore)(newLevel + 1, this) >= 0)
                    newLevel += 1;
                if (newLevel !== this.cameraData.values.level) {
                    this.setLevel(newLevel);
                    this.cameraData.score = score;
                }
                if (newLevel < levelToScoreTable.length) {
                    const levelScore = (0, Enums_1.levelToScore)(this.cameraData.values.level, this);
                    this.cameraData.levelbarMax = (0, Enums_1.levelToScore)(this.cameraData.values.level + 1, this) - levelScore;
                    this.cameraData.levelbarProgress = score - levelScore;
                }
                this.cameraData.movementSpeed = player.definition.speed * 2.55 * Math.pow(1.07, this.cameraData.values.statLevels.values[0]) / Math.pow(1.015, this.cameraData.values.level - 1);
            }
        }
        else {
            this.cameraData.flags |= 1;
        }
    }
}
exports.CameraEntity = CameraEntity;
class ClientCamera extends CameraEntity {
    constructor(game, client) {
        super(game);
        this.view = [];
        this.relationsData = new FieldGroups_1.RelationsGroup(this);
        this.spectatee = null;
        this.isCelestial = false;
        this.client = client;
        this.cameraData.values.respawnLevel = this.cameraData.values.level = this.cameraData.values.score = 1;
        this.cameraData.values.FOV = .35;
        this.relationsData.values.team = this;
    }
    static calculateStatCount(level, camera) {
        const player = camera.cameraData.values.player;
        let extrapoints = 0;
        if (Entity_1.Entity.exists(player) && player instanceof TankBody_1.default) {
            if (player.definition.flags.isCelestial) {
                extrapoints = 25;
                if (level <= 0)
                    return 0;
                if (level <= 28)
                    return level - 1;
            }
            else {
                if (level <= 0)
                    return 0;
                if (level <= 28)
                    return level - 1;
            }
        }
        return Math.floor(level / 3) + 20 + extrapoints;
    }
    addToView(entity) {
        let c = this.view.find(r => r.id === entity.id);
        if (c) {
            console.log(c.toString(), entity.toString(), c === entity);
        }
        this.view.push(entity);
    }
    removeFromView(id) {
        const index = this.view.findIndex(r => r.id === id);
        if (index === -1)
            return;
        (0, util_1.removeFast)(this.view, index);
    }
    updateView(tick) {
        const w = this.client.write().u8(0).vu(tick);
        const deletes = [];
        const updates = [];
        const creations = [];
        if (this.view.length === 0) {
            creations.push(this.game.arena, this);
            this.view.push(this.game.arena, this);
        }
        const fov = this.cameraData.values.FOV;
        const width = (1920 / fov) / 1.5;
        const height = (1080 / fov) / 1.5;
        const entitiesNearRange = this.game.entities.collisionManager.retrieve(this.cameraData.values.cameraX, this.cameraData.values.cameraY, width, height);
        const entitiesInRange = [];
        const l = this.cameraData.values.cameraX - width;
        const r = this.cameraData.values.cameraX + width;
        const t = this.cameraData.values.cameraY - height;
        const b = this.cameraData.values.cameraY + height;
        for (let i = 0; i < entitiesNearRange.length; ++i) {
            const entity = entitiesNearRange[i];
            const width = entity.physicsData.values.sides === 2 ? entity.physicsData.values.size / 2 : entity.physicsData.values.size;
            const size = entity.physicsData.values.sides === 2 ? entity.physicsData.values.width / 2 : entity.physicsData.values.size;
            if (entity.positionData.values.x - width < r &&
                entity.positionData.values.y + size > t &&
                entity.positionData.values.x + width > l &&
                entity.positionData.values.y - size < b) {
                if (entity !== this.cameraData.values.player && !(entity.styleData.values.opacity === 0 && !entity.deletionAnimation)) {
                    entitiesInRange.push(entity);
                }
            }
        }
        for (let id = 0; id <= this.game.entities.lastId; ++id) {
            const entity = this.game.entities.inner[id];
            if (entity instanceof Object_1.default && !entitiesInRange.includes(entity) && (entity.physicsData.values.flags & 2))
                entitiesInRange.push(entity);
        }
        if (Entity_1.Entity.exists(this.cameraData.values.player) && this.cameraData.values.player instanceof Object_1.default)
            entitiesInRange.push(this.cameraData.values.player);
        for (let i = 0; i < this.view.length; ++i) {
            const entity = this.view[i];
            if (entity instanceof Object_1.default) {
                if (!entitiesInRange.includes(entity.rootParent)) {
                    deletes.push({ id: entity.id, hash: entity.preservedHash });
                    continue;
                }
            }
            if (entity.hash === 0) {
                deletes.push({ id: entity.id, hash: entity.preservedHash });
            }
            else if (entity.entityState & 2) {
                if (entity.entityState & 4)
                    deletes.push({ hash: entity.hash, id: entity.id, noDelete: true });
                creations.push(entity);
            }
            else if (entity.entityState & 1) {
                updates.push(entity);
            }
        }
        w.vu(deletes.length);
        for (let i = 0; i < deletes.length; ++i) {
            w.entid(deletes[i]);
            if (!deletes[i].noDelete)
                this.removeFromView(deletes[i].id);
        }
        const entities = this.game.entities;
        for (const id of this.game.entities.otherEntities) {
            if (this.view.findIndex(r => r.id === id) === -1) {
                const entity = entities.inner[id];
                if (!entity)
                    continue;
                if (entity instanceof CameraEntity)
                    continue;
                creations.push(entity);
                this.addToView(entity);
            }
        }
        for (const entity of entitiesInRange) {
            if (this.view.indexOf(entity) === -1) {
                creations.push(entity);
                this.addToView(entity);
                if (entity instanceof Object_1.default) {
                    if (entity.children.length && !entity.isChild) {
                        this.view.push.apply(this.view, entity.children);
                        creations.push.apply(creations, entity.children);
                    }
                }
            }
            else {
                if (!Entity_1.Entity.exists(entity))
                    throw new Error("wtf");
                if (entity.children.length && !entity.isChild) {
                    for (let child of entity.children) {
                        if (this.view.findIndex(r => r.id === child.id) === -1) {
                            this.view.push.apply(this.view, entity.children);
                            creations.push.apply(creations, entity.children);
                        }
                    }
                }
            }
        }
        w.vu(creations.length + updates.length);
        for (let i = 0; i < updates.length; ++i) {
            this.compileUpdate(w, updates[i]);
        }
        for (let i = 0; i < creations.length; ++i) {
            this.compileCreation(w, creations[i]);
        }
        w.send();
    }
    compileCreation(w, entity) {
        (0, UpcreateCompiler_1.compileCreation)(this, w, entity);
    }
    compileUpdate(w, entity) {
        (0, UpcreateCompiler_1.compileUpdate)(this, w, entity);
    }
    tick(tick) {
        super.tick(tick);
        if (!Entity_1.Entity.exists(this.cameraData.values.player) || !(this.cameraData.values.player instanceof TankBody_1.default)) {
            if (Entity_1.Entity.exists(this.spectatee)) {
                const pos = this.spectatee.rootParent.positionData.values;
                this.cameraData.cameraX = pos.x;
                this.cameraData.cameraY = pos.y;
                this.cameraData.flags |= 1;
            }
        }
        this.updateView(tick);
    }
}
exports.default = ClientCamera;
