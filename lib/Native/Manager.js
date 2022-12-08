"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("../config");
const Object_1 = require("../Entity/Object");
const SpatialHashing_1 = require("../Physics/SpatialHashing");
const QuadTree_1 = require("../Physics/QuadTree");
const Camera_1 = require("./Camera");
const Entity_1 = require("./Entity");
const util_1 = require("../util");
class EntityManager {
    constructor(game) {
        this.zIndex = 0;
        this.cameras = [];
        this.otherEntities = [];
        this.inner = Array(16384);
        this.AIs = [];
        this.hashTable = new Uint8Array(16384);
        this.lastId = -1;
        this.game = game;
        this.collisionManager = config.spatialHashingCellSize ? new SpatialHashing_1.default(config.spatialHashingCellSize) : new QuadTree_1.default(0, 0);
    }
    add(entity) {
        const lastId = this.lastId + 1;
        for (let id = 0; id <= lastId; ++id) {
            if (this.inner[id])
                continue;
            entity.id = id;
            entity.hash = entity.preservedHash = this.hashTable[id] += 1;
            this.inner[id] = entity;
            if (this.collisionManager && entity instanceof Object_1.default) {
            }
            else if (entity instanceof Camera_1.CameraEntity)
                this.cameras.push(id);
            else
                this.otherEntities.push(id);
            if (this.lastId < id)
                this.lastId = entity.id;
            return entity;
        }
        throw new Error("OOEI: Out Of Entity IDs");
    }
    delete(id) {
        const entity = this.inner[id];
        if (!entity)
            throw new RangeError("Deleting entity that isn't in the game?");
        entity.hash = 0;
        if (this.collisionManager && entity instanceof Object_1.default) {
        }
        else if (entity instanceof Camera_1.CameraEntity)
            (0, util_1.removeFast)(this.cameras, this.cameras.indexOf(id));
        else
            (0, util_1.removeFast)(this.otherEntities, this.otherEntities.indexOf(id));
        this.inner[id] = null;
    }
    clear() {
        this.lastId = -1;
        this.collisionManager.reset(0, 0);
        this.hashTable.fill(0);
        this.AIs.length = 0;
        this.otherEntities.length = 0;
        this.cameras.length = 0;
        for (let i = 0; i < this.inner.length; ++i) {
            const entity = this.inner[i];
            if (entity) {
                entity.hash = 0;
                this.inner[i] = null;
            }
        }
    }
    tick(tick) {
        this.collisionManager.reset(this.game.arena.arenaData.values.rightX, this.game.arena.arenaData.values.bottomY);
        while (!this.inner[this.lastId] && this.lastId >= 0) {
            this.lastId -= 1;
        }
        scanner: for (let id = 0; id <= this.lastId; ++id) {
            const entity = this.inner[id];
            if (!Entity_1.Entity.exists(entity))
                continue;
            if (entity instanceof Object_1.default && !entity.isChild) {
                this.collisionManager.insertEntity(entity);
                entity.isViewed = true;
            }
        }
        for (let id = 0; id <= this.lastId; ++id) {
            const entity = this.inner[id];
            if (entity && entity instanceof Object_1.default && entity.isPhysical) {
                entity.applyPhysics();
            }
        }
        for (let id = 0; id <= this.lastId; ++id) {
            const entity = this.inner[id];
            if (!Entity_1.Entity.exists(entity))
                continue;
            if (!(entity instanceof Camera_1.CameraEntity)) {
                if (!(entity instanceof Object_1.default) || !entity.isChild)
                    entity.tick(tick);
            }
        }
        for (let i = this.AIs.length; --i >= 0;) {
            if (!Entity_1.Entity.exists(this.AIs[i].owner)) {
                (0, util_1.removeFast)(this.game.entities.AIs, i);
                continue;
            }
            this.AIs[i].tick(tick);
        }
        for (let i = 0; i < this.cameras.length; ++i) {
            this.inner[this.cameras[i]].tick(tick);
        }
        for (let id = 0; id <= this.lastId; ++id) {
            const entity = this.inner[id];
            if (entity) {
                entity.wipeState();
            }
        }
    }
}
exports.default = EntityManager;
