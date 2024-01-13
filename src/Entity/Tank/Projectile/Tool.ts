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

import Barrel from "../Barrel";
import Drone from "./Drone";

import { HealthFlags, InputFlags, PhysicsFlags, Stat, StyleFlags, Tank } from "../../../Const/Enums";
import { BarrelDefinition, TankDefinition } from "../../../Const/TankDefinitions";
import { Entity } from "../../../Native/Entity";
import { AIState, Inputs } from "../../AI";
import TankBody, { BarrelBase } from "../TankBody";
import AutoTurret from "../AutoTurret";
import ObjectEntity from "../../Object";
import Bullet from "./Bullet";
import LivingEntity from "../../Live";
import Vector, { VectorAbstract } from "../../../Physics/Vector";
import * as util from "../../../util";

/**
 * Barrel definition for the factory minion's barrel.
 */
 const FT1: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 60,
    width: 42,
    delay: 0,
    reload: 2.5,
    recoil: 1,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: "trapLauncher",
    bullet: {
        type: "trap",
        health: 2,
        damage: 0.5,
        speed: 2,
        scatterRate: 1,
        lifeLength: 4.5,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};

const FT2: BarrelDefinition = {
    angle: -Math.PI/3 * 2,
    offset: 0,
    size: 60,
    width: 42,
    delay: 0,
    reload: 2.5,
    recoil: 1,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: "trapLauncher",
    bullet: {
        type: "trap",
        health: 2,
        damage: 0.5,
        speed: 2,
        scatterRate: 1,
        lifeLength: 4.5,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const FT3: BarrelDefinition = {
    angle: Math.PI/3 * 2,
    offset: 0,
    size: 60,
    width: 42,
    delay: 0,
    reload: 2.5,
    recoil: 1,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: "trapLauncher",
    bullet: {
        type: "trap",
        health: 2,
        damage: 0.5,
        speed: 2,
        scatterRate: 1,
        lifeLength: 4.5,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const OS1: BarrelDefinition = {
    angle: Math.PI/2,
    offset: 0,
    size: 70,
    width: 42,
    delay: 0,
    reload: 6,
    recoil: 1,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    droneCount:4,
    canControlDrones:true,
    bullet: {
        type: "drone",
        health: 2,
        damage: 0.35,
        speed: 0.8,
        scatterRate: 0,
        lifeLength: -1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};

const OS2: BarrelDefinition = {
    angle: -Math.PI/2,
    offset: 0,
    size: 70,
    width: 42,
    delay: 0,
    reload: 6,
    recoil: 1,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    droneCount:4,
    canControlDrones:true,
    bullet: {
        type: "drone",
        health: 2,
        damage: 0.35,
        speed: 0.8,
        scatterRate: 0,
        lifeLength: -1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
/**
 * The drone class represents the minion (projectile) entity in diep.
 */
export default class Tool extends LivingEntity implements BarrelBase {
    /** Size of the focus the minions orbit. */
    public static FOCUS_RADIUS = 850 ** 2;

    /** The minion's barrel */
    private minionBarrel: Barrel;

    /** The size ratio of the rocket. */
    public sizeFactor: number;
    /** The camera entity (used as team) of the rocket. */
    public cameraEntity: Entity;
    /** The reload time of the rocket's barrel. */
    public reloadTime = 1;
    /** The inputs for when to shoot or not. (Rocket) */
    public inputs = new Inputs();
public idx: number | null;
protected barrelEntity: Barrel;
/** The tick this entity was created in. */
protected spawnTick = 0;
/** Speed the bullet will accelerate at. */
public baseAccel = 0;
/** Starting velocity of the bullet. */
public baseSpeed = 0;
/** Percent of accel applied when dying. */
protected deathAccelFactor = 0.5;
/** Life length in ticks before the bullet dies. */
protected lifeLength = 0;
/** Angle the projectile is shot at. */
public movementAngle = 0;
/** Definition of the tank (if existant) shooting the bullet. */
protected tankDefinition: TankDefinition | null = null;
/** Whether or not to use .shootAngle or .position.angle. */
protected usePosAngle = false;
/** The tank who shot the bullet. */
protected tank: BarrelBase;
public mode: number
protected parent: ObjectEntity;
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number,mode:number, parent?: ObjectEntity) {
        super(barrel.game);
        this.parent = parent ?? tank;
        this.tank = tank;
        this.idx = null
        this.barrelEntity = barrel;
        this.mode = mode
        if (tankDefinition){
            this.idx = tankDefinition.id
        }
        const bulletDefinition = barrel.definition.bullet;

        this.usePosAngle = false;

        this.physicsData.values.sides = bulletDefinition.sides ?? 1;
        this.physicsData.values.size *= 1.2;
        this.physicsData.values.flags |= PhysicsFlags.noOwnTeamCollision
        if (this.physicsData.values.flags & PhysicsFlags.canEscapeArena) this.physicsData.values.flags ^= PhysicsFlags.canEscapeArena;

        //this.physicsData.values.flags |= PhysicsFlags.onlySameOwnerCollision;

        this.sizeFactor = this.physicsData.values.size / 50;
        this.cameraEntity = tank.cameraEntity;
        if(mode == 1){
            this.minionBarrel = new Barrel(this,FT1)
            this.minionBarrel = new Barrel(this,FT2)
            this.minionBarrel = new Barrel(this,FT3)
        }else{
            this.minionBarrel = new Barrel(this,OS1)
            this.minionBarrel = new Barrel(this,OS2)
        }
        const statLevels = tank.cameraEntity.cameraData?.values.statLevels.values;
        const tanklevel = tank.cameraEntity.cameraData?.values.level;
        const bulletDamage = statLevels ? statLevels[Stat.BodyDamage] : 0;
        const bulletPenetration = statLevels ? statLevels[Stat.MaxHealth] : 0;
        const bulletSpeed = statLevels ? statLevels[Stat.MovementSpeed] : 0;
        this.styleData.values.flags &= ~StyleFlags.hasNoDmgIndicator;
        this.physicsData.values.pushFactor = 8
        this.physicsData.values.absorbtionFactor = bulletDefinition.absorbtionFactor;

        this.physicsData.values.size = tank.physicsData.values.size
        if (barrel.definition.bullet.lifeLength !== -1) {
            this.lifeLength = 88 * barrel.definition.bullet.lifeLength;
        } else {
            this.lifeLength = Infinity;
            if (this.physicsData.values.flags & PhysicsFlags.canEscapeArena) this.physicsData.values.flags ^= PhysicsFlags.canEscapeArena;
        }
        if(tanklevel){
            this.baseAccel =  0
            this.baseSpeed = barrel.bulletAccel + 30 - Math.random() * bulletDefinition.scatterRate;
            this.healthData.values.health = (50 + 2 * (tanklevel - 1) + bulletPenetration * 20) * 0.25
            this.healthData.values.maxHealth = (50 + 2 * (tanklevel - 1) + bulletPenetration * 20) * 0.25
        }
        this.damagePerTick = bulletDamage * 6 + 20;
        this.damageReduction = 1;
       if(this.healthData.values.flags && HealthFlags.hiddenHealthbar) this.healthData.values.flags ^= HealthFlags.hiddenHealthbar;
        this.movementAngle = shootAngle;
       const {x, y} = tank.getWorldPosition();
       const sizeFactor = tank.sizeFactor;
       this.relationsData.values.team = barrel.relationsData.values.team;
       this.relationsData.values.owner = tank;
       this.positionData.values.x = x + (Math.cos(shootAngle) * barrel.physicsData.values.size) - Math.sin(shootAngle) * barrel.definition.offset * sizeFactor + Math.cos(shootAngle) * (barrel.definition.distance || 0);
       this.positionData.values.y = y + (Math.sin(shootAngle) * barrel.physicsData.values.size) + Math.cos(shootAngle) * barrel.definition.offset * sizeFactor + Math.sin(shootAngle) * (barrel.definition.distance || 0);
       this.positionData.values.angle = shootAngle;
       this.styleData.values.color = bulletDefinition.color || tank.rootParent.styleData.values.color;
       barrel.droneCount += 1;
       this.addAcceleration(this.movementAngle, this.baseSpeed/2);
    }
    public destroy(animate=true) {
        if (!animate) this.barrelEntity.droneCount -= 1;

        super.destroy(animate);
    }
    public tick(tick:number){
        super.tick(tick);
        if (this.physicsData.values.flags & PhysicsFlags.noOwnTeamCollision) setTimeout(() =>{ this.physicsData.values.flags ^= PhysicsFlags.noOwnTeamCollision},180)
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;
        const statLevels = this.tank.cameraEntity.cameraData?.values.statLevels.values;
        const regen = statLevels ? statLevels[Stat.HealthRegen] : 0;
        if(this.mode == 1){
            this.positionData.angle += 0.04
        }else{

            this.inputs.mouse = this.tank.inputs.mouse
            this.positionData.angle = Math.atan2(this.tank.inputs.mouse.y - this.positionData.values.y, this.tank.inputs.mouse.x - this.positionData.values.x)
        }
        this.regenPerTick = (this.healthData.values.maxHealth * 4 * (regen) + this.healthData.values.maxHealth) / 25000;
        const bulletSpeed = statLevels ? statLevels[Stat.MovementSpeed] : 0;
        const flags = this.tank.inputs.flags 
        const movement: VectorAbstract = {
            x: 0,
            y: 0
        };
        if (flags & InputFlags.up) movement.y -= 1;
        if (flags & InputFlags.down) movement.y += 1;
        if (flags & InputFlags.right) movement.x += 1;
        if (flags & InputFlags.left) movement.x -= 1;
        const angle = Math.atan2(movement.y, movement.x);
        const angle2 = Math.atan2(this.positionData.y - this.tank.positionData.y, this.positionData.x - this.tank.positionData.x);

        const magnitude = util.constrain(Math.sqrt(movement.x ** 2 + movement.y ** 2), -1, 1);

        this.inputs.movement.angle = angle;
        if( this.tank.cameraEntity.cameraData){
            if(!this.tank.inputs.attemptingRepel()){
                this.addAcceleration(angle, magnitude * this.tank.cameraEntity.cameraData.values.movementSpeed, false)
            }else{
            this.addAcceleration(angle2, -1* this.tank.cameraEntity.cameraData.values.movementSpeed, false);}
    }
        // So that switch tank works, as well as on death

        if (!Entity.exists(this.barrelEntity)) this.destroy();
        if(this.tank.inputs.attemptingShot()){
            this.inputs.flags |= InputFlags.leftclick
        }else{
            if(this.inputs.flags && InputFlags.leftclick)this.inputs.flags ^= InputFlags.leftclick;
        }
        const maxHealthCache = this.healthData.values.maxHealth;
        if (this.healthData.values.health === maxHealthCache) this.healthData.health = this.healthData.maxHealth; // just in case
        else if (this.healthData.values.maxHealth !== maxHealthCache) {
            this.healthData.health *= this.healthData.values.maxHealth / maxHealthCache
        }
    }
}