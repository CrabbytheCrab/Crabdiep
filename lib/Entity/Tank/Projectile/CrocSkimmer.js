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
 * Barrel definition for the skimmer skimmer's barrel.
 */
const CrocSkimmerBarrelDefinition = {
    angle: Math.PI / 2,
    offset: 0,
    size: 70,
    width: 42,
    delay: 0,
    reload: 0.5,
    recoil: 0,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 0.3,
        damage: 3 / 5,
        speed: .2,
        scatterRate: 1,
        lifeLength: 0.25,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
/**
 * Represents all skimmereer skimmers in game.
 */
class CrocSkimmer extends Bullet_1.default {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        /** The reload time of the skimmer's barrel. */
        this.reloadTime = 15;
        this.cameraEntity = tank.cameraEntity;
        this.sizeFactor = this.physics.values.size / 50;
        const skimmerBarrels = this.skimmerBarrels = [];
        const s1 = new Barrel_1.default(this, { ...CrocSkimmerBarrelDefinition });
        const s2Definition = { ...CrocSkimmerBarrelDefinition };
        s2Definition.angle += Math.PI;
        const s2 = new Barrel_1.default(this, s2Definition);
        s1.style.values.color = this.style.values.color;
        s2.style.values.color = this.style.values.color;
        skimmerBarrels.push(s1, s2);
        this.inputs = new AI_1.Inputs();
        this.inputs.flags |= Enums_1.InputFlags.leftclick;
    }
    tick(tick) {
        this.sizeFactor = this.physics.values.size / 50;
        this.reloadTime = this.tank.reloadTime;
        super.tick(tick);
        if (this.deletionAnimation)
            return;
        // Only accurate on current version, but we dont want that
        // if (!Entity.exists(this.barrelEntity.rootParent) && (this.inputs.flags & InputFlags.leftclick)) this.inputs.flags ^= InputFlags.leftclick;
    }
}
exports.default = CrocSkimmer;
