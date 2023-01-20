"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarrelAddonById = exports.StrikerAddon = exports.ReverseTrapLauncher = exports.StrikerLauncher = exports.MineLauncherAddon2 = exports.MineLauncher2 = exports.MineLauncherAddon = exports.MineLauncher = exports.MachineEngiTrapLauncherAddon = exports.MachineEngiTrapLauncher2 = exports.MachineEngiTrapLauncher = exports.SwarmLauncherAddon = exports.SwarmLauncher2 = exports.SwarmLauncher = exports.EngiTrapLauncherAddon = exports.EngiTrapLauncher2 = exports.EngiTrapLauncher = exports.MinionLauncherAddon = exports.MinionLauncher2 = exports.MinionLauncher = exports.MachineTrapLauncherAddon = exports.MachineTrapLauncher = exports.TrapLauncherAddon = exports.TrapLauncher = exports.BarrelAddon = void 0;
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
        this.styleData.color = this.barrelEntity.styleData.color;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width;
        this.physicsData.values.size = barrel.physicsData.values.width * (20 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }
    resize() {
        this.styleData.color = this.barrelEntity.styleData.color;
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
        this.physicsData.values.width = barrel.physicsData.values.width * 1.75;
        this.physicsData.values.size = barrel.physicsData.values.size * (30 / 50);
        this.positionData.values.x = 0;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.75;
        this.physicsData.size = this.barrelEntity.physicsData.values.size * (30 / 50);
        this.positionData.x = 0;
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
        this.physicsData.values.flags = 4;
        this.styleData.values.color = 1;
        this.styleData.values.flags |= 64;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 2.5;
        this.physicsData.values.size = 105 * (30 / 50);
        this.positionData.x = (this.barrelEntity.physicsData.values.size - this.physicsData.values.size) / 2;
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 2.5;
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
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) - (16 * (28 / 42));
    }
    resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 3.0625;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (13 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) - (16 * (28 / 42));
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
exports.MineLauncher = MineLauncher;
class MineLauncherAddon extends BarrelAddon {
    constructor(owner) {
        super(owner);
        this.launcherEntity = new MineLauncher(owner);
    }
}
exports.MineLauncherAddon = MineLauncherAddon;
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
exports.BarrelAddonById = {
    minionLauncher: MinionLauncherAddon,
    engitrapLauncher: EngiTrapLauncherAddon,
    trapLauncher: TrapLauncherAddon,
    swarmLauncher: SwarmLauncherAddon,
    machineTrapLauncher: MachineTrapLauncherAddon,
    engimachinetrapLauncher: MachineEngiTrapLauncherAddon,
    mineLauncher: MineLauncherAddon,
    machineMineLauncher: MineLauncherAddon2,
    reversetrap: StrikerAddon
};
