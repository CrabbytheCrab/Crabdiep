"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
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
        return this;
    }
    vi(val) {
        val |= 0;
        return this.vu((0 - (val < 0 ? 1 : 0)) ^ (val << 1));
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
    float64Precision(float) {
        return this.vi(float * 64);
    }
    degrees(degrees) {
        degrees *= Math.PI / 180;
        return this.vi(degrees * 64);
    }
    stringNT(str) {
        const bytes = Encoder.encode(str + "\x00");
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
Writer.OUTPUT_BUFFER = Buffer.alloc(50);
