"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoTurretDefinition = void 0;
const Object_1 = require("../Object");
const Barrel_1 = require("./Barrel");
const Enums_1 = require("../../Const/Enums");
const AI_1 = require("../AI");
const FieldGroups_1 = require("../../Native/FieldGroups");
exports.AutoTurretDefinition = {
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
        damage: 0.3,
        speed: 1.2,
        scatterRate: 1,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
// const sizeRatio = 0.56 * 50;
// const widthRatio = 1.1 * 50;
const baseRatio = .5 * 50;
/**
 * Auto Turret Barrel + Barrel Base
 */
class AutoTurret extends Object_1.default {
    constructor(owner, turretDefinition = exports.AutoTurretDefinition) {
        super(owner.game);
        // TODO(ABC):
        // Maybe just remove this
        /** For mounted turret name to show up on Auto Turrets. */
        this.name = new FieldGroups_1.NameGroup(this);
        /** The reload time of the turret. */
        this.reloadTime = 15;
        this.cameraEntity = owner.cameraEntity;
        this.ai = new AI_1.AI(this);
        this.inputs = this.ai.inputs;
        this.owner = owner;
        this.setParent(owner);
        this.relations.values.owner = owner;
        this.relations.values.team = owner.relations.values.team;
        this.physics.values.sides = 1;
        this.physics.values.size = baseRatio * this.sizeFactor;
        this.style.values.color = Enums_1.Colors.Barrel;
        this.style.values.styleFlags |= Enums_1.StyleFlags.aboveParent;
        this.position.values.motion |= Enums_1.MotionFlags.absoluteRotation;
        this.name.values.name = "Mounted Turret";
        this.name.values.nametag |= Enums_1.NametagFlags.hidden;
        this.turret = new Barrel_1.default(this, turretDefinition);
        this.turret.physics.values.objectFlags |= Enums_1.ObjectFlags.unknown1;
    }
    /**
     * Size factor, used for calculation of the turret and base size.
     */
    get sizeFactor() {
        return this.owner.sizeFactor;
    }
    /**
     * Called similarly to LivingEntity.onKill
     * Spreads onKill to owner
     */
    onKill(killedEntity) {
        // TODO(ABC):
        // Make this, work differently (Maybe KillerEntity interface)
        /** @ts-ignore */
        if (typeof this.owner.onKill === 'function')
            this.owner.onKill(killedEntity);
    }
    tick(tick) {
        if (this.inputs !== this.ai.inputs)
            this.inputs = this.ai.inputs;
        this.physics.size = baseRatio * this.sizeFactor;
        this.ai.aimSpeed = this.turret.bulletAccel;
        // Top Speed
        this.ai.movementSpeed = 0;
        this.reloadTime = this.owner.reloadTime;
        if (this.ai.state === AI_1.AIState.idle) {
            this.position.angle += this.ai.passiveRotation;
            this.turret.attemptingShot = false;
        }
        else {
            // Uh. Yeah
            const { x, y } = this.getWorldPosition();
            this.position.angle = Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x);
        }
    }
}
exports.default = AutoTurret;
