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

import GameServer from "../Game";
import ArenaEntity from "../Native/Arena";
import Client from "../Client";

import TeamBase from "../Entity/Misc/TeamBase";
import TankBody from "../Entity/Tank/TankBody";

import { TeamEntity } from "../Entity/Misc/TeamEntity";
import { Color } from "../Const/Enums";
import Dominator from "../Entity/Misc/Dominator";
import MazeWall from "../Entity/Misc/MazeWall";
import ShapeManager from "../Entity/Shape/Manager";

 const arenaSize = 11150;
 const baseWidth = 2230;
 const domBaseSize = baseWidth / 2;
 const CELL_SIZE = 635;
const GRID_SIZE = 40;
const ARENA_SIZE = CELL_SIZE * GRID_SIZE;
// const arenaSize = 2000;
// const baseWidth = 407;

/**
 * Teams2 Gamemode Arena
 */

 export class Chaoschance extends ShapeManager {
      constructor(arena: ArenaEntity) {
        super(arena);
        this.sentrychance = 0
    }
}

export default class Teams2Arena extends ArenaEntity {
    /** Blue Team entity */
    public blueTeamBase: TeamBase;
    /** Red Team entity */
    public redTeamBase: TeamBase;
    // /** Limits shape count 100 */
    //     protected shapes: ShapeManager = new class extends ShapeManager {
    //     protected get wantedShapes() {
    //         return 64;
    //     }
    // }(this);

    /** Maps clients to their teams */
    public playerTeamMap: Map<Client, TeamBase> = new Map();
    public constructor(game: GameServer) {
        super(game);
        this.updateBounds(arenaSize * 2, arenaSize * 2);
        this.blueTeamBase = new TeamBase(game, new TeamEntity(this.game, Color.TeamBlue), -arenaSize + baseWidth / 2, 0, arenaSize * 2, baseWidth);
        this.redTeamBase = new TeamBase(game, new TeamEntity(this.game, Color.TeamRed), arenaSize - baseWidth / 2, 0, arenaSize * 2, baseWidth);
        new Dominator(this, new TeamBase(game, this, arenaSize/2.5, 0, domBaseSize, domBaseSize, false));
        new Dominator(this, new TeamBase(game, this, -arenaSize/2.5, 0, domBaseSize, domBaseSize, false));

        new MazeWall(this.game, -arenaSize/2.5, -arenaSize/5, domBaseSize * 3, domBaseSize);
        new MazeWall(this.game, arenaSize/2.5, -arenaSize/5, domBaseSize * 3, domBaseSize);

        new MazeWall(this.game, -arenaSize/2.5, arenaSize/5, domBaseSize * 3, domBaseSize);
        new MazeWall(this.game, arenaSize/2.5,  arenaSize/5, domBaseSize * 3, domBaseSize);

        new MazeWall(this.game, -arenaSize/5 + 2230 ,  -arenaSize/2.5, domBaseSize, domBaseSize * 7);
        new MazeWall(this.game, -arenaSize/5 + 2230 ,  arenaSize/2.5, domBaseSize, domBaseSize * 7);
        this.shapeScoreRewardMultiplier = 3.0;

    }

    public spawnPlayer(tank: TankBody, client: Client) {
        tank.positionData.values.y = arenaSize * Math.random() - arenaSize;

        const xOffset = (Math.random() - 0.5) * baseWidth;
        
        const base = this.playerTeamMap.get(client) || [this.blueTeamBase, this.redTeamBase][0|Math.random()*2];
        tank.relationsData.values.team = base.relationsData.values.team;
        tank.styleData.values.color = base.styleData.values.color;
        tank.positionData.values.x = base.positionData.values.x + xOffset;
        this.playerTeamMap.set(client, base);

        if (client.camera) client.camera.relationsData.team = tank.relationsData.values.team;
    }
}
