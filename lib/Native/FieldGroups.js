"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamGroup = exports.ScoreGroup = exports.StyleGroup = exports.PositionGroup = exports.CameraGroup = exports.NameGroup = exports.ArenaGroup = exports.HealthGroup = exports.PhysicsGroup = exports.BarrelGroup = exports.RelationsGroup = exports.CameraTable = exports.ScoreboardTable = void 0;
class ScoreboardTable {
    constructor(defaultValue, fieldId, owner) {
        this.state = new Uint8Array(10);
        this.values = Array(10).fill(defaultValue);
        this.fieldId = fieldId;
        this.owner = owner;
    }
    wipe() {
        this.state.fill(0);
    }
    get [0]() {
        return this.values[0];
    }
    set [0](value) {
        if (value === this.values[0])
            return;
        this.state[0] |= 1;
        this.values[0] = value;
        this.owner.state[this.fieldId] |= 1;
        this.owner.entity.entityState |= 1;
    }
    get [1]() {
        return this.values[1];
    }
    set [1](value) {
        if (value === this.values[1])
            return;
        this.state[1] |= 1;
        this.values[1] = value;
        this.owner.state[this.fieldId] |= 1;
        this.owner.entity.entityState |= 1;
    }
    get [2]() {
        return this.values[2];
    }
    set [2](value) {
        if (value === this.values[2])
            return;
        this.state[2] |= 1;
        this.values[2] = value;
        this.owner.state[this.fieldId] |= 1;
        this.owner.entity.entityState |= 1;
    }
    get [3]() {
        return this.values[3];
    }
    set [3](value) {
        if (value === this.values[3])
            return;
        this.state[3] |= 1;
        this.values[3] = value;
        this.owner.state[this.fieldId] |= 1;
        this.owner.entity.entityState |= 1;
    }
    get [4]() {
        return this.values[4];
    }
    set [4](value) {
        if (value === this.values[4])
            return;
        this.state[4] |= 1;
        this.values[4] = value;
        this.owner.state[this.fieldId] |= 1;
        this.owner.entity.entityState |= 1;
    }
    get [5]() {
        return this.values[5];
    }
    set [5](value) {
        if (value === this.values[5])
            return;
        this.state[5] |= 1;
        this.values[5] = value;
        this.owner.state[this.fieldId] |= 1;
        this.owner.entity.entityState |= 1;
    }
    get [6]() {
        return this.values[6];
    }
    set [6](value) {
        if (value === this.values[6])
            return;
        this.state[6] |= 1;
        this.values[6] = value;
        this.owner.state[this.fieldId] |= 1;
        this.owner.entity.entityState |= 1;
    }
    get [7]() {
        return this.values[7];
    }
    set [7](value) {
        if (value === this.values[7])
            return;
        this.state[7] |= 1;
        this.values[7] = value;
        this.owner.state[this.fieldId] |= 1;
        this.owner.entity.entityState |= 1;
    }
    get [8]() {
        return this.values[8];
    }
    set [8](value) {
        if (value === this.values[8])
            return;
        this.state[8] |= 1;
        this.values[8] = value;
        this.owner.state[this.fieldId] |= 1;
        this.owner.entity.entityState |= 1;
    }
    get [9]() {
        return this.values[9];
    }
    set [9](value) {
        if (value === this.values[9])
            return;
        this.state[9] |= 1;
        this.values[9] = value;
        this.owner.state[this.fieldId] |= 1;
        this.owner.entity.entityState |= 1;
    }
}
exports.ScoreboardTable = ScoreboardTable;
class CameraTable {
    constructor(defaultValue, fieldId, owner) {
        this.state = new Uint8Array(8);
        this.values = Array(8).fill(defaultValue);
        this.fieldId = fieldId;
        this.owner = owner;
    }
    wipe() {
        this.state.fill(0);
    }
    get [0]() {
        return this.values[0];
    }
    set [0](value) {
        if (value === this.values[0])
            return;
        this.state[0] |= 1;
        this.values[0] = value;
        this.owner.state[this.fieldId] |= 1;
        this.owner.entity.entityState |= 1;
    }
    get [1]() {
        return this.values[1];
    }
    set [1](value) {
        if (value === this.values[1])
            return;
        this.state[1] |= 1;
        this.values[1] = value;
        this.owner.state[this.fieldId] |= 1;
        this.owner.entity.entityState |= 1;
    }
    get [2]() {
        return this.values[2];
    }
    set [2](value) {
        if (value === this.values[2])
            return;
        this.state[2] |= 1;
        this.values[2] = value;
        this.owner.state[this.fieldId] |= 1;
        this.owner.entity.entityState |= 1;
    }
    get [3]() {
        return this.values[3];
    }
    set [3](value) {
        if (value === this.values[3])
            return;
        this.state[3] |= 1;
        this.values[3] = value;
        this.owner.state[this.fieldId] |= 1;
        this.owner.entity.entityState |= 1;
    }
    get [4]() {
        return this.values[4];
    }
    set [4](value) {
        if (value === this.values[4])
            return;
        this.state[4] |= 1;
        this.values[4] = value;
        this.owner.state[this.fieldId] |= 1;
        this.owner.entity.entityState |= 1;
    }
    get [5]() {
        return this.values[5];
    }
    set [5](value) {
        if (value === this.values[5])
            return;
        this.state[5] |= 1;
        this.values[5] = value;
        this.owner.state[this.fieldId] |= 1;
        this.owner.entity.entityState |= 1;
    }
    get [6]() {
        return this.values[6];
    }
    set [6](value) {
        if (value === this.values[6])
            return;
        this.state[6] |= 1;
        this.values[6] = value;
        this.owner.state[this.fieldId] |= 1;
        this.owner.entity.entityState |= 1;
    }
    get [7]() {
        return this.values[7];
    }
    set [7](value) {
        if (value === this.values[7])
            return;
        this.state[7] |= 1;
        this.values[7] = value;
        this.owner.state[this.fieldId] |= 1;
        this.owner.entity.entityState |= 1;
    }
}
exports.CameraTable = CameraTable;
class RelationsGroup {
    constructor(entity) {
        this.state = new Uint8Array(3);
        this.values = {
            parent: null,
            owner: null,
            team: null
        };
        this.entity = entity;
    }
    wipe() { this.state.fill(0); }
    get parent() { return this.values.parent; }
    get owner() { return this.values.owner; }
    get team() { return this.values.team; }
    set parent(parent) { if (parent === this.values.parent) {
        return;
    } ; this.state[0] |= 1; this.entity.entityState |= 1; this.values.parent = parent; }
    set owner(owner) { if (owner === this.values.owner) {
        return;
    } ; this.state[1] |= 1; this.entity.entityState |= 1; this.values.owner = owner; }
    set team(team) { if (team === this.values.team) {
        return;
    } ; this.state[2] |= 1; this.entity.entityState |= 1; this.values.team = team; }
}
exports.RelationsGroup = RelationsGroup;
class BarrelGroup {
    constructor(entity) {
        this.state = new Uint8Array(3);
        this.values = {
            flags: 0,
            reloadTime: 15,
            trapezoidDirection: 0
        };
        this.entity = entity;
    }
    wipe() { this.state.fill(0); }
    get flags() { return this.values.flags; }
    get reloadTime() { return this.values.reloadTime; }
    get trapezoidDirection() { return this.values.trapezoidDirection; }
    set flags(flags) { if (flags === this.values.flags) {
        return;
    } ; this.state[0] |= 1; this.entity.entityState |= 1; this.values.flags = flags; }
    set reloadTime(reloadTime) { if (reloadTime === this.values.reloadTime) {
        return;
    } ; this.state[1] |= 1; this.entity.entityState |= 1; this.values.reloadTime = reloadTime; }
    set trapezoidDirection(trapezoidDirection) { if (trapezoidDirection === this.values.trapezoidDirection) {
        return;
    } ; this.state[2] |= 1; this.entity.entityState |= 1; this.values.trapezoidDirection = trapezoidDirection; }
}
exports.BarrelGroup = BarrelGroup;
class PhysicsGroup {
    constructor(entity) {
        this.state = new Uint8Array(6);
        this.values = {
            flags: 0,
            sides: 0,
            size: 0,
            width: 0,
            absorbtionFactor: 1,
            pushFactor: 8
        };
        this.entity = entity;
    }
    wipe() { this.state.fill(0); }
    get flags() { return this.values.flags; }
    get sides() { return this.values.sides; }
    get size() { return this.values.size; }
    get width() { return this.values.width; }
    get absorbtionFactor() { return this.values.absorbtionFactor; }
    get pushFactor() { return this.values.pushFactor; }
    set flags(flags) { if (flags === this.values.flags) {
        return;
    } ; this.state[0] |= 1; this.entity.entityState |= 1; this.values.flags = flags; }
    set sides(sides) { if (sides === this.values.sides) {
        return;
    } ; this.state[1] |= 1; this.entity.entityState |= 1; this.values.sides = sides; }
    set size(size) { if (size === this.values.size) {
        return;
    } ; this.state[2] |= 1; this.entity.entityState |= 1; this.values.size = size; }
    set width(width) { if (width === this.values.width) {
        return;
    } ; this.state[3] |= 1; this.entity.entityState |= 1; this.values.width = width; }
    set absorbtionFactor(absorbtionFactor) { if (absorbtionFactor === this.values.absorbtionFactor) {
        return;
    } ; this.state[4] |= 1; this.entity.entityState |= 1; this.values.absorbtionFactor = absorbtionFactor; }
    set pushFactor(pushFactor) { if (pushFactor === this.values.pushFactor) {
        return;
    } ; this.state[5] |= 1; this.entity.entityState |= 1; this.values.pushFactor = pushFactor; }
}
exports.PhysicsGroup = PhysicsGroup;
class HealthGroup {
    constructor(entity) {
        this.state = new Uint8Array(3);
        this.values = {
            flags: 0,
            health: 1,
            maxHealth: 1
        };
        this.entity = entity;
    }
    wipe() { this.state.fill(0); }
    get flags() { return this.values.flags; }
    get health() { return this.values.health; }
    get maxHealth() { return this.values.maxHealth; }
    set flags(flags) { if (flags === this.values.flags) {
        return;
    } ; this.state[0] |= 1; this.entity.entityState |= 1; this.values.flags = flags; }
    set health(health) { if (health === this.values.health) {
        return;
    } ; this.state[1] |= 1; this.entity.entityState |= 1; this.values.health = health; }
    set maxHealth(maxHealth) { if (maxHealth === this.values.maxHealth) {
        return;
    } ; this.state[2] |= 1; this.entity.entityState |= 1; this.values.maxHealth = maxHealth; }
}
exports.HealthGroup = HealthGroup;
class ArenaGroup {
    constructor(entity) {
        this.state = new Uint8Array(15);
        this.values = {
            flags: 2,
            leftX: 0,
            topY: 0,
            rightX: 0,
            bottomY: 0,
            scoreboardAmount: 0,
            scoreboardNames: new ScoreboardTable("", 6, this),
            scoreboardScores: new ScoreboardTable(0, 7, this),
            scoreboardColors: new ScoreboardTable(13, 8, this),
            scoreboardSuffixes: new ScoreboardTable("", 9, this),
            scoreboardTanks: new ScoreboardTable(0, 10, this),
            leaderX: 0,
            leaderY: 0,
            playersNeeded: 1,
            ticksUntilStart: 250
        };
        this.entity = entity;
    }
    wipe() { this.state.fill(0); this.values.scoreboardNames.wipe(); this.values.scoreboardScores.wipe(); this.values.scoreboardColors.wipe(); this.values.scoreboardSuffixes.wipe(); this.values.scoreboardTanks.wipe(); }
    get flags() { return this.values.flags; }
    get leftX() { return this.values.leftX; }
    get topY() { return this.values.topY; }
    get rightX() { return this.values.rightX; }
    get bottomY() { return this.values.bottomY; }
    get scoreboardAmount() { return this.values.scoreboardAmount; }
    get scoreboardNames() { return this.values.scoreboardNames; }
    get scoreboardScores() { return this.values.scoreboardScores; }
    get scoreboardColors() { return this.values.scoreboardColors; }
    get scoreboardSuffixes() { return this.values.scoreboardSuffixes; }
    get scoreboardTanks() { return this.values.scoreboardTanks; }
    get leaderX() { return this.values.leaderX; }
    get leaderY() { return this.values.leaderY; }
    get playersNeeded() { return this.values.playersNeeded; }
    get ticksUntilStart() { return this.values.ticksUntilStart; }
    set flags(flags) { if (flags === this.values.flags) {
        return;
    } ; this.state[0] |= 1; this.entity.entityState |= 1; this.values.flags = flags; }
    set leftX(leftX) { if (leftX === this.values.leftX) {
        return;
    } ; this.state[1] |= 1; this.entity.entityState |= 1; this.values.leftX = leftX; }
    set topY(topY) { if (topY === this.values.topY) {
        return;
    } ; this.state[2] |= 1; this.entity.entityState |= 1; this.values.topY = topY; }
    set rightX(rightX) { if (rightX === this.values.rightX) {
        return;
    } ; this.state[3] |= 1; this.entity.entityState |= 1; this.values.rightX = rightX; }
    set bottomY(bottomY) { if (bottomY === this.values.bottomY) {
        return;
    } ; this.state[4] |= 1; this.entity.entityState |= 1; this.values.bottomY = bottomY; }
    set scoreboardAmount(scoreboardAmount) { if (scoreboardAmount === this.values.scoreboardAmount) {
        return;
    } ; this.state[5] |= 1; this.entity.entityState |= 1; this.values.scoreboardAmount = scoreboardAmount; }
    set leaderX(leaderX) { if (leaderX === this.values.leaderX) {
        return;
    } ; this.state[11] |= 1; this.entity.entityState |= 1; this.values.leaderX = leaderX; }
    set leaderY(leaderY) { if (leaderY === this.values.leaderY) {
        return;
    } ; this.state[12] |= 1; this.entity.entityState |= 1; this.values.leaderY = leaderY; }
    set playersNeeded(playersNeeded) { if (playersNeeded === this.values.playersNeeded) {
        return;
    } ; this.state[13] |= 1; this.entity.entityState |= 1; this.values.playersNeeded = playersNeeded; }
    set ticksUntilStart(ticksUntilStart) { if (ticksUntilStart === this.values.ticksUntilStart) {
        return;
    } ; this.state[14] |= 1; this.entity.entityState |= 1; this.values.ticksUntilStart = ticksUntilStart; }
}
exports.ArenaGroup = ArenaGroup;
class NameGroup {
    constructor(entity) {
        this.state = new Uint8Array(2);
        this.values = {
            flags: 0,
            name: ""
        };
        this.entity = entity;
    }
    wipe() { this.state.fill(0); }
    get flags() { return this.values.flags; }
    get name() { return this.values.name; }
    set flags(flags) { if (flags === this.values.flags) {
        return;
    } ; this.state[0] |= 1; this.entity.entityState |= 1; this.values.flags = flags; }
    set name(name) { if (name === this.values.name) {
        return;
    } ; this.state[1] |= 1; this.entity.entityState |= 1; this.values.name = name; }
}
exports.NameGroup = NameGroup;
class CameraGroup {
    constructor(entity) {
        this.state = new Uint8Array(21);
        this.values = {
            unusedClientId: 0,
            flags: 1,
            player: null,
            FOV: 0.35,
            level: 1,
            tank: 53,
            levelbarProgress: 0,
            levelbarMax: 0,
            statsAvailable: 0,
            statNames: new CameraTable("", 9, this),
            statLevels: new CameraTable(0, 10, this),
            statLimits: new CameraTable(0, 11, this),
            cameraX: 0,
            cameraY: 0,
            score: 0,
            respawnLevel: 0,
            killedBy: "",
            spawnTick: 0,
            deathTick: -1,
            tankOverride: "",
            movementSpeed: 0
        };
        this.entity = entity;
    }
    wipe() { this.state.fill(0); this.values.statNames.wipe(); this.values.statLevels.wipe(); this.values.statLimits.wipe(); }
    get unusedClientId() { return this.values.unusedClientId; }
    get flags() { return this.values.flags; }
    get player() { return this.values.player; }
    get FOV() { return this.values.FOV; }
    get level() { return this.values.level; }
    get tank() { return this.values.tank; }
    get levelbarProgress() { return this.values.levelbarProgress; }
    get levelbarMax() { return this.values.levelbarMax; }
    get statsAvailable() { return this.values.statsAvailable; }
    get statNames() { return this.values.statNames; }
    get statLevels() { return this.values.statLevels; }
    get statLimits() { return this.values.statLimits; }
    get cameraX() { return this.values.cameraX; }
    get cameraY() { return this.values.cameraY; }
    get score() { return this.values.score; }
    get respawnLevel() { return this.values.respawnLevel; }
    get killedBy() { return this.values.killedBy; }
    get spawnTick() { return this.values.spawnTick; }
    get deathTick() { return this.values.deathTick; }
    get tankOverride() { return this.values.tankOverride; }
    get movementSpeed() { return this.values.movementSpeed; }
    set unusedClientId(unusedClientId) { if (unusedClientId === this.values.unusedClientId) {
        return;
    } ; this.state[0] |= 1; this.entity.entityState |= 1; this.values.unusedClientId = unusedClientId; }
    set flags(flags) { if (flags === this.values.flags) {
        return;
    } ; this.state[1] |= 1; this.entity.entityState |= 1; this.values.flags = flags; }
    set player(player) { if (player === this.values.player) {
        return;
    } ; this.state[2] |= 1; this.entity.entityState |= 1; this.values.player = player; }
    set FOV(FOV) { if (FOV === this.values.FOV) {
        return;
    } ; this.state[3] |= 1; this.entity.entityState |= 1; this.values.FOV = FOV; }
    set level(level) { if (level === this.values.level) {
        return;
    } ; this.state[4] |= 1; this.entity.entityState |= 1; this.values.level = level; }
    set tank(tank) { if (tank === this.values.tank) {
        return;
    } ; this.state[5] |= 1; this.entity.entityState |= 1; this.values.tank = tank; }
    set levelbarProgress(levelbarProgress) { if (levelbarProgress === this.values.levelbarProgress) {
        return;
    } ; this.state[6] |= 1; this.entity.entityState |= 1; this.values.levelbarProgress = levelbarProgress; }
    set levelbarMax(levelbarMax) { if (levelbarMax === this.values.levelbarMax) {
        return;
    } ; this.state[7] |= 1; this.entity.entityState |= 1; this.values.levelbarMax = levelbarMax; }
    set statsAvailable(statsAvailable) { if (statsAvailable === this.values.statsAvailable) {
        return;
    } ; this.state[8] |= 1; this.entity.entityState |= 1; this.values.statsAvailable = statsAvailable; }
    set cameraX(cameraX) { if (cameraX === this.values.cameraX) {
        return;
    } ; this.state[12] |= 1; this.entity.entityState |= 1; this.values.cameraX = cameraX; }
    set cameraY(cameraY) { if (cameraY === this.values.cameraY) {
        return;
    } ; this.state[13] |= 1; this.entity.entityState |= 1; this.values.cameraY = cameraY; }
    set score(score) { if (score === this.values.score) {
        return;
    } ; this.state[14] |= 1; this.entity.entityState |= 1; this.values.score = score; }
    set respawnLevel(respawnLevel) { if (respawnLevel === this.values.respawnLevel) {
        return;
    } ; this.state[15] |= 1; this.entity.entityState |= 1; this.values.respawnLevel = respawnLevel; }
    set killedBy(killedBy) { if (killedBy === this.values.killedBy) {
        return;
    } ; this.state[16] |= 1; this.entity.entityState |= 1; this.values.killedBy = killedBy; }
    set spawnTick(spawnTick) { if (spawnTick === this.values.spawnTick) {
        return;
    } ; this.state[17] |= 1; this.entity.entityState |= 1; this.values.spawnTick = spawnTick; }
    set deathTick(deathTick) { if (deathTick === this.values.deathTick) {
        return;
    } ; this.state[18] |= 1; this.entity.entityState |= 1; this.values.deathTick = deathTick; }
    set tankOverride(tankOverride) { if (tankOverride === this.values.tankOverride) {
        return;
    } ; this.state[19] |= 1; this.entity.entityState |= 1; this.values.tankOverride = tankOverride; }
    set movementSpeed(movementSpeed) { if (movementSpeed === this.values.movementSpeed) {
        return;
    } ; this.state[20] |= 1; this.entity.entityState |= 1; this.values.movementSpeed = movementSpeed; }
}
exports.CameraGroup = CameraGroup;
class PositionGroup {
    constructor(entity) {
        this.state = new Uint8Array(4);
        this.values = {
            x: 0,
            y: 0,
            angle: 0,
            flags: 0
        };
        this.entity = entity;
    }
    wipe() { this.state.fill(0); }
    get x() { return this.values.x; }
    get y() { return this.values.y; }
    get angle() { return this.values.angle; }
    get flags() { return this.values.flags; }
    set x(x) { if (x === this.values.x) {
        return;
    } ; this.state[0] |= 1; this.entity.entityState |= 1; this.values.x = x; }
    set y(y) { if (y === this.values.y) {
        return;
    } ; this.state[1] |= 1; this.entity.entityState |= 1; this.values.y = y; }
    set angle(angle) { if (angle === this.values.angle) {
        return;
    } ; this.state[2] |= 1; this.entity.entityState |= 1; this.values.angle = angle; }
    set flags(flags) { if (flags === this.values.flags) {
        return;
    } ; this.state[3] |= 1; this.entity.entityState |= 1; this.values.flags = flags; }
}
exports.PositionGroup = PositionGroup;
class StyleGroup {
    constructor(entity) {
        this.state = new Uint8Array(5);
        this.values = {
            flags: 1,
            color: 0,
            borderWidth: 7.5,
            opacity: 1,
            zIndex: 0
        };
        this.entity = entity;
    }
    wipe() { this.state.fill(0); }
    get flags() { return this.values.flags; }
    get color() { return this.values.color; }
    get borderWidth() { return this.values.borderWidth; }
    get opacity() { return this.values.opacity; }
    get zIndex() { return this.values.zIndex; }
    set flags(flags) { if (flags === this.values.flags) {
        return;
    } ; this.state[0] |= 1; this.entity.entityState |= 1; this.values.flags = flags; }
    set color(color) { if (color === this.values.color) {
        return;
    } ; this.state[1] |= 1; this.entity.entityState |= 1; this.values.color = color; }
    set borderWidth(borderWidth) { if (borderWidth === this.values.borderWidth) {
        return;
    } ; this.state[2] |= 1; this.entity.entityState |= 1; this.values.borderWidth = borderWidth; }
    set opacity(opacity) { if (opacity === this.values.opacity) {
        return;
    } ; this.state[3] |= 1; this.entity.entityState |= 1; this.values.opacity = opacity; }
    set zIndex(zIndex) { if (zIndex === this.values.zIndex) {
        return;
    } ; this.state[4] |= 1; this.entity.entityState |= 1; this.values.zIndex = zIndex; }
}
exports.StyleGroup = StyleGroup;
class ScoreGroup {
    constructor(entity) {
        this.state = new Uint8Array(1);
        this.values = {
            score: 0
        };
        this.entity = entity;
    }
    wipe() { this.state.fill(0); }
    get score() { return this.values.score; }
    set score(score) { if (score === this.values.score) {
        return;
    } ; this.state[0] |= 1; this.entity.entityState |= 1; this.values.score = score; }
}
exports.ScoreGroup = ScoreGroup;
class TeamGroup {
    constructor(entity) {
        this.state = new Uint8Array(4);
        this.values = {
            teamColor: 0,
            mothershipX: 0,
            mothershipY: 0,
            flags: 0
        };
        this.entity = entity;
    }
    wipe() { this.state.fill(0); }
    get teamColor() { return this.values.teamColor; }
    get mothershipX() { return this.values.mothershipX; }
    get mothershipY() { return this.values.mothershipY; }
    get flags() { return this.values.flags; }
    set teamColor(teamColor) { if (teamColor === this.values.teamColor) {
        return;
    } ; this.state[0] |= 1; this.entity.entityState |= 1; this.values.teamColor = teamColor; }
    set mothershipX(mothershipX) { if (mothershipX === this.values.mothershipX) {
        return;
    } ; this.state[1] |= 1; this.entity.entityState |= 1; this.values.mothershipX = mothershipX; }
    set mothershipY(mothershipY) { if (mothershipY === this.values.mothershipY) {
        return;
    } ; this.state[2] |= 1; this.entity.entityState |= 1; this.values.mothershipY = mothershipY; }
    set flags(flags) { if (flags === this.values.flags) {
        return;
    } ; this.state[3] |= 1; this.entity.entityState |= 1; this.values.flags = flags; }
}
exports.TeamGroup = TeamGroup;
