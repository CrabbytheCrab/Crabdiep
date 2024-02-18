"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Object_1 = require("../Object");
const util = require("../../util");
const Enums_1 = require("../../Const/Enums");
const Live_1 = require("../Live");
const TankBody_1 = require("../Tank/TankBody");
const Addons_1 = require("../Tank/Addons");
const AI_1 = require("../AI");
const AbstractShape_1 = require("../Shape/AbstractShape");
const Partical_1 = require("../Tank/Projectile/Partical");
const __1 = require("../..");
const Camera_1 = require("../../Native/Camera");
const AbstractBoss_1 = require("../Boss/AbstractBoss");
class BlackHole extends Object_1.default {
    constructor(game, team) {
        super(game);
        this.cameraEntity = this;
        this.reloadTime = 15;
        this.multiplierdirect = 1;
        this.team = team;
        this.part = 5;
        this.multiplier = 1;
        const { x, y } = this.game.arena.findSpawnLocation();
        this.positionData.values.x = x;
        this.positionData.values.y = y;
        this.viewRange = 180;
        this.inputs = new AI_1.Inputs();
        this.sizeFactor = this.physicsData.values.size / 50;
        this.styleData.zIndex = 2;
        this.styleData.flags |= 128;
        this.physicsData.values.size = 180;
        this.positionData.values.flags |= 1;
        this.physicsData.values.sides = 1;
        this.physicsData.flags |= 2;
        this.physicsData.pushFactor = -0.5;
        this.physicsData.values.absorbtionFactor = 0;
        this.lifetime = 2000;
        const rotator = new Object_1.default(game);
        if (rotator.physicsData.flags && 2)
            rotator.physicsData.flags ^= 2;
        rotator.physicsData.sides = 0;
        rotator.setParent(this);
        rotator.physicsData.values.size = this.physicsData.values.size;
        rotator.physicsData.values.absorbtionFactor = 0;
        rotator.relationsData.values.team = this;
        rotator.styleData.flags |= 16;
        rotator.styleData.values.color = 25;
        const tickStar = rotator.tick;
        rotator.tick = (tick) => {
            rotator.physicsData.size = ((this.physicsData.size * this.multiplier) - rotator.physicsData.size * 0.1);
            rotator.positionData.angle += 0.1;
            tickStar.call(rotator, tick);
        };
        const rotator2 = new Object_1.default(game);
        rotator2.setParent(this);
        rotator2.styleData.values.color = 25;
        rotator2.styleData.values.flags |= 64;
        rotator2.styleData.opacity = 0;
        const tickBase = rotator2.tick;
        rotator2.tick = (tick) => {
            rotator2.physicsData.size = this.physicsData.size;
            if (rotator2.physicsData.flags && 2)
                rotator2.physicsData.flags ^= 2;
            rotator2.physicsData.size = this.physicsData.size;
            rotator2.physicsData.sides = this.physicsData.sides;
            if (this.lifetime <= 620) {
                rotator2.styleData.opacity += 1 / 500;
            }
            tickBase.call(rotator2, tick);
        };
        const rotator4 = new Addons_1.GuardObject(this.game, this, 1, 3, 0, 0);
        rotator4.styleData.values.color = 22;
        rotator4.styleData.values.flags |= 64;
        rotator4.styleData.opacity = 0;
        const tickBase2 = rotator4.tick;
        rotator4.tick = (tick) => {
            if (rotator4.physicsData.flags && 2)
                rotator4.physicsData.flags ^= 2;
            tickBase2.call(rotator4, tick);
        };
        this.styleData.values.color = 22;
    }
    destroy(animate = true) {
        super.destroy(animate);
        this.physicsData.pushFactor = 200;
        const entities = this.findCollisions();
        for (let i = 0; i < entities.length; ++i) {
            const entity = entities[i];
            if (!(entity instanceof Live_1.default))
                continue;
            if (entity.physicsData.values.flags & 64)
                continue;
            if (!(entity.relationsData.values.owner === null || !(entity.relationsData.values.owner instanceof Object_1.default)))
                continue;
            if (entity instanceof TankBody_1.default) {
                if (!entity.definition.flags.isCelestial && entity.scoreData.score >= 146655) {
                    this.receiveKnockback(entities[i]);
                    entity.setTank(166);
                    entity.styleData.values.flags |= 4;
                    entity.relationsData.values.team = this.team;
                    entity.styleData.color = 11;
                    entity.damageReduction = 0.0;
                    entity.damageReduction = 0;
                    entity.cameraEntity.cameraData.spawnTick = this.game.tick;
                    for (let i = 0; i < Enums_1.StatCount; ++i)
                        entity.cameraEntity.cameraData.statLevels[i] = 0;
                    entity.cameraEntity.cameraData.statsAvailable = 45;
                    if (entity.cameraEntity instanceof Camera_1.default) {
                        entity.cameraEntity.cameraData.isCelestial = true;
                        __1.gamer.get("sanctuary").transferClient(entity.cameraEntity.client);
                    }
                }
                if (entity.definition.flags.isCelestial) {
                    this.receiveKnockback(entities[i]);
                    if (entity.cameraEntity instanceof Camera_1.default) {
                        entity.cameraEntity.cameraData.flags |= 4;
                        __1.gamer.get("sanctuary").transferClient(entity.cameraEntity.client);
                    }
                }
            }
        }
    }
    tick(tick) {
        super.tick(tick);
        this.part--;
        if (this.part <= 0) {
            let partical = new Partical_1.default(this.game, this, Math.random() * util.PI2);
            partical.styleData.zIndex = 1;
            partical.physicsData.size = 40 + (Math.random() * 30);
            partical.styleData.color = 25;
            partical.baseSpeed = partical.baseSpeed * (1 - (Math.random() * 0.4));
            partical.baseAccel = partical.baseAccel * (1 - (Math.random() * 0.25));
            partical.physicsData.sides = 1;
            this.part = 2;
        }
        this.lifetime--;
        if (this.lifetime <= 0) {
            this.destroy();
            for (let i = 0; i < 30 + (Math.random() * 20); i++) {
                let partical = new Partical_1.default(this.game, this, Math.random() * util.PI2);
                partical.styleData.zIndex = this.styleData.zIndex - 1;
                partical.physicsData.size = 50 + (Math.random() * 40);
                partical.styleData.color = 25;
                partical.baseSpeed = partical.baseSpeed * (1.3 - (Math.random() * 0.3));
                partical.baseAccel = partical.baseAccel * (1.3 - (Math.random() * 0.2));
                partical.physicsData.sides = 1;
            }
        }
        const entities = this.findCollisions();
        this.viewRange = this.physicsData.size;
        for (let i = 0; i < entities.length; ++i) {
            const entity = entities[i];
            if (!(entity instanceof Live_1.default))
                continue;
            if (entity instanceof AbstractShape_1.default || entity instanceof AbstractBoss_1.default) {
                let kbAngle;
                let diffY = this.positionData.values.y - entity.positionData.values.y;
                let diffX = this.positionData.values.x - entity.positionData.values.x;
                if (diffX === 0 && diffY === 0)
                    kbAngle = Math.random() * util.PI2;
                else {
                    kbAngle = Math.atan2(diffY, diffX);
                    entity.addAcceleration(kbAngle, -2);
                }
            }
            ;
            if (entity.physicsData.values.flags & 64)
                continue;
            if (!(entity.relationsData.values.owner === null || !(entity.relationsData.values.owner instanceof Object_1.default)))
                continue;
            if (entity instanceof TankBody_1.default) {
                if (entity.scoreData.score >= 146655) {
                }
                else {
                    let kbAngle;
                    let diffY = this.positionData.values.y - entity.positionData.values.y;
                    let diffX = this.positionData.values.x - entity.positionData.values.x;
                    if (diffX === 0 && diffY === 0)
                        kbAngle = Math.random() * util.PI2;
                    else {
                        kbAngle = Math.atan2(diffY, diffX);
                        entity.addAcceleration(kbAngle, -2);
                    }
                }
            }
        }
    }
}
exports.default = BlackHole;
