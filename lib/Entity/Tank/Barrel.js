"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShootCycle = void 0;
const util = require("../../util");
const Bullet_1 = require("./Projectile/Bullet");
const Trap_1 = require("./Projectile/Trap");
const Drone_1 = require("./Projectile/Drone");
const Rocket_1 = require("./Projectile/Rocket");
const Skimmer_1 = require("./Projectile/Skimmer");
const Spinner4_1 = require("./Projectile/Spinner4");
const Skimrocket_1 = require("./Projectile/Skimrocket");
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
const NecromancerSquare_1 = require("./Projectile/NecromancerSquare");
const MiniMinion_1 = require("./Projectile/MiniMinion");
const MegaMinion_1 = require("./Projectile/MegaMinion");
const Launrocket_1 = require("./Projectile/Launrocket");
const Drone2_1 = require("./Projectile/Drone2");
const AutoTrap_1 = require("./Projectile/AutoTrap");
const NecromancerPenta_1 = require("./Projectile/NecromancerPenta");
const PentaDrone_1 = require("./Projectile/PentaDrone");
const NecromancerTriangle_1 = require("./Projectile/NecromancerTriangle");
const MegaSpinner_1 = require("./Projectile/MegaSpinner");
class ShootCycle {
    constructor(barrel) {
        this.barrelEntity = barrel;
        this.barrelEntity.barrelData.reloadTime = this.barrelEntity.tank.reloadTime * this.barrelEntity.definition.reload;
        this.reloadTime = this.pos = barrel.barrelData.values.reloadTime;
    }
    tick() {
        const reloadTime = this.barrelEntity.tank.reloadTime * this.barrelEntity.definition.reload;
        if (reloadTime !== this.reloadTime) {
            this.pos *= reloadTime / this.reloadTime;
            this.reloadTime = reloadTime;
        }
        const alwaysShoot = (this.barrelEntity.definition.forceFire) || (this.barrelEntity.definition.bullet.type === 'pentadrone') || (this.barrelEntity.definition.bullet.type === 'domminion') || (this.barrelEntity.definition.bullet.type === 'megaminion') || (this.barrelEntity.definition.bullet.type === 'miniminion') || (this.barrelEntity.definition.bullet.type === 'minion') || (this.barrelEntity.definition.bullet.type === 'drone') || (this.barrelEntity.definition.bullet.type === 'necrodrone') || (this.barrelEntity.definition.bullet.type === 'necropentadrone') || (this.barrelEntity.definition.bullet.type === 'necrotriangledrone');
        if (this.pos >= reloadTime) {
            if (!this.barrelEntity.attemptingShot && !alwaysShoot) {
                this.pos = reloadTime;
                return;
            }
            if (typeof this.barrelEntity.definition.droneCount === 'number' && this.barrelEntity.droneCount >= this.barrelEntity.definition.droneCount) {
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
        this.styleData.values.color = 1;
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
        this.positionData.values.x = Math.cos(this.definition.angle) * size / 2 - Math.sin(this.definition.angle) * this.definition.offset * sizeFactor;
        this.positionData.values.y = Math.sin(this.definition.angle) * size / 2 + Math.cos(this.definition.angle) * this.definition.offset * sizeFactor;
        if (barrelDefinition.addon) {
            const AddonConstructor = BarrelAddons_1.BarrelAddonById[barrelDefinition.addon];
            if (AddonConstructor)
                this.addons.push(new AddonConstructor(this));
        }
        this.barrelData.values.trapezoidDirection = barrelDefinition.trapezoidDirection;
        this.shootCycle = new ShootCycle(this);
        const iseffectedbyspeed = (this.definition.bullet.type === 'spinner' || this.definition.bullet.type === 'spinner4' || this.definition.bullet.type === 'megaspinner');
        if (!iseffectedbyspeed) {
            this.bulletAccel = (20 + (owner.cameraEntity.cameraData?.values.statLevels.values[4] || 0) * 3) * barrelDefinition.bullet.speed;
        }
        else {
            this.bulletAccel = (20 * 3) * barrelDefinition.bullet.speed;
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
            case "spinner":
                new Skimmer_1.default(this, this.tank, tankDefinition, angle, this.tank.inputs.attemptingRepel() ? -Skimmer_1.default.BASE_ROTATION : Skimmer_1.default.BASE_ROTATION);
                break;
            case "spinner4":
                new Spinner4_1.default(this, this.tank, tankDefinition, angle, this.tank.inputs.attemptingRepel() ? -Skimmer_1.default.BASE_ROTATION : Skimmer_1.default.BASE_ROTATION);
                break;
            case "megaspinner":
                new MegaSpinner_1.default(this, this.tank, tankDefinition, angle, this.tank.inputs.attemptingRepel() ? -Skimmer_1.default.BASE_ROTATION : Skimmer_1.default.BASE_ROTATION);
                break;
            case "rocket":
                new Rocket_1.default(this, this.tank, tankDefinition, angle);
                break;
            case "skimmer":
                new Skimrocket_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'bullet': {
                const bullet = new Bullet_1.default(this, this.tank, tankDefinition, angle);
                if (tankDefinition && (tankDefinition.id === 105 || tankDefinition.id === -7))
                    bullet.positionData.flags |= 2;
                break;
            }
            case 'trap':
                new Trap_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'drone':
                new Drone_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'pentadrone':
                new PentaDrone_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'necrodrone':
                new NecromancerSquare_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'swarm':
                new Swarm_1.Swarm(this, this.tank, tankDefinition, angle);
                break;
            case 'minion':
                new Minion_1.default(this, this.tank, tankDefinition, angle);
                break;
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
            case 'drone2':
                new Drone2_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'autotrap':
                new AutoTrap_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'necropentadrone':
                new NecromancerPenta_1.default(this, this.tank, tankDefinition, angle);
                break;
            case 'necrotriangledrone':
                new NecromancerTriangle_1.default(this, this.tank, tankDefinition, angle);
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
        this.positionData.x = Math.cos(this.definition.angle) * size / 2 - Math.sin(this.definition.angle) * this.definition.offset * sizeFactor;
        this.positionData.y = Math.sin(this.definition.angle) * size / 2 + Math.cos(this.definition.angle) * this.definition.offset * sizeFactor;
        const iseffectedbyspeed = (this.definition.bullet.type === 'spinner' || this.definition.bullet.type === 'spinner4' || this.definition.bullet.type === 'megaspinner');
        if (!iseffectedbyspeed) {
            this.bulletAccel = (20 + (this.tank.cameraEntity.cameraData?.values.statLevels.values[4] || 0) * 3) * this.definition.bullet.speed;
        }
        else {
            this.bulletAccel = (20 * 3) * this.definition.bullet.speed;
        }
    }
    tick(tick) {
        this.resize();
        this.relationsData.values.team = this.tank.relationsData.values.team;
        if (!this.tank.rootParent.deletionAnimation) {
            this.attemptingShot = this.tank.inputs.attemptingShot();
            this.shootCycle.tick();
        }
        super.tick(tick);
    }
}
exports.default = Barrel;
