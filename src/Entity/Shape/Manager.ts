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

import ArenaEntity from "../../Native/Arena";
import GameServer from "../../Game";

import Crasher from "./Crasher";
import Pentagon from "./Pentagon";
import Triangle from "./Triangle";
import Square from "./Square";
import AbstractShape from "./AbstractShape";
import { Sentry } from "./Sentry";
import  WepTriangle from "./WepTriangle";
import  WepSquare from "./WepSquare";
import WepPentagon from "./WepPentagon";
import Hexagon from "./Hexagon";

/**
 * Used to balance out shape count in the arena, as well
 * as determines where each type of shape spawns around the arena.
 */
export default class ShapeManager {
    /** Current game server */
    protected game: GameServer;
    /** Arena whose shapes are being managed */
    protected arena: ArenaEntity;
    public sentrychance = 0.1
    public weaponchance = 0.025
    public weaponchancenest = 0.0125
    public alphachance = 0.025
    public constructor(arena: ArenaEntity) {
        this.arena = arena;
        this.game = arena.game;
        
    }

    /**
     * Spawns a shape in a random location on the map.
     * Determines shape type by the random position chosen.
     */
    protected spawnShape(): AbstractShape {
        let shape: AbstractShape;
        const rand2 = Math.random();
        const {x, y} = this.arena.findSpawnLocation();
        const rightX = this.arena.arenaData.values.rightX;
        const leftX = this.arena.arenaData.values.leftX;
        const rand = Math.random();

        if (Math.max(x, y) < rightX / 10 && Math.min(x, y) > leftX / 10) {
            // Pentagon Nest
            if(rand < 0.995){
            if(rand2 < this.weaponchancenest){
                if(rand2 < this.alphachance && this.game.pentalord == false){

                shape = new WepPentagon(this.game, true);

                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
                this.game.pentalord = true

            }else{
                shape = new WepPentagon(this.game, false);
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }}
            else{
            shape = new Pentagon(this.game, Math.random() <= 0.05);

            shape.positionData.values.x = x;
            shape.positionData.values.y = y;
            shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
        }}else{
            shape = new Hexagon(this.game, Math.random() <= 0.2);

            shape.positionData.values.x = x;
            shape.positionData.values.y = y;
            shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
        }
        } else if (Math.max(x, y) < rightX / 5 && Math.min(x, y) > leftX / 5) {
            const rand = Math.random();
            // Crasher Zone
            if (rand < this.sentrychance){
                const isBig = true;
                shape = new Sentry(this.game, isBig);            
                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
                }
            else{
            const isBig = Math.random() < .2;
            shape = new Crasher(this.game, isBig);            
            shape.positionData.values.x = x;
            shape.positionData.values.y = y;
            shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
            }
        } else {
            // Fields of Shapes
            const rand = Math.random();
            if (rand < .04) {
                if(rand2 < this.weaponchance){
                    shape = new WepPentagon(this.game);

                    shape.positionData.values.x = x;
                    shape.positionData.values.y = y;
                    shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
                }
                else{
                shape = new Pentagon(this.game);

                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;}
            } else if (rand < .20) { // < 16%
                if(rand2 < this.weaponchance){
                shape = new WepTriangle(this.game);

                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;}
                else{
                    shape = new Triangle(this.game);

                    shape.positionData.values.x = x;
                    shape.positionData.values.y = y;
                    shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;
                }
            } else { // if rand < 80%
                if(rand2 < this.weaponchance){
                shape = new WepSquare(this.game);

                shape.positionData.values.x = x;
                shape.positionData.values.y = y;
                shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;}
                else{shape = new Square(this.game);

                    shape.positionData.values.x = x;
                    shape.positionData.values.y = y;
                    shape.relationsData.values.owner = shape.relationsData.values.team = this.arena;}
            }
        }

        shape.scoreReward *= this.arena.shapeScoreRewardMultiplier;

        return shape;
        // this.shapeCount += 1;
    }

    /** Kills all shapes in the arena */
    public killAll() {
        const entities = this.game.entities.inner;
        const lastId = this.game.entities.lastId;
        for (let id = 0; id <= lastId; ++id) {
            const entity = entities[id];
            if (entity instanceof AbstractShape) entity.delete();
        }
        // this.shapeCount = 0;
    }

    protected get wantedShapes() {
        return 1000;
    }

    public tick() {
        const wantedShapes = this.wantedShapes;

        let count = 0;
        for (let id = 1; id <= this.game.entities.lastId; ++id) {
            const entity = this.game.entities.inner[id];

            if (entity instanceof AbstractShape) {
                count += 1;
            }
        }

        // // TODO(ABC):
        // // Remove this once anti multiboxing starts / when 0x02 is built
        // if (count >= wantedShapes * 10) {
        //     count = 0;
        //     this.killAll();
        // }

        while (count < wantedShapes) {
            this.spawnShape();
            this.spawnShape();
            this.spawnShape();
            this.spawnShape();
            this.spawnShape();
            this.spawnShape();
            this.spawnShape();
            this.spawnShape();
            this.spawnShape();
            this.spawnShape();
            count += 10;
        }
    }
}