"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Arena_1 = require("../Native/Arena");
const MazeWall_1 = require("../Entity/Misc/MazeWall");
const CELL_SIZE = 635;
const GRID_SIZE = 40;
const ARENA_SIZE = CELL_SIZE * GRID_SIZE;
const SEED_AMOUNT = Math.floor(Math.random() * 30) + 30;
const TURN_CHANCE = 0.15;
const BRANCH_CHANCE = 0.1;
const TERMINATION_CHANCE = 0.15;
class MazeArena extends Arena_1.default {
    constructor(a) {
        super(a);
        this.SEEDS = [];
        this.WALLS = [];
        this.MAZE = new Uint8Array(GRID_SIZE * GRID_SIZE);
        this.updateBounds(ARENA_SIZE, ARENA_SIZE);
        this._buildMaze();
    }
    _buildWallFromGridCoord(gridX, gridY, gridW, gridH) {
        const scaledW = gridW * CELL_SIZE;
        const scaledH = gridH * CELL_SIZE;
        const scaledX = gridX * CELL_SIZE - (gridW + ARENA_SIZE) / 2 + (scaledW / 2);
        const scaledY = gridY * CELL_SIZE - (gridH + ARENA_SIZE) / 2 + (scaledH / 2);
        new MazeWall_1.default(this.game, scaledX, scaledY, scaledH, scaledW);
    }
    _get(x, y) {
        return this.MAZE[y * GRID_SIZE + x];
    }
    _set(x, y, value) {
        return this.MAZE[y * GRID_SIZE + x] = value;
    }
    _mapValues() {
        const values = Array(this.MAZE.length);
        for (let i = 0; i < this.MAZE.length; ++i)
            values[i] = [i % GRID_SIZE, Math.floor(i / GRID_SIZE), this.MAZE[i]];
        return values;
    }
    _buildMaze() {
        for (let i = 0; i < 10000; i++) {
            if (this.SEEDS.length >= SEED_AMOUNT)
                break;
            let seed = {
                x: Math.floor((Math.random() * GRID_SIZE) - 1),
                y: Math.floor((Math.random() * GRID_SIZE) - 1),
            };
            if (this.SEEDS.some(a => (Math.abs(seed.x - a.x) <= 3 && Math.abs(seed.y - a.y) <= 3)))
                continue;
            if (seed.x <= 0 || seed.y <= 0 || seed.x >= GRID_SIZE - 1 || seed.y >= GRID_SIZE - 1)
                continue;
            this.SEEDS.push(seed);
            this._set(seed.x, seed.y, 1);
        }
        const direction = [
            [-1, 0], [1, 0],
            [0, -1], [0, 1],
        ];
        for (let seed of this.SEEDS) {
            let dir = direction[Math.floor(Math.random() * 4)];
            let termination = 1;
            while (termination >= TERMINATION_CHANCE) {
                termination = Math.random();
                let [x, y] = dir;
                seed.x += x;
                seed.y += y;
                if (seed.x <= 0 || seed.y <= 0 || seed.x >= GRID_SIZE - 1 || seed.y >= GRID_SIZE - 1)
                    break;
                this._set(seed.x, seed.y, 1);
                if (Math.random() <= BRANCH_CHANCE) {
                    if (this.SEEDS.length > 75)
                        continue;
                    let [xx, yy] = direction.filter(a => a.every((b, c) => b !== dir[c]))[Math.floor(Math.random() * 2)];
                    let newSeed = {
                        x: seed.x + xx,
                        y: seed.y + yy,
                    };
                    this.SEEDS.push(newSeed);
                    this._set(seed.x, seed.y, 1);
                }
                else if (Math.random() <= TURN_CHANCE) {
                    dir = direction.filter(a => a.every((b, c) => b !== dir[c]))[Math.floor(Math.random() * 2)];
                }
            }
        }
        for (let i = 0; i < 10; i++) {
            let seed = {
                x: Math.floor((Math.random() * GRID_SIZE) - 1),
                y: Math.floor((Math.random() * GRID_SIZE) - 1),
            };
            if (this._mapValues().some(([x, y, r]) => r === 1 && (Math.abs(seed.x - x) <= 3 && Math.abs(seed.y - y) <= 3)))
                continue;
            if (seed.x <= 0 || seed.y <= 0 || seed.x >= GRID_SIZE - 1 || seed.y >= GRID_SIZE - 1)
                continue;
            this._set(seed.x, seed.y, 1);
        }
        let queue = [[0, 0]];
        this._set(0, 0, 2);
        let checkedIndices = new Set([0]);
        for (let i = 0; i < 3000 && queue.length > 0; i++) {
            let next = queue.shift();
            if (next == null)
                break;
            let [x, y] = next;
            for (let [nx, ny] of [
                [x - 1, y],
                [x + 1, y],
                [x, y - 1],
                [x, y + 1],
            ]) {
                if (this._get(nx, ny) !== 0)
                    continue;
                let i = ny * GRID_SIZE + nx;
                if (checkedIndices.has(i))
                    continue;
                checkedIndices.add(i);
                queue.push([nx, ny]);
                this._set(nx, ny, 2);
            }
        }
        for (let x = 0; x < GRID_SIZE; x++) {
            for (let y = 0; y < GRID_SIZE; y++) {
                if (this._get(x, y) === 2)
                    continue;
                let chunk = { x, y, width: 0, height: 1 };
                while (this._get(x + chunk.width, y) !== 2) {
                    this._set(x + chunk.width, y, 2);
                    chunk.width++;
                }
                outer: while (true) {
                    for (let i = 0; i < chunk.width; i++)
                        if (this._get(x + i, y + chunk.height) === 2)
                            break outer;
                    for (let i = 0; i < chunk.width; i++)
                        this._set(x + i, y + chunk.height, 2);
                    chunk.height++;
                }
                this.WALLS.push(chunk);
            }
        }
        for (let { x, y, width, height } of this.WALLS)
            this._buildWallFromGridCoord(x, y, width, height);
    }
}
exports.default = MazeArena;
