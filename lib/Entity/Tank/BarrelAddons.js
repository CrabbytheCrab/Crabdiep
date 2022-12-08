"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarrelAddonById = exports.EngiTrapLauncherAddon = exports.EngiTrapLauncher2 = exports.EngiTrapLauncher = exports.MinionLauncherAddon = exports.MinionLauncher2 = exports.MinionLauncher = exports.TrapLauncherAddon = exports.TrapLauncher = exports.BarrelAddon = void 0;
const Object_1 = require("../Object");
class BarrelAddon {
    constructor(owner) {
        this.owner = owner;
        this.game = owner.game;
    }
}
exports.BarrelAddon = BarrelAddon;
class TrapLauncher extends Object_1.default {
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = 1 | 4;
        this.styleData.values.color = 1;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width;
        this.physicsData.values.size = barrel.physicsData.values.width * (20 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (20 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.TrapLauncher = TrapLauncher;
class TrapLauncherAddon extends BarrelAddon {
    constructor(owner) {
        super(owner);
        this.launcherEntity = new TrapLauncher(owner);
    }
}
exports.TrapLauncherAddon = TrapLauncherAddon;
class MinionLauncher extends Object_1.default {
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = 4;
        this.styleData.values.color = 1;
        this.styleData.values.flags |= 64;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 1.25;
        this.physicsData.values.size = barrel.physicsData.values.size * (10 / 50);
        this.positionData.values.x = (barrel.physicsData.values.size - this.physicsData.values.size) / 2;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.25;
        this.physicsData.size = this.barrelEntity.physicsData.values.size * (10 / 50);
        this.positionData.x = (this.barrelEntity.physicsData.values.size - this.physicsData.values.size) / 2;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.MinionLauncher = MinionLauncher;
class MinionLauncher2 extends Object_1.default {
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = 4;
        this.styleData.values.color = 1;
        this.styleData.values.flags |= 64;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 1.25;
        this.physicsData.values.size = barrel.physicsData.values.size * (20 / 50);
        this.positionData.values.x = 0;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.25;
        this.physicsData.size = this.barrelEntity.physicsData.values.size * (20 / 50);
        this.positionData.x = 0;
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
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = 1 | 4;
        this.styleData.values.flags |= 64;
        this.styleData.values.color = 1;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width;
        this.physicsData.values.size = barrel.physicsData.values.width * (20 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size - this.physicsData.values.size) / 2;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (20 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size - this.physicsData.values.size) / 2;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.EngiTrapLauncher = EngiTrapLauncher;
class EngiTrapLauncher2 extends Object_1.default {
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.styleData.values.flags |= 64;
        this.physicsData.values.flags = 4;
        this.styleData.values.color = 1;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 1.75;
        this.physicsData.values.size = barrel.physicsData.values.width * (10 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.75;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (10 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2;
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
exports.BarrelAddonById = {
    minionLauncher: MinionLauncherAddon,
    engitrapLauncher: EngiTrapLauncherAddon,
    trapLauncher: TrapLauncherAddon
};
