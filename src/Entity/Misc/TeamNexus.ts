

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

import Client from "../../Client";
import { tps } from "../../config";
import { ClientBound, Color, ColorsHexCode, HealthFlags, PhysicsFlags, StyleFlags } from "../../Const/Enums";
import GameServer from "../../Game";
import { ArenaState } from "../../Native/Arena";
import ClientCamera from "../../Native/Camera";
import { Entity } from "../../Native/Entity";
import { NameGroup } from "../../Native/FieldGroups";
import LivingEntity from "../Live";
import TankBody from "../Tank/TankBody";
import TeamBase from "./TeamBase";
import { TeamEntity } from "./TeamEntity";

export interface NexusConfig {
    health: number,
    size: number,
    shield: number
}

export default class Nexus extends LivingEntity {
    public nameData: NameGroup = new NameGroup(this);

    public config: NexusConfig;
    public base: TeamBase;

    public shield: NexusShield;

    public sacrificeTick: number = 0;
    
    public constructor(game: GameServer, base: TeamBase, config: NexusConfig) {
        super(game);
        this.shield = new NexusShield(game, this, config.shield, config.size * 1.5);
        this.base = base;
        this.config = config;

        this.relationsData.team = base.relationsData.team;

        this.styleData.color = Color.Shiny;
        this.styleData.zIndex = this.shield.styleData.zIndex + 1;
        
        this.healthData.maxHealth = config.health;
        this.healthData.health = config.health;
        this.healthData.flags |= HealthFlags.hiddenHealthbar;
        this.regenPerTick = 0;

        this.physicsData.absorbtionFactor = 0;
        this.physicsData.pushFactor = 5.0;
        this.physicsData.sides = 7;
        this.physicsData.size = this.config.size;
        this.physicsData.flags |= PhysicsFlags.isSolidWall;

        this.positionData.x = base.positionData.x;
        this.positionData.y = base.positionData.y;

        this.scoreReward = 100000;
    }

    public notifyShieldBroke() {
        if(this.game.arena.state !== ArenaState.OPEN) return;
        const nexusPos = this.getWorldPosition();
        for(const client of this.game.clients) {
            if(!client.camera) continue;
            if(!(client.camera.cameraData.player instanceof TankBody)) continue;
            const tank = client.camera.cameraData.player;
            if(tank.relationsData.team === this.relationsData.team) {
                client.notify(`Your team's nexus has lost it's shield (${Math.round(this.healthData.health)} hp remaining)`);
            }
            else {
                client.notify(`The other team's nexus has lost it's shield!`);
                const pos = tank.getWorldPosition();
                if(Math.sqrt(pos.distanceToSQ(nexusPos)) > 7000) continue;
                tank.addAcceleration(Math.atan2(pos.y - nexusPos.y, pos.x - nexusPos.x), 300);
                tank.applyPhysics();
            }
        }
        this.base.setPainful(true, 50);
        setTimeout(() => this.base.setPainful(false), 3000);
    }

    public sacrificeEntity(client: Client): boolean {
        const entity = (client.camera as ClientCamera).cameraData.player as TankBody;
        if(this.shield.healthData.health >= this.shield.healthData.maxHealth) {
            if(this.healthData.health >= this.healthData.maxHealth) return false;
            this.healthData.health += entity.healthData.health * 0.1;
            client.notify(`You have sacrificed ${Math.round(entity.healthData.health * 0.1)} health.`, 0x00FF00, 2000);
            entity.destroy();
            (client.camera as ClientCamera).spectatee = this;
            this.sacrificeTick = this.game.tick;
            return true;
        }
        this.shield.healthData.health += entity.healthData.health * 2;
        client.notify(`You have sacrificed ${Math.round(entity.healthData.health * 2)} health.`, 0x00FF00, 2000);
        entity.destroy();
        (client.camera as ClientCamera).spectatee = this;
        this.sacrificeTick = this.game.tick;
        return true;
    }

    public updateShield() {
        if(!Entity.exists(this.shield)) return;
        if(!this.shield.isBroken) return;
        if(this.shield.brokenTick + tps * 30 > this.game.tick) return;
        this.shield.revive();
    }

    public onDeath(killer: LivingEntity): void {
        if(Entity.exists(this.shield)) this.shield.delete();
        if(this.game.arena.state !== ArenaState.OPEN) return;
        this.game.broadcast()
            .u8(ClientBound.Notification)
            .stringNT(`${killer.nameData?.name || "An unnamed tank"} has destroyed ${(this.relationsData.team as TeamEntity).teamName}'s Nexus!`)
            .u32(killer.teamData ? ColorsHexCode[killer.teamData.teamColor] : 0x000000)
            .float(-1)
            .stringNT("").send();
        setTimeout(() => this.game.arena.close(), 10000);
    }

    public tick(tick: number) {
        if(this.shield.isBroken) this.nameData.name = `Nexus (${Math.round(this.healthData.health)} Health, Shield recovers in ${(30 - (this.game.tick - this.shield.brokenTick) / tps).toFixed(2)} seconds)`;
        else this.nameData.name = `Nexus (${Math.round(this.healthData.health)} Health, ${Math.round(this.shield.healthData.health)} Shield)`;
        const healthRatio = this.healthData.health / this.healthData.maxHealth;
        if(healthRatio > 0.666) {
            this.styleData.color = Color.Shiny;
        } else if(healthRatio > 0.333) {
            this.styleData.color = Color.Neutral;
        } else {
            this.styleData.color = Color.TeamRed;
        }
        this.positionData.angle = -(tick * 0.01);
        this.updateShield();
        this.lastDamageTick = tick;
        super.tick(tick);
    }
}

export class NexusShield extends LivingEntity {
    public nexus: Nexus;

    public isBroken: boolean = false;
    public brokenTick: number = 0;

    public constructor(game: GameServer, nexus: Nexus, health: number, size: number) {
        super(game);
        this.nexus = nexus;
        this.healthData.maxHealth = health;
        this.healthData.health = health;
        this.healthData.flags |= HealthFlags.hiddenHealthbar;
        this.regenPerTick = health * 0.0001;

        this.styleData.color = Color.Border;
        this.styleData.opacity = 1.0;

        this.physicsData.absorbtionFactor = 0.0;
        this.physicsData.pushFactor = 1.0;
        this.physicsData.flags |= PhysicsFlags.isSolidWall;
        this.physicsData.sides = 7;
        this.physicsData.size = size;

        this.scoreReward = 10000;
    }

    public revive() {
        this.isBroken = false;
        this.healthData.health = this.healthData.maxHealth * 0.333;
        this.physicsData.sides = 7;
        this.lastDamageTick = this.game.tick;

    }

    public onDeath(killer: LivingEntity): void {
        if(this.isBroken) return;
        this.healthData.health = this.healthData.maxHealth * 0.333;
        this.physicsData.sides = 0;
        this.isBroken = true;
        this.brokenTick = this.game.tick;
        this.nexus.notifyShieldBroke();
    }

    public tick(tick: number) {
        this.relationsData.team = this.nexus.relationsData.team;
        this.relationsData.owner = this.nexus;
        this.positionData.x = this.nexus.positionData.x;
        this.positionData.y = this.nexus.positionData.y;
        this.positionData.angle = tick * 0.01;
        this.styleData.opacity = this.healthData.health / this.healthData.maxHealth;
        super.tick(tick);
    }
}