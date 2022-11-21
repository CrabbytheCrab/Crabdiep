"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.levelToScore = exports.levelToScoreTable = exports.NametagFlags = exports.HealthbarFlags = exports.ShootingFlags = exports.ObjectFlags = exports.MotionFlags = exports.StyleFlags = exports.CameraFlags = exports.MothershipFlags = exports.GUIFlags = exports.InputFlags = exports.ClientBound = exports.ServerBound = exports.FieldGroups = exports.StatCount = exports.Stat = exports.Tank = exports.ColorsHexCode = exports.Colors = void 0;
/**
 * The IDs for all the team colors, by name.
 */
var Colors;
(function (Colors) {
    Colors[Colors["Border"] = 0] = "Border";
    Colors[Colors["Barrel"] = 1] = "Barrel";
    Colors[Colors["Tank"] = 2] = "Tank";
    Colors[Colors["TeamBlue"] = 3] = "TeamBlue";
    Colors[Colors["TeamRed"] = 4] = "TeamRed";
    Colors[Colors["TeamPurple"] = 5] = "TeamPurple";
    Colors[Colors["TeamGreen"] = 6] = "TeamGreen";
    Colors[Colors["Shiny"] = 7] = "Shiny";
    Colors[Colors["EnemySquare"] = 8] = "EnemySquare";
    Colors[Colors["EnemyTriangle"] = 9] = "EnemyTriangle";
    Colors[Colors["EnemyPentagon"] = 10] = "EnemyPentagon";
    Colors[Colors["EnemyCrasher"] = 11] = "EnemyCrasher";
    Colors[Colors["Neutral"] = 12] = "Neutral";
    Colors[Colors["ScoreboardBar"] = 13] = "ScoreboardBar";
    Colors[Colors["Box"] = 14] = "Box";
    Colors[Colors["EnemyTank"] = 15] = "EnemyTank";
    Colors[Colors["NecromancerSquare"] = 16] = "NecromancerSquare";
    Colors[Colors["Fallen"] = 17] = "Fallen";
    Colors[Colors["kMaxColors"] = 18] = "kMaxColors";
})(Colors = exports.Colors || (exports.Colors = {}));
/**
 * The hex color codes of each color (by ID), expressed as an int (0x00RRGGBB)
 */
exports.ColorsHexCode = {
    [Colors.Border]: 0x555555,
    [Colors.Barrel]: 0x999999,
    [Colors.Tank]: 0x00B2E1,
    [Colors.TeamBlue]: 0x00B2E1,
    [Colors.TeamRed]: 0xF14E54,
    [Colors.TeamPurple]: 0xBF7FF5,
    [Colors.TeamGreen]: 0x00E16E,
    [Colors.Shiny]: 0x8AFF69,
    [Colors.EnemySquare]: 0xFFE869,
    [Colors.EnemyTriangle]: 0xFC7677,
    [Colors.EnemyPentagon]: 0x768DFC,
    [Colors.EnemyCrasher]: 0xF177DD,
    [Colors.Neutral]: 0xFFE869,
    [Colors.ScoreboardBar]: 0x43FF91,
    [Colors.Box]: 0xBBBBBB,
    [Colors.EnemyTank]: 0xF14E54,
    [Colors.NecromancerSquare]: 0xFCC376,
    [Colors.Fallen]: 0xC0C0C0,
    [Colors.kMaxColors]: 0x000000
};
/**
 * The IDs for all the tanks, by name.
 */
var Tank;
(function (Tank) {
    Tank[Tank["Basic"] = 0] = "Basic";
    Tank[Tank["Twin"] = 1] = "Twin";
    Tank[Tank["Sniper"] = 2] = "Sniper";
    Tank[Tank["MachineGun"] = 3] = "MachineGun";
    Tank[Tank["FlankGuard"] = 4] = "FlankGuard";
    Tank[Tank["Commander"] = 5] = "Commander";
    Tank[Tank["Single"] = 6] = "Single";
    Tank[Tank["Trapper"] = 7] = "Trapper";
    Tank[Tank["Smasher"] = 8] = "Smasher";
    Tank[Tank["TripleShot"] = 9] = "TripleShot";
    Tank[Tank["QuadTank"] = 10] = "QuadTank";
    Tank[Tank["TwinFlank"] = 11] = "TwinFlank";
    Tank[Tank["Assassin"] = 12] = "Assassin";
    Tank[Tank["Hunter"] = 13] = "Hunter";
    Tank[Tank["Scope"] = 14] = "Scope";
    Tank[Tank["PeaceKeeper"] = 15] = "PeaceKeeper";
    Tank[Tank["Spewer"] = 16] = "Spewer";
    Tank[Tank["Gunner"] = 17] = "Gunner";
    Tank[Tank["TriAngle"] = 18] = "TriAngle";
    Tank[Tank["TripleTank"] = 19] = "TripleTank";
    Tank[Tank["TrapGuard"] = 20] = "TrapGuard";
    Tank[Tank["auto3"] = 21] = "auto3";
    Tank[Tank["Destroyer"] = 22] = "Destroyer";
    Tank[Tank["Artillery"] = 23] = "Artillery";
    Tank[Tank["Director"] = 24] = "Director";
    Tank[Tank["Launcher"] = 25] = "Launcher";
    Tank[Tank["Overseer"] = 26] = "Overseer";
    Tank[Tank["Spawner"] = 27] = "Spawner";
    Tank[Tank["Cruiser"] = 28] = "Cruiser";
    Tank[Tank["FlankTrapper"] = 29] = "FlankTrapper";
    Tank[Tank["BigTrapper"] = 30] = "BigTrapper";
    Tank[Tank["Boomerang"] = 31] = "Boomerang";
    Tank[Tank["Caster"] = 32] = "Caster";
    Tank[Tank["Triplet"] = 33] = "Triplet";
    Tank[Tank["PentaShot"] = 34] = "PentaShot";
    Tank[Tank["TripleFlank"] = 35] = "TripleFlank";
    Tank[Tank["Engineer"] = 36] = "Engineer";
    Tank[Tank["OctoTank"] = 37] = "OctoTank";
    Tank[Tank["HexTank"] = 38] = "HexTank";
    Tank[Tank["auto5"] = 39] = "auto5";
    Tank[Tank["TripleTwin"] = 40] = "TripleTwin";
    Tank[Tank["Battleship"] = 41] = "Battleship";
    Tank[Tank["HewnFlank"] = 42] = "HewnFlank";
    Tank[Tank["Ranger"] = 43] = "Ranger";
    Tank[Tank["Marksman"] = 44] = "Marksman";
    Tank[Tank["Rifle"] = 45] = "Rifle";
    Tank[Tank["Stalker"] = 46] = "Stalker";
    Tank[Tank["Predator"] = 47] = "Predator";
    Tank[Tank["Ordinance"] = 48] = "Ordinance";
    Tank[Tank["Streamliner"] = 49] = "Streamliner";
    Tank[Tank["Rimfire"] = 50] = "Rimfire";
    Tank[Tank["Warden"] = 51] = "Warden";
    Tank[Tank["Sprayer"] = 52] = "Sprayer";
    Tank[Tank["Minigun"] = 53] = "Minigun";
    Tank[Tank["GunnerTrapper"] = 54] = "GunnerTrapper";
    Tank[Tank["Booster"] = 55] = "Booster";
    Tank[Tank["Fighter"] = 56] = "Fighter";
    Tank[Tank["Wake"] = 57] = "Wake";
    Tank[Tank["SpreadShot"] = 58] = "SpreadShot";
    Tank[Tank["TripleDestroyer"] = 59] = "TripleDestroyer";
    Tank[Tank["mega3"] = 60] = "mega3";
    Tank[Tank["Bushwaker"] = 61] = "Bushwaker";
    Tank[Tank["AutoGunner"] = 62] = "AutoGunner";
    Tank[Tank["AutoTrapper"] = 63] = "AutoTrapper";
    Tank[Tank["Annihilator"] = 64] = "Annihilator";
    Tank[Tank["Hybrid"] = 65] = "Hybrid";
    Tank[Tank["Mortar"] = 66] = "Mortar";
    Tank[Tank["Beekeeper"] = 67] = "Beekeeper";
    Tank[Tank["Skimmer"] = 68] = "Skimmer";
    Tank[Tank["Rocketeer"] = 69] = "Rocketeer";
    Tank[Tank["AutoLauncher"] = 70] = "AutoLauncher";
    Tank[Tank["Overlord"] = 71] = "Overlord";
    Tank[Tank["AutoOverseer"] = 72] = "AutoOverseer";
    Tank[Tank["Necromancer"] = 73] = "Necromancer";
    Tank[Tank["Manager"] = 74] = "Manager";
    Tank[Tank["Executive"] = 75] = "Executive";
    Tank[Tank["stalker3"] = 76] = "stalker3";
    Tank[Tank["Maleficitor"] = 77] = "Maleficitor";
    Tank[Tank["Carrier"] = 78] = "Carrier";
    Tank[Tank["Factory"] = 79] = "Factory";
    Tank[Tank["Master"] = 80] = "Master";
    Tank[Tank["TriTrapper"] = 81] = "TriTrapper";
    Tank[Tank["Barricade"] = 82] = "Barricade";
    Tank[Tank["MegaTrapper"] = 83] = "MegaTrapper";
    Tank[Tank["Raider"] = 84] = "Raider";
    Tank[Tank["Overtrapper"] = 85] = "Overtrapper";
    Tank[Tank["Spike"] = 86] = "Spike";
    Tank[Tank["MegaSmasher"] = 87] = "MegaSmasher";
    Tank[Tank["Saw"] = 88] = "Saw";
    Tank[Tank["Landmine"] = 89] = "Landmine";
    Tank[Tank["autosmasher"] = 90] = "autosmasher";
    Tank[Tank["DominatorD"] = 500] = "DominatorD";
    Tank[Tank["DominatorG"] = 501] = "DominatorG";
    Tank[Tank["DominatorT"] = 502] = "DominatorT";
    Tank[Tank["ArenaCloser"] = 503] = "ArenaCloser";
    Tank[Tank["Mothership"] = 504] = "Mothership";
})(Tank = exports.Tank || (exports.Tank = {}));
/**
 * The IDs for all the stats, by name.
 */
var Stat;
(function (Stat) {
    Stat[Stat["MovementSpeed"] = 0] = "MovementSpeed";
    Stat[Stat["Reload"] = 1] = "Reload";
    Stat[Stat["BulletDamage"] = 2] = "BulletDamage";
    Stat[Stat["BulletPenetration"] = 3] = "BulletPenetration";
    Stat[Stat["BulletSpeed"] = 4] = "BulletSpeed";
    Stat[Stat["BodyDamage"] = 5] = "BodyDamage";
    Stat[Stat["MaxHealth"] = 6] = "MaxHealth";
    Stat[Stat["HealthRegen"] = 7] = "HealthRegen";
})(Stat = exports.Stat || (exports.Stat = {}));
/**
 * Total Stat Count
 */
exports.StatCount = 8;
/**
 * IDs for the groupings of fields in diep protocol.
 * For more details read [entities.md](https://github.com/ABCxFF/diepindepth/blob/main/entities.md).
 */
var FieldGroups;
(function (FieldGroups) {
    FieldGroups[FieldGroups["Relations"] = 0] = "Relations";
    FieldGroups[FieldGroups["Barrel"] = 2] = "Barrel";
    FieldGroups[FieldGroups["Physics"] = 3] = "Physics";
    FieldGroups[FieldGroups["Health"] = 4] = "Health";
    FieldGroups[FieldGroups["Unused"] = 6] = "Unused";
    FieldGroups[FieldGroups["Arena"] = 7] = "Arena";
    FieldGroups[FieldGroups["Name"] = 8] = "Name";
    FieldGroups[FieldGroups["Camera"] = 9] = "Camera";
    FieldGroups[FieldGroups["Position"] = 10] = "Position";
    FieldGroups[FieldGroups["Style"] = 11] = "Style";
    FieldGroups[FieldGroups["Score"] = 13] = "Score";
    FieldGroups[FieldGroups["Team"] = 14] = "Team";
})(FieldGroups = exports.FieldGroups || (exports.FieldGroups = {}));
/**
 * Packet headers for the [serverbound packets](https://github.com/ABCxFF/diepindepth/blob/main/protocol/serverbound.md).
 */
var ServerBound;
(function (ServerBound) {
    ServerBound[ServerBound["Init"] = 0] = "Init";
    ServerBound[ServerBound["Input"] = 1] = "Input";
    ServerBound[ServerBound["Spawn"] = 2] = "Spawn";
    ServerBound[ServerBound["StatUpgrade"] = 3] = "StatUpgrade";
    ServerBound[ServerBound["TankUpgrade"] = 4] = "TankUpgrade";
    ServerBound[ServerBound["Ping"] = 5] = "Ping";
    ServerBound[ServerBound["TCPInit"] = 6] = "TCPInit";
    ServerBound[ServerBound["ExtensionFound"] = 7] = "ExtensionFound";
    ServerBound[ServerBound["ToRespawn"] = 8] = "ToRespawn";
    ServerBound[ServerBound["TakeTank"] = 9] = "TakeTank";
})(ServerBound = exports.ServerBound || (exports.ServerBound = {}));
/**
 * Packet headers for the [clientbound packets](https://github.com/ABCxFF/diepindepth/blob/main/protocol/clientbound.md).
 */
var ClientBound;
(function (ClientBound) {
    ClientBound[ClientBound["Update"] = 0] = "Update";
    ClientBound[ClientBound["OutdatedClient"] = 1] = "OutdatedClient";
    ClientBound[ClientBound["Compressed"] = 2] = "Compressed";
    ClientBound[ClientBound["Notification"] = 3] = "Notification";
    ClientBound[ClientBound["ServerInfo"] = 4] = "ServerInfo";
    ClientBound[ClientBound["Ping"] = 5] = "Ping";
    ClientBound[ClientBound["PartyCode"] = 6] = "PartyCode";
    ClientBound[ClientBound["Accept"] = 7] = "Accept";
    ClientBound[ClientBound["Achievement"] = 8] = "Achievement";
    ClientBound[ClientBound["InvalidParty"] = 9] = "InvalidParty";
    ClientBound[ClientBound["PlayerCount"] = 10] = "PlayerCount";
    ClientBound[ClientBound["ProofOfWork"] = 11] = "ProofOfWork";
})(ClientBound = exports.ClientBound || (exports.ClientBound = {}));
/**
 * Flags sent within the [input packet](https://github.com/ABCxFF/diepindepth/blob/main/protocol/serverbound.md#0x01-input-packet).
 */
var InputFlags;
(function (InputFlags) {
    InputFlags[InputFlags["leftclick"] = 1] = "leftclick";
    InputFlags[InputFlags["up"] = 2] = "up";
    InputFlags[InputFlags["left"] = 4] = "left";
    InputFlags[InputFlags["down"] = 8] = "down";
    InputFlags[InputFlags["right"] = 16] = "right";
    InputFlags[InputFlags["godmode"] = 32] = "godmode";
    InputFlags[InputFlags["suicide"] = 64] = "suicide";
    InputFlags[InputFlags["rightclick"] = 128] = "rightclick";
    InputFlags[InputFlags["levelup"] = 256] = "levelup";
    InputFlags[InputFlags["gamepad"] = 512] = "gamepad";
    InputFlags[InputFlags["switchtank"] = 1024] = "switchtank";
    InputFlags[InputFlags["adblock"] = 2048] = "adblock";
})(InputFlags = exports.InputFlags || (exports.InputFlags = {}));
/**
 * The flag names for the `GUI` field of the arena field group.
 */
var GUIFlags;
(function (GUIFlags) {
    GUIFlags[GUIFlags["noJoining"] = 1] = "noJoining";
    GUIFlags[GUIFlags["showLeaderArrow"] = 2] = "showLeaderArrow";
    GUIFlags[GUIFlags["hideScorebar"] = 4] = "hideScorebar";
    GUIFlags[GUIFlags["gameReadyStart"] = 8] = "gameReadyStart";
    GUIFlags[GUIFlags["canUseCheats"] = 16] = "canUseCheats";
})(GUIFlags = exports.GUIFlags || (exports.GUIFlags = {}));
/**
 * The flag names for the `mothership` field of the team field group.
 */
var MothershipFlags;
(function (MothershipFlags) {
    MothershipFlags[MothershipFlags["hasMothership"] = 1] = "hasMothership";
})(MothershipFlags = exports.MothershipFlags || (exports.MothershipFlags = {}));
/**
 * The flag names for the `camera` field of the camera field group.
 */
var CameraFlags;
(function (CameraFlags) {
    CameraFlags[CameraFlags["useCameraCoords"] = 1] = "useCameraCoords";
    CameraFlags[CameraFlags["showDeathStats"] = 2] = "showDeathStats";
    CameraFlags[CameraFlags["gameWaitingStart"] = 4] = "gameWaitingStart";
})(CameraFlags = exports.CameraFlags || (exports.CameraFlags = {}));
/**
 * The flag names for the `styleFlags` field of the syle field group.
 */
var StyleFlags;
(function (StyleFlags) {
    StyleFlags[StyleFlags["visible"] = 1] = "visible";
    StyleFlags[StyleFlags["damage"] = 2] = "damage";
    StyleFlags[StyleFlags["invincibility"] = 4] = "invincibility";
    StyleFlags[StyleFlags["minimap2"] = 8] = "minimap2";
    StyleFlags[StyleFlags["star"] = 16] = "star";
    StyleFlags[StyleFlags["trap"] = 32] = "trap";
    StyleFlags[StyleFlags["aboveParent"] = 64] = "aboveParent";
    StyleFlags[StyleFlags["noDmgIndicator"] = 128] = "noDmgIndicator";
})(StyleFlags = exports.StyleFlags || (exports.StyleFlags = {}));
/**
 * The flag names for the `motion` field of the position field group.
 */
var MotionFlags;
(function (MotionFlags) {
    MotionFlags[MotionFlags["absoluteRotation"] = 1] = "absoluteRotation";
    MotionFlags[MotionFlags["canMoveThroughWalls"] = 2] = "canMoveThroughWalls";
})(MotionFlags = exports.MotionFlags || (exports.MotionFlags = {}));
/**
 * The flag names for the `objectFlags` field of the physics field group.
 */
var ObjectFlags;
(function (ObjectFlags) {
    ObjectFlags[ObjectFlags["isTrapezoid"] = 1] = "isTrapezoid";
    ObjectFlags[ObjectFlags["minimap"] = 2] = "minimap";
    ObjectFlags[ObjectFlags["unknown1"] = 4] = "unknown1";
    ObjectFlags[ObjectFlags["noOwnTeamCollision"] = 8] = "noOwnTeamCollision";
    ObjectFlags[ObjectFlags["wall"] = 16] = "wall";
    ObjectFlags[ObjectFlags["onlySameOwnerCollision"] = 32] = "onlySameOwnerCollision";
    ObjectFlags[ObjectFlags["base"] = 64] = "base";
    ObjectFlags[ObjectFlags["unknown4"] = 128] = "unknown4";
    ObjectFlags[ObjectFlags["canEscapeArena"] = 256] = "canEscapeArena";
})(ObjectFlags = exports.ObjectFlags || (exports.ObjectFlags = {}));
/**
 * The flag names for the `shooting` field of the barrel field group.
 */
var ShootingFlags;
(function (ShootingFlags) {
    ShootingFlags[ShootingFlags["shoot"] = 1] = "shoot";
})(ShootingFlags = exports.ShootingFlags || (exports.ShootingFlags = {}));
/**
 * The flag names for the `healthbar` field of the health field group.
 */
var HealthbarFlags;
(function (HealthbarFlags) {
    HealthbarFlags[HealthbarFlags["hidden"] = 1] = "hidden";
})(HealthbarFlags = exports.HealthbarFlags || (exports.HealthbarFlags = {}));
/**
 * The flag names for the `nametag` field of the name field group.
 */
var NametagFlags;
(function (NametagFlags) {
    NametagFlags[NametagFlags["hidden"] = 1] = "hidden";
    NametagFlags[NametagFlags["cheats"] = 2] = "cheats";
})(NametagFlags = exports.NametagFlags || (exports.NametagFlags = {}));
/**
 * Credits to CX for discovering this.
 * This is not fully correct but it works up to the decimal (float rounding likely causes this).
 *
 * `[index: level]->score at level`
 */
exports.levelToScoreTable = Array(45).fill(0);
for (let i = 1; i < 45; ++i) {
    exports.levelToScoreTable[i] = exports.levelToScoreTable[i - 1] + (40 / 9 * 1.06 ** (i - 1) * Math.min(31, i));
}
/**
 * Credits to CX for discovering this.
 * This is not fully correct but it works up to the decimal (float rounding likely causes this).
 *
 * Used for level calculation across the codebase.
 *
 * `(level)->score at level`
 */
function levelToScore(level) {
    if (level >= 45)
        return exports.levelToScoreTable[44];
    if (level <= 0)
        return 0;
    return exports.levelToScoreTable[level - 1];
}
exports.levelToScore = levelToScore;
