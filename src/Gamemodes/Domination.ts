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
import { Color, ArenaFlags, TeamFlags, ValidScoreboardIndex, ClientBound, ColorsHexCode } from "../Const/Enums";
import LivingEntity from "../Entity/Live";
import Dominator from "../Entity/Misc/Dominator";
import TeamBase from "../Entity/Misc/TeamBase";
import { TeamEntity } from "../Entity/Misc/TeamEntity";
import TankBody from "../Entity/Tank/TankBody";
import GameServer from "../Game";
import ArenaEntity, { ArenaState } from "../Native/Arena";


const arenaSize = 11150;
const baseSize = 3345;
const domBaseSize = baseSize / 2;
/**
 * Domination Gamemode Arena
 */
export default class DominationArena extends ArenaEntity {
    /** Blue TeamBASEentity */
    public blueTeamBase: TeamBase;
    /** Red TeamBASE entity */
    public redTeamBase: TeamBase;
    public dominators: Dominator[] = [];

    /** Maps clients to their teams */
    public playerTeamMap: Map<Client, TeamBase> = new Map();

    public constructor(game: GameServer) {
        super(game);
        this.shapeScoreRewardMultiplier = 2.0;

        this.updateBounds(arenaSize * 2, arenaSize * 2)

        this.arenaData.values.flags |= ArenaFlags.hiddenScores;

        this.blueTeamBase = new TeamBase(game, new TeamEntity(this.game, Color.TeamBlue), -arenaSize + baseSize / 2,  Math.random() > .5 ? (arenaSize - baseSize / 2) : -arenaSize + baseSize / 2, baseSize, baseSize);
        this.redTeamBase = new TeamBase(game, new TeamEntity(this.game, Color.TeamRed), arenaSize - baseSize / 2, Math.random() > .5 ? (arenaSize - baseSize / 2) : -arenaSize + baseSize / 2, baseSize, baseSize);
        
        const dom1 = new Dominator(this, new TeamBase(game, this, arenaSize / 2.5, arenaSize / 2.5, domBaseSize, domBaseSize, false));
        dom1.nameData.name = "SE Dominator"

        const dom2 = new Dominator(this, new TeamBase(game, this, arenaSize / -2.5, arenaSize / 2.5, domBaseSize, domBaseSize, false));
        dom2.nameData.name = "SW Dominator"
       
        const dom3 = new Dominator(this, new TeamBase(game, this, arenaSize / -2.5, arenaSize / -2.5, domBaseSize, domBaseSize, false));
        dom3.nameData.name = "NW Dominator"
       
        const dom4 = new Dominator(this, new TeamBase(game, this, arenaSize / 2.5, arenaSize / -2.5, domBaseSize, domBaseSize, false));
        dom4.nameData.name = "NE Dominator"
       
        this.dominators.push(dom1,dom2, dom3, dom4);
    }
    public updateScoreboard(scoreboardPlayers: TankBody[]) {
        this.dominators.sort((m1, m2) => m2.healthData.values.health - m1.healthData.values.health);
        const length = Math.min(10, this.dominators.length);
        for (let i = 0; i < length; ++i) {
            const dominator = this.dominators[i];
            const team = dominator.relationsData.values.team;
            if (dominator.styleData.values.color === Color.Tank) this.arenaData.values.scoreboardColors[i as ValidScoreboardIndex] = Color.ScoreboardBar;
            else this.arenaData.values.scoreboardColors[i as ValidScoreboardIndex] = dominator.styleData.values.color;
            this.arenaData.values.scoreboardNames[i as ValidScoreboardIndex] = dominator.nameData.name;
            // TODO: Change id
            this.arenaData.values.scoreboardTanks[i as ValidScoreboardIndex] = -1;
            this.arenaData.values.scoreboardScores[i as ValidScoreboardIndex] = dominator.healthData.values.health;
            this.arenaData.values.scoreboardSuffixes[i as ValidScoreboardIndex] = " HP";
        }
       
        this.arenaData.scoreboardAmount = length;
    }
    public spawnPlayer(tank: TankBody, client: Client) {
        tank.positionData.values.y = arenaSize * Math.random() - arenaSize;

        const xOffset = (Math.random() - 0.5) * baseSize,
              yOffset = (Math.random() - 0.5) * baseSize;

        const base = this.playerTeamMap.get(client) || [this.blueTeamBase, this.redTeamBase][0|Math.random()*2];
        tank.relationsData.values.team = base.relationsData.values.team;
        tank.styleData.values.color = base.styleData.values.color;
        tank.positionData.values.x = base.positionData.values.x + xOffset;
        tank.positionData.values.y = base.positionData.values.y + yOffset;
        this.playerTeamMap.set(client, base);

        if (client.camera) client.camera.relationsData.team = tank.relationsData.values.team;
    }

    public tick(tick: number) {
        const length = Math.min(10, this.dominators.length);
        for (let i = 0; i < length; ++i) {
            const dominator = this.dominators[i];
            //why did I do this
            /* if (this.dominators[0].styleData.color == Color.TeamRed && this.dominators[1].styleData.color == Color.TeamRed  && this.dominators[2].styleData.color == Color.TeamRed  && this.dominators[3].styleData.color == Color.TeamRed 
                || this.dominators[0].styleData.color == Color.TeamBlue && this.dominators[1].styleData.color == Color.TeamBlue && this.dominators[2].styleData.color == Color.TeamBlue && this.dominators[3].styleData.color == Color.TeamBlue){
                if (this.state === ArenaState.OPEN) {
                    if (this.dominators[1].teamData != null){
                    let message = `The ${this.dominators[1].teamData.teamColor} HAS WON THE GAME`
                    this.game.broadcast().u8(ClientBound.Notification).stringNT(message).u32(ColorsHexCode[this.dominators[1].teamData.values.teamColor]).float(10000).stringNT("").send();
                    }
            this.state = ArenaState.OVER;
                    setTimeout(() => {
                        this.close();
                    }, 5000);
                }*/
            //this is still stupid but it looks cleaner plus adds multiple team support
            if (this.dominators[0].relationsData.values.team == this.dominators[1].relationsData.values.team &&
                this.dominators[1].relationsData.values.team == this.dominators[2].relationsData.values.team &&
                this.dominators[2].relationsData.values.team == this.dominators[3].relationsData.values.team &&
                this.dominators[3].relationsData.values.team == this.dominators[0].relationsData.values.team &&
                this.dominators[0].relationsData.values.team !== this.game.arena &&
                this.dominators[1].relationsData.values.team !== this.game.arena &&
                this.dominators[2].relationsData.values.team !== this.game.arena && 
                this.dominators[3].relationsData.values.team !== this.game.arena)
            {
                if (this.state === ArenaState.OPEN) {
                    const team = this.dominators[1].relationsData.values.team;
                    const isateam = team instanceof TeamEntity;
                    if(this.dominators[1].relationsData.values.team !== null){
                        if(this.dominators[1].relationsData.values.team.teamData !== null){
                            let message = `${isateam ? team.teamName : (this.dominators[1].nameData?.values.name || "an unnamed tank")} HAS WON THE GAME`
                            this.game.broadcast().u8(ClientBound.Notification).stringNT(message).u32(ColorsHexCode[this.dominators[1].styleData.color]).float(10000).stringNT("").send();
                        }
                    }
                    this.state = ArenaState.OVER;
                    setTimeout(() => {
                        this.close();
                    }, 5000);
                }
            }
        }
        super.tick(tick);
    }
}
