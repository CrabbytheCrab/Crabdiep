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
import TankDefinitions from "../../Const/TankDefinitions";
import AbstractBoss from "./AbstractBoss";

import { Tank } from "../../Const/Enums";
import { AIState } from "../AI";

/**
 * Class which represents the boss "FallenBooster"
 */
export default class FallenPuker extends AbstractBoss {
    /** The speed to maintain during movement. */
    public movementSpeed = 1.8;

    public constructor(game: GameServer) {
        super(game);

        this.nameData.values.name = 'Fallen Puker';
        for (const barrelDefinition of TankDefinitions[Tank.PentaShot].barrels) {

            const def = Object.assign({}, barrelDefinition, { recoil: 0.35, width: 35, isTrapezoid: true, reload: 0.35 });
            def.bullet = Object.assign({}, def.bullet, { speed: 1, health: 8, scatterRate: 2.5 });
            this.barrels.push(new Barrel(this, def));
        }
    }
    public static FOCUS_RADIUS = 1000 ** 2;

    protected moveAroundMap() {
      const x = this.positionData.values.x,
      y = this.positionData.values.y
        if (this.ai.state === AIState.idle) {
            super.moveAroundMap();
            this.positionData.angle = Math.atan2(this.inputs.movement.y, this.inputs.movement.x)
        } else {
            this.positionData.angle = Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x)
            const dist = this.ai.inputs.mouse.distanceToSQ(this.positionData.values);

            if (dist < FallenPuker.FOCUS_RADIUS / 4) { // Half
                this.velocity.angle = this.positionData.angle + Math.PI;
            } 
        }
    }

    public tick(tick: number) {
        super.tick(tick);
        this.sizeFactor = this.physicsData.values.size / 50;
    }
}
