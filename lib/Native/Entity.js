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
exports.Entity = exports.EntityStateFlags = exports.FieldGroupID = exports.fieldGroupProps = void 0;
/**
 * IDs for the groupings of fields in diep protocol.
 * For more details about these read [entities.md](https://github.com/ABCxFF/diepindepth/blob/main/entities.md).
 */
exports.fieldGroupProps = ["relations", null, "barrel", "physics", "health", null, "unused", "arena", "name", "camera", "position", "style", null, "score", "team"];
/**
 * IDs for the groupings of fields in diep protocol.
 * For more details read [entities.md](https://github.com/ABCxFF/diepindepth/blob/main/entities.md).
 */
var FieldGroupID;
(function (FieldGroupID) {
    FieldGroupID[FieldGroupID["relations"] = 0] = "relations";
    FieldGroupID[FieldGroupID["barrel"] = 2] = "barrel";
    FieldGroupID[FieldGroupID["physics"] = 3] = "physics";
    FieldGroupID[FieldGroupID["health"] = 4] = "health";
    FieldGroupID[FieldGroupID["unused"] = 6] = "unused";
    FieldGroupID[FieldGroupID["arena"] = 7] = "arena";
    FieldGroupID[FieldGroupID["name"] = 8] = "name";
    FieldGroupID[FieldGroupID["camera"] = 9] = "camera";
    FieldGroupID[FieldGroupID["position"] = 10] = "position";
    FieldGroupID[FieldGroupID["style"] = 11] = "style";
    FieldGroupID[FieldGroupID["score"] = 13] = "score";
    FieldGroupID[FieldGroupID["team"] = 14] = "team";
})(FieldGroupID = exports.FieldGroupID || (exports.FieldGroupID = {}));
/**
 * The flags used for Entity.state property. Signals to the
 * manager and the camera what needs to be sent to the client.
 */
var EntityStateFlags;
(function (EntityStateFlags) {
    EntityStateFlags[EntityStateFlags["needsUpdate"] = 1] = "needsUpdate";
    EntityStateFlags[EntityStateFlags["needsCreate"] = 2] = "needsCreate";
    EntityStateFlags[EntityStateFlags["needsDelete"] = 4] = "needsDelete";
})(EntityStateFlags = exports.EntityStateFlags || (exports.EntityStateFlags = {}));
/**
 * The abstract Entity class which is used for all data in the game.
 * All entities can be compiled by a Camera class.
 */
class Entity {
    constructor(game) {
        /**
         * - `0b01`: Has updated
         * - `0b10`: Needs creation (unused)
         */
        this.state = 0;
        /**
         * List of all field groups (by id) that the entity has.
         */
        this.fieldGroups = [];
        /**
         * Relations field group. Contains `owner`, `parent`,
         * and `team` fields.
         */
        this.relations = null;
        /**
         * Barrel field group. Contains `reloadTime` and other
         * barrel related fields.
         */
        this.barrel = null;
        /**
         * Physics field group. Contains `sides`, `size`, and other
         * fields relating to physics.
         */
        this.physics = null;
        /**
         * Health field group. Contains `health`, `maxHealth`, and
         * the `healthbar` fields.
         */
        this.health = null;
        /**
         * Unused field group. Supported by the client but has no affect.
         * Never used by normal servers.
         */
        this.unused = null;
        /**
         * Arena field group. Includes `scoreboardScores`,
         * `ticksUntilStart`, and other arena related fields.
         */
        this.arena = null;
        /**
         * Name field group. Contains `name` and `nametag` fields.
         */
        this.name = null;
        /**
         * Camera/GUI field group. Contains `statLevels`,
         * `tank`, `level`, and other GUI related fields.
         */
        this.camera = null;
        /**
         * Position field group. Contains `x`, `y`, `angle`,
         * and `motion` (flags) fields.
         */
        this.position = null;
        /**
         * Style field group. Contains `color`, `opacity`,
         * and other style related fields.
         */
        this.style = null;
        /**
         * Score field group. Contains `score` and `scorebar` fields.
         */
        this.score = null;
        /**
         * Team field group. Contains `teamColor`, `mothershipX`,
         * and other team arrow related fields.
         */
        this.team = null;
        /** Entity id */
        this.id = -1;
        /** Entity hash (will be 0 once the entity is deleted) */
        this.hash = 0;
        /** Preserved entity hash (is never set to 0) */
        this.preservedHash = 0;
        // You're welcome in advance - makes it so field groups
        // dont mess up in order, if defined incorrectly.
        this.fieldGroups.push = function (...items) {
            if (items.length !== 1)
                throw new RangeError("Unexpected field group modification on " + this.toString());
            this[this.length] = items[0];
            this.sort((a, b) => a - b);
            return this.length;
        };
        this.game = game;
        game.entities.add(this);
    }
    /**
     * Determines if the first parameter is an entity and not a deleted one.
     */
    static exists(entity) {
        return entity instanceof Entity && entity.hash !== 0;
    }
    /** Makes the  entity no longer in need of update. */
    wipeState() {
        if (this.relations)
            this.relations.wipe();
        if (this.barrel)
            this.barrel.wipe();
        if (this.physics)
            this.physics.wipe();
        if (this.health)
            this.health.wipe();
        if (this.unused)
            this.unused.wipe();
        if (this.arena)
            this.arena.wipe();
        if (this.name)
            this.name.wipe();
        if (this.camera)
            this.camera.wipe();
        if (this.position)
            this.position.wipe();
        if (this.style)
            this.style.wipe();
        if (this.score)
            this.score.wipe();
        if (this.team)
            this.team.wipe();
        this.state = 0;
    }
    /** Deletes the entity from the entity manager system. */
    delete() {
        this.wipeState();
        this.game.entities.delete(this.id);
    }
    /** Ticks the entity */
    tick(tick) { }
    toString() {
        return `${this.constructor.name} <${this.id}, ${this.preservedHash}>${this.hash === 0 ? "(deleted)" : ""} [${this.fieldGroups.join(", ")}]`;
    }
    [Symbol.toPrimitive](type) {
        if (type === "string")
            return this.toString();
        return this.preservedHash * 0x10000 + this.id;
    }
}
exports.Entity = Entity;
