"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AI_1 = require("../AI");
const FieldGroups_1 = require("../../Native/FieldGroups");
const Live_1 = require("../Live");
const TankBody_1 = require("../Tank/TankBody");
var Target;
(function (Target) {
    Target[Target["None"] = -1] = "None";
    Target[Target["BottomRight"] = 0] = "BottomRight";
    Target[Target["TopRight"] = 1] = "TopRight";
    Target[Target["TopLeft"] = 2] = "TopLeft";
    Target[Target["BottomLeft"] = 3] = "BottomLeft";
})(Target || (Target = {}));
class BossMovementControl {
    constructor(boss) {
        this.target = Target.None;
        this.boss = boss;
    }
    moveBoss() {
        const { x, y } = this.boss.positionData.values;
        if (this.target === Target.None) {
            if (x >= 0 && y >= 0) {
                this.target = Target.BottomRight;
            }
            else if (x <= 0 && y >= 0) {
                this.target = Target.BottomLeft;
            }
            else if (x <= 0 && y <= 0) {
                this.target = Target.TopLeft;
            }
            else {
                this.target = Target.TopRight;
            }
        }
        const target = this.target === Target.BottomRight ?
            { x: 3 * this.boss.game.arena.arenaData.values.rightX / 4, y: 3 * this.boss.game.arena.arenaData.values.bottomY / 4 } : this.target === Target.BottomLeft ?
            { x: 3 * this.boss.game.arena.arenaData.values.leftX / 4, y: 3 * this.boss.game.arena.arenaData.values.bottomY / 4 } : this.target === Target.TopLeft ?
            { x: 3 * this.boss.game.arena.arenaData.values.leftX / 4, y: 3 * this.boss.game.arena.arenaData.values.topY / 4 } :
            { x: 3 * this.boss.game.arena.arenaData.values.rightX / 4, y: 3 * this.boss.game.arena.arenaData.values.topY / 4 };
        target.x = (target.x - x);
        target.y = (target.y - y);
        const dist = target.x ** 2 + target.y ** 2;
        if (dist < 90000)
            this.target = (this.target + 1) % 4;
        else {
            const angle = Math.atan2(target.y, target.x);
            this.boss.inputs.movement.x = Math.cos(angle);
            this.boss.inputs.movement.y = Math.sin(angle);
        }
    }
}
class AbstractBoss extends Live_1.default {
    constructor(game) {
        super(game);
        this.nameData = new FieldGroups_1.NameGroup(this);
        this.altName = null;
        this.sizeFactor = 1;
        this.reloadTime = 15;
        this.cameraEntity = this;
        this.hasBeenWelcomed = false;
        this.barrels = [];
        this.movementSpeed = 0.5;
        this.movementControl = new BossMovementControl(this);
        const { x, y } = this.game.arena.findSpawnLocation();
        this.positionData.values.x = x;
        this.positionData.values.y = y;
        this.relationsData.values.team = this.cameraEntity;
        this.physicsData.values.absorbtionFactor = 0.05;
        this.positionData.values.flags |= 1;
        this.scoreReward = 30000 * this.game.arena.shapeScoreRewardMultiplier;
        this.damagePerTick = 60;
        this.physicsData.values.flags |= 2;
        this.ai = new AI_1.AI(this);
        this.ai.viewRange = 2000;
        this.ai['_findTargetInterval'] = 0;
        this.inputs = this.ai.inputs;
        this.styleData.values.color = 17;
        this.physicsData.values.sides = 1;
        this.physicsData.values.size = 50 * Math.pow(1.01, 75 - 1);
        this.reloadTime = 15 * Math.pow(0.914, 7);
        this.sizeFactor = this.physicsData.values.size / 50;
        this.healthData.values.health = this.healthData.values.maxHealth = 3000;
    }
    moveAroundMap() {
        this.movementControl.moveBoss();
    }
    onDeath(killer) {
        if (this.game.arena.boss === this) {
            this.game.arena.boss = null;
        }
        const killerName = (killer instanceof TankBody_1.default && killer.nameData.values.name) || "an unnamed tank";
        this.game.broadcast()
            .u8(3)
            .stringNT(`The ${this.altName || this.nameData.values.name} has been defeated by ${killerName}!`)
            .u32(0x000000)
            .float(10000)
            .stringNT("").send();
    }
    tick(tick) {
        if (this.inputs !== this.ai.inputs)
            this.inputs = this.ai.inputs;
        this.ai.movementSpeed = this.movementSpeed;
        if (this.ai.state !== 3)
            this.moveAroundMap();
        else {
            const x = this.positionData.values.x, y = this.positionData.values.y;
            this.positionData.angle = Math.atan2(this.ai.inputs.mouse.y - y, this.ai.inputs.mouse.x - x);
        }
        this.accel.add({
            x: this.inputs.movement.x * this.movementSpeed,
            y: this.inputs.movement.y * this.movementSpeed,
        });
        this.inputs.movement.set({
            x: 0,
            y: 0
        });
        this.regenPerTick = this.healthData.values.maxHealth / 25000;
        if (!this.hasBeenWelcomed) {
            let message = "An unnamed boss has spawned!";
            if (this.nameData.values.name) {
                message = `The ${this.altName || this.nameData.values.name} has spawned!`;
            }
            this.game.broadcast().u8(3).stringNT(message).u32(0x000000).float(10000).stringNT("").send();
            this.hasBeenWelcomed = true;
        }
        super.tick(tick);
    }
}
exports.default = AbstractBoss;
