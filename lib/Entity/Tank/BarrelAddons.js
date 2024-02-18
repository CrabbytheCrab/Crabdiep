"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarrelAddonById = exports.Extended = exports.NoScaleTrapLauncherAddon = exports.NoScaleTrapLauncher = exports.StrikerAddon = exports.ReverseTrapLauncher = exports.StrikerLauncher = exports.MineLauncherAddon2 = exports.MineLauncher2 = exports.StickyLauncherAddon = exports.StickyLauncher2 = exports.StickyLauncher = exports.MineLauncherAddon = exports.MineLauncher = exports.MachineEngiTrapLauncherAddon = exports.MachineEngiTrapLauncher2 = exports.MachineEngiTrapLauncher = exports.SwarmLauncherAddon = exports.SwarmLauncher2 = exports.SwarmLauncher = exports.EngiTrapLauncherAddon = exports.EngiTrapLauncher2 = exports.EngiTrapLauncher = exports.NecMinionLauncherAddon = exports.NecMinionLauncher2 = exports.NecMinionLauncher = exports.MinionLauncherAddon = exports.MinionLauncher2 = exports.MinionLauncher = exports.MachineTrapLauncherAddon = exports.MachineTrapLauncher = exports.BuilderLauncherAddon = exports.BounceLauncher = exports.BounceLauncherAddon = exports.GrowLauncher = exports.GrowLauncherAddon = exports.AutoLauncher = exports.AutoLauncherAddon = exports.TrapLauncher = exports.TrapLauncherAddon = exports.BuilderLauncher = exports.BarrelAddon = void 0;
const Object_1 = require("../Object");
class BarrelAddon {
    constructor(owner) {
        this.owner = owner;
        this.game = owner.game;
    }
}
exports.BarrelAddon = BarrelAddon;
class BuilderLauncher extends Object_1.default {
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = 1 | 4;
        this.styleData.color = this.barrelEntity.styleData.color;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width / 1.75 * 1.27273;
        this.physicsData.values.size = barrel.physicsData.values.width * (15 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2.75;
    }
    resize() {
        this.styleData.color = this.barrelEntity.styleData.color;
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width / 1.75 * 1.27273;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (20 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2.75;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.BuilderLauncher = BuilderLauncher;
class TrapLauncherAddon extends BarrelAddon {
    constructor(owner) {
        super(owner);
        this.launcherEntity = new TrapLauncher(owner);
    }
}
exports.TrapLauncherAddon = TrapLauncherAddon;
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
class AutoLauncherAddon extends BarrelAddon {
    constructor(owner) {
        super(owner);
        this.launcherEntity = new AutoLauncher(owner);
    }
}
exports.AutoLauncherAddon = AutoLauncherAddon;
class AutoLauncher extends Object_1.default {
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = 4;
        this.styleData.values.color = 1;
        this.physicsData.values.sides = 1;
        this.physicsData.values.width = barrel.physicsData.values.width * (20 / 50);
        this.physicsData.values.size = barrel.physicsData.values.width * (20 / 50);
        this.positionData.values.x = barrel.barrelData.trapezoidDirection == Math.PI ?
            (-barrel.physicsData.values.size + this.physicsData.values.size) / 1.5 :
            (barrel.physicsData.values.size - this.physicsData.values.size) / 1.5;
        this.bar = new Object_1.default(this.game);
        this.bar.setParent(this);
        this.bar.relationsData.values.team = barrel;
        this.bar.physicsData.values.flags = 4;
        this.bar.styleData.values.color = 1;
        this.bar.physicsData.values.sides = 2;
        this.bar.physicsData.values.width = this.physicsData.values.size / 25 * 42 * 0.7;
        this.bar.physicsData.values.size = this.physicsData.values.size / 25 * 55;
        this.bar.positionData.x = Math.cos(this.positionData.angle) * (this.bar.physicsData.size / 2 + 0) - Math.sin(this.positionData.angle) * 0;
        this.bar.positionData.y = Math.sin(this.positionData.angle) * (this.bar.physicsData.size / 2 + 0) - Math.cos(this.positionData.angle) * 0;
    }
    resize() {
        this.physicsData.sides = 1;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * (20 / 50);
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (20 / 50);
        this.positionData.x = this.barrelEntity.barrelData.trapezoidDirection == Math.PI ?
            (-this.barrelEntity.physicsData.size + this.physicsData.size) / 1.5 :
            (this.barrelEntity.physicsData.size - this.physicsData.size) / 1.5;
        this.bar.physicsData.sides = 2;
        this.bar.positionData.angle = this.positionData.angle + Math.PI;
        this.bar.physicsData.width = this.physicsData.size / 25 * 42 * 0.75;
        this.bar.physicsData.size = this.physicsData.size / 25 * 55;
        this.bar.positionData.x = this.barrelEntity.barrelData.trapezoidDirection == Math.PI ?
            Math.cos(this.positionData.angle + Math.PI) * (this.bar.physicsData.size / 2 + 0) - Math.sin(this.positionData.angle + Math.PI) * 0 :
            Math.cos(this.positionData.angle) * (this.bar.physicsData.size / 2 + 0) - Math.sin(this.positionData.angle) * 0;
        this.bar.positionData.y = Math.sin(this.positionData.angle) * (this.bar.physicsData.size / 2 + 0) - Math.cos(this.positionData.angle) * 0;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.AutoLauncher = AutoLauncher;
class GrowLauncherAddon extends BarrelAddon {
    constructor(owner) {
        super(owner);
        this.launcherEntity = new GrowLauncher(owner);
    }
}
exports.GrowLauncherAddon = GrowLauncherAddon;
class GrowLauncher extends Object_1.default {
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.styleData.values.color = 1;
        this.styleData.values.flags |= 64;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 1.2;
        this.physicsData.values.size = barrel.physicsData.values.width * (27 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size / 1.25 - this.physicsData.values.size) / 2;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.2;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (27 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size / 1.25 - this.physicsData.values.size) / 2;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.GrowLauncher = GrowLauncher;
class BounceLauncherAddon extends BarrelAddon {
    constructor(owner) {
        super(owner);
        this.launcherEntity = new BounceLauncher(owner);
    }
}
exports.BounceLauncherAddon = BounceLauncherAddon;
class BounceLauncher extends Object_1.default {
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = 4;
        this.styleData.values.color = 1;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 1.5;
        this.physicsData.values.size = barrel.physicsData.values.width * (20 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.5;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (20 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.BounceLauncher = BounceLauncher;
class BuilderLauncherAddon extends BarrelAddon {
    constructor(owner) {
        super(owner);
        this.launcherEntity = new BuilderLauncher(owner);
    }
}
exports.BuilderLauncherAddon = BuilderLauncherAddon;
class MachineTrapLauncher extends Object_1.default {
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = 1 | 4;
        this.styleData.values.color = 1;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 1.75;
        this.physicsData.values.size = barrel.physicsData.values.width * (25 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.75;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (25 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.MachineTrapLauncher = MachineTrapLauncher;
class MachineTrapLauncherAddon extends BarrelAddon {
    constructor(owner) {
        super(owner);
        this.launcherEntity = new MachineTrapLauncher(owner);
    }
}
exports.MachineTrapLauncherAddon = MachineTrapLauncherAddon;
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
        this.physicsData.values.width = barrel.physicsData.values.width * 1.35;
        this.physicsData.values.size = barrel.physicsData.values.size * (12.5 / 50);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.35;
        this.physicsData.size = this.barrelEntity.physicsData.values.size * (12.5 / 50);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2;
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
        this.physicsData.values.width = barrel.physicsData.values.width * 1.35;
        this.physicsData.values.size = barrel.physicsData.values.size * (42.5 / 50);
        this.positionData.values.x = (-barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.35;
        this.physicsData.size = this.barrelEntity.physicsData.values.size * (42.5 / 50);
        this.positionData.x = (-this.barrelEntity.physicsData.size + this.physicsData.size) / 2;
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
class NecMinionLauncher extends Object_1.default {
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = 4;
        this.styleData.values.color = 1;
        this.styleData.values.flags |= 64;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 2;
        this.physicsData.values.size = barrel.physicsData.values.size * (12.5 / 50);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 2;
        this.physicsData.size = this.barrelEntity.physicsData.values.size * (12.5 / 50);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.NecMinionLauncher = NecMinionLauncher;
class NecMinionLauncher2 extends Object_1.default {
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = 4;
        this.styleData.values.color = 1;
        this.styleData.values.flags |= 64;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 2;
        this.physicsData.values.size = barrel.physicsData.values.size * (42.5 / 50);
        this.positionData.values.x = (-barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 2;
        this.physicsData.size = this.barrelEntity.physicsData.values.size * (42.5 / 50);
        this.positionData.x = (-this.barrelEntity.physicsData.size + this.physicsData.size) / 2;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.NecMinionLauncher2 = NecMinionLauncher2;
class NecMinionLauncherAddon extends BarrelAddon {
    constructor(owner) {
        super(owner);
        this.launcherEntity = new NecMinionLauncher(owner);
        this.launcherEntity = new NecMinionLauncher2(owner);
    }
}
exports.NecMinionLauncherAddon = NecMinionLauncherAddon;
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
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2;
        this.object2 = new Object_1.default(barrel.game);
        this.object2.setParent(this);
        this.object2.relationsData.values.team = barrel;
        this.object2.styleData.values.flags |= 64;
        this.object2.physicsData.values.flags = 4;
        this.object2.styleData.values.color = 1;
        this.object2.physicsData.values.sides = 2;
        this.object2.physicsData.values.width = barrel.physicsData.values.width * 1.75;
        this.object2.physicsData.values.size = barrel.physicsData.values.width * (10 / 42);
        this.object2.positionData.values.x = (this.physicsData.values.size + this.object2.physicsData.values.size) / 2;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (20 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2;
        this.object2.physicsData.sides = 2;
        this.object2.physicsData.width = this.barrelEntity.physicsData.values.width * 1.75;
        this.object2.physicsData.size = this.barrelEntity.physicsData.values.width * (10 / 42);
        this.object2.positionData.x = (this.physicsData.values.size + this.object2.physicsData.values.size) / 2;
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
    }
}
exports.EngiTrapLauncherAddon = EngiTrapLauncherAddon;
class SwarmLauncher extends Object_1.default {
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = 4;
        this.styleData.values.color = 1;
        this.styleData.values.flags |= 64;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 1.5;
        this.physicsData.values.size = barrel.physicsData.values.size * (10 / 50);
        this.positionData.values.x = 0;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.5;
        this.physicsData.size = this.barrelEntity.physicsData.values.size * (10 / 50);
        this.positionData.x = (this.barrelEntity.physicsData.values.size - this.physicsData.values.size) / 2 * -1;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.SwarmLauncher = SwarmLauncher;
class SwarmLauncher2 extends Object_1.default {
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = 4 | 1;
        this.styleData.values.color = 1;
        this.styleData.values.flags |= 64;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 1.75;
        this.physicsData.values.size = 105 * (30 / 50);
        this.positionData.x = (this.barrelEntity.physicsData.values.size - this.physicsData.values.size) / 2;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.75;
        this.physicsData.size = this.barrelEntity.tank.sizeFactor * 105 * (30 / 50);
        this.positionData.x = (this.barrelEntity.physicsData.values.size - this.physicsData.values.size) / 2;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.SwarmLauncher2 = SwarmLauncher2;
class SwarmLauncherAddon extends BarrelAddon {
    constructor(owner) {
        super(owner);
        this.launcherEntity = new SwarmLauncher(owner);
        this.launcherEntity = new SwarmLauncher2(owner);
    }
}
exports.SwarmLauncherAddon = SwarmLauncherAddon;
class MachineEngiTrapLauncher extends Object_1.default {
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = 1 | 4;
        this.styleData.values.flags |= 64;
        this.styleData.values.color = 1;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 1.75;
        this.physicsData.values.size = barrel.physicsData.values.width * (28 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.75;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (28 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.MachineEngiTrapLauncher = MachineEngiTrapLauncher;
class MachineEngiTrapLauncher2 extends Object_1.default {
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.styleData.values.flags |= 64;
        this.physicsData.values.flags = 4;
        this.styleData.values.color = 1;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 3.0625;
        this.physicsData.values.size = barrel.physicsData.values.width * (13 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) - (10 * (28 / 42));
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 3.0625;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (13 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) - (10 * (28 / 42));
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.MachineEngiTrapLauncher2 = MachineEngiTrapLauncher2;
class MachineEngiTrapLauncherAddon extends BarrelAddon {
    constructor(owner) {
        super(owner);
        this.launcherEntity = new MachineEngiTrapLauncher(owner);
        this.launcherEntity = new MachineEngiTrapLauncher2(owner);
    }
}
exports.MachineEngiTrapLauncherAddon = MachineEngiTrapLauncherAddon;
class MineLauncher extends Object_1.default {
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = 4;
        this.styleData.values.color = 1;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 1.75;
        this.physicsData.values.size = barrel.physicsData.values.width * (20 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.75;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (20 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.MineLauncher = MineLauncher;
class MineLauncherAddon extends BarrelAddon {
    constructor(owner) {
        super(owner);
        this.launcherEntity = new MineLauncher(owner);
    }
}
exports.MineLauncherAddon = MineLauncherAddon;
class StickyLauncher extends Object_1.default {
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = 4;
        this.styleData.values.color = 1;
        this.styleData.values.flags |= 64;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 1.5;
        this.physicsData.values.size = barrel.physicsData.values.width * (20 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.5;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (20 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.StickyLauncher = StickyLauncher;
class StickyLauncher2 extends Object_1.default {
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
        this.physicsData.values.size = barrel.physicsData.values.width * (20 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size - this.physicsData.values.size) / 2;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.25;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (20 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size - this.physicsData.values.size) / 2;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.StickyLauncher2 = StickyLauncher2;
class StickyLauncherAddon extends BarrelAddon {
    constructor(owner) {
        super(owner);
        this.launcherEntity = new StickyLauncher(owner);
        this.launcherEntity = new StickyLauncher2(owner);
    }
}
exports.StickyLauncherAddon = StickyLauncherAddon;
class MineLauncher2 extends Object_1.default {
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = 4;
        this.styleData.values.color = 1;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 2.625;
        this.physicsData.values.size = barrel.physicsData.values.width * (20 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 2.625;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (20 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.MineLauncher2 = MineLauncher2;
class MineLauncherAddon2 extends BarrelAddon {
    constructor(owner) {
        super(owner);
        this.launcherEntity = new MineLauncher2(owner);
    }
}
exports.MineLauncherAddon2 = MineLauncherAddon2;
class StrikerLauncher extends Object_1.default {
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = 1 | 4;
        this.styleData.values.color = 1;
        this.styleData.values.flags |= 64;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 0.45;
        this.physicsData.values.size = barrel.physicsData.values.size * (40 / 50);
        this.positionData.values.x = 0;
        this.positionData.values.angle = Math.PI;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 0.45;
        this.physicsData.size = this.barrelEntity.physicsData.values.size * (40 / 50);
        this.positionData.x = 0;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.StrikerLauncher = StrikerLauncher;
class ReverseTrapLauncher extends Object_1.default {
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = 1 | 4;
        this.styleData.color = this.barrelEntity.styleData.color;
        this.positionData.values.angle = Math.PI;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width;
        this.physicsData.values.size = barrel.physicsData.values.width * (20 / 42);
        this.positionData.values.x = (-barrel.physicsData.values.size - this.physicsData.values.size) / 2;
    }
    resize() {
        this.styleData.color = this.barrelEntity.styleData.color;
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (20 / 42);
        this.positionData.x = (-this.barrelEntity.physicsData.values.size - this.physicsData.values.size) / 2;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.ReverseTrapLauncher = ReverseTrapLauncher;
class StrikerAddon extends BarrelAddon {
    constructor(owner) {
        super(owner);
        this.launcherEntity = new ReverseTrapLauncher(owner);
    }
}
exports.StrikerAddon = StrikerAddon;
class NoScaleTrapLauncher extends Object_1.default {
    constructor(barrel) {
        super(barrel.game);
        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = 1 | 4;
        this.styleData.values.color = 1;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width;
        this.physicsData.values.size = (42 * this.barrelEntity.tank.sizeFactor) * (20 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width;
        this.physicsData.size = (42 * this.barrelEntity.tank.sizeFactor) * (20 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    tick(tick) {
        super.tick(tick);
        this.resize();
    }
}
exports.NoScaleTrapLauncher = NoScaleTrapLauncher;
class NoScaleTrapLauncherAddon extends BarrelAddon {
    constructor(owner) {
        super(owner);
        this.launcherEntity = new NoScaleTrapLauncher(owner);
    }
}
exports.NoScaleTrapLauncherAddon = NoScaleTrapLauncherAddon;
class Extended extends BarrelAddon {
    constructor(owner) {
        super(owner);
        owner.positionData.x = 10;
    }
}
exports.Extended = Extended;
exports.BarrelAddonById = {
    minionLauncher: MinionLauncherAddon,
    engitrapLauncher: EngiTrapLauncherAddon,
    trapLauncher: TrapLauncherAddon,
    blockLauncher: BuilderLauncherAddon,
    swarmLauncher: SwarmLauncherAddon,
    machineTrapLauncher: MachineTrapLauncherAddon,
    engimachinetrapLauncher: MachineEngiTrapLauncherAddon,
    mineLauncher: MineLauncherAddon,
    machineMineLauncher: MineLauncherAddon2,
    stickyLauncher: StickyLauncherAddon,
    reversetrap: StrikerAddon,
    growLauncher: GrowLauncherAddon,
    bounceLauncher: BounceLauncherAddon,
    NecLauncher: NecMinionLauncherAddon,
    autoLauncher: AutoLauncherAddon,
    noScale: NoScaleTrapLauncherAddon,
    extended: Extended
};
