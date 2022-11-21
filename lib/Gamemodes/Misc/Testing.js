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
const Arena_1 = require("../../Native/Arena");
const Manager_1 = require("../../Entity/Shape/Manager");
const TankBody_1 = require("../../Entity/Tank/TankBody");
const Camera_1 = require("../../Native/Camera");
const AI_1 = require("../../Entity/AI");
const DevTankDefinitions_1 = require("../../Const/DevTankDefinitions");
const FallenSpike_1 = require("../../Entity/Misc/Boss/FallenSpike");
const FallenOverlord_1 = require("../../Entity/Boss/FallenOverlord");
/**
 * Only spawns crashers
 */
class ZeroShapeManager extends Manager_1.default {
    get wantedShapes() {
        return 0;
    }
}
/**
 * Testing Arena
 */
class TestingArena extends Arena_1.default {
    constructor(game) {
        super(game);
        this.shapes = new ZeroShapeManager(this);
        this.updateBounds(4000, 4000);
        setTimeout(() => {
            new FallenOverlord_1.default(game);
            new FallenSpike_1.default(game);
        }, 5000);
        // const tank1 = this.spawnTestTank(Tank.Booster);
        // const tank2 = this.spawnTestTank(Tank.Annihilator);
        // tank1.inputs.mouse.x = - 2 * (tank1.position.x = 10000);
        // tank1.inputs.mouse.y = (tank1.position.y = -400);
        // tank1.setVelocity(0, 0);
        // tank2.inputs.mouse.x = 2 * (tank2.position.x = 10000);
        // tank2.inputs.mouse.y = (tank2.position.y = 400);
        // tank2.setVelocity(0, 0);
        // tank1.cameraEntity.camera.statLevels[Stat.Reload] = tank1.cameraEntity.camera.statLimits[Stat.Reload];
        // tank1.cameraEntity.camera.statLevels[Stat.MovementSpeed] = tank1.cameraEntity.camera.statLimits[Stat.MovementSpeed];
        // tank2.cameraEntity.camera.statLevels[Stat.Reload] = tank2.cameraEntity.camera.statLimits[Stat.Reload];
        // tank2.cameraEntity.camera.statLevels[Stat.MovementSpeed] = tank2.cameraEntity.camera.statLimits[Stat.MovementSpeed];   
        // setTimeout(() => {
        //     tank1.inputs.movement.magnitude = 1;
        //     tank1.inputs.movement.angle = Math.PI;
        //     tank1.inputs.movement.set = () => {};
        //     tank1.inputs.flags |= InputFlags.leftclick;
        //     tank2.inputs.movement.magnitude = 1;
        //     tank2.inputs.movement.angle = Math.PI;
        //     tank2.inputs.movement.set = () => {};
        //     tank2.inputs.flags |= InputFlags.leftclick;
        // }, 10000);
    }
    spawnPlayer(tank, client) {
        tank.setTank(DevTankDefinitions_1.DevTank.Spectator);
    }
    spawnTestTank(id) {
        const testTank = new TankBody_1.default(this.game, new Camera_1.CameraEntity(this.game), new AI_1.Inputs());
        testTank.cameraEntity.camera.player = testTank;
        testTank.setTank(id);
        testTank.cameraEntity.setLevel(45);
        return testTank;
    }
}
exports.default = TestingArena;
