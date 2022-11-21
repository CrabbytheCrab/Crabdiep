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
const Barrel_1 = require("../Barrel");
const Bullet_1 = require("./Bullet");
const Enums_1 = require("../../../Const/Enums");
const AI_1 = require("../../AI");
/**
 * Barrel definition for the rocketeer rocket's barrel.
 */
const RocketBarrelDefinition = {
    angle: Math.PI,
    offset: 0,
    size: 70,
    width: 72,
    delay: 0,
    reload: 0.3,
    recoil: 3.3,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.3,
        damage: 4 / 5,
        speed: 1.5,
        scatterRate: 0,
        lifeLength: 0.1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
/**
 * Represents all rocketeer rockets in game.
 */
class Launrocket extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        /** The reload time of the rocket's barrel. */
        this.reloadTime = 1;
        /** The inputs for when to shoot or not. (Rocket) */
        this.inputs = new AI_1.Inputs();
        this.cameraEntity = tank.cameraEntity;
        this.sizeFactor = this.physics.values.size / 50;
        const launrocketBarrel = this.launrocketBarrel = new Barrel_1.default(this, { ...RocketBarrelDefinition });
        launrocketBarrel.style.values.color = this.style.values.color;
    }
    tick(tick) {
        this.sizeFactor = this.physics.values.size / 50;
        this.reloadTime = this.tank.reloadTime;
        if (!this.deletionAnimation && this.launrocketBarrel)
            this.launrocketBarrel.definition.width = ((this.barrelEntity.definition.width / 2) * RocketBarrelDefinition.width) / this.physics.values.size;
        super.tick(tick);
        if (this.deletionAnimation)
            return;
        // not fully accurate
        if (tick - this.spawnTick >= this.tank.reloadTime)
            this.inputs.flags |= Enums_1.InputFlags.leftclick;
        // Only accurate on current version, but we dont want that
        // if (!Entity.exists(this.barrelEntity.rootParent) && (this.inputs.flags & InputFlags.leftclick)) this.inputs.flags ^= InputFlags.leftclick; 
    }
}
exports.default = Launrocket;
