"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.levelToScore = exports.levelToScoreTable = exports.StatCount = exports.ColorsHexCode = void 0;
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
    [18]: 0x000000
};
exports.StatCount = 8;
exports.levelToScoreTable = Array(45).fill(0);
for (let i = 1; i < 45; ++i) {
    exports.levelToScoreTable[i] = exports.levelToScoreTable[i - 1] + (40 / 9 * 1.06 ** (i - 1) * Math.min(31, i));
}
function levelToScore(level) {
    if (level >= 45)
        return exports.levelToScoreTable[44];
    if (level <= 0)
        return 0;
    return exports.levelToScoreTable[level - 1];
}
exports.levelToScore = levelToScore;
