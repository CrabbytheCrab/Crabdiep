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
const config = require("../config");
const Object_1 = require("../Entity/Object");
const SpatialHashing_1 = require("../Physics/SpatialHashing");
const QuadTree_1 = require("../Physics/QuadTree");
const Camera_1 = require("./Camera");
const Entity_1 = require("./Entity");
const util_1 = require("../util");
/**
 * Manages all entities in the game.
 */
class EntityManager {
    constructor(game) {
        /** Keeps a count of how many objects existed. */
        this.zIndex = 0;
        /** Array of all camera entities. */
        this.cameras = [];
        /** List of all not ObjectEntitys */
        this.otherEntities = [];
        /** List of all Entitys. */
        this.inner = Array(16384);
        /** List of all AIs. */
        this.AIs = [];
        /** The current hash for each id.  */
        this.hashTable = new Uint8Array(16384);
        /** The last used ID */
        this.lastId = -1;
        this.game = game;
        this.collisionManager = config.spatialHashingCellSize ? new SpatialHashing_1.default(config.spatialHashingCellSize) : new QuadTree_1.default(0, 0);
    }
    /** Adds an entity to the system. */
    add(entity) {
        const lastId = this.lastId + 1;
        // Until it can find a free id, it goes up.
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
        throw new Error("OOEI: Out Of Entity IDs"); // joy
    }
    /** Removes an entity from the system. */
    delete(id) {
        const entity = this.inner[id];
        if (!entity)
            throw new RangeError("Deleting entity that isn't in the game?");
        entity.hash = 0;
        if (this.collisionManager && entity instanceof Object_1.default) {
            // Nothing I guess
        }
        else if (entity instanceof Camera_1.CameraEntity)
            (0, util_1.removeFast)(this.cameras, this.cameras.indexOf(id));
        else
            (0, util_1.removeFast)(this.otherEntities, this.otherEntities.indexOf(id));
        this.inner[id] = null;
    }
    /** Wipes all entities from the game. */
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
    /** Ticks all entities in the game. */
    tick(tick) {
        this.collisionManager.reset(this.game.arena.arena.values.rightX, this.game.arena.arena.values.bottomY);
        while (!this.inner[this.lastId] && this.lastId >= 0) {
            this.lastId -= 1;
        }
        scanner: for (let id = 0; id <= this.lastId; ++id) {
            const entity = this.inner[id];
            if (!Entity_1.Entity.exists(entity))
                continue;
            if (entity instanceof Object_1.default && !entity.isChild) {
                // This loop keeps entities far away from cameras to not be calculated collision for.
                // if (config.usingSpatialHashGrid) {
                //     entity.isViewed = true;
                //     this.collisionManager.insertEntity(entity);
                //     continue;
                // }
                // For quadtree only because its not c++ :(
                // for (let i = 0; i < this.cameras.length; ++i) {
                //     const camera = this.inner[this.cameras[i]] as CameraEntity;// small trick
                //     if ((camera.camera.values.cameraX - entity.position.values.x) ** 2 + (camera.camera.values.cameraY - entity.position.values.y) ** 2 < (4500 + entity.physics.values.size + entity.physics.values.width) ** 2) {
                //         this.collisionManager.insertEntity(entity);
                //         entity.isViewed = true;
                //         continue scanner;
                //     }
                // }
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
