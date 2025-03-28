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
const Vector_1 = require("../../Physics/Vector");
const NecromancerWepSquareAlt_1 = require("./Projectile/NecromancerWepSquareAlt");
const RopeSegment_1 = require("./Projectile/RopeSegment");
const AbstractShape_1 = require("../Shape/AbstractShape");
class TankBody extends Live_1.default {
    constructor(game, camera, inputs, tank) {
        super(game);
        this.nameData = new FieldGroups_1.NameGroup(this);
        this.scoreData = new FieldGroups_1.ScoreGroup(this);
        this.barrels = [];
        this.addons = [];
        this._currentColor = 2;
        this.baseSize = 50;
        this.definition = (0, TankDefinitions_1.getTankById)(0);
        this.reloadTime = 15;
        this._currentTank = 0;
        this.isInvulnerable = false;
        this.coolDown = false;
        this.cameraEntity = camera;
        this.inputs = inputs;
        this.isAffectedByRope = false;
        this.length = 16;
        this.canchain = true;
        this.altTank = true;
        this.segments = [this];
        this.orbit = [];
        this.orbit2 = [];
        this.orbitinv = [];
        this.k = 0.25;
        this.physicsData.values.size = 50;
        this.physicsData.values.sides = 1;
        this.styleData.values.color = 2;
        this.relationsData.values.team = camera;
        this.relationsData.values.owner = camera;
        if (this.definition.flags.isCelestial) {
            this.physicsData.values.size *= 1.5;
            this.baseSize *= 1.5;
        }
        this.cameraEntity.cameraData.spawnTick = game.tick;
        this.cameraEntity.cameraData.flags |= 2;
        this.styleData.values.flags |= 4;
        this.damageReduction = 0;
        if (this.game.playersOnMap)
            this.physicsData.values.flags |= 2;
        this.damagePerTick = 20;
        this.setTank(tank || 0);
        this.aura = null;
        this.hasAura = false;
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
        if (this.definition.flags.isCelestial) {
            this.physicsData.values.size *= 1.5;
            this.baseSize *= 1.5;
            camera.maxlevel = 90;
        }
        else {
            camera.maxlevel = this.game.arena.maxtanklevel;
        }
        this.baseSize = tank.baseSizeOverride ?? tank.sides === 4 ? Math.SQRT2 * 32.5 : tank.sides === 3 ? Math.SQRT2 * 42.5 : tank.sides === 5 ? Math.SQRT2 * 30 : tank.sides === 16 ? Math.SQRT2 * 25 : this.definition.flags.isCelestial ? Math.SQRT2 * 47.5 : 50;
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
        if (entity instanceof TankBody) {
            this.scoreData.score = this.cameraEntity.cameraData.score += entity.cameraEntity.cameraData.score / 2;
        }
        else {
            this.scoreData.score = this.cameraEntity.cameraData.score += entity.scoreReward;
        }
        if (entity instanceof TankBody && entity.scoreReward || entity instanceof AbstractBoss_1.default) {
            if (this.cameraEntity instanceof Camera_1.default)
                this.cameraEntity.client.notify("You've killed " + (entity.nameData.values.name || "an unnamed tank"));
        }
        if (entity instanceof Triangle_1.default && this.definition.flags.canClaimTriangles && this.barrels.length) {
            const barrelsToShoot = this.barrels.filter((e) => e.definition.bullet.type === "necrotriangledrone" && this.DroneCount < this.MAXDRONES);
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
            const barrelsToShoot = this.barrels.filter((e) => e.definition.bullet.type === "necropentadrone" && this.DroneCount < this.MAXDRONES);
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
                const barrelsToShoot = this.barrels.filter((e) => e.definition.bullet.type === "necrodrone" && this.DroneCount < this.MAXDRONES);
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
        if (entity instanceof Square_1.default && this.definition.flags.canClaimSquareswep && this.barrels.length) {
            if (entity instanceof WepSquare_1.default) {
            }
            else {
                const barrelsToShoot = this.barrels.filter((e) => e.definition.bullet.type === "wepnecrodrone" && this.DroneCount < this.MAXDRONES);
                if (barrelsToShoot.length) {
                    const barrelToShoot = barrelsToShoot[~~(Math.random() * barrelsToShoot.length)];
                    entity.destroy(true);
                    if (entity.deletionAnimation) {
                        entity.deletionAnimation.frame = 0;
                        entity.styleData.opacity = 1;
                    }
                    const sunchip = NecromancerWepSquareAlt_1.default.fromShape(barrelToShoot, this, this.definition, entity);
                }
            }
        }
        if (entity instanceof Square_1.default && this.definition.flags.canClaimSquares2 && this.barrels.length) {
            if (entity instanceof WepSquare_1.default) {
            }
            else {
                const barrelsToShoot = this.barrels.filter((e) => e.definition.bullet.type === "necrodrone" && this.DroneCount < this.MAXDRONES);
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
    setSpawnProt() {
        this.styleData.flags |= 4;
        this.damageReduction = 0;
        this.cameraEntity.cameraData.spawnTick = this.game.tick;
    }
    Accend() {
        this.damageReduction = 0;
        this.cameraEntity.cameraData.spawnTick = 0;
        for (let i = 0; i < Enums_1.StatCount; ++i)
            this.cameraEntity.cameraData.statLevels[i] = 0;
        this.cameraEntity.cameraData.statsAvailable += 35;
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
                this.cameraEntity.cameraData.respawnLevel = this.cameraEntity.cameraData.score / 2;
                if (this.cameraEntity instanceof Camera_1.default) {
                    this.cameraEntity.cameraData.isCelestial = false;
                }
            }
            this.barrels = [];
            this.addons = [];
        }
        this.segments.forEach(segment => {
            if (segment instanceof RopeSegment_1.default)
                segment.destroy();
        });
        super.destroy(animate);
    }
    tick(tick) {
        if (this.definition.sides === 2) {
            this.physicsData.width = this.physicsData.size * (this.definition.widthRatio ?? 1);
            if (this.definition.flags.displayAsTrapezoid === true)
                this.physicsData.flags |= 1;
        }
        else if (this.definition.flags.displayAsStar === true)
            this.styleData.flags |= 16;
        this.MAXORBS = this.definition.maxorbs;
        if (this.inputs.attemptingShot()) {
            this.forcemulti = 2;
        }
        else if (this.inputs.attemptingRepel()) {
            this.forcemulti = 0.5;
        }
        else {
            this.forcemulti = 1;
        }
        this.positionData.angle = Math.atan2(this.inputs.mouse.y - this.positionData.values.y, this.inputs.mouse.x - this.positionData.values.x);
        if (this.canchain == true && this.definition.flags.canChain) {
            this.canchain = false;
            for (let i = 0; i < this.length; i++) {
                const ropeSegment = new RopeSegment_1.default(this);
                ropeSegment.styleData.color = 1;
                ropeSegment.relationsData.owner = this;
                ropeSegment.seg = i;
                ropeSegment.styleData.values.zIndex = this.styleData.zIndex - i;
                if (i == this.length - 1) {
                    ropeSegment.IsBig = true;
                    ropeSegment.styleData.values.zIndex = this.styleData.zIndex - 1;
                }
                this.segments.push(ropeSegment);
            }
        }
        if (this._currentTank == 264) {
            if (this.healthData.health > 0) {
                const collidedEntities = this.findCollisions();
                for (let i = 0; i < collidedEntities.length; ++i) {
                    if (collidedEntities[i] instanceof TankBody || collidedEntities[i] instanceof AbstractShape_1.default || collidedEntities[i] instanceof AbstractBoss_1.default) {
                        this.healthData.health += this.damagePerTick / 12 * (1 + (this.cameraEntity.cameraData.values.statLevels.values[7] / 10));
                    }
                }
            }
        }
        if (this._currentTank == 221) {
            this.baseSize = (25 - (12.5 / 10 * this.cameraEntity.cameraData.values.statLevels.values[1])) * Math.SQRT2;
        }
        if (this._currentTank == 34 || this._currentTank == 33 || this._currentTank == 215 || this._currentTank == 86 || this._currentTank == 88 || this._currentTank == 14) {
        }
        else {
            this.altTank = true;
        }
        if (this._currentTank == 14) {
            if (this.altTank && Math.random() <= 0.01) {
                this.setTank(271);
            }
            this.altTank = false;
        }
        if (this._currentTank == 86 || this._currentTank == 88) {
            if (this.altTank && Math.random() <= 0.002) {
                this.setTank(255);
            }
            this.altTank = false;
        }
        if (this._currentTank == 34) {
            if (this.altTank && Math.random() <= 0.1) {
                this.setTank(242);
            }
            this.altTank = false;
        }
        if (this._currentTank == 33) {
            if (this.altTank && Math.random() <= 0.05) {
                this.setTank(130);
            }
            this.altTank = false;
        }
        if (this._currentTank == 215) {
            if (this.altTank && Math.random() <= 0.05) {
                this.setTank(146);
            }
            this.altTank = false;
        }
        if (this._currentTank !== 174) {
            this.canchain = true;
            this.isAffectedByRope = false;
            this.segments.forEach(segment => {
                if (segment instanceof RopeSegment_1.default)
                    segment.destroy();
            });
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
            if (!this.definition.flags.isCelestial) {
                if (this._currentTank == 277) {
                    this.baseSize = (50 * (1.2 + (0.8 / 10 * this.cameraEntity.cameraData.values.statLevels.values[5])));
                }
                if (this._currentTank == 283 || this._currentTank == 285 || this._currentTank == 286 || this._currentTank == 287) {
                    this.baseSize = 37.5;
                }
                if (this._currentTank == 284) {
                    this.baseSize = 25;
                }
                if ((this.styleData.values.flags & 4)) {
                    this.damagePerTick = 0;
                }
                else {
                    this.damagePerTick = this.cameraEntity.cameraData.statLevels[5] * 6 + 20;
                }
                if (this._currentTank === 86)
                    this.damagePerTick *= 1.5;
                if (this._currentTank === 277)
                    this.damagePerTick *= 1.5;
                if (this._currentTank === 255)
                    this.damagePerTick *= 2;
                if (this._currentTank === 276)
                    this.damagePerTick *= 0.25;
                if (this._currentTank === 174)
                    this.damagePerTick *= 0.9;
                if (this._currentTank === 144)
                    this.damagePerTick *= 0.625;
                if (this._currentTank === 144)
                    this.damageReduction = 0.625;
                if (this._currentTank === 77 || this._currentTank === 32 || this._currentTank === 164)
                    this.MAXDRONES = 11 + this.cameraEntity.cameraData.values.statLevels.values[1];
                if (this._currentTank === 72)
                    this.MAXDRONES = 22 + (this.cameraEntity.cameraData.values.statLevels.values[1] * 2);
                if (this._currentTank === 229)
                    this.MAXDRONES = 44 + (this.cameraEntity.cameraData.values.statLevels.values[1] * 4);
                if (this._currentTank === 128)
                    this.MAXDRONES = (11 + this.cameraEntity.cameraData.values.statLevels.values[1]) * 0.5;
                if (this._currentTank === 195)
                    this.MAXDRONES = (11 + this.cameraEntity.cameraData.values.statLevels.values[1]) * 0.75;
                if (this._currentTank === 101)
                    this.MAXDRONES = 10 + (this.cameraEntity.cameraData.values.statLevels.values[1] / 2);
                if (this._currentTank === 100)
                    this.MAXDRONES = 5;
                const maxHealthCache = this.healthData.values.maxHealth;
                if (this._currentTank === 87) {
                    this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[6]) * 20 * 1.5;
                }
                else if (this._currentTank === 276) {
                    this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[6]) * 20 * 4;
                }
                else if (this._currentTank === 277) {
                    this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[6]) * 20 * 1.5;
                }
                else if (this._currentTank === 88) {
                    this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[6]) * 20 * 0.75;
                }
                else if (this._currentTank === 221) {
                    this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[6]) * 20 * 0.75;
                }
                else if (this._currentTank === 255) {
                    this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[6]) * 20 * 0.2;
                }
                else if (this._currentTank === 90) {
                    this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[6]) * 20 * 1.1;
                }
                else {
                    this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + this.cameraEntity.cameraData.values.statLevels.values[6] * 20;
                }
                if (this.healthData.values.health === maxHealthCache)
                    this.healthData.health = this.healthData.maxHealth;
                else if (this.healthData.values.maxHealth !== maxHealthCache) {
                    this.healthData.health *= this.healthData.values.maxHealth / maxHealthCache;
                }
                this.regenPerTick = (this.healthData.values.maxHealth * 4 * (this.cameraEntity.cameraData.values.statLevels.values[7]) + this.healthData.values.maxHealth) / 25000;
                if (this._currentTank === 87)
                    this.regenPerTick *= 1.25;
                if (this._currentTank === 261)
                    this.regenPerTick *= 0.25;
                if (this._currentTank === 262)
                    this.regenPerTick *= 0.25;
                if (this._currentTank === 263)
                    this.regenPerTick *= 0.25;
                if (this._currentTank === 265)
                    this.regenPerTick *= 0.25;
                if (this._currentTank === 264)
                    this.regenPerTick *= 0.25;
                if (this._currentTank === 144) {
                    this.physicsData.pushFactor = 60;
                }
                else {
                    this.physicsData.pushFactor = 8;
                }
                if (this._currentTank == 289) {
                    if (this.inputs.attemptingShot()) {
                        if (this.reloadspeed > 0.25)
                            this.reloadspeed -= 0.0025;
                        if (this.reloadspeed < 0.25)
                            this.reloadspeed = 0.25;
                    }
                    if (!this.inputs.attemptingShot()) {
                        if (this.reloadspeed < 1)
                            this.reloadspeed += 0.025;
                        if (this.reloadspeed > 1)
                            this.reloadspeed = 1;
                    }
                    this.reloadTime = 15 * Math.pow(0.914, this.cameraEntity.cameraData.values.statLevels.values[1]) * this.reloadspeed;
                }
                else {
                    this.reloadTime = 15 * Math.pow(0.914, this.cameraEntity.cameraData.values.statLevels.values[1]);
                }
            }
            else {
                if ((this.styleData.values.flags & 4)) {
                    this.damagePerTick = 0;
                }
                else {
                    this.damagePerTick = this.cameraEntity.cameraData.statLevels[5] * 9 + 30;
                }
                if (this._currentTank === 205)
                    this.damagePerTick *= 1.5;
                if (this._currentTank === 282)
                    this.damagePerTick *= 0.25;
                const maxHealthCache = this.healthData.values.maxHealth;
                if (this._currentTank === 207)
                    this.regenPerTick *= 1.25;
                if (this._currentTank === 204 || this._currentTank === 205 || this._currentTank == 206 || this._currentTank === 282)
                    this.regenPerTick *= 0.75;
                if (this._currentTank === 207) {
                    this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[6] * 1.5) * 50;
                }
                else if (this._currentTank === 206) {
                    this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[6]) * 25;
                }
                else if (this._currentTank === 282) {
                    this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[6]) * 140;
                }
                else if (this._currentTank === 205 || this._currentTank === 204) {
                    this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[6]) * 35;
                }
                else {
                    this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + this.cameraEntity.cameraData.values.statLevels.values[6] * 40;
                }
                if (this.healthData.values.health === maxHealthCache)
                    this.healthData.health = this.healthData.maxHealth;
                else if (this.healthData.values.maxHealth !== maxHealthCache) {
                    this.healthData.health *= this.healthData.values.maxHealth / maxHealthCache;
                }
                this.regenPerTick = (this.healthData.values.maxHealth * 2 * (this.cameraEntity.cameraData.values.statLevels.values[7]) + this.healthData.values.maxHealth) / 25000;
                this.reloadTime = 15 * Math.pow(0.914, this.cameraEntity.cameraData.values.statLevels.values[1]);
            }
            this.scoreData.score = this.cameraEntity.cameraData.values.score;
            if ((this.styleData.values.flags & 4) && (this.game.tick >= this.cameraEntity.cameraData.values.spawnTick + 374 || this.inputs.attemptingShot() && this._currentTank != 294)) {
                this.styleData.flags ^= 4;
                this.damageReduction = 1.0;
            }
        }
        this.accel.add({
            x: this.inputs.movement.x * this.cameraEntity.cameraData.values.movementSpeed,
            y: this.inputs.movement.y * this.cameraEntity.cameraData.values.movementSpeed
        });
        this.inputs.movement.set({
            x: 0,
            y: 0
        });
        for (let i = 0; i < this.orbit.length; i++)
            this.orbit[i].num = i;
        for (let i = 0; i < this.orbit2.length; i++)
            this.orbit2[i].num = i;
        for (let i = 0; i < this.orbitinv.length; i++)
            this.orbitinv[i].num = i;
        for (let i = 1; i < this.segments.length; i++) {
            const a = this.segments[i - 1];
            const b = this.segments[i];
            const delta = new Vector_1.default(a.positionData.values.x - b.positionData.values.x, a.positionData.values.y - b.positionData.values.y);
            const x = delta.magnitude - Math.max(a.restLength, b.restLength);
            let force = delta.unitVector.scale(-this.k * x);
            if (a.isAffectedByRope)
                a.addAcceleration(force.angle, force.magnitude * this.forcemulti, false);
            force = force.scale(-1);
            if (b.isAffectedByRope)
                b.addAcceleration(force.angle, force.magnitude * this.forcemulti, false);
        }
    }
}
exports.default = TankBody;
