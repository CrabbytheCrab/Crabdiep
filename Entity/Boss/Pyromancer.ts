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

import GameServer from "../../Game";
import Barrel from "../Tank/Barrel";
import AutoTurret, { AutoTurretDefinition } from "../Tank/AutoTurret";
import AbstractBoss from "./AbstractBoss";

import { Color, Tank, PositionFlags, StyleFlags } from "../../Const/Enums";
import { AIState } from "../AI";

import { BarrelDefinition } from "../../Const/TankDefinitions";
import { PI2 } from "../../util";
import ObjectEntity from "../Object";
import { GuardObject } from "../Tank/Addons";

/**
 * Definitions (stats and data) of the mounted turret on Defender
 *
 * Defender's gun
 */
const MountedTurretDefinition: BarrelDefinition = {
    ...AutoTurretDefinition,
    bullet: {
        ...AutoTurretDefinition.bullet,
        speed: 2.3,
        damage: 0.75,
        health: 12.5,
        color: Color.Neutral
    }
};

/**
 * Definitions (stats and data) of the trap launcher on Defender
 */
const DefenderDefinition: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 300,
    width: 80,
    delay: 0,
    reload: 4,
    recoil: 2,
    isTrapezoid: true,
    trapezoidDirection: 3.141592653589793,
    addon: null,
    forceFire: true,
    bullet: {
        type: "swarm",
        sizeRatio: 1,
        health: 5,
        damage: 2,
        speed: 2,
        scatterRate: 1,
        lifeLength: 1,
        absorbtionFactor: 1,
        color: Color.Neutral
    }
}


const DefenderDefinition2: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 240,
    width: 50,
    delay: 0,
    reload: 0.45,
    recoil: 0,
    isTrapezoid: true,
    trapezoidDirection: 3.141592653589793,
    addon: "swarmLauncher",
    forceFire: true,
    bullet: {
        type: "flame",
        sizeRatio: 0.8,
        health: 10,
        damage: 1.5,
        speed: 1.5,
        scatterRate: 2,
        lifeLength: 3,
        absorbtionFactor: 0,
        color: Color.Neutral
    }
}
// The size of a Defender by default
const DEFENDER_SIZE = 275;

/**
 * Class which represents the boss "Defender"
 */
export default class Pyromancer extends AbstractBoss {

    /** Defender's trap launchers */
    private trappers: Barrel[] = [];
    /** See AbstractBoss.movementSpeed */
    public movementSpeed = 0.175;

    public constructor(game: GameServer) {
        super(game);
        this.nameData.values.name = 'Pyromancer';
        this.styleData.values.color = Color.NecromancerSquare;
        this.relationsData.values.team = this.game.arena;
        this.physicsData.values.size = DEFENDER_SIZE * Math.SQRT1_2;
        this.healthData.values.health = this.healthData.values.maxHealth = 6000;
        this.scoreReward = 45000 * this.game.arena.shapeScoreRewardMultiplier;
        this.ai.viewRange = 0;
        this.sizeFactor = 1;
        this.physicsData.values.sides = 5;


        const rotator = new GuardObject(this.game, this, 5, 0.75, 0, -this.ai.passiveRotation )  as GuardObject & { joints: Barrel[]} ;
        rotator.styleData.values.color = Color.NecromancerSquare
        rotator.physicsData.values.sides = 5;

        const offsetRatio = 0;
        const size = this.physicsData.values.size;

       // rotator.setParent(this);
        //rotator.relationsData.values.owner = this;
        rotator.relationsData.values.team = this.relationsData.values.team
        rotator.physicsData.values.size =  this.physicsData.values.size * 0.75;
        rotator.positionData.values.x = offsetRatio * size;
        rotator.positionData.values.angle = 0;
        rotator.joints = [];
        rotator.styleData.zIndex += 2;
        const atuo = new AutoTurret(rotator, {
            angle: 0,
            offset: 0,
            size: 150,
            width: 60,
            delay: 0,
            reload: 0.25,
            recoil: 0,
            isTrapezoid: true,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "bullet",
                sizeRatio: 1,
                health: 2,
                damage: 2,
                speed: 1.5,
                scatterRate: 2,
                lifeLength: 1.75,
                absorbtionFactor: 0.1,
                color: Color.Neutral
            }
        });
        atuo.ai.viewRange = 1800;
        //atuo.ai.passiveRotation = this.movementAngle
        atuo.styleData.values.flags |= StyleFlags.showsAboveParent;
        atuo.baseSize = 65;
        atuo.styleData.zIndex += 3;
        rotator.styleData.values.flags |= StyleFlags.showsAboveParent;
        if (rotator.styleData.values.flags & StyleFlags.showsAboveParent) rotator.styleData.values.flags |= StyleFlags.showsAboveParent;

        for (let i = 0; i < 5; ++i) {
            // Add trap launcher
            this.trappers.push(new Barrel(this, {
                ...DefenderDefinition,
                angle: PI2 * ((i / 5) - 1/10)

            }));


            const barr = new Barrel(rotator, {...DefenderDefinition2, angle: PI2 * ((i / 5) - 1/10)})
            const tickBase2 = barr.tick;

            barr.positionData.values.y += rotator.physicsData.values.size * Math.sin(0.01)
            barr.positionData.values.x += rotator.physicsData.values.size * Math.cos(0.01);
            barr.tick = (tick: number) => {
                barr.positionData.y += rotator.physicsData.values.size * Math.sin(0.01);
                barr.positionData.x += rotator.physicsData.values.size * Math.cos(0.01);

                tickBase2.call(barr, tick);

                //barr.positionData.values.angle = angle + rotator.positionData.values.angle;
            }
            rotator.joints.push(barr);
        }
    }

    public tick(tick: number) {
       super.tick(tick);

       this.sizeFactor = (this.physicsData.values.size / Math.SQRT1_2) / DEFENDER_SIZE;
        if (this.ai.state !== AIState.possessed) {
            this.positionData.angle += this.ai.passiveRotation * Math.PI * Math.SQRT1_2;
        }
    }
}
