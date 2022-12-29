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
import AbstractShape from "./AbstractShape";

import { Color, PositionFlags, StyleFlags, NameFlags, ClientBound } from "../../Const/Enums";
import TankBody, { BarrelBase } from "../Tank/TankBody";
import { Entity } from "../../Native/Entity";
import { AI, AIState, Inputs } from "../AI";
import { tps } from "../../config";
import AutoTurret, { AutoTurretDefinition } from "../Tank/AutoTurret";
import Pentagon from "./Pentagon";
import ShapeManager from "./Manager";
import { BarrelDefinition } from "../../Const/TankDefinitions";
import { normalizeAngle, PI2 } from "../../util";
import Barrel from "../Tank/Barrel";
import LivingEntity from "../Live";
import { SandboxShapeManager } from "../../Gamemodes/Sandbox";
import ArenaEntity from "../../Native/Arena";


const GuardianSpawnerDefinition: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 80,
    width: 65,
    delay: 0,
    reload: 8,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: "trapLauncher",
    forceFire: true,
    bullet: {
        type: "trap",
        sizeRatio:0.8,
        health: 5,
        damage: 1.25,
        speed: 2,
        scatterRate: 1,
        lifeLength: 1,
        absorbtionFactor: 1,
        color: Color.Neutral
    }
};

const GuardianSpawnerDefinition2: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 130,
    width: 105,
    delay: 0,
    reload: 8,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    forceFire: true,
    addon: "trapLauncher",
    bullet: {
        type: "trap",
        sizeRatio:0.8,
        health: 4,
        damage: 8,
        speed: 2,
        scatterRate: 1,
        lifeLength: 1,
        absorbtionFactor: 0.1,
        color: Color.Neutral
    }
};
const GuardianSpawnerDefinition3: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 250,
    width: 120,
    delay: 0.5,
    reload: 8,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: "minionLauncher",
    droneCount: 1,
    bullet: {
        type: "pentadrone",
        sizeRatio:1,
        health: 2,
        damage: 6,
        speed: 4,
        scatterRate: 0,
        lifeLength: -1,
        absorbtionFactor: 1,
    }
};
/**
 * Pentagon entity class.
 */
export default class WepPentagon extends Pentagon implements BarrelBase {
    /** If the pentagon is an alpha pentagon or not */
    public isAlpha: boolean;
    protected static BASE_ROTATION = AbstractShape.BASE_ROTATION / 2;
    protected static BASE_ORBIT = AbstractShape.BASE_ORBIT / 2;
    protected static BASE_VELOCITY = AbstractShape.BASE_VELOCITY / 2;
    public sizeFactor: number;
    public cameraEntity: Entity = this;
    //protected arena: ArenaEntity;
    public inputs;
    private trappers: Barrel[] = [];
    private base: AutoTurret[] = [];
    public reloadTime = 4;
    private hasBeenWelcomed = false;
	//protected shapes: ShapeManager = new SandboxShapeManager(arena);
    ai: AI;
    public constructor(game: GameServer, isAlpha=false, shiny=(Math.random() < 0.000001) && !isAlpha) {
        super(game);
        //this.arena = arena;
        this.sizeFactor = this.physicsData.values.size/50;
        this.ai = new AI(this);
        this.ai.viewRange = 1800;
        this.ai.aimSpeed = (this.ai.movementSpeed);
        this.ai['_findTargetInterval'] = tps;
        this.inputs = this.ai.inputs;       
        this.nameData.values.name = isAlpha ? "Penta Lord" : "Weaponized Pentagon";
        if(isAlpha){
            if (this.nameData.values.flags & NameFlags.hiddenName) this.nameData.values.flags ^= NameFlags.hiddenName;
            
            if (!this.hasBeenWelcomed) {
                let message = "The Penta Lord has spawned!"
                this.game.broadcast().u8(ClientBound.Notification).stringNT(message).u32(0x000000).float(10000).stringNT("").send();
                this.hasBeenWelcomed = true;
            }
        const atuo = new AutoTurret(this, {
            angle: 0,
            offset: 0,
            size: 150,
            width: 100,
            delay: 0,
            reload: 4,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "bullet",
                sizeRatio: 1,
                health: 4,
                damage: 3,
                speed: 2,
                scatterRate: 0.3,
                lifeLength: 1.75,
                absorbtionFactor: 0.1,
                color: Color.Neutral
            }
        });
        atuo.ai.viewRange = 1800;
        //atuo.ai.passiveRotation = this.movementAngle
        atuo.styleData.values.flags |= StyleFlags.showsAboveParent;
        const MAX_ANGLE_RANGE = PI2 / 4; // keep within 90º each side
        atuo.baseSize = 80;
        for (let i = 0; i < 5; ++i) {
             const base  = [new AutoTurret(this, GuardianSpawnerDefinition2)];
             base[0].influencedByOwnerInputs = true;
             base[0].baseSize = 80;
             base[0].ai.viewRange = 1800;
            const angle = base[0].ai.inputs.mouse.angle = PI2 * (i / 5);
            base[0].ai.passiveRotation = AI.PASSIVE_ROTATION;
            base[0].positionData.values.y = this.physicsData.values.size * Math.sin(angle) * 1.1;
            base[0].positionData.values.x = this.physicsData.values.size * Math.cos(angle) * 1.1;

            if (base[0].styleData.values.flags & StyleFlags.showsAboveParent) base[0].styleData.values.flags ^= StyleFlags.showsAboveParent;
            base[0].physicsData.values.flags |= PositionFlags.absoluteRotation;
            base[0].ai.targetFilter = (targetPos) => {
                const pos = base[0].getWorldPosition();
                const angleToTarget = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
                
                const deltaAngle = normalizeAngle(angleToTarget - ((angle + this.positionData.values.angle)));

                return deltaAngle < MAX_ANGLE_RANGE || deltaAngle > (PI2 - MAX_ANGLE_RANGE);
            }
            const tickBase = base[0].tick;
            base[0].tick = (tick: number) => {
                base[0].positionData.y = this.physicsData.values.size * Math.sin(angle) * 1.1;
                base[0].positionData.x = this.physicsData.values.size * Math.cos(angle) * 1.1;
                if (base[0].ai.state === AIState.idle) base[0].positionData.angle = angle + this.positionData.values.angle
                tickBase.call(base[0], tick);
            }
        }
        for (let i = 0; i < 5; ++i) {
            // Add trap launcher
            this.trappers.push(new Barrel(this, {
                ...GuardianSpawnerDefinition3,
                angle: PI2 * ((i / 5) - 1 / 10)
            }));
        }
    }
        if(!isAlpha){
            const atuo = new AutoTurret(this, {
                angle: 0,
                offset: 0,
                size: 80,
                width: 43.5,
                delay: 0,
                reload: 3,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    sizeRatio: 1,
                    health: 2,
                    damage: 1.5,
                    speed: 2,
                    scatterRate: 0.3,
                    lifeLength: 1,
                    absorbtionFactor: 0.1,
                    color: Color.Neutral
                }
            });
            atuo.ai.viewRange = 800;
            //atuo.ai.passiveRotation = this.movementAngle
            atuo.styleData.values.flags |= StyleFlags.showsAboveParent;
            atuo.baseSize = 35;
            for (let i = 0; i < 5; ++i) {
                // Add trap launcher
                this.trappers.push(new Barrel(this, {
                    ...GuardianSpawnerDefinition,
                    angle: PI2 * ((i / 5) - 1 / 10)
                }));
            }
            }
        this.healthData.values.health = this.healthData.values.maxHealth = (isAlpha ? 8000 : 2000);
        this.physicsData.values.size = (isAlpha ? 225 : 93.75) * Math.SQRT1_2;
        this.physicsData.values.sides = 5;
        this.styleData.values.color = shiny ? Color.Shiny : Color.EnemyPentagon;

        this.physicsData.values.absorbtionFactor = isAlpha ? 0 : 0.1;
        this.physicsData.values.pushFactor = 2;

        this.isAlpha = isAlpha;
        this.isShiny = shiny;

        this.damagePerTick = isAlpha ? 40 : 16;
        this.scoreReward = isAlpha ? 45000 : 4000;
        
        if (shiny) {
            this.scoreReward *= 100;
            this.healthData.values.health = this.healthData.values.maxHealth *= 10;
        }
    }

    public onDeath(killer: LivingEntity) {
        // Reset arena.boss
        this.game.pentalord = false

        const killerName = (killer instanceof TankBody && killer.nameData.values.name) || "an unnamed tank"
        this.game.broadcast()
            .u8(ClientBound.Notification)
            .stringNT(`The ${this.nameData.values.name} has been defeated by ${killerName}!`)
            .u32(0x000000)
            .float(10000)
            .stringNT("").send();
    }
}
