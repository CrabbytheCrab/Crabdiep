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

import { ClientInputs } from "../../Client";
import { tps } from "../../config";
import { Color, Tank, Stat, ColorsHexCode, ClientBound, TeamFlags } from "../../Const/Enums";
import GameServer from "../../Game";
import ArenaEntity from "../../Native/Arena";
import { CameraEntity } from "../../Native/Camera";
import Vector from "../../Physics/Vector";
import { AI, AIState, Inputs } from "../AI";
import Live from "../Live";
import ObjectEntity from "../Object";
import TankBody from "../Tank/TankBody";
import { TeamEntity } from "./TeamEntity";

const POSSESSION_TIMER = tps * 60 * 10;

/**
 * Mothership Entity
 */
export default class AiTank extends TankBody {
    /** The AI that controls how the Mothership aims. */
    public ai: AI;
public super:boolean
public yes:boolean
public camera: CameraEntity
public owner: ObjectEntity
public static RETURN_RANGE = 500 ** 2;

    /** If the mothership's AI ever gets possessed, this is the tick that the possession started. */
    public possessionStartTick: number = -1;

    public constructor(game: GameServer,owner: ObjectEntity) {
        const inputs = new Inputs();
        const camera = new CameraEntity(game);

        super(game, camera, inputs);
this.camera = camera
        this.owner = owner
        this.relationsData.values.team = game.arena;
        this.yes = true

        this.styleData.values.color = Color.Neutral;
this.super = false
        this.ai = new AI(this, true);
        this.ai.inputs = inputs;
        this.ai.viewRange = 2000;
        this.positionData.values.x = 0;
        this.positionData.values.y = 0;
        
        this.nameData.values.name = "4I T4nK"
        
        
        camera.cameraData.values.player = this;

    }


    public delete(): void {
        // No more mothership arrow - seems like in old diep this wasn't the case - we should probably keep though
        if (this.relationsData.values.team?.teamData) this.relationsData.values.team.teamData.flags  &= ~TeamFlags.hasMothership;
        this.ai.inputs.deleted = true;
        super.delete();
    }


    public tick(tick: number) {
        if (!this.barrels.length) return super.tick(tick)
        this.inputs = this.ai.inputs;

        if (this.ai.state === AIState.idle) {
            const angle = this.positionData.values.angle + this.ai.passiveRotation;
            const mag = Math.sqrt((this.inputs.mouse.x - this.positionData.values.x) ** 2 + (this.inputs.mouse.y - this.positionData.values.y) ** 2);
            const dist = new Vector(this.owner.positionData.x,this.owner.positionData.y).distanceToSQ(this.positionData.values);
            
            if(dist < AiTank.RETURN_RANGE ){
                this.inputs.mouse.set({
                    x: this.positionData.values.x + Math.cos(angle) * mag,
                    y: this.positionData.values.y + Math.sin(angle) * mag
                });
            }else{
                this.inputs.movement.set({
                    x: this.owner.positionData.x - this.positionData.x,
                    y: this.owner.positionData.y - this.positionData.y
                });
                this.inputs.movement.magnitude = 1;
                const angle2 = Math.atan2(this.owner.positionData.y - this.positionData.y, this.owner.positionData.x -this.positionData.x)
                this.inputs.mouse.set({
                    x: this.positionData.values.x + Math.cos(angle2) * mag,
                    y: this.positionData.values.y + Math.sin(angle2) * mag
                });
            }
        } else if (this.ai.state === AIState.possessed && this.possessionStartTick === -1) {
            this.possessionStartTick = tick;
        }
        if (this.possessionStartTick !== -1 && this.ai.state !== AIState.possessed) {
            this.possessionStartTick = -1;
        }
if(this.yes){
        if(!this.super){
            this.camera.setLevel(15);
            this.setTank(Tank.Basic);
            for (let i = Stat.MovementSpeed; i < Stat.MovementSpeed; ++i)  this.camera.cameraData.values.statLevels.values[i] = 2;
            this.camera.cameraData.values.statLevels.values[Stat.MovementSpeed] = 2;
            this.camera.cameraData.values.statLevels.values[Stat.Reload] = 2;
            this.camera.cameraData.values.statLevels.values[Stat.BulletDamage] = 2;
            this.camera.cameraData.values.statLevels.values[Stat.BulletPenetration] = 2;
    
            const def = (this.definition = Object.assign({}, this.definition));
            def.maxHealth = 50;
            }else{
                this.camera.setLevel(30);
                for (let i = Stat.MovementSpeed; i > Stat.MovementSpeed; ++i)  this.camera.cameraData.values.statLevels.values[i] = 3;
                this.camera.cameraData.values.statLevels.values[Stat.MovementSpeed] = 2;
        
            const def = (this.definition = Object.assign({}, this.definition));
            def.maxHealth = 75;
            const tonk = Math.random()
                if(tonk < 0.1){
                    this.setTank(Tank.Spewer);
                    this.camera.cameraData.values.statLevels.values[Stat.Reload] = 5;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletDamage] = 5;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletPenetration] = 6;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletSpeed] = 1;
                    this.camera.cameraData.values.statLevels.values[Stat.MovementSpeed] = 3;
                }else if(tonk < 0.2){
                    this.setTank(Tank.Destroyer);
                    this.camera.cameraData.values.statLevels.values[Stat.Reload] = 2;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletDamage] = 5;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletPenetration] = 5;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletSpeed] = 6;
                }else if (tonk < 0.3){
                    this.setTank(Tank.Spawner);
                    this.camera.cameraData.values.statLevels.values[Stat.Reload] = 4;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletDamage] = 4;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletPenetration] = 4;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletSpeed] = 6;
                }else if (tonk < 0.4){
                    this.setTank(Tank.Smasher);
                    this.camera.cameraData.values.statLevels.values[Stat.MovementSpeed] = 3;
                    this.camera.cameraData.values.statLevels.values[Stat.HealthRegen] = 5;
                    this.camera.cameraData.values.statLevels.values[Stat.MaxHealth] = 6;
                    this.camera.cameraData.values.statLevels.values[Stat.BodyDamage] = 6;
                    this.ai.viewRange = 2400;
                }else if (tonk < 0.5){
                    this.setTank(Tank.TriAngle);
                    this.camera.cameraData.values.statLevels.values[Stat.MaxHealth] = 3;
                    this.camera.cameraData.values.statLevels.values[Stat.BodyDamage] = 3;
                    this.camera.cameraData.values.statLevels.values[Stat.Reload] = 4;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletDamage] = 4;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletPenetration] = 4;
                }else if (tonk < 0.6){
                    this.setTank(Tank.auto3);
                    this.camera.cameraData.values.statLevels.values[Stat.Reload] = 6;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletDamage] = 4;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletPenetration] = 4;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletSpeed] = 4;
                }else if (tonk < 0.7){
                    this.setTank(Tank.Boomerang);
                    this.camera.cameraData.values.statLevels.values[Stat.Reload] = 4;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletDamage] = 4;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletPenetration] = 5;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletSpeed] = 5;
                }else if (tonk < 0.8){
                    this.setTank(Tank.Hunter);
                    this.camera.cameraData.values.statLevels.values[Stat.Reload] = 2;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletDamage] = 6;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletPenetration] = 5;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletSpeed] = 4;
                    this.ai.viewRange = 2400;
                }else if (tonk < 0.9){
                    this.setTank(Tank.TripleShot);
                    this.camera.cameraData.values.statLevels.values[Stat.Reload] = 5;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletDamage] = 4;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletPenetration] = 4;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletSpeed] = 5;
                }else{
                    this.setTank(Tank.QuadTank);
                    this.camera.cameraData.values.statLevels.values[Stat.Reload] = 6;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletDamage] = 6;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletPenetration] = 6;
                    this.camera.cameraData.values.statLevels.values[Stat.BulletSpeed] = 0;
                }
            }
            this.yes = false
        }
        super.tick(tick);
    }
}
