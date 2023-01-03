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

import { Color, InputFlags, PhysicsFlags, StyleFlags } from "../../../Const/Enums";
import { BarrelDefinition, TankDefinition } from "../../../Const/TankDefinitions";
import { Entity } from "../../../Native/Entity";
import { AIState, Inputs } from "../../AI";
import { BarrelBase } from "../TankBody";
import Bullet from "./Bullet";
import AutoTurret from "../AutoTurret";
import { PI2 } from "../../../util";

/**
 * Barrel definition for the factory minion's barrel.
 */
 const MinionBarrelDefinition: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 80,
    width: 50.4,
    delay: 0,
    reload: 1,
    recoil: 1.35,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.4,
        damage: 0.4,
        speed: 0.8,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const Bombshot1: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 0,
    width: 75,
    delay: 0,
    reload: 1,
    recoil: 1,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.9,
        damage: 1.4,
        speed: 0.8,
        scatterRate: 0.3,
        lifeLength: 0.65,
        sizeRatio: 1,
        absorbtionFactor: 0.3
    }
};
/**
 * The drone class represents the minion (projectile) entity in diep.
 */
export default class Minion extends Drone implements BarrelBase {
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
    public canexplode: boolean;
    public primetimer: number;
    public death: boolean;
    public primetimer2: number;
    protected megaturret: boolean;
    public skimmerBarrels: Barrel[];
    public boom: boolean;
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel, tank, tankDefinition, shootAngle);

        const bulletDefinition = barrel.definition.bullet;

        this.inputs = this.ai.inputs;
        this.ai.viewRange = 900;
        this.usePosAngle = false;

        this.physicsData.values.sides = bulletDefinition.sides ?? 1;
        this.physicsData.values.size *= 1.2;
        this.canexplode = false
        this.death = true
        this.boom = false
        this.primetimer2 = 0
        this.skimmerBarrels =[];
        this.primetimer = 0
        this.megaturret = typeof this.barrelEntity.definition.megaturret === 'boolean' && this.barrelEntity.definition.megaturret;
        if (this.physicsData.values.flags & PhysicsFlags.noOwnTeamCollision) this.physicsData.values.flags ^= PhysicsFlags.noOwnTeamCollision;
        if (this.physicsData.values.flags & PhysicsFlags.canEscapeArena) this.physicsData.values.flags ^= PhysicsFlags.canEscapeArena;

        this.physicsData.values.flags |= PhysicsFlags.onlySameOwnerCollision;

        this.sizeFactor = this.physicsData.values.size / 50;
        this.cameraEntity = tank.cameraEntity;

        this.minionBarrel = new Barrel(this, MinionBarrelDefinition);
        this.ai.movementSpeed = this.ai.aimSpeed = this.baseAccel;

        if(this.megaturret){
            const atuo = new AutoTurret(this, {
                angle: 0,
                offset: 0,
                size: 0,
                width: 0,
                delay: 0.01,
                reload: 1.75,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                droneCount: 0,
                bullet: {
                    type: "drone",
                    sizeRatio: 1,
                    health: 0.75,
                    damage: 0.5,
                    speed: 1,
                    scatterRate: 1,
                    lifeLength: 0.75,
                    absorbtionFactor: 0.1
                }
            });
                atuo.baseSize *= 1.25
                atuo.positionData.values.angle = shootAngle
            //atuo.ai.passiveRotation = this.movementAngle
            atuo.styleData.values.flags |= StyleFlags.showsAboveParent;
            atuo.ai.viewRange = 0
            atuo.styleData.color = Color.Border
            const tickBase = atuo.tick;
            atuo.tick = (tick: number) => {
                if(this.canexplode == false){
                        this.primetimer++
                        if(this.primetimer == 60){
                            this.canexplode = true
                            atuo.styleData.color = Color.Box
        
                        } 
                    }
                tickBase.call(atuo, tick);
            }
        }
    }

    /** This allows for factory to hook in before the entity moves. */
    protected tickMixin(tick: number) {
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;

        const usingAI = !this.canControlDrones || !this.tank.inputs.attemptingShot() && !this.tank.inputs.attemptingRepel();
        const inputs = !usingAI ? this.tank.inputs : this.ai.inputs;

        if (usingAI && this.ai.state === AIState.idle) {
            this.movementAngle = this.positionData.values.angle;
        } else {
            this.inputs.flags |= InputFlags.leftclick;

            const dist = inputs.mouse.distanceToSQ(this.positionData.values);

            if (dist < Minion.FOCUS_RADIUS / 4) { // Half
                this.movementAngle = this.positionData.values.angle + Math.PI;
            } else if (dist < Minion.FOCUS_RADIUS) {
               this.movementAngle = this.positionData.values.angle;
            } else this.movementAngle = this.positionData.values.angle;
        }
        if(this.megaturret){
            if(this.tank.inputs.attemptingRepel() && this.canexplode == true){
            {
                this.inputs = new Inputs();
                this.inputs.flags |= InputFlags.leftclick;
                    const skimmerBarrels: Barrel[] = this.skimmerBarrels =[]
                    for (let n = 0; n < 8; n++) {
                        const barr = new Barrel(this, {
                         ...Bombshot1,
                         angle: PI2 * (n / 8)
                     });
                     barr.physicsData.values.sides = 0
                     skimmerBarrels.push(barr);
             
                     } 
                    
                     
            }
                setTimeout(() => {
                    this.destroy()
                }, 15);
    
            this.boom = true
        }
        }
        super.tickMixin(tick);
    }
}
