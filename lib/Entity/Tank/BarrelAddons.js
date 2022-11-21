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
exports.BarrelAddonById = exports.EngiTrapLauncherAddon = exports.EngiTrapLauncher2 = exports.EngiTrapLauncher = exports.MinionLauncherAddon = exports.MinionLauncher2 = exports.MinionLauncher = exports.TrapLauncherAddon = exports.TrapLauncher = exports.BarrelAddon = void 0;
const Enums_1 = require("../../Const/Enums");
const Object_1 = require("../Object");
const Enums_2 = require("../../Const/Enums");
/**
 * Abstract class to represent a barrel's addon in game.
 *
 * For more information on an addon, see Addons.ts - BarrelAddons are the same thing except they are applied on the barrel after it is made.
 *
 * Read [addons.md on diepindepth](https://github.com/ABCxFF/diepindepth/blob/main/extras/addons.md)
 * for more details and examples.
 */
class BarrelAddon {
    constructor(owner) {
        this.owner = owner;
        this.game = owner.game;
    }
}
exports.BarrelAddon = BarrelAddon;
/**
 * Entity attached to the edge of a trapper barrel
 */
class TrapLauncher extends Object_1.default {
    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relations.values.team = barrel;
        this.physics.values.objectFlags = Enums_1.ObjectFlags.isTrapezoid | Enums_1.ObjectFlags.unknown1;
        this.style.values.color = Enums_1.Colors.Barrel;
        this.physics.values.sides = 2;
        this.physics.values.width = barrel.physics.values.width;
        this.physics.values.size = barrel.physics.values.width * (20 / 42);
        this.position.values.x = (barrel.physics.values.size + this.physics.values.size) / 2;
    }
    resize() {
        this.physics.sides = 2;
        this.physics.width = this.barrelEntity.physics.values.width;
        this.physics.size = this.barrelEntity.physics.values.width * (20 / 42);
        this.position.x = (this.barrelEntity.physics.values.size + this.physics.values.size) / 2;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.TrapLauncher = TrapLauncher;
/** Trap launcher - added onto traps */
class TrapLauncherAddon extends BarrelAddon {
    constructor(owner) {
        super(owner);
        this.launcherEntity = new TrapLauncher(owner);
    }
}
exports.TrapLauncherAddon = TrapLauncherAddon;
class MinionLauncher extends Object_1.default {
    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relations.values.team = barrel;
        this.physics.values.objectFlags = Enums_1.ObjectFlags.unknown1;
        this.style.values.color = Enums_1.Colors.Barrel;
        this.style.values.styleFlags |= Enums_2.StyleFlags.aboveParent;
        this.physics.values.sides = 2;
        this.physics.values.width = barrel.physics.values.width * 1.25;
        this.physics.values.size = barrel.physics.values.size * (10 / 50);
        this.position.values.x = (barrel.physics.values.size - this.physics.values.size) / 2;
    }
    resize() {
        this.physics.sides = 2;
        this.physics.width = this.barrelEntity.physics.values.width * 1.25;
        this.physics.size = this.barrelEntity.physics.values.size * (10 / 50);
        this.position.x = (this.barrelEntity.physics.values.size - this.physics.values.size) / 2;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.MinionLauncher = MinionLauncher;
class MinionLauncher2 extends Object_1.default {
    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relations.values.team = barrel;
        this.physics.values.objectFlags = Enums_1.ObjectFlags.unknown1;
        this.style.values.color = Enums_1.Colors.Barrel;
        this.style.values.styleFlags |= Enums_2.StyleFlags.aboveParent;
        this.physics.values.sides = 2;
        this.physics.values.width = barrel.physics.values.width * 1.25;
        this.physics.values.size = barrel.physics.values.size * (20 / 50);
        this.position.values.x = 0;
    }
    resize() {
        this.physics.sides = 2;
        this.physics.width = this.barrelEntity.physics.values.width * 1.25;
        this.physics.size = this.barrelEntity.physics.values.size * (20 / 50);
        this.position.x = 0;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.MinionLauncher2 = MinionLauncher2;
class MinionLauncherAddon extends BarrelAddon {
    constructor(owner) {
        super(owner);
        this.launcherEntity = new MinionLauncher(owner);
        this.launcherEntity = new MinionLauncher2(owner);
    }
}
exports.MinionLauncherAddon = MinionLauncherAddon;
class EngiTrapLauncher extends Object_1.default {
    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relations.values.team = barrel;
        this.physics.values.objectFlags = Enums_1.ObjectFlags.isTrapezoid | Enums_1.ObjectFlags.unknown1;
        this.style.values.styleFlags |= Enums_2.StyleFlags.aboveParent;
        this.style.values.color = Enums_1.Colors.Barrel;
        this.physics.values.sides = 2;
        this.physics.values.width = barrel.physics.values.width;
        this.physics.values.size = barrel.physics.values.width * (20 / 42);
        this.position.values.x = (barrel.physics.values.size - this.physics.values.size) / 2;
    }
    resize() {
        this.physics.sides = 2;
        this.physics.width = this.barrelEntity.physics.values.width;
        this.physics.size = this.barrelEntity.physics.values.width * (20 / 42);
        this.position.x = (this.barrelEntity.physics.values.size - this.physics.values.size) / 2;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.EngiTrapLauncher = EngiTrapLauncher;
class EngiTrapLauncher2 extends Object_1.default {
    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relations.values.team = barrel;
        this.style.values.styleFlags |= Enums_2.StyleFlags.aboveParent;
        this.physics.values.objectFlags = Enums_1.ObjectFlags.unknown1;
        this.style.values.color = Enums_1.Colors.Barrel;
        this.physics.values.sides = 2;
        this.physics.values.width = barrel.physics.values.width * 1.75;
        this.physics.values.size = barrel.physics.values.width * (10 / 42);
        this.position.values.x = (barrel.physics.values.size + this.physics.values.size) / 2;
    }
    resize() {
        this.physics.sides = 2;
        this.physics.width = this.barrelEntity.physics.values.width * 1.75;
        this.physics.size = this.barrelEntity.physics.values.width * (10 / 42);
        this.position.x = (this.barrelEntity.physics.values.size + this.physics.values.size) / 2;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.EngiTrapLauncher2 = EngiTrapLauncher2;
class EngiTrapLauncherAddon extends BarrelAddon {
    constructor(owner) {
        super(owner);
        this.launcherEntity = new EngiTrapLauncher(owner);
        this.launcherEntity = new EngiTrapLauncher2(owner);
    }
}
exports.EngiTrapLauncherAddon = EngiTrapLauncherAddon;
/**
 * All barrel addons in the game by their ID.
 */
exports.BarrelAddonById = {
    trapLauncher: TrapLauncherAddon,
    minionLauncher: MinionLauncherAddon,
    engitrapLauncher: EngiTrapLauncherAddon,
};
