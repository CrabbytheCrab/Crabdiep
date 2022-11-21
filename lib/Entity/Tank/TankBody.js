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
const util = require("../../util");
const Square_1 = require("../Shape/Square");
const NecromancerSquare_1 = require("./Projectile/NecromancerSquare");
const Camera_1 = require("../../Native/Camera");
const Live_1 = require("../Live");
const Barrel_1 = require("./Barrel");
const Enums_1 = require("../../Const/Enums");
const Entity_1 = require("../../Native/Entity");
const FieldGroups_1 = require("../../Native/FieldGroups");
const Addons_1 = require("./Addons");
const TankDefinitions_1 = require("../../Const/TankDefinitions");
const AbstractBoss_1 = require("../Boss/AbstractBoss");
/**
 * The Tank Body, which could also be called the Player class, converts defined
 * tank data into diep entities. Controls speeds, barrels, addons, and names.
 * Created for each spawn.
 */
class TankBody extends Live_1.default {
    constructor(game, camera, inputs) {
        super(game);
        /** Always existant name field group, present on all tanks. */
        this.name = new FieldGroups_1.NameGroup(this);
        /** Always existant score field group, present on all tanks. */
        this.score = new FieldGroups_1.ScoreGroup(this);
        /** The tank's barrels, if any. */
        this.barrels = [];
        /** The tank's addons, if any. */
        this.addons = [];
        /** Size of the tank at level 1. Defined by tank loader.  */
        this.baseSize = 50;
        /** The definition of the currentTank */
        this.definition = (0, TankDefinitions_1.getTankById)(Enums_1.Tank.Basic);
        /** Reload time base, used for barrel's reloads. */
        this.reloadTime = 15;
        /** The current tank definition / tank id. */
        this._currentTank = Enums_1.Tank.Basic;
        /** Whether or not the spawn invulnerability happened already. */
        this.spawnProtectionEnded = false;
        this.cameraEntity = camera;
        this.inputs = inputs;
        this.physics.values.size = 50;
        this.physics.values.sides = 1;
        this.style.values.color = Enums_1.Colors.Tank;
        this.relations.values.team = camera;
        this.relations.values.owner = camera;
        this.cameraEntity.camera.spawnTick = game.tick;
        this.cameraEntity.camera.camera |= Enums_1.CameraFlags.showDeathStats;
        // spawn protection
        this.style.values.styleFlags |= Enums_1.StyleFlags.invincibility;
        if (this.game.playersOnMap)
            this.physics.values.objectFlags |= Enums_1.ObjectFlags.minimap;
        this.damagePerTick = 20;
        this.setTank(Enums_1.Tank.Basic);
    }
    /** The active change in size from the base size to the current. Contributes to barrel and addon sizes. */
    get sizeFactor() {
        return this.physics.values.size / this.baseSize;
    }
    /** The current tank type / tank id. */
    get currentTank() {
        return this._currentTank;
    }
    /** This method allows for changing the current tank. */
    setTank(id) {
        // Delete old barrels and addons
        for (let i = 0; i < this.children.length; ++i) {
            this.children[i].isChild = false;
            this.children[i].delete();
        }
        this.children = [];
        this.barrels = [];
        this.addons = [];
        // Get the new tank data
        const tank = (0, TankDefinitions_1.getTankById)(id);
        const camera = this.cameraEntity;
        if (!tank)
            throw new TypeError("Invalid tank ID");
        this.definition = tank;
        if (!Entity_1.Entity.exists(camera))
            throw new Error("No camera");
        this.physics.sides = tank.sides;
        this.style.opacity = 1;
        for (let i = 0; i < Enums_1.StatCount; ++i) {
            const { name, max } = tank.stats[i];
            camera.camera.statLimits[i] = max;
            camera.camera.statNames[i] = name;
            if (camera.camera.statLevels[i] > max) {
                camera.camera.statsAvailable += (camera.camera.statLevels[i] - (camera.camera.statLevels[i] = max));
            }
        }
        // Size ratios
        this.baseSize = tank.sides === 4 ? Math.SQRT2 * 32.5 : tank.sides === 16 ? Math.SQRT2 * 25 : 50;
        this.physics.absorbtionFactor = tank.absorbtionFactor;
        if (tank.absorbtionFactor === 0)
            this.position.motion |= Enums_1.MotionFlags.canMoveThroughWalls;
        else if (this.position.motion & Enums_1.MotionFlags.canMoveThroughWalls)
            this.position.motion ^= Enums_1.MotionFlags.canMoveThroughWalls;
        camera.camera.tank = this._currentTank = id;
        if (tank.upgradeMessage && camera instanceof Camera_1.default)
            camera.client.notify(tank.upgradeMessage);
        // Build addons, then tanks, then addons.
        const preAddon = tank.preAddon;
        if (preAddon) {
            const AddonConstructor = Addons_1.AddonById[preAddon];
            if (AddonConstructor)
                this.addons.push(new AddonConstructor(this));
        }
        for (const barrel of tank.barrels) {
            this.barrels.push(new Barrel_1.default(this, barrel));
        }
        const postAddon = tank.postAddon;
        if (postAddon) {
            const AddonConstructor = Addons_1.AddonById[postAddon];
            if (AddonConstructor)
                this.addons.push(new AddonConstructor(this));
        }
        // Yeah, yeah why not
        this.cameraEntity.camera.tankOverride = tank.name;
        camera.setFieldFactor(tank.fieldFactor);
    }
    /** See LivingEntity.onKill */
    onKill(entity) {
        this.score.score = this.cameraEntity.camera.scorebar += entity.scoreReward;
        if (entity instanceof TankBody && entity.scoreReward && Math.max(this.cameraEntity.camera.values.level, 45) - entity.cameraEntity.camera.values.level <= 20 || entity instanceof AbstractBoss_1.default) {
            if (this.cameraEntity instanceof Camera_1.default)
                this.cameraEntity.client.notify("You've killed " + (entity.name.values.name || "an unnamed tank"));
        }
        // TODO(ABC):
        // This is actually not how necromancers claim squares.
        // if (entity instanceof AbstractShape && this._currentTank === Tank.Necromancer && this.barrels[0].droneCount < (22 + this.cameraEntity.camera.values.statLevels.values[Stat.Reload] * 2)) {
        /** @ts-ignore */
        // ALL_ENTITIES is an easter egg... gives backdoorer ability to enable claiming of all necro squares
        if ((process['ALL_ENTITIES'] || entity instanceof Square_1.default)) {
            if (this._currentTank === Enums_1.Tank.Caster && this.barrels.length && this.barrels[0].droneCount < (15 + this.cameraEntity.camera.values.statLevels.values[Enums_1.Stat.Reload] * 1.5)) {
                // No destroy it on the next tick to make it look more like the way diep does it.
                entity.destroy(true);
                if (entity.deletionAnimation) {
                    entity.deletionAnimation.frame = 0;
                    entity.style.opacity = 1;
                }
                /**@ts-ignore */
                const sunchip = new NecromancerSquare_1.default(this.barrels[0] /* :P */, this, this.definition, entity.position.values.angle, entity);
                sunchip.position.values.x = entity.position.values.x;
                sunchip.position.values.y = entity.position.values.y;
                sunchip.physics.values.size = entity.physics.values.size;
            }
            if (this._currentTank === Enums_1.Tank.Maleficitor && this.barrels.length && this.barrels[0].droneCount < (15 + this.cameraEntity.camera.values.statLevels.values[Enums_1.Stat.Reload] * 1.75)) {
                // No destroy it on the next tick to make it look more like the way diep does it.
                entity.destroy(true);
                if (entity.deletionAnimation) {
                    entity.deletionAnimation.frame = 0;
                    entity.style.opacity = 1;
                }
                /**@ts-ignore */
                const sunchip = new NecromancerSquare_1.default(this.barrels[0] /* :P */, this, this.definition, entity.position.values.angle, entity);
                sunchip.position.values.x = entity.position.values.x;
                sunchip.position.values.y = entity.position.values.y;
                sunchip.physics.values.size = entity.physics.values.size;
            }
            if (this._currentTank === Enums_1.Tank.Necromancer && this.barrels.length && this.barrels[0].droneCount < (22 + this.cameraEntity.camera.values.statLevels.values[Enums_1.Stat.Reload] * 2)) {
                // No destroy it on the next tick to make it look more like the way diep does it.
                entity.destroy(true);
                if (entity.deletionAnimation) {
                    entity.deletionAnimation.frame = 0;
                    entity.style.opacity = 1;
                }
                /**@ts-ignore */
                const sunchip = new NecromancerSquare_1.default(this.barrels[0] /* :P */, this, this.definition, entity.position.values.angle, entity);
                sunchip.position.values.x = entity.position.values.x;
                sunchip.position.values.y = entity.position.values.y;
                sunchip.physics.values.size = entity.physics.values.size;
            }
        }
    }
    /** See LivingEntity.onDeath */
    onDeath(killer) {
        if (!(this.cameraEntity instanceof Camera_1.default))
            return this.cameraEntity.delete();
        this.cameraEntity.spectatee = killer;
        this.cameraEntity.camera.FOV = 0.4;
        this.cameraEntity.camera.killedBy = (killer.name && killer.name.values.name) || "";
    }
    /** Destroys the tank body. Extends LivivingEntity.destroy(animate); */
    destroy(animate = true) {
        // Stats etc
        if (!animate && Entity_1.Entity.exists(this.cameraEntity)) {
            this.cameraEntity.camera.deathTick = this.game.tick;
            this.cameraEntity.camera.respawnLevel = Math.min(Math.max(this.cameraEntity.camera.values.level - 1, 1), Math.floor(Math.sqrt(this.cameraEntity.camera.values.level) * 3.2796));
            // Wipe this nonsense
            this.barrels = [];
            this.addons = [];
        }
        super.destroy(animate);
    }
    tick(tick) {
        this.position.angle = Math.atan2(this.inputs.mouse.y - this.position.values.y, this.inputs.mouse.x - this.position.values.x);
        if (!this.deletionAnimation && !this.inputs.deleted)
            this.physics.size = this.baseSize * this.cameraEntity.sizeFactor;
        else
            this.regenPerTick = 0;
        super.tick(tick);
        // If we're currently in a deletion animation
        if (this.deletionAnimation)
            return;
        if (this.inputs.deleted) {
            if (this.cameraEntity.camera.values.level <= 5)
                return this.destroy();
            this.lastDamageTick = tick;
            this.health.health -= 2 + this.health.values.maxHealth / 500;
            if (this.style.values.styleFlags & Enums_1.StyleFlags.invincibility)
                this.style.styleFlags ^= Enums_1.StyleFlags.invincibility;
            return;
            // return this.destroy();
        }
        if (this.definition.flags.zoomAbility && (this.inputs.flags & Enums_1.InputFlags.rightclick)) {
            if (!(this.cameraEntity.camera.values.camera & Enums_1.CameraFlags.useCameraCoords)) {
                const angle = Math.atan2(this.inputs.mouse.y - this.position.values.y, this.inputs.mouse.x - this.position.values.x);
                this.cameraEntity.camera.cameraX = Math.cos(angle) * 1000 + this.position.values.x;
                this.cameraEntity.camera.cameraY = Math.sin(angle) * 1000 + this.position.values.y;
                this.cameraEntity.camera.camera |= Enums_1.CameraFlags.useCameraCoords;
            }
        }
        else if (this.cameraEntity.camera.values.camera & Enums_1.CameraFlags.useCameraCoords)
            this.cameraEntity.camera.camera ^= Enums_1.CameraFlags.useCameraCoords;
        if (this.definition.flags.invisibility) {
            if (this.inputs.flags & Enums_1.InputFlags.leftclick)
                this.style.opacity += this.definition.visibilityRateShooting;
            if (this.inputs.flags & (Enums_1.InputFlags.up | Enums_1.InputFlags.down | Enums_1.InputFlags.left | Enums_1.InputFlags.right) || this.inputs.movement.x || this.inputs.movement.y)
                this.style.opacity += this.definition.visibilityRateMoving;
            this.style.opacity -= this.definition.invisibilityRate;
            this.style.opacity = util.constrain(this.style.values.opacity, 0, 1);
        }
        // Update stat related
        updateStats: {
            // Damage
            this.damagePerTick = this.cameraEntity.camera.statLevels[Enums_1.Stat.BodyDamage] * 6 + 20;
            if (this._currentTank === Enums_1.Tank.Spike)
                this.damagePerTick *= 1.5;
            if (this._currentTank === Enums_1.Tank.autosmasher)
                this.damagePerTick *= 1.1;
            // Max Health
            const maxHealthCache = this.health.values.maxHealth;
            this.health.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.camera.values.level - 1) + this.cameraEntity.camera.values.statLevels.values[Enums_1.Stat.MaxHealth] * 20;
            if (this.health.values.health === maxHealthCache)
                this.health.health = this.health.maxHealth; // just in case
            else if (this.health.values.maxHealth !== maxHealthCache) {
                this.health.health *= this.health.values.maxHealth / maxHealthCache;
            }
            // Regen
            this.regenPerTick = (this.health.values.maxHealth * 4 * this.cameraEntity.camera.values.statLevels.values[Enums_1.Stat.HealthRegen] + this.health.values.maxHealth) / 25000;
            // Reload
            this.reloadTime = 15 * Math.pow(0.914, this.cameraEntity.camera.values.statLevels.values[Enums_1.Stat.Reload]);
        }
        this.score.score = this.cameraEntity.camera.values.scorebar;
        if (!this.spawnProtectionEnded && (this.style.values.styleFlags & Enums_1.StyleFlags.invincibility) && (this.game.tick >= this.cameraEntity.camera.values.spawnTick + 374 || this.inputs.attemptingShot() || this.inputs.movement.magnitude > 0)) {
            this.style.styleFlags ^= Enums_1.StyleFlags.invincibility;
            this.spawnProtectionEnded = true;
        }
        this.accel.add({
            x: this.inputs.movement.x * this.cameraEntity.camera.values.movementSpeed,
            y: this.inputs.movement.y * this.cameraEntity.camera.values.movementSpeed
        });
        this.inputs.movement.set({
            x: 0,
            y: 0
        });
    }
}
exports.default = TankBody;
