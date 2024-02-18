"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoreToLevel = exports.levelToScore = exports.StatCount = exports.ColorsHexCode = void 0;
const TankBody_1 = require("../Entity/Tank/TankBody");
const Entity_1 = require("../Native/Entity");
exports.ColorsHexCode = {
    [0]: 0x555555,
    [1]: 0x999999,
    [2]: 0x00B2E1,
    [3]: 0x00B2E1,
    [4]: 0xF14E54,
    [5]: 0xBF7FF5,
    [6]: 0x00E16E,
    [7]: 0x8AFF69,
    [8]: 0xFFE869,
    [9]: 0xFC7677,
    [10]: 0x768DFC,
    [11]: 0xF177DD,
    [12]: 0xFFE869,
    [13]: 0x43FF91,
    [14]: 0xBBBBBB,
    [15]: 0xF14E54,
    [16]: 0xFCC376,
    [17]: 0xC0C0C0,
    [18]: 0xB276FC,
    [19]: 0xFC9E76,
    [20]: 0xFCA644,
    [21]: 0xD341DB,
    [22]: 0x000000,
    [23]: 0x38B764,
    [24]: 0x4A66BD,
    [25]: 0xFFFFFF,
    [26]: 0x820D0D,
    [27]: 0x5D275D,
    [28]: 0x1A1C2C
};
exports.StatCount = 8;
function levelToScore(level, camera) {
    const levelToScoreTable = Array(camera.maxlevel).fill(0);
    for (let i = 1; i < camera.maxlevel; ++i) {
        const player = camera.cameraData.values.player;
        if (Entity_1.Entity.exists(player) && player instanceof TankBody_1.default) {
            if (player.definition.flags.isCelestial) {
                levelToScoreTable[i] = levelToScoreTable[i - 1] + (90 / 9 * 1.06 ** (i - 1) * Math.min(31, i));
            }
            else {
                levelToScoreTable[i] = levelToScoreTable[i - 1] + (40 / 9 * 1.06 ** (i - 1) * Math.min(31, i));
            }
        }
    }
    if (level >= camera.maxlevel)
        return levelToScoreTable[camera.maxlevel - 1];
    if (level <= 0)
        return 0;
    return levelToScoreTable[level - 1];
}
exports.levelToScore = levelToScore;
function scoreToLevel(level, camera) {
    const player = camera.cameraData.values.player;
    for (let i = 1; i < camera.maxlevel; ++i) {
        if (Entity_1.Entity.exists(player) && player instanceof TankBody_1.default) {
            if (player.definition.flags.isCelestial) {
                level = level - (90 * 9 / 1.06 ^ (i + 1) / Math.max(31, i));
            }
            else {
                level = level - (40 * 9 / 1.06 ^ (i + 1) / Math.max(31, i));
            }
        }
    }
    if (level >= camera.maxlevel)
        return camera.maxlevel - 1;
    if (level <= 0)
        return 0;
    return level;
}
exports.scoreToLevel = scoreToLevel;
