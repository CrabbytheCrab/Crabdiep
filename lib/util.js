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
exports.saveToVLog = exports.saveToLog = exports.constrain = exports.removeFast = exports.inspectLog = exports.warn = exports.log = void 0;
const chalk = require("chalk");
const util_1 = require("util");
const config_1 = require("./config");
/** Logs data prefixed with the Date. */
const log = (...args) => {
    console.log(`[${Date().split(" ")[4]}]`, ...args);
};
exports.log = log;
/** Logs data prefixed with the Date in a yellow format. */
const warn = (...args) => {
    args = args.map(s => typeof s === "string" ? chalk.yellow(s) : s);
    console.log(chalk.yellow(`[${Date().split(" ")[4]}] WARNING: `), ...args);
};
exports.warn = warn;
/** Logs a raw object. */
const inspectLog = (object, c = 14) => {
    console.log((0, util_1.inspect)(object, false, c, true));
};
exports.inspectLog = inspectLog;
/**
 * Removes an element from an array by index quickly.
 * Unsorted removal.
 */
const removeFast = (array, index) => {
    if (index < 0 || index >= array.length)
        throw new RangeError("Index out of range. In `removeFast`");
    if (index === array.length - 1)
        array.pop();
    else
        array[index] = array.pop();
};
exports.removeFast = removeFast;
/**
 * Contrains a value between bounds
 */
const constrain = (value, min, max) => {
    return Math.max(min, Math.min(max, value));
};
exports.constrain = constrain;
/**
 * Logs - Used to have a webhook log here
 */
const saveToLog = (title, description, color) => {
    console.log("[!] " + title + " (#" + color.toString(16).padStart(6, "0") + ")\n :: " + description);
};
exports.saveToLog = saveToLog;
/**
 * Verbose log (if config.doVerboseLogs is set, it will log)
 *  - Used to have a webhook log here
 */
const saveToVLog = (text) => {
    if (config_1.doVerboseLogs)
        console.log("[v] " + text);
};
exports.saveToVLog = saveToVLog;
