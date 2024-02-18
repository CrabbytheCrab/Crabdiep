"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamer = void 0;
const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");
const config = require("./config");
const util = require("./util");
const Game_1 = require("./Game");
const Auth_1 = require("./Auth");
const TankDefinitions_1 = require("./Const/TankDefinitions");
const Commands_1 = require("./Const/Commands");
const Enums_1 = require("./Const/Enums");
const PORT = config.serverPort;
const ENABLE_API = config.enableApi && config.apiLocation;
const ENABLE_CLIENT = config.enableClient && config.clientLocation && fs.existsSync(config.clientLocation);
if (ENABLE_API)
    util.log(`Rest API hosting is enabled and is now being hosted at /${config.apiLocation}`);
if (ENABLE_CLIENT)
    util.log(`Client hosting is enabled and is now being hosted from ${config.clientLocation}`);
const games = [];
const server = http.createServer((req, res) => {
    util.saveToVLog("Incoming request to " + req.url);
    res.setHeader("Server", "github.com/ABCxFF/diepcustom");
    if (ENABLE_API && req.url?.startsWith(`/${config.apiLocation}`)) {
        switch (req.url.slice(config.apiLocation.length + 1)) {
            case "/":
                res.writeHead(200);
                return res.end();
            case "/interactions":
                if (!Auth_1.default)
                    return;
                util.saveToVLog("Authentication attempt");
                return Auth_1.default.handleInteraction(req, res);
            case "/tanks":
                res.writeHead(200);
                return res.end(JSON.stringify(TankDefinitions_1.default));
            case "/servers":
                res.writeHead(200);
                return res.end(JSON.stringify(games.map(({ gamemode, name }) => ({ gamemode, name }))));
            case "/commands":
                res.writeHead(200);
                return res.end(JSON.stringify(config.enableCommands ? Object.values(Commands_1.commandDefinitions) : []));
            case "/colors":
                res.writeHead(200);
                return res.end(JSON.stringify(Enums_1.ColorsHexCode));
        }
    }
    if (ENABLE_CLIENT) {
        let file = null;
        let contentType = "text/html";
        switch (req.url) {
            case "/":
                file = config.clientLocation + "/index.html";
                contentType = "text/html";
                break;
            case "/loader.js":
                file = config.clientLocation + "/loader.js";
                contentType = "application/javascript";
                break;
            case "/input.js":
                file = config.clientLocation + "/input.js";
                contentType = "application/javascript";
                break;
            case "/dma.js":
                file = config.clientLocation + "/dma.js";
                contentType = "application/javascript";
                break;
            case "/config.js":
                file = config.clientLocation + "/config.js";
                contentType = "application/javascript";
                break;
        }
        res.setHeader("Content-Type", contentType + "; charset=utf-8");
        if (file && fs.existsSync(file)) {
            res.writeHead(200);
            return res.end(fs.readFileSync(file));
        }
        res.writeHead(404);
        return res.end(fs.readFileSync(config.clientLocation + "/404.html"));
    }
});
const wss = new WebSocket.Server({
    server,
    maxPayload: config.wssMaxMessageSize,
});
const endpointMatch = /\/game\/diepio-.+/;
wss.shouldHandle = function (request) {
    const url = (request.url || "/");
    if (url.length > 100)
        return false;
    return endpointMatch.test(url);
};
exports.gamer = new Map;
server.listen(PORT, () => {
    util.log(`Listening on port ${PORT}`);
    const ffa = new Game_1.default(wss, "ffa", "FFA");
    const bb = new Game_1.default(wss, "bossbash", "Boss Bash");
    const sbx = new Game_1.default(wss, "sandbox", "Sandbox");
    const ball = new Game_1.default(wss, "ball", "Ball");
    games.push(ffa, bb, ball, sbx);
    util.saveToLog("Servers up", "All servers booted up.", 0x37F554);
    util.log(0.3490658503988659 * 180 / Math.PI);
    util.log(0.6981317007977318 * 180 / Math.PI);
    util.log("Dumping endpoint -> gamemode routing table");
    for (const game of games)
        console.log("> " + `localhost:${config.serverPort}/game/diepio-${game.gamemode}`.padEnd(40, " ") + " -> " + game.name);
});
process.on("uncaughtException", (error) => {
    util.saveToLog("Uncaught Exception", '```\n' + error.stack + '\n```', 0xFF0000);
    throw error;
});
