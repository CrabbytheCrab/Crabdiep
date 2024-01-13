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

import ObjectEntity from "../Object";
import Barrel from "./Barrel";

import { BarrelBase } from "./TankBody";
import { Color, InputFlags, PositionFlags, NameFlags, PhysicsFlags, Stat, StyleFlags } from "../../Const/Enums";
import { BarrelDefinition } from "../../Const/TankDefinitions";
import { AI, AIState, Inputs } from "../AI";
import { Entity } from "../../Native/Entity";
import { NameGroup } from "../../Native/FieldGroups";
import LivingEntity from "../Live";

export const AutoTurretDefinition: BarrelDefinition = {
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
        damage: 0.3,
        speed: 1.2,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};

/**
 * Auto Turret Barrel + Barrel Base
 */
export default class SpinTurret extends ObjectEntity {
    // TODO(ABC):
    // Maybe just remove this
    /** For mounted turret name to show up on Auto Turrets. */
    public nameData: NameGroup = new NameGroup(this);

    /** Barrel's owner (Tank-like object). */
    private owner: BarrelBase;
    /** Actual turret / barrel. */
    public turret: Barrel[] = [];
    /** The AI controlling the turret. */
    /** The AI's inputs, for determining whether to shoot or not. */
    public inputs: Inputs;
    /** Camera entity / team of the turret. */
    public cameraEntity: Entity;

    /** If set to true, (auto 5 auto 3), player can influence auto turret's */

    /** The reload time of the turret. */
    public reloadTime = 15;
    /** The size of the auto turret base */
    public baseSize: number;
    public spin: number
    public constructor(owner: BarrelBase, barrelDefinition: BarrelDefinition[] | BarrelDefinition = AutoTurretDefinition, baseSize: number = 25, spin: number = 0.1)
    {
        super(owner.game);

        this.cameraEntity = owner.cameraEntity;
        this.inputs = owner.inputs;
        this.spin = spin
        this.owner = owner;
        
        this.setParent(owner);
        this.relationsData.values.owner = owner;

        this.relationsData.values.team = owner.relationsData.values.team;

        this.physicsData.values.sides = 1;
        this.baseSize = baseSize;
        this.physicsData.values.size = this.baseSize * this.sizeFactor;

        this.styleData.values.color = Color.Barrel;
        this.styleData.values.flags |= StyleFlags.showsAboveParent;

        this.positionData.values.flags |= PositionFlags.absoluteRotation;

        this.nameData.values.name = "Mounted Turret";
        this.nameData.values.flags |= NameFlags.hiddenName;

        if (!(barrelDefinition instanceof Array)) barrelDefinition = [barrelDefinition];
        for (const def of barrelDefinition ) { 
            this.turret = [new Barrel(this, def)];
            this.turret[0].physicsData.values.flags |= PhysicsFlags._unknown;
        }
        
    }
    
    /**
     * Size factor, used for calculation of the turret and base size.
     */
    public get sizeFactor() {
        return this.owner.sizeFactor;
    }

    /**
     * Called similarly to LivingEntity.onKill
     * Spreads onKill to owner
     */
    public onKill(killedEntity: LivingEntity) {
        if (!(this.owner instanceof LivingEntity)) return;
        this.owner.onKill(killedEntity);
    }

    public tick(tick: number) {
        this.physicsData.size = this.baseSize * this.sizeFactor;
        this.positionData.angle += this.spin
    }
}