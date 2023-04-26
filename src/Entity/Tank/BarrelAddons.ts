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

import { Color, PhysicsFlags, StyleFlags } from "../../Const/Enums";
import { barrelAddonId } from "../../Const/TankDefinitions";
import GameServer from "../../Game";
import ObjectEntity from "../Object";
import Barrel from "./Barrel";

/**
 * Abstract class to represent a barrel's addon in game.
 * 
 * For more information on an addon, see Addons.ts - BarrelAddons are the same thing except they are applied on the barrel after it is made.
 * 
 * Read [addons.md on diepindepth](https://github.com/ABCxFF/diepindepth/blob/main/extras/addons.md) 
 * for more details and examples.
 */

export class BarrelAddon {
    /** The current game server */
    protected game: GameServer; 
    /** Helps the class determine size  */
    protected owner: Barrel;

    public constructor(owner: Barrel) {
        this.owner = owner;
        this.game = owner.game;
    }
}

/**
 * Entity attached to the edge of a trapper barrel
 */
export class BuilderLauncher extends ObjectEntity {
    /** The barrel that this trap launcher is placed on. */
    public barrelEntity: Barrel;

    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = PhysicsFlags.isTrapezoid | PhysicsFlags._unknown;
        this.styleData.color = this.barrelEntity.styleData.color;
        //this.positionData.values.angle = Math.PI;

        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width/1.75 * 1.27273;
        this.physicsData.values.size = barrel.physicsData.values.width * (15 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2.75;
    }

    public resize() {
        this.styleData.color = this.barrelEntity.styleData.color;
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width/1.75 * 1.27273;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (20 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2.75;
    }


    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
}

/** Trap launcher - added onto traps */
export class TrapLauncherAddon extends BarrelAddon {
    /** The actual trap launcher entity */
    public launcherEntity: BuilderLauncher;

    public constructor(owner: Barrel) {
        super(owner);

        this.launcherEntity = new TrapLauncher(owner);
    }
}
export class TrapLauncher extends ObjectEntity {
    /** The barrel that this trap launcher is placed on. */
    public barrelEntity: Barrel;

    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = PhysicsFlags.isTrapezoid | PhysicsFlags._unknown;
        this.styleData.values.color = Color.Barrel;

        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width;
        this.physicsData.values.size = barrel.physicsData.values.width * (20 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }

    public resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (20 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2;
    }


    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
}

export class AutoLauncherAddon extends BarrelAddon {
    /** The actual trap launcher entity */
    public launcherEntity: BuilderLauncher;

    public constructor(owner: Barrel) {
        super(owner);

        this.launcherEntity = new AutoLauncher(owner);
    }
}
export class AutoLauncher extends ObjectEntity {
    /** The barrel that this trap launcher is placed on. */
    public barrelEntity: Barrel;

    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = PhysicsFlags._unknown;
        this.styleData.values.color = Color.Barrel;

        this.physicsData.values.sides = 1;
        this.physicsData.values.width = barrel.physicsData.values.width * (25 / 50);
        this.physicsData.values.size = barrel.physicsData.values.width * (25 / 50);
        this.positionData.values.x = barrel.barrelData.trapezoidDirection == Math.PI ?
        (-barrel.physicsData.values.size + this.physicsData.values.size) / 1.5 :
        (barrel.physicsData.values.size - this.physicsData.values.size) / 1.5;
    }

    public resize() {
        this.physicsData.sides = 1;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * (25 / 50);
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (25 / 50);
        this.positionData.x = this.barrelEntity.barrelData.trapezoidDirection == Math.PI ?
        (-this.barrelEntity.physicsData.size + this.physicsData.size) / 1.5 :
        (this.barrelEntity.physicsData.size - this.physicsData.size) / 1.5;
    }


    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
}


export class GrowLauncherAddon extends BarrelAddon {
    /** The actual trap launcher entity */
    public launcherEntity: BuilderLauncher;

    public constructor(owner: Barrel) {
        super(owner);

        this.launcherEntity = new GrowLauncher(owner);
    }
}
export class GrowLauncher extends ObjectEntity {
    /** The barrel that this trap launcher is placed on. */
    public barrelEntity: Barrel;

    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.styleData.values.color = Color.Barrel;
        this.styleData.values.flags|= StyleFlags.showsAboveParent;
        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 1.2
        this.physicsData.values.size = barrel.physicsData.values.width * (27 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size/1.25 - this.physicsData.values.size) / 2
    }

    public resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.2;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (27 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size/1.25 - this.physicsData.values.size) /2
    }


    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
}



export class BounceLauncherAddon extends BarrelAddon {
    /** The actual trap launcher entity */
    public launcherEntity: BuilderLauncher;

    public constructor(owner: Barrel) {
        super(owner);

        this.launcherEntity = new BounceLauncher(owner);
    }
}
export class BounceLauncher extends ObjectEntity {
    /** The barrel that this trap launcher is placed on. */
    public barrelEntity: Barrel;

    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = PhysicsFlags._unknown;
        this.styleData.values.color = Color.Barrel;

        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 1.5;
        this.physicsData.values.size = barrel.physicsData.values.width * (20 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }

    public resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.5;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (20 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2;
    }


    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
}
/** Trap launcher - added onto traps */
export class BuilderLauncherAddon extends BarrelAddon {
    /** The actual trap launcher entity */
    public launcherEntity: TrapLauncher;

    public constructor(owner: Barrel) {
        super(owner);

        this.launcherEntity = new BuilderLauncher(owner);
    }
}
export class MachineTrapLauncher extends ObjectEntity {
    /** The barrel that this trap launcher is placed on. */
    public barrelEntity: Barrel;

    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = PhysicsFlags.isTrapezoid | PhysicsFlags._unknown;
        this.styleData.values.color = Color.Barrel;

        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 1.75;
        this.physicsData.values.size = barrel.physicsData.values.width * (25 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }

    public resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.75;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (25 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2;
    }


    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
}

/** Trap launcher - added onto traps */
export class MachineTrapLauncherAddon extends BarrelAddon {
    /** The actual trap launcher entity */
    public launcherEntity: MachineTrapLauncher;

    public constructor(owner: Barrel) {
        super(owner);

        this.launcherEntity = new MachineTrapLauncher(owner);
    }
}
export class MinionLauncher extends ObjectEntity {
    /** The barrel that this trap launcher is placed on. */
    public barrelEntity: Barrel;

    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = PhysicsFlags._unknown;
        this.styleData.values.color = Color.Barrel;
        this.styleData.values.flags|= StyleFlags.showsAboveParent;

        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width* 1.25;
        this.physicsData.values.size = barrel.physicsData.values.size * (10 / 50);
        this.positionData.values.x = (barrel.physicsData.values.size - this.physicsData.values.size) / 2;
    }

    public resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.25;
        this.physicsData.size = this.barrelEntity.physicsData.values.size * (10 / 50);
        this.positionData.x = (this.barrelEntity.physicsData.values.size - this.physicsData.values.size) / 2;
    }


    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
}

export class MinionLauncher2 extends ObjectEntity {
    /** The barrel that this trap launcher is placed on. */
    public barrelEntity: Barrel;

    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = PhysicsFlags._unknown;
        this.styleData.values.color = Color.Barrel;
        this.styleData.values.flags|= StyleFlags.showsAboveParent;

        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width* 1.25;
        this.physicsData.values.size = barrel.physicsData.values.size * (20 / 50);
        this.positionData.values.x = 0;
    }

    public resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.25;
        this.physicsData.size = this.barrelEntity.physicsData.values.size * (20 / 50);
        this.positionData.x = 0;
    }


    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
}

export class MinionLauncherAddon extends BarrelAddon {
    /** The actual trap launcher entity */
    public launcherEntity: MinionLauncher;

    public constructor(owner: Barrel) {
        super(owner);
        this.launcherEntity = new MinionLauncher(owner);
        this.launcherEntity = new MinionLauncher2(owner);
    }
}


export class NecMinionLauncher extends ObjectEntity {
    /** The barrel that this trap launcher is placed on. */
    public barrelEntity: Barrel;

    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = PhysicsFlags._unknown;
        this.styleData.values.color = Color.Barrel;
        this.styleData.values.flags|= StyleFlags.showsAboveParent;

        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width* 2;
        this.physicsData.values.size = barrel.physicsData.values.size * (10 / 50);
        this.positionData.values.x = (barrel.physicsData.values.size - this.physicsData.values.size) / 2;
    }

    public resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 2;
        this.physicsData.size = this.barrelEntity.physicsData.values.size * (10 / 50);
        this.positionData.x = (this.barrelEntity.physicsData.values.size - this.physicsData.values.size) / 2;
    }


    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
}

export class NecMinionLauncher2 extends ObjectEntity {
    /** The barrel that this trap launcher is placed on. */
    public barrelEntity: Barrel;

    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = PhysicsFlags._unknown;
        this.styleData.values.color = Color.Barrel;
        this.styleData.values.flags|= StyleFlags.showsAboveParent;

        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width* 1.25;
        this.physicsData.values.size = barrel.physicsData.values.size * (20 / 50);
        this.positionData.values.x = 0;
    }

    public resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 2;
        this.physicsData.size = this.barrelEntity.physicsData.values.size * (20 / 50);
        this.positionData.x = 0;
    }


    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
}

export class NecMinionLauncherAddon extends BarrelAddon {
    /** The actual trap launcher entity */
    public launcherEntity: MinionLauncher;

    public constructor(owner: Barrel) {
        super(owner);
        this.launcherEntity = new NecMinionLauncher(owner);
        this.launcherEntity = new NecMinionLauncher2(owner);
    }
}


export class EngiTrapLauncher extends ObjectEntity {
    /** The barrel that this trap launcher is placed on. */
    public barrelEntity: Barrel;

    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = PhysicsFlags.isTrapezoid | PhysicsFlags._unknown;
        this.styleData.values.flags|= StyleFlags.showsAboveParent;
        this.styleData.values.color = Color.Barrel;

        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width;
        this.physicsData.values.size = barrel.physicsData.values.width * (20 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size - this.physicsData.values.size) / 2;
    }

    public resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (20 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size - this.physicsData.values.size) / 2;
    }


    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
}
export class EngiTrapLauncher2 extends ObjectEntity {
    /** The barrel that this trap launcher is placed on. */
    public barrelEntity: Barrel;

    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.styleData.values.flags |= StyleFlags.showsAboveParent;
        this.physicsData.values.flags = PhysicsFlags._unknown;
        this.styleData.values.color = Color.Barrel;

        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 1.75;
        this.physicsData.values.size = barrel.physicsData.values.width * (10 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }

    public resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.75;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (10 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2;
    }


    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
}


export class EngiTrapLauncherAddon extends BarrelAddon {
    /** The actual trap launcher entity */
    public launcherEntity: MinionLauncher;

    public constructor(owner: Barrel) {
        super(owner);
        this.launcherEntity = new EngiTrapLauncher(owner);
        this.launcherEntity = new EngiTrapLauncher2(owner);
    }
}
export class SwarmLauncher extends ObjectEntity {
    /** The barrel that this trap launcher is placed on. */
    public barrelEntity: Barrel;

    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = PhysicsFlags._unknown;
        this.styleData.values.color = Color.Barrel;
        this.styleData.values.flags|= StyleFlags.showsAboveParent;

        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 1.75;
        this.physicsData.values.size = barrel.physicsData.values.size * (30 / 50);
        this.positionData.values.x = 0;
        //this.positionData.values.angle = Math.PI;
    }

    public resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.75;
        this.physicsData.size = this.barrelEntity.physicsData.values.size * (30 / 50);
        this.positionData.x = 0;
        //this.positionData.angle = Math.PI;
    }


    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
}

export class SwarmLauncher2 extends ObjectEntity {
    /** The barrel that this trap launcher is placed on. */
    public barrelEntity: Barrel;

    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = PhysicsFlags._unknown;
        this.styleData.values.color = Color.Barrel;
        this.styleData.values.flags|= StyleFlags.showsAboveParent;

        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 2.5;
        this.physicsData.values.size = 105 * (30 / 50);
        this.positionData.x = (this.barrelEntity.physicsData.values.size - this.physicsData.values.size) / 2;
        //this.positionData.values.angle = Math.PI;
    }

    public resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 2.5;
        this.physicsData.size = this.barrelEntity.tank.sizeFactor * 105 * (30 / 50);
        this.positionData.x = (this.barrelEntity.physicsData.values.size - this.physicsData.values.size) / 2;
        //this.positionData.angle = Math.PI;
    }
    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
}
export class SwarmLauncherAddon extends BarrelAddon {
    /** The actual trap launcher entity */
    public launcherEntity: MinionLauncher;

    public constructor(owner: Barrel) {
        super(owner);
        this.launcherEntity = new SwarmLauncher(owner);
        this.launcherEntity = new SwarmLauncher2(owner);
    }
}


export class MachineEngiTrapLauncher extends ObjectEntity {
    /** The barrel that this trap launcher is placed on. */
    public barrelEntity: Barrel;

    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = PhysicsFlags.isTrapezoid | PhysicsFlags._unknown;
        this.styleData.values.flags|= StyleFlags.showsAboveParent;
        this.styleData.values.color = Color.Barrel;

        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 1.75;
        this.physicsData.values.size = barrel.physicsData.values.width * (28 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }

    public resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.75;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (28 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2;
    }


    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
}
export class MachineEngiTrapLauncher2 extends ObjectEntity {
    /** The barrel that this trap launcher is placed on. */
    public barrelEntity: Barrel;

    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.styleData.values.flags |= StyleFlags.showsAboveParent;
        this.physicsData.values.flags = PhysicsFlags._unknown;
        this.styleData.values.color = Color.Barrel;

        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 3.0625        ;
        this.physicsData.values.size = barrel.physicsData.values.width * (13 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) - (16 * (28 / 42));
    }

    public resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 3.0625        ;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (13 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) - (16 * (28 / 42));
    }


    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
}


export class MachineEngiTrapLauncherAddon extends BarrelAddon {
    /** The actual trap launcher entity */
    public launcherEntity: MinionLauncher;

    public constructor(owner: Barrel) {
        super(owner);
        this.launcherEntity = new MachineEngiTrapLauncher(owner);
        this.launcherEntity = new MachineEngiTrapLauncher2(owner);
    }
}

export class MineLauncher extends ObjectEntity {
    /** The barrel that this trap launcher is placed on. */
    public barrelEntity: Barrel;

    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags =  PhysicsFlags._unknown;
        this.styleData.values.color = Color.Barrel;

        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 1.75;
        this.physicsData.values.size = barrel.physicsData.values.width * (20 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }

    public resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.75;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (20 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2;
    }


    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
}

/** Trap launcher - added onto traps */
export class MineLauncherAddon extends BarrelAddon {
    /** The actual trap launcher entity */
    public launcherEntity: TrapLauncher;

    public constructor(owner: Barrel) {
        super(owner);

        this.launcherEntity = new MineLauncher(owner);
    }
}


export class StickyLauncher extends ObjectEntity {
    /** The barrel that this trap launcher is placed on. */
    public barrelEntity: Barrel;

    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags =  PhysicsFlags._unknown;
        this.styleData.values.color = Color.Barrel;
        this.styleData.values.flags|=  StyleFlags.showsAboveParent;

        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 1.5;
        this.physicsData.values.size = barrel.physicsData.values.width * (20 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }

    public resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.5;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (20 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2;
    }


    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
}


export class StickyLauncher2 extends ObjectEntity {
    /** The barrel that this trap launcher is placed on. */
    public barrelEntity: Barrel;

    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags =  PhysicsFlags._unknown;
        this.styleData.values.color = Color.Barrel;
        this.styleData.values.flags|=  StyleFlags.showsAboveParent;

        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 1.25;
        this.physicsData.values.size = barrel.physicsData.values.width * (20 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size - this.physicsData.values.size) / 2;
    }

    public resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 1.25;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (20 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size - this.physicsData.values.size) / 2;
    }


    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
}

/** Trap launcher - added onto traps */
export class StickyLauncherAddon extends BarrelAddon {
    /** The actual trap launcher entity */
    public launcherEntity: TrapLauncher;

    public constructor(owner: Barrel) {
        super(owner);

        this.launcherEntity = new StickyLauncher(owner);
        this.launcherEntity = new StickyLauncher2(owner);
    }
}

export class MineLauncher2 extends ObjectEntity {
    /** The barrel that this trap launcher is placed on. */
    public barrelEntity: Barrel;

    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags =  PhysicsFlags._unknown;
        this.styleData.values.color = Color.Barrel;

        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 2.625;
        this.physicsData.values.size = barrel.physicsData.values.width * (20 / 42);
        this.positionData.values.x = (barrel.physicsData.values.size + this.physicsData.values.size) / 2;
    }

    public resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 2.625;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (20 / 42);
        this.positionData.x = (this.barrelEntity.physicsData.values.size + this.physicsData.values.size) / 2;
    }


    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
}

/** Trap launcher - added onto traps */
export class MineLauncherAddon2 extends BarrelAddon {
    /** The actual trap launcher entity */
    public launcherEntity: TrapLauncher;

    public constructor(owner: Barrel) {
        super(owner);

        this.launcherEntity = new MineLauncher2(owner);
    }
}

export class StrikerLauncher extends ObjectEntity {
    /** The barrel that this trap launcher is placed on. */
    public barrelEntity: Barrel;

    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = PhysicsFlags.isTrapezoid | PhysicsFlags._unknown;
        this.styleData.values.color = Color.Barrel;
        this.styleData.values.flags|=  StyleFlags.showsAboveParent;

        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width * 0.45;
        this.physicsData.values.size = barrel.physicsData.values.size * (40 / 50);
        this.positionData.values.x = 0;
        this.positionData.values.angle = Math.PI;
    }

    public resize() {
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width * 0.45;
        this.physicsData.size = this.barrelEntity.physicsData.values.size * (40 / 50);
        this.positionData.x = 0;
        //this.positionData.angle = Math.PI;
    }


    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
    
}


export class ReverseTrapLauncher extends ObjectEntity {
    /** The barrel that this trap launcher is placed on. */
    public barrelEntity: Barrel;

    /** Resizes the trap launcher; when its barrel owner gets bigger, the trap launcher must as well. */
    public constructor(barrel: Barrel) {
        super(barrel.game);

        this.barrelEntity = barrel;
        this.setParent(barrel);
        this.relationsData.values.team = barrel;
        this.physicsData.values.flags = PhysicsFlags.isTrapezoid | PhysicsFlags._unknown;
        this.styleData.color = this.barrelEntity.styleData.color;
        this.positionData.values.angle = Math.PI;

        this.physicsData.values.sides = 2;
        this.physicsData.values.width = barrel.physicsData.values.width;
        this.physicsData.values.size = barrel.physicsData.values.width * (20 / 42);
        this.positionData.values.x = (-barrel.physicsData.values.size - this.physicsData.values.size) / 2;
    }

    public resize() {
        this.styleData.color = this.barrelEntity.styleData.color;
        this.physicsData.sides = 2;
        this.physicsData.width = this.barrelEntity.physicsData.values.width;
        this.physicsData.size = this.barrelEntity.physicsData.values.width * (20 / 42);
        this.positionData.x = (-this.barrelEntity.physicsData.values.size - this.physicsData.values.size) / 2;
    }


    public tick(tick: number) {
        super.tick(tick);

        this.resize();
    }
}
export class StrikerAddon extends BarrelAddon {
    /** The actual trap launcher entity */
    public launcherEntity: StrikerLauncher;

    public constructor(owner: Barrel) {
        super(owner);

        //this.launcherEntity = new StrikerLauncher(owner);
        this.launcherEntity = new ReverseTrapLauncher(owner);
    }
}
/**
 * All barrel addons in the game by their ID.
 */
 export const BarrelAddonById: Record<barrelAddonId, typeof BarrelAddon | null> = {
    minionLauncher: MinionLauncherAddon,
    engitrapLauncher : EngiTrapLauncherAddon,
    trapLauncher: TrapLauncherAddon,
    blockLauncher: BuilderLauncherAddon,
    swarmLauncher: SwarmLauncherAddon,
    machineTrapLauncher: MachineTrapLauncherAddon,
    engimachinetrapLauncher: MachineEngiTrapLauncherAddon,
    mineLauncher : MineLauncherAddon,
    machineMineLauncher : MineLauncherAddon2,
    stickyLauncher : StickyLauncherAddon,
    reversetrap : StrikerAddon,
    growLauncher: GrowLauncherAddon,
    bounceLauncher: BounceLauncherAddon,
    NecLauncher : NecMinionLauncherAddon,
    autoLauncher: AutoLauncherAddon

}
