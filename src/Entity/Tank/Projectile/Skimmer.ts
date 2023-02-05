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
import Bullet from "./Bullet";

import { InputFlags } from "../../../Const/Enums";
import { Entity } from "../../../Native/Entity";
import { Inputs } from "../../AI";
import { BarrelDefinition, TankDefinition } from "../../../Const/TankDefinitions";
import { BarrelBase } from "../TankBody";
import AutoTurret from "../AutoTurret";
import ObjectEntity from "../../Object";
import RopeSegment from "./RopeSegment";
import Vector from "../../../Physics/Vector";

/**
 * Barrel definition for the rocketeer rocket's barrel.
 */

const RocketBarrelDefinition: BarrelDefinition = {
    angle: 2.520255439879812,
    offset: 0,
    size:  70,
    width:  37.967,
    delay: 0,
    reload: 0.5,
    recoil: 4.5,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.4,
        damage: 3 / 5,
        speed: 1,
        scatterRate: 1,
        lifeLength: 0.4,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};


const RocketBarrelDefinition2: BarrelDefinition = {
    angle: 3.7629298672997744,
    offset: 0,
    size: 70,
    width:  37.967,
    delay: 0,
    reload: 0.5,
    recoil: 4.5,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.4,
        damage: 3 / 5,
        speed: 1,
        scatterRate: 1,
        lifeLength: 0.4,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
/**
 * Represents all rocketeer rockets in game.
 */
export default class Skimmer extends Bullet implements BarrelBase {
    /** The rocket's barrel */
    public k: number;
    public length: number;
    public segments: ObjectEntity[];
    private launrocketBarrel: Barrel[];

    /** The size ratio of the rocket. */
    public sizeFactor: number;
    /** The camera entity (used as team) of the rocket. */
    public cameraEntity: Entity;
    /** The reload time of the rocket's barrel. */
    public reloadTime = 1;
    /** The inputs for when to shoot or not. (Rocket) */
    public inputs = new Inputs();


    public constructor(barrel: Barrel, tank: BarrelBase, tankDefinition: TankDefinition | null, shootAngle: number) {
        super(barrel, tank, tankDefinition, shootAngle);
        
        this.cameraEntity = tank.cameraEntity;
        this.length = 2;
        this.segments = [this.tank];
        this.k = 0.05;
        
        for (let i = 0; i < this.length; i++) 
        {
            const ropeSegment = new RopeSegment(this.barrelEntity, this.tank, null, shootAngle, this);
            ropeSegment.physicsData.size = 5
           //ropeSegment.restLength = this.restLength;

           this.segments.push(ropeSegment);
        }
        this.sizeFactor = this.physicsData.values.size / 50;
        const skimmerBarrels: Barrel[] = this.launrocketBarrel =[];
        const s1 = new class extends Barrel {
            // Keep the width constant
            protected resize() {
                super.resize();
               // this.physicsData.values.width = this.definition.width
                // this.physicsData.state.width = 0;
            }
        }(this, {...RocketBarrelDefinition});
        const s2 = new class extends Barrel {
            // Keep the width constant
            protected resize() {
                super.resize();
               // this.physicsData.width = this.definition.width
            }
        }(this, RocketBarrelDefinition2);

        s1.styleData.values.color = this.styleData.values.color;
        s2.styleData.values.color = this.styleData.values.color;

        skimmerBarrels.push(s1, s2);
    }

    public tick(tick: number) {
        this.sizeFactor = this.physicsData.values.size / 50;
        this.reloadTime = this.tank.reloadTime;

        super.tick(tick);

        if (this.deletionAnimation) return;
        // not fully accurate
        if (tick - this.spawnTick >= this.tank.reloadTime) this.inputs.flags |= InputFlags.leftclick;
        // Only accurate on current version, but we dont want that
        // if (!Entity.exists(this.barrelEntity.rootParent) && (this.inputs.flags & InputFlags.leftclick)) this.inputs.flags ^= InputFlags.leftclick; 

        const segments = Array.from(this.segments);

        for (let i = 1; i < segments.length; i++) 
        {
            const a = segments[i - 1];
            const b = segments[i];
            /*const delta = {
                x: a.positionData.values.x - b.positionData.values.x,
                y: a.positionData.values.y - b.positionData.values.y
            }*/
            const delta = new Vector(a.positionData.values.x - b.positionData.values.x, a.positionData.values.y - b.positionData.values.y);
            const x = delta.magnitude - Math.max(0, 50);
      
            let force = delta.scale(-this.k * x);
      
            if (a.isAffectedByRope) a.addAcceleration(force.x, force.y, false);
      
            force = force.scale(-1);

            if (b.isAffectedByRope) b.addAcceleration(force.x, force.y, false);
        }
    }
}