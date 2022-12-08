"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convo = new ArrayBuffer(4);
const u8 = new Uint8Array(convo);
const u16 = new Uint16Array(convo);
const i32 = new Int32Array(convo);
const u32 = new Uint32Array(convo);
const f32 = new Float32Array(convo);
const Decoder = new TextDecoder();
const endianSwap = (num) => ((num & 0xff) << 24) |
    ((num & 0xff00) << 8) |
    ((num >> 8) & 0xff00) |
    ((num >> 24) & 0xff);
class Reader {
    constructor(buf) {
        this.at = 0;
        this.buffer = new Uint8Array(buf instanceof ArrayBuffer ? buf : buf.buffer);
    }
    u8() {
        return this.buffer[this.at++];
    }
    u16() {
        u8.set(this.buffer.subarray(this.at, (this.at += 2)));
        return u16[0];
    }
    u32() {
        u8.set(this.buffer.subarray(this.at, (this.at += 4)));
        return u32[0];
    }
    vu() {
        let out = 0;
        let i = 0;
        while (this.buffer[this.at] & 0x80) {
            out |= (this.buffer[this.at++] & 0x7f) << i;
            i += 7;
        }
        out |= (this.buffer[this.at++] & 0x7f) << i;
        return out;
    }
    vi() {
        let out = this.vu();
        return (0 - (out & 1)) ^ (out >>> 1);
    }
    vf() {
        i32[0] = endianSwap(this.vi());
        return f32[0];
    }
    stringNT() {
        return Decoder.decode(this.buffer.subarray(this.at, (this.at = this.buffer.indexOf(0, this.at) + 1) - 1));
    }
    string(length = this.vu()) {
        return Decoder.decode(this.buffer.slice(this.at, (this.at += length)));
    }
    float() {
        u8.set(this.buffer.subarray(this.at, (this.at += 4)));
        return f32[0];
    }
}
exports.default = Reader;
