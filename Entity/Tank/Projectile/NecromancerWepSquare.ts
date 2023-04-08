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
import * as util from "../../../util";

import { Color, InputFlags, PhysicsFlags, StyleFlags, Tank } from "../../../Const/Enums";
import { BarrelDefinition, TankDefinition } from "../../../Const/TankDefinitions";
import { AI, AIState, Inputs } from "../../AI";
import { BarrelBase } from "../TankBody";
import AbstractShape from "../../Shape/AbstractShape";
import LivingEntity from "../../Live";
import ObjectEntity from "../../Object";
import { Entity } from "../../../Native/Entity";
import Bullet from "./Bullet";
import BulletAlt from "./BulletAlt";

/**
 * The drone class represents the drone (projectile) entity in diep.
 */

export default class NecromancerWepSquare extends BulletAlt implements BarrelBase{
    protected invisibile: boolean;
    public static BASE_ROTATION = 0.2;

    /** The skimmer's barrels */
    private skimmerBarrels: Barrel[];

    /** The size ratio of the skimmer. */
    public sizeFactor: number;
    /** The camera entity (used as team) of the skimmer. */
    public cameraEntity: Entity;
    /** The reload time of the skimmer's barrel. */
    public reloadTime = 15;
    /** The inputs for when to shoot or not. (skimmer) */
    public inputs = new Inputs();;
    public ai: AI;

    /** The drone's radius of resting state */
    public static MAX_RESTING_RADIUS = 400 ** 2;

    /** Used let the drone go back to the player in time. */
    public restCycle = true;

    /** Cached prop of the definition. */
    protected canControlDrones: boolean;
    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel, tank, tankDefinition, shootAngle);

        const bulletDefinition = barrel.definition.bullet;

        this.usePosAngle = true;
        
        this.ai = new AI(this);
        this.ai.viewRange = 850 * tank.sizeFactor;
        this.ai.targetFilter = (targetPos) => (targetPos.x - this.tank.positionData.values.x) ** 2 + (targetPos.y - this.tank.positionData.values.y) ** 2 <= this.ai.viewRange ** 2; // (1000 ** 2) 1000 radius
        this.canControlDrones = typeof this.barrelEntity.definition.canControlDrones === 'boolean' && this.barrelEntity.definition.canControlDrones;
        if (this.physicsData.values.flags & PhysicsFlags.noOwnTeamCollision) this.physicsData.values.flags ^= PhysicsFlags.noOwnTeamCollision;
        this.physicsData.values.flags |= PhysicsFlags.onlySameOwnerCollision;
        this.styleData.values.flags &= ~StyleFlags.hasNoDmgIndicator;

        if (barrel.definition.bullet.lifeLength !== -1) {
            this.lifeLength = 88 * barrel.definition.bullet.lifeLength;
        } else {
            this.lifeLength = Infinity;
            if (this.physicsData.values.flags & PhysicsFlags.canEscapeArena) this.physicsData.values.flags ^= PhysicsFlags.canEscapeArena;
        }
        this.deathAccelFactor = 1;

        this.physicsData.values.pushFactor = 4;
        this.physicsData.values.absorbtionFactor = bulletDefinition.absorbtionFactor;


        this.cameraEntity = tank.cameraEntity;

        this.sizeFactor = this.physicsData.values.size / 50;

        const skimmerBarrels: Barrel[] = this.skimmerBarrels =[];
        const SkimmerBarrelDefinition: BarrelDefinition = {
            angle: Math.PI / 2,
            offset: 0,
            size: 75,
            width: 40,
            delay: 0,
            reload: 0.65,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "bullet",
                health: 0.725,
                damage: 0.3,
                speed: 1.2,
                scatterRate: 1,
                lifeLength: 0.25,
                sizeRatio: 1,
                absorbtionFactor: 1,
                color: this.tank.styleData.color
            }
        };
        const s1 = new class extends Barrel {
            // Keep the width constant
            protected resize() {
                super.resize();
               this.physicsData.values.width = this.definition.width
               this.physicsData.size = this.definition.size
            }
        }(this, {...SkimmerBarrelDefinition});
        const s2Definition = {...SkimmerBarrelDefinition};
        s2Definition.angle += Math.PI
        const s2 = new class extends Barrel {
            // Keep the width constant
            protected resize() {
                super.resize();
                this.physicsData.width = this.definition.width
                this.physicsData.size = this.definition.size
            }
        }(this, s2Definition);

        skimmerBarrels.push(s1, s2);
        this.invisibile = typeof this.barrelEntity.definition.invisibile === 'boolean' && this.barrelEntity.definition.invisibile;
        this.ai = new AI(this);
        this.ai.viewRange = 900;

        this.physicsData.values.sides = 4;
        // this.physics.values.size = 55 * Math.SQRT1_2 * bulletDefinition.sizeRatio;

        // if (shape.isShiny) this.health.values.maxHealth = this.health.values.health *= 10
        this.styleData.values.color = tank.relationsData.values.team?.teamData?.values.teamColor || Color.NecromancerSquare;
        if (this.physicsData.values.flags & PhysicsFlags.noOwnTeamCollision) this.physicsData.values.flags ^= PhysicsFlags.noOwnTeamCollision;
        this.physicsData.values.flags |= PhysicsFlags.onlySameOwnerCollision;

        // TODO(ABC):
        // No hardcoded - unless it is hardcoded in diep (all signs show that it might be so far)
        if (tankDefinition && tankDefinition.id === Tank.Battleship) {
            this.lifeLength = 88;
        } else {
            this.lifeLength = Infinity;
            if (this.physicsData.values.flags & PhysicsFlags.canEscapeArena) this.physicsData.values.flags ^= PhysicsFlags.canEscapeArena;
        }
        this.deathAccelFactor = 1;

        this.physicsData.values.pushFactor = 4;
        this.physicsData.values.absorbtionFactor = bulletDefinition.absorbtionFactor;
        this.physicsData.values.pushFactor = 4;
        this.physicsData.values.absorbtionFactor = bulletDefinition.absorbtionFactor;

        this.baseSpeed /= 3;

        barrel.droneCount += 1;

        this.ai.movementSpeed = this.ai.aimSpeed = this.baseAccel;

        this.baseSpeed = 0;
    }

    /** Given a shape, it will create a necromancer square using stats from the shape */
    public static fromShape(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shape: LivingEntity): NecromancerWepSquare {
        const wepsunchip = new NecromancerWepSquare(barrel, tank, tankDefinition, shape.positionData.values.angle);
        wepsunchip.physicsData.values.sides = shape.physicsData.values.sides;
        wepsunchip.physicsData.values.size = shape.physicsData.values.size;
        wepsunchip.positionData.values.x = shape.positionData.values.x;
        wepsunchip.positionData.values.y = shape.positionData.values.y;
        wepsunchip.positionData.values.angle = shape.positionData.values.angle;
        
        const shapeDamagePerTick: number = shape['damagePerTick'];

        wepsunchip.damagePerTick *= shapeDamagePerTick / 8;
        wepsunchip.healthData.values.maxHealth = (wepsunchip.healthData.values.health *= (shapeDamagePerTick / 8));
        return wepsunchip;
    }


    protected tickMixin(tick: number) {
        super.tick(tick);
    }

    public tick(tick: number) {
        const usingAI = !this.canControlDrones || this.tank.inputs.deleted || (!this.tank.inputs.attemptingShot() && !this.tank.inputs.attemptingRepel());
        const inputs = !usingAI ? this.tank.inputs : this.ai.inputs;
        this.positionData.angle += 0.1
        if (usingAI && this.ai.state === AIState.idle) {
            if(this.inputs.flags && this.inputs.flags == InputFlags.leftclick) this.inputs.flags ^= InputFlags.leftclick;
            const delta = {
                x: this.positionData.values.x - this.tank.positionData.values.x,
                y: this.positionData.values.y - this.tank.positionData.values.y
            }
            const base = this.baseAccel;

            // still a bit inaccurate, works though
            let unitDist = (delta.x ** 2 + delta.y ** 2) / Drone.MAX_RESTING_RADIUS;
            if (unitDist <= 1 && this.restCycle) {
                this.baseAccel /= 6;
                this.movementAngle += 0.01 + 0.012 * unitDist;
            } else {
                const offset = Math.atan2(delta.y, delta.x) + Math.PI / 2
                delta.x = this.tank.positionData.values.x + Math.cos(offset) * this.tank.physicsData.values.size * 1.2 - this.positionData.values.x;
                delta.y = this.tank.positionData.values.y + Math.sin(offset) * this.tank.physicsData.values.size * 1.2 - this.positionData.values.y;
                this.movementAngle = Math.atan2(delta.y, delta.x);
                if (unitDist < 0.5) this.baseAccel /= 3;
                this.restCycle = (delta.x ** 2 + delta.y ** 2) <= 4 * (this.tank.physicsData.values.size ** 2);
            }

            if (!Entity.exists(this.barrelEntity)) this.destroy();

            this.tickMixin(tick);

            this.baseAccel = base;

            return;
        } else {
            this.inputs.flags |= InputFlags.leftclick;
            this.movementAngle = Math.atan2(inputs.mouse.y - this.positionData.values.y, inputs.mouse.x - this.positionData.values.x);
            this.restCycle = false
        }


        
        if (this.canControlDrones && inputs.attemptingRepel()) {
            this.inputs.flags |= InputFlags.leftclick;
            this.movementAngle += Math.PI; 
        }
        // So that switch tank works, as well as on death
        if (!Entity.exists(this.barrelEntity)) this.destroy();

        this.tickMixin(tick);
    }
    public destroy(animate=true) {
        if (!animate) this.barrelEntity.droneCount -= 1;

        super.destroy(animate);
    }
}