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

/**
 * The IDs for all the team colors, by name.
 */
export const enum Color {
    Border = 0,
    Barrel = 1,
    Tank = 2,
    TeamBlue = 3,
    TeamRed = 4,
    TeamPurple = 5,
    TeamGreen = 6,
    Shiny = 7,
    EnemySquare = 8,
    EnemyTriangle = 9,
    EnemyPentagon = 10,
    EnemyCrasher = 11,
    Neutral = 12,
    ScoreboardBar = 13,
    Box = 14,
    EnemyTank = 15,
    NecromancerSquare = 16,
    Fallen = 17,

    kMaxColors = 18
}

/**
 * The hex color codes of each color (by ID), expressed as an int (0x00RRGGBB)
 */
export const ColorsHexCode: Record<Color, number> = {
    [Color.Border]: 0x555555,
    [Color.Barrel]: 0x999999,
    [Color.Tank]: 0x00B2E1,
    [Color.TeamBlue]: 0x00B2E1,
    [Color.TeamRed]: 0xF14E54,
    [Color.TeamPurple]: 0xBF7FF5,
    [Color.TeamGreen]: 0x00E16E,
    [Color.Shiny]: 0x8AFF69,
    [Color.EnemySquare]: 0xFFE869,
    [Color.EnemyTriangle]: 0xFC7677,
    [Color.EnemyPentagon]: 0x768DFC,
    [Color.EnemyCrasher]: 0xF177DD,
    [Color.Neutral]: 0xFFE869,
    [Color.ScoreboardBar]: 0x43FF91,
    [Color.Box]: 0xBBBBBB,
    [Color.EnemyTank]: 0xF14E54,
    [Color.NecromancerSquare]: 0xFCC376,
    [Color.Fallen]: 0xC0C0C0,
    [Color.kMaxColors]: 0x000000
}

/**
 * The IDs for all the tanks, by name.
 */
export const enum Tank {
    Basic         = 0,
    Twin          = 1,
    Sniper        = 2,
    MachineGun    = 3,
    FlankGuard    = 4,
    Commander     = 5,
    Single        = 6,
    Trapper       = 7,
    Smasher       = 8,
    TripleShot    = 9,
    QuadTank      = 10,
    TwinFlank     = 11,
    Assassin      = 12,
    Hunter        = 13,
    Scope         = 14,
    PeaceKeeper   = 15,
    Spewer        = 16,
    Gunner        = 17,
    TriAngle      = 18,
    TripleTank    = 19,
    TrapGuard     = 20,
    auto3         = 21,
    Destroyer     = 22,
    Artillery     = 23,
    Director      = 24,
    Launcher      = 25,
    Overseer      = 26,
    Spawner       = 27,
    Cruiser       = 28,
    FlankTrapper  = 29,
    BigTrapper    = 30,
    Boomerang     = 31,
    Caster        = 32,
    Triplet       = 33,
    PentaShot     = 34,
    TripleFlank   = 35,
    Engineer      = 36,
    OctoTank      = 37,
    HexTank       = 38,
    auto5         = 39,
    TripleTwin    = 40,
    Battleship    = 41,
    HewnFlank     = 42,
    Ranger        = 43,
    Marksman      = 44,
    Rifle         = 45,
    Stalker       = 46,
    Predator      = 47,
    Ordinance     = 48,
    Streamliner   = 49,
    Rimfire       = 50,
    Warden        = 51,
    Sprayer       = 52,
    Minigun       = 53,
    GunnerTrapper = 54,
    Booster       = 55,
    Fighter       = 56,
    Wake          = 57,
    SpreadShot    = 58,
    TriDestroyer  = 59,
    mega3         = 60,
    Bushwaker     = 61,
    AutoGunner    = 62,
    AutoTrapper   = 63,
    Annihilator   = 64,
    Hybrid        = 65,
    Mortar        = 66,
    Beekeeper     = 67,
    Skimmer       = 68,
    Rocketeer     = 69,
    AutoLauncher  = 70,
    Overlord      = 71,
    Necromancer   = 72,
    AutoOverseer  = 73,
    Manager       = 74,
    Executive     = 75,
    stalker3      = 76,
    Maleficitor   = 77,
    Carrier       = 78,
    Factory       = 79,
    Master        = 80,
    TriTrapper    = 81,
    Barricade     = 82,
    MegaTrapper   = 83,
    Raider        = 84,
    Overtrapper   = 85,
    Spike         = 86,
    MegaSmasher   = 87,
    Saw           = 88,
    Landmine      = 89,
    autosmasher   = 90,
    Manufacturer  = 94,
    Roundabout    = 95,
    GattlingGun   = 96,
    Drizzler      = 97,
    Mechanic      = 98,
    auto4         = 99,
    Lich          = 100,
    Animator      = 101,
    Spinner       = 102,
    Rotator       = 103,
    Twister       = 104,
    DominatorD    = 91,
    DominatorG    = 92,
    DominatorT    = 93,
    ArenaCloser   = 105,
    DominatorC    = 106,
    DominatorF    = 107,
    Bumper        = 108,
    Autotank      = 109,
    Bombard       = 110,
    Joint3        = 111,
    Mothership    = 204
}

/**
 * The IDs for all the stats, by name.
 */
export const enum Stat {
    MovementSpeed = 0,
    Reload = 1,
    BulletDamage = 2,
    BulletPenetration = 3,
    BulletSpeed = 4,
    BodyDamage = 5,
    MaxHealth = 6,
    HealthRegen = 7
}

/**
 * Total Stat Count
 */
export const StatCount = 8;

/**
 * All the indices available on scoreboard - used for type security
 */
export type ValidScoreboardIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Packet headers for the [serverbound packets](https://github.com/ABCxFF/diepindepth/blob/main/protocol/serverbound.md).
 */
export const enum ServerBound {
    Init            = 0x0,
    Input           = 0x1,
    Spawn           = 0x2,
    StatUpgrade     = 0x3,
    TankUpgrade     = 0x4,
    Ping            = 0x5,
    TCPInit         = 0x6,
    ExtensionFound  = 0x7,
    ToRespawn       = 0x8,
    TakeTank        = 0x9
}
/**
 * Packet headers for the [clientbound packets](https://github.com/ABCxFF/diepindepth/blob/main/protocol/clientbound.md).
 */
export const enum ClientBound {
    Update          = 0x0,
    OutdatedClient  = 0x1,
    Compressed      = 0x2,
    Notification    = 0x3,
    ServerInfo      = 0x4,
    Ping            = 0x5,
    PartyCode       = 0x6,
    Accept          = 0x7,
    Achievement     = 0x8,
    InvalidParty    = 0x9,
    PlayerCount     = 0xA,
    ProofOfWork     = 0xB
}

/**
 * Flags sent within the [input packet](https://github.com/ABCxFF/diepindepth/blob/main/protocol/serverbound.md#0x01-input-packet).
 */
export const enum InputFlags {
    leftclick   = 1 << 0,
    up          = 1 << 1,
    left        = 1 << 2,
    down        = 1 << 3,
    right       = 1 << 4,
    godmode     = 1 << 5,
    suicide     = 1 << 6,
    rightclick  = 1 << 7,
    levelup     = 1 << 8,
    gamepad     = 1 << 9,
    switchtank  = 1 << 10,
    adblock     = 1 << 11
}

/**
 * The flag names for the arena field group.
 */
export const enum ArenaFlags {
    noJoining        = 1 << 0,
    showsLeaderArrow = 1 << 1,
    hiddenScores     = 1 << 2,
    gameReadyStart   = 1 << 3,
    canUseCheats     = 1 << 4
}
/**
 * The flag names for the team field group.
 */
export const enum TeamFlags {
    hasMothership = 1 << 0
}
/**
 * The flag names for the camera field group.
 */
export const enum CameraFlags {
    usesCameraCoords      = 1 << 0,
    showingDeathStats     = 1 << 1,
    gameWaitingStart      = 1 << 2
}
/**
 * The flag names for the tsyle field group.
 */
export const enum StyleFlags {
    isVisible          = 1 << 0,
    hasBeenDamaged     = 1 << 1,
    isFlashing         = 1 << 2,
    _minimap           = 1 << 3,
    isStar             = 1 << 4,
    isTrap             = 1 << 5,
    showsAboveParent   = 1 << 6,
    hasNoDmgIndicator  = 1 << 7
}
/**
 * The flag names for the position field group.
 */
export const enum PositionFlags {
    absoluteRotation    = 1 << 0,
    canMoveThroughWalls = 1 << 1
}
/**
 * The flag names for the physics field group.
 */
export const enum PhysicsFlags {
    isTrapezoid             = 1 << 0,
    showsOnMap              = 1 << 1,
    _unknown                = 1 << 2,
    noOwnTeamCollision      = 1 << 3,
    isSolidWall             = 1 << 4,
    onlySameOwnerCollision  = 1 << 5,
    isBase                  = 1 << 6,
    _unknown1               = 1 << 7,
    canEscapeArena          = 1 << 8
}
/**
 * The flag names for the barrel field group.
 */
export const enum BarrelFlags {
    hasShot = 1 << 0
}
/**
 * The flag names for the health field group.
 */
export const enum HealthFlags {
    hiddenHealthbar = 1 << 0
}
/**
 * The flag names for the name field group.
 */
export const enum NameFlags {
    hiddenName = 1 << 0,
    highlightedName = 1 << 1
}

/**
 * Credits to CX for discovering this.
 * This is not fully correct but it works up to the decimal (float rounding likely causes this).
 * 
 * `[index: level]->score at level`
 */
export const levelToScoreTable = Array(45).fill(0);

for (let i = 1; i < 45; ++i) {
    levelToScoreTable[i] = levelToScoreTable[i - 1] + (40 / 9 * 1.06 ** (i - 1) * Math.min(31, i));
}

/**
 * Credits to CX for discovering this.
 * This is not fully correct but it works up to the decimal (float rounding likely causes this).
 * 
 * Used for level calculation across the codebase.
 * 
 * `(level)->score at level`
 */
export function levelToScore(level: number): number {
    if (level >= 45) return levelToScoreTable[44];
    if (level <= 0) return 0;

    return levelToScoreTable[level - 1];
}
