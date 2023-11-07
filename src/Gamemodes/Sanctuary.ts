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

import Client from "../Client";
import { PhysicsFlags, Color, StyleFlags, Tank, PositionFlags } from "../Const/Enums";
import AiTank from "../Entity/Misc/AiTank";
import BlackHole from "../Entity/Misc/BlackHole";
import BlackHoleAlt from "../Entity/Misc/BlackHoleAlt";
import TeamBase from "../Entity/Misc/TeamBase";
import { TeamEntity } from "../Entity/Misc/TeamEntity";
import AbstractShape from "../Entity/Shape/AbstractShape";
import Crasher from "../Entity/Shape/Crasher";
import Heptagon from "../Entity/Shape/Heptagon";
import Hexagon from "../Entity/Shape/Hexagon";
import ShapeManager from "../Entity/Shape/Manager";
import Octagon from "../Entity/Shape/Octagon";
import Pentagon from "../Entity/Shape/Pentagon";
import { Sentry } from "../Entity/Shape/Sentry";
import Square from "../Entity/Shape/Square";
import Triangle from "../Entity/Shape/Triangle";
import WepPentagon from "../Entity/Shape/WepPentagon";
import WepSquare from "../Entity/Shape/WepSquare";
import WepTriangle from "../Entity/Shape/WepTriangle";
import TankBody from "../Entity/Tank/TankBody";
import GameServer from "../Game";
import ArenaEntity from "../Native/Arena";
import { SandboxShapeManager } from "./Sandbox";

/**
 * Scenexe Gamemode Arena
 */
const arenaSize = 10000;
const baseWidth = 3000;
const domBaseSize = baseWidth / 2;
const CELL_SIZE = 635;
const GRID_SIZE = 40;

class CustomShapeManager extends SandboxShapeManager {
    protected get wantedShapes() {
        let i = 0;
        for (const client of this.game.clients) {
            if (client.camera) i += 1;
        }
        return 0;
    }
}

export default class Sanctuary extends ArenaEntity {
    public timer = 900
    public celestial = new TeamEntity(this.game, Color.EnemyCrasher)
	protected shapes: ShapeManager = new CustomShapeManager(this);
    public celestialTeamBase: TeamBase;

    public playerTeamMap: Map<Client, TeamBase> = new Map();

    public constructor(game: GameServer) {
        super(game);
        //this.shapeScoreRewardMultiplier = 2;
        this.maxtanklevel = 90
        this.updateBounds(8000, 8000);
        this.celestialTeamBase = new TeamBase(game, new TeamEntity(this.game, Color.EnemyCrasher), 0,0, 3000,3000);
    }
    public tick(tick: number) {
        super.tick(tick);
        this.timer--
        if(this.timer <= 0){
            //new AiTank(this.game)
            const rand = Math.random();
            if(rand > 0.5){
                new BlackHoleAlt(this.game, this.celestial, "scenexe",1)
            }else{            
                new BlackHoleAlt(this.game, this.celestial, "crossroads",1)
            }
            this.timer = 900
        }
    }
    public spawnPlayer(tank: TankBody, client: Client) {
        const xOffset = (Math.random() - 0.5) * baseWidth;
        
        const base = this.playerTeamMap.get(client) || [this.celestialTeamBase][0];
        tank.relationsData.values.team = base.relationsData.values.team;
        tank.styleData.values.color = base.styleData.values.color;
        tank.positionData.values.x = base.positionData.values.x + xOffset;
        tank.positionData.values.y = base.positionData.values.y + xOffset;
        tank.setTank(tank.currentTank)
        this.playerTeamMap.set(client, base);
        if (client.camera) client.camera.relationsData.team = tank.relationsData.values.team;
    }
}