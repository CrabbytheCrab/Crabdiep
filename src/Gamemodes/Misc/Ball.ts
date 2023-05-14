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
import ArenaEntity, { ArenaState } from "../../Native/Arena";
import ObjectEntity from "../../Entity/Object";

import Pentagon from "../../Entity/Shape/Pentagon";

import { Color, ArenaFlags, PhysicsFlags, PositionFlags, ClientBound, ColorsHexCode, ValidScoreboardIndex, NameFlags } from "../../Const/Enums";
import { NameGroup } from "../../Native/FieldGroups";
import AbstractShape from "../../Entity/Shape/AbstractShape";
import { SandboxShapeManager } from "../Sandbox";
import LivingEntity from "../../Entity/Live";
import MazeWall from "../../Entity/Misc/MazeWall";
import TeamBase from "../../Entity/Misc/TeamBase";
import { TeamEntity } from "../../Entity/Misc/TeamEntity";
import Client from "../../Client";
import TankBody from "../../Entity/Tank/TankBody";
import Dominator from "../../Entity/Misc/Dominator";
import { EntityStateFlags } from "../../Native/Entity";
import { log } from "console";
import Belt from "../../Entity/Misc/Belt";
import BounceWall from "../../Entity/Misc/BounceWall";
import LiveWall from "../../Entity/Misc/LiveWall";
import { StyleFlags } from "../../Const/Enums";
const arenaSize = 11150;
const baseWidth = 2230;
const domBaseSize = baseWidth / 2;
const CELL_SIZE = 635;
const GRID_SIZE = 40;
const ARENA_SIZE = CELL_SIZE * GRID_SIZE;
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
const TEAM_COLORS = [Color.TeamBlue, Color.TeamRed];

/**
 * Ball Gamemode Arena
 */
export default class BallArena extends ArenaEntity {
    /** Controller of all shapes in the arena. */
	protected shapes: CustomShapeManager = new CustomShapeManager(this);
    public blueTeamBase: TeamBase;
    public rSCore: LivingEntity;
    public bSCore: LivingEntity;
    public RedScore: number;
    public BlueScore: number;
    /** Red Team entity */
    public redTeamBase: TeamBase;
    public motherships: LivingEntity[] = [];
    public teams: TeamEntity[] = [];

    public constructor(game: GameServer) {
        super(game);
this.RedScore = 0
this.BlueScore = 0
        this.updateBounds(15000, 5000);
       // new MazeWall(this.game, 0, 5000, 5000, 20000);
        //new MazeWall(this.game, 0, -5000, 5000, 20000);
        new Belt(this.game, -1000, -1750, 500, 1000,0);
        new Belt(this.game, 1000, 1750, 500, 1000,Math.PI);


        new LiveWall(this.game, -2875, -1750, 500, 250);
        new LiveWall(this.game, 2875, 1750, 500, 250);

        const wall = new MazeWall(this.game, 0, -2700, 400, 15000);
        wall.physicsData.flags |= PhysicsFlags.canEscapeArena
        const wall2 = new MazeWall(this.game, 0, 2700, 400, 15000);
        wall2.physicsData.flags |= PhysicsFlags.canEscapeArena

        new MazeWall(this.game, -1750, -750, 1500, 2500);
        new MazeWall(this.game, 1750, 750, 1500, 2500);


        new Belt(this.game, -5750, 1625, 1750, 1000,0);
        new Belt(this.game, -5750, -1625, 1750, 1000,0);
        new BounceWall(this.game, -4875, -0, 500, 250);
        new MazeWall(this.game, -5125, -0, 750, 250);

        new Belt(this.game, 5750, 1625, 1750, 1000,Math.PI);
        new Belt(this.game, 5750, -1625, 1750, 1000,Math.PI);
        new BounceWall(this.game, 4875, -0, 500, 250);
        new MazeWall(this.game, 5125, -0, 750, 250);

        new MazeWall(this.game, 1750, 2250, 500, 2500);
        new MazeWall(this.game, -1750, -2250, 500, 2500);

        new MazeWall(this.game, -1750, 500, 1000, 2500);
        new MazeWall(this.game, 1750, -500, 1000, 2500);

        new MazeWall(this.game, -1250, 2250, 500, 3500);
        new MazeWall(this.game, 1250, -2250, 500, 3500);

        this.blueTeamBase = new TeamBase(game, new TeamEntity(this.game, Color.TeamBlue), -7500 + 1250/2, 0, 5000, 1250);
        this.redTeamBase = new TeamBase(game, new TeamEntity(this.game, Color.TeamRed), 7500 - 1250/2, 0, 5000, 1250);

        
            this.rSCore = new LivingEntity(this.game);
            this.motherships.push(this.rSCore);
    
            this.rSCore.relationsData.values.team =  this.redTeamBase;
            this.rSCore.styleData.values.color = this.redTeamBase.styleData.values.color;
            this.rSCore.positionData.values.x = 10000
            this.rSCore.positionData.values.y = 10000
            this.rSCore.MAXDRONES = 0

            this.bSCore = new LivingEntity(this.game);
            this.motherships.push(this.bSCore);
    
            this.bSCore.relationsData.values.team =  this.blueTeamBase;
            this.bSCore.styleData.values.color = this.blueTeamBase.styleData.values.color;
            this.bSCore.positionData.values.x = 10000
            this.bSCore.positionData.values.y = 10000
            this.bSCore.MAXDRONES = 0
            this.balls()
    }
    public balls(){
        const ball = new LivingEntity(this.game);
        ball.nameData = new NameGroup(ball);
        ball.nameData.values.name = "Smashtards when they die to intended game mechanics(Its a bug and should be removed)"
        ball.nameData.flags |= NameFlags.hiddenName
        ball.physicsData.values.sides = 1;
        ball.styleData.values.color = Color.ScoreboardBar;
        ball.styleData.values.flags |= StyleFlags.hasNoDmgIndicator;
        ball.physicsData.flags |= PhysicsFlags.showsOnMap
        ball.physicsData.values.size = 80;
        ball.physicsData.values.absorbtionFactor = 1;
        ball.damagePerTick = 40;
        ball.physicsData.pushFactor = 4
        
        ball.damageReduction = 0
        ball.physicsData.values.sides = 10000
        ball.entityState |= EntityStateFlags.needsCreate |EntityStateFlags.needsDelete
        const tickBase = ball.tick;
        ball.styleData.values.zIndex = 4
        ball.tick = (tick: number) => {
             //   console.log(ball.positionData.x)
               // console.log(ball.positionData.y)

            tickBase.call(ball, tick);
            ball.styleData.zIndex = 4
            const entities = ball.findCollisions()
            if(this.BlueScore >= 3){
                ball.delete()
            let message = `BLUE TEAM HAS WON THE GAME`
            this.game.broadcast().u8(ClientBound.Notification).stringNT(message).u32(Color.TeamBlue).float(10000).stringNT("").send();
            this.state = ArenaState.OVER;
            setTimeout(() => {
                this.close();
            }, 5000);
        }
        if(this.RedScore >= 5){
            ball.delete()
            let message = `RED TEAM HAS WON THE GAME`
            this.game.broadcast().u8(ClientBound.Notification).stringNT(message).u32(Color.TeamRed).float(10000).stringNT("").send();
            this.state = ArenaState.OVER;
            setTimeout(() => {
                this.close();
            }, 5000);
        }
            for (let i = 0; i < entities.length; ++i) {
                const entity = entities[i];
                if (entity instanceof TeamBase){
                    if(entity.styleData.color == Color.TeamRed){
                        if(this.BlueScore < 3){
                            this.bSCore.MAXDRONES++;
                            this.BlueScore++;
                            ball.delete()
                            this.balls()
                
                     }
                }else if(entity.styleData.color == Color.TeamBlue){
                        if(this.RedScore < 5){
                            this.RedScore++;
                            this.rSCore.MAXDRONES ++;
                            ball.delete()
                            this.balls()
                        }
                    }
                }
            }
        }
    }
    public updateScoreboard(scoreboardPlayers: TankBody[]) {
        this.motherships.sort((m1, m2) => m2.MAXDRONES - m1.MAXDRONES);
        const length = Math.min(10, this.motherships.length);
        for (let i = 0; i < length; ++i) {
            const mothership = this.motherships[i];
            const team = mothership.relationsData.values.team;
            const isTeamATeam = team instanceof TeamEntity;
            if (isTeamATeam) {
                team.teamData.mothershipX = mothership.positionData.values.x;
                team.teamData.mothershipY = mothership.positionData.values.y;
            }
            if (mothership.styleData.values.color === Color.Tank) this.arenaData.values.scoreboardColors[i as ValidScoreboardIndex] = Color.ScoreboardBar;
            else this.arenaData.values.scoreboardColors[i as ValidScoreboardIndex] = mothership.styleData.values.color;
            this.arenaData.values.scoreboardNames[i as ValidScoreboardIndex] = isTeamATeam ? team.teamName : `Team Score`;
            // TODO: Change id
            this.arenaData.values.scoreboardTanks[i as ValidScoreboardIndex] = -1;
            this.arenaData.values.scoreboardScores[i as ValidScoreboardIndex] = mothership.MAXDRONES;
        }
       
        this.arenaData.scoreboardAmount = length;
    }
    public playerTeamMap: Map<Client, TeamBase> = new Map();
    
    public spawnPlayer(tank: TankBody, client: Client) {
        tank.positionData.values.y = 5000 * Math.random() - 5000;

        const xOffset = (Math.random() - 0.5) * 1250,
        yOffset = (Math.random() - 0.5) * 5000;
        
        const base = this.playerTeamMap.get(client) || [this.blueTeamBase, this.redTeamBase][0|Math.random()*2];
        tank.relationsData.values.team = base.relationsData.values.team;
        tank.styleData.values.color = base.styleData.values.color;
        tank.positionData.values.x = base.positionData.values.x + xOffset;
        tank.positionData.values.y = base.positionData.values.y + yOffset;
        this.playerTeamMap.set(client, base);

        if (client.camera) client.camera.relationsData.team = tank.relationsData.values.team;
    }
}
