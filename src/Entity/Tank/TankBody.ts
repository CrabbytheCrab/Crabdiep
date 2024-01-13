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

import Square from "../Shape/Square";
import NecromancerSquare from "./Projectile/NecromancerSquare";
import GameServer from "../../Game";
import ClientCamera, { CameraEntity } from "../../Native/Camera";
import LivingEntity from "../Live";
import ObjectEntity from "../Object";
import Barrel from "./Barrel";

import { Color, StyleFlags, StatCount, Tank, CameraFlags, Stat, InputFlags, PhysicsFlags, PositionFlags } from "../../Const/Enums";
import { Entity } from "../../Native/Entity";
import { CameraTable, NameGroup, ScoreGroup } from "../../Native/FieldGroups";
import { Addon, AddonById } from "./Addons";
import { getTankById, TankDefinition } from "../../Const/TankDefinitions";
import { DevTank } from "../../Const/DevTankDefinitions";
import { Inputs } from "../AI";
import AbstractBoss from "../Boss/AbstractBoss";
import { ArenaState } from "../../Native/Arena";
import NecromancerPentagon from "./Projectile/NecromancerPenta";
import Pentagon from "../Shape/Pentagon";
import NecromancerTriangle from "./Projectile/NecromancerTriangle";
import Triangle from "../Shape/Triangle";
import WepSquare from "../Shape/WepSquare";
import { maxPlayerLevel } from "../../config";
import Vector from "../../Physics/Vector";
import NecromancerWepSquare from "./Projectile/NecromancerWepSquareAlt";
import RopeSegment from "./Projectile/RopeSegment";
import AbstractShape from "../Shape/AbstractShape";
import Orbit from "./Projectile/Orbit";
import OrbitTrap from "./Projectile/OrbitTrap";
import OrbitInverse from "./Projectile/OrbitInverse";
import Aura from "../Misc/Aura";

/**
 * Abstract type of entity which barrels can connect to.
 * - `sizeFactor` is required and must be a `number`
 * - `cameraEntity` is required and must be a `Camera`
 */
export type BarrelBase = ObjectEntity & { sizeFactor: number, cameraEntity: Entity, reloadTime: number, inputs: Inputs };

/**
 * The Tank Body, which could also be called the Player class, converts defined
 * tank data into diep entities. Controls speeds, barrels, addons, and names.
 * Created for each spawn.
 */
export default class TankBody extends LivingEntity implements BarrelBase {
    /** Always existant name field group, present on all tanks. */
    public nameData: NameGroup = new NameGroup(this);
    /** Always existant score field group, present on all tanks. */
    public scoreData: ScoreGroup = new ScoreGroup(this);

    /** The camera entity which stores stats and level data about the tank. */
    public cameraEntity: CameraEntity;
    /** The inputs of the client, lets the barrels know when to shoot etc. */
    public inputs: Inputs;
public canchain: boolean
public altTank: boolean
    /** The tank's barrels, if any. */
    public barrels: Barrel[] = [];
    /** The tank's addons, if any. */
    private addons: Addon[] = [];
    private _currentColor: Color = Color.Tank;
    /** Size of the tank at level 1. Defined by tank loader.  */
    public baseSize = 50;
    /** The definition of the currentTank */
    public definition: TankDefinition = getTankById(Tank.Basic) as TankDefinition;
    /** Reload time base, used for barrel's reloads. */
    public reloadTime = 15;
    /** The current tank definition / tank id. */
    private _currentTank: Tank | DevTank = Tank.Basic;
    /** Sets tanks to be invulnerable - example, godmode, or AC */
    public isInvulnerable: boolean = false;
    public segments: ObjectEntity[];
    public orbit: Orbit[];
    public orbit2: OrbitTrap[];
    public orbitinv: OrbitInverse[];
    public k: number;
    public length: number;
    public coolDown: boolean = false;
    public aura: Aura|null
    public hasAura :boolean
    public constructor(game: GameServer, camera: CameraEntity, inputs: Inputs, tank?: Tank | DevTank) {
        super(game);
        this.cameraEntity = camera;
        this.inputs = inputs;
        this.isAffectedByRope = false;
        this.length = 16;
        this.canchain = true
        this.altTank = true
        this.segments = [this];
        this.orbit = [];
        this.orbit2 = [];
        this.orbitinv = []
        this.k = 0.25;
        this.physicsData.values.size = 50;
        this.physicsData.values.sides = 1;
        this.styleData.values.color = Color.Tank;
        this.relationsData.values.team = camera;
        this.relationsData.values.owner = camera;
        if(this.definition.flags.isCelestial){
            this.physicsData.values.size *= 1.5
            this.baseSize *= 1.5
        }
        this.cameraEntity.cameraData.spawnTick = game.tick;
        this.cameraEntity.cameraData.flags |= CameraFlags.showingDeathStats;

        // spawn protection
        this.styleData.values.flags |= StyleFlags.isFlashing;
        this.damageReduction = 0;
        if (this.game.playersOnMap) this.physicsData.values.flags |= PhysicsFlags.showsOnMap;

        this.damagePerTick = 20;
        this.setTank(tank || Tank.Basic);
        
        this.aura = null
        this.hasAura = false
    }

    /** The active change in size from the base size to the current. Contributes to barrel and addon sizes. */
    public get sizeFactor() {
        return this.physicsData.values.size / this.baseSize;
    }

    /** The current tank type / tank id. */
    public get currentTank() {
        return this._currentTank;
    }

    /** This method allows for changing the current tank. */
    public setTank(id: Tank | DevTank) {
        // Delete old barrels and addons
        for (let i = 0; i < this.children.length; ++i) {
            this.children[i].isChild = false;
            this.children[i].delete();
        }
        this.children = [];
        this.barrels = [];
        this.addons = [];
        //TankBody.OrbCount = 0
        // Get the new tank data
        const tank = getTankById(id);
        const camera = this.cameraEntity;
        if (!tank) throw new TypeError("Invalid tank ID");
        this.definition = tank;
        if (!Entity.exists(camera)) throw new Error("No camera");
        this.physicsData.sides = tank.sides;
        this.styleData.opacity = 1;

        for (let i: Stat = 0; i < StatCount; ++i) {
            const {name, max} = tank.stats[i];

            camera.cameraData.statLimits[i] = max;
            camera.cameraData.statNames[i] = name;
            if (camera.cameraData.statLevels[i] > max) {
                camera.cameraData.statsAvailable += (camera.cameraData.statLevels[i] - (camera.cameraData.statLevels[i] = max));
            }
        }
        // Size ratios
        if(this.definition.flags.isCelestial){
            this.physicsData.values.size *= 1.5
            this.baseSize *= 1.5
            camera.maxlevel = 90
        }else{
            camera.maxlevel = this.game.arena.maxtanklevel

        }
        this.baseSize = tank.baseSizeOverride ?? tank.sides === 4 ? Math.SQRT2 * 32.5 : tank.sides === 3 ? Math.SQRT2 * 42.5:tank.sides === 5 ? Math.SQRT2 * 30: tank.sides === 16 ? Math.SQRT2 * 25 : this.definition.flags.isCelestial ? Math.SQRT2 * 47.5 : 50;
        this.physicsData.absorbtionFactor = this.isInvulnerable ? 0 : tank.absorbtionFactor;
        if (tank.absorbtionFactor === 0) this.positionData.flags |= PositionFlags.canMoveThroughWalls;
        else if (this.positionData.flags & PositionFlags.canMoveThroughWalls) this.positionData.flags ^= PositionFlags.canMoveThroughWalls;

        camera.cameraData.tank = this._currentTank = id;
        if (tank.upgradeMessage && camera instanceof ClientCamera) camera.client.notify(tank.upgradeMessage);
        // Build addons, then tanks, then addons.
        const preAddon = tank.preAddon;
        if (preAddon) {
            const AddonConstructor = AddonById[preAddon];
            if (AddonConstructor) this.addons.push(new AddonConstructor(this));
        }

        for (const barrel of tank.barrels) {
            this.barrels.push(new Barrel(this, barrel));
        }

        const postAddon = tank.postAddon;
        if (postAddon) {
            const AddonConstructor = AddonById[postAddon];
            if (AddonConstructor) this.addons.push(new AddonConstructor(this));
        }

        // Yeah, yeah why not
        this.cameraEntity.cameraData.tankOverride = tank.name;
        camera.setFieldFactor(tank.fieldFactor);
    }
    /** See LivingEntity.onKill */
    public onKill(entity: LivingEntity) {
        if (entity instanceof TankBody){
        this.scoreData.score = this.cameraEntity.cameraData.score += entity.cameraEntity.cameraData.score/2;}else{
        this.scoreData.score = this.cameraEntity.cameraData.score += entity.scoreReward;
            
        }

        if (entity instanceof TankBody && entity.scoreReward || entity instanceof AbstractBoss) {
            if (this.cameraEntity instanceof ClientCamera) this.cameraEntity.client.notify("You've killed " + (entity.nameData.values.name || "an unnamed tank"));
        }

        // TODO(ABC):
        // This is actually not how necromancers claim squares.


        if (entity instanceof Triangle && this.definition.flags.canClaimTriangles && this.barrels.length) {
            // If can claim, pick a random barrel that has drones it can still shoot, then shoot
            const barrelsToShoot = this.barrels.filter((e) => e.definition.bullet.type === "necrotriangledrone" && this.DroneCount < this.MAXDRONES);

            if (barrelsToShoot.length) {
                const barrelToShoot = barrelsToShoot[~~(Math.random()*barrelsToShoot.length)];

                // No destroy it on the next tick to make it look more like the way diep does it.
                entity.destroy(true);
                if (entity.deletionAnimation) {
                    entity.deletionAnimation.frame = 0;
                    entity.styleData.opacity = 1;
                }

                const dorito = NecromancerTriangle.fromShape(barrelToShoot, this, this.definition, entity);
        }
    }
        if (entity instanceof Pentagon && this.definition.flags.canClaimPentagons && this.barrels.length) {
            // If can claim, pick a random barrel that has drones it can still shoot, then shoot
            const barrelsToShoot = this.barrels.filter((e) => e.definition.bullet.type === "necropentadrone" && this.DroneCount < this.MAXDRONES);

            if (barrelsToShoot.length) {
                const barrelToShoot = barrelsToShoot[~~(Math.random()*barrelsToShoot.length)];

                // No destroy it on the next tick to make it look more like the way diep does it.
                entity.destroy(true);
                if (entity.deletionAnimation) {
                    entity.deletionAnimation.frame = 0;
                    entity.styleData.opacity = 1;
                }

                const chip = NecromancerPentagon.fromShape(barrelToShoot, this, this.definition, entity);
        }
    }
    if (entity instanceof Square && this.definition.flags.canClaimSquares && this.barrels.length) {
        if(entity instanceof WepSquare){

        }else{
            // If can claim, pick a random barrel that has drones it can still shoot, then shoot
            const barrelsToShoot = this.barrels.filter((e) => e.definition.bullet.type === "necrodrone" && this.DroneCount < this.MAXDRONES);

            if (barrelsToShoot.length) {
                const barrelToShoot = barrelsToShoot[~~(Math.random()*barrelsToShoot.length)];

                // No destroy it on the next tick to make it look more like the way diep does it.
                entity.destroy(true);
                if (entity.deletionAnimation) {
                    entity.deletionAnimation.frame = 0;
                    entity.styleData.opacity = 1;
                }

                const sunchip = NecromancerSquare.fromShape(barrelToShoot, this, this.definition, entity);
            }
        }
    }
    if (entity instanceof Square && this.definition.flags.canClaimSquareswep && this.barrels.length) {
        if(entity instanceof WepSquare){

        }else{
            // If can claim, pick a random barrel that has drones it can still shoot, then shoot
            const barrelsToShoot = this.barrels.filter((e) => e.definition.bullet.type === "wepnecrodrone" && this.DroneCount < this.MAXDRONES);

            if (barrelsToShoot.length) {
                const barrelToShoot = barrelsToShoot[~~(Math.random()*barrelsToShoot.length)];

                // No destroy it on the next tick to make it look more like the way diep does it.
                entity.destroy(true);
                if (entity.deletionAnimation) {
                    entity.deletionAnimation.frame = 0;
                    entity.styleData.opacity = 1;
                }

                const sunchip = NecromancerWepSquare.fromShape(barrelToShoot, this, this.definition, entity);
            }
        }
    }
                if (entity instanceof Square && this.definition.flags.canClaimSquares2 && this.barrels.length) {
                    if(entity instanceof WepSquare){
            
                    }else{
                const barrelsToShoot = this.barrels.filter((e) => e.definition.bullet.type === "necrodrone" && this.DroneCount < this.MAXDRONES);
    
                if (barrelsToShoot.length) {
                    const barrelToShoot = barrelsToShoot[~~(Math.random()*barrelsToShoot.length)];
    
                    // No destroy it on the next tick to make it look more like the way diep does it.
                    entity.destroy(true);
                    if (entity.deletionAnimation) {
                        entity.deletionAnimation.frame = 0;
                        entity.styleData.opacity = 1;
                    }
    
                    const sunchip = NecromancerSquare.fromShape(barrelToShoot, this, this.definition, entity);
                }}
    }  
    }

    /** See TankBody.isInvulnerable */
    public setInvulnerability(invulnerable: boolean) {
        if (this.styleData.flags & StyleFlags.isFlashing) this.styleData.flags ^= StyleFlags.isFlashing;

        if (this.isInvulnerable === invulnerable) return;
      
        if (invulnerable) {
            this.damageReduction = 0.0;
            this.physicsData.absorbtionFactor = 0.0;
        } else {
            this.damageReduction = 1.0;
            this.physicsData.absorbtionFactor = this.definition.absorbtionFactor;
        }
      
        this.isInvulnerable = invulnerable;
    }
public Accend(){
    this.damageReduction = 0;
    this.cameraEntity.cameraData.spawnTick = 0
    for (let i = 0; i < StatCount; ++i) this.cameraEntity.cameraData.statLevels[i as Stat] = 0;
    this.cameraEntity.cameraData.statsAvailable += 35
}
    /** See LivingEntity.onDeath */
   public onDeath(killer: LivingEntity) {
        if (!(this.cameraEntity instanceof ClientCamera)) return this.cameraEntity.delete();
        if (!(this.cameraEntity.cameraData.player === this)) return;
        this.cameraEntity.spectatee = killer;
        this.cameraEntity.cameraData.FOV = 0.4;
        this.cameraEntity.cameraData.killedBy = (killer.nameData && killer.nameData.values.name) || "";
    }

    /** Destroys the tank body. Extends LivivingEntity.destroy(animate); */
    public destroy(animate=true) {
        // Stats etc
        if (!animate && Entity.exists(this.cameraEntity)) {
            if (this.cameraEntity.cameraData.player === this) {
                this.cameraEntity.cameraData.deathTick = this.game.tick;
                this.cameraEntity.cameraData.respawnLevel = this.cameraEntity.cameraData.score/2
                if(this.cameraEntity instanceof ClientCamera){
                    this.cameraEntity.cameraData.isCelestial = false
                }
            }

            // Wipe this nonsense
            this.barrels = [];
            this.addons = [];
        }
        this.segments.forEach(segment => 
            {
                if (segment instanceof RopeSegment) segment.destroy();
            });
        super.destroy(animate);
    }

    public tick(tick: number) {
        if (this.definition.sides === 2) {
            this.physicsData.width = this.physicsData.size * (this.definition.widthRatio ?? 1);
            if (this.definition.flags.displayAsTrapezoid === true) this.physicsData.flags |= PhysicsFlags.isTrapezoid;
        } else if (this.definition.flags.displayAsStar === true) this.styleData.flags |= StyleFlags.isStar;
        this.MAXORBS = this.definition.maxorbs
        if (this.inputs.attemptingShot()){
            this.forcemulti = 2
        }else if(this.inputs.attemptingRepel()){
            this.forcemulti = 0.5
        }else{
            this.forcemulti = 1
        }
        this.positionData.angle = Math.atan2(this.inputs.mouse.y - this.positionData.values.y, this.inputs.mouse.x - this.positionData.values.x);
        if(this.canchain == true && this.definition.flags.canChain)
        {
            this.canchain = false
            for (let i = 0; i < this.length; i++){
            const ropeSegment = new RopeSegment(this);
           ropeSegment.styleData.color = Color.Barrel;
           // ropeSegment.relationsData.team = this.relationsData.team;
            ropeSegment.relationsData.owner = this
                ropeSegment.seg = i
                ropeSegment.styleData.values.zIndex = this.styleData.zIndex - i
                if(i == this.length - 1){
                    ropeSegment.IsBig = true
                    ropeSegment.styleData.values.zIndex = this.styleData.zIndex - 1
                }
           this.segments.push(ropeSegment);}
        }
        if(this._currentTank == Tank.vampSmasher){
                if(this.healthData.health > 0){
                const collidedEntities = this.findCollisions();
                for (let i = 0; i < collidedEntities.length; ++i) {
                    if (collidedEntities[i] instanceof TankBody || collidedEntities[i] instanceof AbstractShape || collidedEntities[i] instanceof AbstractBoss){
                        //setTimeout(() => {this.healthData.health += this.damagePerTick/5},45)
                        this.healthData.health += this.damagePerTick/12 *(1 + (this.cameraEntity.cameraData.values.statLevels.values[Stat.HealthRegen]/10))
                    }
                }
            }
        }



        if(this._currentTank == Tank.MicroSmasher){
            this.baseSize = (25 - (12.5/10 * this.cameraEntity.cameraData.values.statLevels.values[Stat.Reload])) * Math.SQRT2
        }
        if (this._currentTank == Tank.PentaShot || this._currentTank == Tank.Triplet || this._currentTank == Tank.Hydra || this._currentTank == Tank.Spike || this._currentTank == Tank.Saw || this._currentTank == Tank.Scope){
        }else{
            this.altTank = true

        }
        if(this._currentTank == Tank.Scope){
            if(this.altTank && Math.random() <= 0.01){
            this.setTank(Tank.Spammer)
            }
            this.altTank = false

         }
        if(this._currentTank == Tank.Spike || this._currentTank == Tank.Saw){
            if(this.altTank && Math.random() <= 0.002){
            this.setTank(Tank.SPORN)
            }
            this.altTank = false

         }
        /* if(this._currentTank == Tank.SpreadShot){
            if(this.altTank && Math.random() <= 0.02){
            this.setTank(Tank.Disperse)
            }
            this.altTank = false

         }*/
        if(this._currentTank == Tank.PentaShot){
            if(this.altTank && Math.random() <= 0.1){
            this.setTank(Tank.ArrasPenta)
            }
            this.altTank = false

         }
         if(this._currentTank == Tank.Triplet){
            if(this.altTank && Math.random() <= 0.05){
            this.setTank(Tank.Quadruplet)
            }
            this.altTank = false

         }
         if(this._currentTank == Tank.Hydra){
            if(this.altTank && Math.random() <= 0.05){
            this.setTank(Tank.Puker)
            }
            this.altTank = false

         }
        if (this._currentTank !== Tank.Chainer){
            this.canchain = true
            this.isAffectedByRope = false
            this.segments.forEach(segment => 
                {
                    if (segment instanceof RopeSegment) segment.destroy();
                });
        }
        /*if (this.isInvulnerable) {
            if (this.game.clients.size !== 1 || this.game.arena.state !== ArenaState.OPEN) {
                // not for ACs
                if (this.cameraEntity instanceof ClientCamera) this.setInvulnerability(false);
            }
        }*/
        if (!this.deletionAnimation && !this.inputs.deleted) this.physicsData.size = this.baseSize * this.cameraEntity.sizeFactor;
        else this.regenPerTick = 0;

        super.tick(tick);

        // If we're currently in a deletion animation
        if (this.deletionAnimation) return;

        if (this.inputs.deleted) {
            if (this.cameraEntity.cameraData.values.level <= 5) return this.destroy();
            this.lastDamageTick = tick;
            this.healthData.health -= 2 + this.healthData.values.maxHealth / 500;

            if (this.isInvulnerable) this.setInvulnerability(false);
            if (this.styleData.values.flags & StyleFlags.isFlashing) {
                this.styleData.flags ^= StyleFlags.isFlashing;
                this.damageReduction = 1.0;
            }
            return;
            // return this.destroy();
        }

        if (this.definition.flags.zoomAbility && (this.inputs.flags & InputFlags.rightclick)) {
            if (!(this.cameraEntity.cameraData.values.flags & CameraFlags.usesCameraCoords)) {
                const angle = Math.atan2(this.inputs.mouse.y - this.positionData.values.y, this.inputs.mouse.x - this.positionData.values.x)
                this.cameraEntity.cameraData.cameraX = Math.cos(angle) * 1000 + this.positionData.values.x;
                this.cameraEntity.cameraData.cameraY = Math.sin(angle) * 1000 + this.positionData.values.y;
                this.cameraEntity.cameraData.flags |= CameraFlags.usesCameraCoords;
            }
        } else if (this.cameraEntity.cameraData.values.flags & CameraFlags.usesCameraCoords) this.cameraEntity.cameraData.flags ^= CameraFlags.usesCameraCoords;

        if (this.definition.flags.invisibility) {

            if (this.inputs.flags & InputFlags.leftclick) this.styleData.opacity += this.definition.visibilityRateShooting;
            if (this.inputs.flags & (InputFlags.up | InputFlags.down | InputFlags.left | InputFlags.right) || this.inputs.movement.x || this.inputs.movement.y) this.styleData.opacity += this.definition.visibilityRateMoving;
           
            this.styleData.opacity -= this.definition.invisibilityRate;

            this.styleData.opacity = util.constrain(this.styleData.values.opacity, 0, 1);
        }


        // Update stat related
        updateStats: {
            if(!this.definition.flags.isCelestial){
            // Damage
            if(this._currentTank == Tank.Belphegor){
                this.baseSize = (50 * (1.2 + (0.8/10 * this.cameraEntity.cameraData.values.statLevels.values[Stat.BodyDamage])))
    
            }
           if(this._currentTank == Tank.Multibox || this._currentTank == Tank.BentBox|| this._currentTank == Tank.Multiboxer|| this._currentTank == Tank.Toolkit){
                this.baseSize = 37.5
    
            }
            if(this._currentTank == Tank.BEES){
                this.baseSize = 25
    
            }
            if ((this.styleData.values.flags & StyleFlags.isFlashing)){
                this.damagePerTick = 0
            }else {
            this.damagePerTick = this.cameraEntity.cameraData.statLevels[Stat.BodyDamage] * 6 + 20;
            }
            if (this._currentTank === Tank.Spike) this.damagePerTick *= 1.5;
            if (this._currentTank === Tank.Belphegor) this.damagePerTick *= 1.5;
            if (this._currentTank === Tank.SPORN) this.damagePerTick *= 2;
            if (this._currentTank === Tank.Teleporter) this.damagePerTick *= 0.25;
            if (this._currentTank === Tank.Chainer) this.damagePerTick *= 0.9;
            if (this._currentTank === Tank.Bumper) this.damagePerTick *= 0.625;
            if (this._currentTank === Tank.Bumper) this.damageReduction = 0.625;
            if (this._currentTank === Tank.Maleficitor ||this._currentTank === Tank.Caster || this._currentTank === Tank.Wizard) this.MAXDRONES = 11 + this.cameraEntity.cameraData.values.statLevels.values[Stat.Reload];
            if (this._currentTank === Tank.Necromancer) this.MAXDRONES = 22 + (this.cameraEntity.cameraData.values.statLevels.values[Stat.Reload] * 2);
            if (this._currentTank === Tank.Summoner) this.MAXDRONES = 44 + (this.cameraEntity.cameraData.values.statLevels.values[Stat.Reload] * 4);
            if (this._currentTank === Tank.Dronemare) this.MAXDRONES = (11 + this.cameraEntity.cameraData.values.statLevels.values[Stat.Reload]) * 0.5;
            if (this._currentTank === Tank.Wraith) this.MAXDRONES = (11 + this.cameraEntity.cameraData.values.statLevels.values[Stat.Reload]) * 0.75
            if (this._currentTank === Tank.Animator) this.MAXDRONES = 10 + (this.cameraEntity.cameraData.values.statLevels.values[Stat.Reload]/2);
            if (this._currentTank === Tank.Lich) this.MAXDRONES = 5

            // Max Health
            const maxHealthCache = this.healthData.values.maxHealth;

            
            if (this._currentTank === Tank.MegaSmasher){
            this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[Stat.MaxHealth]) * 20 * 1.5}
            else if (this._currentTank === Tank.Teleporter){
                this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[Stat.MaxHealth]) * 20 * 4}
            else if (this._currentTank === Tank.Belphegor){
                this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[Stat.MaxHealth]) * 20 * 1.5}  
            else if (this._currentTank === Tank.Saw){
                this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[Stat.MaxHealth]) * 20 * 0.75;}
                else if (this._currentTank === Tank.MicroSmasher){
                    this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[Stat.MaxHealth]) * 20 * 0.75;}
else if (this._currentTank === Tank.SPORN){
                this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[Stat.MaxHealth]) * 20 * 0.2;}
                else if (this._currentTank === Tank.autosmasher){
                    this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[Stat.MaxHealth]) * 20 * 1.1;}
                else{ this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + this.cameraEntity.cameraData.values.statLevels.values[Stat.MaxHealth] * 20}
            if (this.healthData.values.health === maxHealthCache) this.healthData.health = this.healthData.maxHealth; // just in case
            else if (this.healthData.values.maxHealth !== maxHealthCache) {
                this.healthData.health *= this.healthData.values.maxHealth / maxHealthCache
            }

            // Regen
            this.regenPerTick = (this.healthData.values.maxHealth * 4 * (this.cameraEntity.cameraData.values.statLevels.values[Stat.HealthRegen]) + this.healthData.values.maxHealth) / 25000;
            if (this._currentTank === Tank.MegaSmasher) this.regenPerTick *= 1.25;
            if (this._currentTank === Tank.Leacher) this.regenPerTick *= 0.25;
            if (this._currentTank === Tank.Vampire) this.regenPerTick *= 0.25;
            if (this._currentTank === Tank.Restorer) this.regenPerTick *= 0.25;
            if (this._currentTank === Tank.autoLeacher) this.regenPerTick *= 0.25;
            if (this._currentTank === Tank.vampSmasher) this.regenPerTick *= 0.25;
            if (this._currentTank === Tank.Bumper) {this.physicsData.pushFactor = 60;}else{this.physicsData.pushFactor = 8}
            // Reload
            if(this._currentTank == Tank.Rotary){
                if(this.inputs.attemptingShot()){
                    if(this.reloadspeed > 0.25) this.reloadspeed -= 0.0025
                    if(this.reloadspeed < 0.25) this.reloadspeed = 0.25
                }
                if(!this.inputs.attemptingShot()){
                    if(this.reloadspeed < 1) this.reloadspeed += 0.025
                    if(this.reloadspeed > 1) this.reloadspeed = 1

                }
                this.reloadTime = 15 * Math.pow(0.914, this.cameraEntity.cameraData.values.statLevels.values[Stat.Reload]) * this.reloadspeed
            }else{
            this.reloadTime = 15 * Math.pow(0.914, this.cameraEntity.cameraData.values.statLevels.values[Stat.Reload]);}
        }else{
                        // Damage
            if ((this.styleData.values.flags & StyleFlags.isFlashing)){
                this.damagePerTick = 0
            }else {
            this.damagePerTick = this.cameraEntity.cameraData.statLevels[Stat.BodyDamage] * 9 + 30;
            }
            if (this._currentTank === Tank.Void) this.damagePerTick *= 1.5;
            if (this._currentTank === Tank.Rift) this.damagePerTick *= 0.25;

            // Max Health
            const maxHealthCache = this.healthData.values.maxHealth;

            if (this._currentTank === Tank.Abyss) this.regenPerTick *= 1.25;
            if (this._currentTank === Tank.Chasm || this._currentTank === Tank.Void || this._currentTank == Tank.Comet || this._currentTank === Tank.Rift) this.regenPerTick *= 0.75;
            
            if (this._currentTank === Tank.Abyss){
                this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[Stat.MaxHealth] * 1.5) * 50;}
                else if (this._currentTank === Tank.Comet){
                    this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[Stat.MaxHealth]) * 25;}
                    else if (this._currentTank === Tank.Rift){
                        this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[Stat.MaxHealth]) * 140;}
                    else if (this._currentTank === Tank.Void || this._currentTank === Tank.Chasm){
                        this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + (this.cameraEntity.cameraData.values.statLevels.values[Stat.MaxHealth]) * 35;}
                    else{ this.healthData.maxHealth = this.definition.maxHealth + 2 * (this.cameraEntity.cameraData.values.level - 1) + this.cameraEntity.cameraData.values.statLevels.values[Stat.MaxHealth] * 40}
            if (this.healthData.values.health === maxHealthCache) this.healthData.health = this.healthData.maxHealth; // just in case
            else if (this.healthData.values.maxHealth !== maxHealthCache) {
                this.healthData.health *= this.healthData.values.maxHealth / maxHealthCache
            }

            // Regen
            this.regenPerTick = (this.healthData.values.maxHealth * 2 * (this.cameraEntity.cameraData.values.statLevels.values[Stat.HealthRegen]) + this.healthData.values.maxHealth) / 25000;
            // Reload
            this.reloadTime = 15 * Math.pow(0.914, this.cameraEntity.cameraData.values.statLevels.values[Stat.Reload]);
        }

        this.scoreData.score = this.cameraEntity.cameraData.values.score;

        if ((this.styleData.values.flags & StyleFlags.isFlashing) && (this.game.tick >= this.cameraEntity.cameraData.values.spawnTick + 374 || this.inputs.attemptingShot())) {
            this.styleData.flags ^= StyleFlags.isFlashing;
            // Dont worry about invulnerability here - not gonna be invulnerable while flashing ever (see setInvulnerability)
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
        for (let i = 0; i < this.orbit.length; i++) this.orbit[i].num = i;

        for (let i = 0; i < this.orbit2.length; i++) this.orbit2[i].num = i;

        for (let i = 0; i < this.orbitinv.length; i++) this.orbitinv[i].num = i;


        for (let i = 1; i < this.segments.length; i++) 
        {
            const a = this.segments[i - 1];
            const b = this.segments[i];
            /*const delta = {
                x: a.positionData.values.x - b.positionData.values.x,
                y: a.positionData.values.y - b.positionData.values.y
            }*/
            const delta = new Vector(a.positionData.values.x - b.positionData.values.x, a.positionData.values.y - b.positionData.values.y);
            const x = delta.magnitude - Math.max(a.restLength, b.restLength);
      
            let force = delta.unitVector.scale(-this.k * x);
      
            if (a.isAffectedByRope)a.addAcceleration(force.angle, force.magnitude * this.forcemulti, false);
      
            force = force.scale(-1);

            if (b.isAffectedByRope) b.addAcceleration(force.angle, force.magnitude * this.forcemulti, false);
            //this.addAcceleration(-force.angle, force.magnitude * 0.2, true)
        }
        /*if(this.inputs.attemptingRepel() && !this.hasAura){
            this.aura = new Aura(this.game, this, 4)
            this.hasAura = true
        }
        if(this.aura){
            this.aura.positionData.values.x = this.positionData.values.x
            this.aura.positionData.values.y = this.positionData.values.y
            if(!this.inputs.attemptingRepel()){
                this.aura.destroy()
                this.aura = null
                this.hasAura = false
            }
        }*/
    }
}
