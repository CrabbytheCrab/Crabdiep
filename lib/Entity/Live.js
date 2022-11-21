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
const util = require("../util");
const Object_1 = require("./Object");
const TankBody_1 = require("./Tank/TankBody");
const TankDefinitions_1 = require("../Const/TankDefinitions");
const Enums_1 = require("../Const/Enums");
const FieldGroups_1 = require("../Native/FieldGroups");
/**
 * An Abstract class for all entities with health.
 */
class LivingEntity extends Object_1.default {
    constructor() {
        super(...arguments);
        /** Always existant health field group, present on all entities with a healthbar. */
        this.health = new FieldGroups_1.HealthGroup(this);
        /** The points a player is awarded when it kills this entity. */
        this.scoreReward = 0;
        /** Amount of health gained per tick. */
        this.regenPerTick = 0;
        /** The damage this entity can emit onto another per tick. */
        this.damagePerTick = 8;
        /** Entities who have went through damage cycles with this entity in the past tick. No repeats. */
        this.damagedEntities = [];
        /** Last tick that damage was received. */
        this.lastDamageTick = -1;
        /** Last tick that damage style flag was changed. */
        this.lastDamageAnimationTick = -1;
        /** Damage reduction (mathematical health increase). */
        this.damageReduction = 1;
    }
    /** Extends ObjectEntity.destroy() - diminishes health as well. */
    destroy(animate = true) {
        if (this.hash === 0)
            return; // already deleted;
        if (animate)
            this.health.health = 0;
        super.destroy(animate);
    }
    /** Applies damage to two entity after colliding with eachother. */
    static applyDamage(entity1, entity2) {
        if (entity1.health.values.health <= 0 || entity2.health.values.health <= 0)
            return;
        if (entity1.damagedEntities.includes(entity2) || entity2.damagedEntities.includes(entity1))
            return;
        if ((entity1.style.values.styleFlags & Enums_1.StyleFlags.invincibility) && (entity2.style.values.styleFlags & Enums_1.StyleFlags.invincibility))
            return;
        if (entity1.damagePerTick == 0 && entity1.physics.values.pushFactor == 0 || entity2.damagePerTick == 0 && entity2.physics.values.pushFactor == 0)
            return;
        const game = entity1.game;
        // entity2.lastDamageTick = entity1.lastDamageTick = entity1.game.tick;
        let dF1 = entity1.damagePerTick * entity2.damageReduction;
        let dF2 = entity2.damagePerTick * entity1.damageReduction;
        if (entity1 instanceof TankBody_1.default && entity2 instanceof TankBody_1.default) {
            dF1 *= 1.5;
            dF2 *= 1.5;
        }
        // Damage can't be more than enough to kill health
        const ratio = Math.max(1 - entity1.health.values.health / dF2, 1 - entity2.health.values.health / dF1);
        if (ratio > 0) { // Or >=, but minor optimizations
            dF1 *= 1 - ratio;
            dF2 *= 1 - ratio;
        }
        if (entity1.style.values.styleFlags & Enums_1.StyleFlags.invincibility)
            dF2 = 0;
        if (entity2.style.values.styleFlags & Enums_1.StyleFlags.invincibility)
            dF1 = 0;
        // Plays the animation damage for entity 2
        if (entity2.lastDamageAnimationTick !== game.tick && !(entity2.style.values.styleFlags & Enums_1.StyleFlags.noDmgIndicator)) {
            entity2.style.styleFlags ^= Enums_1.StyleFlags.damage;
            entity2.lastDamageAnimationTick = game.tick;
        }
        if (dF1 !== 0) {
            if (entity2.lastDamageTick !== game.tick && entity2 instanceof TankBody_1.default && entity2.definition.flags.invisibility && entity2.style.values.opacity < TankDefinitions_1.visibilityRateDamage)
                entity2.style.opacity += TankDefinitions_1.visibilityRateDamage;
            entity2.lastDamageTick = game.tick;
            entity2.health.health -= dF1;
        }
        // Plays the animation damage for entity 1
        if (entity1.lastDamageAnimationTick !== game.tick && !(entity1.style.values.styleFlags & Enums_1.StyleFlags.noDmgIndicator)) {
            entity1.style.styleFlags ^= Enums_1.StyleFlags.damage;
            entity1.lastDamageAnimationTick = game.tick;
        }
        if (dF2 !== 0) {
            if (entity1.lastDamageTick !== game.tick && entity1 instanceof TankBody_1.default && entity1.definition.flags.invisibility && entity1.style.values.opacity < TankDefinitions_1.visibilityRateDamage)
                entity1.style.opacity += TankDefinitions_1.visibilityRateDamage;
            entity1.lastDamageTick = game.tick;
            entity1.health.health -= dF2;
        }
        entity1.damagedEntities.push(entity2);
        entity2.damagedEntities.push(entity1);
        if (entity1.health.values.health < -0.0001) {
            util.warn("Health is below 0. Something in damage messed up]: ", entity1.health.health, entity2.health.health, ratio, dF1, dF2);
        }
        if (entity2.health.values.health < -0.0001) {
            util.warn("Health is below 0. Something in damage messed up]: ", entity1.health.health, entity2.health.health, ratio, dF1, dF2);
        }
        if (entity1.health.values.health < 0.0001)
            entity1.health.health = 0;
        if (entity2.health.values.health < 0.0001)
            entity2.health.health = 0;
        if (entity1.health.values.health === 0) {
            let killer = entity2;
            while (killer.relations.values.owner instanceof Object_1.default && killer.relations.values.owner.hash !== 0)
                killer = killer.relations.values.owner;
            if (killer instanceof LivingEntity)
                entity1.onDeath(killer);
            entity2.onKill(entity1);
        }
        if (entity2.health.values.health === 0) {
            let killer = entity1;
            while (killer.relations.values.owner instanceof Object_1.default && killer.relations.values.owner.hash !== 0)
                killer = killer.relations.values.owner;
            if (killer instanceof LivingEntity)
                entity2.onDeath(killer);
            entity1.onKill(entity2);
        }
    }
    /** Called when the entity kills another via collision. */
    onKill(entity) { }
    /** Called when the entity is killed via collision */
    onDeath(killer) { }
    /** Runs at the end of each tick. Will apply the damage then. */
    applyPhysics() {
        super.applyPhysics();
        if (this.health.values.health <= 0) {
            this.destroy(true);
            this.damagedEntities = [];
            return;
        }
        // Regeneration
        if (this.health.values.health < this.health.values.maxHealth) {
            this.health.health += this.regenPerTick;
            // Regen boost after 30s
            if (this.game.tick - this.lastDamageTick >= 750) {
                this.health.health += this.health.values.maxHealth / 250;
            }
        }
        if (this.health.values.health > this.health.values.maxHealth) {
            this.health.health = this.health.values.maxHealth;
        }
        this.damagedEntities = [];
    }
    tick(tick) {
        super.tick(tick);
        // It's cached
        const collidedEntities = this.findCollisions();
        for (let i = 0; i < collidedEntities.length; ++i) {
            if (!(collidedEntities[i] instanceof LivingEntity))
                continue;
            if (collidedEntities[i].relations.values.team !== this.relations.values.team) {
                LivingEntity.applyDamage(collidedEntities[i], this);
            }
        }
    }
}
exports.default = LivingEntity;
