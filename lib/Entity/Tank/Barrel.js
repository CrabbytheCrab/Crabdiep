"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShootCycle = void 0;
const util = require("../../util");
const Bullet_1 = require("./Projectile/Bullet");
const Blunt_1 = require("./Projectile/Blunt");
const BluntTrap_1 = require("./Projectile/BluntTrap");
const Orbit_1 = require("./Projectile/Orbit");
const Trap_1 = require("./Projectile/Trap");
const Drone_1 = require("./Projectile/Drone");
const Hive_1 = require("./Projectile/Hive");
const Rocket_1 = require("./Projectile/Rocket");
const Spinner_1 = require("./Projectile/Spinner");
const Spinner4_1 = require("./Projectile/Spinner4");
const Trapspin_1 = require("./Projectile/Trapspin");
const Conglom_1 = require("./Projectile/Conglom");
const Skimmer_1 = require("./Projectile/Skimmer");
const Minion_1 = require("./Projectile/Minion");
const DomMinion_1 = require("./Projectile/DomMinion");
const Object_1 = require("../Object");
const TankBody_1 = require("./TankBody");
const FieldGroups_1 = require("../../Native/FieldGroups");
const Flame_1 = require("./Projectile/Flame");
const MazeWall_1 = require("../Misc/MazeWall");
const CrocSkimmer_1 = require("./Projectile/CrocSkimmer");
const BarrelAddons_1 = require("./BarrelAddons");
const Swarm_1 = require("./Projectile/Swarm");
const AutoSwarm_1 = require("./Projectile/AutoSwarm");
const NecromancerSquare_1 = require("./Projectile/NecromancerSquare");
const MiniMinion_1 = require("./Projectile/MiniMinion");
const MegaMinion_1 = require("./Projectile/MegaMinion");
const Launrocket_1 = require("./Projectile/Launrocket");
const Boomerang_1 = require("./Projectile/Boomerang");
const AutoDrone_1 = require("./Projectile/AutoDrone");
const AutoTrap_1 = require("./Projectile/AutoTrap");
const NecromancerPenta_1 = require("./Projectile/NecromancerPenta");
const PentaDrone_1 = require("./Projectile/PentaDrone");
const NecromancerTriangle_1 = require("./Projectile/NecromancerTriangle");
const MegaSpinner_1 = require("./Projectile/MegaSpinner");
const Mine_1 = require("./Projectile/Mine");
const BombDrone_1 = require("./Projectile/BombDrone");
const Striker_1 = require("./Projectile/Striker");
const OrbitTrap_1 = require("./Projectile/OrbitTrap");
const Block_1 = require("./Projectile/Block");
const Explosion_1 = require("./Projectile/Explosion");
const NecromancerWepSquareAlt_1 = require("./Projectile/NecromancerWepSquareAlt");
const Seakingrocket_1 = require("./Projectile/Seakingrocket");
const Orbitrocket_1 = require("./Projectile/Orbitrocket");
const Bouncer_1 = require("./Projectile/Bouncer");
const Snake_1 = require("./Projectile/Snake");
const Grower_1 = require("./Projectile/Grower");
const AutoBullet_1 = require("./Projectile/AutoBullet");
const AutoRocket_1 = require("./Projectile/AutoRocket");
const ShotGun_1 = require("./Projectile/ShotGun");
const Leach_1 = require("./Projectile/Leach");
const Pulsar_1 = require("./Projectile/Pulsar");
const Pulserocket_1 = require("./Projectile/Pulserocket");
const AboveBullets_1 = require("./Projectile/AboveBullets");
const Multibox_1 = require("./Projectile/Multibox");
const Bees_1 = require("./Projectile/Bees");
const Bentbox_1 = require("./Projectile/Bentbox");
const Tool_1 = require("./Projectile/Tool");
const OrbitInverse_1 = require("./Projectile/OrbitInverse");
const CrackShot_1 = require("./Projectile/CrackShot");
const Vortex_1 = require("./Projectile/Vortex");
class ShootCycle {
    constructor(barrel) {
        this.barrelEntity = barrel;
        this.barrelEntity.barrelData.reloadTime = this.barrelEntity.tank.reloadTime * this.barrelEntity.definition.reload;
        this.reloadTime = this.pos = barrel.barrelData.values.reloadTime;
    }
    tick() {
        let reloadTime = this.barrelEntity.tank.reloadTime * this.barrelEntity.definition.reload;
        const reloadTimeAlt = 1500 * this.barrelEntity.definition.reload;
        const alwaysShoot = (this.barrelEntity.definition.forceFire) || this.barrelEntity.definition.bullet.type === 'ft' || this.barrelEntity.definition.bullet.type === 'os' || this.barrelEntity.definition.bullet.type === 'bentbox' || (this.barrelEntity.definition.bullet.type === 'multibox') || (this.barrelEntity.definition.bullet.type === 'dronenorep') || (this.barrelEntity.definition.bullet.type === 'bombdrone') || (this.barrelEntity.definition.bullet.type === 'autodrone') || (this.barrelEntity.definition.bullet.type === 'pentadrone') || (this.barrelEntity.definition.bullet.type === 'domminion') || (this.barrelEntity.definition.bullet.type === 'megaminion') || (this.barrelEntity.definition.bullet.type === 'miniminion') || (this.barrelEntity.definition.bullet.type === 'minion') || (this.barrelEntity.definition.bullet.type === 'drone') || (this.barrelEntity.definition.bullet.type === 'necrodrone') || (this.barrelEntity.definition.bullet.type === 'wepnecrodrone') || (this.barrelEntity.definition.bullet.type === 'necropentadrone') || (this.barrelEntity.definition.bullet.type === 'necrotriangledrone');
        const necroShoot = (this.barrelEntity.definition.bullet.type === 'necrodrone') || (this.barrelEntity.definition.bullet.type === 'wepnecrodrone') || (this.barrelEntity.definition.bullet.type === 'necropentadrone') || (this.barrelEntity.definition.bullet.type === 'necrotriangledrone');
        const Orbshot = (this.barrelEntity.definition.bullet.type === 'typhoon1' || this.barrelEntity.definition.bullet.type === 'orbit' || this.barrelEntity.definition.bullet.type === 'orbit2' || this.barrelEntity.definition.bullet.type === 'orbit3' || this.barrelEntity.definition.bullet.type === 'orbitrocket' || (this.barrelEntity.definition.bullet.type === 'orbittrap'));
        if (this.barrelEntity.definition.bullet.type === 'ft' || this.barrelEntity.definition.bullet.type === 'os' || this.barrelEntity.definition.bullet.type === 'bentbox' || this.barrelEntity.definition.bullet.type === 'bees' || this.barrelEntity.definition.bullet.type === 'multibox' || this.barrelEntity.definition.bullet.type === 'stupid') {
            reloadTime = 15 * this.barrelEntity.definition.reload;
        }
        if (this.barrelEntity.definition.bullet.type === 'bullets') {
            reloadTime = (this.barrelEntity.tank.reloadTime / this.barrelEntity.tank.reloadspeed) * this.barrelEntity.definition.reload;
        }
        if (reloadTime !== this.reloadTime) {
            this.pos *= reloadTime / this.reloadTime;
            this.reloadTime = reloadTime;
        }
        if (this.pos >= reloadTime) {
            if (!this.barrelEntity.attemptingShot && !alwaysShoot) {
                this.pos = reloadTime;
                return;
            }
            if (!necroShoot && typeof this.barrelEntity.definition.droneCount === 'number' && this.barrelEntity.droneCount >= this.barrelEntity.definition.droneCount) {
                this.pos = reloadTime;
                return;
            }
            if (Orbshot && typeof this.barrelEntity.tank.MAXORBS === 'number' && this.barrelEntity.tank.OrbCount >= this.barrelEntity.tank.MAXORBS) {
                this.pos = reloadTime;
                return;
            }
            if (this.barrelEntity.definition.bullet.type === 'orbitinv' && typeof this.barrelEntity.tank.MAXORBS === 'number' && this.barrelEntity.tank.OrbCount2 >= this.barrelEntity.tank.MAXORBS) {
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
exports.ShootCycle = ShootCycle;
class Barrel extends Object_1.default {
    constructor(owner, barrelDefinition) {
        super(owner.game);
        this.attemptingShot = false;
        this.bulletAccel = 20;
        this.droneCount = 0;
        this.addons = [];
        this.barrelData = new FieldGroups_1.BarrelGroup(this);
        this.tank = owner;
        this.definition = barrelDefinition;
        this.styleData.values.color = this.definition.color ?? 1;
        this.physicsData.values.sides = 2;
        if (barrelDefinition.isTrapezoid)
            this.physicsData.values.flags |= 1;
        this.setParent(owner);
        this.relationsData.values.owner = owner;
        this.relationsData.values.team = owner.relationsData.values.team;
        const sizeFactor = this.tank.sizeFactor;
        const size = this.physicsData.values.size = this.definition.size * sizeFactor;
        this.physicsData.values.width = this.definition.width * sizeFactor;
        this.positionData.values.angle = this.definition.angle + (this.definition.trapezoidDirection);
        this.positionData.values.x = Math.cos(this.definition.angle) * (size / 2 + (this.definition.distance || 0)) - Math.sin(this.definition.angle) * this.definition.offset * sizeFactor;
        this.positionData.values.y = Math.sin(this.definition.angle) * (size / 2 + (this.definition.distance || 0)) + Math.cos(this.definition.angle) * this.definition.offset * sizeFactor;
        if (barrelDefinition.addon) {
            const AddonConstructor = BarrelAddons_1.BarrelAddonById[barrelDefinition.addon];
            if (AddonConstructor)
                this.addons.push(new AddonConstructor(this));
        }
        this.barrelData.values.trapezoidDirection = barrelDefinition.trapezoidDirection;
        this.shootCycle = new ShootCycle(this);
        const iseffectedbyspeed = (this.definition.bullet.type === 'multibox' || this.definition.bullet.type === 'trapspinner' || this.definition.bullet.type === 'spinner' || this.definition.bullet.type === 'spinner4' || this.definition.bullet.type === 'megaspinner' || this.definition.bullet.type === 'conglom');
        if (!iseffectedbyspeed) {
            this.bulletAccel = (20 + (owner.cameraEntity.cameraData?.values.statLevels.values[4] || 0) * 3) * barrelDefinition.bullet.speed;
        }
        else {
            this.bulletAccel = (20 + (owner.cameraEntity.cameraData?.values.statLevels.values[4] || 0) * 3) * barrelDefinition.bullet.speed;
        }
    }
    shoot() {
        this.barrelData.flags ^= 1;
        const scatterAngle = (Math.PI / 180) * this.definition.bullet.scatterRate * (Math.random() - .5) * 10;
        let angle = this.definition.angle + scatterAngle + this.tank.positionData.values.angle;
        this.rootParent.addAcceleration(angle + Math.PI, this.definition.recoil * 2);
        let tankDefinition = null;
        if (this.rootParent instanceof TankBody_1.default)
            tankDefinition = this.rootParent.definition;
        switch (this.definition.bullet.type) {
            case "conglom":
                new Conglom_1.default(this, this.tank, tankDefinition, angle, this.tank.inputs.attemptingRepel() ? -Spinner_1.default.BASE_ROTATION : Spinner_1.default.BASE_ROTATION);
                break;
            case "spinner":
                new Spinner_1.default(this, this.tank, tankDefinition, angle, this.tank.inputs.attemptingRepel() ? -Spinner_1.default.BASE_ROTATION : Spinner_1.default.BASE_ROTATION);
                break;
            case "trapspinner":
                new Trapspin_1.default(this, this.tank, tankDefinition, angle, this.tank.inputs.attemptingRepel() ? -Spinner_1.default.BASE_ROTATION : Spinner_1.default.BASE_ROTATION);
                break;
            case "spinner4":
                new Spinner4_1.default(this, this.tank, tankDefinition, angle, this.tank.inputs.attemptingRepel() ? -Spinner_1.default.BASE_ROTATION : Spinner_1.default.BASE_ROTATION);
                break;
            case "megaspinner":
                new MegaSpinner_1.default(this, this.tank, tankDefinition, angle, this.tank.inputs.attemptingRepel() ? -Spinner_1.default.BASE_ROTATION : Spinner_1.default.BASE_ROTATION);
                break;
            case "rocket":
                new Rocket_1.default(this, this.tank, tankDefinition, angle);
                break;
            case "skimmer":
                new Skimmer_1.default(this, this.tank, tankDefinition, angle);
                break;
            case "snake":
                new Snake_1.default(this, this.tank, tankDefinition, angle, this.tank.inputs.attemptingRepel() ? 0 : 1);
                break;
            case 'bullet': {
                const bullet = new Bullet_1.default(this, this.tank, tankDefinition, angle, this.rootParent);
                if (tankDefinition && (tankDefinition.id === 105 || tankDefinition.id === -7))
                    bullet.positionData.flags |= 2;
                break;
            }
            case 'bullets': {
                const bullet = new Bullet_1.default(this, this.tank, tankDefinition, angle, this.rootParent);
                if (tankDefinition && (tankDefinition.id === 105 || tankDefinition.id === -7))
                    bullet.positionData.flags |= 2;
                break;
            }
            case 'pulsar': {
                new Pulsar_1.default(this, this.tank, tankDefinition, angle, this.definition.angle);
                break;
            }
            case 'leach': {
                const bullet = new Leach_1.default(this, this.tank, tankDefinition, angle, this.rootParent);
                break;
            }
            case 'autobullet': {
                const bullet = new AutoBullet_1.default(this, this.tank, tankDefinition, angle, this.rootParent);
                break;
            }
            case 'abovebullet': {
                const bullet = new AboveBullets_1.default(this, this.tank, tankDefinition, angle, this.rootParent);
                break;
            }
            case 'shotgun4': {
                for (let i = 0; i < 4; ++i) {
                    const scatterAngle = (Math.PI / 180) * this.definition.bullet.scatterRate * (Math.random() - .5) * 10;
                    const bullet = new ShotGun_1.default(this, this.tank, tankDefinition, this.definition.angle + scatterAngle + this.tank.positionData.values.angle);
                }
                break;
            }
            case 'shotgun4trap': {
                for (let i = 0; i < 4; ++i) {
                    const scatterAngle = (Math.PI / 180) * this.definition.bullet.scatterRate * (Math.random() - .5) * 10;
                    const bullet = new Trap_1.default(this, this.tank, tankDefinition, this.definition.angle + scatterAngle + this.tank.positionData.values.angle);
                    bullet.physicsData.size *= 1 + ((0.5 * Math.random()) - 0.25);
                    bullet.baseSpeed *= 1 + ((0.4 * Math.random()) - 0.2);
                    bullet.baseAccel *= 1 + ((0.5 * Math.random()) - 0.25);
                }
                break;
            }
            case 'shotgun3': {
                for (let i = 0; i < 3; ++i) {
                    const scatterAngle = (Math.PI / 180) * this.definition.bullet.scatterRate * (Math.random() - .5) * 10;
                    const bullet = new ShotGun_1.default(this, this.tank, tankDefinition, this.definition.angle + scatterAngle + this.tank.positionData.values.angle);
                }
                break;
            }
            case 'shotgun9': {
                for (let i = 0; i < 9; ++i) {
                    const scatterAngle = (Math.PI / 180) * this.definition.bullet.scatterRate * (Math.random() - .5) * 10;
                    const bullet = new ShotGun_1.default(this, this.tank, tankDefinition, this.definition.angle + scatterAngle + this.tank.positionData.values.angle);
                }
                break;
            }
            case 'shotgun20': {
                for (let i = 0; i < 28; ++i) {
                    const scatterAngle = (Math.PI / 180) * this.definition.bullet.scatterRate * (Math.random() - .5) * 10;
                    const bullet = new ShotGun_1.default(this, this.tank, tankDefinition, this.definition.angle + scatterAngle + this.tank.positionData.values.angle);
                }
                break;
            }
            case 'shotgun4blunt': {
                for (let i = 0; i < 4; ++i) {
                    const scatterAngle = (Math.PI / 180) * this.definition.bullet.scatterRate * (Math.random() - .5) * 10;
                    const bullet = new Blunt_1.default(this, this.tank, tankDefinition, this.definition.angle + scatterAngle + this.tank.positionData.values.angle);
                }
                break;
            }
            case 'streambullet': {
                const bullet = new Bullet_1.default(this, this.tank, tankDefinition, this.definition.angle + this.tank.positionData.values.angle);
                this.definition.bullet.scatterRate = 0;
                break;
            }
            case 'stupid': {
                const bullet = new Grower_1.default(this, this.tank, tankDefinition, this.definition.angle + this.tank.positionData.values.angle);
                this.definition.bullet.scatterRate = 0;
                break;
            }
            case 'trap':
                new Trap_1.default(this, this.tank, tankDefinition, angle, this.rootParent);
                break;
            case 'block':
                new Block_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'striker':
                new Striker_1.default(this, this.tank, tankDefinition, angle, this.rootParent);
                break;
            case 'mine':
                new Mine_1.default(this, this.tank, tankDefinition, angle, this.rootParent);
                break;
            case 'drone':
                new Drone_1.default(this, this.tank, tankDefinition, angle, true);
                break;
            case 'dronenorep':
                new Drone_1.default(this, this.tank, tankDefinition, angle, false);
                break;
            case 'bombdrone':
                new BombDrone_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'autodrone':
                new AutoDrone_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'orbit':
                new Orbit_1.default(this, this.tank, tankDefinition, angle, 0, this.rootParent);
                break;
            case 'orbitinv':
                new OrbitInverse_1.default(this, this.tank, tankDefinition, angle, 0, this.rootParent);
                break;
            case 'orbit2':
                new Orbit_1.default(this, this.tank, tankDefinition, Math.PI * (Math.random() - .5) * 10, 1, this.rootParent);
                break;
            case 'multibox':
                new Multibox_1.default(this, this.tank, tankDefinition, Math.PI * (Math.random() - .5) * 10, this.rootParent);
                break;
            case 'bentbox':
                new Bentbox_1.default(this, this.tank, tankDefinition, Math.PI * (Math.random() - .5) * 10, this.rootParent);
                break;
            case 'ft':
                new Tool_1.default(this, this.tank, tankDefinition, Math.PI * (Math.random() - .5) * 10, 1, this.rootParent);
                break;
            case 'os':
                new Tool_1.default(this, this.tank, tankDefinition, Math.PI * (Math.random() - .5) * 10, 0, this.rootParent);
                break;
            case 'bentbox':
                new Bentbox_1.default(this, this.tank, tankDefinition, Math.PI * (Math.random() - .5) * 10, this.rootParent);
                break;
            case 'bees':
                new Bees_1.default(this, this.tank, tankDefinition, Math.PI * (Math.random() - .5) * 10, this.rootParent);
                break;
            case 'orbit3':
                new Orbit_1.default(this, this.tank, tankDefinition, angle, 2, this.rootParent);
                break;
            case 'orbitrocket':
                new Orbitrocket_1.default(this, this.tank, tankDefinition, angle, 0, this.rootParent);
                break;
            case 'orbittrap':
                new OrbitTrap_1.default(this, this.tank, tankDefinition, angle, this.rootParent);
                break;
            case 'pentadrone':
                const pent = new PentaDrone_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'necrodrone':
                new NecromancerSquare_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'wepnecrodrone':
                new NecromancerWepSquareAlt_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'swarm':
                new Swarm_1.Swarm(this, this.tank, tankDefinition, angle);
                break;
            case 'autoswarm':
                new AutoSwarm_1.AutoSwarm(this, this.tank, tankDefinition, angle);
                break;
            case 'minion':
                new Minion_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'flame':
                new Flame_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'grower':
                new Grower_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'explosion':
                new Explosion_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'wall': {
                let w = new MazeWall_1.default(this.game, Math.round(this.tank.inputs.mouse.x / 50) * 50, Math.round(this.tank.inputs.mouse.y / 50) * 50, 250, 250);
                setTimeout(() => {
                    w.destroy();
                }, 60 * 1000);
                break;
            }
            case 'domminion':
                new DomMinion_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'miniminion':
                new MiniMinion_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'megaminion':
                new MegaMinion_1.default(this, this.tank, tankDefinition, angle);
                break;
            case "launrocket":
                new Launrocket_1.default(this, this.tank, tankDefinition, angle);
                break;
            case "pulserocket":
                new Pulserocket_1.default(this, this.tank, tankDefinition, angle);
                break;
            case "autorocket":
                new AutoRocket_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'boomerang':
                new Boomerang_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'bouncer':
                new Bouncer_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'autotrap':
                new AutoTrap_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'necropentadrone':
                new NecromancerPenta_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'hive':
                new Hive_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'necrotriangledrone':
                new NecromancerTriangle_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'tank':
                break;
            case 'blunt':
                new Blunt_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'vortex':
                new Vortex_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'homing':
                new CrackShot_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'homingrocket':
                new Seakingrocket_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'blunttrap':
                new BluntTrap_1.default(this, this.tank, tankDefinition, angle);
                break;
            case "croc":
                new CrocSkimmer_1.default(this, this.tank, tankDefinition, angle);
                break;
            default:
                util.log('Ignoring attempt to spawn projectile of type ' + this.definition.bullet.type);
                break;
        }
    }
    resize() {
        const sizeFactor = this.tank.sizeFactor;
        const size = this.physicsData.size = this.definition.size * sizeFactor;
        this.physicsData.width = this.definition.width * sizeFactor;
        this.positionData.angle = this.definition.angle + (this.definition.trapezoidDirection);
        if (this.definition.distance !== undefined) {
            this.positionData.x = Math.cos(this.definition.angle) * (size * this.definition.distance) - Math.sin(this.definition.angle) * this.definition.offset * sizeFactor;
            this.positionData.y = Math.sin(this.definition.angle) * (size * this.definition.distance) + Math.cos(this.definition.angle) * this.definition.offset * sizeFactor;
        }
        else {
            this.positionData.x = Math.cos(this.definition.angle) * (size / 2 + (this.definition.distance || 0)) - Math.sin(this.definition.angle) * this.definition.offset * sizeFactor;
            this.positionData.y = Math.sin(this.definition.angle) * (size / 2 + (this.definition.distance || 0)) + Math.cos(this.definition.angle) * this.definition.offset * sizeFactor;
        }
        const iseffectedbyspeed = (this.definition.bullet.type === 'ft' || this.definition.bullet.type === 'os' || this.definition.bullet.type === 'bentbox' || this.definition.bullet.type === 'bees' || this.definition.bullet.type === 'multibox' || this.definition.bullet.type === 'trapspinner' || this.definition.bullet.type === 'spinner' || this.definition.bullet.type === 'spinner4' || this.definition.bullet.type === 'megaspinner' || this.definition.bullet.type === 'conglom');
        if (!iseffectedbyspeed) {
            this.bulletAccel = (20 + (this.tank.cameraEntity.cameraData?.values.statLevels.values[4] || 0) * 3) * this.definition.bullet.speed;
        }
        else {
            this.bulletAccel = (20 + (this.tank.cameraEntity.cameraData?.values.statLevels.values[4] || 0) * 3) * this.definition.bullet.speed;
        }
    }
    tick(tick) {
        this.resize();
        this.relationsData.values.team = this.tank.relationsData.values.team;
        if (!this.tank.rootParent.deletionAnimation || this.definition.bulletdie) {
            this.attemptingShot = this.definition.inverseFire ? this.tank.inputs.attemptingRepel() : this.tank.inputs.attemptingShot();
            this.shootCycle.tick();
        }
        super.tick(tick);
    }
}
exports.default = Barrel;
