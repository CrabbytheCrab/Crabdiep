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
exports.ShootCycle = void 0;
const util = require("../../util");
const Bullet_1 = require("./Projectile/Bullet");
const Trap_1 = require("./Projectile/Trap");
const AutoTrap_1 = require("./Projectile/AutoTrap");
const Drone_1 = require("./Projectile/Drone");
const Drone2_1 = require("./Projectile/Drone2");
const Rocket_1 = require("./Projectile/Rocket");
const Launrocket_1 = require("./Projectile/Launrocket");
const Skimmer_1 = require("./Projectile/Skimmer");
const Minion_1 = require("./Projectile/Minion");
const Object_1 = require("../Object");
const Enums_1 = require("../../Const/Enums");
const FieldGroups_1 = require("../../Native/FieldGroups");
const DevTankDefinitions_1 = require("../../Const/DevTankDefinitions");
const Flame_1 = require("./Projectile/Flame");
const MazeWall_1 = require("../Misc/MazeWall");
const CrocSkimmer_1 = require("./Projectile/CrocSkimmer");
const BarrelAddons_1 = require("./BarrelAddons");
const Swarm_1 = require("./Projectile/Swarm");
/**
 * Class that determines when barrels can shoot, and when they can't.
 */
class ShootCycle {
    constructor(barrel) {
        this.barrelEntity = barrel;
        this.barrelEntity.barrel.reloadTime = this.barrelEntity.tank.reloadTime * this.barrelEntity.definition.reload;
        this.reloadTime = this.pos = barrel.barrel.values.reloadTime;
    }
    tick() {
        const reloadTime = this.barrelEntity.tank.reloadTime * this.barrelEntity.definition.reload;
        if (reloadTime !== this.reloadTime) {
            this.pos *= reloadTime / this.reloadTime;
            this.reloadTime = reloadTime;
        }
        const alwaysShoot = (this.barrelEntity.definition.forceFire) || (this.barrelEntity.definition.bullet.type === 'drone') || (this.barrelEntity.definition.bullet.type === 'minion');
        if (this.pos >= reloadTime) {
            // When its not shooting dont shoot, unless its a drone
            if (!this.barrelEntity.attemptingShot && !alwaysShoot) {
                this.pos = reloadTime;
                return;
            }
            // When it runs out of drones, dont shoot
            if (typeof this.barrelEntity.definition.droneCount === 'number' && this.barrelEntity.droneCount >= this.barrelEntity.definition.droneCount) {
                this.pos = reloadTime;
                return;
            }
        }
        if (this.pos >= reloadTime * (1 + this.barrelEntity.definition.delay)) {
            this.barrelEntity.barrel.reloadTime = reloadTime;
            this.barrelEntity.shoot();
            this.pos %= reloadTime;
        }
        else {
            this.pos += 1;
        }
    }
}
exports.ShootCycle = ShootCycle;
/**
 * The barrel class containing all barrel related data.
 * - Converts barrel definitions to diep objects
 * - Will contain shooting logic (or interact with it)
 */
class Barrel extends Object_1.default {
    constructor(owner, barrelDefinition) {
        super(owner.game);
        /** Whether or not the barrel is cycling the shoot cycle. */
        this.attemptingShot = false;
        /** Bullet base accel. Used for AI and bullet speed determination. */
        this.bulletAccel = 20;
        /** Number of drones that this barrel shot that are still alive. */
        this.droneCount = 0;
        /** The barrel's addons */
        this.addons = [];
        /** Always existant barrel field group, present on all barrels. */
        this.barrel = new FieldGroups_1.BarrelGroup(this);
        this.tank = owner;
        this.definition = barrelDefinition;
        // Begin Loading Definition
        this.style.values.color = Enums_1.Colors.Barrel;
        this.physics.values.sides = 2;
        if (barrelDefinition.isTrapezoid)
            this.physics.values.objectFlags |= Enums_1.ObjectFlags.isTrapezoid;
        this.setParent(owner);
        this.relations.values.owner = owner;
        this.relations.values.team = owner.relations.values.team;
        const sizeFactor = this.tank.sizeFactor;
        const size = this.physics.values.size = this.definition.size * sizeFactor;
        this.physics.values.width = this.definition.width * sizeFactor;
        this.position.values.angle = this.definition.angle + (this.definition.trapezoidDirection);
        this.position.values.x = Math.cos(this.definition.angle) * size / 2 - Math.sin(this.definition.angle) * this.definition.offset * sizeFactor;
        this.position.values.y = Math.sin(this.definition.angle) * size / 2 + Math.cos(this.definition.angle) * this.definition.offset * sizeFactor;
        // addons are below barrel, use StyleFlags.aboveParent to go above parent
        if (barrelDefinition.addon) {
            const AddonConstructor = BarrelAddons_1.BarrelAddonById[barrelDefinition.addon];
            if (AddonConstructor)
                this.addons.push(new AddonConstructor(this));
        }
        this.barrel.values.trapezoidalDir = barrelDefinition.trapezoidDirection;
        this.shootCycle = new ShootCycle(this);
        this.bulletAccel = (20 + (owner.cameraEntity.camera?.values.statLevels.values[Enums_1.Stat.BulletSpeed] || 0) * 3) * barrelDefinition.bullet.speed;
    }
    /** Shoots a bullet from the barrel. */
    shoot() {
        this.barrel.shooting ^= Enums_1.ShootingFlags.shoot;
        // No this is not correct
        const scatterAngle = (Math.PI / 180) * this.definition.bullet.scatterRate * (Math.random() - .5) * 10;
        let angle = this.definition.angle + scatterAngle + this.tank.position.values.angle;
        // Map angles unto
        // let e: Entity | null | undefined = this;
        // while (!((e?.position?.motion || 0) & MotionFlags.absoluteRotation) && (e = e.relations?.values.parent) instanceof ObjectEntity) angle += e.position.values.angle;
        this.rootParent.addAcceleration(angle + Math.PI, this.definition.recoil * 2);
        let tankDefinition = null;
        /** @ts-ignore */
        if (typeof this.rootParent.definition === 'object')
            tankDefinition = this.rootParent.definition;
        //const entity = new this.game.AbstractShape
        switch (this.definition.bullet.type) {
            case "skimmer":
                new Skimmer_1.default(this, this.tank, tankDefinition, angle, this.tank.inputs.attemptingRepel() ? -Skimmer_1.default.BASE_ROTATION : Skimmer_1.default.BASE_ROTATION);
                break;
            case "rocket":
                new Rocket_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'bullet': {
                const bullet = new Bullet_1.default(this, this.tank, tankDefinition, angle);
                if (tankDefinition && (tankDefinition.id === Enums_1.Tank.ArenaCloser || tankDefinition.id === DevTankDefinitions_1.DevTank.Squirrel))
                    bullet.position.motion |= Enums_1.MotionFlags.canMoveThroughWalls;
                break;
            }
            case 'trap':
                new Trap_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'autotrap':
                new AutoTrap_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'drone':
                new Drone_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'swarm':
                new Swarm_1.Swarm(this, this.tank, tankDefinition, angle);
                break;
            case 'minion':
                new Minion_1.default(this, this.tank, tankDefinition, angle);
                break;
            case "launrocket":
                new Launrocket_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'drone2':
                new Drone2_1.default(this, this.tank, tankDefinition, angle);
                break;
            //case "necro":
            // new NecromancerSquare(this, this.tank, tankDefinition, angle, entity);
            //break;
            case 'flame':
                new Flame_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'wall': {
                let w = new MazeWall_1.default(this.game, Math.round(this.tank.inputs.mouse.x / 50) * 50, Math.round(this.tank.inputs.mouse.y / 50) * 50, 250, 250);
                setTimeout(() => {
                    w.destroy();
                }, 60 * 1000);
                break;
            }
            case "croc":
                new CrocSkimmer_1.default(this, this.tank, tankDefinition, angle);
                break;
            default:
                util.log('Ignoring attempt to spawn projectile of type ' + this.definition.bullet.type);
                break;
        }
    }
    /** Resizes the barrel; when the tank gets bigger, the barrel must as well. */
    resize() {
        const sizeFactor = this.tank.sizeFactor;
        const size = this.physics.size = this.definition.size * sizeFactor;
        this.physics.width = this.definition.width * sizeFactor;
        this.position.angle = this.definition.angle + (this.definition.trapezoidDirection);
        this.position.x = Math.cos(this.definition.angle) * size / 2 - Math.sin(this.definition.angle) * this.definition.offset * sizeFactor;
        this.position.y = Math.sin(this.definition.angle) * size / 2 + Math.cos(this.definition.angle) * this.definition.offset * sizeFactor;
        // Updates bullet accel too
        this.bulletAccel = (20 + (this.tank.cameraEntity.camera?.values.statLevels.values[Enums_1.Stat.BulletSpeed] || 0) * 3) * this.definition.bullet.speed;
    }
    tick(tick) {
        this.resize();
        this.relations.values.team = this.tank.relations.values.team;
        if (!this.tank.rootParent.deletionAnimation) {
            this.attemptingShot = this.tank.inputs.attemptingShot();
            this.shootCycle.tick();
        }
        super.tick(tick);
    }
}
exports.default = Barrel;
