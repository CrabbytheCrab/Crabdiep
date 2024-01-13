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
import ObjectEntity from "../Object";
import AutoTurret from "./AutoTurret";

import { Color, PositionFlags, PhysicsFlags, StyleFlags, Tank } from "../../Const/Enums";
import TankBody, { BarrelBase } from "./TankBody";
import { addonId, BarrelDefinition } from "../../Const/TankDefinitions";
import { AI, AIState, Inputs } from "../AI";
import { Entity } from "../../Native/Entity";
import LivingEntity from "../Live";
import { normalizeAngle, PI2 } from "../../util";
import Barrel from "./Barrel";
import AiTank from "../Misc/AiTank";
import { pid } from "process";

/**
 * Abstract class to represent an addon in game.
 * 
 * Addons are entities added on to a tank during its creation. There are two types:
 * pre addons, and post addons. Pre addons are built before the barrels are built - for example
 * a dominator's base is a pre addon. A post addon is an addon built after the barrels are
 * built - for example the pronounciation of Ranger's barrel is a post addon.
 * 
 * Read [addons.md on diepindepth](https://github.com/ABCxFF/diepindepth/blob/main/extras/addons.md) 
 * for more details and examples.
 */
export class Addon {
    /** The current game server */
    protected game: GameServer;
    /** Helps the class determine size ratio as well as who is the owner */
    public owner: BarrelBase;

    public constructor(owner: BarrelBase) {
        this.owner = owner;
        this.game = owner.game;
    }

    /**
     * `createGuard` method creates a smasher-like guard shape. 
     * Read (addons.md on diepindepth)[https://github.com/ABCxFF/diepindepth/blob/main/extras/addons.md]
     * for more details and examples.
     */
    public createGuard(sides: number, sizeRatio: number, offsetAngle: number, radiansPerTick: number): LivingEntity {
        return new GuardObject(this.game, this.owner, sides, sizeRatio, offsetAngle, radiansPerTick);
    }
    public createGuard2(): OverdriveAddon {
        return new OverdriveAddon(1.15, this.owner,6);
    }
    public createGuard3(): OverdriveAddon {
        return new OverdriveAddon(1.15, this.owner,3);
    }
    /**
     * `createAutoTurrets` method builds `count` auto turrets around the current
     * tank's body. 
     */
     protected createAutoTurrets(count: number) {
        const rotPerTick = AI.PASSIVE_ROTATION;
        const MAX_ANGLE_RANGE = PI2 / 4; // keep within 90º each side

        const rotator = this.createGuard(1, .1, 0, rotPerTick) as GuardObject & { turrets: AutoTurret[] };
        rotator.turrets = [];

        const ROT_OFFSET = 0.8;

        if (rotator.styleData.values.flags & StyleFlags.isVisible) rotator.styleData.values.flags ^= StyleFlags.isVisible;

        for (let i = 0; i < count; ++i) {
            const base = new AutoTurret(rotator, AutoTurretMiniDefinition);
            base.influencedByOwnerInputs = true;

            const angle = base.ai.inputs.mouse.angle = PI2 * (i / count);
            base.ai.passiveRotation = rotPerTick;
            base.ai.targetFilter = (targetPos) => {
                const pos = base.getWorldPosition();
                const angleToTarget = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
                
                const deltaAngle = normalizeAngle(angleToTarget - ((angle + rotator.positionData.values.angle)));

                return deltaAngle < MAX_ANGLE_RANGE || deltaAngle > (PI2 - MAX_ANGLE_RANGE);
            }

            base.positionData.values.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
            base.positionData.values.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;

            if (base.styleData.values.flags & StyleFlags.showsAboveParent) base.styleData.values.flags ^= StyleFlags.showsAboveParent;
            base.physicsData.values.flags |= PositionFlags.absoluteRotation;

            const tickBase = base.tick;
            base.tick = (tick: number) => {
                base.positionData.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
                base.positionData.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;

                tickBase.call(base, tick);

                if (base.ai.state === AIState.idle) base.positionData.angle = angle + rotator.positionData.values.angle;
            }

            rotator.turrets.push(base);
        }

        return rotator;
    }

    protected createAutoAutoTurrets(count: number) {
        const rotPerTick = AI.PASSIVE_ROTATION;
        const MAX_ANGLE_RANGE = PI2 / 4; // keep within 90º each side

        const rotator = this.createGuard(1, .1, 0, rotPerTick) as GuardObject & { turrets: AutoTurret[] };
        rotator.turrets = [];

        const ROT_OFFSET = 0.8;

        if (rotator.styleData.values.flags & StyleFlags.isVisible) rotator.styleData.values.flags ^= StyleFlags.isVisible;

        for (let i = 0; i < count; ++i) {
            const base = new AutoTurret(rotator, AutoAutoTurretMiniDefinition);
            base.influencedByOwnerInputs = true;

            const angle = base.ai.inputs.mouse.angle = PI2 * (i / count);
            base.ai.passiveRotation = rotPerTick;
            base.ai.targetFilter = (targetPos) => {
                const pos = base.getWorldPosition();
                const angleToTarget = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
                
                const deltaAngle = normalizeAngle(angleToTarget - ((angle + rotator.positionData.values.angle)));

                return deltaAngle < MAX_ANGLE_RANGE || deltaAngle > (PI2 - MAX_ANGLE_RANGE);
            }

            base.positionData.values.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
            base.positionData.values.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;

            if (base.styleData.values.flags & StyleFlags.showsAboveParent) base.styleData.values.flags ^= StyleFlags.showsAboveParent;
            base.physicsData.values.flags |= PositionFlags.absoluteRotation;

            const tickBase = base.tick;
            base.tick = (tick: number) => {
                base.positionData.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
                base.positionData.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;

                tickBase.call(base, tick);

                if (base.ai.state === AIState.idle) base.positionData.angle = angle + rotator.positionData.values.angle;
            }

            rotator.turrets.push(base);
        }

        return rotator;
    }

    protected createAutoTurrets1(count: number) {
        const rotPerTick = AI.PASSIVE_ROTATION;
        const MAX_ANGLE_RANGE = PI2 / 4; // keep within 90º each side

        const rotator = this.createGuard(1, .1, 0, rotPerTick) as GuardObject & { turrets: AutoTurret[] };
        rotator.turrets = [];

        const ROT_OFFSET = 0.8;

        if (rotator.styleData.values.flags & StyleFlags.isVisible) rotator.styleData.values.flags ^= StyleFlags.isVisible;

        for (let i = 0; i < count; ++i) {
                       const base = new AutoTurret(this.owner, AutoTurretMiniDefinition);
            base.influencedByOwnerInputs = true;

            const angle = base.ai.inputs.mouse.angle = PI2 * ((i / count) - 1 / (count * 2));
            //base.ai.passiveRotation = rotPerTick;
            base.ai.targetFilter = (targetPos) => {
                const pos = base.getWorldPosition();
                const angleToTarget = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
                
                const deltaAngle = normalizeAngle(angleToTarget - ((angle + this.owner.positionData.values.angle)));

                return deltaAngle < MAX_ANGLE_RANGE || deltaAngle > (PI2 - MAX_ANGLE_RANGE);
            }

            base.positionData.values.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
            base.positionData.values.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;

            if (base.styleData.values.flags & StyleFlags.showsAboveParent) base.styleData.values.flags ^= StyleFlags.showsAboveParent;
            base.physicsData.values.flags |= PositionFlags.absoluteRotation;

            const tickBase = base.tick;
            base.tick = (tick: number) => {
                base.positionData.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
                base.positionData.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;

                tickBase.call(base, tick);

                if (base.ai.state === AIState.idle) base.positionData.angle = angle + this.owner.positionData.values.angle;
            }

            rotator.turrets.push(base);
        }

        return rotator;
    }


    protected createAutoMachineTurrets(count: number) {
        const rotPerTick = AI.PASSIVE_ROTATION * 6;
        const MAX_ANGLE_RANGE = PI2 / 4; // keep within 90º each side

        const rotator = this.createGuard(1, .1, 0, rotPerTick) as GuardObject & { turrets: AutoTurret[] };
        rotator.turrets = [];

        const ROT_OFFSET = 0.8;

        if (rotator.styleData.values.flags & StyleFlags.isVisible) rotator.styleData.values.flags ^= StyleFlags.isVisible;

        for (let i = 0; i < count; ++i) {
            const base = new AutoTurret(rotator, {...AutoTurretMiniDefinition, reload:0.5,    isTrapezoid: true,
                bullet: {
                    type: "bullet",
                    health: 0.875,
                    damage: 0.3,
                    speed: 1.2,
                    scatterRate: 3,
                    lifeLength: 1,
                    sizeRatio: 1,
                    absorbtionFactor: 1
        }});
            base.influencedByOwnerInputs = true;

            const angle = base.ai.inputs.mouse.angle = PI2 * ((i / count) - 1 / (count * 2));
            base.ai.passiveRotation = rotPerTick;
            base.ai.targetFilter = (targetPos) => {
                const pos = base.getWorldPosition();
                const angleToTarget = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
                
                const deltaAngle = normalizeAngle(angleToTarget - ((angle + rotator.positionData.values.angle)));

                return deltaAngle < MAX_ANGLE_RANGE || deltaAngle > (PI2 - MAX_ANGLE_RANGE);
            }

            base.positionData.values.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
            base.positionData.values.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;

            if (base.styleData.values.flags & StyleFlags.showsAboveParent) base.styleData.values.flags ^= StyleFlags.showsAboveParent;
            base.physicsData.values.flags |= PositionFlags.absoluteRotation;

            const tickBase = base.tick;
            base.tick = (tick: number) => {
                base.positionData.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
                base.positionData.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;

                tickBase.call(base, tick);

                if (base.ai.state === AIState.idle) base.positionData.angle = angle + rotator.positionData.values.angle;
            }

            rotator.turrets.push(base);
        }

        return rotator;
    }
    
    
    protected createAutoTurretsWeak(count: number) {
        const rotPerTick = AI.PASSIVE_ROTATION;
        const MAX_ANGLE_RANGE = PI2 / 4; // keep within 90º each side

        const rotator = this.createGuard(1, .1, 0, rotPerTick) as GuardObject & { turrets: AutoTurret[] };
        rotator.turrets = [];

        const ROT_OFFSET = 0.8;

        if (rotator.styleData.values.flags & StyleFlags.isVisible) rotator.styleData.values.flags ^= StyleFlags.isVisible;

        for (let i = 0; i < count; ++i) {
                       const base = new AutoTurret(this.owner, {...AutoTurretMiniDefinition, reload:1, delay:0.25});
            base.influencedByOwnerInputs = false;

            const angle = base.ai.inputs.mouse.angle = PI2 * ((i / count) - 1 / (count * 2));
            //base.ai.passiveRotation = rotPerTick;
            base.ai.targetFilter = (targetPos) => {
                const pos = base.getWorldPosition();
                const angleToTarget = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
                
                const deltaAngle = normalizeAngle(angleToTarget - ((angle + this.owner.positionData.values.angle)));

                return deltaAngle < MAX_ANGLE_RANGE || deltaAngle > (PI2 - MAX_ANGLE_RANGE);
            }

            base.positionData.values.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
            base.positionData.values.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;

            if (base.styleData.values.flags & StyleFlags.showsAboveParent) base.styleData.values.flags ^= StyleFlags.showsAboveParent;
            base.physicsData.values.flags |= PositionFlags.absoluteRotation;

            const tickBase = base.tick;
            base.tick = (tick: number) => {
                base.positionData.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
                base.positionData.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;

                tickBase.call(base, tick);

                if (base.ai.state === AIState.idle) base.positionData.angle = angle + this.owner.positionData.values.angle;
            }

            rotator.turrets.push(base);
        }

        return rotator;
    }
    protected createAutoTurretsDisconnected(count: number) {
        const rotPerTick = AI.PASSIVE_ROTATION;
        const MAX_ANGLE_RANGE = PI2; // keep within 90º each side
        const MAX_ANGLE_RANGE2 = PI2; // keep within 90º each side
        const rotator = new GuardObject3(this.game, this.owner,1, .1, 0, rotPerTick) as GuardObject3 & { turrets: AutoTurret[] };
        rotator.turrets = [];
        //rotator.joints = [];
                rotator.styleData.values.zIndex += 2;
        const ROT_OFFSET = 1.8;
            rotator.styleData.values.flags |= StyleFlags.showsAboveParent;
        if (rotator.styleData.values.flags & StyleFlags.isVisible) rotator.styleData.values.flags ^= StyleFlags.isVisible;
        if (rotator.styleData.values.flags & StyleFlags.showsAboveParent) rotator.styleData.values.flags |= StyleFlags.showsAboveParent;
        
        const tickBaserot = rotator.tick;
        rotator.tick = (tick: number) => {
        
        if (rotator.styleData.zIndex !== this.owner.styleData.zIndex + 1){
            rotator.styleData.zIndex = this.owner.styleData.zIndex + 5
        }
        //base.positionData.values.x += rotator.physicsData.values.size * Math.cos(MAX_ANGLE_RANGE2)  * ROT_OFFSET;

        tickBaserot.call(rotator, tick);
        }
        for (let i = 0; i < count; ++i) {
            const base = new AutoTurret(rotator, {...AutoTurretMiniDefinitionabove, reload:1.2});
                    base.styleData.values.zIndex += 2;
                    base.turret[0].styleData.values.zIndex += 2;
            base.influencedByOwnerInputs = true;
            base.relationsData.owner = this.owner;
            //base.turret.relationsData.owner = this.owner;
            base.styleData.values.flags |= StyleFlags.showsAboveParent;

            const angle = base.ai.inputs.mouse.angle = PI2 * (i / count);
            base.ai.passiveRotation = rotPerTick;
            base.ai.targetFilter = (targetPos) => {
                const pos = base.getWorldPosition();
                const angleToTarget = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
                
                const deltaAngle = normalizeAngle(angleToTarget - ((angle + rotator.positionData.values.angle)));

                return deltaAngle < MAX_ANGLE_RANGE || deltaAngle > (PI2 - MAX_ANGLE_RANGE);
            }

            base.positionData.values.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
            base.positionData.values.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;

        // if (base.styleData.values.flags & StyleFlags.showsAboveParent) base.styleData.values.flags ^= StyleFlags.showsAboveParent;
            base.physicsData.values.flags |= PositionFlags.absoluteRotation;

            const tickBase = base.tick;
            base.tick = (tick: number) => {
            base.positionData.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
            base.positionData.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;
            //base.positionData.values.x += rotator.physicsData.values.size * Math.cos(MAX_ANGLE_RANGE2)  * ROT_OFFSET;

                tickBase.call(base, tick);

                if (base.ai.state === AIState.idle) base.positionData.angle = angle + rotator.positionData.values.angle;
            }

            rotator.turrets.push(base)
        }

        return rotator;
    }


    protected createJoints(count: number) {
        const rotPerTick = AI.PASSIVE_ROTATION;
        const MAX_ANGLE_RANGE = PI2; // keep within 90º each side

        const rotator = this.createGuard(1, .1, 0, 0.01) as GuardObject & { joints: Barrel[]};
        rotator.joints = [];
        //rotator.joints = [];

        const ROT_OFFSET = 1.8;

        if (rotator.styleData.values.flags & StyleFlags.isVisible) rotator.styleData.values.flags ^= StyleFlags.isVisible;

        for (let i = 0; i < count; ++i) {

            const barr = new Barrel(rotator, {...jointpart, angle: PI2 * ((i / count))})
            const tickBase2 = barr.tick;

            barr.positionData.values.y += rotator.physicsData.values.size * Math.sin(MAX_ANGLE_RANGE)
            barr.positionData.values.x += rotator.physicsData.values.size * Math.cos(MAX_ANGLE_RANGE);
            barr.tick = (tick: number) => {
                barr.positionData.y += rotator.physicsData.values.size * Math.sin(MAX_ANGLE_RANGE);
                barr.positionData.x += rotator.physicsData.values.size * Math.cos(MAX_ANGLE_RANGE);

                tickBase2.call(barr, tick);

                //barr.positionData.values.angle = angle + rotator.positionData.values.angle;
            }
            rotator.joints.push(barr);
        }

        return rotator;
    }
    protected createDrones(count: number) {
        const rotPerTick = AI.PASSIVE_ROTATION;
        const MAX_ANGLE_RANGE = PI2; // keep within 90º each side

        const rotator = this.createGuard(1, .1, 0, 0.01) as GuardObject & { joints: Barrel[]};
        rotator.joints = [];
        //rotator.joints = [];

        const ROT_OFFSET = 1.8;

        if (rotator.styleData.values.flags & StyleFlags.isVisible) rotator.styleData.values.flags ^= StyleFlags.isVisible;

        for (let i = 0; i < count; ++i) {

            const barr = new Barrel(this.owner, {...dronebarrel, angle: PI2 * ((i / count))})
            const tickBase2 = barr.tick;

            barr.positionData.values.y += rotator.physicsData.values.size * Math.sin(MAX_ANGLE_RANGE)
            barr.positionData.values.x += rotator.physicsData.values.size * Math.cos(MAX_ANGLE_RANGE);
            barr.tick = (tick: number) => {
                barr.positionData.y += rotator.physicsData.values.size * Math.sin(MAX_ANGLE_RANGE);
                barr.positionData.x += rotator.physicsData.values.size * Math.cos(MAX_ANGLE_RANGE);

                tickBase2.call(barr, tick);

                //barr.positionData.values.angle = angle + rotator.positionData.values.angle;
            }
            rotator.joints.push(barr);
        }

        return rotator;
    }
    
    protected createAutoStalkerTurrets(count: number) {
        const rotPerTick = AI.PASSIVE_ROTATION;
        const MAX_ANGLE_RANGE = PI2 / 4; // keep within 90º each side

        const rotator = this.createGuard(1, 1.5, 0, rotPerTick) as GuardObject & { turrets: AutoTurret[] };
        rotator.turrets = [];
        rotator.styleData.values.color = Color.Barrel
        const ROT_OFFSET = 0.8;

        if (rotator.styleData.values.flags & StyleFlags.isVisible) rotator.styleData.values.flags ^= StyleFlags.isVisible;

        for (let i = 0; i < count; ++i) {
            const base = new AutoTurret(rotator, AutoTurretStalkDefinition);
            base.influencedByOwnerInputs = true;
            base.baseSize *= 1.1
            const angle = base.ai.inputs.mouse.angle = PI2 * (i / count);
            base.ai.passiveRotation = rotPerTick;
            base.ai.targetFilter = (targetPos) => {
                const pos = base.getWorldPosition();
                const angleToTarget = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
                
                const deltaAngle = normalizeAngle(angleToTarget - ((angle + rotator.positionData.values.angle)));

                return deltaAngle < MAX_ANGLE_RANGE || deltaAngle > (PI2 - MAX_ANGLE_RANGE);
            }

            base.positionData.values.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
            base.positionData.values.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;

            if (base.styleData.values.flags & StyleFlags.showsAboveParent) base.styleData.values.flags ^= StyleFlags.showsAboveParent;
            base.physicsData.values.flags |= PositionFlags.absoluteRotation;

            const tickBase = base.tick;
            base.tick = (tick: number) => {
                base.positionData.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
                base.positionData.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;

                tickBase.call(base, tick);

                if (base.ai.state === AIState.idle) base.positionData.angle = angle + rotator.positionData.values.angle;
            }

            rotator.turrets.push(base);
        }

        return rotator;
    }


    protected createAutoTrapTurrets(count: number) {
        const rotPerTick = AI.PASSIVE_ROTATION * 3;
        const MAX_ANGLE_RANGE = PI2 / 4; // keep within 90º each side

        const rotator = this.createGuard(1, .1, 0, rotPerTick) as GuardObject & { turrets: AutoTurret[] };
        rotator.turrets = [];

        const ROT_OFFSET = 0.8;

        if (rotator.styleData.values.flags & StyleFlags.isVisible) rotator.styleData.values.flags ^= StyleFlags.isVisible;

        for (let i = 0; i < count; ++i) {
            const base = new AutoTurret(rotator, AutoTurretTrapDefinition);
            base.influencedByOwnerInputs = true;
            base.baseSize *= 1.125
            const angle = base.ai.inputs.mouse.angle = PI2 * (i / count);
            base.ai.passiveRotation = rotPerTick;
            base.ai.targetbullets = true
            base.ai.targetFilter = (targetPos) => {
                const pos = base.getWorldPosition();
                const angleToTarget = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
                
                const deltaAngle = normalizeAngle(angleToTarget - ((angle + rotator.positionData.values.angle)));

                return deltaAngle < MAX_ANGLE_RANGE || deltaAngle > (PI2 - MAX_ANGLE_RANGE);
            }

            base.positionData.values.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
            base.positionData.values.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;

            if (base.styleData.values.flags & StyleFlags.showsAboveParent) base.styleData.values.flags ^= StyleFlags.showsAboveParent;
            base.physicsData.values.flags |= PositionFlags.absoluteRotation;

            const tickBase = base.tick;
            base.tick = (tick: number) => {
                base.positionData.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
                base.positionData.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;

                tickBase.call(base, tick);

                if (base.ai.state === AIState.idle) base.positionData.angle = angle + rotator.positionData.values.angle;
            }

            rotator.turrets.push(base);
        }

        return rotator;
    }

    protected createMegaAutoTurrets(count: number) {
        const rotPerTick = AI.PASSIVE_ROTATION;
        const MAX_ANGLE_RANGE = PI2 / 4; // keep within 90º each side

        const rotator = this.createGuard(1, .1, 0, rotPerTick) as GuardObject & { turrets: AutoTurret[] };
        rotator.turrets = [];
        const ROT_OFFSET = 0.8;

        if (rotator.styleData.values.flags & StyleFlags.isVisible) rotator.styleData.values.flags ^= StyleFlags.isVisible;

        for (let i = 0; i < count; ++i) {
            const base = new AutoTurret(rotator, AutoTurretMegaDefinition);
            base.influencedByOwnerInputs = true;
            base.baseSize *= 1.25
            const angle = base.ai.inputs.mouse.angle = PI2 * (i / count);
            base.ai.passiveRotation = rotPerTick;
            base.ai.targetFilter = (targetPos) => {
                const pos = base.getWorldPosition();
                const angleToTarget = Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x);
                
                const deltaAngle = normalizeAngle(angleToTarget - ((angle + rotator.positionData.values.angle)));

                return deltaAngle < MAX_ANGLE_RANGE || deltaAngle > (PI2 - MAX_ANGLE_RANGE);
            }

            base.positionData.values.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
            base.positionData.values.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;

            if (base.styleData.values.flags & StyleFlags.showsAboveParent) base.styleData.values.flags ^= StyleFlags.showsAboveParent;
            base.physicsData.values.flags |= PositionFlags.absoluteRotation;

            const tickBase = base.tick;
            base.tick = (tick: number) => {
                base.positionData.y = this.owner.physicsData.values.size * Math.sin(angle) * ROT_OFFSET;
                base.positionData.x = this.owner.physicsData.values.size * Math.cos(angle) * ROT_OFFSET;

                tickBase.call(base, tick);

                if (base.ai.state === AIState.idle) base.positionData.angle = angle + rotator.positionData.values.angle;
            }

            rotator.turrets.push(base);
        }

        return rotator;
    }

}
const jointpart: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 100,
    width: 25.2,
    delay: 0,
    reload: 8,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    droneCount: 0,
    bullet: {
        type: "pentadrone",
        sizeRatio:1,
        health: 5,
        damage: 4,
        speed: 3,
        scatterRate: 0,
        lifeLength: -1,
        absorbtionFactor: 1,
    }
};
const dronebarrel: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 95,
    width: 42,
    delay: 0,
    reload: 1.2,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        sizeRatio:1,
        health: 1,
        damage: 0.65,
        speed: 1,
        scatterRate: 1,
        lifeLength: 1,
        absorbtionFactor: 1,
    }
};
const AutoTurretStalkDefinition: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 65,
    width: 42 * 0.7,
    delay: 0.01,
    reload: 1.5,
    recoil: 0,
    isTrapezoid: true,
    trapezoidDirection: 3.141592653589793,
    addon: null,
    bullet: {
        type: "bullet",
        health: 1,
        damage: 0.5,
        speed: 1.7,
        scatterRate: 0.3,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};


const AutoTurretMegaDefinition: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 65,
    width: 71.4 * 0.7,
    delay: 0.01,
    reload: 2.5,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 1.35,
        damage: 1.15,
        speed: 0.85,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 0.5
    }
};
const AutoTurretTrapDefinition: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 40,
    width: 56.7 * 0.7,
    delay: 0.01,
    reload: 3,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: "noScale",
    bullet: {
        type: "trap",
        health: 1.75,
        damage: 1,
        speed: 2.5,
        scatterRate: 1,
        lifeLength: 2.25,
        sizeRatio: 0.8,
        absorbtionFactor: 0.8
    }
};


const AutoTurretMiniDefinition: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 55,
    width: 42 * 0.7,
    delay: 0.01,
    reload: 1,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 1,
        damage: 0.4,
        speed: 1.2,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};


const AutoTurretMiniDefinitionabove: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 55,
    width: 42 * 0.7,
    delay: 0.01,
    reload: 1,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "abovebullet",
        health: 1,
        damage: 0.4,
        speed: 1.2,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const AutoAutoTurretMiniDefinition: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 55,
    width: 42 * 0.7,
    delay: 0.01,
    reload: 2,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: "autoLauncher",
    bullet: {
        type: "autobullet",
        health: 1,
        damage: 0.4,
        speed: 0.9,
        scatterRate: 1,
        lifeLength: 1.2,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
/**
 * A smasher-like guard object.
 * Read (addons.md on diepindepth)[https://github.com/ABCxFF/diepindepth/blob/main/extras/addons.md]
 * for more details and examples.
 */


export class OverdriveAddon extends Addon {
    public sizeRatio: number;
    public constructor(sizeRatio: number, owner: BarrelBase,sides: number) {
        super(owner);
        sizeRatio *= Math.SQRT1_2
        this.sizeRatio = sizeRatio;
        const oversquare = new ObjectEntity(this.game);
        const offsetRatio = 0;
        const size = this.owner.physicsData.values.size;

        oversquare.setParent(this.owner);
        oversquare.relationsData.values.owner = this.owner;
        oversquare.relationsData.values.team = this.owner.relationsData.values.team

        oversquare.physicsData.values.size = sizeRatio * size;
        oversquare.positionData.values.x = offsetRatio * size;
        oversquare.positionData.values.angle = 0;
        oversquare.styleData.zIndex -= 2;
        
        oversquare.styleData.values.color = Color.Border;
        oversquare.physicsData.values.sides = sides;

        oversquare.tick = () => {
            const size = this.owner.physicsData.values.size;
            oversquare.styleData.opacity = this.owner.styleData.opacity;
            oversquare.physicsData.size = sizeRatio * size;
            oversquare.positionData.x = offsetRatio * size;
        }
    }
}
export class GuardObject extends LivingEntity implements BarrelBase {
    /***** From BarrelBase *****/
    public inputs: Inputs;
    public cameraEntity: Entity;
    public reloadTime: number;

    /** Helps the class determine size ratio as well as who is the owner */
    public owner: BarrelBase;
    /** To store the size ratio (in compared to the owner) */
    public sizeRatio: number;
    /** Radians per tick, how many radians the guard will rotate in a tick */
    public radiansPerTick: number;

    public constructor(game: GameServer, owner: BarrelBase, sides: number, sizeRatio: number, offsetAngle: number, radiansPerTick: number) {
        super(game);
        this.damagePerTick = 10
        this.owner = owner;
        this.inputs = owner.inputs;
        this.cameraEntity = owner.cameraEntity;
        // It's weird, but it's how it works
        sizeRatio *= Math.SQRT1_2
        this.sizeRatio = sizeRatio;
        this.radiansPerTick = radiansPerTick;

        this.setParent(owner);
        this.relationsData.values.owner = owner;
        this.relationsData.values.team = owner.relationsData.values.team;

        this.styleData.values.color = Color.Border;
        this.positionData.values.flags |= PositionFlags.absoluteRotation;
        this.positionData.values.angle = offsetAngle;
        this.physicsData.values.sides = sides;
        this.reloadTime = owner.reloadTime;
        this.physicsData.values.size = owner.physicsData.values.size * sizeRatio;
    }

    
    /**
     * Size factor, used for calculation of the turret and base size.
     */
    get sizeFactor() {
        return this.owner.sizeFactor;
    }

    /**
     * Called (if ever) similarly to LivingEntity.onKill
     * Spreads onKill to owner
     */
    public onKill(killedEntity: LivingEntity) {
        if (!(this.owner instanceof LivingEntity)) return;
        this.owner.onKill(killedEntity);
    }

    public tick(tick: number): void {
        this.reloadTime = this.owner.reloadTime;
        this.physicsData.size = this.sizeRatio * this.owner.physicsData.values.size;
        this.positionData.angle += this.radiansPerTick;
        // It won't ever do any collisions, so no need to tick the object
        // super.tick(tick);
    }
}


export class GuardObject2 extends ObjectEntity implements BarrelBase {
    /***** From BarrelBase *****/
    public inputs: Inputs;
    public cameraEntity: Entity;
    public reloadTime: number;

    /** Helps the class determine size ratio as well as who is the owner */
    public owner: BarrelBase;
    /** To store the size ratio (in compared to the owner) */
    public sizeRatio: number;
    /** Radians per tick, how many radians the guard will rotate in a tick */
    public radiansPerTick: number;

    public constructor(game: GameServer, owner: BarrelBase, sides: number, sizeRatio: number, offsetAngle: number, radiansPerTick: number) {
        super(game);

        this.owner = owner;
        this.inputs = owner.inputs;
        this.cameraEntity = owner.cameraEntity;
        // It's weird, but it's how it works
        sizeRatio *= Math.SQRT1_2
        this.sizeRatio = sizeRatio;
        this.radiansPerTick = radiansPerTick;

        this.setParent(owner);
        this.relationsData.values.owner = owner;
        this.relationsData.values.team = owner.relationsData.values.team;
this.styleData.zIndex += 2
this.styleData.flags |= StyleFlags.showsAboveParent
        this.styleData.values.color = Color.Border;
        this.positionData.values.flags |= PositionFlags.absoluteRotation;
        this.positionData.values.angle = offsetAngle;
        this.physicsData.values.sides = sides;
        this.reloadTime = owner.reloadTime;
        this.physicsData.values.size = owner.physicsData.values.size * sizeRatio;
    }

    
    /**
     * Size factor, used for calculation of the turret and base size.
     */
    get sizeFactor() {
        return this.owner.sizeFactor;
    }

    /**
     * Called (if ever) similarly to LivingEntity.onKill
     * Spreads onKill to owner
     */
    public onKill(killedEntity: LivingEntity) {
        if (!(this.owner instanceof LivingEntity)) return;
        this.owner.onKill(killedEntity);
    }

    public tick(tick: number): void {
        this.reloadTime = this.owner.reloadTime;
        this.physicsData.size = this.sizeRatio * this.owner.physicsData.values.size;
        this.positionData.angle = this.owner.positionData.angle
        // It won't ever do any collisions, so no need to tick the object
        // super.tick(tick);
    }
}


export class GuardObject3 extends ObjectEntity implements BarrelBase {
    /***** From BarrelBase *****/
    public inputs: Inputs;
    public cameraEntity: Entity;
    public reloadTime: number;

    /** Helps the class determine size ratio as well as who is the owner */
    public owner: BarrelBase;
    /** To store the size ratio (in compared to the owner) */
    public sizeRatio: number;
    /** Radians per tick, how many radians the guard will rotate in a tick */
    public radiansPerTick: number;

    public constructor(game: GameServer, owner: BarrelBase, sides: number, sizeRatio: number, offsetAngle: number, radiansPerTick: number) {
        super(game);

        this.owner = owner;
        this.inputs = owner.inputs;
        this.cameraEntity = owner.cameraEntity;
        // It's weird, but it's how it works
        sizeRatio *= Math.SQRT1_2
        this.sizeRatio = sizeRatio;
        this.radiansPerTick = radiansPerTick;

        this.setParent(owner);
        this.relationsData.values.owner = owner;
        this.relationsData.values.team = owner.relationsData.values.team;
this.styleData.zIndex += 2
this.styleData.flags |= StyleFlags.showsAboveParent
        this.styleData.values.color = Color.Border;
        this.positionData.values.flags |= PositionFlags.absoluteRotation;
        this.positionData.values.angle = offsetAngle;
        this.physicsData.values.sides = sides;
        this.reloadTime = owner.reloadTime;
        this.physicsData.values.size = owner.physicsData.values.size * sizeRatio;
    }

    
    /**
     * Size factor, used for calculation of the turret and base size.
     */
    get sizeFactor() {
        return this.owner.sizeFactor;
    }

    /**
     * Called (if ever) similarly to LivingEntity.onKill
     * Spreads onKill to owner
     */
    public onKill(killedEntity: LivingEntity) {
        if (!(this.owner instanceof LivingEntity)) return;
        this.owner.onKill(killedEntity);
    }

    public tick(tick: number): void {
        this.reloadTime = this.owner.reloadTime;
        this.physicsData.size = this.sizeRatio * this.owner.physicsData.values.size;
        this.positionData.angle += this.radiansPerTick
        // It won't ever do any collisions, so no need to tick the object
        // super.tick(tick);
    }
}

/** Spikes addon. */
class SpikeAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        this.createGuard(3, 1.3, 0, 0.17);
        this.createGuard(3, 1.3, Math.PI / 3, 0.17);
        this.createGuard(3, 1.3, Math.PI / 6, 0.17);
        this.createGuard(3, 1.3, Math.PI / 2, 0.17);
    }
}
/** Dominator's Base addon. */
class DomBaseAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        this.createGuard(6, 1.24, 0, 0);
    }
}
/** Smasher addon. */
class SmasherAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        this.createGuard(6, 1.15, 0, .1);
    }
}

class VampSmasherAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);
        const atuo = new AutoTurret(owner, {
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
        //atuo.ai.passiveRotation = this.movementAngle
        atuo.ai.viewRange = 0
        atuo.styleData.color = Color.Vampire
        const b = this.createGuard(3, 1.4, 0, .1);
        b.styleData.color = Color.Vampire
        const c = this.createGuard(3, 1.4, -Math.PI/3, .1);
        c.styleData.color = Color.Vampire

        this.createGuard(6, 1.15, 0, .1);
    }
}
class OverDriveAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        const b = new GuardObject2(this.game, this.owner, 4, 0.55, 0, 0);;
        b.styleData.color = Color.Barrel
    }
}

class RotatorAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);
        const rotator = new GuardObject3(this.game, owner, 1, 0.75, 0, 0.1) as GuardObject3 & { turrets: Barrel[] };
        rotator.styleData.color = Color.Barrel
        const offsetRatio = 40 / 50;
        const size = this.owner.physicsData.values.size;
        rotator.physicsData.size = owner.sizeFactor * 25
        rotator.positionData.angle = owner.positionData.angle
        const tickBase2 = rotator.tick;
        rotator.tick = (tick: number) => {
            rotator.physicsData.size = owner.sizeFactor * 25
            tickBase2.call(rotator, tick);

            //barr.positionData.values.angle = angle + rotator.positionData.values.angle;
        }
        for (let i = 0; i < 2; ++i) {
            const AutoTurretDefinition: BarrelDefinition = {
                angle: PI2/2 * i + Math.PI/2,
                offset: 0,
                size: 55,
                width: 42 * 0.7,
                delay: 0.01,
                reload: 1,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    health: 1,
                    damage: 0.3,
                    speed: 1.2,
                    scatterRate: 1,
                    lifeLength: 1,
                    sizeRatio: 1,
                    absorbtionFactor: 1
                }
            }
            const base = new Barrel(rotator, AutoTurretDefinition);
        }
    }
}

class WhirlygigAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);
        const rotator = new GuardObject3(this.game, owner, 1, 0.75, 0, 0.1) as GuardObject3 & { turrets: Barrel[] };
        rotator.styleData.color = Color.Barrel
        const offsetRatio = 40 / 50;
        const size = this.owner.physicsData.values.size;
        rotator.physicsData.size = owner.sizeFactor * 25
        rotator.positionData.angle = owner.positionData.angle
        const tickBase2 = rotator.tick;
        rotator.tick = (tick: number) => {
            rotator.physicsData.size = owner.sizeFactor * 25
            tickBase2.call(rotator, tick);

            //barr.positionData.values.angle = angle + rotator.positionData.values.angle;
        }
        for (let i = 0; i < 4; ++i) {
            const AutoTurretDefinition: BarrelDefinition = {
                angle: PI2/4 * i,
                offset: 0,
                size: 55,
                width: 42 * 0.7,
                delay: 0.01,
                reload: 1,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    health: 1,
                    damage: 0.3,
                    speed: 1.2,
                    scatterRate: 1,
                    lifeLength: 1,
                    sizeRatio: 1,
                    absorbtionFactor: 1
                }
            }
            const base = new Barrel(rotator, AutoTurretDefinition);
        }
    }
}

class SpinnerAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        const rotator = new GuardObject3(this.game, owner, 1, 0.75, 0, 0.1) as GuardObject3 & { turrets: Barrel[] };
        rotator.styleData.color = Color.Barrel
        const offsetRatio = 40 / 50;
        const size = this.owner.physicsData.values.size;
        rotator.physicsData.size = owner.sizeFactor * 25
        rotator.positionData.angle = owner.positionData.angle
        const tickBase2 = rotator.tick;
        rotator.tick = (tick: number) => {
            rotator.physicsData.size = owner.sizeFactor * 25
            tickBase2.call(rotator, tick);

            //barr.positionData.values.angle = angle + rotator.positionData.values.angle;
        }
        for (let i = 0; i < 3; ++i) {
            const AutoTurretDefinition: BarrelDefinition = {
                angle: PI2/3 * i,
                offset: 0,
                size: 55,
                width: 42 * 0.7,
                delay: 0.01,
                reload: 1,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    health: 1,
                    damage: 0.3,
                    speed: 1.2,
                    scatterRate: 1,
                    lifeLength: 1,
                    sizeRatio: 1,
                    absorbtionFactor: 1
                }
            }
            const base = new Barrel(rotator, AutoTurretDefinition);
        }
        for (let i = 0; i < 3; ++i) {
            const AutoTurretDefinition: BarrelDefinition = {
                angle: PI2/3 * i + PI2/6,
                offset: 0,
                size: 55,
                width: 42 * 0.7,
                delay: 0.51,
                reload: 1,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    health: 1,
                    damage: 0.3,
                    speed: 1.2,
                    scatterRate: 1,
                    lifeLength: 1,
                    sizeRatio: 1,
                    absorbtionFactor: 1
                }
            }
            const base = new Barrel(rotator, AutoTurretDefinition);
        }
    }
}

class RotaryAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        const rotator = new GuardObject3(this.game, owner, 1, 0.75, 0, 0) as GuardObject3 & { turrets: Barrel[] };
        rotator.styleData.color = Color.Barrel
        const offsetRatio = 40 / 50;
        const size = this.owner.physicsData.values.size;
        rotator.physicsData.size = owner.sizeFactor * 25
        rotator.positionData.angle = owner.positionData.angle
        const tickBase2 = rotator.tick;
        rotator.tick = (tick: number) => {
            rotator.physicsData.size = owner.sizeFactor * 25
            rotator.positionData.angle += ((1 - owner.reloadspeed) * 0.5)
            tickBase2.call(rotator, tick);

            //barr.positionData.values.angle = angle + rotator.positionData.values.angle;
        }
        for (let i = 0; i < 4; ++i) {
            const AutoTurretDefinition: BarrelDefinition = {
                angle: PI2/4 * i,
                offset: 0,
                size: 55,
                width: 42 * 0.7,
                delay: 0.01,
                reload: 1,
                recoil: 0,
                isTrapezoid: false,
                trapezoidDirection: 0,
                addon: null,
                bullet: {
                    type: "bullet",
                    health: 0.45,
                    damage: 0.5,
                    speed: 1.1,
                    scatterRate: 1,
                    lifeLength: 0.5,
                    sizeRatio: 1,
                    absorbtionFactor: 1
                }
            }
            const base = new Barrel(rotator, AutoTurretDefinition);
        }
    }
}

class BumperAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        this.createGuard(1, 1.75, 0, .1);
    }
}

class WhirlwindAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        const x = this.createGuard(1, 1.75, 0, .1);
        x.styleData.color = Color.Barrel

    }
}

class MultiBoxAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);
        const pronounce = new ObjectEntity(this.game);
        const size = this.owner.physicsData.values.size;

        pronounce.setParent(this.owner);
        pronounce.relationsData.values.owner = this.owner;
        pronounce.relationsData.values.team = this.owner.relationsData.values.team

        pronounce.physicsData.values.size = size * 0.5;
        pronounce.styleData.flags |= StyleFlags.showsAboveParent 
        pronounce.styleData.values.color = owner.styleData.values.color;
        pronounce.physicsData.values.sides = 1;
        const tickBase = pronounce.tick;

        pronounce.tick = (tick: number) => {
            const size = this.owner.physicsData.values.size;

            pronounce.physicsData.size = size * 0.5;
            tickBase.call(pronounce, tick);
        }
    }
}

class MultiBoxxerAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);
        const pronounce = new ObjectEntity(this.game);
        const size = this.owner.physicsData.values.size;

        pronounce.setParent(this.owner);
        pronounce.relationsData.values.owner = this.owner;
        pronounce.relationsData.values.team = this.owner.relationsData.values.team

        pronounce.physicsData.values.size = size * 0.5;
        pronounce.styleData.flags |= StyleFlags.showsAboveParent 
        pronounce.styleData.values.color = owner.styleData.values.color;
        pronounce.physicsData.values.sides = 1;
        const tickBase = pronounce.tick;

        pronounce.tick = (tick: number) => {
            const size = this.owner.physicsData.values.size;

            pronounce.physicsData.size = size * 0.5;
            tickBase.call(pronounce, tick);
        }

        const pronounce2 = new ObjectEntity(this.game);

        pronounce2.setParent(this.owner);
        pronounce2.relationsData.values.owner = this.owner;
        pronounce2.relationsData.values.team = this.owner.relationsData.values.team

        pronounce2.physicsData.values.size = size * 0.25;
        pronounce2.styleData.flags |= StyleFlags.showsAboveParent 
        pronounce2.styleData.values.color = owner.styleData.values.color;
        pronounce2.physicsData.values.sides = 1;
        const tickBase2 = pronounce2.tick;

        pronounce2.tick = (tick: number) => {
            const size = this.owner.physicsData.values.size;

            pronounce2.physicsData.size = size * 0.25;
            tickBase2.call(pronounce2, tick);
        }
    }
}
/** Landmine addon. */
class LandmineAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        this.createGuard(6, 1.15, 0, .1);
        this.createGuard(6, 1.15, 0, .05);
    }
}
/** The thing underneath Rocketeer and Twister addon. */
export class LauncherAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        const launcher = new ObjectEntity(this.game);
        const sizeRatio = 65.5 * Math.SQRT2 / 50;
        const widthRatio = 33.6 / 50;
        const size = this.owner.physicsData.values.size;

        launcher.setParent(this.owner);
        launcher.relationsData.values.owner = this.owner;
        launcher.relationsData.values.team = this.owner.relationsData.values.team;

        launcher.physicsData.values.size = sizeRatio * size;
        launcher.physicsData.values.width = widthRatio * size;
        launcher.positionData.values.x = launcher.physicsData.values.size / 2;

        launcher.styleData.values.color = Color.Barrel;
        launcher.physicsData.values.flags |= PhysicsFlags.isTrapezoid;
        launcher.physicsData.values.sides = 2;

        launcher.tick = () => {
            const size = this.owner.physicsData.values.size;

            launcher.physicsData.size = sizeRatio * size;
            launcher.physicsData.width = widthRatio * size;
            launcher.positionData.x = launcher.physicsData.values.size / 2;
        }
    }
}

export class GliderAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        const launcher = new ObjectEntity(this.game);
        const sizeRatio = 65.5 * Math.SQRT2 / 50;
        const widthRatio = 33.6 / 50;
        const size = this.owner.physicsData.values.size;

        launcher.setParent(this.owner);
        launcher.relationsData.values.owner = this.owner;
        launcher.relationsData.values.team = this.owner.relationsData.values.team;
        launcher.positionData.values.angle = Math.PI;

        launcher.physicsData.values.size = sizeRatio * size;
        launcher.physicsData.values.width = widthRatio * size;
        launcher.positionData.values.x = launcher.physicsData.values.size / 2;

        launcher.styleData.values.color = Color.Barrel;
        launcher.physicsData.values.flags |= PhysicsFlags.isTrapezoid;
        launcher.physicsData.values.sides = 2;

        launcher.tick = () => {
            const size = this.owner.physicsData.values.size;

            launcher.physicsData.size = sizeRatio * size;
            launcher.physicsData.width = widthRatio * size;
            launcher.positionData.x = launcher.physicsData.values.size / 2;
        }
    }
}

export class SpinnerBarrelAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        const launcher = new ObjectEntity(this.game);
        const sizeRatio = 65.5 * Math.SQRT2 / 50;
        const widthRatio = 26.88 / 50;
        const size = this.owner.physicsData.values.size;

        launcher.setParent(this.owner);
        launcher.relationsData.values.owner = this.owner;
        launcher.relationsData.values.team = this.owner.relationsData.values.team;

        launcher.physicsData.values.size = sizeRatio * size;
        launcher.physicsData.values.width = widthRatio * size;
        launcher.positionData.values.x = launcher.physicsData.values.size / 2;

        launcher.styleData.values.color = Color.Barrel;
        launcher.physicsData.values.flags |= PhysicsFlags.isTrapezoid;
        launcher.physicsData.values.sides = 2;

        launcher.tick = () => {
            const size = this.owner.physicsData.values.size;

            launcher.physicsData.size = sizeRatio * size;
            launcher.physicsData.width = widthRatio * size;
            launcher.positionData.x = launcher.physicsData.values.size / 2;
        }
    }
}


export class LauncherTallAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        const launcher = new ObjectEntity(this.game);
        const sizeRatio = 80 * Math.SQRT2 / 50;
        const widthRatio = 32.8571428571        / 50;
        const size = this.owner.physicsData.values.size;

        launcher.setParent(this.owner);
        launcher.relationsData.values.owner = this.owner;
        launcher.relationsData.values.team = this.owner.relationsData.values.team;

        launcher.physicsData.values.size = sizeRatio * size;
        launcher.physicsData.values.width = widthRatio * size;
        launcher.positionData.values.x = launcher.physicsData.values.size / 2;

        launcher.styleData.values.color = Color.Barrel;
        launcher.physicsData.values.flags |= PhysicsFlags.isTrapezoid;
        launcher.physicsData.values.sides = 2;

        launcher.tick = () => {
            const size = this.owner.physicsData.values.size;

            launcher.physicsData.size = sizeRatio * size;
            launcher.physicsData.width = widthRatio * size;
            launcher.positionData.x = launcher.physicsData.values.size / 2;
        }
    }
}

class LauncherSmallAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        const launcher = new ObjectEntity(this.game);
        const sizeRatio = 65.5 * Math.SQRT2 / 50;
        const widthRatio = 39.375  / 50;
        const size = this.owner.physicsData.values.size;

        launcher.setParent(this.owner);
        launcher.relationsData.values.owner = this.owner;
        launcher.relationsData.values.team = this.owner.relationsData.values.team;
        launcher.styleData.zIndex += 1
        launcher.physicsData.values.size = sizeRatio * size;
        launcher.physicsData.values.width = widthRatio * size;
        launcher.positionData.values.x = launcher.physicsData.values.size / 2;

        launcher.styleData.values.color = Color.Barrel;
        launcher.physicsData.values.sides = 2;

        launcher.tick = () => {
            const size = this.owner.physicsData.values.size;

            launcher.physicsData.size = sizeRatio * size;
            launcher.physicsData.width = widthRatio * size;
            launcher.positionData.x = launcher.physicsData.values.size / 2;
        }
    }
}

class Launcher2SmallAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        const launcher = new ObjectEntity(this.game);
        const sizeRatio = 65.5 * Math.SQRT2 / 50;
        const widthRatio = 39.375 / 50;
        const size = this.owner.physicsData.values.size;

        launcher.setParent(this.owner);
        launcher.relationsData.values.owner = this.owner;
        launcher.relationsData.values.team = this.owner.relationsData.values.team;
        launcher.styleData.zIndex += 1
        launcher.physicsData.values.size = sizeRatio * size;
        launcher.physicsData.values.width = widthRatio * size;
        launcher.positionData.values.x = launcher.physicsData.values.size / 2;

        //launcher.physicsData.values.flags |= PhysicsFlags.isTrapezoid;
        launcher.styleData.values.color = Color.Barrel;
        launcher.physicsData.values.sides = 2;

        launcher.tick = () => {
            const size = this.owner.physicsData.values.size;

            launcher.physicsData.size = sizeRatio * size;
            launcher.physicsData.width = widthRatio * size;
            launcher.positionData.x = launcher.physicsData.values.size / 2;
        }
    }
}


class LauncherAddon2 extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        for (let i = 0; i < 3; ++i) {
            const angle = PI2 * ((i / 3));
            const angle2 = PI2 * ((i / 3)  - 1 / (6));

            const launcher = new ObjectEntity(this.game);
            const sizeRatio = 65.5 * Math.SQRT2 / 50;
            const widthRatio = 31.5/ 50;
            const size = this.owner.physicsData.values.size;
    
            launcher.setParent(this.owner);
            launcher.relationsData.values.owner = this.owner;
            launcher.relationsData.values.team = this.owner.relationsData.values.team;
            //launcher.physicsData.values.flags |= PhysicsFlags.isTrapezoid;
    
            launcher.physicsData.values.size = sizeRatio * size;
            launcher.physicsData.values.width = widthRatio * size;
            launcher.positionData.values.x = launcher.physicsData.values.size / 2;
            launcher.styleData.values.color = Color.Barrel;
            launcher.physicsData.values.sides = 2;
            launcher.positionData.angle = angle
            const tickBase2 = launcher.tick;

            launcher.positionData.values.x = Math.cos(angle) * this.owner.physicsData.values.size;
            launcher.positionData.values.y = Math.sin(angle) * this.owner.physicsData.values.size;
            launcher.tick = (tick: number) => {
                const size = this.owner.physicsData.values.size;

                launcher.physicsData.size = sizeRatio * size;
                launcher.physicsData.width = widthRatio * size;
                launcher.positionData.x = Math.cos(angle) * launcher.physicsData.values.size / 2; 
                launcher.positionData.y = Math.sin(angle) * launcher.physicsData.values.size / 2;
        

                tickBase2.call(launcher, tick);

                //barr.positionData.values.angle = angle + rotator.positionData.values.angle;
            }
        }
    }
}

/** Centered Auto Turret addon. */
class AutoTurretAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);
        if(this.owner instanceof TankBody){
            if(this.owner.currentTank == Tank.auto1){
                const turret =  new AutoTurret(owner, AutoTurretDefinition);
                turret.influencedByOwnerInputs = true
            }else{
        new AutoTurret(owner);
            }
        }else{
        new AutoTurret(owner);
        }
    }
}
export const AutoTurretDefinition: BarrelDefinition = {
    angle: 0,
    offset: 0,
    size: 55,
    width: 42 * 0.7,
    delay: 0.01,
    reload: 1,
    recoil: 0.3,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 1,
        damage: 1,
        speed: 1.2,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
class AutoTurretControllAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

       const turret =  new AutoTurret(owner, AutoTurretDefinition);
       turret.influencedByOwnerInputs = true
    }
}
class PsiAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        const atuo = new AutoTurret(owner, {
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
            atuo.baseSize *= 1
        //atuo.ai.passiveRotation = this.movementAngle
        atuo.ai.viewRange = 0
        atuo.styleData.color = Color.Psy
    }
}

class VampAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        const atuo = new AutoTurret(owner, {
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
        //atuo.ai.passiveRotation = this.movementAngle
        atuo.ai.viewRange = 0
        atuo.styleData.color = Color.Vampire
    }
}


class AutoVampAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);
        const base = new AutoTurret(owner, [{
            angle: 0,
            offset: 0,
            size: 60,
            width: 21 * 0.7,
            delay: 0.01,
            reload: 2,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "leach",
                health: 1,
                damage: 0.5,
                speed: 1.2,
                scatterRate: 1,
                lifeLength: 1,
                sizeRatio: 1,
                absorbtionFactor: 0.5
            }
        }, {
            angle: 0,
            offset: 0,
            size: 40,
            width: 42 * 0.7,
            delay: 0.01,
            reload: 1,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            droneCount: 0,
            bullet: {
                type: "drone",
                health: 1,
                damage: 0.2,
                speed: 1.2,
                scatterRate: 1,
                lifeLength: 1,
                sizeRatio: 1,
                absorbtionFactor: 0.5
            }
    }]);
        const atuo = new AutoTurret(owner, {
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
        //atuo.ai.passiveRotation = this.movementAngle
        atuo.ai.viewRange = 0
        atuo.baseSize *= 0.5
        atuo.styleData.color = Color.Vampire
    }
}

/** Smasher + Centered Auto Turret addon. */
class AutoSmasherAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);
        this.createGuard(6, 1.15, 0, .1);
        const base = new AutoTurret(owner, {
            angle: 0,
            offset: 0,
            size: 55,
            width: 42 * 0.7,
            delay: 0.01,
            reload: 1,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "bullet",
                health: 1,
                damage: 0.6,
                speed: 1.2,
                scatterRate: 1,
                lifeLength: 1,
                sizeRatio: 1,
                absorbtionFactor: 0.5
            }
        });
        base.influencedByOwnerInputs = true
    }
}
/** 5 Auto Turrets */
class Auto5Addon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        this.createAutoTurrets(5);
    }
}
/** 3 Auto Turrets */
class Auto3Addon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        this.createAutoTurrets(3);
    }
}
class AutoAuto3Addon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        this.createAutoAutoTurrets(3);
    }
}
class Auto1Addon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        this.createAutoTurrets1(1);
    }
}
class Joint3Addon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);
        this.createJoints(3)
        this.createAutoTurretsDisconnected(3);
    }
}

class Banshee extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);
        this.createAutoTurretsWeak(3);
    }
}
/** The thing above ranger's barrel. */
export class PronouncedAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        const pronounce = new ObjectEntity(this.game);
        const sizeRatio = 50 / 50;
        const widthRatio = 42 / 50;
        const offsetRatio = 40 / 50;
        const size = this.owner.physicsData.values.size;

        pronounce.setParent(this.owner);
        pronounce.relationsData.values.owner = this.owner;
        pronounce.relationsData.values.team = this.owner.relationsData.values.team

        pronounce.physicsData.values.size = sizeRatio * size;
        pronounce.physicsData.values.width = widthRatio * size;
        pronounce.positionData.values.x = offsetRatio * size;
        pronounce.positionData.values.angle = Math.PI;

        pronounce.styleData.values.color = Color.Barrel;
        pronounce.physicsData.values.flags |= PhysicsFlags.isTrapezoid;
        pronounce.physicsData.values.sides = 2;

        pronounce.tick = () => {
            const size = this.owner.physicsData.values.size;

            pronounce.physicsData.size = sizeRatio * size;
            pronounce.physicsData.width = widthRatio * size;
            pronounce.positionData.x = offsetRatio * size;
        }
    }
}

/** The thing above ranger's barrel. */
class PronouncedAddon2 extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        const pronounce = new ObjectEntity(this.game);
        const sizeRatio = 50 / 50;
        const widthRatio = 54.6 / 50;
        const offsetRatio = 40 / 50;
        const size = this.owner.physicsData.values.size;

        pronounce.setParent(this.owner);
        pronounce.relationsData.values.owner = this.owner;
        pronounce.relationsData.values.team = this.owner.relationsData.values.team

        pronounce.physicsData.values.size = sizeRatio * size;
        pronounce.physicsData.values.width = widthRatio * size;
        pronounce.positionData.values.x = offsetRatio * size;
        pronounce.positionData.values.angle = Math.PI;

        pronounce.styleData.values.color = Color.Barrel;
        pronounce.physicsData.values.flags |= PhysicsFlags.isTrapezoid;
        pronounce.physicsData.values.sides = 2;

        pronounce.tick = () => {
            const size = this.owner.physicsData.values.size;

            pronounce.physicsData.size = sizeRatio * size;
            pronounce.physicsData.width = widthRatio * size;
            pronounce.positionData.x = offsetRatio * size;
        }
    }
}

/** The thing above Gunner + Destroyer Dominator's barrel. */
class PronouncedDomAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        const pronounce = new ObjectEntity(this.game);
        const sizeRatio = 22 / 50;
        const widthRatio = 35 / 50;
        const offsetRatio = 50 / 50;
        const size = this.owner.physicsData.values.size;

        pronounce.setParent(this.owner);
        pronounce.relationsData.values.owner = this.owner;
        pronounce.relationsData.values.team = this.owner.relationsData.values.team

        pronounce.physicsData.values.size = sizeRatio * size;
        pronounce.physicsData.values.width = widthRatio * size;
        pronounce.positionData.values.x = offsetRatio * size;
        pronounce.positionData.values.angle = Math.PI;
        
        pronounce.styleData.values.color = Color.Barrel;
        pronounce.physicsData.values.flags |= PhysicsFlags.isTrapezoid;
        pronounce.physicsData.values.sides = 2;

        pronounce.tick = () => {
            const size = this.owner.physicsData.values.size;

            pronounce.physicsData.size = sizeRatio * size;
            pronounce.physicsData.width = widthRatio * size;
            pronounce.positionData.x = offsetRatio * size;
        }
    }
}
/** Weird spike addon. Based on the arrasio Original. */
class WeirdSpikeAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        this.createGuard(3, 1.5, 0, 0.17);
        this.createGuard(3, 1.5, 0, -0.16);
    }
}
/** 2 Auto Turrets */
class Auto2Addon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        this.createAutoMachineTurrets(2);

        const base = new AutoTurret(owner, {
            angle: 0,
            offset: 0,
            size: 55,
            width: 42 * 0.7,
            delay: 0.01,
            reload: 0.5,
            recoil: 0,
            isTrapezoid: true,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "bullet",
                health: 0.875,
                damage: 0.3,
                speed: 1.2,
                scatterRate: 3,
                lifeLength: 1,
                sizeRatio: 1,
                absorbtionFactor: 1
            }});
            base.influencedByOwnerInputs = true;

    }
}
/** 7 Auto Turrets */
class Auto7Addon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        this.createAutoTurrets(7);
    }
}

/** Centered Auto Rocket addon. */
class AutoRocketAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        const base = new AutoTurret(owner, {
            angle: 0,
            offset: 0,
            size: 55,
            width: 42 * 0.7,
            delay: 0,
            reload: 4,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "bullet",
                sizeRatio: 1,
                health: 0.85,
                damage: 1.2,
                speed: 1.4,
                scatterRate: 0.3,
                lifeLength: 1,
                absorbtionFactor: 0.1
            }
        });

        base.turret[0].styleData.zIndex += 2;
        new LauncherAddon(base);
    }
}
/** SPIESK addon. */
class SpieskAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        this.createGuard(4, 1.3, 0, 0.17);
        this.createGuard(4, 1.3, Math.PI / 6, 0.17);
        this.createGuard(4, 1.3, 2 * Math.PI / 6, 0.17);
    }
}

class THEBIGONE extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        const base = new AutoTurret(owner, {
            angle: 0,
            offset: 0,
            size: 96,
            width: 75.6 * 0.7,
            delay: 0,
            reload: 8,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "bullet",
                sizeRatio: 1,
                health: 1.85,
                damage: 1.25,
                speed: 1.5,
                scatterRate: 0.3,
                lifeLength: 1,
                absorbtionFactor: 0.1
            }
        });
        base.turret[0].styleData.zIndex += 2;

        base.baseSize *= 1.5;
        base.ai.viewRange = 1800
        new LauncherAddon(base);
    }
}
class Mega3Addon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        this.createMegaAutoTurrets(3);
    }
}

class Auto4Addon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        this.createAutoTrapTurrets(4);
    }
}
class Stalker3Addon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        this.createAutoStalkerTurrets(3);
    }
}

class MegaSmasherAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        this.createGuard(6, 1.3, 0, .1);
    }
}
class BelphegorAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        this.createGuard(12, 1.15, 0, .1);
    }
}

class SawAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        this.createGuard(4, 1.55, Math.PI/8, .15);
    }
}
class SpornAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        this.createGuard(9, 1.35, Math.PI/8, .3);
    }
}
class RammerAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);
        //owner.positionData.values.angle
        this.createGuard2();
    }
}

class ChasmAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);
        //owner.positionData.values.angle
        
        const pronounce = new ObjectEntity(this.game);
        const size = this.owner.physicsData.values.size;

        pronounce.setParent(this.owner);
        pronounce.relationsData.values.owner = this.owner;
        pronounce.relationsData.values.team = this.owner.relationsData.values.team

        pronounce.physicsData.values.size = size * 1.2;

        pronounce.styleData.values.color = Color.Border;
        pronounce.physicsData.values.sides = 3;
        const tickBase = pronounce.tick;

        pronounce.tick = (tick: number) => {
            const size = this.owner.physicsData.values.size;

            pronounce.physicsData.size = size * 1.2;
            tickBase.call(pronounce, tick);
        }


        const pronounce2 = new ObjectEntity(this.game);

        pronounce2.setParent(this.owner);
        pronounce2.relationsData.values.owner = this.owner;
        pronounce2.relationsData.values.team = this.owner.relationsData.values.team

        pronounce2.physicsData.values.size = size * 0.75;

            pronounce2.styleData.values.color = this.owner.styleData.color;
            pronounce2.styleData.values.flags |= StyleFlags.showsAboveParent
        pronounce2.physicsData.values.sides = 3;
        const tickBase2 = pronounce2.tick;

        pronounce2.tick = (tick: number) => {
            const size = this.owner.physicsData.values.size;

            pronounce2.physicsData.size = size * 0.75;
            tickBase2.call(pronounce2, tick);
        }



        const pronounce3 = new ObjectEntity(this.game);

        pronounce3.setParent(this.owner);
        pronounce3.relationsData.values.owner = this.owner;
        pronounce3.relationsData.values.team = this.owner.relationsData.values.team

        pronounce3.physicsData.values.size = size * 0.5;

        pronounce3.styleData.values.color = this.owner.styleData.color;
        pronounce3.styleData.values.flags |= StyleFlags.showsAboveParent
        pronounce3.physicsData.values.sides = 3;
        const tickBase3 = pronounce3.tick;

        pronounce3.tick = (tick: number) => {
            const size = this.owner.physicsData.values.size;

            pronounce3.physicsData.size = size * 0.5;
            tickBase3.call(pronounce3, tick);
        }
    }
}

class VoidAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);
        //owner.positionData.values.angle
        
        const pronounce = new ObjectEntity(this.game);
        const size = this.owner.physicsData.values.size;

        pronounce.setParent(this.owner);
        pronounce.relationsData.values.owner = this.owner;
        pronounce.relationsData.values.team = this.owner.relationsData.values.team

        pronounce.physicsData.values.size = size * 1.4;

        pronounce.styleData.values.color = Color.Border;
        pronounce.physicsData.values.sides = 3;
        const tickBase = pronounce.tick;

        pronounce.tick = (tick: number) => {
            const size = this.owner.physicsData.values.size;

            pronounce.physicsData.size = size * 1.4;
            tickBase.call(pronounce, tick);
        }


        const pronounce2 = new ObjectEntity(this.game);

        pronounce2.setParent(this.owner);
        pronounce2.relationsData.values.owner = this.owner;
        pronounce2.relationsData.values.team = this.owner.relationsData.values.team

        pronounce2.physicsData.values.size = size * 0.75;

            pronounce2.styleData.values.color = this.owner.styleData.color;
            pronounce2.styleData.values.flags |= StyleFlags.showsAboveParent
        pronounce2.physicsData.values.sides = 3;
        const tickBase2 = pronounce2.tick;

        pronounce2.tick = (tick: number) => {
            const size = this.owner.physicsData.values.size;

            pronounce2.physicsData.size = size * 0.75;
            tickBase2.call(pronounce2, tick);
        }



        const pronounce3 = new ObjectEntity(this.game);

        pronounce3.setParent(this.owner);
        pronounce3.relationsData.values.owner = this.owner;
        pronounce3.relationsData.values.team = this.owner.relationsData.values.team

        pronounce3.physicsData.values.size = size * 0.5;

        pronounce3.styleData.values.color = this.owner.styleData.color;
        pronounce3.styleData.values.flags |= StyleFlags.showsAboveParent
        pronounce3.physicsData.values.sides = 3;
        const tickBase3 = pronounce3.tick;

        pronounce3.tick = (tick: number) => {
            const size = this.owner.physicsData.values.size;

            pronounce3.physicsData.size = size * 0.5;
            tickBase3.call(pronounce3, tick);
        }
    }
}

class CometAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);
        //owner.positionData.values.angle
        
        const pronounce = new ObjectEntity(this.game);
        const size = this.owner.physicsData.values.size;

        pronounce.setParent(this.owner);
        pronounce.relationsData.values.owner = this.owner;
        pronounce.relationsData.values.team = this.owner.relationsData.values.team

        pronounce.physicsData.values.size = size * 1.2;

        pronounce.styleData.values.color = Color.Border;
        pronounce.physicsData.values.sides = 3;
        const tickBase = pronounce.tick;

        pronounce.tick = (tick: number) => {
            const size = this.owner.physicsData.values.size;

            pronounce.physicsData.size = size * 1.2;
            tickBase.call(pronounce, tick);
        }


        const pronounce2 = new ObjectEntity(this.game);

        pronounce2.setParent(this.owner);
        pronounce2.relationsData.values.owner = this.owner;
        pronounce2.relationsData.values.team = this.owner.relationsData.values.team

        pronounce2.physicsData.values.size = size * 0.925;
        pronounce2.positionData.values.angle = Math.PI;

            pronounce2.styleData.values.color = Color.Border;
            pronounce2.styleData.values.flags |= StyleFlags.showsAboveParent | StyleFlags.isStar
        pronounce2.physicsData.values.sides = 3;
        const tickBase2 = pronounce2.tick;

        pronounce2.tick = (tick: number) => {
            const size = this.owner.physicsData.values.size;
//            pronounce2.positionData.angle = this.owner.positionData.angle + Math.PI

            pronounce2.physicsData.size = size * 0.8;
            tickBase2.call(pronounce2, tick);
        }



        const pronounce3 = new ObjectEntity(this.game);

        pronounce3.setParent(this.owner);
        pronounce3.relationsData.values.owner = this.owner;
        pronounce3.relationsData.values.team = this.owner.relationsData.values.team

        pronounce3.physicsData.values.size = size * 0.5;

        pronounce3.styleData.values.color = this.owner.styleData.color;
        pronounce3.styleData.values.flags |= StyleFlags.showsAboveParent
        pronounce3.physicsData.values.sides = 3;
        const tickBase3 = pronounce3.tick;

        pronounce3.tick = (tick: number) => {
            const size = this.owner.physicsData.values.size;

            pronounce3.physicsData.size = size * 0.5;
            tickBase3.call(pronounce3, tick);
        }
    }
}


class AbyssAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);
        //owner.positionData.values.angle
        
        const pronounce = new ObjectEntity(this.game);
        const size = this.owner.physicsData.values.size;

        pronounce.setParent(this.owner);
        pronounce.relationsData.values.owner = this.owner;
        pronounce.relationsData.values.team = this.owner.relationsData.values.team

        pronounce.physicsData.values.size = size * 1.2;

        pronounce.styleData.values.color = Color.Border;
        pronounce.physicsData.values.sides = 3;
        const tickBase = pronounce.tick;

        pronounce.tick = (tick: number) => {
            const size = this.owner.physicsData.values.size;

            pronounce.physicsData.size = size * 1.2;
            tickBase.call(pronounce, tick);
        }


        const pronounce2 = new ObjectEntity(this.game);

        pronounce2.setParent(this.owner);
        pronounce2.relationsData.values.owner = this.owner;
        pronounce2.relationsData.values.team = this.owner.relationsData.values.team

        pronounce2.physicsData.values.size = size * 0.8;

            pronounce2.styleData.values.color = this.owner.styleData.color;
            pronounce2.styleData.values.flags |= StyleFlags.showsAboveParent
        pronounce2.physicsData.values.sides = 3;
        const tickBase2 = pronounce2.tick;

        pronounce2.tick = (tick: number) => {
            const size = this.owner.physicsData.values.size;

            pronounce2.physicsData.size = size * 0.8;
            tickBase2.call(pronounce2, tick);
        }



        const pronounce3 = new ObjectEntity(this.game);

        pronounce3.setParent(this.owner);
        pronounce3.relationsData.values.owner = this.owner;
        pronounce3.relationsData.values.team = this.owner.relationsData.values.team

        pronounce3.physicsData.values.size = size * 0.6;

        pronounce3.styleData.values.color = this.owner.styleData.color;
        pronounce3.styleData.values.flags |= StyleFlags.showsAboveParent
        pronounce3.physicsData.values.sides = 3;
        const tickBase3 = pronounce3.tick;

        pronounce3.tick = (tick: number) => {
            const size = this.owner.physicsData.values.size;

            pronounce3.physicsData.size = size * 0.6;
            tickBase3.call(pronounce3, tick);
        }

    const pronounce4 = new ObjectEntity(this.game);

    pronounce4.setParent(this.owner);
    pronounce4.relationsData.values.owner = this.owner;
    pronounce4.relationsData.values.team = this.owner.relationsData.values.team

    pronounce4.physicsData.values.size = size * 0.4;

    pronounce4.styleData.values.color = this.owner.styleData.color;
    pronounce4.styleData.values.flags |= StyleFlags.showsAboveParent
    pronounce4.physicsData.values.sides = 3;
    const tickBase4 = pronounce4.tick;

    pronounce4.tick = (tick: number) => {
        const size = this.owner.physicsData.values.size;

        pronounce4.physicsData.size = size * 0.4;
        tickBase4.call(pronounce4, tick);
    }

    const pronounce5 = new ObjectEntity(this.game);

    pronounce5.setParent(this.owner);
    pronounce5.relationsData.values.owner = this.owner;
    pronounce5.relationsData.values.team = this.owner.relationsData.values.team

    pronounce5.physicsData.values.size = size * 0.2;

    pronounce5.styleData.values.color = this.owner.styleData.color;
    pronounce5.styleData.values.flags |= StyleFlags.showsAboveParent
    pronounce5.physicsData.values.sides = 3;
    const tickBase5 = pronounce5.tick;

    pronounce5.tick = (tick: number) => {
        const size = this.owner.physicsData.values.size;

        pronounce5.physicsData.size = size * 0.2;
        tickBase5.call(pronounce5, tick);
    }
}
}

class RiftAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);
        //owner.positionData.values.angle
        
        const pronounce = new ObjectEntity(this.game);
        const size = this.owner.physicsData.values.size;

        pronounce.setParent(this.owner);
        pronounce.relationsData.values.owner = this.owner;
        pronounce.relationsData.values.team = this.owner.relationsData.values.team

        pronounce.physicsData.values.size = size * 1.2;

        pronounce.styleData.values.color = Color.Border;
        pronounce.physicsData.values.sides = 3;
        const tickBase = pronounce.tick;

        pronounce.tick = (tick: number) => {
            const size = this.owner.physicsData.values.size;

            pronounce.physicsData.size = size * 1.2;
            tickBase.call(pronounce, tick);
        }


        const pronounce2 = new ObjectEntity(this.game);

        pronounce2.setParent(this.owner);
        pronounce2.relationsData.values.owner = this.owner;
        pronounce2.relationsData.values.team = this.owner.relationsData.values.team
        pronounce2.styleData.values.color = Color.Barrel

        pronounce2.physicsData.values.size = size * 0.75;
        pronounce2.positionData.angle = Math.PI
        pronounce2.styleData.values.flags |= StyleFlags.showsAboveParent
        pronounce2.physicsData.values.sides = 6;
        const tickBase2 = pronounce2.tick;

        pronounce2.tick = (tick: number) => {
            const size = this.owner.physicsData.values.size;

            pronounce2.physicsData.size = size * 0.75;
            tickBase2.call(pronounce2, tick);
        }



        const pronounce3 = new ObjectEntity(this.game);

        pronounce3.setParent(this.owner);
        pronounce3.relationsData.values.owner = this.owner;
        pronounce3.relationsData.values.team = this.owner.relationsData.values.team

        pronounce3.physicsData.values.size = size * 0.5;
        pronounce3.styleData.values.color = Color.EnemyOctagon
        pronounce3.positionData.angle = Math.PI
        pronounce3.styleData.values.flags |= StyleFlags.showsAboveParent
        pronounce3.physicsData.values.sides = 6;
        const tickBase3 = pronounce3.tick;

        pronounce3.tick = (tick: number) => {
            const size = this.owner.physicsData.values.size;

            pronounce3.physicsData.size = size * 0.5;
            tickBase3.call(pronounce3, tick);
        }
    }
}

class BoostAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        const atuo = new AutoTurret(owner, {
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
        const atuo2 = new AutoTurret(owner, {
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
            atuo.baseSize *= 1
            atuo2.baseSize *= 0.5
        //atuo.ai.passiveRotation = this.movementAngle
        atuo.ai.viewRange = 0
        atuo2.ai.viewRange = 0
        atuo.styleData.color = Color.Barrel
        atuo2.styleData.color = Color.EnemySquare
        const offsetRatio = -30 / 50;

        atuo.tick = () => {
            const size = this.owner.physicsData.values.size;
            atuo.physicsData.size = size * 0.6;

            atuo.positionData.x = offsetRatio * size;
        }
        atuo2.tick = () => {
            const size = this.owner.physicsData.values.size;
            atuo2.physicsData.size = size * 0.4;

            atuo2.positionData.x = offsetRatio * size;
        }
    }
}

class TeleAddon extends Addon {
    public constructor(owner: BarrelBase) {
        super(owner);

        const atuo = new AutoTurret(owner, {
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
        const atuo2 = new AutoTurret(owner, {
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
            atuo.baseSize *= 1
            atuo2.baseSize *= 0.5
        //atuo.ai.passiveRotation = this.movementAngle
        atuo.ai.viewRange = 0
        atuo2.ai.viewRange = 0
        atuo.styleData.color = Color.Barrel
        atuo2.styleData.color = Color.EnemyOctagon
        const offsetRatio = -30 / 50;

        atuo.tick = () => {
            const size = this.owner.physicsData.values.size;
            atuo.physicsData.size = size * 0.6;

            atuo.positionData.x = offsetRatio * size;
        }
        atuo2.tick = () => {
            const size = this.owner.physicsData.values.size;
            atuo2.physicsData.size = size * 0.4;

            atuo2.positionData.x = offsetRatio * size;
        }
    }
}
/**
 * All addons in the game by their ID.
 */
export const AddonById: Record<addonId, typeof Addon | null> = {
    spike: SpikeAddon,
    dombase: DomBaseAddon,
    launcher: LauncherAddon,
    dompronounced: PronouncedDomAddon,
    auto5: Auto5Addon,
    auto3: Auto3Addon,
    autosmasher: AutoSmasherAddon,
    pronounced: PronouncedAddon,
    smasher: SmasherAddon,
    landmine: LandmineAddon,
    autoturret: AutoTurretAddon,
    // not part of diep
    microsmasher: SmasherAddon,
    tele: TeleAddon,
    boost: BoostAddon,
    chainer: SmasherAddon,
    autoturret3: AutoTurretControllAddon,
    vampire: VampAddon,
    spinner: SpinnerAddon,
    chasm: ChasmAddon,
    void: VoidAddon,
    comet: CometAddon,
    abyss: AbyssAddon,
    weirdspike: WeirdSpikeAddon,
    auto7: Auto7Addon,
    auto2: Auto2Addon,
    autorocket: AutoRocketAddon,
    spiesk: SpieskAddon,
    laucher2: LauncherAddon2,
    megasmasher: MegaSmasherAddon,
    saw: SawAddon,
    mega3: Mega3Addon,
    stalker3 : Stalker3Addon,
    auto4    : Auto4Addon,
    rammer   : RammerAddon,
    bumper   : BumperAddon,
    launchersmall : LauncherSmallAddon,
    bigautoturret: THEBIGONE,
    joint3 : Joint3Addon,
    overdrive : OverDriveAddon,
    droneturret :Banshee, 
    pronounced2 : PronouncedAddon2,
    cuck : Auto1Addon,
    launchertall : LauncherTallAddon,
    psiEye: PsiAddon,
    sporn: SpornAddon,
    autoauto3: AutoAuto3Addon,
    glider: GliderAddon,
    autovamp : AutoVampAddon,
    vampsmasher : VampSmasherAddon,
    launcheralt: Launcher2SmallAddon,
    rift: RiftAddon,
    whirlwind : WhirlwindAddon,
    multibox : MultiBoxAddon,
    tool : MultiBoxAddon,
    bentbox : MultiBoxAddon,
    bees : MultiBoxAddon,
    multiboxxer : MultiBoxxerAddon,
    rotary : RotaryAddon,
    rotator : RotatorAddon,
    whirlygig : WhirlygigAddon,
    belphegor : BelphegorAddon,
    spinnerbarrel : SpinnerBarrelAddon

}
