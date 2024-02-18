"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveToVLog = exports.saveToLog = exports.normalizeAngle = exports.PI2 = exports.constrain = exports.removeFast = exports.inspectLog = exports.warn = exports.log = void 0;
const chalk = require("chalk");
const util_1 = require("util");
const config_1 = require("./config");
const log = (...args) => {
    console.log(`[${Date().split(" ")[4]}]`, ...args);
};
exports.log = log;
const warn = (...args) => {
    args = args.map(s => typeof s === "string" ? chalk.yellow(s) : s);
    console.log(chalk.yellow(`[${Date().split(" ")[4]}] WARNING: `), ...args);
};
exports.warn = warn;
const inspectLog = (object, c = 14) => {
    console.log((0, util_1.inspect)(object, false, c, true));
};
exports.inspectLog = inspectLog;
const removeFast = (array, index) => {
    if (index < 0 || index >= array.length)
        throw new RangeError("Index out of range. In `removeFast`");
    if (index === array.length - 1)
        array.pop();
    else
        array[index] = array.pop();
};
exports.removeFast = removeFast;
const constrain = (value, min, max) => {
    return Math.max(min, Math.min(max, value));
};
exports.constrain = constrain;
exports.PI2 = Math.PI * 2;
const normalizeAngle = (angle) => {
    return ((angle % exports.PI2) + exports.PI2) % exports.PI2;
};
exports.normalizeAngle = normalizeAngle;
const saveToLog = (title, description, color) => {
    console.log("[!] " + title + " (#" + color.toString(16).padStart(6, "0") + ")\n :: " + description);
};
exports.saveToLog = saveToLog;
const saveToVLog = (text) => {
    if (config_1.doVerboseLogs)
        console.log("[v] " + text);
};
exports.saveToVLog = saveToVLog;
