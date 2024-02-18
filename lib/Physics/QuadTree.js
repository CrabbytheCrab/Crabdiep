"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QuadTreeNode {
    constructor(x, y, radiW, radiH, level) {
        this.x = 0;
        this.y = 0;
        this.radiW = 0;
        this.radiH = 0;
        this.level = 0;
        this.objects = [];
        this.topLeft = null;
        this.topRight = null;
        this.bottomLeft = null;
        this.bottomRight = null;
        this.x = x;
        this.y = y;
        this.radiW = radiW;
        this.radiH = radiH;
        this.level = level;
    }
    _insert(object) {
        if (this.topLeft) {
            const top = object.y - object.radiH < this.y, bottom = object.y + object.radiH > this.y, left = object.x - object.radiW < this.x, right = object.x + object.radiW > this.x;
            if (top && left)
                this.topLeft._insert(object);
            if (top && right)
                this.topRight._insert(object);
            if (bottom && left)
                this.bottomLeft._insert(object);
            if (bottom && right)
                this.bottomRight._insert(object);
            return;
        }
        this.objects[this.objects.length] = object;
        if (this.objects.length === 5 && this.level <= 9) {
            const halfW = this.radiW / 2, halfH = this.radiH / 2, level = this.level + 1;
            this.topLeft = new QuadTreeNode(this.x - halfW, this.y - halfH, halfW, halfH, level);
            this.topRight = new QuadTreeNode(this.x + halfW, this.y - halfH, halfW, halfH, level);
            this.bottomLeft = new QuadTreeNode(this.x - halfW, this.y + halfH, halfW, halfH, level);
            this.bottomRight = new QuadTreeNode(this.x + halfW, this.y + halfH, halfW, halfH, level);
            var top, bottom, left, right;
            top = this.objects[0].y - this.objects[0].radiH < this.y;
            bottom = this.objects[0].y + this.objects[0].radiH > this.y;
            left = this.objects[0].x - this.objects[0].radiW < this.x;
            right = this.objects[0].x + this.objects[0].radiW > this.x;
            if (top && left)
                this.topLeft._insert(this.objects[0]);
            if (top && right)
                this.topRight._insert(this.objects[0]);
            if (bottom && left)
                this.bottomLeft._insert(this.objects[0]);
            if (bottom && right)
                this.bottomRight._insert(this.objects[0]);
            top = this.objects[1].y - this.objects[1].radiH < this.y;
            bottom = this.objects[1].y + this.objects[1].radiH > this.y;
            left = this.objects[1].x - this.objects[1].radiW < this.x;
            right = this.objects[1].x + this.objects[1].radiW > this.x;
            if (top && left)
                this.topLeft._insert(this.objects[1]);
            if (top && right)
                this.topRight._insert(this.objects[1]);
            if (bottom && left)
                this.bottomLeft._insert(this.objects[1]);
            if (bottom && right)
                this.bottomRight._insert(this.objects[1]);
            top = this.objects[2].y - this.objects[2].radiH < this.y;
            bottom = this.objects[2].y + this.objects[2].radiH > this.y;
            left = this.objects[2].x - this.objects[2].radiW < this.x;
            right = this.objects[2].x + this.objects[2].radiW > this.x;
            if (top && left)
                this.topLeft._insert(this.objects[2]);
            if (top && right)
                this.topRight._insert(this.objects[2]);
            if (bottom && left)
                this.bottomLeft._insert(this.objects[2]);
            if (bottom && right)
                this.bottomRight._insert(this.objects[2]);
            top = this.objects[3].y - this.objects[3].radiH < this.y;
            bottom = this.objects[3].y + this.objects[3].radiH > this.y;
            left = this.objects[3].x - this.objects[3].radiW < this.x;
            right = this.objects[3].x + this.objects[3].radiW > this.x;
            if (top && left)
                this.topLeft._insert(this.objects[3]);
            if (top && right)
                this.topRight._insert(this.objects[3]);
            if (bottom && left)
                this.bottomLeft._insert(this.objects[3]);
            if (bottom && right)
                this.bottomRight._insert(this.objects[3]);
            top = this.objects[4].y - this.objects[4].radiH < this.y;
            bottom = this.objects[4].y + this.objects[4].radiH > this.y;
            left = this.objects[4].x - this.objects[4].radiW < this.x;
            right = this.objects[4].x + this.objects[4].radiW > this.x;
            if (top && left)
                this.topLeft._insert(this.objects[4]);
            if (top && right)
                this.topRight._insert(this.objects[4]);
            if (bottom && left)
                this.bottomLeft._insert(this.objects[4]);
            if (bottom && right)
                this.bottomRight._insert(this.objects[4]);
        }
    }
    _retrieve(x, y, radiW, radiH) {
        if (this.topLeft) {
            let out = [];
            const top = y - radiH < this.y, bottom = y + radiH > this.y, left = x - radiW < this.x, right = x + radiW > this.x;
            if (top && left)
                out = out.concat(this.topLeft._retrieve(x, y, radiW, radiH));
            if (top && right)
                out = out.concat(this.topRight._retrieve(x, y, radiW, radiH));
            if (bottom && left)
                out = out.concat(this.bottomLeft._retrieve(x, y, radiW, radiH));
            if (bottom && right)
                out = out.concat(this.bottomRight._retrieve(x, y, radiW, radiH));
            return out;
        }
        else
            return this.objects;
    }
}
class DiepQuadTree extends QuadTreeNode {
    constructor(radiW, radiH) {
        super(0, 0, radiW, radiH, 0);
    }
    insertEntity(entity) {
        this._insert({
            content: entity,
            x: entity.positionData.values.x,
            y: entity.positionData.values.y,
            radiW: entity.physicsData.values.sides === 2 ? entity.physicsData.values.size / 2 : entity.physicsData.values.size,
            radiH: entity.physicsData.values.sides === 2 ? entity.physicsData.values.width / 2 : entity.physicsData.values.size,
        });
    }
    retrieve(x, y, radiW, radiH) {
        const ranges = this._retrieve(x, y, radiW, radiH);
        const entities = [];
        for (let i = 0; i < ranges.length; ++i) {
            if (ranges[i].content.hash !== 0 && !entities.includes(ranges[i].content))
                entities.push(ranges[i].content);
        }
        return entities;
    }
    retrieveEntitiesByEntity(entity) {
        return this.retrieve(entity.positionData.values.x, entity.positionData.values.y, entity.physicsData.values.sides === 2 ? entity.physicsData.values.size / 2 : entity.physicsData.values.size, entity.physicsData.values.sides === 2 ? entity.physicsData.values.width / 2 : entity.physicsData.values.size);
    }
    reset(bottomY, rightX) {
        this.bottomRight = this.bottomLeft = this.topLeft = this.topRight = null;
        this.radiW = rightX;
        this.objects = [];
        this.radiH = bottomY;
    }
}
exports.default = DiepQuadTree;
