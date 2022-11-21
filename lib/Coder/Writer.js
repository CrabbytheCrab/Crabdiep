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
const config_1 = require("../config");
/**
 * UNDOCUMENTED FILE
 **/
const convo = new ArrayBuffer(4);
const i32 = new Int32Array(convo);
const f32 = new Float32Array(convo);
const Encoder = new TextEncoder();
const endianSwap = (num) => ((num & 0xff) << 24) |
    ((num & 0xff00) << 8) |
    ((num >> 8) & 0xff00) |
    ((num >> 24) & 0xff);
class Writer {
    constructor() {
        this._at = 0;
    }
    get at() {
        return this._at;
    }
    set at(v) {
        this._at = v;
        if (Writer.OUTPUT_BUFFER.length <= this._at + 5) {
            const newBuffer = Buffer.alloc(Writer.OUTPUT_BUFFER.length + config_1.writtenBufferChunkSize);
            newBuffer.set(Writer.OUTPUT_BUFFER, 0);
            Writer.OUTPUT_BUFFER = newBuffer;
        }
    }
    u8(val) {
        Writer.OUTPUT_BUFFER.writeUInt8(val >>> 0 & 0xFF, this.at);
        this.at += 1;
        return this;
    }
    u16(val) {
        Writer.OUTPUT_BUFFER.writeUint16LE(val >>> 0 & 0xFFFF, this.at);
        this.at += 2;
        return this;
    }
    u32(val) {
        Writer.OUTPUT_BUFFER.writeUint32LE(val >>> 0, this.at);
        this.at += 4;
        return this;
    }
    float(val) {
        Writer.OUTPUT_BUFFER.writeFloatLE(val, this.at);
        this.at += 4;
        return this;
    }
    vf(val) {
        f32[0] = val;
        return this.vi(endianSwap(i32[0]));
    }
    vu(val) {
        val |= 0;
        do {
            let part = val;
            val >>>= 7;
            if (val)
                part |= 0x80;
            Writer.OUTPUT_BUFFER.writeUint8(part >>> 0 & 0xFF, this.at);
            this.at += 1;
        } while (val);
        // OUTPUT_BUFFER.set(buf.subarray(0, at), (this.at += at) - at);
        return this;
    }
    vi(val) {
        val |= 0;
        return this.vu((0 - (val < 0 ? 1 : 0)) ^ (val << 1)); // varsint trick
    }
    bytes(buffer) {
        Writer.OUTPUT_BUFFER.set(buffer, this.at);
        this.at += buffer.byteLength;
        return this;
    }
    raw(...data) {
        Writer.OUTPUT_BUFFER.set(data, this.at);
        this.at += data.length;
        return this;
    }
    radians(radians) {
        return this.vi(radians * 64);
    }
    degrees(degrees) {
        degrees *= Math.PI / 180;
        return this.vi(degrees * 64);
    }
    stringNT(str) {
        const bytes = Encoder.encode(str + "\x00");
        // TODO(ABC): See line 69 Client.ts
        // rn it sends string out in bytes, send it all at once without messing up the chunking
        for (let i = 0; i < bytes.byteLength; ++i) {
            Writer.OUTPUT_BUFFER[this.at] = bytes[i];
            this.at += 1;
        }
        return this;
    }
    entid(entity) {
        if (!entity || entity.hash === 0)
            return this.u8(0);
        return this.vu(entity.hash).vu(entity.id);
    }
    write(slice = false) {
        if (slice)
            return Writer.OUTPUT_BUFFER.slice(0, this.at);
        return Writer.OUTPUT_BUFFER.subarray(0, this.at);
    }
}
exports.default = Writer;
// TODO(ABC):
// Code a compressor (The previous was not OOP and used lz4js code)
// If this code gets out of bounds (only happens if you play around with dev too much), the server crashes [better than out of bounds r/w].
// 
// TEMP FIX - 2022/11/11:
//   OUTPUT_BUFFER now gets resized if running out of space for the packet
//
// TEMP FIX 2 - 2022/11/13:
//   OUTPUT_BUFFER gets sent out in chunks (see Client.ts for more info)
Writer.OUTPUT_BUFFER = Buffer.alloc(50);
