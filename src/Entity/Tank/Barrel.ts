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

import * as util from "../../util";

import Bullet from "./Projectile/Bullet";
import Blunt from "./Projectile/Blunt";
import BluntTrap from "./Projectile/BluntTrap";
import Orbit from "./Projectile/Orbit";
import Trap from "./Projectile/Trap";
import Drone from "./Projectile/Drone";
import Hive from "./Projectile/Hive";
import Rocket from "./Projectile/Rocket";
import Spinner from "./Projectile/Spinner";
import Spinner4 from "./Projectile/Spinner4";
import TrapSpinner from "./Projectile/Trapspin";
import Conglom from "./Projectile/Conglom";
import Skimmer from "./Projectile/Skimmer";
import Minion from "./Projectile/Minion";
import DomMinion from "./Projectile/DomMinion";
import ObjectEntity from "../Object";
import TankBody, { BarrelBase } from "./TankBody";

import { Color, PositionFlags, PhysicsFlags, BarrelFlags, Stat, Tank } from "../../Const/Enums";
import { BarrelGroup } from "../../Native/FieldGroups";
import { BarrelDefinition, TankDefinition } from "../../Const/TankDefinitions";
import { DevTank } from "../../Const/DevTankDefinitions";
import Flame from "./Projectile/Flame";
import MazeWall from "../Misc/MazeWall";
import CrocSkimmer from "./Projectile/CrocSkimmer";
import { BarrelAddon, BarrelAddonById } from "./BarrelAddons";
import { Swarm } from "./Projectile/Swarm";
import { AutoSwarm } from "./Projectile/AutoSwarm";
import NecromancerSquare from "./Projectile/NecromancerSquare";
import MiniMinion from "./Projectile/MiniMinion";
import MegaMinion from "./Projectile/MegaMinion";
import Launrocket from "./Projectile/Launrocket";
import Boomerang from "./Projectile/Boomerang";
import AutoDrone from "./Projectile/AutoDrone";
import AutoTrap from "./Projectile/AutoTrap";
import NecromancerPentagon from "./Projectile/NecromancerPenta";
import Pentagon from "./Projectile/PentaDrone";
import NecromancerTriangle from "./Projectile/NecromancerTriangle";
import MegaSpinner from "./Projectile/MegaSpinner";
import Mine from "./Projectile/Mine";
import BombDrone from "./Projectile/BombDrone";
import Striker from "./Projectile/Striker";
import OrbitTrap from "./Projectile/OrbitTrap";
import Block from "./Projectile/Block";
import PillBox from "./Projectile/Block";
import Explosion from "./Projectile/Explosion";
import NecromancerWepSquare from "./Projectile/NecromancerWepSquare";
import HomingBullet from "./Projectile/HomingBullet";
import Seakingrocket from "./Projectile/Seakingrocket";
import Orbitrocket from "./Projectile/Orbitrocket";
import { AI } from "../AI";
import { CameraEntity } from "../../Native/Camera";
import AiTank from "../Misc/AiTank";
import { Sentry } from "../Shape/Sentry";
import Bouncer from "./Projectile/Bouncer";
import Snake from "./Projectile/Snake";
import Grower from "./Projectile/Grower";
import AutoBullet from "./Projectile/AutoBullet";
import AutoRocket from "./Projectile/AutoRocket";
import Shotgun from "./Projectile/ShotGun";
import Leach from "./Projectile/Leach";
/**
 * Class that determines when barrels can shoot, and when they can't.
 */
export class ShootCycle {
    /** The barrel this cycle is keeping track of. */
    public barrelEntity: Barrel;
    /** The current position in the cycle. */
    private pos: number;
    /** The last known reload time of the barrel. */
    private reloadTime: number;

    public constructor(barrel: Barrel) {
        this.barrelEntity = barrel;
        this.barrelEntity.barrelData.reloadTime = this.barrelEntity.tank.reloadTime * this.barrelEntity.definition.reload;
        this.reloadTime = this.pos = barrel.barrelData.values.reloadTime;
    }

    public tick() {
        const reloadTime = this.barrelEntity.tank.reloadTime * this.barrelEntity.definition.reload;
        if (reloadTime !== this.reloadTime) {
            this.pos *= reloadTime / this.reloadTime;
            this.reloadTime = reloadTime;
        }

        const alwaysShoot = (this.barrelEntity.definition.forceFire) ||(this.barrelEntity.definition.bullet.type === 'dronenorep') ||(this.barrelEntity.definition.bullet.type === 'bombdrone')||(this.barrelEntity.definition.bullet.type === 'autodrone') || (this.barrelEntity.definition.bullet.type === 'pentadrone') || (this.barrelEntity.definition.bullet.type === 'domminion') || (this.barrelEntity.definition.bullet.type === 'megaminion') || (this.barrelEntity.definition.bullet.type === 'miniminion') || (this.barrelEntity.definition.bullet.type === 'minion') || (this.barrelEntity.definition.bullet.type === 'drone') || (this.barrelEntity.definition.bullet.type === 'necrodrone') || (this.barrelEntity.definition.bullet.type === 'wepnecrodrone') || (this.barrelEntity.definition.bullet.type === 'necropentadrone') || (this.barrelEntity.definition.bullet.type === 'necrotriangledrone');
        const necroShoot = (this.barrelEntity.definition.bullet.type === 'necrodrone') || (this.barrelEntity.definition.bullet.type === 'wepnecrodrone') || (this.barrelEntity.definition.bullet.type === 'necropentadrone') || (this.barrelEntity.definition.bullet.type === 'necrotriangledrone');
        const Orbshot = (this.barrelEntity.definition.bullet.type === 'orbit'|| this.barrelEntity.definition.bullet.type === 'orbitrocket'||(this.barrelEntity.definition.bullet.type === 'orbittrap'))
        if (this.pos >= reloadTime) {
            // When its not shooting dont shoot, unless its a drone
            if (!this.barrelEntity.attemptingShot && !alwaysShoot) {
                this.pos = reloadTime;
                return;
            }
            // When it runs out of drones, dont shoot
            if (!necroShoot && typeof this.barrelEntity.definition.droneCount === 'number' && this.barrelEntity.droneCount >= this.barrelEntity.definition.droneCount) {
                this.pos = reloadTime;
                return;
            }
            if (Orbshot && typeof this.barrelEntity.tank.MAXORBS === 'number' && this.barrelEntity.tank.OrbCount >= this.barrelEntity.tank.MAXORBS) {
                this.pos = reloadTime;
                return;
            }
            if (necroShoot && typeof this.barrelEntity.tank.MAXDRONES === 'number' && this.barrelEntity.tank.DroneCount >= this.barrelEntity.tank.MAXDRONES) {
                this.pos = reloadTime;
                return;
            }
        }

        if (this.pos >= reloadTime * (1 + this.barrelEntity.definition.delay)) {
            this.barrelEntity.barrelData.reloadTime = reloadTime;
            this.barrelEntity.shoot();
            this.pos = reloadTime * this.barrelEntity.definition.delay;
        }

        this.pos += 1;
    }
}

/**
 * The barrel class containing all barrel related data.
 * - Converts barrel definitions to diep objects
 * - Will contain shooting logic (or interact with it)
 */
export default class Barrel extends ObjectEntity {
    /** The raw data defining the barrel. */
    public definition: BarrelDefinition;
    /** The owner / tank / parent of the barrel.  */
    public tank: BarrelBase;
    /** The cycle at which the barrel can shoot. */
    public shootCycle: ShootCycle;
    /** Whether or not the barrel is cycling the shoot cycle. */
    public attemptingShot = false;
    /** Bullet base accel. Used for AI and bullet speed determination. */
    public bulletAccel = 20;
    /** Number of drones that this barrel shot that are still alive. */
    public droneCount = 0;

    /** The barrel's addons */
    public addons: BarrelAddon[] = [];

    /** Always existant barrel field group, present on all barrels. */
    public barrelData: BarrelGroup = new BarrelGroup(this);

    public constructor(owner: BarrelBase, barrelDefinition: BarrelDefinition) {
        super(owner.game);

        this.tank = owner;
        this.definition = barrelDefinition;

        // Begin Loading Definition
        this.styleData.values.color = this.definition.color ?? Color.Barrel;
        this.physicsData.values.sides = 2;
        if (barrelDefinition.isTrapezoid) this.physicsData.values.flags |= PhysicsFlags.isTrapezoid;

        this.setParent(owner);
        this.relationsData.values.owner = owner;
        this.relationsData.values.team = owner.relationsData.values.team;

        const sizeFactor = this.tank.sizeFactor;
        const size = this.physicsData.values.size = this.definition.size * sizeFactor;

        this.physicsData.values.width = this.definition.width * sizeFactor;
        this.positionData.values.angle = this.definition.angle + (this.definition.trapezoidDirection);
        this.positionData.values.x = Math.cos(this.definition.angle) * (size / 2 + (this.definition.distance || 0)) - Math.sin(this.definition.angle) * this.definition.offset * sizeFactor;
        this.positionData.values.y = Math.sin(this.definition.angle) * (size / 2 + (this.definition.distance || 0)) + Math.cos(this.definition.angle) * this.definition.offset * sizeFactor;

        // addons are below barrel, use StyleFlags.aboveParent to go above parent
        if (barrelDefinition.addon) {
            const AddonConstructor = BarrelAddonById[barrelDefinition.addon];
            if (AddonConstructor) this.addons.push(new AddonConstructor(this));
        }

        this.barrelData.values.trapezoidDirection = barrelDefinition.trapezoidDirection;
        this.shootCycle = new ShootCycle(this);
        const iseffectedbyspeed = (this.definition.bullet.type === 'trapspinner'  || this.definition.bullet.type === 'spinner' || this.definition.bullet.type === 'spinner4' || this.definition.bullet.type === 'megaspinner' || this.definition.bullet.type === 'conglom')
        if(!iseffectedbyspeed){
        this.bulletAccel = (20 + (owner.cameraEntity.cameraData?.values.statLevels.values[Stat.BulletSpeed] || 0) * 3) * barrelDefinition.bullet.speed;
        }
        else{
            this.bulletAccel = (20 * 3) * barrelDefinition.bullet.speed;
        }
    }

    /** Shoots a bullet from the barrel. */
    public shoot() {
        this.barrelData.flags ^= BarrelFlags.hasShot;

        // No this is not correct
        const scatterAngle = (Math.PI / 180) * this.definition.bullet.scatterRate * (Math.random() - .5) * 10;
        let angle = this.definition.angle + scatterAngle + this.tank.positionData.values.angle;

        // Map angles unto
        // let e: Entity | null | undefined = this;
        // while (!((e?.position?.flags || 0) & MotionFlags.absoluteRotation) && (e = e.relations?.values.parent) instanceof ObjectEntity) angle += e.position.values.angle;

        this.rootParent.addAcceleration(angle + Math.PI, this.definition.recoil * 2);

        let tankDefinition: TankDefinition | null = null;

        if (this.rootParent instanceof TankBody) tankDefinition = this.rootParent.definition;


        switch (this.definition.bullet.type) {
            case "conglom":
                new Conglom(this, this.tank, tankDefinition, angle, this.tank.inputs.attemptingRepel() ? -Spinner.BASE_ROTATION : Spinner.BASE_ROTATION);
                break;
            case "spinner":
                new Spinner(this, this.tank, tankDefinition, angle, this.tank.inputs.attemptingRepel() ? -Spinner.BASE_ROTATION : Spinner.BASE_ROTATION);
                break;
            case "trapspinner":
                new TrapSpinner(this, this.tank, tankDefinition, angle, this.tank.inputs.attemptingRepel() ? -Spinner.BASE_ROTATION : Spinner.BASE_ROTATION);
                break;
            case "spinner4":
                new Spinner4(this, this.tank, tankDefinition, angle, this.tank.inputs.attemptingRepel() ? -Spinner.BASE_ROTATION : Spinner.BASE_ROTATION);
                break;
            case "megaspinner":
                new MegaSpinner(this, this.tank, tankDefinition, angle, this.tank.inputs.attemptingRepel() ? -Spinner.BASE_ROTATION : Spinner.BASE_ROTATION);
                break;
            case "rocket":
                new Rocket(this, this.tank, tankDefinition, angle);
                break;
            case "skimmer":
                new Skimmer(this, this.tank, tankDefinition, angle);
                break;
            case "snake":
                new Snake(this, this.tank, tankDefinition, angle, this.tank.inputs.attemptingRepel() ?  0:1);
                break;
            case 'bullet': {
                const bullet = new Bullet(this, this.tank, tankDefinition, angle, this.rootParent);

                if (tankDefinition && (tankDefinition.id === Tank.ArenaCloser || tankDefinition.id === DevTank.Squirrel)) bullet.positionData.flags |= PositionFlags.canMoveThroughWalls;
                break;
            }
            case 'leach': {
                const bullet = new Leach(this, this.tank, tankDefinition, angle, this.rootParent);
                break;
            }
            case 'autobullet': {
                const bullet = new AutoBullet(this, this.tank, tankDefinition, angle, this.rootParent);
                break;
            }
            case 'shotgun4': {
                for (let i = 0; i < 4; ++i) {
                const scatterAngle = (Math.PI / 180) * this.definition.bullet.scatterRate * (Math.random() - .5) * 10;
                const bullet = new Shotgun(this, this.tank, tankDefinition, this.definition.angle + scatterAngle + this.tank.positionData.values.angle);
                }
                break;
            }
            case 'shotgun3': {
                for (let i = 0; i < 3; ++i) {
                const scatterAngle = (Math.PI / 180) * this.definition.bullet.scatterRate * (Math.random() - .5) * 10;
                const bullet = new Shotgun(this, this.tank, tankDefinition, this.definition.angle + scatterAngle + this.tank.positionData.values.angle);
                }
                break;
            }
            case 'shotgun9': {
                for (let i = 0; i < 9; ++i) {
                const scatterAngle = (Math.PI / 180) * this.definition.bullet.scatterRate * (Math.random() - .5) * 10;
                const bullet = new Shotgun(this, this.tank, tankDefinition, this.definition.angle + scatterAngle + this.tank.positionData.values.angle);
                }
                break;
            }
            case 'shotgun20': {
                for (let i = 0; i < 28; ++i) {
                const scatterAngle = (Math.PI / 180) * this.definition.bullet.scatterRate * (Math.random() - .5) * 10;
                const bullet = new Shotgun(this, this.tank, tankDefinition, this.definition.angle + scatterAngle + this.tank.positionData.values.angle);
                }
                break;
            }
            case 'shotgun4blunt': {
                for (let i = 0; i < 4; ++i) {
                const scatterAngle = (Math.PI / 180) * this.definition.bullet.scatterRate * (Math.random() - .5) * 10;
                const bullet = new Blunt(this, this.tank, tankDefinition, this.definition.angle + scatterAngle + this.tank.positionData.values.angle);
                }
                break;
            }
            case 'streambullet': {
                const bullet = new Bullet(this, this.tank, tankDefinition, this.definition.angle + this.tank.positionData.values.angle);
                this.definition.bullet.scatterRate = 0
                break;
            }
            case 'trap':
                new Trap(this, this.tank, tankDefinition, angle, this.rootParent);
                break;
                case 'block':
                    new PillBox(this, this.tank, tankDefinition, angle);
                    break;
                case 'striker':
                    new Striker(this, this.tank, tankDefinition, angle, this.rootParent);
                    break;
            case 'mine':
                new Mine(this, this.tank, tankDefinition, angle, this.rootParent);
                break;
            case 'drone':
                new Drone(this, this.tank, tankDefinition, angle, true);
                break;
            case 'dronenorep':
                new Drone(this, this.tank, tankDefinition, angle, false);
                break
                case 'bombdrone':
                    new BombDrone(this, this.tank, tankDefinition, angle);
                    break;
                case 'autodrone':
                    new AutoDrone(this, this.tank, tankDefinition, angle);
                    break;
            case 'orbit':
                new Orbit(this, this.tank, tankDefinition, angle);
                break;
            case 'orbitrocket':
                new Orbitrocket(this, this.tank, tankDefinition, angle);
            break;
                case 'orbittrap':
                    new OrbitTrap(this, this.tank, tankDefinition, angle);
                    break;
            case 'pentadrone':
                new Pentagon(this, this.tank, tankDefinition, angle);
                break;
            case 'necrodrone':
                new NecromancerSquare(this, this.tank, tankDefinition, angle);
                break;
            case 'wepnecrodrone':
                new NecromancerWepSquare(this, this.tank, tankDefinition, angle);
                break;
            case 'swarm':
                new Swarm(this, this.tank, tankDefinition, angle);
                break;
            case 'autoswarm':
                new AutoSwarm(this, this.tank, tankDefinition, angle);
                break;
            case 'minion':
                new Minion(this, this.tank, tankDefinition, angle);
                break;
            case 'flame':
                new Flame(this, this.tank, tankDefinition, angle);
                break;
            case 'grower':
                new Grower(this, this.tank, tankDefinition, angle);
                break;
            case 'explosion':
                new Explosion(this, this.tank, tankDefinition, angle);
                break;
            case 'wall': {
                let w = new MazeWall(this.game, Math.round(this.tank.inputs.mouse.x / 50) * 50, Math.round(this.tank.inputs.mouse.y / 50) * 50, 250, 250);
                setTimeout(() => {
                    w.destroy();
                }, 60 * 1000);
                break;
            }
            case 'domminion':
                new DomMinion(this, this.tank, tankDefinition, angle);
                break;
            case 'miniminion':
                new MiniMinion(this, this.tank, tankDefinition, angle);
                break;
            case 'megaminion':
                new MegaMinion(this, this.tank, tankDefinition, angle);
                break;
            case "launrocket":
                new Launrocket(this, this.tank, tankDefinition, angle);
                break;
            case "autorocket":
                new AutoRocket(this, this.tank, tankDefinition, angle);
                break;
            case 'boomerang':
                new Boomerang(this, this.tank, tankDefinition, angle);
                break;
            case 'bouncer':
                new Bouncer(this, this.tank, tankDefinition, angle);
                break;
            case 'autotrap':
                new AutoTrap(this, this.tank, tankDefinition, angle);
                break;
            case 'necropentadrone':
                new NecromancerPentagon(this, this.tank, tankDefinition, angle);
                break;
            case 'hive':
                new Hive(this, this.tank, tankDefinition, angle);
                break;
            case 'necrotriangledrone':
                new NecromancerTriangle(this, this.tank, tankDefinition, angle);
                break;
            case 'tank':
                break;
            case 'blunt':
                new Blunt(this, this.tank, tankDefinition, angle);
                break;
            case 'homing':
                new HomingBullet(this, this.tank, tankDefinition, angle);
                break;
            case 'homingrocket':
                new Seakingrocket(this, this.tank, tankDefinition, angle);
                break;
            case 'blunttrap':
                new BluntTrap(this, this.tank, tankDefinition, angle);
                break;
            case "croc": 
                new CrocSkimmer(this, this.tank, tankDefinition, angle);
                break;
            default:
                util.log('Ignoring attempt to spawn projectile of type ' + this.definition.bullet.type);
                break;
        }

    }


    /** Resizes the barrel; when the tank gets bigger, the barrel must as well. */
    protected resize() {
        const sizeFactor = this.tank.sizeFactor;
        const size = this.physicsData.size = this.definition.size * sizeFactor;

        this.physicsData.width = this.definition.width * sizeFactor;
        this.positionData.angle = this.definition.angle + (this.definition.trapezoidDirection);
        if(this.definition.distance !== undefined){
            this.positionData.x = Math.cos(this.definition.angle) * (size * this.definition.distance) - Math.sin(this.definition.angle) * this.definition.offset * sizeFactor;
            this.positionData.y = Math.sin(this.definition.angle) * (size * this.definition.distance) + Math.cos(this.definition.angle) * this.definition.offset * sizeFactor;
        }else{
            this.positionData.x = Math.cos(this.definition.angle) * (size / 2 + (this.definition.distance || 0)) - Math.sin(this.definition.angle) * this.definition.offset * sizeFactor;
            this.positionData.y = Math.sin(this.definition.angle) * (size / 2 + (this.definition.distance || 0)) + Math.cos(this.definition.angle) * this.definition.offset * sizeFactor;
        }

        // Updates bullet accel too
        const iseffectedbyspeed = (this.definition.bullet.type === 'trapspinner'  || this.definition.bullet.type === 'spinner' || this.definition.bullet.type === 'spinner4' || this.definition.bullet.type === 'megaspinner'|| this.definition.bullet.type === 'conglom')
        if(!iseffectedbyspeed){
        this.bulletAccel = (20 + (this.tank.cameraEntity.cameraData?.values.statLevels.values[Stat.BulletSpeed] || 0) * 3) * this.definition.bullet.speed;
        }
        else{
            this.bulletAccel = (20 * 3) * this.definition.bullet.speed;
        }
    }

    public tick(tick: number) {
        this.resize();

        this.relationsData.values.team = this.tank.relationsData.values.team;

        if (!this.tank.rootParent.deletionAnimation || this.definition.bulletdie){
            this.attemptingShot = this.definition.inverseFire? this.tank.inputs.attemptingRepel() : this.tank.inputs.attemptingShot();
            this.shootCycle.tick();
        }

        super.tick(tick);
    }
}
