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

import { TankDefinition } from "../../Const/TankDefinitions"
import { CameraEntity } from "../../Native/Camera"
import { Inputs } from "../AI"
import Barrel from "../Tank/Barrel"
import TankBody from "../Tank/TankBody"
import TeamBase from "./TeamBase"

const tankdef: TankDefinition = {
    "id": 0,
    "name": "",
    "upgradeMessage": "",
    "levelRequirement": 0,
    "upgrades": [],
    "flags": {
        "invisibility": false,
        "zoomAbility": false,
        "canClaimSquares": false,
        "devOnly": true
    },
    "visibilityRateShooting": 0.23,
    "visibilityRateMoving": 0.08,
    "invisibilityRate": 0.03,
    "fieldFactor": 0.4,
    "absorbtionFactor": 1,
    "speed": 0,
    "maxHealth": 1,
    "preAddon": null,
    "postAddon": null,
    "sides": 0,
    "borderWidth": 15,
    "barrels": [
        {
            "angle": 0,
            "offset": 0,
            "size": 70,
            "width": 42,
            "delay": 0,
            "reload": 6,
            "recoil": 1,
            "isTrapezoid": true,
            "trapezoidDirection": 0,
            "addon": null,
            "droneCount": 2,
            "canControlDrones": true,
            "bullet": {
                "type": "basedrone",
                "sizeRatio": 1,
                "health": 10000,
                "damage": 1.5,
                "speed": 3.0,
                "scatterRate": 1,
                "lifeLength": -1,
                "absorbtionFactor": 1
            }
        }
    ],
    "stats": [
        {
            "name": "Movement Speed",
            "max": 7
        },
        {
            "name": "Reload",
            "max": 7
        },
        {
            "name": "Drone Damage",
            "max": 7
        },
        {
            "name": "Drone Health",
            "max": 7
        },
        {
            "name": "Drone Speed",
            "max": 7
        },
        {
            "name": "Body Damage",
            "max": 7
        },
        {
            "name": "Max Health",
            "max": 7
        },
        {
            "name": "Health Regen",
            "max": 7
        }
    ]
}

export default class BaseDrones extends TankBody {
    public constructor(owner: TeamBase, xOffset: number, yOffset: number) {
        super(owner.game, new CameraEntity(owner.game), new Inputs());

        this.positionData.x = owner.positionData.x + xOffset;
        this.positionData.y = owner.positionData.y + yOffset;

        for (let i = 0; i < this.children.length; ++i) {
            this.children[i].isChild = false;
            this.children[i].delete();
        }
        this.children = [];
        this.barrels = [];

        this.definition = tankdef;

        this.physicsData.sides = 0;
        this.styleData.opacity = 0;
        this.relationsData.team = owner.relationsData.team;
        this.styleData.color = owner.styleData.color;

        for (const barrel of tankdef.barrels) {
            this.barrels.push(new Barrel(this, barrel));
        }
    }
}
