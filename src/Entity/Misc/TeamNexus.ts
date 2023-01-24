

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
import { ClientBound, Color, ColorsHexCode, HealthFlags, PhysicsFlags } from "../../Const/Enums";
import GameServer from "../../Game";
import EventArena from "../../Gamemodes/Event";
import { ArenaState } from "../../Native/Arena";
import { Entity } from "../../Native/Entity";
import { NameGroup } from "../../Native/FieldGroups";
import { constrain } from "../../util";
import LivingEntity from "../Live";
import ObjectEntity from "../Object";
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
    public team: Entity;
    public base: TeamBase;

    public shield: NexusShield;

    public sacrifices: Set<Client> = new Set();

    public bases: TeamBase[];

    private lastNotificationTick = 0;
    
    public constructor(game: GameServer, x: number, y: number, team: TeamEntity, config: NexusConfig, bases: TeamBase[]) {
        super(game);
        this.shield = new NexusShield(game, this, config.shield, config.size * 1.7);
        this.team = team;
        this.config = config;

        this.relationsData.team = team;

        this.base = new TeamBase(
            game,
            team,
            x,
            y,
            config.size * 12,
            config.size * 12,
            false
        );

        this.bases = bases;

        this.styleData.color = team.teamData.teamColor;
        this.styleData.zIndex = this.shield.styleData.zIndex + 1;
        
        this.healthData.maxHealth = config.health;
        this.healthData.health = config.health;
        this.healthData.flags |= HealthFlags.hiddenHealthbar;

        this.physicsData.absorbtionFactor = 0;
        this.physicsData.pushFactor = 5.0;
        this.physicsData.sides = 6;
        this.physicsData.size = this.config.size;
        this.physicsData.flags |= PhysicsFlags.isSolidWall;

        this.positionData.x = x;
        this.positionData.y = y;

        this.scoreReward = 100000;
    }

    public setInvicibility(isInvincible: boolean) {
        this.damageReduction = isInvincible ? 0 : 1;
        this.shield.damageReduction = isInvincible ? 0 : 1;
    }

    public notifyShieldBroke() {
        if(this.game.arena.state !== ArenaState.OPEN) return;
        const nexusPos = this.getWorldPosition();
        for(const client of this.game.clients) {
            if(!client.camera) continue;
            if(!(client.camera.cameraData.player instanceof TankBody)) continue;
            const tank = client.camera.cameraData.player;
            if(tank.relationsData.team === this.relationsData.team) {
                client.notify(`Your team's nexus has lost its shield (${Math.round(this.healthData.health)} hp remaining)!`, ColorsHexCode[Color.TeamRed], 3000, 'shield_broke');
            }
            else {
                client.notify(`The other team's nexus has lost its shield!`, ColorsHexCode[Color.TeamGreen], 3000, 'shield_broke');
                const pos = tank.getWorldPosition();
                const distance = Math.sqrt(pos.distanceToSQ(nexusPos))
                if(distance > 3000) continue;
                tank.addAcceleration(Math.atan2(pos.y - nexusPos.y, pos.x - nexusPos.x), 300 - distance / 10);
                tank.applyPhysics();
            }
        }
    }

    public notifyDamage() {
        if(this.game.arena.state !== ArenaState.OPEN) return;
        if(this.lastNotificationTick + tps * 2.5 > this.game.tick) return;
        const hp = Math.round(this.healthData.health);
        const shield = Math.round(this.shield.healthData.health);
        const notification = `Your team's nexus is being attacked (${this.shield.isBroken ? hp + " Health remaining" : hp + " Health, " + shield + " Shield remaining"})`;
        for(const client of this.game.clients) {
            if(!client.camera) continue;
            if(!(client.camera.cameraData.player instanceof TankBody)) continue;
            if(client.camera.cameraData.player.relationsData.team !== this.relationsData.team) continue;
            client.notify(notification, ColorsHexCode[Color.TeamRed], 3000, 'nexus_attack');
        }
        this.lastNotificationTick = this.game.tick;
    }

    public sacrifice(client: Client) {
        if(!client.camera || !Entity.exists(client.camera.cameraData.player) || !Entity.exists(this)) return;

        if(!(client.camera.cameraData.player instanceof LivingEntity)) return;

        if(this.sacrifices.has(client)) {
            client.notify("Sacificing stopped by player.", 0xFFA500, 2000, 'cant_claim_info');
            this.sacrifices.delete(client);
            return;
        }

        if((this.game.arena as EventArena).phase !== 2) {
            client.notify("Sacificing disable in this phase.", 0xFFA500, 2000, 'cant_claim_info');
            return;
        }

        const playerPos = client.camera.cameraData.player.positionData;
        const playerPhysics = client.camera.cameraData.player.physicsData;
        const basePos = this.base.positionData;
        const basePhysics = this.base.physicsData;
        const dX = constrain(playerPos.x, basePos.x - basePhysics.size / 2, basePos.x + basePhysics.size / 2) - playerPos.x;
        const dY = constrain(playerPos.y, basePos.y - basePhysics.width / 2, basePos.y + basePhysics.width / 2) - playerPos.y;
        const isInBase = dX ** 2 + dY ** 2 <= playerPhysics.sides ** 2;

        if(!isInBase) {
            client.notify("Unable to sacrifice to the nexus, out of reach.", 0xFFA500, 2000, 'cant_claim_info');
            return;
        }

        this.sacrifices.add(client);
        client.notify("Sacificing started, stay close to the nexus.", 0xFFA500, 2000, 'cant_claim_info');
    }

    public updateShield() {
        if(!Entity.exists(this.shield)) return;
        if(!this.shield.isBroken) return;
        if(this.shield.brokenTick + tps * 30 > this.game.tick) return;
        this.shield.revive();
    }

    public onDeath(killer: LivingEntity): void {
        if(!Entity.exists(this)) return;
        if(Entity.exists(this.shield)) this.shield.delete();
        if(Entity.exists(this.base)) this.base.delete();
        this.bases.forEach(e => e.delete());
        this.game.broadcast()
            .u8(ClientBound.Notification)
            .stringNT(`${killer.nameData?.name || "An unnamed tank"} has destroyed the ${(this.relationsData.team as TeamEntity).teamName} Nexus!`)
            .u32(killer.teamData ? ColorsHexCode[killer.teamData.teamColor] : 0x000000)
            .float(30000)
            .stringNT("").send();
    }

    public applyPhysics() {
        ObjectEntity.prototype.applyPhysics.call(this);

        if (this.healthData.values.health <= 0) {
            this.destroy(true);
            this.damagedEntities = [];
            return;
        }

        if (this.healthData.values.health > this.healthData.values.maxHealth) {
            this.healthData.health = this.healthData.values.maxHealth;
        }

        this.damagedEntities = [];
    }

    public tick(tick: number) {
        if((this.game.arena as EventArena).phase === 1) {
            this.nameData.name = "Nexus (Invincible)";
        } else {
            if(this.shield.isBroken) this.nameData.name = `Nexus (${Math.round(this.healthData.health)} Health, Shield recovers in ${(30 - (this.game.tick - this.shield.brokenTick) / tps).toFixed(2)} seconds)`;
            else this.nameData.name = `Nexus (${Math.round(this.healthData.health)} Health, ${Math.round(this.shield.healthData.health)} Shield)`;
        }


        this.positionData.angle = -(tick * 0.01);
        this.updateShield();
        
        this.lastDamageAnimationTick = tick;
        super.tick(tick);

        if((this.game.arena as EventArena).phase !== 2) return;

        for(const sacrifice of this.sacrifices) {
            if(!sacrifice.camera 
                || !Entity.exists(sacrifice.camera.cameraData.player)
                || !Entity.exists(this)
                || !(sacrifice.camera.cameraData.player instanceof LivingEntity)
            ) {
                sacrifice.notify("Sacificing stopped.", 0xFFA500, 2000, 'cant_claim_info');
                this.sacrifices.delete(sacrifice);
                continue;
            }

            const playerPos = sacrifice.camera.cameraData.player.positionData;
            const playerPhysics = sacrifice.camera.cameraData.player.physicsData;
            const basePos = this.base.positionData;
            const basePhysics = this.base.physicsData;
            const dX = constrain(playerPos.x, basePos.x - basePhysics.size / 2, basePos.x + basePhysics.size / 2) - playerPos.x;
            const dY = constrain(playerPos.y, basePos.y - basePhysics.width / 2, basePos.y + basePhysics.width / 2) - playerPos.y;
            const isInBase = dX ** 2 + dY ** 2 <= playerPhysics.sides ** 2;

            if(!isInBase) {
                sacrifice.notify("Sacificing stopped, out of reach.", 0xFFA500, 2000, 'cant_claim_info');
                this.sacrifices.delete(sacrifice);
                continue;
            }

            const entity = sacrifice.camera.cameraData.player;
            const target = [this, this.shield].filter(e => e.healthData.health < e.healthData.maxHealth)[0];
            if(!target || (target === this.shield && this.shield.isBroken)) continue;
            entity.lastDamageTick = tick;
            target.healthData.health += entity.healthData.maxHealth * entity.damagePerTick / (entity instanceof TankBody ? 20 : 8) * 0.005;
            entity.healthData.health -= entity.healthData.maxHealth * 0.005 + entity.regenPerTick;
        }

        if(this.lastDamageTick === tick) this.notifyDamage();
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
        this.physicsData.sides = 6;
        this.physicsData.size = size;
    }

    public revive() {
        this.isBroken = false;
        this.healthData.health = this.healthData.maxHealth * 0.333;
        this.physicsData.sides = 6;
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
        this.lastDamageAnimationTick = tick;
        super.tick(tick);
        if(this.lastDamageTick === tick) this.nexus.notifyDamage();
    }
}