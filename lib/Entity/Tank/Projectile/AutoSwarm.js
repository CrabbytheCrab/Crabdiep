"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoSwarm = void 0;
const AI_1 = require("../../AI");
const AutoTurret_1 = require("../AutoTurret");
const Swarm_1 = require("./Swarm");
class AutoSwarm extends Swarm_1.Swarm {
    constructor(barrel, tank, tankDefinition, shootAngle) {
        super(barrel, tank, tankDefinition, shootAngle);
        this.inputs = new AI_1.Inputs();
        this.reloadTime = 15;
        this.cameraEntity = tank.cameraEntity;
        this.sizeFactor = this.physicsData.values.size / 50;
        const atuo = new AutoTurret_1.default(this, {
            angle: 0,
            offset: 0,
            size: 65,
            width: 35,
            delay: 0.01,
            reload: 0.75,
            recoil: 0,
            isTrapezoid: false,
            trapezoidDirection: 0,
            addon: null,
            bullet: {
                type: "bullet",
                sizeRatio: 1,
                health: 0.6,
                damage: 0.1,
                speed: 2,
                scatterRate: 1,
                lifeLength: 0.75,
                absorbtionFactor: 0.1
            }
        });
        atuo.baseSize *= 1.25;
        atuo.ai.viewRange = 1200;
        atuo.positionData.values.angle = shootAngle;
    }
}
exports.AutoSwarm = AutoSwarm;
