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

import { PI2 } from "../util";
import DevTankDefinitions, { DevTank } from "./DevTankDefinitions";
import { Tank, Color } from "./Enums";

/** The types of post addons that exist in the game, by their id. */
export type postAddonId = "chainer"|"microsmasher"|"dompronounced" | "auto5"| "sporn" | "vampire"| "autovamp"|"vampsmasher"|"autoauto3" |"cuck" | "spinner"| "chasm"| "void"|"comet"|"abyss"|"auto3" | "overdrive"| "psiEye" | "autosmasher" | "spike" | "pronounced"  | "rammer"| "bumper"|"smasher" | "landmine" |"autoturret3"| "autoturret"  | "joint3"  | "weirdspike" | "auto2" | "auto7" | "autorocket" | "spiesk" | "saw" | "megasmasher" | "mega3" | "stalker3" | "auto4" | "bigautoturret"| "droneturret";

/** The types of post addons that exist in the game, by their id. */
export type preAddonId = "dombase" | "launcher"| "launcheralt" | "glider" | "launchertall"| "pronounced2"|"laucher2"| "launchersmall";
/** A joint list of all post addon ids and pre addon ids. */
export type addonId = preAddonId | postAddonId;

/** The types of projectiles in the game */
export type projectileId = "abovebullet"|"pulserocket"|"pulsar"|"bullet"| "block"| "streambullet"|"orbit2"| "orbit3" |"leach"|"conglom" |"shotgun4" | "shotgun3" | "shotgun9" | "shotgun20" |"shotgun4blunt" |"autobullet"|"autorocket"| "grower"| "snake"|"dronenorep" |"bouncer" |"homingrocket" | "tank" |"orbitrocket"|"homing" |"explosion"| "trapspinner"|"orbittrap" | "mine" |"bombdrone"|"striker"| "drone" | "autoswarm" |"trap"| "pentadrone"  |  "autodrone"  |"necrotriangledrone" | "necropentadrone" | "necrodrone" | "wepnecrodrone"|"minion" | "spinner" | "spinner4" | "megaspinner" | "skimmer" | "rocket" | "swarm" | "flame" | "wall" | "croc" | "launrocket" | "autotrap"| "domminion" | "megaminion" | "miniminion" | "boomerang" | "hive" | "blunt" | "blunttrap" | "orbit";

/** The types of barrel addons that exist in the game */
export type barrelAddonId = "trapLauncher"|"autoLauncher"| "growLauncher" |"bounceLauncher"|"blockLauncher"| "NecLauncher"| "mineLauncher"  | "stickyLauncher" |"reversetrap"|"machineMineLauncher"| "minionLauncher" | "engitrapLauncher" | "swarmLauncher" | "machineTrapLauncher" | "engimachinetrapLauncher";

/** Increase in opacity when taking damage. */
export const visibilityRateDamage = 0.2;

/**
 * Format that the game stores bullet definitions in its memory.
 */
export interface BulletDefinition {
    /** The type of the bullet that the barrel shoots. */
    type: projectileId;
    /** Size of the bullet shot out of the barrel in relation to the barrel's size. */
    sizeRatio: number;
    /** Used to calculate the health of the bullet that the barrel shoots. */
    health: number;
    /** Used to calculate the damage of the bullet that the barrel shoots. */
    damage: number;
    /** Used to calculate the speed of the bullet that the barrel shoots. */
    speed: number;
    /** Used to calculate the scattering rate / spread of the bullets. */
    scatterRate: number;
    /** Used to calculate the life length of a bullet that the barrel shoots. */
    lifeLength: number;
    /** Knockback factor field of the bullet */
    absorbtionFactor: number;
    /** Projectile color - by default this is set to parent's body color. */
    color?: Color;
    /** Overrides number of sides for projectile. */
    sides?: number;
}

/**
 * Format that the game stores barrel definitions in its memory.
 */
export interface BarrelDefinition {
    /** The angle that the barrel is rotated towards, from the tank's body.  */
    angle: number;
    /** The x offset of the barrel (think of Twin's barrels for example) at base radius (50).  */
    offset: number;
    /** The y offset of the barrel (distance from the tanks main body) at base radius (50). Will have no effect on clientside tankrendering.*/
    distance?: number;
    /** The size of the barrel. Think of Sniper, the longer side is the size.  */
    size: number;
    /** The width of the barrel. Think of Sniper, the shorter side is the width. Width is used to determine bullet size */
    width: number;
    /** Delay between firing cycle. Think of Octo: half of the barrels have 0 delay, and the other half have 0.5 delay.  */
    delay: number;
    /** Used to calculate the reload of a barrel. */
    reload: number;
    /** Used to calculate the recoil of a barrel's shot. */
    recoil: number;
    /** Example: Machine Gun's barrel is a trapezoid. */
    isTrapezoid: boolean;
    /** Direction that the trapezoid is facing. Machine Gun's `trapezoidalDirection` is `0`, and Stalker's is `π`. */
    trapezoidDirection: number;
    /** Barrel addon. As of now only the trapper addon exists. */
    addon: barrelAddonId | null;
    /** The maximum numbers of drones the barrel can spawn - only present if `bullet.type` === 'drone'. */
    droneCount?: number;
    /** Whether or not the drones are controllable - only present if `bullet.type` === 'drone'. */
    canControlDrones?: boolean;
    megaturret?: boolean;
    inverseFire?: boolean;
    bulletdie?: boolean;
    invisibile?: boolean;
    /** Whether or not the barrel should always shoot (Trapper Dominator, Defender). */
    forceFire?: boolean;
    /** Barrel color - by default this is set to the 'Barrel' color id. */
    color?: Color;
    /** The definition of the bullet that is shot from the barrel. */
    bullet: BulletDefinition;

}
/**
 * Format that the game stores stat definitions in its memory.
 */
export interface StatDefinition {
    /** The name of the stat. */
    name: string;
    /** The stat level limit. */
    max: number;
}
/**
 * Format that the game stores tank definitions in its memory.
 */
export interface TankDefinition {
    /** The id of the tank. */
    id: Tank | DevTank;
    /** The name of the tank. */
    name: string;
    /** If not empty, the client is sent a notification with this message when it upgrades to this tank. */
    upgradeMessage: string;
    /** The levels required to upgrade to this tank. */
    levelRequirement: number;    /** The tanks this tank can upgrade to. */
    upgrades: (Tank | DevTank)[];
    /** Boolean flags about the tank. */
    flags: {
        /** If the tank can go invisible. */
        invisibility: boolean;
        /** If the tank has a Predator-like zoom ability */
        zoomAbility: boolean;
        /** If the tank can claim squares by killing them (necro) */
        canClaimSquares?: boolean;
        canClaimSquares2?: boolean;
        canClaimTriangles?: boolean;
        canClaimPentagons?: boolean;
        canClaimSquareswep?: boolean;
        dronecount?: boolean;
        isCelestial?: boolean;
        canChain?: boolean;
        /** If the tank requires devmode to access (unused). */
        devOnly: boolean;
        /** If the tank should be rendered as a star (eg. traps are stars with 3 sides). */
        displayAsStar?: boolean;
        /** If the tank should be rendered as a trapezoid (eg. drone barrels are trapezoids), sides needs to be set to 2 for this to take effect. */
        displayAsTrapezoid?: boolean;
    },
    /** How much the opacity increases per tick while shooting */
    visibilityRateShooting: number;
    maxorbs: number;
    /** How much the opacity increases per tick while moving */
    visibilityRateMoving: number;
    /** How much does the opacity decrease per tick */
    invisibilityRate: number;
    /** Used to determine the FOV of a tank. */
    fieldFactor: number;
    /** The speed of the tank */
    speed: number;
    /** The absorbtionFactor (field) of the tank */
    absorbtionFactor: number;
    /** The base max health of the tank */
    maxHealth: number;
    /** The addon, if not empty, which is built before the barrels. */
    preAddon: addonId | null;
    /** The addon, if not empty, which is built after the barrels. */
    postAddon: addonId | null;
    /** The sides of the tank's body. */
    sides: number;
    /** The ratio used for size to width calculation, only takes effect when sides is 2 (rectangle). */
    widthRatio?: number;
    /** The border width of the tank's body. */
    borderWidth: number;
    /** Can be used to override the tank's body color. */
    colorOverride?: Color;
    /** Can be used to override the tank body's base size. */
    baseSizeOverride?: number;
    /** The tank's barrels. */
    barrels: BarrelDefinition[];
    /** The tank's stat names and limits. */
    stats: StatDefinition[];
}

/**
 * List of all tank definitions.
 */
const TankDefinitions = JSON.parse(`[
    {
        "id": 0,
        "name": "Tank",
        "upgradeMessage": "",
        "levelRequirement": 0,
        "upgrades": [
            1,
            2,
            3,
            4,
            6,
            5,
            7,
            216,
            253,
            261,
            8
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "null",
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 1,
        "name": "Twin",
        "upgradeMessage": "",
        "levelRequirement": 15,
        "upgrades": [9, 10, 11, 17,183, 28, 121,219],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": -26,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0.75,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 26,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.75,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    
    {
        "id": 2,
        "name": "Sniper",
        "upgradeMessage": "",
        "levelRequirement": 15,
        "upgrades": [12, 13, 14,31,233,196,138,212,57,257],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0,
                "reload": 1.5,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1.5,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 3,
        "name": "Machine Gun",
        "upgradeMessage": "",
        "levelRequirement": 15,
        "upgrades": [16,52, 17,134,188, 119,237],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 0.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.7,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 4,
        "name": "Flank Guard",
        "upgradeMessage": "",
        "levelRequirement": 15,
        "upgrades": [10,29, 11,188, 21, 19, 20, 159, 18,266],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
  
    {
        "id": 5,
        "name": "Commander",
        "upgradeMessage": "Use your left mouse button to control the drones",
        "levelRequirement": 15,
        "upgrades": [26, 24, 27, 28, 32,115, 126,159,148,74,142],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 4,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 6,
        "name": "Single",
        "upgradeMessage": "",
        "levelRequirement": 15,
        "upgrades": [22, 23, 102 ,19, 25,123,30,226, 24,237],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 60.9,
                "delay": 0,
                "reload": 2.5,
                "recoil": 6,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.25,
                    "damage": 1.5,
                    "speed": 0.85,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.4
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 7,
        "name": "Trapper",
        "upgradeMessage": "",
        "levelRequirement": 15,
        "upgrades": [29, 30, 36, 31,20,126, 183, 134,217,223, 140,161],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 42,
                "delay": 0,
                "reload": 2,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 1,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 8,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 8,
        "name": "Smasher",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [87,86,88,90,89, 108,144,221,174,264],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.9,
        "speed": 1.1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "smasher",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 0
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 9,
        "name": "Triple Shot",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [34, 33, 232,243,35,117,215,197,235,220],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -0.39269908169872414,
                "offset": 0,
                "size": 90,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.8,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.39269908169872414,
                "offset": 0,
                "size": 90,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.8,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 100,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0.8,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 10,
        "name": "Quad Tank",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [37, 38,189, 39,113,56,187,139],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.85,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.5707963267948966,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.85,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.85,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 11,
        "name": "Twin Flank",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [40, 35, 42, 41, 184],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": -26,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 26,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": -26,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 26,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 12,
        "name": "Assassin",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [43,44,46,45,15,95,120],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.8,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 120,
                "width": 42,
                "delay": 0,
                "reload": 2,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1.5,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 13,
        "name": "Hunter",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [47, 48,153,162,61],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.85,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.85,
                    "speed": 1.4,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 56.7,
                "delay": 0.2,
                "reload": 2.5,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.85,
                    "speed": 1.4,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 14,
        "name": "Scope",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [45,49,50,155,160],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0,
                "reload": 1.5,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1.5,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 29.4,
                "delay": 0.2,
                "reload": 1.5,
                "recoil": 0.4,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "streambullet",
                    "sizeRatio": 1,
                    "health": 0.8,
                    "damage": 0.2,
                    "speed": 1.5,
                    "scatterRate": 0,
                    "lifeLength": 0.4,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 72.5,
                "width": 29.4,
                "delay": 0.4,
                "reload": 1.5,
                "recoil": 0.4,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "streambullet",
                    "sizeRatio": 1,
                    "health": 0.8,
                    "damage": 0.2,
                    "speed": 1.5,
                    "scatterRate": 0,
                    "lifeLength": 0.4,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 65,
                "width": 29.4,
                "delay": 0.6,
                "reload": 1.5,
                "recoil": 0.4,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "streambullet",
                    "sizeRatio": 1,
                    "health": 0.8,
                    "damage": 0.2,
                    "speed": 1.5,
                    "scatterRate": 0,
                    "lifeLength": 0.4,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 15,
        "name": "Peace Keeper",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.85,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0,
                "reload": 2,
                "recoil": 1.75,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1.5,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 90,
                "width": 42,
                "delay": 1,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0,
                "reload": 0.5,
                "recoil": 2,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 16,
        "name": "Spewer",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [131, 104, 135, 163,225,215,239],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 52.5,
                "delay": 0,
                "reload": 0.35,
                "recoil": 0.9,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.8,
                    "health": 0.875,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 17,
        "name": "Gunner",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [53, 49,50, 54, 214,187,246, 62,262],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": -32,
                "size": 65,
                "width": 25.2,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.5,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 32,
                "size": 65,
                "width": 25.2,
                "delay": 0.75,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.5,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": -17,
                "size": 85,
                "width": 25.2,
                "delay": 0,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.5,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 17,
                "size": 85,
                "width": 25.2,
                "delay": 0.25,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.5,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 18,
        "name": "Tri-Angle",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [55,56,57,42,190,209],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.665191429188092,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 2.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.6179938779914944,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 2.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 19,
        "name": "Triple Tank",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [40, 38, 59, 143 , 60, 81,231,270],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 56,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.15,
                    "damage": 1.3,
                    "speed": 0.85,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 2.0943951023931953,
                "offset": 0,
                "size": 95,
                "width": 56,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.15,
                    "damage": 1.3,
                    "speed": 0.85,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": -2.0943951023931953,
                "offset": 0,
                "size": 95,
                "width": 56,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.15,
                    "damage": 1.3,
                    "speed": 0.85,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.75
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 20,
        "name": "Trap Guard",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [54,57,63,118,191,127,240,61,270],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 60,
                "width": 42,
                "delay": 0,
                "reload": 3,
                "inverseFire": true,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 1,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 8,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Penetration",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 21,
        "name": "Auto 3",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [39, 60, 76,113, 99, 111, 163,234],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "auto3",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 22,
        "name": "Destroyer",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [64, 59 ,68,124, 65, 83,75, 94, 202,230,236,238],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 71.4,
                "delay": 0,
                "reload": 4,
                "recoil": 15,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 3,
                    "speed": 0.7,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 23,
        "name": "Artillery",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [66,67, 48,114,243],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0.3490658503988659,
                "offset": 15,
                "size": 80,
                "width": 25.2,
                "delay": 0.5,
                "reload": 2.5,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.3490658503988659,
                "offset": -15,
                "size": 80,
                "width": 25.2,
                "delay": 0.5,
                "reload": 2.5,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 60.9,
                "delay": 0,
                "reload": 2.5,
                "recoil": 6,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.25,
                    "damage": 1.5,
                    "speed": 0.85,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.4
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 24,
        "name": "Director",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [75,94,150,112,248, 249],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 75,
                "width": 63,
                "delay": 0,
                "reload": 8,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 4,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2.5,
                    "damage": 1.25,
                    "speed": 0.7,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.6
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 25,
        "name": "Launcher",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [258,69,70,114,143,198,273,199],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 92.5,
                "width": 39.375,
                "delay": 0,
                "reload": 2.5,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection":  0,
                "droneCount":0,
                "addon": null,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 3,
                    "damage": 1,
                    "speed": 0.45,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 52.5,
                "delay": 0,
                "reload": 3,
                "recoil": 3,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": null,
                "bullet": {
                    "type": "launrocket",
                    "sizeRatio": 1,
                    "health": 2.5,
                    "damage": 1,
                    "speed": 0.55,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Rocket Damage",
                "max": 7
            },
            {
                "name": "Rocket Penetration",
                "max": 7
            },
            {
                "name": "Rocket Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 26,
        "name": "Overseer",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [71,72,73, 85,248, 147,149,101,128,209,267],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -1.5707963267948966,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.25,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 4,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.25,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 4,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 27,
        "name": "Spawner",
        "upgradeMessage": "Use your left mouse button to control the minions around your cursor",
        "levelRequirement": 30,
        "upgrades": [79, 80, 94,117,195,128,256,269],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 100,
                "width": 42,
                "delay": 0,
                "reload": 5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "minionLauncher",
                "droneCount": 4,
                "canControlDrones": true,
                "bullet": {
                    "type": "minion",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.69,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Minion Damage",
                "max": 7
            },
            {
                "name": "Minion Health",
                "max": 7
            },
            {
                "name": "Minion Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 28,
        "name": "Cruiser",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [41, 78,128,152,160,246,249,154],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 20,
                "size": 75,
                "width": 29.4,
                "delay": 0,
                "reload": 1,
                "recoil": 0.5,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": true,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": -20,
                "size": 75,
                "width": 29.4,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.5,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": true,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Amount",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 29,
        "name": "Flank Trapper",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [81 , 82,98,184,157, 220],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 42,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 1,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 8,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 60,
                "width": 42,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 1,
                    "speed": 2,
                    "scatterRate": 0,
                    "lifeLength": 8,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 30,
        "name": "Mega Trapper",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [83, 84, 125, 156, 165, 193,240],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 54.6,
                "delay": 0,
                "reload": 3,
                "recoil": 8,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2.5,
                    "damage": 1.3,
                    "speed": 1.5,
                    "scatterRate": 1,
                    "lifeLength": 8,
                    "absorbtionFactor": 0.4
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 31,
        "name": "Boomer",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [95,133, 137,186,156,251,260],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "pronounced",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0,
                "reload": 2.5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "boomerang",
                    "sizeRatio": 0.8,
                    "health": 1.25,
                    "damage": 1.25,
                    "speed": 1.75,
                    "scatterRate": 1,
                    "lifeLength": 3.75,
                    "absorbtionFactor": 0.75
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 32,
        "name": "Sepulcher",
        "upgradeMessage": "Kill squares to possess them",
        "levelRequirement": 30,
        "upgrades": [72, 77,101, 100,128,164,195],
        "flags": {
            "invisibility": false,
            "canClaimSquares": true,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 4,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.25,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "canControlDrones": true,
                "bullet": {
                    "type": "necrodrone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.42,
                    "speed": 0.72,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Drone Count",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 33,
        "name": "Triplet",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": -26,
                "size": 80,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.75,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 26,
                "size": 80,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.75,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.75,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 34,
        "name": "Penta Shot",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -0.7853981633974483,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.66,
                "reload": 1,
                "recoil": 0.7,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.55,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.7853981633974483,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.66,
                "reload": 1,
                "recoil": 0.7,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.55,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.39269908169872414,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0.33,
                "reload": 1,
                "recoil": 0.7,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.55,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.39269908169872414,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0.33,
                "reload": 1,
                "recoil": 0.7,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.55,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0.7,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.55,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 35,
        "name": "Triple Flank",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -0.39269908169872414,
                "offset": 0,
                "size": 90,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.39269908169872414,
                "offset": 0,
                "size": 90,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 100,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -2.748893571891069,
                "offset": 0,
                "size": 90,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.748893571891069,
                "offset": 0,
                "size": 90,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 100,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 36,
        "name": "Engineer",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [84,185, 98,118,136,151,186],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 48.3,
                "delay": 0,
                "reload": 3,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "engitrapLauncher",
                "bullet": {
                    "type": "autotrap",
                    "sizeRatio": 0.8,
                    "health": 1.5,
                    "damage": 0.8,
                    "speed": 1.5,
                    "scatterRate": 1,
                    "lifeLength": 3,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 37,
        "name": "Octo Tank",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -0.7853981633974483,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.7853981633974483,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -2.356194490192345,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.356194490192345,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.5707963267948966,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 38,
        "name": "Hex Tank",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 95,
                "width": 56,
                "delay": 0.5,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.15,
                    "damage": 1.3,
                    "speed": 0.85,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 0,
                "size": 95,
                "width": 56,
                "delay": 0.5,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.15,
                    "damage": 1.3,
                    "speed": 0.85,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 0,
                "size": 95,
                "width": 56,
                "delay": 0.5,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.15,
                    "damage": 1.3,
                    "speed": 0.85,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 56,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.15,
                    "damage": 1.3,
                    "speed": 0.85,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 2.0943951023931953,
                "offset": 0,
                "size": 95,
                "width": 56,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.15,
                    "damage": 1.3,
                    "speed": 0.85,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": -2.0943951023931953,
                "offset": 0,
                "size": 95,
                "width": 56,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.15,
                    "damage": 1.3,
                    "speed": 0.85,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.75
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },    
    {
        "id": 39,
        "name": "Auto 5",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "auto5",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 40,
        "name": "Triple Twin",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": -26,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 26,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.0943951023931953,
                "offset": -26,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.0943951023931953,
                "offset": 26,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -2.0943951023931953,
                "offset": -26,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -2.0943951023931953,
                "offset": 26,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 41,
        "name": "Battleship",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 1.5707963267948966,
                "offset": -20,
                "size": 75,
                "width": 29.4,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": false,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 1.15,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 4.71238898038469,
                "offset": -20,
                "size": 75,
                "width": 29.4,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": false,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 1.15,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 20,
                "size": 75,
                "width": 29.4,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": true,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 1.15,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 4.71238898038469,
                "offset": 20,
                "size": 75,
                "width": 29.4,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": true,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 1.15,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Amount",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 42,
        "name": "Hewn Flank",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 2.356194490192345,
                "offset": 0.13,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -2.356194490192345,
                "offset": -0.13,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 1.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": -26,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 26,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": -26,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 26,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 43,
        "name": "Ranger",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.65,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "pronounced",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 120,
                "width": 42,
                "delay": 0,
                "reload": 2,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1.5,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.75
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 44,
        "name": "Marksman",
        "upgradeMessage": "Use your right mouse button to look further in the direction you're facing",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": true,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.85,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 140,
                "width": 42,
                "delay": 0,
                "reload": 4,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.5,
                    "damage": 1,
                    "speed": 1.5,
                    "scatterRate": 0,
                    "lifeLength": 1.25,
                    "absorbtionFactor": 0.25
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 45,
        "name": "Rifle",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.8,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 120,
                "width": 42,
                "delay": 0,
                "reload": 2,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1.5,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 90,
                "width": 29.4,
                "delay": 0.2,
                "reload": 2,
                "recoil": 0.4,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "streambullet",
                    "sizeRatio": 1,
                    "health": 0.8,
                    "damage": 0.35,
                    "speed": 1.5,
                    "scatterRate": 0,
                    "lifeLength": 0.65,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 82.5,
                "width": 29.4,
                "delay": 0.4,
                "reload": 2,
                "recoil": 0.4,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "streambullet",
                    "sizeRatio": 1,
                    "health": 0.8,
                    "damage": 0.35,
                    "speed": 1.5,
                    "scatterRate": 0,
                    "lifeLength": 0.65,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 75,
                "width": 29.4,
                "delay": 0.6,
                "reload": 2,
                "recoil": 0.4,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "streambullet",
                    "sizeRatio": 1,
                    "health": 0.8,
                    "damage": 0.35,
                    "speed": 1.5,
                    "scatterRate": 0,
                    "lifeLength": 0.65,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 46,
        "name": "Stalker",
        "upgradeMessage": "Stand still to go invisible",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": true,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.8,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 120,
                "width": 42,
                "delay": 0,
                "reload": 2,
                "recoil": 3,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1.5,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 47,
        "name": "Predator",
        "upgradeMessage": "Use your right mouse button to look further in the direction you're facing",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": true,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.85,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0,
                "reload": 3,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1.4,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 56.7,
                "delay": 0.2,
                "reload": 3,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1.4,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 71.39999999999999,
                "delay": 0.4,
                "reload": 3,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1.4,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 48,
        "name": "Ordinance",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.85,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0.3490658503988659,
                "offset": 15,
                "size": 85,
                "width": 25.2,
                "delay": 0.5,
                "reload": 2.5,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1.4,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.3490658503988659,
                "offset": -15,
                "size": 85,
                "width": 25.2,
                "delay": 0.5,
                "reload": 2.5,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1.4,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.7,
                    "health": 1.05,
                    "damage": 0.85,
                    "speed": 1.4,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 56.7,
                "delay": 0.2,
                "reload": 2.5,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.7,
                    "health": 1.05,
                    "damage": 0.85,
                    "speed": 1.4,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 49,
        "name": "Streamliner",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.85,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "streambullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1.3,
                    "scatterRate": 0,
                    "lifeLength": 0.8,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 100,
                "width": 42,
                "delay": 0.2,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "streambullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1.3,
                    "scatterRate": 0,
                    "lifeLength": 0.8,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 90,
                "width": 42,
                "delay": 0.4,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "streambullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1.3,
                    "scatterRate": 0,
                    "lifeLength": 0.8,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.6,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "streambullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1.3,
                    "scatterRate": 0,
                    "lifeLength": 0.8,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.8,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "streambullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1.3,
                    "scatterRate": 0,
                    "lifeLength": 0.8,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 50,
        "name": "Rim Fire",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": -27.5,
                "size": 90,
                "width": 23.1,
                "delay": 0,
                "reload": 1.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.5,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 27.5,
                "size": 90,
                "width": 23.1,
                "delay": 0.25,
                "reload": 1.5,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.5,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": -27.5,
                "size": 80,
                "width": 29.4,
                "delay": 0.5,
                "reload": 1.5,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.5,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 27.5,
                "size": 80,
                "width": 29.4,
                "delay": 0.75,
                "reload": 1.5,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.5,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0,
                "reload": 3,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1.5,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 51,
        "name": "Warden",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.8,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "pronounced",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0,
                "reload": 1.5,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1.5,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0,
                "reload": 0.45,
                "recoil": 1.5,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.7,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 52,
        "name": "Sprayer",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [97, 15, 122,155, 136,241],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 1,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 0.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.7,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 53,
        "name": "Minigun",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.875,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": -17,
                "size": 110,
                "width": 18.9,
                "delay": 0.33,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.5,
                    "damage": 0.35,
                    "speed": 1.2,
                    "scatterRate": 0.5,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 0,
                "offset": 17,
                "size": 110,
                "width": 18.9,
                "delay": 0.66,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.5,
                    "damage": 0.35,
                    "speed": 1.2,
                    "scatterRate": 0.5,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 0,
                "offset": -17,
                "size": 100,
                "width": 18.9,
                "delay": 0,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.5,
                    "damage": 0.35,
                    "speed": 1.2,
                    "scatterRate": 0.5,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 0,
                "offset": 17,
                "size": 100,
                "width": 18.9,
                "delay": 0.33,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.5,
                    "damage": 0.35,
                    "speed": 1.2,
                    "scatterRate": 0.5,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 120,
                "width": 18.9,
                "delay": 0,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.5,
                    "damage": 0.35,
                    "speed": 1.2,
                    "scatterRate": 0.5,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 18.9,
                "delay": 0.66,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.35,
                    "speed": 1.2,
                    "scatterRate": 0.5,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 65,
                "width": 56.7,
                "delay": 0,
                "reload": 2.5,
                "recoil": 3,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "droneCount":0,
                "addon": null,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 0.25,
                    "health": 3,
                    "damage": 1,
                    "speed": 0.45,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 54,
        "name": "Gunner Trapper",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": -16,
                "size": 75,
                "width": 21,
                "delay": 0.66,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 16,
                "size": 75,
                "width": 21,
                "delay": 0.33,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 60,
                "width": 54.6,
                "delay": 0,
                "reload": 3,
                "inverseFire": true,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 1,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 8,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Penetration",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 55,
        "name": "Booster",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.9269908169872414,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.66,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.356194490192345,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.66,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.665191429188092,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.33,
                "reload": 1,
                "recoil": 2.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.6179938779914944,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.33,
                "reload": 1,
                "recoil": 2.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 56,
        "name": "Fighter",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0,
                "reload": 1.5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.8,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.5707963267948966,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0,
                "reload": 1.5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.8,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.665191429188092,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 2.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.6179938779914944,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 2.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 57,
        "name": "Wave",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 70,
                "width": 39.9,
                "delay": 0,
                "reload": 3,
                "recoil": 1,
                "isTrapezoid": false,
                "inverseFire": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 2.25,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 50,
                "width": 39.9,
                "delay": 0.5,
                "reload": 3,
                "recoil": 1,
                "isTrapezoid": false,
                "inverseFire": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 2.25,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 105,
                "width": 42,
                "delay": 0,
                "reload": 1.5,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1.3,
                    "scatterRate": 0.5,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.443460952792061,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 2.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -2.443460952792061,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 2.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Penetration",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 58,
        "name": "Spread Shot",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 1.3089969389957472,
                "offset": 0,
                "size": 65,
                "width": 29.4,
                "delay": 0.8333,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.3089969389957472,
                "offset": 0,
                "size": 65,
                "width": 29.4,
                "delay": 0.8333,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 0,
                "size": 71,
                "width": 29.4,
                "delay": 0.6666,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 0,
                "size": 71,
                "width": 29.4,
                "delay": 0.6666,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.7853981633974483,
                "offset": 0,
                "size": 77,
                "width": 29.4,
                "delay": 0.5,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.7853981633974483,
                "offset": 0,
                "size": 77,
                "width": 29.4,
                "delay": 0.5,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.5235987755982988,
                "offset": 0,
                "size": 83,
                "width": 29.4,
                "delay": 0.3333,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.5235987755982988,
                "offset": 0,
                "size": 83,
                "width": 29.4,
                "delay": 0.3333,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.2617993877991494,
                "offset": 0,
                "size": 89,
                "width": 29.4,
                "delay": 0.1666,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.2617993877991494,
                "offset": 0,
                "size": 89,
                "width": 29.4,
                "delay": 0.1666,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 59,
        "name": "Triple Destroyer",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 71.39999999999999,
                "delay": 0,
                "reload": 4,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.5,
                    "damage": 2.5,
                    "speed": 0.75,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            },
            {
                "angle": 2.0943951023931953,
                "offset": 0,
                "size": 95,
                "width": 71.39999999999999,
                "delay": 0,
                "reload": 4,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.5,
                    "damage": 2.5,
                    "speed": 0.75,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            },
            {
                "angle": -2.0943951023931953,
                "offset": 0,
                "size": 95,
                "width": 71.39999999999999,
                "delay": 0,
                "reload": 4,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.5,
                    "damage": 2.5,
                    "speed": 0.75,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 60,
        "name": "Mega 3",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "mega3",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 61,
        "name": "Bushwaker",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.85,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.85,
                    "speed": 1.4,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 56.7,
                "delay": 0.2,
                "reload": 2.5,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.85,
                    "speed": 1.4,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 60,
                "width": 54.6,
                "delay": 0,
                "reload": 3,
                "inverseFire": true,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 1,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 8,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Penetration",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 62,
        "name": "Auto Gunner",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "autoturret",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": -32,
                "size": 65,
                "width": 25.2,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.5,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 32,
                "size": 65,
                "width": 25.2,
                "delay": 0.75,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.5,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": -17,
                "size": 85,
                "width": 25.2,
                "delay": 0,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.5,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 17,
                "size": 85,
                "width": 25.2,
                "delay": 0.25,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.5,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 63,
        "name": "Auto Trapper",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "autoturret",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
        {
            "angle": 0,
            "offset": 0,
            "size": 60,
            "width": 42,
            "delay": 0,
            "reload": 1.5,
            "recoil": 1,
            "isTrapezoid": false,
            "trapezoidDirection": 0,
            "addon": "trapLauncher",
            "bullet": {
                "type": "trap",
                "sizeRatio": 0.8,
                "health": 2,
                "damage": 1,
                "speed": 2,
                "scatterRate": 1,
                "lifeLength": 8,
                "absorbtionFactor": 1
            }
        }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 64,
        "name": "Annihilator",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 96.6,
                "delay": 0,
                "reload": 6,
                "recoil": 25.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 3,
                    "damage": 3,
                    "speed": 0.625,
                    "scatterRate": 1,
                    "lifeLength": 0.8,
                    "absorbtionFactor": 0.05
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 65,
        "name": "Hybrid",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 71.4,
                "delay": 0,
                "reload": 15,
                "recoil": 4,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 3,
                    "speed": 0.7,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": false,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Penetration",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 66,
        "name": "Mortar",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0.5235987755982988,
                "offset": 18,
                "size": 70,
                "width": 25.2,
                "delay": 0.6666,
                "reload": 2.5,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.5235987755982988,
                "offset": -18,
                "size": 70,
                "width": 25.2,
                "delay": 0.6666,
                "reload": 2.5,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.3490658503988659,
                "offset": 12,
                "size": 80,
                "width": 25.2,
                "delay": 0.3333,
                "reload": 2.5,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.3490658503988659,
                "offset": -12,
                "size": 80,
                "width": 25.2,
                "delay": 0.3333,
                "reload": 2.5,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 60.9,
                "delay": 0,
                "reload": 2.5,
                "recoil": 6,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.2,
                    "damage": 1.8,
                    "speed": 0.85,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.4
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 67,
        "name": "Beekeeper",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0.17453292519943295,
                "offset": 20,
                "size": 68,
                "width": 29.4,
                "delay": 0.5,
                "reload": 2.5,
                "recoil": 0.5,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": false,
                "bullet": {
                    "type": "hive",
                    "sizeRatio": 0.7,
                    "health": 1.25,
                    "damage": 0.45,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 0.75,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.17453292519943295,
                "offset": -20,
                "size": 68,
                "width": 29.4,
                "delay": 0.5,
                "reload": 2.5,
                "recoil": 0.5,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": false,
                "bullet": {
                    "type": "hive",
                    "sizeRatio": 0.7,
                    "health": 1.25,
                    "damage": 0.45,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 0.75,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 60.9,
                "delay": 0,
                "reload": 2.5,
                "recoil": 6,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.25,
                    "damage": 1.5,
                    "speed": 0.85,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.4
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Penetration",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 68,
        "name": "Skimmer",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": "launcher",
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 71.4,
                "delay": 0,
                "reload": 4,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "megaspinner",
                    "sizeRatio": 1,
                    "health": 3,
                    "damage": 1.25,
                    "speed": 0.7,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Spinner Damage",
                "max": 7
            },
            {
                "name": "Spinner Penetration",
                "max": 7
            },
            {
                "name": "Spinner Speed",
                "max": 7
            },
            {
                "name": "Rocket Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 69,
        "name": "Rocketeer",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": "launcher",
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 52.5,
                "delay": 0,
                "reload": 4,
                "recoil": 3,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "bullet": {
                    "type": "rocket",
                    "sizeRatio": 1,
                    "health": 5,
                    "damage": 1,
                    "speed": 0.3,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Rocket Damage",
                "max": 7
            },
            {
                "name": "Rocket Penetration",
                "max": 7
            },
            {
                "name": "Rocket Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 70,
        "name": "Dog Fighter",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 92.5,
                "width": 39.375,
                "delay": 0,
                "reload": 2.5,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection":  0,
                "droneCount":0,
                "addon": null,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 3,
                    "damage": 1,
                    "speed": 0.45,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 75,
                "width": 52.5,
                "delay": 0,
                "reload": 3.5,
                "recoil": 3,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": "autoLauncher",
                "bullet": {
                    "type": "autorocket",
                    "sizeRatio": 1,
                    "health": 2.5,
                    "damage": 1,
                    "speed": 0.4,
                    "scatterRate": 0.3,
                    "lifeLength": 1.25,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Rocket Damage",
                "max": 7
            },
            {
                "name": "Rocket Penetration",
                "max": 7
            },
            {
                "name": "Rocket Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 71,
        "name": "Overlord",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -1.5707963267948966,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.5,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.5,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.5,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.5,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 72,
        "name": "Necromancer",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": true,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 4,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -1.5707963267948966,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.25,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "canControlDrones": true,
                 
                "bullet": {
                    "type": "necrodrone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.42,
                    "speed": 0.72,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.25,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "canControlDrones": true,
                "bullet": {
                    "type": "necrodrone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.42,
                    "speed": 0.72,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Drone Count",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 73,
        "name": "Auto Overseer",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "autoturret",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -1.5707963267948966,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.25,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 4,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.25,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 4,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 74,
        "name": "Manager",
        "upgradeMessage": "Stand still to go invisible",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": true,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.04,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 75,
                "width": 52.5,
                "delay": 0,
                "reload": 3,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 6,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 75,
        "name": "Executive",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 73.5,
                "delay": 0,
                "reload": 14,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 4,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 3,
                    "damage": 2,
                    "speed": 0.7,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.4
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 76,
        "name": "Spectre",
        "upgradeMessage": "Stand still to go invisible",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": true,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0,
        "visibilityRateMoving": 0.125,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 0.8,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "stalker3",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 77,
        "name": "Maleficitor",
        "upgradeMessage": "Idle necro squares go invisible",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": true,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 4,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.25,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "canControlDrones": true,
                "invisibile": true,
                "bullet": {
                    "type": "necrodrone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.42,
                    "speed": 0.72,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Drone Count",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 78,
        "name": "Carrier",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.8,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 75,
                "width": 29.4,
                "delay": 0,
                "reload": 1,
                "recoil": 0.475,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": true,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.5235987755982988,
                "offset": -10,
                "size": 75,
                "width": 29.4,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.475,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": true,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.5235987755982988,
                "offset": 10,
                "size": 75,
                "width": 29.4,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.475,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": true,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Amount",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 79,
        "name": "Factory",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 100,
                "width": 52.5,
                "delay": 0,
                "reload": 5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "minionLauncher",
                "droneCount": 6,
                "canControlDrones": true,
                "bullet": {
                    "type": "minion",
                    "sizeRatio": 0.8,
                    "health": 2.5,
                    "damage": 0.7,
                    "speed": 0.56,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Minion Damage",
                "max": 7
            },
            {
                "name": "Minion Health",
                "max": 7
            },
            {
                "name": "Minion Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 80,
        "name": "Master",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 39.9,
                "delay": 0.15,
                "reload": 5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "minionLauncher",
                "droneCount": 3,
                "canControlDrones": true,
                "bullet": {
                    "type": "miniminion",
                    "sizeRatio": 1,
                    "health": 1.1,
                    "damage": 0.6,
                    "speed": 1.1,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.0943951023931953,
                "offset": 0,
                "size": 80,
                "width": 39.9,
                "delay": 0.15,
                "reload": 5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "minionLauncher",
                "droneCount": 3,
                "canControlDrones": true,
                "bullet": {
                    "type": "miniminion",
                    "sizeRatio": 1,
                    "health": 1.1,
                    "damage": 0.6,
                    "speed": 1.1,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -2.0943951023931953,
                "offset": 0,
                "size": 80,
                "width": 39.9,
                "delay": 0.15,
                "reload": 5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "minionLauncher",
                "droneCount": 3,
                "canControlDrones": true,
                "bullet": {
                    "type": "miniminion",
                    "sizeRatio": 1,
                    "health": 1.1,
                    "damage": 0.6,
                    "speed": 1.1,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Minion Damage",
                "max": 7
            },
            {
                "name": "Minion Health",
                "max": 7
            },
            {
                "name": "Minion Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 81,
        "name": "Tri-Trapper",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 42,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 1,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 8,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.0943951023931953,
                "offset": 0,
                "size": 60,
                "width": 42,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 1,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 8,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 4.1887902047863905,
                "offset": 0,
                "size": 60,
                "width": 42,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 1,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 8,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
            "id": 82,
        "name": "Riot",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 100,
                 "width": 39.9,
                "delay": 0,
                "reload": 1.5,
                "recoil": 0.75,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 0.5,
                    "speed": 3.5,
                    "scatterRate": 0.3,
                    "lifeLength": 1.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                 "width": 39.9,
                "delay": 0.33,
                "reload": 1.5,
                "recoil": 0.75,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 0.5,
                    "speed": 3.5,
                    "scatterRate": 0.3,
                    "lifeLength": 1.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                 "width": 39.9,
                "delay": 0.66,
                "reload": 1.5,
                "recoil": 0.75,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 0.5,
                    "speed": 3.5,
                    "scatterRate": 0.3,
                    "lifeLength": 1.5,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 83,
        "name": "Giga Trapper",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.85,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 71.4,
                "delay": 0,
                "reload": 4,
                "recoil": 9,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 4,
                    "damage": 2,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 8,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    }, 
    {
        "id": 84,
        "name": "Raider",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 60.9,
                "delay": 0,
                "reload": 5,
                "recoil": 8,
                "megaturret": true,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "engitrapLauncher",
                "bullet": {
                    "type": "autotrap",
                    "sizeRatio": 0.8,
                    "health": 2.5,
                    "damage": 1.3,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 3,
                    "absorbtionFactor": 0.4
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 85,
        "name": "Overtrapper",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 42,
                "delay": 0,
                "reload": 2,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 1,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 8,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.0943951023931953,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.375,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 4.1887902047863905,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.375,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Health",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 86,
        "name": "Spike",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.9,
        "speed": 1.1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "spike",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 0
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 87,
        "name": "Mega Smasher",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.4,
        "speed": 0.9,
        "maxHealth": 75,
        "preAddon": null,
        "postAddon": "megasmasher",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 0
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 88,
        "name": "Saw",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.8,
        "absorbtionFactor": 0.75,
        "speed": 1.3,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "saw",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 0
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 89,
        "name": "Landmine",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": true,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0,
        "visibilityRateMoving": 0.16,
        "invisibilityRate": 0.012,
        "fieldFactor": 0.775,
        "absorbtionFactor": 1,
        "speed": 1.05,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "landmine",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 0
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 90,
        "name": "Auto Smasher",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.85,
        "absorbtionFactor": 1,
        "speed": 1.15,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "autosmasher",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 10
            },
            {
                "name": "Bullet Damage",
                "max": 10
            },
            {
                "name": "Bullet Penetration",
                "max": 10
            },
            {
                "name": "Bullet Speed",
                "max": 10
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 91,
        "name": "Dominator",
        "upgradeMessage": "",
        "levelRequirement": 0,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 6000,
        "preAddon": "dombase",
        "postAddon": "dompronounced",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 34.99965,
                "delay": 0.001,
                "reload": 3,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 100,
                    "damage": 10,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 0
            },
            {
                "name": "Reload",
                "max": 0
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 0
            },
            {
                "name": "Max Health",
                "max": 0
            },
            {
                "name": "Health Regen",
                "max": 0
            }
        ]
    },
    {
        "id": 92,
        "name": "Dominator",
        "upgradeMessage": "",
        "levelRequirement": 0,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 6000,
        "preAddon": "dombase",
        "postAddon": "dompronounced",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": -6,
                "size": 75,
                "width": 17.50035,
                "delay": 0.666,
                "reload": 0.3,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.6,
                    "health": 5,
                    "damage": 1,
                    "speed": 1.2,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 6,
                "size": 75,
                "width": 17.50035,
                "delay": 0.333,
                "reload": 0.3,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.6,
                    "health": 5,
                    "damage": 1,
                    "speed": 1.2,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 17.50035,
                "delay": 0.001,
                "reload": 0.3,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.6,
                    "health": 5,
                    "damage": 1,
                    "speed": 1.2,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 0
            },
            {
                "name": "Reload",
                "max": 0
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 0
            },
            {
                "name": "Max Health",
                "max": 0
            },
            {
                "name": "Health Regen",
                "max": 0
            }
        ]
    },
    {
        "id": 93,
        "name": "Dominator",
        "upgradeMessage": "",
        "levelRequirement": 0,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 6000,
        "preAddon": "dombase",
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 21,
                "delay": 0,
                "reload": 1.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "forceFire": true,
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 20,
                    "damage": 3,
                    "speed": 4,
                    "scatterRate": 1,
                    "lifeLength": 3.2,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.7853981633974483,
                "offset": 0,
                "size": 60,
                "width": 21,
                "delay": 0,
                "reload": 1.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "forceFire": true,
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 20,
                    "damage": 3,
                    "speed": 4,
                    "scatterRate": 1,
                    "lifeLength": 3.2,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "size": 60,
                "width": 21,
                "delay": 0,
                "reload": 1.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "forceFire": true,
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 20,
                    "damage": 3,
                    "speed": 4,
                    "scatterRate": 1,
                    "lifeLength": 3.2,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.356194490192345,
                "offset": 0,
                "size": 60,
                "width": 21,
                "delay": 0,
                "reload": 1.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "forceFire": true,
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 20,
                    "damage": 3,
                    "speed": 4,
                    "scatterRate": 1,
                    "lifeLength": 3.2,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 60,
                "width": 21,
                "delay": 0,
                "reload": 1.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "forceFire": true,
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 20,
                    "damage": 3,
                    "speed": 4,
                    "scatterRate": 1,
                    "lifeLength": 3.2,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.9269908169872414,
                "offset": 0,
                "size": 60,
                "width": 21,
                "delay": 0,
                "reload": 1.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "forceFire": true,
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 20,
                    "damage": 3,
                    "speed": 4,
                    "scatterRate": 1,
                    "lifeLength": 3.2,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 4.71238898038469,
                "offset": 0,
                "size": 60,
                "width": 21,
                "delay": 0,
                "reload": 1.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "forceFire": true,
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 20,
                    "damage": 3,
                    "speed": 4,
                    "scatterRate": 1,
                    "lifeLength": 3.2,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 5.497787143782138,
                "offset": 0,
                "size": 60,
                "width": 21,
                "delay": 0,
                "reload": 1.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "forceFire": true,
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 20,
                    "damage": 3,
                    "speed": 4,
                    "scatterRate": 1,
                    "lifeLength": 3.2,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 0
            },
            {
                "name": "Reload",
                "max": 0
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 0
            },
            {
                "name": "Max Health",
                "max": 0
            },
            {
                "name": "Health Regen",
                "max": 0
            }
        ]
    },
    {
        "id": 94,
        "name": "Manufacturer",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 100,
                "width": 71.4,
                "delay": 0.175,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "minionLauncher",
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "megaminion",
                    "sizeRatio": 1,
                    "health": 5,
                    "damage": 1.25,
                    "speed": 0.6,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.25
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Minion Damage",
                "max": 7
            },
            {
                "name": "Minion Health",
                "max": 7
            },
            {
                "name": "Minion Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 95,
        "name": "Roundabout",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.8,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "pronounced",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 90,
                "width": 42,
                "delay": 0,
                "reload": 3,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "canControlDrones": false,
                "bullet": {
                    "type": "boomerang",
                    "sizeRatio": 0.8,
                    "health": 1.25,
                    "damage": 1.25,
                    "speed": 2.5,
                    "scatterRate": 0.3,
                    "lifeLength": 1.75,
                    "absorbtionFactor": 0.5
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 96,
        "name": "Gattling Gun",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 105,
                "width": 42,
                "delay": 0,
                "reload": 0.5,
                "recoil": 0.4,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.75,
                    "health": 0.5,
                    "damage": 0.35,
                    "speed": 1,
                    "scatterRate": 2,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0.33,
                "reload": 0.5,
                "recoil": 0.4,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.75,
                    "health": 0.5,
                    "damage": 0.35,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 85,
                "width": 42,
                "delay": 0.66,
                "reload": 0.5,
                "recoil": 0.4,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.75,
                    "health": 0.5,
                    "damage": 0.35,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id":  97,
        "name": "Drizzler",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 37.8,
                "delay": 1,
                "reload": 0.5,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.8,
                    "health": 1,
                    "damage": 0.175,
                    "speed": 1,
                    "scatterRate": 2,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 0.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.7,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 98,
        "name": "Mechanic",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 2.0943951023931953,
                "offset": 0,
                "size": 80,
                 "width": 39.9,
                "delay": 0,
                "reload": 3,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "engitrapLauncher",
                "bullet": {
                    "type": "autotrap",
                    "sizeRatio": 0.8,
                    "health": 1.5,
                    "damage":  0.8,
                    "speed": 1.5,
                    "scatterRate": 1,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -2.0943951023931953,
                "offset": 0,
                "size": 80,
                 "width": 39.9,
                "delay": 0,
                "reload": 3,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "engitrapLauncher",
                "bullet": {
                    "type": "autotrap",
                    "sizeRatio": 0.8,
                    "health": 1.5,
                    "damage":  0.8,
                    "speed": 1.5,
                    "scatterRate": 1,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                 "width": 39.9,
                "delay": 0,
                "reload": 3,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "engitrapLauncher",
                "bullet": {
                    "type": "autotrap",
                    "sizeRatio": 0.8,
                    "health": 1.5,
                    "damage":  0.8,
                    "speed": 1.5,
                    "scatterRate": 1,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 1
                }
            }
         ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 99,
        "name": "Auto 4",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "auto4",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 100,
        "name": "Lich",
        "upgradeMessage": "Kill pentagons to possess them",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimPentagons": true,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": "pentagon",
        "postAddon": null,
        "sides": 5,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0.6283185307179586,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.25,
                "reload": 15,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "canControlDrones": true,
                "bullet": {
                    "type": "necropentadrone",
                    "sizeRatio": 1,
                    "health": 6.5,
                    "damage": 0.65,
                    "speed": 0.67,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.4
                }
            },
            {
                "angle": -0.6283185307179586,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.25,
                "reload": 15,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "canControlDrones": true,
                "bullet": {
                    "type": "necropentadrone",
                    "sizeRatio": 1,
                    "health": 6.5,
                    "damage": 0.65,
                    "speed": 0.67,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.4
                }
            },
            {
                "angle": 1.8849555921538759,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.25,
                "reload": 15,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "canControlDrones": true,
                "bullet": {
                    "type": "necropentadrone",
                    "sizeRatio": 1,
                    "health": 6.5,
                    "damage": 0.65,
                    "speed": 0.67,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.4
                }
            },
            {
                "angle": -1.8849555921538759,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.25,
                "reload": 15,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "canControlDrones": true,
                "bullet": {
                    "type": "necropentadrone",
                    "sizeRatio": 1,
                    "health": 6.5,
                    "damage": 0.65,
                    "speed": 0.67,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.4
                }
            },   
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.25,
                "reload": 15,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "canControlDrones": true,
                "bullet": {
                    "type": "necropentadrone",
                    "sizeRatio": 1,
                    "health": 6.5,
                    "damage": 0.65,
                    "speed": 0.67,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.4
                }
            }      
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Penetration",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 101,
        "name": "Animator",
        "upgradeMessage": "Kill triangles to possess them",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimTriangles": true,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": "triangle",
        "postAddon": null,
        "sides": 3,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 1.0471975511965976,
                "offset": 0,
                "size": 65,
                "width": 42,
                "delay": 0.5,
                "reload": 10,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "canControlDrones": true,
                 
                "bullet": {
                    "type": "necrotriangledrone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.62,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                } 
            },
            {
                "angle": -1.0471975511965976,
                "offset": 0,
                "size": 65,
                "width": 42,
                "delay": 0.5,
                "reload": 10,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "canControlDrones": true,
                 
                "bullet": {
                    "type": "necrotriangledrone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.62,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                } 
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 65,
                "width": 42,
                "delay": 0.5,
                "reload": 10,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "canControlDrones": true,
                 
                "bullet": {
                    "type": "necrotriangledrone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.62,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                } 
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Drone Count",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 102,
        "name": "Spinner",
        "upgradeMessage": "Hold right click to reverse its rotation",
        "levelRequirement": 30,
        "upgrades": [68, 104,157,186,254,268],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 92.5,
                "width": 26.88,
                "delay": 0,
                "reload": 2.5,
                "recoil": 3,
                "isTrapezoid": true,
                "trapezoidDirection":  0,
                "droneCount":0,
                "addon": null,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 3,
                    "damage": 1,
                    "speed": 0.7,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 56.7,
                "delay": 0,
                "reload": 2.5,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "spinner",
                    "sizeRatio": 1,
                    "health": 1.5,
                    "damage": 1.1,
                    "speed": 0.65,
                    "scatterRate": 0.3,
                    "lifeLength": 1.25,
                    "absorbtionFactor": 0.25
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Spinner Damage",
                "max": 7
            },
            {
                "name": "Spinner Penetration",
                "max": 7
            },
            {
                "name": "Spinner Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 103,
        "name": "Rotator",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "pronounced",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 100,
                "width": 71.4,
                "delay": 0,
                "reload": 4,
                "recoil": 8,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "megaspinner",
                    "sizeRatio": 1,
                    "health": 3,
                    "damage": 1.5,
                    "speed": 0.5,
                    "scatterRate": 0.3,
                    "lifeLength": 1.75,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Spinner Damage",
                "max": 7
            },
            {
                "name": "Spinner Penetration",
                "max": 7
            },
            {
                "name": "Spinner Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 104,
        "name": "Twister",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 92.5,
                "width": 26.88,
                "delay": 0,
                "reload": 2.5,
                "recoil": 3,
                "isTrapezoid": true,
                "trapezoidDirection":  0,
                "droneCount":0,
                "addon": null,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 3,
                    "damage": 1,
                    "speed": 0.7,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 56.7,
                "delay": 0,
                "reload": 3,
                "recoil": 3,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "spinner4",
                    "sizeRatio": 1,
                    "health": 2.5,
                    "damage": 0.5,
                    "speed": 0.75,
                    "scatterRate": 0.3,
                    "lifeLength": 1.125,
                    "absorbtionFactor": 0.25
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Spinner Damage",
                "max": 7
            },
            {
                "name": "Spinner Penetration",
                "max": 7
            },
            {
                "name": "Spinner Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 105,
        "name": "Arena Closer",
        "upgradeMessage": "",
        "levelRequirement": 0,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 75,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 5,
                    "damage": 5,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 5,
                    "absorbtionFactor": -1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 106,
        "name": "Dominator",
        "upgradeMessage": "",
        "levelRequirement": 0,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 6000,
        "preAddon": "dombase",
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 75,
                "width": 27.3,
                "delay": 0,
                "reload": 1.3,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 4,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 10,
                    "damage": 1,
                    "speed": 1.2,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.7853981633974483,
                "offset": 0,
                "size": 75,
                "width": 27.3,
                "delay": 0,
                "reload": 1.3,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 4,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 10,
                    "damage": 1,
                    "speed": 1.2,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.7853981633974483,
                "offset": 0,
                "size": 75,
                "width": 27.3,
                "delay": 0,
                "reload": 1.3,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 4,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 10,
                    "damage": 1,
                    "speed": 1.2,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 0
            },
            {
                "name": "Reload",
                "max": 0
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 0
            },
            {
                "name": "Max Health",
                "max": 0
            },
            {
                "name": "Health Regen",
                "max": 0
            }
        ]
    },
    {
        "id": 107,
        "name": "Dominator",
        "upgradeMessage": "",
        "levelRequirement": 0,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 6000,
        "preAddon": "dombase",
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 39.9,
                "delay": 0.25,
                "reload": 7,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "minionLauncher",
                "droneCount": 3,
                "canControlDrones": true,
                "bullet": {
                    "type": "domminion",
                    "sizeRatio": 1,
                    "health": 9,
                    "damage": 1,
                    "speed": 1.7,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.0943951023931953,
                "offset": 0,
                "size": 80,
                "width": 39.9,
                "delay": 0.25,
                "reload": 7,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "minionLauncher",
                "droneCount": 3,
                "canControlDrones": true,
                "bullet": {
                    "type": "domminion",
                    "sizeRatio": 1,
                    "health": 9,
                    "damage": 1,
                    "speed": 1.7,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -2.0943951023931953,
                "offset": 0,
                "size": 80,
                "width": 39.9,
                "delay": 0.25,
                "reload": 7,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "minionLauncher",
                "droneCount": 3,
                "canControlDrones": true,
                "bullet": {
                    "type": "domminion",
                    "sizeRatio": 1,
                    "health": 9,
                    "damage": 1,
                    "speed": 1.7,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 0
            },
            {
                "name": "Reload",
                "max": 0
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 0
            },
            {
                "name": "Max Health",
                "max": 0
            },
            {
                "name": "Health Regen",
                "max": 0
            }
        ]
    },
    {
        "id": 108,
        "name": "Rammer",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.8,
        "speed": 1.1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "rammer",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
            "angle": 3.141592653589793,
            "offset": 0,
            "size": 80,
            "width": 65,
            "delay": 0,
            "reload": 2.5,
            "recoil": 6,
            "isTrapezoid": false,
            "trapezoidDirection": 0,
            "addon": null,
            "bullet": {
                "type": "bullet",
                "sizeRatio": 1,
                "health": 5,
                "damage": 0,
                "speed": 0.85,
                "scatterRate": 1,
                "lifeLength": 1,
                "absorbtionFactor": 0.4
            }
        }],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 10
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 109,
        "name": "Auto Tank",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [62,63, 73,256,110,208,113,265],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "autoturret",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "null",
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 110,
        "name": "Bombard",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.8,
        "absorbtionFactor": 0.1,
        "speed": 0.935,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "bigautoturret",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "null",
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 111,
        "name": "Joint 3",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "joint3",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 112,
        "name": "Bridhy",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.8,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 75,
                "width": 63,
                "delay": 0,
                "reload": 6.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2.5,
                    "damage": 1.25,
                    "speed": 0.7,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.6
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Penetration",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 113,
        "name": "Switcher",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": "droneturret",
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
        {
            "angle": 0,
            "offset": 0,
            "size": 90,
            "width": 42,
            "delay": 0,
            "reload": 1,
            "recoil": 0,
            "isTrapezoid": false,
            "trapezoidDirection": 0,
            "addon": null,
            "bullet": {
                "type": "bullet",
                "sizeRatio": 1,
                "health": 1,
                "damage": 0.8,
                "speed": 1,
                "scatterRate": 1,
                "lifeLength": 1,
                "absorbtionFactor": 1
            }
        },
        {
            "angle": 2.0943951023931953,
            "offset": 0,
            "size": 90,
            "width": 42,
            "delay": 0,
            "reload": 1,
            "recoil": 0,
            "isTrapezoid": false,
            "trapezoidDirection": 0,
            "addon": null,
            "bullet": {
                "type": "bullet",
                "sizeRatio": 1,
                "health": 1,
                "damage": 0.8,
                "speed": 1,
                "scatterRate": 1,
                "lifeLength": 1,
                "absorbtionFactor": 1
            }
        },
        {
            "angle": -2.0943951023931953,
            "offset": 0,
            "size": 90,
            "width": 42,
            "delay": 0,
            "reload": 1,
            "recoil": 0,
            "isTrapezoid": false,
            "trapezoidDirection": 0,
            "addon": null,
            "bullet": {
                "type": "bullet",
                "sizeRatio": 1,
                "health": 1,
                "damage": 0.8,
                "speed": 1,
                "scatterRate": 1,
                "lifeLength": 1,
                "absorbtionFactor": 1
            }
        }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 114,
        "name": "Field Gun",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0.3490658503988659,
                "offset": 15,
                "size": 70,
                "width": 25.2,
                "delay": 0.5,
                "reload": 3,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.3490658503988659,
                "offset": -15,
                "size": 70,
                "width": 25.2,
                "delay": 0.5,
                "reload": 3,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 92.5,
                "width": 39.375,
                "delay": 0,
                "reload": 2.5,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection":  0,
                "droneCount":0,
                "addon": null,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 3,
                    "damage": 1,
                    "speed": 0.45,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 52.5,
                "delay": 0,
                "reload": 3,
                "recoil": 3,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": null,
                "bullet": {
                    "type": "launrocket",
                    "sizeRatio": 1,
                    "health": 2.5,
                    "damage": 1,
                    "speed": 0.55,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 115,
        "name": "Hive",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [116, 67,147,80,41,128,254],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 2.0943951023931953,
                "offset": 0,
                "size": 85,
                "width": 29.4,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": false,
                "bullet": {
                    "type": "hive",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 0.75,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -2.0943951023931953,
                "offset": 0,
                "size": 85,
                "width": 29.4,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": false,
                "bullet": {
                    "type": "hive",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 0.75,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 85,
                "width": 29.4,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": false,
                "bullet": {
                    "type": "hive",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 0.75,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Swarm Damage",
                "max": 7
            },
            {
                "name": "Swarm Health",
                "max": 7
            },
            {
                "name": "Swarm Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 116,
        "name": "Hivemind",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.02,
        "fieldFactor":  0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 2.0943951023931953,
                "offset": 0,
                "size": 85,
                "width": 29.4,
                "delay": 0,
                "reload": 1.25,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": false,
                "bullet": {
                    "type": "hive",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 0.75,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -2.0943951023931953,
                "offset": 0,
                "size": 85,
                "width": 29.4,
                "delay": 0,
                "reload": 1.25,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": false,
                "bullet": {
                    "type": "hive",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 0.75,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 85,
                "width": 29.4,
                "delay": 0,
                "reload": 1.25,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": false,
                "bullet": {
                    "type": "hive",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 0.75,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 0,
                "size": 85,
                "width": 29.4,
                "delay": 0.5,
                "reload": 1.25,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": false,
                "bullet": {
                    "type": "hive",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 0.75,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 0,
                "size": 85,
                "width": 29.4,
                "delay": 0.5,
                "reload": 1.25,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": false,
                "bullet": {
                    "type": "hive",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 0.75,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 85,
                "width": 29.4,
                "delay": 0.5,
                "reload": 1.25,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": false,
                "bullet": {
                    "type": "hive",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 0.75,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Swarm Damage",
                "max": 7
            },
            {
                "name": "Swarm Health",
                "max": 7
            },
            {
                "name": "Swarm Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 117,
        "name": "Industry",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0.39269908169872414,
                "offset": 0,
                "size": 85,
                "width": 42,
                "delay": 0.5,
                "reload": 7,
                "recoil": 1,
                "megaturret": true,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "minionLauncher",
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "domminion",
                    "sizeRatio": 1,
                    "health": 2.25,
                    "damage": 0.7,
                    "speed": 0.69,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.39269908169872414,
                "offset": 0,
                "size": 85,
                "width": 42,
                "delay": 0.5,
                "megaturret": true,
                "reload": 7,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "minionLauncher",
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "domminion",
                    "sizeRatio": 1,
                    "health": 2.25,
                    "damage": 0.7,
                    "speed": 0.69,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 7,
                "megaturret": true,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "minionLauncher",
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "domminion",
                    "sizeRatio": 1,
                    "health": 2.25,
                    "damage": 0.7,
                    "speed": 0.69,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Minion Damage",
                "max": 7
            },
            {
                "name": "Minion Health",
                "max": 7
            },
            {
                "name": "Minion Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 118,
        "name": "Constructor",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 80,
                "width": 48.3,
                "delay": 0,
                "reload": 4,
                "inverseFire": true,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "engitrapLauncher",
                "bullet": {
                    "type": "autotrap",
                    "sizeRatio": 0.8,
                    "health": 1.25,
                    "damage": 0.8,
                    "speed": 1.5,
                    "scatterRate": 1,
                    "lifeLength": 3,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 0.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.575,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Penetration",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 119,
        "name": "Burner",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [120, 121, 122],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 105,
                "width": 23.1,
                "delay": 0,
                "reload": 0.5,
                "recoil": 0.3,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": "swarmLauncher",
                "bullet": {
                    "type": "flame",
                    "sizeRatio": 1,
                    "health": 15,
                    "damage": 0.3,
                    "speed": 1,
                    "scatterRate": 2,
                    "lifeLength": 1.5,
                    "absorbtionFactor": 0
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Flame Damage",
                "max": 7
            },
            {
                "name": "Flame Duration",
                "max": 7
            },
            {
                "name": "Flame Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 120,
        "name": "Flamethrower",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 125,
                "width": 23.1,
                "delay": 0,
                "reload": 0.65,
                "recoil": 0.3,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": "swarmLauncher",
                "bullet": {
                    "type": "flame",
                    "sizeRatio": 1,
                    "health": 15,
                    "damage": 0.4,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 1.75,
                    "absorbtionFactor": 0
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Flame Damage",
                "max": 7
            },
            {
                "name": "Flame Duration",
                "max": 7
            },
            {
                "name": "Flame Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 121,
        "name": "Pyro",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": -23,
                "size": 105,
                "width": 16.8,
                "delay": 0,
                "reload": 0.5,
                "recoil": 0.3,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": "swarmLauncher",
                "bullet": {
                    "type": "flame",
                    "sizeRatio": 0.8,
                    "health": 9,
                    "damage": 0.25,
                    "speed": 1,
                    "scatterRate": 2,
                    "lifeLength": 1.5,
                    "absorbtionFactor": 0
                }
            },
            {
                "angle": 0,
                "offset": 23,
                "size": 105,
                "width": 16.8,
                "delay": 0.5,
                "reload": 0.5,
                "recoil": 0.3,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": "swarmLauncher",
                "bullet": {
                    "type": "flame",
                    "sizeRatio": 0.8,
                    "health": 9,
                    "damage": 0.25,
                    "speed": 1,
                    "scatterRate": 2,
                    "lifeLength": 1.5,
                    "absorbtionFactor": 0
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Flame Damage",
                "max": 7
            },
            {
                "name": "Flame Duration",
                "max": 7
            },
            {
                "name": "Flame Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 122,
        "name": "Dualer",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.75,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 105,
                "width": 23.1,
                "delay": 0,
                "reload": 0.5,
                "recoil": 0.3,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": "swarmLauncher",
                "bullet": {
                    "type": "flame",
                    "sizeRatio": 1,
                    "health": 13,
                    "damage": 0.3,
                    "speed": 1,
                    "scatterRate": 2,
                    "lifeLength": 1.25,
                    "absorbtionFactor": 0
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Health",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 123,
        "name": "Blunt",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [124,125,158,244],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 75,
                "width": 68,
                "delay": 0,
                "reload": 2.5,
                "recoil": 6,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "blunt",
                    "sizeRatio": 0.9,
                    "health": 0.75,
                    "damage": 2.75,
                    "speed": 0.85,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.2
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 124,
        "name": "Pounder",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 75,
                "width": 94,
                "delay": 0,
                "reload": 3.5,
                "recoil": 8,
                "isTrapezoid": false,
                "megaturret": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "blunt",
                    "sizeRatio": 0.8,
                    "health": 2.25,
                    "damage": 2.75,
                    "speed": 0.75,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.2
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 125,
        "name": "Blockade",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 50,
                "width": 54.6,
                "delay": 0,
                "reload": 3,
                "recoil": 8,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "blunttrap",
                    "sizeRatio": 0.8,
                    "health": 2.5,
                    "damage": 1.3,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 8,
                    "absorbtionFactor": 0.2
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 126,
        "name": "Fusion",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [85,127,151,154,251],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 42,
                "delay": 0,
                "reload": 2,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 1,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 8,
                    "absorbtionFactor": 1
                }
            },
          {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": false,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
            
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Health",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 127,
        "name": "Amalgam",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "null",
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.85,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 42,
                "delay": 0,
                "reload": 3,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.75,
                    "damage": 1,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 6,
                    "absorbtionFactor": 1
                }
            },
          {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 5.25,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 3,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
            
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Health",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 128,
        "name": "Dronemare",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "canClaimSquares2": true,
            "devOnly": false,
            "dronecount": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "overdrive",
        "sides": 4,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": -17.5,
                "size": 100,
                "width": 42,
                "delay": 0,
                "reload": 5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "minionLauncher",
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "minion",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.69,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -2.356194490192345,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.25,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.7853981633974483,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "autodrone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.25,
                "reload": 8,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "canControlDrones": true,
                 
                "bullet": {
                    "type": "necrodrone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.42,
                    "speed": 0.72,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 20,
                "size": 65,
                "width": 29.4,
                "delay": 0,
                "reload": 1.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": false,
                "bullet": {
                    "type": "hive",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 0.75,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 75,
                "width": 29.4,
                "delay": 0,
                "reload": 1.75,
                "recoil": 0.7,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": true,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 129,
        "name": "Shrapnel",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -0.7853981633974483,
                "offset": 0,
                "size": 60,
                 "width": 30.45,
                "delay": 0.5,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.2,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.7853981633974483,
                "offset": 0,
                "size": 60,
                 "width": 30.45,
                "delay": 0.5,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.2,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -2.356194490192345,
                "offset": 0,
                "size": 60,
                 "width": 30.45,
                "delay": 0.5,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.2,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.356194490192345,
                "offset": 0,
                "size": 60,
                 "width": 30.45,
                "delay": 0.5,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.2,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                 "width": 30.45,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.2,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 60,
                 "width": 30.45,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.2,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.5707963267948966,
                "offset": 0,
                "size": 60,
                 "width": 30.45,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.2,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "size": 60,
                 "width": 30.45,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.2,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 130,
        "name": "Quadruplet",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": -30,
                "size": 80,
                "width": 37,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.55,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 30,
                "size": 80,
                "width": 37,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.55,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": -20,
                "size": 95,
                "width": 37,
                "delay": 0,
                "reload": 1,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.55,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 20,
                "size": 95,
                "width": 37,
                "delay": 0,
                "reload": 1,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.55,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 131,
        "name": "Vulcan Cannon",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 67.2,
                "delay": 0,
                "reload": 0.125,
                "recoil": 0.35,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.625,
                    "health": 0.8,
                    "damage": 0.275,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 132,
        "name": "Split Shot",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [58,34, 66, 50,187,191, 133, 257],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0.6981317007977318,
                "offset": 0,
                "size": 71,
                "width": 29.4,
                "delay": 0.6666,
                "reload": 1.5,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.6981317007977318,
                "offset": 0,
                "size": 71,
                "width": 29.4,
                "delay": 0.6666,
                "reload": 1.5,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.3490658503988659,
                "offset": 0,
                "size": 83,
                "width": 29.4,
                "delay": 0.3333,
                "reload": 1.5,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.3490658503988659,
                "offset": 0,
                "size": 83,
                "width": 29.4,
                "delay": 0.3333,
                "reload": 1.5,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1.5,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 133,
        "name": "Objector",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "pronounced",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0.6981317007977318,
                "offset": 0,
                "size": 71,
                "width": 29.4,
                "delay": 0.6666,
                "reload": 2.5,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.6981317007977318,
                "offset": 0,
                "size": 71,
                "width": 29.4,
                "delay": 0.6666,
                "reload": 2.5,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.3490658503988659,
                "offset": 0,
                "size": 83,
                "width": 29.4,
                "delay": 0.3333,
                "reload": 2.5,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.3490658503988659,
                "offset": 0,
                "size": 83,
                "width": 29.4,
                "delay": 0.3333,
                "reload": 2.5,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0,
                "reload": 2.5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "boomerang",
                    "sizeRatio": 0.8,
                    "health": 1.25,
                    "damage": 1,
                    "speed": 1.75,
                    "scatterRate": 1,
                    "lifeLength": 3.75,
                    "absorbtionFactor": 0.75
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Health",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 134,
        "name": "Machine Trapper",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [82, 135, 136, 141,260],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 42,
                "delay": 0,
                "reload": 1.125,
                "recoil": 0.8,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": "machineTrapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.5,
                    "damage": 1,
                    "speed": 2,
                    "scatterRate": 3,
                    "lifeLength": 5.5,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 135,
        "name": "Rubble Maker",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 52.5,
                "delay": 0,
                "reload": 0.475,
                "recoil": 0.4,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": "machineTrapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.64,
                    "health": 1.5,
                    "damage": 0.8,
                    "speed": 2,
                    "scatterRate": 3,
                    "lifeLength": 4,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 136,
        "name": "Fabricator",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 42,
                "delay": 0,
                "reload": 1.25,
                "recoil": 0.8,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "canControlDrones": true,
                "addon": "engimachinetrapLauncher",
                "bullet": {
                    "type": "autotrap",
                    "sizeRatio": 0.8,
                    "health": 1,
                    "damage": 0.8,
                    "speed": 1.5,
                    "scatterRate": 3,
                    "lifeLength": 1.35,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 137,
        "name": "Orbiter",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "pronounced",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 70,
                 "width": 39.9,
                "delay": 0,
                "reload": 2,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "canControlDrones": true,
                "bullet": {
                    "type": "boomerang",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.75,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 8,
                    "absorbtionFactor": 0.25
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 138,
        "name": "Psy Tank",
        "upgradeMessage": "Right click to fire all the orbitiong bullets",
        "levelRequirement": 30,
        "upgrades": [139,137,199,266,272, 161
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.85,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "psiEye",
        "sides": 1,
        "maxorbs": 6,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0,
                "reload": 1.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": "null",
                "droneCount": 6,
                "bullet": {
                    "type": "orbit",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.625,
                    "speed": 1.5,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 139,
        "name": "Barrager",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.85,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "psiEye",
        "sides": 1,
        "borderWidth": 15,
        "maxorbs": 24,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 25.2,
                "delay": 0,
                "reload": 1.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": "null",
                "droneCount": 6,
                "bullet": {
                    "type": "orbit",
                    "sizeRatio": 1,
                    "health": 0.65,
                    "damage": 0.5,
                    "speed": 1.5,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.25
                }
            },
            {
                "angle": -1.5707963267948966,
                "offset": 0,
                "size": 80,
                "width": 25.2,
                "delay": 0,
                "reload": 1.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": "null",
                "droneCount": 6,
                "bullet": {
                    "type": "orbit",
                    "sizeRatio": 1,
                    "health": 0.65,
                    "damage": 0.5,
                    "speed": 1.5,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.25
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "size": 80,
                "width": 25.2,
                "delay": 0,
                "reload": 1.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": "null",
                "droneCount": 6,
                "bullet": {
                    "type": "orbit",
                    "sizeRatio": 1,
                    "health": 0.65,
                    "damage": 0.5,
                    "speed": 1.5,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.25
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 80,
                "width": 25.2,
                "delay": 0,
                "reload": 1.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": "null",
                "droneCount": 6,
                "bullet": {
                    "type": "orbit",
                    "sizeRatio": 1,
                    "health": 0.65,
                    "damage": 0.5,
                    "speed": 1.5,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.25
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 140,
        "name": "Mine Layer",
        "upgradeMessage": "Right click to detonate all primed mines",
        "levelRequirement": 30,
        "upgrades": [141, 142,193,194, 259],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 42,
                "delay": 0,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "droneCount": 8,
                "addon": "mineLauncher",
                "bullet": {
                    "type": "mine",
                    "sizeRatio": 0.8,
                    "health": 3,
                    "damage":0.75,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.5
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Mine Damage",
                "max": 7
            },
            {
                "name": "Mine Health",
                "max": 7
            },
            {
                "name": "Mine Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 141,
        "name": "Detonator",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 42,
                "delay": 0,
                "reload": 2.25,
                "recoil": 1,
                "isTrapezoid": true,
                "canControlDrones": true,
                "trapezoidDirection": 0,
                "addon": "machineMineLauncher",
                "droneCount": 6,
                "bullet": {
                    "type": "mine",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage":0.5,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.5
               }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Mine Damage",
                "max": 7
            },
            {
                "name": "Mine Health",
                "max": 7
            },
            {
                "name": "Mine Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 142,
        "name": "Bomber",
        "upgradeMessage": "Right click to detonate all primed drones",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.8,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 10,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": "mineLauncher",
                "droneCount": 4,
                "megaturret": true,
                "canControlDrones": true,
                "bullet": {
                    "type": "bombdrone",
                    "sizeRatio": 1,
                    "health": 1.5,
                    "damage": 0.65,
                    "speed": 0.78,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.8
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 143,
        "name": "Deployer",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -2.0943951023931953,
                "offset": 0,
                "size": 92.5,
                "width": 31.5,
                "delay": 0,
                "reload": 2.5,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection":  0,
                "droneCount":0,
                "addon": null,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 3,
                    "damage": 1,
                    "speed": 0.45,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            },
            {
                "angle": 2.0943951023931953,
                "offset": 0,
                "size": 92.5,
                "width": 31.5,
                "delay": 0,
                "reload": 2.5,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection":  0,
                "droneCount":0,
                "addon": null,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 3,
                    "damage": 1,
                    "speed": 0.45,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 92.5,
                "width": 31.5,
                "delay": 0,
                "reload": 2.5,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection":  0,
                "droneCount":0,
                "addon": null,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 3,
                    "damage": 1,
                    "speed": 0.45,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0,
                "reload": 3,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": null,
                "bullet": {
                    "type": "launrocket",
                    "sizeRatio": 1,
                    "health": 2.25,
                    "damage": 1,
                    "speed": 0.55,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            },
            {
                "angle": 2.0943951023931953,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0,
                "reload": 3,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": null,
                "bullet": {
                    "type": "launrocket",
                    "sizeRatio": 1,
                    "health": 2.25,
                    "damage": 1,
                    "speed": 0.55,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            },
            {
                "angle": -2.0943951023931953,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0,
                "reload": 3,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": null,
                "bullet": {
                    "type": "launrocket",
                    "sizeRatio": 1,
                    "health": 2.25,
                    "damage": 1,
                    "speed": 0.55,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Rocket Damage",
                "max": 7
            },
            {
                "name": "Rocket Penetration",
                "max": 7
            },
            {
                "name": "Rocket Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 144,
        "name": "Bumper",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1.5,
        "speed": 1.1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "bumper",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 0
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 145,
        "name": "Shitty Ass Scenexe.io Penta Piece Of Shit",
        "upgradeMessage": "",
        "levelRequirement": 0,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -0.6981317007977318,
                "offset": 0,
                "size": 80,
                "width": 50,
                "delay": 0.66,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.625,
                    "damage": 0.55,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 0
                }
            },
            {
                "angle": 0.6981317007977318,
                "offset": 0,
                "size": 80,
                "width": 50,
                "delay": 0.66,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.625,
                    "damage": 0.55,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 0
                }
            },
            {
                "angle": -0.3490658503988659,
                "offset": 0,
                "size": 90,
                "width": 50,
                "delay": 0.33,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.625,
                    "damage": 0.55,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 0
                }
            },
            {
                "angle": 0.3490658503988659,
                "offset": 0,
                "size": 90,
                "width": 50,
                "delay": 0.33,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.625,
                    "damage": 0.55,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 0
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 100,
                "width": 50,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.625,
                    "damage": 0.55,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 0
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 146,
        "name": "Puker",
        "upgradeMessage": "",
        "levelRequirement": 0,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -0.7853981633974483,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.66,
                "reload": 0.5,
                "recoil": 0.35,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.35,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.7853981633974483,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.66,
                "reload": 0.5,
                "recoil": 0.35,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.35,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.39269908169872414,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0.33,
                "reload": 0.5,
                "recoil": 0.35,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.35,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.39269908169872414,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0.33,
                "reload": 0.5,
                "recoil": 0.35,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.35,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0,
                "reload": 0.5,
                "recoil": 0.35,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.35,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 147,
        "name": "Emperor",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 70,
                "width": 27.3,
                "delay": 0,
                "reload": 3,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 10,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 0.5,
                    "damage": 0.5,
                    "speed": 1.2,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.25
                }
            },
            {
                "angle": 1.2566370614359172,
                "offset": 0,
                "size": 70,
                "width": 27.3,
                "delay": 0,
                "reload": 3,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 10,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 0.5,
                    "damage": 0.5,
                    "speed": 1.2,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.25
                }
            },
            {
                "angle": -1.2566370614359172,
                "offset": 0,
                "size": 70,
                "width": 27.3,
                "delay": 0,
                "reload": 3,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 10,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 0.5,
                    "damage": 0.5,
                    "speed": 1.2,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.25
                }
            },
            {
                "angle": 2.5132741228718345,
                "offset": 0,
                "size": 70,
                "width": 27.3,
                "delay": 0,
                "reload": 3,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 10,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 0.5,
                    "damage": 0.5,
                    "speed": 1.2,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.25
                }
            },
            {
                "angle": -2.5132741228718345,
                "offset": 0,
                "size": 70,
                "width": 27.3,
                "delay": 0,
                "reload": 3,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 10,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 0.5,
                    "damage": 0.5,
                    "speed": 1.2,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.25
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 148,
        "name": "Agent",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [149,150,151,152,195,128],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "overdrive",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 3,
                "canControlDrones": true,
                "bullet": {
                    "type": "autodrone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 149,
        "name": "Overdrive",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "overdrive",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -1.5707963267948966,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.25,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 3,
                "canControlDrones": true,
                "bullet": {
                    "type": "autodrone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.25,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 3,
                "canControlDrones": true,
                "bullet": {
                    "type": "autodrone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 150,
        "name": "Megadrive",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "overdrive",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 75,
                "width": 63,
                "delay": 0,
                "reload": 8,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 3,
                "megaturret": true,
                "canControlDrones": true,
                "bullet": {
                    "type": "autodrone",
                    "sizeRatio": 1,
                    "health": 2.5,
                    "damage": 1.25,
                    "speed": 0.7,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.6
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 151,
        "name": "Genesis",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "overdrive",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 48.3,
                "delay": 0,
                "reload": 3,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "engitrapLauncher",
                "bullet": {
                    "type": "autotrap",
                    "sizeRatio": 0.8,
                    "health": 1.5,
                    "damage": 0.8,
                    "speed": 1.5,
                    "scatterRate": 1,
                    "lifeLength": 2,
                    "absorbtionFactor": 1
                }
            },
          {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": false,
                "bullet": {
                    "type": "autodrone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
            
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Health",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 152,
        "name": "Overclocked",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "overdrive",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 20,
                "size": 75,
                "width": 29.4,
                "delay": 0,
                "reload": 1.15,
                "recoil": 0.5,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": true,
                "bullet": {
                    "type": "autoswarm",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": -20,
                "size": 75,
                "width": 29.4,
                "delay": 0.5,
                "reload": 1.15,
                "recoil": 0.5,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": true,
                "bullet": {
                    "type": "autoswarm",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Amount",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 153,
        "name": "X Hunter",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.75,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.8,
                    "health": 1,
                    "damage": 0.85,
                    "speed": 1.65,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.5
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 56.7,
                "delay": 0.2,
                "reload": 2.5,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.8,
                    "health": 1,
                    "damage": 0.85,
                    "speed": 1.65,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.5
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 65,
                "width": 56.7,
                "delay": 0,
                "reload": 2.5,
                "recoil": 3,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "droneCount":0,
                "addon": null,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 0.25,
                    "health": 3,
                    "damage": 1,
                    "speed": 0.45,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 154,
        "name": "Fortress",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 36.75,
                "delay": 0,
                "reload": 4,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.4,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -2.0943951023931953,
                "offset": 0,
                "size": 60,
                "width": 36.75,
                "delay": 0,
                "reload": 4,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1,
                    "damage": 1.4,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.0943951023931953,
                "offset": 0,
                "size": 60,
                "width": 36.75,
                "delay": 0,
                "reload": 4,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.4,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 0,
                "size": 70,
                "width": 29.4,
                "delay": 0,
                "reload": 2,
                "recoil": 0.5,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": true,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 0.7,
                    "health": 0.9,
                    "damage": 0.15,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 0,
                "size": 70,
                "width": 29.4,
                "delay": 0,
                "reload": 2,
                "recoil": 0.5,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": true,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 0.7,
                    "health": 0.9,
                    "damage": 0.15,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 70,
                "width": 29.4,
                "delay": 0,
                "reload": 2,
                "recoil": 0.5,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": true,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 0.7,
                    "health": 0.9,
                    "damage": 0.15,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Health",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 155,
        "name": "Blast Burn",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.85,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 125,
                "width": 42,
                "delay": 0,
                "reload": 2,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1.5,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 0.5,
                "recoil": 0.75,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.7,
                    "speed": 0.5,
                    "scatterRate": 3,
                    "lifeLength": 0.75,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 156,
        "name": "Striker",
        "upgradeMessage": "Use your right mouse button to control the traps",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 70,
                "width": 54.6,
                "delay": 0,
                "reload": 3,
                "recoil": 3,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": "reversetrap",
                "bullet": {
                    "type": "striker",
                    "sizeRatio": 0.8,
                    "health": 1.5,
                    "damage": 1.25,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 5,
                    "absorbtionFactor": 0.5
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 157,
        "name": "Ejector",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 92.5,
                "width": 26.88,
                "delay": 0,
                "reload": 2.5,
                "recoil": 3,
                "isTrapezoid": true,
                "trapezoidDirection":  0,
                "droneCount":0,
                "addon": null,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 3,
                    "damage": 1,
                    "speed": 0.7,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 55,
                "width": 56.7,
                "delay": 0,
                "reload": 2.5,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trapspinner",
                    "sizeRatio": 1,
                    "health": 1.5,
                    "damage": 1.1,
                    "speed": 0.65,
                    "scatterRate": 0.3,
                    "lifeLength": 1.25,
                    "absorbtionFactor": 0.25
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Spinner Damage",
                "max": 7
            },
            {
                "name": "Spinner Penetration",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 158,
        "name": "Flinger",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.8,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 65,
                "width": 52,
                "delay": 0,
                "reload": 2,
                "recoil": 4,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "bounceLauncher",
                "bullet": {
                    "type": "blunt",
                    "sizeRatio": 1,
                    "health": 0.75,
                    "damage": 1.25,
                    "speed": 1.4,
                    "scatterRate": 0.3,
                    "lifeLength": 2,
                    "absorbtionFactor": 0.5
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 159,
        "name": "Alloy",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [65, 112, 127,160,164,246,267,269,209],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": false,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Penetration",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 160,
        "name": "Munition",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0,
                "reload": 1.5,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1.5,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 90,
                "width": 29.4,
                "delay": 0.2,
                "reload": 3,
                "recoil": 0.4,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": false,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 75,
                "width": 29.4,
                "delay": 0.4,
                "reload": 3,
                "recoil": 0.4,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": false,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 29.4,
                "delay": 0.6,
                "reload": 3,
                "recoil": 0.4,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": false,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Penetration",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 161,
        "name": "Psy Trapper",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.85,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "psiEye",
        "sides": 1,
        "maxorbs": 6,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 42,
                "delay": 0,
                "reload": 2.5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "orbittrap",
                    "sizeRatio": 0.8,
                    "health": 1.8,
                    "damage": 0.625,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 6,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 162,
        "name": "Blunderbuss",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.85,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "shotgun3",
                    "sizeRatio": 0.5,
                    "health": 0.325,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.5
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 56.7,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "shotgun3",
                    "sizeRatio": 0.5,
                    "health": 0.325,
                    "damage": 1,
                    "speed": 1.2,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.5
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 57,
                "width": 65.5,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "droneCount": 0,
                "addon": null,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 0.5,
                    "health": 0.325,
                    "damage": 1,
                    "speed": 1.2,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.5
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 163,
        "name": "Machinist",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "auto2",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 164,
        "name": "Wizard",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "canClaimSquares": true,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 4,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.8,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.25,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "canControlDrones": true,
                "bullet": {
                    "type": "necrodrone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.42,
                    "speed": 0.72,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Penetration",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 165,
        "name": "Builder",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 65.1,
                "delay": 0,
                "reload": 3,
                "recoil": 4,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "blockLauncher",
                "bullet": {
                    "type": "block",
                    "sizeRatio": 0.8,
                    "health": 4.5,
                    "damage": 0.75,
                    "speed": 1.5,
                    "scatterRate": 1,
                    "lifeLength": 8,
                    "absorbtionFactor": 0.4
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 166,
        "name": "Nova",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [167, 168,169,204],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
             "devOnly": true,
            "isCelestial": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.2,
        "speed": 0.8,
        "maxHealth": 75,
        "preAddon": "triangle",
        "postAddon": null,
        "sides": 3,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 88,
                "width": 48,
                "delay": 0,
                "reload": 0.8,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.9,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 0,
                "size": 88,
                "width": 48,
                "delay": 0,
                "reload": 0.8,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.9,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 0,
                "size": 85,
                "width": 48,
                "delay": 0,
                "reload": 0.8,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.9,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 0.75
                } 
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 10
            },
            {
                "name": "Bullet Damage",
                "max": 10
            },
            {
                "name": "Bullet Penetration",
                "max": 10
            },
            {
                "name": "Bullet Speed",
                "max": 10
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 167,
        "name": "Pulsar",
        "upgradeMessage": "",
        "levelRequirement": 75,
        "upgrades": [170,171,172,173,200],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true,
            "isCelestial": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.2,
        "speed": 0.8,
        "maxHealth": 75,
        "preAddon": "triangle",
        "postAddon": null,
        "sides": 3,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 30,
                "size": 88,
                "width": 48,
                "delay": 0,
                "reload": 0.8,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 30,
                "size": 88,
                "width": 48,
                "delay": 0,
                "reload": 0.8,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 30,
                "size": 88,
                "width": 48,
                "delay": 0,
                "reload": 0.8,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 0.75
                } 
            },
            {
                "angle": 3.141592653589793,
                "offset": -30,
                "size": 88,
                "width": 48,
                "delay": 0.5,
                "reload": 0.8,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": -30,
                "size": 88,
                "width": 48,
                "delay": 0.5,
                "reload": 0.8,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": -30,
                "size": 88,
                "width": 48,
                "delay": 0.5,
                "reload": 0.8,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 0.75
                } 
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 10
            },
            {
                "name": "Bullet Damage",
                "max": 10
            },
            {
                "name": "Bullet Penetration",
                "max": 10
            },
            {
                "name": "Bullet Speed",
                "max": 10
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 168,
        "name": "Satellite",
        "upgradeMessage": "",
        "levelRequirement": 75,
        "upgrades": [175,176,177,178,201],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true,
            "isCelestial": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.2,
        "speed": 0.8,
        "maxHealth": 75,
        "preAddon": "triangle",
        "postAddon": null,
        "sides": 3,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 80,
                "width": 29.4,
                "delay": 0.35,
                "reload": 12.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 1.2,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 0,
                "size": 80,
                "width": 29.4,
                "delay": 0.35,
                "reload": 12.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 1.2,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 0,
                "size": 80,
                "width": 29.4,
                "delay": 0.35,
                "reload": 12.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 1.2,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 42,
                "size": 75,
                "width": 18.5,
                "delay": 0.1,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 1.6,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 42,
                "size": 75,
                "width": 18.5,
                "delay": 0.1,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 1.6,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 42,
                "size": 75,
                "width": 18.5,
                "delay": 0.1,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 1.6,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": -42,
                "size": 75,
                "width": 18.5,
                "delay": 0.1,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 1.6,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": -42,
                "size": 75,
                "width": 18.5,
                "delay": 0.1,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 1.6,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": -42,
                "size": 75,
                "width": 18.5,
                "delay": 0.1,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 1.6,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 10
            },
            {
                "name": "Bullet Damage",
                "max": 10
            },
            {
                "name": "Bullet Penetration",
                "max": 10
            },
            {
                "name": "Bullet Speed",
                "max": 10
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 169,
        "name": "Debris",
        "upgradeMessage": "",
        "levelRequirement": 75,
        "upgrades": [179,180,181,182,203],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true,
            "isCelestial": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.2,
        "speed": 0.8,
        "maxHealth": 75,
        "preAddon": "triangle",
        "postAddon": null,
        "sides": 3,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 60,
                "width": 51,
                "delay": 0,
                "reload": 4,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 3,
                    "damage": 1.5,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 4.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 0,
                "size": 60,
                "width": 51,
                "delay": 0,
                "reload": 4,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 3,
                    "damage": 1.5,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 4.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 0,
                "size": 60,
                "width": 51,
                "delay": 0,
                "reload": 4,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 3,
                    "damage": 1.5,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 4.5,
                    "absorbtionFactor": 0.75
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 10
            },
            {
                "name": "Trap Damage",
                "max": 10
            },
            {
                "name": "Trap Health",
                "max": 10
            },
            {
                "name": "Trap Speed",
                "max": 10
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 170,
        "name": "Quasar",
        "upgradeMessage": "",
        "levelRequirement": 90,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true,
            "isCelestial": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.2,
        "speed": 0.8,
        "maxHealth": 75,
        "preAddon": "triangle",
        "postAddon": null,
        "sides": 3,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 30,
                "size": 75,
                "width": 48,
                "delay": 0.5,
                "reload": 0.8,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 30,
                "size": 75,
                "width": 48,
                "delay": 0.5,
                "reload": 0.8,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 30,
                "size": 75,
                "width": 48,
                "delay": 0.5,
                "reload": 0.8,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 0.75
                } 
            },
            {
                "angle": 3.141592653589793,
                "offset": -30,
                "size": 75,
                "width": 48,
                "delay": 0.5,
                "reload": 0.8,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": -30,
                "size": 75,
                "width": 48,
                "delay": 0.5,
                "reload": 0.8,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": -30,
                "size": 75,
                "width": 48,
                "delay": 0.5,
                "reload": 0.8,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 0.75
                } 
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 88,
                "width": 48,
                "delay": 0,
                "reload": 0.8,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 0,
                "size": 88,
                "width": 48,
                "delay": 0,
                "reload": 0.8,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 0,
                "size": 88,
                "width": 48,
                "delay": 0,
                "reload": 0.8,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 0.75
                } 
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 10
            },
            {
                "name": "Bullet Damage",
                "max": 10
            },
            {
                "name": "Bullet Penetration",
                "max": 10
            },
            {
                "name": "Bullet Speed",
                "max": 10
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 171,
        "name": "Blazar",
        "upgradeMessage": "",
        "levelRequirement": 90,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true,
            "isCelestial": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.2,
        "speed": 0.8,
        "maxHealth": 75,
        "preAddon": "triangle",
        "postAddon": null,
        "sides": 3,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 88,
                "width": 72,
                "delay": 0,
                "reload": 7,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 6,
                    "damage": 4,
                    "speed": 0.575,
                    "scatterRate": 1,
                    "lifeLength": 0.75,
                    "absorbtionFactor": 0
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 0,
                "size": 88,
                "width": 72,
                "delay": 0,
                "reload": 7,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 6,
                    "damage": 4,
                    "speed": 0.575,
                    "scatterRate": 1,
                    "lifeLength": 0.75,
                    "absorbtionFactor": 0
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 0,
                "size": 88,
                "width": 72,
                "delay": 0,
                "reload": 7,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 6,
                    "damage": 4,
                    "speed": 0.575,
                    "scatterRate": 1,
                    "lifeLength": 0.75,
                    "absorbtionFactor": 0
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 10
            },
            {
                "name": "Bullet Damage",
                "max": 10
            },
            {
                "name": "Bullet Penetration",
                "max": 10
            },
            {
                "name": "Bullet Speed",
                "max": 10
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 172,
        "name": "Magnetar",
        "upgradeMessage": "",
        "levelRequirement": 90,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true,
            "isCelestial": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.6,
        "absorbtionFactor": 0.2,
        "speed": 0.8,
        "maxHealth": 75,
        "preAddon": "triangle",
        "postAddon": null,
        "sides": 3,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 115,
                "width": 48,
                "delay": 0,
                "reload": 1.8,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.2,
                    "damage": 1.2,
                    "speed": 1.7,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.75
                } 
            },
            {
                "angle": 1.0471975511965976,
                "offset": 0,
                "size": 115,
                "width": 48,
                "delay": 0,
                "reload": 1.8,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.2,
                    "damage": 1.2,
                    "speed": 1.7,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.75
                } 
            },
            {
                "angle": -1.0471975511965976,
                "offset": 0,
                "size": 115,
                "width": 48,
                "delay": 0,
                "reload": 1.8,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.2,
                    "damage": 1.2,
                    "speed": 1.7,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.75
                } 
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 10
            },
            {
                "name": "Bullet Damage",
                "max": 10
            },
            {
                "name": "Bullet Penetration",
                "max": 10
            },
            {
                "name": "Bullet Speed",
                "max": 10
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 173,
        "name": "Accretion Disk",
        "upgradeMessage": "",
        "levelRequirement": 90,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true,
            "isCelestial": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.2,
        "speed": 0.8,
        "maxHealth": 75,
        "preAddon": "triangle",
        "postAddon": null,
        "sides": 3,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 88,
                "width": 48,
                "delay": 0,
                "reload": 0.25,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.8,
                    "health": 1.2,
                    "damage": 0.65,
                    "speed": 0.7,
                    "scatterRate": 3,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 0,
                "size": 88,
                "width": 48,
                "delay": 0,
                "reload": 0.25,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.8,
                    "health": 1.2,
                    "damage": 0.65,
                    "speed": 0.7,
                    "scatterRate": 3,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 0,
                "size": 88,
                "width": 48,
                "delay": 0,
                "reload": 0.25,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.8,
                    "health": 1.2,
                    "damage": 0.65,
                    "speed": 0.7,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.75
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 10
            },
            {
                "name": "Bullet Damage",
                "max": 10
            },
            {
                "name": "Bullet Penetration",
                "max": 10
            },
            {
                "name": "Bullet Speed",
                "max": 10
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 174,
        "name": "Chainer",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false,
            "canChain": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.9,
        "speed": 1.1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "chainer",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 0
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 175,
        "name": "Moon",
        "upgradeMessage": "",
        "levelRequirement": 90,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true,
            "isCelestial": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.2,
        "speed": 0.8,
        "maxHealth": 75,
        "preAddon": "triangle",
        "postAddon": null,
        "sides": 3,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 80,
                "width": 29.4,
                "delay": 0.35,
                "reload": 12.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 1.2,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 0,
                "size": 80,
                "width": 29.4,
                "delay": 0.35,
                "reload": 12.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 1.2,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 0,
                "size": 80,
                "width": 29.4,
                "delay": 0.35,
                "reload": 12.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 1.2,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 47,
                "size": 60,
                "width": 12.5,
                "delay": 0.1,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 1.6,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 47,
                "size": 60,
                "width": 12.5,
                "delay": 0.1,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 1.6,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 47,
                "size": 60,
                "width": 12.5,
                "delay": 0.1,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 1.6,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": -47,
                "size": 60,
                "width": 12.5,
                "delay": 0.1,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 1.6,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": -47,
                "size": 60,
                "width": 12.5,
                "delay": 0.1,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 1.6,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": -47,
                "size": 60,
                "width": 12.5,
                "delay": 0.1,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 1.6,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 15,
                "size": 60,
                "width": 12.5,
                "delay": 0.1,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 1.6,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 15,
                "size": 60,
                "width": 12.5,
                "delay": 0.1,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 1.6,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 15,
                "size": 60,
                "width": 12.5,
                "delay": 0.1,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 1.6,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": -15,
                "size": 60,
                "width": 12.5,
                "delay": 0.1,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 1.6,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": -15,
                "size": 60,
                "width": 12.5,
                "delay": 0.1,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 1.6,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": -15,
                "size": 60,
                "width": 12.5,
                "delay": 0.1,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 1.6,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 10
            },
            {
                "name": "Bullet Damage",
                "max": 10
            },
            {
                "name": "Bullet Penetration",
                "max": 10
            },
            {
                "name": "Bullet Speed",
                "max": 10
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 176,
        "name": "Synope",
        "upgradeMessage": "",
        "levelRequirement": 90,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true,
            "isCelestial": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.2,
        "speed": 0.8,
        "maxHealth": 75,
        "preAddon": "triangle",
        "postAddon": null,
        "sides": 3,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 90,
                "width": 55,
                "delay": 0.35,
                "reload": 12.5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "minionLauncher",
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "minion",
                    "sizeRatio": 1,
                    "health": 3,
                    "sides": 3,
                    "damage": 1.2,
                    "speed": 0.7,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 0,
                "size": 90,
                "width": 55,
                "delay": 0.35,
                "reload": 12.5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "minionLauncher",
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "minion",
                    "sizeRatio": 1,
                    "health": 3,
                    "sides": 3,
                    "damage": 1.2,
                    "speed": 0.7,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 0,
                "size": 90,
                "width": 55,
                "delay": 0.35,
                "reload": 12.5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "minionLauncher",
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "minion",
                    "sizeRatio": 1,
                    "health": 3,
                    "sides": 3,
                    "damage": 1.2,
                    "speed": 0.7,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 10
            },
            {
                "name": "Bullet Damage",
                "max": 10
            },
            {
                "name": "Bullet Penetration",
                "max": 10
            },
            {
                "name": "Bullet Speed",
                "max": 10
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 177,
        "name": "Hyperion",
        "upgradeMessage": "",
        "levelRequirement": 90,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true,
            "isCelestial": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.2,
        "speed": 0.8,
        "maxHealth": 75,
        "preAddon": "triangle",
        "postAddon": null,
        "sides": 3,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 80,
                "width": 55,
                "delay": 0,
                "reload": 15.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 4,
                    "damage": 3.5,
                    "speed": 0.625,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.3
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 0,
                "size": 80,
                "width": 55,
                "delay": 0,
                "reload": 15.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 4,
                    "damage": 3.5,
                    "speed": 0.625,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.3
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 0,
                "size": 80,
                "width": 55,
                "delay": 0,
                "reload": 15.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 1,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 4,
                    "damage": 3.5,
                    "speed": 0.625,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.3
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 10
            },
            {
                "name": "Bullet Damage",
                "max": 10
            },
            {
                "name": "Bullet Penetration",
                "max": 10
            },
            {
                "name": "Bullet Speed",
                "max": 10
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 178,
        "name": "Amalthea",
        "upgradeMessage": "",
        "levelRequirement": 90,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true,
            "isCelestial": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.2,
        "speed": 0.8,
        "maxHealth": 75,
        "preAddon": null,
        "postAddon": null,
        "sides": 3,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 30,
                "size": 60,
                "width": 18.5,
                "delay": 0.1,
                "reload": 2.25,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": null,
                "droneCount": 2000,
                "canControlDrones": false,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 1,
                    "health": 0.8,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 0.85,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 30,
                "size": 60,
                "width": 18.5,
                "delay": 0.1,
                "reload": 2.25,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": null,
                "droneCount": 2000,
                "canControlDrones": false,
                "bullet": {
                    "type": "hive",
                    "sizeRatio": 1,
                    "health": 0.8,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 0.85,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 30,
                "size": 60,
                "width": 18.5,
                "delay": 0.1,
                "reload": 2.25,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": null,
                "droneCount": 2000,
                "canControlDrones": false,
                "bullet": {
                    "type": "hive",
                    "sizeRatio": 1,
                    "health": 0.8,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 0.85,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": -30,
                "size": 60,
                "width": 18.5,
                "delay": 0.1,
                "reload": 2.25,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": null,
                "droneCount": 2000,
                "canControlDrones": false,
                "bullet": {
                    "type": "hive",
                    "sizeRatio": 1,
                    "health": 0.8,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 0.85,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": -30,
                "size": 60,
                "width": 18.5,
                "delay": 0.1,
                "reload": 2.25,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": null,
                "droneCount": 2000,
                "canControlDrones": false,
                "bullet": {
                    "type": "hive",
                    "sizeRatio": 1,
                    "health": 0.8,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 0.85,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": -30,
                "size": 60,
                "width": 18.5,
                "delay": 0.1,
                "reload": 2.25,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": null,
                "droneCount": 2000,
                "canControlDrones": false,
                "bullet": {
                    "type": "hive",
                    "sizeRatio": 1,
                    "health": 0.8,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 0.85,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 80,
                "width": 29.4,
                "delay": 0.35,
                "reload": 6.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": null,
                "droneCount": 2000,
                "canControlDrones": true,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 1,
                    "health": 1.2,
                    "damage": 0.9,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 4,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 0,
                "size": 80,
                "width": 29.4,
                "delay": 0.35,
                "reload": 6.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": null,
                "droneCount": 2000,
                "canControlDrones": true,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 1,
                    "health": 1.2,
                    "damage": 0.9,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 4,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 0,
                "size": 80,
                "width": 29.4,
                "delay": 0.35,
                "reload": 6.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": null,
                "droneCount": 2000,
                "canControlDrones": true,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 1,
                    "health": 1.2,
                    "damage": 0.9,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 4,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 10
            },
            {
                "name": "Bullet Damage",
                "max": 10
            },
            {
                "name": "Bullet Penetration",
                "max": 10
            },
            {
                "name": "Bullet Speed",
                "max": 10
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 179,
        "name": "Asteroid",
        "upgradeMessage": "",
        "levelRequirement": 90,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true,
            "isCelestial": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.2,
        "speed": 0.8,
        "maxHealth": 75,
        "preAddon": null,
        "postAddon": null,
        "sides": 3,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 60,
                "width": 43,
                "delay": 0,
                "reload": 4,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2.5,
                    "damage": 1.5,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 4.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 0,
                "size": 60,
                "width": 43,
                "delay": 0,
                "reload": 4,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2.5,
                    "damage": 1.5,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 4.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 0,
                "size": 60,
                "width": 43,
                "delay": 0,
                "reload": 4,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2.5,
                    "damage": 1.5,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 4.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 42,
                "size": 55,
                "width":  21,
                "delay": 0.33,
                "reload": 2,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.5,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 42,
                "size": 55,
                "width":  21,
                "delay": 0.33,
                "reload": 2,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.5,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 42,
                "size": 55,
                "width":  21,
                "delay": 0.33,
                "reload": 2,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.5,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": -42,
                "size": 55,
                "width":  21,
                "delay": 0.66,
                "reload": 2,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.5,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": -42,
                "size": 55,
                "width":  21,
                "delay": 0.66,
                "reload": 2,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.5,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": -42,
                "size": 55,
                "width":  21,
                "delay": 0.66,
                "reload": 2,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.5,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 0.75
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 10
            },
            {
                "name": "Trap Damage",
                "max": 10
            },
            {
                "name": "Trap Health",
                "max": 10
            },
            {
                "name": "Trap Speed",
                "max": 10
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 180,
        "name": "Charon",
        "upgradeMessage": "",
        "levelRequirement": 90,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true,
            "isCelestial": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.2,
        "speed": 0.8,
        "maxHealth": 75,
        "preAddon": null,
        "postAddon": null,
        "sides": 3,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 60,
                "width": 70,
                "delay": 0,
                "reload": 6,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 4.5,
                    "damage": 2.5,
                    "speed": 0.9,
                    "scatterRate": 1,
                    "lifeLength": 4.5,
                    "absorbtionFactor": 0.1
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 0,
                "size": 60,
                "width": 70,
                "delay": 0,
                "reload": 6,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 4.5,
                    "damage": 2.5,
                    "speed": 0.9,
                    "scatterRate": 1,
                    "lifeLength": 4.5,
                    "absorbtionFactor": 0.1
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 0,
                "size": 60,
                "width": 70,
                "delay": 0,
                "reload": 6,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 4.5,
                    "damage": 2.5,
                    "speed": 0.9,
                    "scatterRate": 1,
                    "lifeLength": 4.5,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 10
            },
            {
                "name": "Trap Damage",
                "max": 10
            },
            {
                "name": "Trap Health",
                "max": 10
            },
            {
                "name": "Trap Speed",
                "max": 10
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 181,
        "name": "Meteor",
        "upgradeMessage": "",
        "levelRequirement": 90,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true,
            "isCelestial": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.2,
        "speed": 0.8,
        "maxHealth": 75,
        "preAddon": null,
        "postAddon": null,
        "sides": 3,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 75,
                "width": 51,
                "delay": 0,
                "reload": 4,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "engitrapLauncher",
                "bullet": {
                    "type": "autotrap",
                    "sizeRatio": 0.8,
                    "health": 3,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 2.75,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 0,
                "size": 75,
                "width": 51,
                "delay": 0,
                "reload": 4,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "engitrapLauncher",
                "bullet": {
                    "type": "autotrap",
                    "sizeRatio": 0.8,
                    "health": 3,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 2.75,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 0,
                "size": 75,
                "width": 51,
                "delay": 0,
                "reload": 4,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "engitrapLauncher",
                "bullet": {
                    "type": "autotrap",
                    "sizeRatio": 0.8,
                    "health": 3,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 2.75,
                    "absorbtionFactor": 0.75
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 10
            },
            {
                "name": "Trap Damage",
                "max": 10
            },
            {
                "name": "Trap Health",
                "max": 10
            },
            {
                "name": "Trap Speed",
                "max": 10
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 182,
        "name": "Hadron",
        "upgradeMessage": "",
        "levelRequirement": 90,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true,
            "isCelestial": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.2,
        "speed": 0.8,
        "maxHealth": 75,
        "preAddon": null,
        "postAddon": null,
        "sides": 3,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 90,
                "width": 45,
                "delay": 0,
                "reload": 6,
                "canControlDrones": true,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": "reversetrap",
                "bullet": {
                    "type": "striker",
                    "sizeRatio": 0.8,
                    "health": 3,
                    "damage": 1,
                    "speed": 3,
                    "scatterRate": 1,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 0,
                "size": 90,
                "width": 45,
                "delay": 0,
                "reload": 6,
                "canControlDrones": true,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": "reversetrap",
                "bullet": {
                    "type": "striker",
                    "sizeRatio": 0.8,
                    "health": 3,
                    "damage": 1,
                    "speed": 3,
                    "scatterRate": 1,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 0,
                "size": 90,
                "width": 45,
                "delay": 0,
                "reload": 6,
                "recoil": 0,
                "canControlDrones": true,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": "reversetrap",
                "bullet": {
                    "type": "striker",
                    "sizeRatio": 0.8,
                    "health": 3,
                    "damage": 1,
                    "speed": 3,
                    "scatterRate": 1,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 10
            },
            {
                "name": "Trap Damage",
                "max": 10
            },
            {
                "name": "Trap Health",
                "max": 10
            },
            {
                "name": "Trap Speed",
                "max": 10
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 183,
        "name": "Barricade",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [82, 184,191, 185, 220,57],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                 "width": 39.9,
                "delay": 0,
                "reload": 3,
                "recoil": 0.75,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 0.5,
                    "speed": 2.5,
                    "scatterRate": 0.3,
                    "lifeLength": 4,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                 "width": 39.9,
                "delay": 0.5,
                "reload": 3,
                "recoil": 0.75,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 0.5,
                    "speed": 2.5,
                    "scatterRate": 0.3,
                    "lifeLength": 4,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 184,
        "name": "Warkwark",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle":-0.1308996938995747,
                "offset": -28,
                "size": 65,
                "width": 39.9,
                "delay": 0,
                "reload": 2,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.6,
                    "damage": 0.5,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle":0.1308996938995747,
                "offset": 28,
                "size": 65,
                "width": 39.9,
                "delay": 0.5,
                "reload": 2,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.6,
                    "damage": 0.5,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle":3.0106929596902186,
                "offset": -28,
                "size": 65,
                "width": 39.9,
                "delay": 0,
                "reload": 2,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.6,
                    "damage": 0.5,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle":-3.0106929596902186,
                "offset": 28,
                "size": 65,
                "width": 39.9,
                "delay": 0.5,
                "reload": 2,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.6,
                    "damage": 0.5,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 5,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 185,
        "name": "Arsenal",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                 "width": 42,
                "delay": 0,
                "reload": 5,
                "recoil": 0.75,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "engitrapLauncher",
                "bullet": {
                    "type": "autotrap",
                    "sizeRatio": 0.8,
                    "health": 1.8,
                    "damage": 0.5,
                    "speed": 1.5,
                    "scatterRate": 1,
                    "lifeLength": 4,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                 "width": 42,
                "delay": 0.5,
                "reload": 5,
                "recoil": 0.75,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "engitrapLauncher",
                "bullet": {
                    "type": "autotrap",
                    "sizeRatio": 0.8,
                    "health": 1.8,
                    "damage": 0.5,
                    "speed": 1.5,
                    "scatterRate": 1,
                    "lifeLength": 4,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 186,
        "name": "Eroder",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "pronounced",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 90,
                "width": 42,
                "delay": 0,
                "reload": 3.5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "engitrapLauncher",
                "bullet": {
                    "sides": 6,
                    "type": "boomerang",
                    "sizeRatio": 0.9,
                    "health": 1.5,
                    "damage": 1,
                    "speed": 1.5,
                    "scatterRate": 1,
                    "lifeLength": 5,
                    "absorbtionFactor": 0.75
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 187,
        "name": "Horizon",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0.39269908169872414,
                "offset": 0,
                "size": 82.5,
                "width": 25.2,
                "delay": 0,
                "reload": 1.25,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.39269908169872414,
                "offset": 0,
                "size": 82.5,
                "width": 25.2,
                "delay": 0,
                "reload": 1.25,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.1780972450961724,
                "offset": 0,
                "size": 82.5,
                "width":  21,
                "width": 25.2,
                "delay": 0,
                "reload": 1.25,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.1780972450961724,
                "offset": 0,
                "size": 82.5,
                "width": 25.2,
                "delay": 0,
                "reload": 1.25,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.7853981633974483,
                "offset": 0,
                "size": 82.5,
                "width": 25.2,
                "delay": 0,
                "reload": 1.25,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.7853981633974483,
                "offset": 0,
                "size": 82.5,
                "width":  21,
                "width": 25.2,
                "delay": 0,
                "reload": 1.25,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.5707963267948966,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1.25,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1.25,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1.25,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 188,
        "name": "Machine Flank",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [189,190, 163, 118],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 0.5,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.7,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 0.5,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.7,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 189,
        "name": "Bullet Hell",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 0.5,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.7,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.5707963267948966,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 0.5,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.7,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 0.5,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.7,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 0.5,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.7,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 190,
        "name": "Trail Blazer",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 0.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.7,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 0.75,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.665191429188092,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 2.25,
                "isTrapezoid": false,
                "inverseFire": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.6179938779914944,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 2.25,
                "isTrapezoid": false,
                "inverseFire": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 85,
                "width": 42,
                "delay": 0,
                "inverseFire": true,
                "reload": 0.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.7,
                    "speed": 0.5,
                    "scatterRate": 2,
                    "lifeLength": 1.6,
                    "absorbtionFactor": 0.325
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 191,
        "name": "Bunker",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0.6981317007977318,
                "offset": 0,
                "size": 55,
                "width": 34,
                "delay": 0.6666,
                "reload": 3,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.5,
                    "damage": 0.75,
                    "speed": 1.5,
                    "scatterRate": 0.3,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.6981317007977318,
                "offset": 0,
                "size": 55,
                "width": 34,
                "delay": 0.6666,
                "reload": 3,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.5,
                    "damage": 0.75,
                    "speed": 1.5,
                    "scatterRate": 0.3,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.3490658503988659,
                "offset": 0,
                "size": 67.5,
                "width": 34,
                "delay": 0.3333,
                "reload": 3,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.5,
                    "damage": 0.75,
                    "speed": 1.5,
                    "scatterRate": 0.3,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.3490658503988659,
                "offset": 0,
                "size": 67.5,
                "width": 34,
                "delay": 0.3333,
                "reload": 3,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.5,
                    "damage": 0.75,
                    "speed": 1.5,
                    "scatterRate": 0.3,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1.5,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Penetration",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 192,
        "name": "Conjoined",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": -26,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0.75,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 26,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.75,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 1,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "inverseFire": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 0.5,
                "recoil": 1,
                "inverseFire": true,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.7,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 193,
        "name": "Mine Sweeper",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 54.6,
                "delay": 0,
                "reload": 5.5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "droneCount": 10,
                "addon": "mineLauncher",
                "bullet": {
                    "type": "mine",
                    "sizeRatio": 0.8,
                    "health": 4.5,
                    "damage":1.1,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.5
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Mine Damage",
                "max": 7
            },
            {
                "name": "Mine Health",
                "max": 7
            },
            {
                "name": "Mine Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 194,
        "name": "Sticky Bomber",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0,
                "reload": 3,
                "recoil": 0.25,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "droneCount": 8,
                "addon": "stickyLauncher",
                "bullet": {
                    "type": "mine",
                    "sizeRatio": 0.8,
                    "health": 4,
                    "damage":0.1,
                    "speed": 2,
                    "scatterRate": 0.3,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.25,
                    "sides":8
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Mine Damage",
                "max": 7
            },
            {
                "name": "Mine Health",
                "max": 7
            },
            {
                "name": "Mine Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 195,
        "name": "Wraith",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "canClaimSquareswep": true,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "overdrive",
        "sides": 4,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.25,
                "reload": 8,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": "NecLauncher",
                "droneCount": 0,
                "canControlDrones": true,
                "bullet": {
                    "type": "wepnecrodrone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.42,
                    "speed": 0.845,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Drone Count",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 196,
        "name": "Seaker",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [197, 198, 225, 156,259],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "bullet": {
                    "type": "homing",
                    "sizeRatio": 1,
                    "health": 0.75,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 58.8,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 0,
                    "health": 0,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 0.3,
                    "lifeLength": 0,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 197,
        "name": "Helix",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -0.39269908169872414,
                "offset": 0,
                "size": 95,
                "width": 33.6,
                "delay": 0.5,
                "reload": 1.5,
                "recoil": 0.4,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "bullet": {
                    "type": "homing",
                    "sizeRatio": 1,
                    "health": 0.75,
                    "damage": 0.75,
                    "speed": 1.25,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.39269908169872414,
                "offset": 0,
                "size": 60,
                "width": 50.4,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 0,
                    "health": 0,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 0.3,
                    "lifeLength": 0,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.39269908169872414,
                "offset": 0,
                "size": 95,
                "width": 33.6,
                "delay": 0.5,
                "reload": 1.5,
                "recoil": 0.4,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "bullet": {
                    "type": "homing",
                    "sizeRatio": 1,
                    "health": 0.75,
                    "damage": 0.75,
                    "speed": 1.25,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.39269908169872414,
                "offset": 0,
                "size": 60,
                "width": 50.4,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 0,
                    "health": 0,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 0.3,
                    "lifeLength": 0,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 100,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0.8,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 198,
        "name": "Missiler",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.85,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 92.5,
                "width": 39.375,
                "delay": 0,
                "reload": 2.5,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection":  0,
                "droneCount":0,
                "addon": null,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 3,
                    "damage": 1,
                    "speed": 0.45,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 50,
                "delay": 0,
                "reload": 3,
                "recoil": 3,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": null,
                "bullet": {
                    "type": "homingrocket",
                    "sizeRatio": 1,
                    "health": 2.5,
                    "damage": 0.8,
                    "speed": 0.55,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 70,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 0,
                    "health": 0,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 0.3,
                    "lifeLength": 0,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Rocket Damage",
                "max": 7
            },
            {
                "name": "Rocket Penetration",
                "max": 7
            },
            {
                "name": "Rocket Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 199,
        "name": "Orbital",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.85,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": "launcheralt",
        "postAddon": "psiEye",
        "sides": 1,
        "maxorbs": 4,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 92.5,
                "width": 39.375,
                "delay": 0,
                "reload": 2.5,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection":  0,
                "droneCount":0,
                "addon": null,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 3,
                    "damage": 1,
                    "speed": 0.45,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 52.5,
                "delay": 0.25,
                "reload": 4,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": "null",
                "droneCount": 4,
                "bullet": {
                    "type": "orbitrocket",
                    "sizeRatio": 1,
                    "health": 3,
                    "damage": 0.55,
                    "speed": 1.5,
                    "scatterRate": 0,
                    "lifeLength": 0.65,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 200,
        "name": "Neutron",
        "upgradeMessage": "",
        "levelRequirement": 90,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true,
            "isCelestial": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.8,
        "absorbtionFactor": 0.2,
        "speed": 0.8,
        "maxHealth": 75,
        "preAddon": null,
        "postAddon": "psiEye",
        "maxorbs": 60,
        "sides": 3,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 30,
                "size": 88,
                "width":  21,
                "delay": 0,
                "reload": 0.8,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": null,
                "bullet": {
                    "type": "orbit",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.35,
                    "speed": 3,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.25
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 30,
                "size": 88,
                "width":  21,
                "delay": 0,
                "reload": 0.8,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": null,
                "bullet": {
                    "type": "orbit",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.35,
                    "speed": 3,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.25
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 30,
                "size": 88,
                "width":  21,
                "delay": 0,
                "reload": 0.8,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": null,
                "bullet": {
                    "type": "orbit",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.35,
                    "speed": 3,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.25
                } 
            },
            {
                "angle": 3.141592653589793,
                "offset": -30,
                "size": 88,
                "width":  21,
                "delay": 0,
                "reload": 0.8,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": null,
                "bullet": {
                    "type": "orbit",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.35,
                    "speed": 3,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.25
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": -30,
                "size": 88,
                "width":  21,
                "delay": 0,
                "reload": 0.8,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": null,
                "bullet": {
                    "type": "orbit",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.35,
                    "speed": 3,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.25
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": -30,
                "size": 88,
                "width":  21,
                "delay": 0,
                "reload": 0.8,
                "recoil": 0,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "addon": null,
                "bullet": {
                    "type": "orbit",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.35,
                    "speed": 3,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.25
                } 
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 10
            },
            {
                "name": "Bullet Damage",
                "max": 10
            },
            {
                "name": "Bullet Penetration",
                "max": 10
            },
            {
                "name": "Bullet Speed",
                "max": 10
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 201,
        "name": "Sputnik",
        "upgradeMessage": "",
        "levelRequirement": 90,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true,
            "isCelestial": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.2,
        "speed": 0.8,
        "maxHealth": 75,
        "preAddon": null,
        "postAddon": "overdrive",
        "sides": 3,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 35,
                "size": 75,
                "width": 27.3,
                "delay": 0.1,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "autodrone",
                    "sizeRatio": 1,
                    "health": 1.6,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 35,
                "size": 75,
                "width": 27.3,
                "delay": 0.1,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "autodrone",
                    "sizeRatio": 1,
                    "health": 1.6,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 35,
                "size": 75,
                "width": 27.3,
                "delay": 0.1,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "autodrone",
                    "sizeRatio": 1,
                    "health": 1.6,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": -35,
                "size": 75,
                "width": 27.3,
                "delay": 0.1,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "autodrone",
                    "sizeRatio": 1,
                    "health": 1.6,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": -35,
                "size": 75,
                "width": 27.3,
                "delay": 0.1,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "autodrone",
                    "sizeRatio": 1,
                    "health": 1.6,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": -35,
                "size": 75,
                "width": 27.3,
                "delay": 0.1,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": true,
                "bullet": {
                    "type": "autodrone",
                    "sizeRatio": 1,
                    "health": 1.6,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 10
            },
            {
                "name": "Bullet Damage",
                "max": 10
            },
            {
                "name": "Bullet Penetration",
                "max": 10
            },
            {
                "name": "Bullet Speed",
                "max": 10
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 202,
        "name": "Cuck",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "cuck",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 71.4,
                "delay": 0,
                "reload": 4,
                "recoil": 15,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 3,
                    "speed": 0.7,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 203,
        "name": "Oort",
        "upgradeMessage": "",
        "levelRequirement": 90,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true,
            "isCelestial": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.2,
        "speed": 0.8,
        "maxHealth": 75,
        "preAddon": null,
        "postAddon": null,
        "sides": 3,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 80,
                "width": 43,
                "delay": 0,
                "reload": 4,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "boomerang",
                    "sizeRatio": 0.8,
                    "health": 3,
                    "damage": 1.5,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 4.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 0,
                "size": 80,
                "width": 43,
                "delay": 0,
                "reload": 4,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "boomerang",
                    "sizeRatio": 0.8,
                    "health": 3,
                    "damage": 1.5,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 4.5,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 0,
                "size": 80,
                "width": 43,
                "delay": 0,
                "reload": 4,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "boomerang",
                    "sizeRatio": 0.8,
                    "health": 3,
                    "damage": 1.5,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 4.5,
                    "absorbtionFactor": 0.75
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 10
            },
            {
                "name": "Trap Damage",
                "max": 10
            },
            {
                "name": "Trap Health",
                "max": 10
            },
            {
                "name": "Trap Speed",
                "max": 10
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 204,
        "name": "Chasm",
        "upgradeMessage": "",
        "levelRequirement": 75,
        "upgrades": [205,206, 207],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
             "devOnly": true,
            "isCelestial": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.2,
        "speed": 0.975,
        "maxHealth": 75,
        "preAddon": null,
        "postAddon": "chasm",
        "sides": 3,
        "borderWidth": 15,
        "barrels": [
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 12
            },
            {
                "name": "Reload",
                "max": 0
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 12
            },
            {
                "name": "Max Health",
                "max": 12
            },
            {
                "name": "Health Regen",
                "max": 12
            }
        ]
    },
    {
        "id": 205,
        "name": "Void",
        "upgradeMessage": "",
        "levelRequirement": 90,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
             "devOnly": true,
            "isCelestial": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.2,
        "speed": 1.1,
        "maxHealth": 75,
        "preAddon": null,
        "postAddon": "void",
        "sides": 3,
        "borderWidth": 15,
        "barrels": [
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 12
            },
            {
                "name": "Reload",
                "max": 0
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 12
            },
            {
                "name": "Max Health",
                "max": 12
            },
            {
                "name": "Health Regen",
                "max": 12
            }
        ]
    },
    {
        "id": 206,
        "name": "Comet",
        "upgradeMessage": "",
        "levelRequirement": 90,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
             "devOnly": true,
            "isCelestial": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.5,
        "speed": 1.75,
        "maxHealth": 75,
        "preAddon": null,
        "postAddon": "comet",
        "sides": 3,
        "borderWidth": 15,
        "barrels": [
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 12
            },
            {
                "name": "Reload",
                "max": 0
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 12
            },
            {
                "name": "Max Health",
                "max": 12
            },
            {
                "name": "Health Regen",
                "max": 12
            }
        ]
    },
    {
        "id": 207,
        "name": "Abyss",
        "upgradeMessage": "",
        "levelRequirement": 90,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
             "devOnly": true,
            "isCelestial": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.05,
        "speed": 0.85,
        "maxHealth": 75,
        "preAddon": null,
        "postAddon": "abyss",
        "sides": 3,
        "borderWidth": 15,
        "barrels": [
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 12
            },
            {
                "name": "Reload",
                "max": 0
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 12
            },
            {
                "name": "Max Health",
                "max": 12
            },
            {
                "name": "Health Regen",
                "max": 12
            }
        ]
    },
    {
        "id": 208,
        "name": "Sprinkler",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "spinner",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "null",
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 209,
        "name": "Obtuse-Angle",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.665191429188092,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 2.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.6179938779914944,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 2.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.5707963267948966,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.25,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": false,
                "bullet": {
                    "type": "dronenorep",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.7,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.25,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": false,
                "bullet": {
                    "type": "dronenorep",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.7,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 210,
        "name": "The Log",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 2,
        "widthRatio": 3,
        "baseSizeOverride": 500,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 20,
                "size": 60,
                 "width": 30.45,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": -20,
                "size": 60,
                 "width": 30.45,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.5707963267948966,
                "offset": 0,
                "distance": 50,
                "size": 60,
                 "width": 30.45,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "distance": 50,
                "size": 60,
                 "width": 30.45,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 20,
                "size": 60,
                 "width": 30.45,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": -20,
                "size": 60,
                 "width": 30.45,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.75,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 211,
        "name": "Falcon",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.85,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.665191429188092,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 1.75,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.6179938779914944,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 1.75,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 90,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1.75,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.2,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 0.5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 120,
                "width": 42,
                "delay": 0,
                "reload": 1.5,
                "recoil": 3,
                "inverseFire": true,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1.35,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 212,
        "name": "Bouncer",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [213, 214,158],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0,
                "reload": 1.5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "bounceLauncher",
                "bullet": {
                    "type": "bouncer",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1.25,
                    "speed": 1.5,
                    "scatterRate": 1,
                    "lifeLength": 3,
                    "absorbtionFactor": 0.75
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 213,
        "name": "Curve Baller",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 100,
                "width": 42,
                "delay": 0,
                "reload": 2,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "bounceLauncher",
                "bullet": {
                    "type": "bouncer",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 2,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 3,
                    "absorbtionFactor": 0.75
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 214,
        "name": "Flooder",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 90,
                "width": 34,
                "delay": 0,
                "reload": 0.75,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "bounceLauncher",
                "bullet": {
                    "type": "bouncer",
                    "sizeRatio": 1,
                    "health": 0.4,
                    "damage": 0.3,
                    "speed": 1.5,
                    "scatterRate": 1,
                    "lifeLength": 2,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 34,
                "delay": 0.33,
                "reload": 0.75,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "bounceLauncher",
                "bullet": {
                    "type": "bouncer",
                    "sizeRatio": 1,
                    "health": 0.4,
                    "damage": 0.3,
                    "speed": 1.5,
                    "scatterRate": 1,
                    "lifeLength": 2,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 70,
                "width": 34,
                "delay": 0.66,
                "reload": 0.75,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "bounceLauncher",
                "bullet": {
                    "type": "bouncer",
                    "sizeRatio": 1,
                    "health": 0.4,
                    "damage": 0.3,
                    "speed": 1.5,
                    "scatterRate": 1,
                    "lifeLength": 2,
                    "absorbtionFactor": 0.75
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 215,
        "name": "Hydra",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -0.39269908169872414,
                "offset": 0,
                "size": 90,
                "width": 42,
                "delay": 0.5,
                "reload": 0.5,
                "recoil": 0.65,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.7,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 2,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.39269908169872414,
                "offset": 0,
                "size": 90,
                "width": 42,
                "delay": 0.5,
                "reload": 0.5,
                "recoil": 0.65,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.7,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 2,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 100,
                "width": 42,
                "delay": 0,
                "reload": 0.5,
                "recoil": 0.65,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.7,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 2,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 216,
        "name": "Bent Shot",
        "upgradeMessage": "",
        "levelRequirement": 15,
        "upgrades": [132,218,23, 217,17,9],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0.2617993877991494,
                "offset": 8,
                "size": 83,
                "width": 29.4,
                "delay": 0.5,
                "reload": 1.2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.2617993877991494,
                "offset": -8,
                "size": 83,
                "width": 29.4,
                "delay": 0.5,
                "reload": 1.2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1.2,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "null",
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 217,
        "name": "Side Arm",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [191,220,82,54],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0.3490658503988659,
                "offset": 0,
                "size": 55,
                "width": 34,
                "delay": 0.5,
                "reload": 2.5,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.5,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 2,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.3490658503988659,
                "offset": 0,
                "size": 55,
                "width": 34,
                "delay": 0.5,
                "reload": 2.5,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.5,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 2,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "null",
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Penetration",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 218,
        "name": "Outlet",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [219,222,58, 187],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 1.5707963267948966,
                "offset": -75,
                
                "size": 36,
                "width":  21,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.3,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.5707963267948966,
                "offset": 75,
                
                "size": 36,
                "width":  21,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.3,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": -45,
                
                "size": 36,
                "width":  21,
                "delay": 0.75,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.3,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.5707963267948966,
                "offset": 45,
                
                "size": 36,
                "width":  21,
                "delay": 0.75,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.3,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "null",
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 219,
        "name": "Charger",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 1.5707963267948966,
                "offset": -75,
                "distance":1.26,
                "size": 36,
                "width":  21,
                "delay": 1,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.3,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.5707963267948966,
                "offset": 75,
                "distance":1.26,
                "size": 36,
                "width":  21,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.3,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": -45,
                "distance":1.26,
                "size": 36,
                "width":  21,
                "delay": 1.25,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.3,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.5707963267948966,
                "offset": 45,
                "distance":1.26,
                "size": 36,
                "width":  21,
                "delay": 0.75,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.3,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": -26,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0.75,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 26,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.75,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 220,
        "name": "Split Trapper",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0.3490658503988659,
                "offset": 10,
                "size": 60,
                "width": 39.9,
                "delay": 0.5,
                "reload": 2.5,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.75,
                    "damage": 0.85,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.3490658503988659,
                "offset": -10,
                "size": 60,
                "width": 39.9,
                "delay": 0.5,
                "reload": 2.5,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.75,
                    "damage": 0.85,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 75,
                "width": 39.9,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.75,
                    "damage": 0.85,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 5,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 221,
        "name": "Micro Smasher",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "baseSizeOverride": 50,
        "absorbtionFactor": 2,
        "speed": 1.2,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "microsmasher",
        "sides": 1,
        "borderWidth": -10,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Smallness",
                "max": 10
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 222,
        "name": "Plug",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 1.5707963267948966,
                "offset": -75,
                "size": 36,
                "width":  21,
                "delay": 0.75,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.3,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.5707963267948966,
                "offset": 75,
                "size": 36,
                "width":  21,
                "delay": 0.75,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.3,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": -45,
                "size": 36,
                "width":  21,
                "delay": 0.75,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.3,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.5707963267948966,
                "offset": 45,
                "size": 36,
                "width":  21,
                "delay": 0.75,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.3,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": -60,
                
                "size": 44,
                "width":  21,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.3,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.5707963267948966,
                "offset": 60,
                "size": 44,
                "width":  21,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.3,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "null",
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 223,
        "name": "Scrap",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [81,129,154,98, 99,270],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 35.7,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.2,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 6,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.0943951023931953,
                "offset": 0,
                "size": 60,
                "width": 35.7,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.2,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 6,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -2.0943951023931953,
                "offset": 0,
                "size": 60,
                "width": 35.7,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.2,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 6,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 224,
        "name": "Sidewinder",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": "launchertall",
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 100,
                "width": 60.9,
                "delay": 0,
                "reload": 4,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "snake",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 1.5,
                    "speed": 0.2,
                    "scatterRate": 0.3,
                    "lifeLength": 2.5,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Rocket Damage",
                "max": 7
            },
            {
                "name": "Rocket Penetration",
                "max": 7
            },
            {
                "name": "Rocket Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 225,
        "name": "Hommer",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 52.5,
                "delay": 0,
                "reload": 0.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "homing",
                    "sizeRatio": 0.8,
                    "health": 0.8,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 80,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 0,
                    "health": 0,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 0.3,
                    "lifeLength": 0,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 226,
        "name": "Grower",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [120, 230,231,252],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 100,
                "width": 56.7,
                "delay": 0,
                "reload": 3,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "growLauncher",
                "bullet": {
                    "type": "grower",
                    "sizeRatio": 1,
                    "health": 1.5,
                    "damage": 1.5,
                    "speed": 0.5,
                    "scatterRate": 1,
                    "lifeLength": 2,
                    "absorbtionFactor": 0.4
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 227,
        "name": "Machine Sniper",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0,
                "reload": 0.75,
                "recoil": 1.5,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.7,
                    "speed": 1.5,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 228,
        "name": "TESTBED",
        "upgradeMessage": "",
        "levelRequirement": 15,
        "upgrades": [145,242,146,130, -15,91,92,93,106,107, -13,227,166,229],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 100,
                "width": 50,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.5,
                    "damage": 1.5,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 229,
        "name": "Summoner",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "canClaimSquares": true,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 4,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -1.5707963267948966,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.25,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "canControlDrones": true,
                 
                "bullet": {
                    "type": "necrodrone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.42,
                    "speed": 0.72,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.25,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "canControlDrones": true,
                 
                "bullet": {
                    "type": "necrodrone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.42,
                    "speed": 0.72,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.25,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "canControlDrones": true,
                 
                "bullet": {
                    "type": "necrodrone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.42,
                    "speed": 0.72,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.25,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "canControlDrones": true,
                 
                "bullet": {
                    "type": "necrodrone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.42,
                    "speed": 0.72,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Drone Count",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 230,
        "name": "Steam Roller",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 67.2,
                "delay": 0,
                "reload": 8,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "growLauncher",
                "bullet": {
                    "type": "grower",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 2,
                    "speed": 0.35,
                    "scatterRate": 1,
                    "lifeLength": 4.25,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 231,
        "name": "Triple Grower",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 100,
                "width": 50.4,
                "delay": 0,
                "reload": 3,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "growLauncher",
                "bullet": {
                    "type": "grower",
                    "sizeRatio": 1,
                    "health": 1.25,
                    "damage": 1.25,
                    "speed": 0.5,
                    "scatterRate": 1,
                    "lifeLength": 2,
                    "absorbtionFactor": 0.4
                }
            },
            {
                "angle": 2.0943951023931953,
                "offset": 0,
                "size": 100,
                "width": 50.4,
                "delay": 0,
                "reload": 3,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "growLauncher",
                "bullet": {
                    "type": "grower",
                    "sizeRatio": 1,
                    "health": 1.25,
                    "damage": 1.25,
                    "speed": 0.5,
                    "scatterRate": 1,
                    "lifeLength": 2,
                    "absorbtionFactor": 0.4
                }
            },
            {
                "angle": -2.0943951023931953,
                "offset": 0,
                "size": 100,
                "width": 50.4,
                "delay": 0,
                "reload": 3,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "growLauncher",
                "bullet": {
                    "type": "grower",
                    "sizeRatio": 1,
                    "health": 1.25,
                    "damage": 1.25,
                    "speed": 0.5,
                    "scatterRate": 1,
                    "lifeLength": 2,
                    "absorbtionFactor": 0.4
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 232,
        "name": "CrossFire",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -0.7853981633974483,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.7853981633974483,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 233,
        "name": "Automated",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [234, 70, 235,236],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 2,
                "recoil": 1.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "autoLauncher",
                "bullet": {
                    "type": "autobullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1.25,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 234,
        "name": "Auto Auto 3",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "autoauto3",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 235,
        "name": "Mecha",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0.3490658503988659,
                "offset": 6,
                "size": 90,
                "width": 42,
                "delay": 0.5,
                "reload": 1.5,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "autoLauncher",
                "bullet": {
                    "type": "autobullet",
                    "sizeRatio": 1,
                    "health": 0.6,
                    "damage": 0.6,
                    "speed": 0.8,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.3490658503988659,
                "offset": -6,
                "size": 90,
                "width": 42,
                "delay": 0.5,
                "reload": 1.5,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "autoLauncher",
                "bullet": {
                    "type": "autobullet",
                    "sizeRatio": 1,
                    "health": 0.6,
                    "damage": 0.6,
                    "speed": 0.8,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 105,
                "width": 42,
                "delay": 0,
                "reload": 1.5,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "autoLauncher",
                "bullet": {
                    "type": "autobullet",
                    "sizeRatio": 1,
                    "health": 0.6,
                    "damage": 0.6,
                    "speed": 0.8,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 236,
        "name": "Actuator",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 71.4,
                "delay": 0,
                "reload": 5,
                "recoil": 15,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "autoLauncher",
                "bullet": {
                    "type": "autobullet",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 3,
                    "speed": 0.55,
                    "scatterRate": 1,
                    "lifeLength": 1.25,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 237,
        "name": "Blaster",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [238, 162,239,240, 241,244],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 100,
                "width": 60.9,
                "delay": 0,
                "reload": 5,
                "recoil": 6,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "shotgun4",
                    "sizeRatio": 0.4,
                    "health": 0.75,
                    "damage": 0.8,
                    "speed": 0.8,
                    "scatterRate": 2,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.4
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 57,
                "width": 70,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "droneCount": 0,
                "addon": null,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 0.5,
                    "health": 0.325,
                    "damage": 1,
                    "speed": 1.2,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.5
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 238,
        "name": "Shotgun",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 100,
                "width": 75,
                "delay": 0,
                "reload": 7.5,
                "recoil": 14,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "shotgun9",
                    "sizeRatio": 0.32,
                    "health": 0.65,
                    "damage": 0.8,
                    "speed": 0.8,
                    "scatterRate": 2,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.4
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 57,
                "width": 85,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "droneCount": 0,
                "addon": null,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 0.5,
                    "health": 0.325,
                    "damage": 1,
                    "speed": 1.2,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.5
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 239,
        "name": "Mega Cannon",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 120,
                "width": 39.9,
                "delay": 0,
                "reload": 10,
                "recoil": 40,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "shotgun20",
                    "sizeRatio": 0.5,
                    "health": 0.4,
                    "damage": 0.8,
                    "speed": 1.5,
                    "scatterRate": 1.5,
                    "lifeLength": 0.15,
                    "absorbtionFactor": 0.2
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 57,
                "width": 65,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "droneCount": 0,
                "addon": null,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 0.5,
                    "health": 0.325,
                    "damage": 1,
                    "speed": 1.2,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.5
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 240,
        "name": "Inquisitor",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 100,
                "width": 60.9,
                "delay": 0,
                "reload": 5,
                "recoil": 6,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "shotgun4",
                    "sizeRatio": 0.4,
                    "health": 0.75,
                    "damage": 0.8,
                    "speed": 0.8,
                    "scatterRate": 2,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.4
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 57,
                "width": 70,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "droneCount": 0,
                "addon": null,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 0.5,
                    "health": 0.325,
                    "damage": 1,
                    "speed": 1.2,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.5
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 60,
                "width": 54.6,
                "delay": 0,
                "reload": 3,
                "recoil": 8,
                "inverseFire": true,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 1.3,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 4,
                    "absorbtionFactor": 0.4
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Penetration",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 241,
        "name": "Scatter Shot",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 100,
                "width": 48,
                "delay": 0,
                "reload": 3,
                "recoil": 15,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "shotgun9",
                    "sizeRatio": 0.4,
                    "health": 0.5,
                    "damage": 0.5,
                    "speed": 1,
                    "scatterRate": 1.5,
                    "lifeLength": 0.7,
                    "absorbtionFactor": 0.4
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 57,
                "width": 53,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "droneCount": 0,
                "addon": null,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 0.5,
                    "health": 0.325,
                    "damage": 1,
                    "speed": 1.2,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.5
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 242,
        "name": "Arras Penta Shot",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": true
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -0.5235987755982988,
                "offset": -15,
                "size": 75,
                "width": 42,
                "delay": 0.66,
                "reload": 1,
                "recoil": 0.7,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.55,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.5235987755982988,
                "offset": 15,
                "size": 75,
                "width": 42,
                "delay": 0.66,
                "reload": 1,
                "recoil": 0.7,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.55,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.3490658503988659,
                "offset": 6,
                "size": 90,
                "width": 42,
                "delay": 0.33,
                "reload": 1,
                "recoil": 0.7,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.55,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.3490658503988659,
                "offset": -6,
                "size": 90,
                "width": 42,
                "delay": 0.33,
                "reload": 1,
                "recoil": 0.7,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.55,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 105,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0.7,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.55,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 243,
        "name": "Heavy",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0.39269908169872414,
                "offset": 0,
                "size": 90,
                "width": 55,
                "delay": 0.5,
                "reload": 2.5,
                "recoil": 4,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.25,
                    "damage": 1.35,
                    "speed": 0.85,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.4
                }
            },
            {
                "angle": -0.39269908169872414,
                "offset": 0,
                "size": 90,
                "width": 55,
                "delay": 0.5,
                "reload": 2.5,
                "recoil": 4,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.25,
                    "damage": 1.35,
                    "speed": 0.85,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.4
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 100,
                "width": 55,
                "delay": 0,
                "reload": 2.5,
                "recoil": 4,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.25,
                    "damage": 1.35,
                    "speed": 0.85,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.4
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 244,
        "name": "Fun Ender",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 60.9,
                "delay": 0,
                "reload": 6,
                "recoil": 9,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "shotgun4blunt",
                    "sizeRatio": 0.4,
                    "health": 0.55,
                    "damage": 1,
                    "speed": 0.8,
                    "scatterRate": 1,
                    "lifeLength": 1.5,
                    "absorbtionFactor": 0.4
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 57,
                "width": 70,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0.3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "droneCount": 0,
                "addon": null,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 0.5,
                    "health": 0.325,
                    "damage": 1,
                    "speed": 1.2,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.5
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 245,
        "name": "Hell Bringer",
        "upgradeMessage": "",
        "levelRequirement": 90,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.6561,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": "smasher",
        "postAddon": "autoturret",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": -26,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0.375,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 26,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.375,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.9,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0,
                "reload": 1.5,
                "recoil": 1.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1.5,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 65,
                "delay": 0,
                "reload": 2.5,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1.25,
                    "damage": 1.5,
                    "speed": 0.85,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.4
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 0.5,
                "recoil": 1.5,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.7,
                    "speed": 1,
                    "scatterRate": 3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 42,
                "delay": 0,
                "reload": 2,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 1,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 8,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.2617993877991494,
                "offset": 8,
                "size": 83,
                "width": 29.4,
                "delay": 0.5,
                "reload": 1.2,
                "recoil": 0.05,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.2617993877991494,
                "offset": -8,
                "size": 83,
                "width": 29.4,
                "delay": 0.5,
                "reload": 1.2,
                "recoil": 0.05,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 0.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 4,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Penetration",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 246,
        "name": "Swarm Gunner",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": -24,
                "size": 65,
                "width": 29.4,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.5,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": true,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 24,
                "size": 65,
                "width": 29.4,
                "delay": 0.75,
                "reload": 1,
                "recoil": 0.5,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": true,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.15,
                    "speed": 1,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": -17,
                "size": 85,
                "width": 25.2,
                "delay": 0,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.5,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 17,
                "size": 85,
                "width": 25.2,
                "delay": 0.25,
                "reload": 1,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.45,
                    "damage": 0.5,
                    "speed": 1.1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Penetration",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 247,
        "name": "Bulwark",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": -26,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0.75,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.8,
                    "damage": 0.55,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 26,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.75,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.8,
                    "damage": 0.55,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle":3.0106929596902186,
                "offset": -28,
                "size": 65,
                "width": 39.9,
                "delay": 0,
                "reload": 2,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.6,
                    "damage": 0.5,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle":-3.0106929596902186,
                "offset": 28,
                "size": 65,
                "width": 39.9,
                "delay": 0.5,
                "reload": 2,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.6,
                    "damage": 0.5,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 5,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Penetration",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 248,
        "name": "Overkill",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": -1.5707963267948966,
                "offset": 0,
                "size": 75,
                "width": 57.75,
                "delay": 0.25,
                "reload": 10,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 3,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2.25,
                    "damage": 1,
                    "speed": 0.75,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.6
                }
            },
            {
                "angle": 1.5707963267948966,
                "offset": 0,
                "size": 75,
                "width": 57.75,
                "delay": 0.25,
                "reload": 10,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 3,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2.25,
                    "damage": 1,
                    "speed": 0.75,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 0.6
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 249,
        "name": "Flag Ship",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0.39269908169872414,
                "offset": 15,
                "size": 75,
                "width": 39.9,
                "delay": 0,
                "reload": 3,
                "recoil": 1.5,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": true,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 0.7,
                    "health": 1.3,
                    "damage": 0.3,
                    "speed": 0.75,
                    "scatterRate": 0,
                    "lifeLength": 2,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.39269908169872414,
                "offset": -15,
                "size": 75,
                "width": 39.9,
                "delay": 0,
                "reload": 3,
                "recoil": 1.5,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "droneCount": 4294967295,
                "canControlDrones": true,
                "bullet": {
                    "type": "swarm",
                    "sizeRatio": 0.7,
                    "health": 1.3,
                    "damage": 0.3,
                    "speed": 0.75,
                    "scatterRate": 0,
                    "lifeLength": 2,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Amount",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 250,
        "name": "True Amalgam",
        "upgradeMessage": "",
        "levelRequirement": 60,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle":  2.443460952792061,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.375,
                "reload": 9,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 3,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle":  -2.443460952792061,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.375,
                "reload": 9,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 3,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": -26,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.7,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 26,
                "size": 95,
                "width": 42,
                "delay": 0.5,
                "reload": 1,
                "recoil": 0.5,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 0.7,
                    "damage": 0.65,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle":-0.2617993877991494,
                "offset": -20,
                "size": 55,
                "width": 45,
                "delay": 0,
                "reload": 3,
                "recoil": 0.75,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 0.5,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 5,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle":0.2617993877991494,
                "offset": 20,
                "size": 55,
                "width": 45,
                "delay": 0,
                "reload": 3,
                "recoil": 0.75,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 2,
                    "damage": 0.5,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": 5,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Health",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 251,
        "name": "Fission",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "pronounced",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 42,
                "delay": 0,
                "reload": 2.5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "boomerang",
                    "sizeRatio": 0.8,
                    "health": 1.25,
                    "damage": 1.25,
                    "speed": 1.75,
                    "scatterRate": 1,
                    "lifeLength": 3.75,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 2,
                "canControlDrones": false,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Health",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 252,
        "name": "Mitosis",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0,
                "reload": 3,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "growLauncher",
                "bullet": {
                    "type": "grower",
                    "sizeRatio": 1,
                    "health": 1.5,
                    "damage": 1.5,
                    "speed": 0.5,
                    "scatterRate": 1,
                    "lifeLength": 2,
                    "absorbtionFactor": 0.4
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 253,
        "name": "Auto 1",
        "upgradeMessage": "",
        "levelRequirement": 15,
        "upgrades": [21,109, 90, 202],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "autoturret",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 254,
        "name": "Swarmer",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 52.5,
                "delay": 0,
                "reload": 4,
                "recoil": 3,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "bullet": {
                    "type": "conglom",
                    "sizeRatio": 1,
                    "health": 3,
                    "damage": 1,
                    "speed": 0.7,
                    "scatterRate": 0.3,
                    "lifeLength": 1.3,
                    "absorbtionFactor": 0.1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 92.5,
                "width": 33.6,
                "delay": 0,
                "reload": 2.5,
                "recoil": 3,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "droneCount":0,
                "addon": null,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 3,
                    "damage": 1,
                    "speed": 0.45,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Spinner Damage",
                "max": 7
            },
            {
                "name": "Spinner Penetration",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 255,
        "name": "SPORN",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.8,
        "absorbtionFactor": 0.75,
        "speed": 2.5,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "sporn",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 0
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 256,
        "name": "Auto Spawner",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "autoturret",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 100,
                "width": 42,
                "delay": 0,
                "reload": 5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "minionLauncher",
                "droneCount": 4,
                "canControlDrones": true,
                "bullet": {
                    "type": "minion",
                    "sizeRatio": 1,
                    "health": 1.75,
                    "damage": 0.65,
                    "speed": 0.9,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Minion Damage",
                "max": 7
            },
            {
                "name": "Minion Health",
                "max": 7
            },
            {
                "name": "Minion Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 257,
        "name": "Disperse",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0.6981317007977318,
                "offset": 0,
                "size": 80,
                "width": 29.4,
                "delay": 0.6666,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1.3,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.6981317007977318,
                "offset": 0,
                "size": 80,
                "width": 29.4,
                "delay": 0.6666,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1.3,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.3490658503988659,
                "offset": 0,
                "size": 95,
                "width": 29.4,
                "delay": 0.3333,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1.3,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -0.3490658503988659,
                "offset": 0,
                "size": 95,
                "width": 29.4,
                "delay": 0.3333,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.6,
                    "speed": 1.3,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 110,
                "width": 42,
                "delay": 0,
                "reload": 2,
                "recoil": 0.1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1.3,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 258,
        "name": "Glider",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 92.5,
                "width": 33.6,
                "delay": 0,
                "reload": 2.5,
                "recoil": 3,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "droneCount":0,
                "addon": null,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 3,
                    "damage": 1,
                    "speed": 0.45,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 56.7,
                "delay": 0,
                "reload": 4,
                "recoil": 3,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": null,
                "bullet": {
                    "type": "skimmer",
                    "sizeRatio": 1,
                    "health": 4,
                    "damage": 1.2,
                    "speed": 0.55,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Rocket Damage",
                "max": 7
            },
            {
                "name": "Rocket Penetration",
                "max": 7
            },
            {
                "name": "Rocket Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 259,
        "name": "Energize",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 4.5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "droneCount": 6,
                "addon": "mineLauncher",
                "bullet": {
                    "type": "mine",
                    "sizeRatio": 0.8,
                    "health": 3,
                    "damage":0.75,
                    "speed": 2,
                    "scatterRate": 1,
                    "lifeLength": -1,
                    "sides": 6,
                    "absorbtionFactor": 0.5
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 60,
                "width": 58.8,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 0,
                    "health": 0,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 0.3,
                    "lifeLength": 0,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Mine Damage",
                "max": 7
            },
            {
                "name": "Mine Health",
                "max": 7
            },
            {
                "name": "Mine Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 260,
        "name": "Tide Turner",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0.39269908169872414,
                "offset": 10,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 2.5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "boomerang",
                    "sizeRatio": 0.8,
                    "health": 1,
                    "damage": 1,
                    "speed": 1.75,
                    "scatterRate": 1,
                    "lifeLength": 3.75,
                    "absorbtionFactor": 0.75
                }
            },
            {
                "angle": -0.39269908169872414,
                "offset": -10,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 2.5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "boomerang",
                    "sizeRatio": 0.8,
                    "health": 1,
                    "damage": 1,
                    "speed": 1.75,
                    "scatterRate": 1,
                    "lifeLength": 3.75,
                    "absorbtionFactor": 0.75
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Trap Damage",
                "max": 7
            },
            {
                "name": "Trap Health",
                "max": 7
            },
            {
                "name": "Trap Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 261,
        "name": "Leacher",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [
            262,263,264,265
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 25,
        "preAddon": null,
        "postAddon": "vampire",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 105,
                "width": 21,
                "delay": 0,
                "reload": 1.25,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "null",
                "bullet": {
                    "type": "leach",
                    "sizeRatio": 1,
                    "health": 0.8,
                    "damage": 0.8,
                    "speed": 1.2,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 0,
                    "health": 0,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 0.3,
                    "lifeLength": 0,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 262,
        "name": "Vampire",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 25,
        "preAddon": null,
        "postAddon": "vampire",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 10.5,
                "size": 105,
                "width": 16.8,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "null",
                "bullet": {
                    "type": "leach",
                    "sizeRatio": 1,
                    "health": 0.8,
                    "damage": 0.5,
                    "speed": 1.2,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": -10.5,
                "size": 105,
                "width": 16.8,
                "delay": 0.5,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "null",
                "bullet": {
                    "type": "leach",
                    "sizeRatio": 1,
                    "health": 0.8,
                    "damage": 0.5,
                    "speed": 1.2,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 70,
                "width": 50.4,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 0,
                    "health": 0,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 0.3,
                    "lifeLength": 0,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 263,
        "name": "Restorer",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "vampire",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 105,
                "width": 33.6,
                "delay": 0,
                "reload": 1.25,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "null",
                "bullet": {
                    "type": "leach",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1.2,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 0,
                    "health": 0,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 0.3,
                    "lifeLength": 0,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 264,
        "name": "Bat Smasher",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 0.9,
        "speed": 1.1,
        "maxHealth": 25,
        "preAddon": null,
        "postAddon": "vampsmasher",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 10
            },
            {
                "name": "Reload",
                "max": 0
            },
            {
                "name": "Bullet Damage",
                "max": 0
            },
            {
                "name": "Bullet Penetration",
                "max": 0
            },
            {
                "name": "Bullet Speed",
                "max": 0
            },
            {
                "name": "Body Damage",
                "max": 10
            },
            {
                "name": "Max Health",
                "max": 10
            },
            {
                "name": "Health Regen",
                "max": 10
            }
        ]
    },
    {
        "id": 265,
        "name": "Regenerator",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 1,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "autovamp",
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "null",
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 266,
        "name": "Trooper",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.85,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "psiEye",
        "sides": 1,
        "maxorbs": 4,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 1,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 65,
                "width": 50.4,
                "delay": 0,
                "reload": 2,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": "null",
                "droneCount": 6,
                "bullet": {
                    "type": "orbit3",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.625,
                    "speed": 1.5,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 267,
        "name": "Overdoor",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle":  -0.7853981633974483,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.25,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 3,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0.7853981633974483,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0.25,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 3,
                "canControlDrones": true,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.0943951023931953,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 3,
                "canControlDrones": false,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -2.0943951023931953,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 3,
                "canControlDrones": false,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Drone Damage",
                "max": 7
            },
            {
                "name": "Drone Health",
                "max": 7
            },
            {
                "name": "Drone Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 268,
        "name": "The Croc",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 65,
                "width": 56.7,
                "delay": 0,
                "reload": 2.5,
                "recoil": 3,
                "isTrapezoid": true,
                "trapezoidDirection":  3.141592653589793,
                "droneCount":0,
                "addon": null,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 0.25,
                    "health": 3,
                    "damage": 1,
                    "speed": 0.45,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 56.7,
                "delay": 0,
                "reload": 2,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "croc",
                    "sizeRatio": 1,
                    "health": 1.25,
                    "damage": 1.1,
                    "speed": 0.8,
                    "scatterRate": 0.3,
                    "lifeLength": 1.25,
                    "absorbtionFactor": 0.25
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Croc",
                "max": 7
            },
            {
                "name": "ReCroc",
                "max": 7
            },
            {
                "name": "Croc Damage",
                "max": 7
            },
            {
                "name": "Croc Penetration",
                "max": 7
            },
            {
                "name": "Croc Speed",
                "max": 7
            },
            {
                "name": "Body Croc",
                "max": 7
            },
            {
                "name": "Max Croc",
                "max": 7
            },
            {
                "name": "Croc Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 269,
        "name": "Forge",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 100,
                "width": 42,
                "delay": 0,
                "reload": 5,
                "recoil": 1,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "minionLauncher",
                "droneCount": 4,
                "canControlDrones": true,
                "bullet": {
                    "type": "minion",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.69,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 70,
                "width": 42,
                "delay": 0,
                "reload": 6,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 0,
                "addon": null,
                "droneCount": 0,
                "canControlDrones": false,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.7,
                    "speed": 0.8,
                    "scatterRate": 0,
                    "lifeLength": -1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Minion Damage",
                "max": 7
            },
            {
                "name": "Minion Health",
                "max": 7
            },
            {
                "name": "Minion Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 270,
        "name": "Bastion",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 3.141592653589793,
                "offset": 0,
                "size": 60,
                "width": 35.7,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.2,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 6,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -1.0471975511965976,
                "offset": 0,
                "size": 60,
                "width": 35.7,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.2,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 6,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 1.0471975511965976,
                "offset": 0,
                "size": 60,
                "width": 35.7,
                "delay": 0,
                "reload": 2.5,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": "trapLauncher",
                "bullet": {
                    "type": "trap",
                    "sizeRatio": 0.8,
                    "health": 1.2,
                    "damage": 1,
                    "speed": 1.25,
                    "scatterRate": 1,
                    "lifeLength": 6,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 90,
                "width": 42,
                "delay": 0,
                "reload": 1.25,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.8,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 2.0943951023931953,
                "offset": 0,
                "size": 90,
                "width": 42,
                "delay": 0,
                "reload": 1.25,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.8,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": -2.0943951023931953,
                "offset": 0,
                "size": 90,
                "width": 42,
                "delay": 0,
                "reload": 1.25,
                "recoil": 0,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "bullet",
                    "sizeRatio": 1,
                    "health": 1,
                    "damage": 0.8,
                    "speed": 1,
                    "scatterRate": 1,
                    "lifeLength": 1,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Weapon Damage",
                "max": 7
            },
            {
                "name": "Weapon Penetration",
                "max": 7
            },
            {
                "name": "Weapon Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 271,
        "name": "Spammer",
        "upgradeMessage": "",
        "levelRequirement": 30,
        "upgrades": [45,49,50,155,160, 96,82],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 95,
                "width": 42,
                "delay": 0,
                "reload": 1.5,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "streambullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.25,
                    "speed": 1.2,
                    "scatterRate": 0,
                    "lifeLength": 0.8,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 85,
                "width": 42,
                "delay": 0.333,
                "reload": 1.5,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "streambullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.25,
                    "speed": 1.2,
                    "scatterRate": 0,
                    "lifeLength": 0.8,
                    "absorbtionFactor": 1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 75,
                "width": 42,
                "delay": 0.6666,
                "reload": 1.5,
                "recoil": 0.2,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "streambullet",
                    "sizeRatio": 0.7,
                    "health": 1,
                    "damage": 0.25,
                    "speed": 1.2,
                    "scatterRate": 0,
                    "lifeLength": 0.8,
                    "absorbtionFactor": 1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 272,
        "name": "Psyco",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [
        ],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.85,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": "psiEye",
        "sides": 1,
        "maxorbs": 8,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 70,
                "width": 52.5,
                "delay": 0,
                "reload": 2.5,
                "recoil": 1,
                "isTrapezoid": true,
                "trapezoidDirection": 3.141592653589793,
                "addon": "null",
                "droneCount": 8,
                "forceFire": true,
                "bullet": {
                    "type": "orbit2",
                    "sizeRatio": 1,
                    "health": 2,
                    "damage": 0.65,
                    "speed": 2,
                    "scatterRate": 0,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.4
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Bullet Damage",
                "max": 7
            },
            {
                "name": "Bullet Penetration",
                "max": 7
            },
            {
                "name": "Bullet Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    },
    {
        "id": 273,
        "name": "Pulsar",
        "upgradeMessage": "",
        "levelRequirement": 45,
        "upgrades": [],
        "flags": {
            "invisibility": false,
            "zoomAbility": false,
            "devOnly": false
        },
        "visibilityRateShooting": 0.23,
        "visibilityRateMoving": 0.08,
        "invisibilityRate": 0.03,
        "fieldFactor": 0.9,
        "absorbtionFactor": 1,
        "speed": 1,
        "maxHealth": 50,
        "preAddon": null,
        "postAddon": null,
        "sides": 1,
        "borderWidth": 15,
        "barrels": [
            {
                "angle": 0,
                "offset": 0,
                "size": 92.5,
                "width": 39.375,
                "delay": 0,
                "reload": 2.5,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection":  0,
                "droneCount":0,
                "addon": null,
                "bullet": {
                    "type": "drone",
                    "sizeRatio": 1,
                    "health": 3,
                    "damage": 1,
                    "speed": 0.45,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            },
            {
                "angle": 0,
                "offset": 0,
                "size": 80,
                "width": 52.5,
                "delay": 0,
                "reload": 3,
                "recoil": 3,
                "isTrapezoid": false,
                "trapezoidDirection": 0,
                "addon": null,
                "bullet": {
                    "type": "pulserocket",
                    "sizeRatio": 1,
                    "health": 2.5,
                    "damage": 1,
                    "speed": 0.55,
                    "scatterRate": 0.3,
                    "lifeLength": 1,
                    "absorbtionFactor": 0.1
                }
            }
        ],
        "stats": [
            {
                "name": "Movement Speed",
                "max": 7
            },
            {
                "name": "Reload",
                "max": 7
            },
            {
                "name": "Rocket Damage",
                "max": 7
            },
            {
                "name": "Rocket Penetration",
                "max": 7
            },
            {
                "name": "Rocket Speed",
                "max": 7
            },
            {
                "name": "Body Damage",
                "max": 7
            },
            {
                "name": "Max Health",
                "max": 7
            },
            {
                "name": "Health Regen",
                "max": 7
            }
        ]
    }
]`) as (TankDefinition | null)[] & Record<Tank, TankDefinition>;

export default TankDefinitions;

/**
 * The count of all existing tanks (some in tank definitions are null).
 * Used for tank xor generation.
 */
export const TankCount = TankDefinitions.reduce((a, b) => b ? a + 1 : a, 0);

/**
 * A function used to retrieve both tank and dev tank definitions from their id.
 * Negative IDs are used to index dev tanks, whereas positive are used to index normal tanks. 
 */
export const getTankById = function (id: number): TankDefinition | null {
    return (id < 0 ? DevTankDefinitions[~id] : TankDefinitions[id]) || null;
}

export const getTankByName = function (tankName: string): TankDefinition | null {
    return TankDefinitions.find(tank => tank && tank.name === tankName) || DevTankDefinitions.find(tank => tank && tank.name === tankName) || null;
}
