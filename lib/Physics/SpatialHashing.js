"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SpatialHashing {
    constructor(cellSize) {
        this.hashMap = new Map();
        this.queryId = 0;
        this.cellSize = cellSize;
    }
    insertEntity(entity) {
        const { sides, size, width } = entity.physicsData.values;
        const { x, y } = entity.positionData.values;
        const isLine = sides === 2;
        const radiW = isLine ? size / 2 : size;
        const radiH = isLine ? width / 2 : size;
        const topX = (x - radiW) >> this.cellSize;
        const topY = (y - radiH) >> this.cellSize;
        const bottomX = (x + radiW) >> this.cellSize;
        const bottomY = (y + radiH) >> this.cellSize;
        for (let y = topY; y <= bottomY; ++y) {
            for (let x = topX; x <= bottomX; ++x) {
                const key = x | (y << 10);
                if (!this.hashMap.has(key)) {
                    this.hashMap.set(key, []);
                }
                this.hashMap.get(key).push(entity);
            }
        }
    }
    retrieve(x, y, width, height) {
        const result = [];
        const startX = (x - width) >> this.cellSize;
        const startY = (y - height) >> this.cellSize;
        const endX = ((x + width) >> this.cellSize);
        const endY = ((y + height) >> this.cellSize);
        for (let y = startY; y <= endY; ++y) {
            for (let x = startX; x <= endX; ++x) {
                const key = x | (y << 10);
                const cell = this.hashMap.get(key);
                if (cell == null)
                    continue;
                for (let i = 0; i < cell.length; ++i) {
                    if (cell[i]['_queryId'] != this.queryId) {
                        cell[i]['_queryId'] = this.queryId;
                        if (cell[i].hash !== 0)
                            result.push(cell[i]);
                    }
                }
            }
        }
        this.queryId = (this.queryId + 1) >>> 0;
        return result;
    }
    retrieveEntitiesByEntity(entity) {
        const { sides, size, width } = entity.physicsData.values;
        const { x, y } = entity.positionData;
        const isLine = sides === 2;
        const w = isLine ? size / 2 : size;
        const h = isLine ? width / 2 : size;
        return this.retrieve(x, y, w, h);
    }
    reset() {
        this.hashMap = new Map();
    }
}
exports.default = SpatialHashing;
