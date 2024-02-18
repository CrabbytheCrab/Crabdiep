"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maxPlayerLevel = exports.devTokens = exports.defaultAccessLevel = exports.unbannableLevelMinimum = exports.doVerboseLogs = exports.devPasswordHash = exports.bossSpawningInterval = exports.spatialHashingCellSize = exports.magicNum = exports.clientLocation = exports.enableClient = exports.enableCommands = exports.apiLocation = exports.enableApi = exports.mode = exports.host = exports.writtenBufferChunkSize = exports.wssMaxMessageSize = exports.connectionsPerIp = exports.tps = exports.mspt = exports.serverPort = exports.buildHash = void 0;
exports.buildHash = "6f59094d60f98fafc14371671d3ff31ef4d75d9e";
exports.serverPort = parseInt(process.env.PORT || "8080");
exports.mspt = 40;
exports.tps = 1000 / exports.mspt;
exports.connectionsPerIp = 2;
exports.wssMaxMessageSize = 4096;
exports.writtenBufferChunkSize = Buffer.poolSize || 2048;
exports.host = process.env.SERVER_INFO || (process.env.NODE_ENV === "development" ? "localhost" : "");
exports.mode = process.env.NODE_ENV || "development";
exports.enableApi = true;
exports.apiLocation = "api";
exports.enableCommands = true;
exports.enableClient = true;
exports.clientLocation = "./client";
exports.magicNum = (function magicNum(build) {
    let char;
    for (var i = 0, seed = 1, res = 0, timer = 0; i < 40; i++) {
        char = parseInt(build[i], 16);
        res ^= ((char << ((seed & 1) << 2)) << (timer << 3));
        timer = (timer + 1) & 3;
        seed ^= +!(timer);
    }
    ;
    return res >>> 0;
})(exports.buildHash);
exports.spatialHashingCellSize = 7;
exports.bossSpawningInterval = 10 * 60 * exports.tps;
exports.devPasswordHash = "";
exports.doVerboseLogs = false;
exports.unbannableLevelMinimum = 3;
exports.defaultAccessLevel = 1;
exports.devTokens = {
    "*": exports.defaultAccessLevel
};
exports.maxPlayerLevel = 45;
