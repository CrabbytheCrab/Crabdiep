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

import { InputFlags, PhysicsFlags, Tank } from "../../../Const/Enums";
import { BarrelDefinition, TankDefinition } from "../../../Const/TankDefinitions";
import { Entity } from "../../../Native/Entity";
import { AIState, Inputs } from "../../AI";
import { BarrelBase } from "../TankBody";
import AutoTurret from "../AutoTurret";

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

const MinionBarrelDrone: BarrelDefinition = {
    angle: Math.PI,
    offset: 0,
    size: 70,
    width: 42,
    delay: 0,
    reload: 4.5,
    recoil: 1,
    isTrapezoid: true,
    trapezoidDirection: 0,
    droneCount: 2,
    canControlDrones: false,
    addon: null,
    bullet: {
        type: "drone",
        health: 0.7,
        damage: 0.5,
        speed: 0.8,
        scatterRate: 1,
        lifeLength: -1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const MinionBarrelDefinition2: BarrelDefinition = {
    angle: 3.141592653589793,
    offset: 0,
    size: 73,
    width: 35,
    delay: 0.35,
    reload: 5,
    recoil: 0,
    droneCount: 2,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    canControlDrones: false,
    bullet: {
        type: "drone",
        health: 1.25,
        damage: 0.4,
        speed: 0.9,
        scatterRate: 1,
        lifeLength: -1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const MinionBarrelDefinition3: BarrelDefinition = {
    angle: 1.0471975511965976,
    offset: 0,
    size: 73,
    width: 35,
    delay: 0.35,
    reload: 5,
    recoil: 0,
    droneCount: 2,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    canControlDrones: false,
    bullet: {
        type: "drone",
        health: 1.25,
        damage: 0.4,
        speed: 0.9,
        scatterRate: 1,
        lifeLength: -1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const MinionBarrelDefinition4: BarrelDefinition = {
    angle: -1.0471975511965976,
    offset: 0,
    size: 73,
    width: 35,
    delay: 0.35,
    reload: 5,
    recoil: 0,
    droneCount: 2,
    isTrapezoid: true,
    trapezoidDirection: 0,
    addon: null,
    canControlDrones: false,
    bullet: {
        type: "drone",
        health: 1.25,
        damage: 0.4,
        speed: 0.9,
        scatterRate: 1,
        lifeLength: -1,
        sizeRatio: 1,
        absorbtionFactor: 1
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
public idx: number | null;
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.idx = null
        if (tankDefinition){
            this.idx = tankDefinition.id
        }
        const bulletDefinition = barrel.definition.bullet;

        this.inputs = this.ai.inputs;
        this.ai.viewRange = 900;
        this.usePosAngle = false;

        this.physicsData.values.sides = bulletDefinition.sides ?? 1;
        this.physicsData.values.size *= 1.2;
        
        if (this.physicsData.values.flags & PhysicsFlags.noOwnTeamCollision) this.physicsData.values.flags ^= PhysicsFlags.noOwnTeamCollision;
        if (this.physicsData.values.flags & PhysicsFlags.canEscapeArena) this.physicsData.values.flags ^= PhysicsFlags.canEscapeArena;

        this.physicsData.values.flags |= PhysicsFlags.onlySameOwnerCollision;

        this.sizeFactor = this.physicsData.values.size / 50;
        this.cameraEntity = tank.cameraEntity;
        if (tankDefinition && tankDefinition.id === Tank.Snyope){
            const atuo = new AutoTurret(this, {
                angle: 0,
                offset: 0,
                size: 62,
                width: 35,
                delay: 0.01,
                reload: 5.5,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 1,
                    damage: 0.8,
                    speed: 1.3,
                    scatterRate: 0.3,
                    lifeLength: 1,
                    absorbtionFactor: 0.1
                }
            });
            //atuo.influencedByOwnerInputs = true
                atuo.baseSize *= 1.15
            this.minionBarrel = new Barrel(this, MinionBarrelDefinition2)
            this.minionBarrel = new Barrel(this, MinionBarrelDefinition3)
            this.minionBarrel = new Barrel(this, MinionBarrelDefinition4)
        }
        else{
            this.minionBarrel = new Barrel(this, MinionBarrelDefinition)
            if (tankDefinition && tankDefinition.id === Tank.Forge){
                this.minionBarrel = new Barrel(this, MinionBarrelDrone)
            }
        }
        this.ai.movementSpeed = this.ai.aimSpeed = this.baseAccel;
    }

    /** This allows for factory to hook in before the entity moves. */
    protected tickMixin(tick: number) {
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;
        if(this.idx === Tank.Snyope){
            this.positionData.values.angle += 0.1
        }
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
                this.movementAngle = this.positionData.values.angle
            } else this.movementAngle = this.positionData.values.angle;
        }

        super.tickMixin(tick);
    }
}