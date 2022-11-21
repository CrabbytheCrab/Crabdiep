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
exports.origin = exports.devTokens = exports.unbannableLevelMinimum = exports.doVerboseLogs = exports.devPasswordHash = exports.bossSpawningInterval = exports.spatialHashingCellSize = exports.magicNum = exports.clientLocation = exports.enableClient = exports.apiLocation = exports.enableApi = exports.mode = exports.host = exports.writtenBufferChunkSize = exports.wssMaxMessageSize = exports.connectionsPerIp = exports.tps = exports.mspt = exports.serverPort = exports.buildHash = void 0;
/** The build supported by the server. */
exports.buildHash = "6f59094d60f98fafc14371671d3ff31ef4d75d9e";
/** The port the server is hosting its game server on. */
exports.serverPort = parseInt(process.env.PORT || "8080");
/** Milliseconds per tick in the game. */
exports.mspt = 40;
/** Ticks per second in the game */
exports.tps = 1000 / exports.mspt;
/** Max connections per ip. -1 = no limit */
exports.connectionsPerIp = -1;
/** Max incoming packet size (HARD LIMIT), not the max read / write size */
exports.wssMaxMessageSize = 4096; // 4 kb
/** Output Chunk Size for the Writer (during resize) */
exports.writtenBufferChunkSize = Buffer.poolSize || 2048;
/** Host id to be sent to client. */
exports.host = process.env.SERVER_INFO || (process.env.NODE_ENV === "development" ? "localhost" : "");
/** Runtime mode. */
exports.mode = process.env.NODE_ENV || "development";
/** Is hosting a rest api */
exports.enableApi = true;
/** Rest API location (root of all other endpoints), ignored if enableApi is false */
exports.apiLocation = "api";
/** Is hosting a client */
exports.enableClient = true;
/** Client files location, ignored if enableClient is false, path from the root dir of the project */
exports.clientLocation = "./client";
/** Magic number used for tank xor and stat xor. */
exports.magicNum = (function magicNum(build) {
    let char;
    for (var i = 0, seed = 1, res = 0, timer = 0; i < 40; i++) {
        char = parseInt(build[i], 16);
        res ^= ((char << ((seed & 1) << 2)) << (timer << 3));
        timer = (timer + 1) & 3;
        seed ^= +!(timer);
    }
    ;
    return res >>> 0; // unsigned
})(exports.buildHash);
/** Spatial Hashing CellSize for physics. Zero = quadtree. */
exports.spatialHashingCellSize = 7;
/** Amount of TICKs before the next boss spawn attempt */
exports.bossSpawningInterval = 45 * 60 * exports.tps;
/** Hashed (sha256) dev password */
exports.devPasswordHash = process.env.DEV_PASSWORD_HASH;
/** Whether or not Verbose Logs should be logged */
exports.doVerboseLogs = false;
// Every access level, including and above this one is unbannable via client.ban()
exports.unbannableLevelMinimum = 3 /* AccessLevel.FullAccess */;
/** The developer tokens by role (UNNECESSARY UNLESS DISCORD INTEGRATION) */
exports.devTokens = {
    "*": 2 /* AccessLevel.BetaAccess */
};
/** Should always be set to the url (UNNECESSARY UNLESS DISCORD INTEGRATION) */
exports.origin = process.env.ORIGIN_URL || "http://localhost:8080";
