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
import { PhysicsFlags, Color, StyleFlags, Tank, PositionFlags, TeamFlags, ValidScoreboardIndex, ArenaFlags, ClientBound, ColorsHexCode } from "../Const/Enums";
import AbstractBoss from "../Entity/Boss/AbstractBoss";
import Basher from "../Entity/Boss/Basher";
import Beholder from "../Entity/Boss/Beholder";
import Defender from "../Entity/Boss/Defender";
import FallenBooster from "../Entity/Boss/FallenBooster";
import FallenOverlord from "../Entity/Boss/FallenOverlord";
import FallenPuker from "../Entity/Boss/FallenPuker";
import Fortress from "../Entity/Boss/Fortress";
import Guardian from "../Entity/Boss/Guardian";
import Mecha from "../Entity/Boss/Mecha";
import Protector from "../Entity/Boss/Protector";
import Pyromancer from "../Entity/Boss/Pyromancer";
import Summoner from "../Entity/Boss/Summoner";
import Titan from "../Entity/Boss/Titan";
import LivingEntity from "../Entity/Live";
import AiTank from "../Entity/Misc/AiTank";
import BlackHole from "../Entity/Misc/BlackHole";
import BlackHoleAlt from "../Entity/Misc/BlackHoleAlt";
import FallenMegaTrapper from "../Entity/Misc/Boss/FallenMegaTrapper";
import TeamBase from "../Entity/Misc/TeamBase";
import { TeamEntity } from "../Entity/Misc/TeamEntity";
import AbstractShape from "../Entity/Shape/AbstractShape";
import Abyssling from "../Entity/Shape/Abyssling";
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
import ArenaEntity, { ArenaState } from "../Native/Arena";
import { Entity } from "../Native/Entity";
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

export default class BossBash extends ArenaEntity {
	protected shapes: ShapeManager = new CustomShapeManager(this);

    public playerTeamMap: Map<Client, TeamBase> = new Map();
    
    public waveEntities: LivingEntity[] = [];
    public nonwaveEntities: LivingEntity[] = [];
    public nextwave:boolean
    public wave: number
    public difficulty: number
    public hpMultiplier: number
    public waveDuration : number
    public clearDuration : number
    public isCleared:boolean
    
    public constructor(game: GameServer) {
        super(game);
        //this.shapeScoreRewardMultiplier = 2;
        this.updateBounds(8000, 8000);
        this.nextwave = false
        this.wave = 0
        this.hpMultiplier = 0.5
        this.difficulty = 1
        this.waveDuration = 0
        this.clearDuration = 0
        this.isCleared = true
    }
    protected Boss() {
                const rand = Math.random();
                if (rand < .1 * (this.difficulty/10)) {
            const TBoss = [Titan,Basher,Summoner,WepPentagon]
                [~~(Math.random() * 4)];
                if(TBoss == WepPentagon){
                    this.shape = new WepPentagon(this.game,true);
                    this.shape.positionData.values.x = this.findSpawnLocation().x
                    this.shape.positionData.values.y = this.findSpawnLocation().y
                    this.shape.healthData.maxHealth *= this.difficulty
                    this.shape.healthData.health *= this.difficulty
                    this.shape.styleData.flags |= StyleFlags._minimap
                    this.shape.physicsData.flags |= PhysicsFlags.showsOnMap
                    this.waveEntities.push(this.shape)
                }else{
                    
                    this.shape = new TBoss(this.game);
                    this.shape.positionData.values.x = this.findSpawnLocation().x
                    this.shape.positionData.values.y = this.findSpawnLocation().y
                    this.shape.healthData.maxHealth *= this.difficulty
                    this.shape.healthData.health *= this.difficulty
                    this.shape.styleData.flags |= StyleFlags._minimap
                    this.shape.physicsData.flags |= PhysicsFlags.showsOnMap
                    this.waveEntities.push(this.shape)
                }
            }else{
                const TBoss = [Guardian, Protector,Beholder, Defender,FallenBooster,FallenPuker,FallenOverlord,Abyssling]
                //const TBoss = [Mecha]

                [~~(Math.random() * 7)];
                
                this.shape = new TBoss(this.game);
                this.shape.positionData.values.x = this.findSpawnLocation().x
                this.shape.positionData.values.y = this.findSpawnLocation().y
                this.shape.relationsData.team = this.game.arena
                this.shape.healthData.maxHealth *= this.difficulty
                this.shape.healthData.health *= this.difficulty
                this.shape.styleData.flags |= StyleFlags._minimap
                this.shape.physicsData.flags |= PhysicsFlags.showsOnMap
                this.waveEntities.push(this.shape)
            }
    }
    protected Shape() {
        const rand = Math.random();
        if (rand < .05 * (this.difficulty/10)) {
    const TShape = [Peacekeeper,Peacekeeper]
        [~~(Math.random() * 2)];
            this.shape = new TShape(this.game);
            this.shape.positionData.values.x = this.findSpawnLocation().x
            this.shape.positionData.values.y = this.findSpawnLocation().y
            if(this.shape instanceof Peacekeeper){
                this.shape.healthData.maxHealth *= 3 * this.difficulty
                this.shape.healthData.health *= 3 * this.difficulty
            this.nonwaveEntities.push(this.shape)
        }
    }else{
        const TShape = [Sentry, Sentry]
        //const TBoss = [Mecha]

        [~~(Math.random() * 2)];
        
        this.shape = new TShape(this.game);
        this.shape.positionData.values.x = this.findSpawnLocation().x
        this.shape.positionData.values.y = this.findSpawnLocation().y
        this.shape.healthData.maxHealth *= 1.5 * this.difficulty
        this.shape.healthData.health *= 1.5 * this.difficulty
        this.nonwaveEntities.push(this.shape)
    }
}
    public updateScoreboard(scoreboardPlayers: TankBody[]) {
        this.waveEntities.sort((m1, m2) => (m2.healthData.values.health/m2.healthData.values.maxHealth) -(m1.healthData.values.health/m1.healthData.values.maxHealth));
        const length = Math.min(10, this.waveEntities.length);
        const leader = this.waveEntities[0];
        if(leader){
        if(leader instanceof AbstractBoss || leader instanceof AbstractShape){
            this.arenaData.leaderX = leader.positionData.values.x;
            this.arenaData.leaderY = leader.positionData.values.y;
            this.arenaData.flags |= ArenaFlags.showsLeaderArrow;
        }}else if (this.arenaData.values.flags & ArenaFlags.showsLeaderArrow) this.arenaData.flags ^= ArenaFlags.showsLeaderArrow;

        for (let i = 0; i < length; ++i) {
            const mothership = this.waveEntities[i];
            const team = mothership.relationsData.values.team;
            const isTeamATeam = team instanceof TeamEntity;
            if (isTeamATeam) {
                team.teamData.mothershipX = mothership.positionData.values.x;
                team.teamData.mothershipY = mothership.positionData.values.y;
                team.teamData.flags |= TeamFlags.hasMothership;
            }
            if (mothership.styleData.values.color === Color.Tank) this.arenaData.values.scoreboardColors[i as ValidScoreboardIndex] = Color.ScoreboardBar;
            else this.arenaData.values.scoreboardColors[i as ValidScoreboardIndex] = mothership.styleData.values.color;
            if(mothership instanceof AbstractBoss || mothership instanceof AbstractShape) this.arenaData.values.scoreboardNames[i as ValidScoreboardIndex] = isTeamATeam ? team.teamName : `${mothership.nameData.name}`;
            // TODO: Change id
            this.arenaData.values.scoreboardTanks[i as ValidScoreboardIndex] = -1;
            this.arenaData.values.scoreboardScores[i as ValidScoreboardIndex] = mothership.healthData.values.health/mothership.healthData.values.maxHealth * 100;
            this.arenaData.values.scoreboardSuffixes[i as ValidScoreboardIndex] = "% HP";
        }
       
        this.arenaData.scoreboardAmount = length;
    }

    public tick(tick: number) {
        super.tick(tick);
        if(this.nextwave){
            this.nextwave = false
            for(let i = 0; i < this.difficulty; ++i) {
                this.Boss()
            }
            for(let i = 0; i < this.difficulty * 3; ++i) {
                this.Shape()
            }
        }
                // backwards to preserve
        for (let i = this.waveEntities.length; i --> 0;) {
            const mot = this.waveEntities[i];
            if (!Entity.exists(mot)) {
                const pop = this.waveEntities.pop();
                if (pop && i < this.waveEntities.length) this.waveEntities[i] = pop;
            }
        }
        for (let i = this.nonwaveEntities.length; i --> 0;) {
            const mot = this.nonwaveEntities[i];
            if(this.isCleared)mot.destroy(true)
            if (!Entity.exists(mot)) {
                const pop = this.nonwaveEntities.pop();
                if (pop && i < this.nonwaveEntities.length) this.nonwaveEntities[i] = pop;
            }
        }
        if(this.isCleared){
            this.clearDuration++
            if(this.clearDuration >= 300){
                this.game.broadcast()
                .u8(ClientBound.Notification)
                this.wave ++
                let message = `Wave ${this.wave} is starting!`
                this.game.broadcast().u8(ClientBound.Notification).stringNT(message).u32(0xFF0000).float(10000).stringNT("").send();
                this.clearDuration = 0
                if(this.difficulty >= 10){this.difficulty = 10
                    this.hpMultiplier += (0.25 * (this.hpMultiplier/4))
                }else{
                    if(this.wave > 1) this.hpMultiplier += (0.25 * (this.hpMultiplier/8))
                    if(this.wave > 1) this.difficulty += (0.75 * (this.wave/8))
                }
                for(let i = 0; i < this.difficulty; ++i) {
                    this.Boss()
                }
                if(this.wave < 10){
                    for(let i = 0; i < this.difficulty * 2; ++i) {
                        this.Shape()
                    }
                }
                this.isCleared = false
            }
        }
        if(!this.isCleared){
            if (this.waveEntities.length <= 0) {
                this.game.broadcast()
                .u8(ClientBound.Notification)
                let message = `Wave ${this.wave} has been completed!`
                this.game.broadcast().u8(ClientBound.Notification).stringNT(message).u32(0x00FF00).float(10000).stringNT("").send();
                this.isCleared = true
            }
         }
    }
}