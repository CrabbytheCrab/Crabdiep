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
import Peacekeeper from "../Entity/Shape/Peacekeeper";
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

/**
 * Scenexe Gamemode Arena
 */
const arenaSize = 10000;
const baseWidth = 2230;
const domBaseSize = baseWidth / 2;
const CELL_SIZE = 635;
const GRID_SIZE = 40;

class CustomShapeManager extends ShapeManager {
        protected spawnShape(): AbstractShape {
            let shape: AbstractShape;
            const rand2 = Math.random();
            const {x, y} = this.arena.findSpawnLocation();
            const rightX = this.arena.arenaData.values.rightX;
            const leftX = this.arena.arenaData.values.leftX;
            const rand = Math.random();
    
            if (Math.max(x, y) < rightX / 4 && Math.min(x, y) > leftX / 4) {
                // Pentagon Nest
                if(rand < 0.02){
                    shape = new Peacekeeper(this.game);
        
                    shape.positionData.values.x = x;
                    shape.positionData.values.y = y;
                    shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;}
               else if(rand < 0.12){
                    shape = new Octagon(this.game, Math.random() <= 0.1,Math.random() < 0.005);
        
                    shape.positionData.values.x = x;
                    shape.positionData.values.y = y;
                    shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;}
              else if(rand < 0.47){
                shape = new Heptagon(this.game, Math.random() <= 0.1,Math.random() < 0.005);
    
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }else{
                shape = new Hexagon(this.game, Math.random() <= 0.1,Math.random() < 0.005);
    
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
            } else {
                // Fields of Shapes
                const rand = Math.random();
                if (rand < .05) {
                    shape = new Hexagon(this.game, false,Math.random() < 0.0025);
    
                    shape.positionData.values.x = x;
                    shape.positionData.values.y = y;
                    shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
                }else if (rand < .15) {
                    shape = new Pentagon(this.game,Math.random() < 0.001,Math.random() < 0.0025);
    
                    shape.positionData.values.x = x;
                    shape.positionData.values.y = y;
                    shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
                } else if (rand < .35) { // < 16%
                        shape = new Triangle(this.game,Math.random() < 0.0025);
    
                        shape.positionData.values.x = x;
                        shape.positionData.values.y = y;
                        shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
                } else { // if rand < 80%
                  shape = new Square(this.game,Math.random() < 0.0025);
    
                        shape.positionData.values.x = x;
                        shape.positionData.values.y = y;
                        shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
                }
            }
        shape.scoreReward *= this.arena.shapeScoreRewardMultiplier;

                return shape;
            // this.shapeCount += 1;
        }
}

export default class Scenexe extends ArenaEntity {
    public timer = 600
    public celestial = new TeamEntity(this.game, Color.EnemyCrasher)
	protected shapes: ShapeManager = new CustomShapeManager(this);
    public constructor(game: GameServer) {
        super(game);
        //this.shapeScoreRewardMultiplier = 2;
        this.maxtanklevel = 60
        this.updateBounds(24000, 24000);
    }
    public tick(tick: number) {
        super.tick(tick);
        this.timer--
        if(this.timer <= 0){
            //new AiTank(this.game)
            const rand = Math.random();
            if(rand > 0.5){
                new BlackHole(this.game, this.celestial)
            }else{            
                new BlackHoleAlt(this.game, this.celestial, "crossroads",3)
            }
            this.timer = 600
        }
    }
    public spawnPlayer(tank: TankBody, client: Client) {
        tank.positionData.values.y = arenaSize * Math.random() - arenaSize;

        const xOffset = (Math.random() - 0.5) * baseWidth;
        if (client.camera){
            if(client.camera.cameraData.isCelestial == true){
                tank.relationsData.values.team = this.celestial;
                tank.definition.flags.isCelestial = true;
                tank.styleData.color = Color.EnemyCrasher
                client.camera.relationsData.team = tank.relationsData.values.team;
                tank.setTank(tank.currentTank)
            }
        }
    }
}