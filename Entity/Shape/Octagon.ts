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

import { Color } from "../../Const/Enums";

/**
 * Pentagon entity class.
 */
export default class Octagon extends AbstractShape {
    /** If the pentagon is an alpha pentagon or not */
    public isAlpha: boolean;

    protected static BASE_ROTATION = AbstractShape.BASE_ROTATION / 2;
    protected static BASE_ORBIT = AbstractShape.BASE_ORBIT / 2;
    protected static BASE_VELOCITY = AbstractShape.BASE_VELOCITY / 2;

    public constructor(game: GameServer, isAlpha=false, shiny=(Math.random() < 0.1) && !isAlpha) {
        super(game);
        
        this.nameData.values.name = isAlpha ? "Delta Octagon" : "Octagon";

        this.healthData.values.health = this.healthData.values.maxHealth = (isAlpha ? 64000 : 8000);
        this.physicsData.values.size = (isAlpha ? 648 : 200) * Math.SQRT1_2;
        this.physicsData.values.sides = 8;
        this.styleData.values.color = shiny ? Color.Shiny : Color.EnemyOctagon;

        this.physicsData.values.absorbtionFactor = isAlpha ? 0.0 : 0.025;
        this.physicsData.values.pushFactor = 18;

        this.isAlpha = isAlpha;
        this.isShiny = shiny;

        this.damagePerTick = isAlpha ? 35 : 20;
        this.scoreReward = isAlpha ? 96000 : 12800;
        
        if (shiny) {
            isAlpha = true
        this.nameData.values.name = "Dodecagon";
        this.physicsData.values.size = 1800
        this.physicsData.values.sides = 8;
            this.scoreReward *= 1000;
            this.healthData.values.health = this.healthData.values.maxHealth *= 100;
        }
    }
}