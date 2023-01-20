"use strict";
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
const NecromancerPenta_1 = require("./Projectile/NecromancerPenta");
const Pentagon_1 = require("../Shape/Pentagon");
const NecromancerTriangle_1 = require("./Projectile/NecromancerTriangle");
const Triangle_1 = require("../Shape/Triangle");
const WepSquare_1 = require("../Shape/WepSquare");
const config_1 = require("../../config");
class TankBody extends Live_1.default {
    constructor(game, camera, inputs) {
        super(game);
        this.nameData = new FieldGroups_1.NameGroup(this);
        this.scoreData = new FieldGroups_1.ScoreGroup(this);
        this.barrels = [];
        this.addons = [];
        this.baseSize = 50;
        this.definition = (0, TankDefinitions_1.getTankById)(0);
        this.reloadTime = 15;
        this._currentTank = 0;
        this.isInvulnerable = false;
        this.cameraEntity = camera;
        this.inputs = inputs;
        this.physicsData.values.size = 50;
        this.physicsData.values.sides = 1;
        this.styleData.values.color = 2;
        this.relationsData.values.team = camera;
        this.relationsData.values.owner = camera;
        this.cameraEntity.cameraData.spawnTick = game.tick;
        this.cameraEntity.cameraData.flags |= 2;
        this.styleData.values.flags |= 4;
        this.damageReduction = 0;
        if (this.game.playersOnMap)
            this.physicsData.values.flags |= 2;
        this.damagePerTick = 20;
        this.setTank(0);
    }
    get sizeFactor() {
        return this.physicsData.values.size / this.baseSize;
    }
    get currentTank() {
        return this._currentTank;
    }
    setTank(id) {
        for (let i = 0; i < this.children.length; ++i) {
            this.children[i].isChild = false;
            this.children[i].delete();
        }
        this.children = [];
        this.barrels = [];
        this.addons = [];
        const tank = (0, TankDefinitions_1.getTankById)(id);
        const camera = this.cameraEntity;
        if (!tank)
            throw new TypeError("Invalid tank ID");
        this.definition = tank;
        if (!Entity_1.Entity.exists(camera))
            throw new Error("No camera");
        this.physicsData.sides = tank.sides;
        this.styleData.opacity = 1;
        for (let i = 0; i < Enums_1.StatCount; ++i) {
            const { name, max } = tank.stats[i];
            camera.cameraData.statLimits[i] = max;
            camera.cameraData.statNames[i] = name;
            if (camera.cameraData.statLevels[i] > max) {
                camera.cameraData.statsAvailable += (camera.cameraData.statLevels[i] - (camera.cameraData.statLevels[i] = max));
            }
        }
        this.baseSize = tank.sides === 4 ? Math.SQRT2 * 32.5 : tank.sides === 16 ? Math.SQRT2 * 25 : 50;
        this.physicsData.absorbtionFactor = this.isInvulnerable ? 0 : tank.absorbtionFactor;
        if (tank.absorbtionFactor === 0)
            this.positionData.flags |= 2;
        else if (this.positionData.flags & 2)
            this.positionData.flags ^= 2;
        camera.cameraData.tank = this._currentTank = id;
        if (tank.upgradeMessage && camera instanceof Camera_1.default)
            camera.client.notify(tank.upgradeMessage);
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
        this.cameraEntity.cameraData.tankOverride = tank.name;
        camera.setFieldFactor(tank.fieldFactor);
    }
    onKill(entity) {
        this.scoreData.score = this.cameraEntity.cameraData.score += entity.scoreReward;
        if (entity instanceof TankBody && entity.scoreReward && Math.max(this.cameraEntity.cameraData.values.level, config_1.maxPlayerLevel) - entity.cameraEntity.cameraData.values.level <= 20 || entity instanceof AbstractBoss_1.default) {
            if (this.cameraEntity instanceof Camera_1.default)
                this.cameraEntity.client.notify("You've killed " + (entity.nameData.values.name || "an unnamed tank"));
        }
        if (entity instanceof Triangle_1.default && this.definition.flags.canClaimTriangles && this.barrels.length) {
            const MAX_DRONES_PER_BARREL = 2 + (this.cameraEntity.cameraData.values.statLevels.values[1] / 1.85);
            const barrelsToShoot = this.barrels.filter((e) => e.definition.bullet.type === "necrotriangledrone" && e.droneCount < MAX_DRONES_PER_BARREL);
            if (barrelsToShoot.length) {
                const barrelToShoot = barrelsToShoot[~~(Math.random() * barrelsToShoot.length)];
                entity.destroy(true);
                if (entity.deletionAnimation) {
                    entity.deletionAnimation.frame = 0;
                    entity.styleData.opacity = 1;
                }
                const dorito = NecromancerTriangle_1.default.fromShape(barrelToShoot, this, this.definition, entity);
            }
        }
        if (entity instanceof Pentagon_1.default && this.definition.flags.canClaimPentagons && this.barrels.length) {
            const MAX_DRONES_PER_BARREL = 5;
            const barrelsToShoot = this.barrels.filter((e) => e.definition.bullet.type === "necropentadrone" && e.droneCount < MAX_DRONES_PER_BARREL);
            if (barrelsToShoot.length) {
                const barrelToShoot = barrelsToShoot[~~(Math.random() * barrelsToShoot.length)];
                entity.destroy(true);
                if (entity.deletionAnimation) {
                    entity.deletionAnimation.frame = 0;
                    entity.styleData.opacity = 1;
                }
                const chip = NecromancerPenta_1.default.fromShape(barrelToShoot, this, this.definition, entity);
            }
        }
        if (entity instanceof Square_1.default && this.definition.flags.canClaimSquares && this.barrels.length) {
            if (entity instanceof WepSquare_1.default) {
            }
            else {
                const MAX_DRONES_PER_BARREL = 9 + this.cameraEntity.cameraData.values.statLevels.values[1];
                const barrelsToShoot = this.barrels.filter((e) => e.definition.bullet.type === "necrodrone" && e.droneCount < MAX_DRONES_PER_BARREL);
                if (barrelsToShoot.length) {
                    const barrelToShoot = barrelsToShoot[~~(Math.random() * barrelsToShoot.length)];
                    entity.destroy(true);
                    if (entity.deletionAnimation) {
                        entity.deletionAnimation.frame = 0;
                        entity.styleData.opacity = 1;
                    }
                    const sunchip = NecromancerSquare_1.default.fromShape(barrelToShoot, this, this.definition, entity);
                }
            }
        }
        if (entity instanceof Square_1.default && this.definition.flags.canClaimSquares2 && this.barrels.length) {
            if (entity instanceof WepSquare_1.default) {
            }
            else {
                const MAX_DRONES_PER_BARREL2 = 4 + (this.cameraEntity.cameraData.values.statLevels.values[1] * 0.5);
                const barrelsToShoot = this.barrels.filter((e) => e.definition.bullet.type === "necrodrone" && e.droneCount < MAX_DRONES_PER_BARREL2);
                if (barrelsToShoot.length) {
                    const barrelToShoot = barrelsToShoot[~~(Math.random() * barrelsToShoot.length)];
                    entity.destroy(true);
                    if (entity.deletionAnimation) {
                        entity.deletionAnimation.frame = 0;
                        entity.styleData.opacity = 1;
                    }
                    const sunchip = NecromancerSquare_1.default.fromShape(barrelToShoot, this, this.definition, entity);
                }
            }
        }
    }
    setInvulnerability(invulnerable) {
        if (this.styleData.flags & 4)
            this.styleData.flags ^= 4;
        if (this.isInvulnerable === invulnerable)
            return;
        if (invulnerable) {
            this.damageReduction = 0.0;
            this.physicsData.absorbtionFactor = 0.0;
        }
        else {
            this.damageReduction = 1.0;
            this.physicsData.absorbtionFactor = this.definition.absorbtionFactor;
        }
        this.isInvulnerable = invulnerable;
    }
    onDeath(killer) {
        if (!(this.cameraEntity instanceof Camera_1.default))
            return this.cameraEntity.delete();
        if (!(this.cameraEntity.cameraData.player === this))
            return;
        this.cameraEntity.spectatee = killer;
        this.cameraEntity.cameraData.FOV = 0.4;
        this.cameraEntity.cameraData.killedBy = (killer.nameData && killer.nameData.values.name) || "";
    }
    destroy(animate = true) {
        if (!animate && Entity_1.Entity.exists(this.cameraEntity)) {
            if (this.cameraEntity.cameraData.player === this) {
                this.cameraEntity.cameraData.deathTick = this.game.tick;
                this.cameraEntity.cameraData.respawnLevel = Math.min(Math.max(this.cameraEntity.cameraData.values.level - 1, 1), Math.floor(Math.sqrt(this.cameraEntity.cameraData.values.level) * 3.2796));
            }
            this.barrels = [];
            this.addons = [];
        }
        super.destroy(animate);
    }
    tick(tick) {
        this.positionData.angle = Math.atan2(this.inputs.mouse.y - this.positionData.values.y, this.inputs.mouse.x - this.positionData.values.x);
        if (this.isInvulnerable) {
            if (this.game.clients.size !== 1 || this.game.arena.state !== 0) {
                if (this.cameraEntity instanceof Camera_1.default)
                    this.setInvulnerability(false);
            }
        }
        if (!this.deletionAnimation && !this.inputs.deleted)
            this.physicsData.size = this.baseSize * this.cameraEntity.sizeFactor;
        else
            this.regenPerTick = 0;
        super.tick(tick);
        if (this.deletionAnimation)
            return;
        if (this.inputs.deleted) {
            if (this.cameraEntity.cameraData.values.level <= 5)
                return this.destroy();
            this.lastDamageTick = tick;
            this.healthData.health -= 2 + this.healthData.values.maxHealth / 500;
            if (this.isInvulnerable)
                this.setInvulnerability(false);
            if (this.styleData.values.flags & 4) {
                this.styleData.flags ^= 4;
                this.damageReduction = 1.0;
            }
            return;
        }
        if (this.definition.flags.zoomAbility && (this.inputs.flags & 128)) {
            if (!(this.cameraEntity.cameraData.values.flags & 1)) {
                const angle = Math.atan2(this.inputs.mouse.y - this.positionData.values.y, this.inputs.mouse.x - this.positionData.values.x);
                this.cameraEntity.cameraData.cameraX = Math.cos(angle) * 1000 + this.positionData.values.x;
                this.cameraEntity.cameraData.cameraY = Math.sin(angle) * 1000 + this.positionData.values.y;
                this.cameraEntity.cameraData.flags |= 1;
            }
        }
        else if (this.cameraEntity.cameraData.values.flags & 1)
            this.cameraEntity.cameraData.flags ^= 1;
        if (this.definition.flags.invisibility) {
            if (this.inputs.flags & 1)
                this.styleData.opacity += this.definition.visibilityRateShooting;
            if (this.inputs.flags & (2 | 8 | 4 | 16) || this.inputs.movement.x || this.inputs.movement.y)
                this.styleData.opacity += this.definition.visibilityRateMoving;
            this.styleData.opacity -= this.definition.invisibilityRate;
            this.styleData.opacity = util.constrain(this.styleData.values.opacity, 0, 1);
        }
        updateStats: {
            this.damagePerTick = this.cameraEntity.cameraData.statLevels[5] * 6 + 20;
            if (this._currentTank === 86)
                this.damagePerTick *= 1.5;
            if (this._currentTank === 88)
                this.damagePerTick *= 1.1;
            if (this._currentTank === 90)
                this.damagePerTick *= 1.1;
            if (this._currentTank === 144)
                this.damagePerTick *= 0.375;
            if (this._currentTank === 144)
                this.damageReduction = 0.375;
            const maxHealthCache = this.healthData.values.maxHealth;
            if (this._currentTank === 87) {
                this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[6] * 1.5) * 20;
            }
            else if (this._currentTank === 88) {
                this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[6]) * 15;
            }
            else if (this._currentTank === 90) {
                this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[6]) * 22;
            }
            else {
                this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + this.cameraEntity.cameraData.values.statLevels.values[6] * 20;
            }
            if (this.healthData.values.health === maxHealthCache)
                this.healthData.health = this.healthData.maxHealth;
            else if (this.healthData.values.maxHealth !== maxHealthCache) {
                this.healthData.health *= this.healthData.values.maxHealth / maxHealthCache;
            }
            this.regenPerTick = (this.healthData.values.maxHealth * 4 * (this.cameraEntity.cameraData.values.statLevels.values[7] * 1.25) + this.healthData.values.maxHealth) / 25000;
            if (this._currentTank === 87)
                this.regenPerTick *= 1.25;
            if (this._currentTank === 144) {
                this.physicsData.pushFactor = 100;
            }
            else {
                this.physicsData.pushFactor = 8;
            }
            this.reloadTime = 15 * Math.pow(0.914, this.cameraEntity.cameraData.values.statLevels.values[1]);
        }
        this.scoreData.score = this.cameraEntity.cameraData.values.score;
        if ((this.styleData.values.flags & 4) && (this.game.tick >= this.cameraEntity.cameraData.values.spawnTick + 374 || this.inputs.attemptingShot() || this.inputs.movement.magnitude > 0)) {
            this.styleData.flags ^= 4;
            this.damageReduction = 1.0;
        }
        this.accel.add({
            x: this.inputs.movement.x * this.cameraEntity.cameraData.values.movementSpeed,
            y: this.inputs.movement.y * this.cameraEntity.cameraData.values.movementSpeed
        });
        this.inputs.movement.set({
            x: 0,
            y: 0
        });
    }
}
exports.default = TankBody;
