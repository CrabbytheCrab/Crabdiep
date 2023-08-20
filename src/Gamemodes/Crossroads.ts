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
import ArenaEntity, { ArenaState } from "../Native/Arena";
import MazeWall from "../Entity/Misc/MazeWall";
import { VectorAbstract } from "../Physics/Vector";
import AbstractShape from "../Entity/Shape/AbstractShape";
import Heptagon from "../Entity/Shape/Heptagon";
import Hexagon from "../Entity/Shape/Hexagon";
import ShapeManager from "../Entity/Shape/Manager";
import Octagon from "../Entity/Shape/Octagon";
import Pentagon from "../Entity/Shape/Pentagon";
import Square from "../Entity/Shape/Square";
import Triangle from "../Entity/Shape/Triangle";
import Abyssling from "../Entity/Shape/Abyssling";
import TankBody from "../Entity/Tank/TankBody";
import Client from "../Client";
import { TeamEntity } from "../Entity/Misc/TeamEntity";
import { Color } from "../Const/Enums";
import BlackHoleAlt from "../Entity/Misc/BlackHoleAlt";
import Peacekeeper from "../Entity/Shape/Peacekeeper";

// constss.
const CELL_SIZE = 500;
const GRID_SIZE = 40;
const ARENA_SIZE = CELL_SIZE * GRID_SIZE;
const SEED_AMOUNT = Math.floor(Math.random() * 30) + 30;
const TURN_CHANCE = 0.5;
const BRANCH_CHANCE = 0.5;
const TERMINATION_CHANCE = 0.3;

/**
 * Maze Gamemode Arena
 * 
 * Implementation details:
 * Maze map generator by damocles <github.com/SpanksMcYeet>
 *  - Added into codebase on December 3rd 2022
 */
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
            if(rand < 0.05){
                shape = new Abyssling(this.game);            
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
            else if(rand < 0.2){
                shape = new Octagon(this.game, Math.random() <= 0.1,Math.random() < 0.05);
    
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;}
          else if(rand < 0.5){
            shape = new Heptagon(this.game, Math.random() <= 0.2,Math.random() < 0.05);

            shape.positionData.values.x = x;
            shape.positionData.values.y = y;
            shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
        }else{
            shape = new Hexagon(this.game, Math.random() <= 0.4,Math.random() < 0.05);

            shape.positionData.values.x = x;
            shape.positionData.values.y = y;
            shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
        }
        } else {
            // Fields of Shapes
            const rand = Math.random();
            if(rand < 0.01){
                shape = new Peacekeeper(this.game);
    
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;}
            else if(rand < 0.02){
                shape = new Octagon(this.game, Math.random() <= 0.01,Math.random() < 0.05);
    
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;}
          else if(rand < 0.17){
            shape = new Heptagon(this.game, Math.random() <= 0.025,Math.random() < 0.05);

            shape.positionData.values.x = x;
            shape.positionData.values.y = y;
            shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;}
            else if(rand < 0.47){

                shape = new Hexagon(this.game, Math.random() <= 0.075,Math.random() < 0.05);

                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }else{
                shape = new Pentagon(this.game, Math.random() <= 0.3,Math.random() < 0.05);

                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
        }
        if(!shape.noMultiplier){
            shape.scoreReward *= this.arena.shapeScoreRewardMultiplier;
            shape.healthData.maxHealth *= this.arena.shapeHeathMultiplier;
            shape.healthData.health *= this.arena.shapeHeathMultiplier;
        }
            return shape;
        // this.shapeCount += 1;
    }
}
const domBaseSize = 2230 / 2;

export default class Crossroads extends ArenaEntity {
    /** Stores all the "seed"s */
    private SEEDS: VectorAbstract[] = [];
    /** Stores all the "wall"s, contains cell based coords */
    private WALLS: (VectorAbstract & {width: number, height: number})[] = [];
    /** Rolled out matrix of the grid */
    private MAZE: Uint8Array = new Uint8Array(GRID_SIZE * GRID_SIZE);
	protected shapes: ShapeManager = new CustomShapeManager(this);
    public celestial = new TeamEntity(this.game, Color.EnemyCrasher)

    public constructor(a: any) {
        super(a);
        this.shapeHeathMultiplier = 0.5
        this.maxtanklevel = 60
        this.shapeScoreRewardMultiplier = 0.5
        this.updateBounds(ARENA_SIZE, ARENA_SIZE);
    }
    public timer = 900

    public tick(tick: number) {
        super.tick(tick);
        this.timer--
        if(this.timer <= 0){
            //new AiTank(this.game)
            new BlackHoleAlt(this.game, this.celestial, "scenexe",3)
            this.timer = 900
        }
    }
    public spawnPlayer(tank: TankBody, client: Client) {

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