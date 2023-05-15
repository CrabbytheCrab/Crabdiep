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
import AbstractBoss from "./AbstractBoss";

import { Color, Tank } from "../../Const/Enums";
import { AIState } from "../AI";
import { BarrelDefinition } from "../../Const/TankDefinitions";


let GuardianSpawnerDefinition: BarrelDefinition = {
    angle: Math.PI,
    offset: 0,
    size: 95,
    width: 111.3,
    delay: 0,
    reload: 3,
    recoil: 1.75,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: "trapLauncher",
    forceFire: true,
    bullet: {
        type: "trap",
        sizeRatio:0.8,
        health: 20,
        damage: 4,
        speed: 2,
        scatterRate: 1,
        lifeLength: 12,
        absorbtionFactor: 1
    }
};
let GuardianSpawnerDefinition2: BarrelDefinition = {
    angle: 0,
    offset: 30,
    size: 120,
    width: 42,
    delay: 0,
    reload: 1.8,
    recoil: 0.25,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        sizeRatio: 1,
        health: 8,
        damage: 0.5,
        speed: 1,
        scatterRate: 1,
        lifeLength: 1.5,
        absorbtionFactor: 0.6
    }
};
let GuardianSpawnerDefinition3: BarrelDefinition = {
    angle: 0,
    offset: -30,
    size: 120,
    width: 42,
    delay: 0.5,
    reload: 1.8,
    recoil: 0.25,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        sizeRatio: 1,
        health: 8,
        damage: 0.5,
        speed: 1,
        scatterRate: 1,
        lifeLength: 1.5,
        absorbtionFactor: 0.6
    }
};


let GuardianSpawnerDefinition4: BarrelDefinition = {
    angle: 0,
    offset: 45,
    size: 100,
    width: 42,
    delay: 0.25,
    reload: 1.8,
    recoil: 0.25,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        sizeRatio: 1,
        health: 8,
        damage: 0.5,
        speed: 1,
        scatterRate: 1,
        lifeLength: 1.5,
        absorbtionFactor: 0.6
    }
};
let GuardianSpawnerDefinition5: BarrelDefinition = {
    angle: 0,
    offset: -45,
    size: 100,
    width: 42,
    delay: 0.75,
    reload: 1.8,
    recoil: 0.25,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        sizeRatio: 1,
        health: 8,
        damage: 0.5,
        speed: 1,
        scatterRate: 1,
        lifeLength: 1.5,
        absorbtionFactor: 0.6
    }
};

// The size of Guardian by default
const GUARDIAN_SIZE = 135;

/**
 * Class which represents the boss "Guardian"
 */
export default class Beholder extends AbstractBoss {
    public constructor(game: GameServer) {
        super(game);

        this.nameData.values.name = 'Beholder';
        this.altName = 'Beholder of the Pentagons';
        this.styleData.values.color = Color.EnemyCrasher;
        this.relationsData.values.team = this.game.arena;
        this.physicsData.values.size = GUARDIAN_SIZE * Math.SQRT1_2;
        this.physicsData.values.sides = 3;
        this.sizeFactor = 1.0
        this.barrels.push(new Barrel(this, GuardianSpawnerDefinition4));
        this.barrels.push(new Barrel(this, GuardianSpawnerDefinition5));
        this.barrels.push(new Barrel(this, GuardianSpawnerDefinition));
        this.barrels.push(new Barrel(this, GuardianSpawnerDefinition2));
        this.barrels.push(new Barrel(this, GuardianSpawnerDefinition3));
    }

    protected moveAroundMap() {
        const x = this.positionData.values.x,
        y = this.positionData.values.y
          if (this.ai.state === AIState.idle) {
              super.moveAroundMapShort();
              this.positionData.angle = Math.atan2(this.inputs.movement.y, this.inputs.movement.x)
          } else {
              this.positionData.angle = Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x)
          }
      }
    public tick(tick: number) {
        super.tick(tick);
        // Let it scale with the guardian
        this.sizeFactor = (this.physicsData.values.size / Math.SQRT1_2) / GUARDIAN_SIZE;
    }
}
