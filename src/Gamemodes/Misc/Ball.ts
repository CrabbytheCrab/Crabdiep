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
import ArenaEntity from "../../Native/Arena";
import ObjectEntity from "../../Entity/Object";

import Pentagon from "../../Entity/Shape/Pentagon";

import { Color, ArenaFlags, PhysicsFlags } from "../../Const/Enums";
import { NameGroup } from "../../Native/FieldGroups";
import AbstractShape from "../../Entity/Shape/AbstractShape";
import { SandboxShapeManager } from "../Sandbox";
import LivingEntity from "../../Entity/Live";

/**
 * Only spawns crashers
 */
class CustomShapeManager extends SandboxShapeManager {
    protected get wantedShapes() {
        let i = 0;
        for (const client of this.game.clients) {
            if (client.camera) i += 1;
        }
        return 0;
    }
}

/**
 * Ball Gamemode Arena
 */
export default class BallArena extends ArenaEntity {
    /** Controller of all shapes in the arena. */
	protected shapes: CustomShapeManager = new CustomShapeManager(this);

    public constructor(game: GameServer) {
        super(game);

        this.arenaData.values.flags |= ArenaFlags.canUseCheats;
        this.updateBounds(2500, 2500);

        const ball = new LivingEntity(game);
        ball.nameData = new NameGroup(ball);
        ball.nameData.values.name = "im pacman"
        ball.physicsData.values.sides = 1;
        ball.styleData.values.color = Color.ScoreboardBar;
        ball.physicsData.values.size = 100;
        ball.physicsData.values.absorbtionFactor = 0;
        ball.damageReduction = 0
        ball.relationsData.values.team = ball;
    }
}