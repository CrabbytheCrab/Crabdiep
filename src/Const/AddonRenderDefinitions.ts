import { PI2 } from "../util";
import { Color } from "./Enums";
import { addonId, barrelAddonId } from "./TankDefinitions";

/**
 * The root AddonRenderDefinition will be applied on the tank render.
 * The AddonRenderDefinition is currently only applicable on the client!
 * You will need to define this seperately from your actual Addons. This may change in the future.
 * This does not differenciate between Tank and Barrel Addons. We let the client decide what to do.
 * Relations, Position, Physics and Style Components are always created, while the Barrel Component only gets created if it is defined in the AddonRenderDefinition.
 * There are no default values at the root level, unset values will not be overwritten.
 */
export interface AddonRenderDefinition {
    children?: AddonRenderDefinition[];
    position?: {
        xOffset?: number; // default: 0.0
        yOffset?: number; // default: 0.0
        angle?: number; // default: 0.0
        isAngleAbsolute?: boolean; // default: false (explaination: false means relative angle to parent)
    };
    physics?: {
        sides?: number; // default: 1
        size?: number; // default: 0.0
        width?: number; // default: 0.0 (explaination: used for trapezoid and rectangle rendering)
        isSizeFactor?: boolean
        isWidthFactor?: boolean
        isTrapezoid?: boolean; // default: false (explaination: renders a rectangle as an isosceles trapezoid)
    };
    style?: {
        color?: Color; // default: 0 (explaination: 0 means Color.Border) 
        borderWidth?: number; // default: 7.5 (explaination: canvas stroke width)
        opacity?: number; // default: 1.0
        isVisible?: boolean; // default: true
        renderFirst?: boolean; // default: false (explaination: eg. team bases are rendered first / below everything else)
        isStar?: boolean; // default: false (explaination: eg. traps are rendered as stars)
        isCachable?: boolean; // default: true (explaination: The rendered object can be stored as an image / pattern and be drawn faster on subsequent frames)
        showsAboveParent?: boolean; // default: false
    };
    barrel?: {
        trapezoidDirection?: number; // default: 0.0
    };
};

/**
 * These are used to define how custom addons will look like on the client (think Upgrade Buttons / Tank Wheel)
 */
const AddonRenderDefinitions: Partial<Record<(addonId | barrelAddonId), AddonRenderDefinition>> = {
    "bigautoturret": {
        children: [{
            children: [{
                // the actual barrel
                position: {
                    xOffset: Math.cos(0) * (96 / 2 + 0) - Math.sin(0), // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                    yOffset: Math.sin(0) * (96 / 2 + 0) - Math.cos(0), // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                    angle: 0 + 0 // angle + trapezoidDirection
                },
                physics: {
                    sides: 2,
                    size: 96,
                    width: 0.7 * 75.6,
                    isTrapezoid: false
                },
                style: {
                    color: Color.Barrel
                }
            }],
            // the socket for the barrel
            position: {
                angle: 1 * PI2 / 2, // i * Math.PI * 2 / count
                xOffset: 0, // Math.cos(angle) * 40.0
                yOffset: 0 // Math.sin(angle) * 40.0
            },
            physics: {
                size: 25 * 1.5
            },
            style: {
                color: Color.Barrel,
                showsAboveParent: true
            }
        }]
    },
    "auto2": {
        children: [{
            children: [{
                // the actual barrel
                position: {
                    xOffset: Math.cos(0) * (55 / 2 + 0) - Math.sin(0) * 0, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                    yOffset: Math.sin(0) * (55 / 2 + 0) - Math.cos(0) * 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                    angle: 0 + 0 // angle + trapezoidDirection
                },
                physics: {
                    sides: 2,
                    size: 55,
                    width: 0.7 * 42,
                    isTrapezoid: true
                },
                style: {
                    color: Color.Barrel
                }
            }],
            // the socket for the barrel
            position: {
                angle: 1 * PI2 / 2, // i * Math.PI * 2 / count
                xOffset: 0, // Math.cos(angle) * 40.0
                yOffset: 0 // Math.sin(angle) * 40.0
            },
            physics: {
                size: 25
            },
            style: {
                color: Color.Barrel,
                showsAboveParent: true
            }
        },{
            children: [{
                children: [{
                    // the actual barrel
                    position: {
                        xOffset: Math.cos(0) * (55 / 2 + 0) - Math.sin(0) * 0, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                        yOffset: Math.sin(0) * (55 / 2 + 0) - Math.cos(0) * 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                        angle: 0 + 0 // angle + trapezoidDirection
                    },
                    physics: {
                        sides: 2,
                        size: 55,
                        width: 0.7 * 42,
                        isTrapezoid: true
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                // the socket for the barrel
                position: {
                    angle: 0 * PI2 / 2, // i * Math.PI * 2 / count
                    xOffset: Math.cos(0 * PI2 / 2) * 40, // Math.cos(angle) * 40.0
                    yOffset: Math.sin(0 * PI2 / 2) * 40 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 25
                },
                style: {
                    color: Color.Barrel
                }
            }, {
                children: [{
                    position: {
                        xOffset: Math.cos(0) * (55 / 2 + 0) - Math.sin(0) * 0,
                        yOffset: Math.sin(0) * (55 / 2 + 0) - Math.cos(0) * 0,
                        angle: 0 + 0
                    },
                    physics: {
                        sides: 2,
                        size: 55,
                        width: 0.7 * 42,
                        isTrapezoid: true
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                position: {
                    angle: 1 * PI2 / 2,
                    xOffset: Math.cos(1 * PI2 / 2) * 40,
                    yOffset: Math.sin(1 * PI2 / 2) * 40
                },
                physics: {
                    size: 25
                },
                style: {
                    color: Color.Barrel
                }
            }],
            // the rotator for the sockets
            physics: {
                size: 5
            },
            position: {
                isAngleAbsolute: true,
                angle: 0.5 * PI2 / 2
            },
            style: {
                isVisible: false            
            }
        }]
    },
    "mega3": {
        children: [{
            children: [{
                children: [{
                    // the actual barrel
                    position: {
                        xOffset: Math.cos(0) * (65 / 2 + 0) - Math.sin(0) * 0, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                        yOffset: Math.sin(0) * (65 / 2 + 0) - Math.cos(0) * 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                        angle: 0 + Math.PI // angle + trapezoidDirection
                    },
                    physics: {
                        sides: 2,
                        size: 65,
                        width: 0.7 * 71.4,
                        isTrapezoid: false
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                // the socket for the barrel
                position: {
                    angle: 0 * PI2 / 3, // i * Math.PI * 2 / count
                    xOffset: Math.cos(0 * PI2 / 2) * 40, // Math.cos(angle) * 40.0
                    yOffset: Math.sin(0 * PI2 / 2) * 40 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 25 * 1.25
                },
                style: {
                    color: Color.Barrel
                }
            },{
                children: [{
                    // the actual barrel
                    position: {
                        xOffset: Math.cos(0) * (65 / 2 + 0) - Math.sin(0) * 0, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                        yOffset: Math.sin(0) * (65 / 2 + 0) - Math.cos(0) * 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                        angle: 0 + Math.PI // angle + trapezoidDirection
                    },
                    physics: {
                        sides: 2,
                        size: 65,
                        width: 0.7 * 71.4,
                        isTrapezoid: false
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                // the socket for the barrel
                position: {
                    angle: 1 * PI2 / 3, // i * Math.PI * 2 / count
                    xOffset: Math.cos(1 * PI2 / 3) * 40, // Math.cos(angle) * 40.0
                    yOffset: Math.sin(1 * PI2 / 3) * 40 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 25 * 1.25
                },
                style: {
                    color: Color.Barrel
                }
            },{
                children: [{
                    // the actual barrel
                    position: {
                        xOffset: Math.cos(0) * (65 / 2 + 0) - Math.sin(0) * 0, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                        yOffset: Math.sin(0) * (65 / 2 + 0) - Math.cos(0) * 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                        angle: 0 + Math.PI // angle + trapezoidDirection
                    },
                    physics: {
                        sides: 2,
                        size: 65,
                        width: 0.7 * 71.4,
                        isTrapezoid: false
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                // the socket for the barrel
                position: {
                    angle: 2 * PI2 / 3, // i * Math.PI * 2 / count
                    xOffset: Math.cos(2 * PI2 / 3) * 40, // Math.cos(angle) * 40.0
                    yOffset: Math.sin(2 * PI2 / 3) * 40 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 25 * 1.25
                },
                style: {
                    color: Color.Barrel
                }
            }],
            // the rotator for the sockets
            physics: {
                size: 5
            },
            position: {
                isAngleAbsolute: true,
                angle: 0
            },
            style: {
                isVisible: false            
            }
        }]
    },
    "stalker3": {
        children: [{
            children: [{
                children: [{
                    // the actual barrel
                    position: {
                        xOffset: Math.cos(0) * (65 / 2 + 0) - Math.sin(0) * 0, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                        yOffset: Math.sin(0) * (65 / 2 + 0) - Math.cos(0) * 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                        angle: 0 + Math.PI // angle + trapezoidDirection
                    },
                    physics: {
                        sides: 2,
                        size: 65,
                        width: 0.7 * 42,
                        isTrapezoid: true
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                // the socket for the barrel
                position: {
                    angle: 0 * PI2 / 3, // i * Math.PI * 2 / count
                    xOffset: Math.cos(0 * PI2 / 2) * 40, // Math.cos(angle) * 40.0
                    yOffset: Math.sin(0 * PI2 / 2) * 40 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 25 * 1.1
                },
                style: {
                    color: Color.Barrel
                }
            },{
                children: [{
                    // the actual barrel
                    position: {
                        xOffset: Math.cos(0) * (65 / 2 + 0) - Math.sin(0) * 0, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                        yOffset: Math.sin(0) * (65 / 2 + 0) - Math.cos(0) * 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                        angle: 0 + Math.PI // angle + trapezoidDirection
                    },
                    physics: {
                        sides: 2,
                        size: 65,
                        width: 0.7 * 42,
                        isTrapezoid: true
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                // the socket for the barrel
                position: {
                    angle: 1 * PI2 / 3, // i * Math.PI * 2 / count
                    xOffset: Math.cos(1 * PI2 / 3) * 40, // Math.cos(angle) * 40.0
                    yOffset: Math.sin(1 * PI2 / 3) * 40 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 25 * 1.1
                },
                style: {
                    color: Color.Barrel
                }
            },{
                children: [{
                    // the actual barrel
                    position: {
                        xOffset: Math.cos(0) * (65 / 2 + 0) - Math.sin(0) * 0, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                        yOffset: Math.sin(0) * (65 / 2 + 0) - Math.cos(0) * 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                        angle: 0 + Math.PI // angle + trapezoidDirection
                    },
                    physics: {
                        sides: 2,
                        size: 65,
                        width: 0.7 * 42,
                        isTrapezoid: true
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                // the socket for the barrel
                position: {
                    angle: 2 * PI2 / 3, // i * Math.PI * 2 / count
                    xOffset: Math.cos(2 * PI2 / 3) * 40, // Math.cos(angle) * 40.0
                    yOffset: Math.sin(2 * PI2 / 3) * 40 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 25 * 1.1
                },
                style: {
                    color: Color.Barrel
                }
            }],
            // the rotator for the sockets
            physics: {
                size: 5
            },
            position: {
                isAngleAbsolute: true,
                angle: 0
            },
            style: {
                isVisible: false            
            }
        }]
    },
    "joint3": {
        children: [{
            children: [{
                children: [{
                    // the actual barrel
                    position: {
                        xOffset: Math.cos(0) * (55 / 2 + 0) - Math.sin(0) * 0, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                        yOffset: Math.sin(0) * (55 / 2 + 0) - Math.cos(0) * 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                        angle: 0 + 0
                    },
                    physics: {
                        sides: 2,
                        size: 55,
                        width: 0.7 * 42,
                        isTrapezoid: false
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                // the socket for the barrel
                position: {
                    angle: 1.5 * PI2 / 3, // i * Math.PI * 2 / count
                    xOffset: Math.cos(0 * PI2 / 2) * 90, // Math.cos(angle) * 40.0
                    yOffset: Math.sin(0 * PI2 / 2) * 90 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 25
                },
                style: {
                    color: Color.Barrel
                }
            },{
                children: [{
                    // the actual barrel
                    position: {
                        xOffset: Math.cos(0) * (55 / 2 + 0) - Math.sin(0) * 0, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                        yOffset: Math.sin(0) * (55 / 2 + 0) - Math.cos(0) * 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                        angle: 0 + 0
                    },
                    physics: {
                        sides: 2,
                        size: 55,
                        width: 0.7 * 42,
                        isTrapezoid: false
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                // the socket for the barrel
                position: {
                    angle: 2.5 * PI2 / 3, // i * Math.PI * 2 / count
                    xOffset: Math.cos(1 * PI2 / 3) * 90, // Math.cos(angle) * 40.0
                    yOffset: Math.sin(1 * PI2 / 3) * 90 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 25
                },
                style: {
                    color: Color.Barrel
                }
            },{
                children: [{
                    // the actual barrel
                    position: {
                        xOffset: Math.cos(0) * (55 / 2 + 0) - Math.sin(0) * 0, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                        yOffset: Math.sin(0) * (55 / 2 + 0) - Math.cos(0) * 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                        angle: 0 + 0
                    },
                    physics: {
                        sides: 2,
                        size: 55,
                        width: 0.7 * 42,
                        isTrapezoid: false
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                // the socket for the barrel
                position: {
                    angle: 3.5 * PI2 / 3, // i * Math.PI * 2 / count
                    xOffset: Math.cos(2 * PI2 / 3) * 90, // Math.cos(angle) * 40.0
                    yOffset: Math.sin(2 * PI2 / 3) * 90 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 25
                },
                style: {
                    color: Color.Barrel
                }
            }],
            // the rotator for the sockets
            physics: {
                size: 5
            },
            position: {
                isAngleAbsolute: true,
                angle: 0
            },
            style: {
                isVisible: false,
                showsAboveParent: true

                          
            }
        }]
    },
    "auto4": {
        children: [{
            children: [{
                children: [{
                    children: [{
                        position: {
                            xOffset:(40 + ( 0.7 * 56.7 * (20 / 42)))/2, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                            yOffset: 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                            angle: 0 + 0
                        },
                        physics: {
                            sides: 2,
                            size: (0.7 * 56.7 * (20 / 42)),
                            width: 0.7 * 56.7,
                            isTrapezoid: true
                        },
                        style: {
                            color: Color.Barrel
                        }
                    }],
                    // the actual barrel
                    position: {
                        xOffset: Math.cos(0) * (40 / 2 + 0) - Math.sin(0) * 0, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                        yOffset: Math.sin(0) * (40 / 2 + 0) - Math.cos(0) * 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                        angle: 0 + 0
                    },
                    physics: {
                        sides: 2,
                        size: 40,
                        width: 0.7 * 56.7,
                        isTrapezoid: false
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                // the socket for the barrel
                position: {
                    angle: 0 * PI2 / 4, // i * Math.PI * 2 / count
                    xOffset: Math.cos(0 * PI2 / 4) * 40, // Math.cos(angle) * 40.0
                    yOffset: Math.sin(0 * PI2 / 4) * 40 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 25 * 1.125
                },
                style: {
                    color: Color.Barrel
                }
            },{
                children: [{
                    children: [{
                        position: {
                            xOffset:(40 + ( 0.7 * 56.7 * (20 / 42)))/2, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                            yOffset: 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                            angle: 0 + 0
                        },
                        physics: {
                            sides: 2,
                            size: (0.7 * 56.7 * (20 / 42)),
                            width: 0.7 * 56.7,
                            isTrapezoid: true
                        },
                        style: {
                            color: Color.Barrel
                        }
                    }],
                    // the actual barrel
                    position: {
                        xOffset: Math.cos(0) * (40 / 2 + 0) - Math.sin(0) * 0, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                        yOffset: Math.sin(0) * (40 / 2 + 0) - Math.cos(0) * 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                        angle: 0 + 0
                    },
                    physics: {
                        sides: 2,
                        size: 40,
                        width: 0.7 * 56.7,
                        isTrapezoid: false
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                // the socket for the barrel
                position: {
                    angle: 1 * PI2 / 4, // i * Math.PI * 2 / count
                    xOffset: Math.cos(1 * PI2 / 4) * 40, // Math.cos(angle) * 40.0
                    yOffset: Math.sin(1 * PI2 / 4) * 40 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 25 * 1.125
                },
                style: {
                    color: Color.Barrel
                }
            },{
                children: [{
                    children: [{
                        position: {
                            xOffset:(40 + ( 0.7 * 56.7 * (20 / 42)))/2, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                            yOffset: 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                            angle: 0 + 0
                        },
                        physics: {
                            sides: 2,
                            size: (0.7 * 56.7 * (20 / 42)),
                            width: 0.7 * 56.7,
                            isTrapezoid: true
                        },
                        style: {
                            color: Color.Barrel
                        }
                    }],
                    // the actual barrel
                    position: {
                        xOffset: Math.cos(0) * (40 / 2 + 0) - Math.sin(0) * 0, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                        yOffset: Math.sin(0) * (40 / 2 + 0) - Math.cos(0) * 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                        angle: 0 + 0
                    },
                    physics: {
                        sides: 2,
                        size: 40,
                        width: 0.7 * 56.7,
                        isTrapezoid: false
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                // the socket for the barrel
                position: {
                    angle: 2 * PI2 / 4, // i * Math.PI * 2 / count
                    xOffset: Math.cos(2 * PI2 / 4) * 40, // Math.cos(angle) * 40.0
                    yOffset: Math.sin(2 * PI2 / 4) * 40 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 25 * 1.125
                },
                style: {
                    color: Color.Barrel
                }
            },{
                children: [{
                    children: [{
                        position: {
                            xOffset:(40 + ( 0.7 * 56.7 * (20 / 42)))/2, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                            yOffset: 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                            angle: 0 + 0
                        },
                        physics: {
                            sides: 2,
                            size: (0.7 * 56.7 * (20 / 42)),
                            width: 0.7 * 56.7,
                            isTrapezoid: true
                        },
                        style: {
                            color: Color.Barrel
                        }
                    }],
                    // the actual barrel
                    position: {
                        xOffset: Math.cos(0) * (40 / 2 + 0) - Math.sin(0) * 0, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                        yOffset: Math.sin(0) * (40 / 2 + 0) - Math.cos(0) * 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                        angle: 0 + 0
                    },
                    physics: {
                        sides: 2,
                        size: 40,
                        width: 0.7 * 56.7,
                        isTrapezoid: false
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                // the socket for the barrel
                position: {
                    angle: 3 * PI2 / 4, // i * Math.PI * 2 / count
                    xOffset: Math.cos(3 * PI2 / 4) * 40, // Math.cos(angle) * 40.0
                    yOffset: Math.sin(3 * PI2 / 4) * 40 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 25 * 1.125
                },
                style: {
                    color: Color.Barrel
                }
            }],
            // the rotator for the sockets
            physics: {
                size: 5
            },
            position: {
                isAngleAbsolute: true,
                angle: 0
            },
            style: {
                isVisible: false            
            }
        }]
    },
    "droneturret": {
        children: [{
            children: [{
                children: [{
                    // the actual barrel
                    position: {
                        xOffset: Math.cos(0) * (55 / 2 + 0) - Math.sin(0) * 0, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                        yOffset: Math.sin(0) * (55 / 2 + 0) - Math.cos(0) * 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                        angle: 0 + 0
                    },
                    physics: {
                        sides: 2,
                        size: 55,
                        width: 0.7 * 42,
                        isTrapezoid: false
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                // the socket for the barrel
                position: {
                    angle: 0 * PI2 / 3, // i * Math.PI * 2 / count
                    xOffset: Math.cos(0 * PI2 / 2) * 40, // Math.cos(angle) * 40.0
                    yOffset: Math.sin(0 * PI2 / 2) * 40 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 25
                },
                style: {
                    color: Color.Barrel
                }
            },{
                children: [{
                    // the actual barrel
                    position: {
                        xOffset: Math.cos(0) * (55 / 2 + 0) - Math.sin(0) * 0, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                        yOffset: Math.sin(0) * (55 / 2 + 0) - Math.cos(0) * 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                        angle: 0 + 0
                    },
                    physics: {
                        sides: 2,
                        size: 55,
                        width: 0.7 * 42,
                        isTrapezoid: false
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                // the socket for the barrel
                position: {
                    angle: 1 * PI2 / 3, // i * Math.PI * 2 / count
                    xOffset: Math.cos(1 * PI2 / 3) * 40, // Math.cos(angle) * 40.0
                    yOffset: Math.sin(1 * PI2 / 3) * 40 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 25
                },
                style: {
                    color: Color.Barrel
                }
            },{
                children: [{
                    // the actual barrel
                    position: {
                        xOffset: Math.cos(0) * (55 / 2 + 0) - Math.sin(0) * 0, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                        yOffset: Math.sin(0) * (55 / 2 + 0) - Math.cos(0) * 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                        angle: 0 + 0
                    },
                    physics: {
                        sides: 2,
                        size: 55,
                        width: 0.7 * 42,
                        isTrapezoid: false
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                // the socket for the barrel
                position: {
                    angle: 2 * PI2 / 3, // i * Math.PI * 2 / count
                    xOffset: Math.cos(2 * PI2 / 3) * 40, // Math.cos(angle) * 40.0
                    yOffset: Math.sin(2 * PI2 / 3) * 40 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 25
                },
                style: {
                    color: Color.Barrel
                }
            }],
            // the rotator for the sockets
            physics: {
                size: 5
            },
            position: {
                isAngleAbsolute: true,
                angle: 0.5 * PI2 / 3
            },
            style: {
                isVisible: false            
            }
        }]
    },
    "autoauto3": {
        children: [{
            children: [{
                children: [{
                    children: [{
                        position: {
                            xOffset:(60 - ( 0.7 * 56.7 * (20 / 42)))/1.5, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                            yOffset: 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                            angle: 0 + 0
                        },
                        physics: {
                            sides: 1,
                            size: (0.7 * 56.7 * (20 / 42)),
                            width: 0.7 * 56.7
                        },
                        style: {
                            color: Color.Barrel
                        }
                    }],
                    // the actual barrel
                    position: {
                        xOffset: Math.cos(0) * (60 / 2 + 0) - Math.sin(0) * 0, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                        yOffset: Math.sin(0) * (60 / 2 + 0) - Math.cos(0) * 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                        angle: 0 + 0
                    },
                    physics: {
                        sides: 2,
                        size: 60,
                        width: 0.7 * 56.7,
                        isTrapezoid: false
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                // the socket for the barrel
                position: {
                    angle: 0 * PI2 / 3, // i * Math.PI * 2 / count
                    xOffset: Math.cos(0 * PI2 / 3) * 40, // Math.cos(angle) * 40.0
                    yOffset: Math.sin(0 * PI2 / 3) * 40 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 25
                },
                style: {
                    color: Color.Barrel
                }
            },
            {
                children: [{
                    children: [{
                        position: {
                            xOffset:(60 - ( 0.7 * 56.7 * (20 / 42)))/1.5, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                            yOffset: 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                            angle: 0 + 0
                        },
                        physics: {
                            sides: 1,
                            size: (0.7 * 56.7 * (20 / 42)),
                            width: 0.7 * 56.7
                        },
                        style: {
                            color: Color.Barrel
                        }
                    }],
                    // the actual barrel
                    position: {
                        xOffset: Math.cos(0) * (60 / 2 + 0) - Math.sin(0) * 0, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                        yOffset: Math.sin(0) * (60 / 2 + 0) - Math.cos(0) * 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                        angle: 0 + 0
                    },
                    physics: {
                        sides: 2,
                        size: 60,
                        width: 0.7 * 56.7,
                        isTrapezoid: false
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                // the socket for the barrel
                position: {
                    angle: 1 * PI2 / 3, // i * Math.PI * 2 / count
                    xOffset: Math.cos(1 * PI2 / 3) * 40, // Math.cos(angle) * 40.0
                    yOffset: Math.sin(1 * PI2 / 3) * 40 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 25
                },
                style: {
                    color: Color.Barrel
                }
            },
            {
                children: [{
                    children: [{
                        position: {
                            xOffset:(60 - ( 0.7 * 56.7 * (20 / 42)))/1.5, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                            yOffset: 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                            angle: 0 + 0
                        },
                        physics: {
                            sides: 1,
                            size: (0.7 * 56.7 * (20 / 42)),
                            width: 0.7 * 56.7
                        },
                        style: {
                            color: Color.Barrel
                        }
                    }],
                    // the actual barrel
                    position: {
                        xOffset: Math.cos(0) * (60 / 2 + 0) - Math.sin(0) * 0, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                        yOffset: Math.sin(0) * (60 / 2 + 0) - Math.cos(0) * 0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                        angle: 0 + 0
                    },
                    physics: {
                        sides: 2,
                        size: 60,
                        width: 0.7 * 56.7,
                        isTrapezoid: false
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                // the socket for the barrel
                position: {
                    angle: 2 * PI2 / 3, // i * Math.PI * 2 / count
                    xOffset: Math.cos(2 * PI2 / 3) * 40, // Math.cos(angle) * 40.0
                    yOffset: Math.sin(2 * PI2 / 3) * 40 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 25
                },
                style: {
                    color: Color.Barrel
                }
            }],
            // the rotator for the sockets
            physics: {
                size: 5
            },
            position: {
                isAngleAbsolute: true,
                angle: 0
            },
            style: {
                isVisible: false            
            }
        }]
    },
    "cuck": {
        children: [{
            children: [{
                children: [{
                    position: {
                        xOffset: Math.cos(0) * (55 / 2 + 0) - Math.sin(0) * 0,
                        yOffset: Math.sin(0) * (55 / 2 + 0) - Math.cos(0) * 0,
                        angle: 0 + 0
                    },
                    physics: {
                        sides: 2,
                        size: 55,
                        width: 0.7 * 42,
                        isTrapezoid: false
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                position: {
                    angle: 1 * PI2 / 2,
                    xOffset: Math.cos(1 * PI2 / 2) * 40,
                    yOffset: Math.sin(1 * PI2 / 2) * 40
                },
                physics: {
                    size: 25
                },
                style: {
                    color: Color.Barrel
                }
            }],
            // the rotator for the sockets
            physics: {
                size: 5
            },
            position: {
                isAngleAbsolute: true,
                angle: 0
            },
            style: {
                isVisible: false            
            }
        }]
    },
    "overdrive": {
        children: [{
            physics: {
                sides: 4,
                size: 50 * 0.55 * Math.SQRT1_2 // (tankRadius + 5) * sizeRatio * Math.SQRT1_2
            },
            style:{
                showsAboveParent: true,
                color: Color.Barrel
            },
            position: {
                isAngleAbsolute: true
            }
        }]
    },
    "megasmasher": {
        children: [{
            physics: {
                sides: 6,
                size: 50 * 1.3 * Math.SQRT1_2 // (tankRadius + 5) * sizeRatio * Math.SQRT1_2
            },
            position: {
                isAngleAbsolute: true
            }
        }]
    },
    "rammer": {
        children: [{
            physics: {
                sides: 6,
                size: 50 * 1.15 * Math.SQRT1_2 // (tankRadius + 5) * sizeRatio * Math.SQRT1_2
            },
            position: {
                isAngleAbsolute: true,
                angle: Math.PI
            }
        }]
    },   
    "vampsmasher": {
        children: [
            {
                // the socket for the barrel
                position: {
                    angle: 1 * PI2 / 2, // i * Math.PI * 2 / count
                    xOffset: 0, // Math.cos(angle) * 40.0
                    yOffset: 0 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 25
                },
                style: {
                    color: Color.Vampire,
                    showsAboveParent: true
                }
            },
            {
            physics: {
                sides: 6,
                size: 50 * 1.15 * Math.SQRT1_2 // (tankRadius + 5) * sizeRatio * Math.SQRT1_2
            },
            position: {
                isAngleAbsolute: true
            }
        },
        {
            physics: {
                sides: 3,
                size: 50 * 1.45 * Math.SQRT1_2 // (tankRadius + 5) * sizeRatio * Math.SQRT1_2
            },
            style:{
                color: Color.Vampire,
            },
            position: {
                isAngleAbsolute: true,
                angle:  Math.PI/6
            }
        }]
    },
    "vampire": {
        children: [
            {
                // the socket for the barrel
                position: {
                    angle: 1 * PI2 / 2, // i * Math.PI * 2 / count
                    xOffset: 0, // Math.cos(angle) * 40.0
                    yOffset: 0 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 25
                },
                style: {
                    color: Color.Vampire,
                    showsAboveParent: true
                }
            }]
    },
    "autovamp": {
        children: [
            {
                children: [{
                    // the actual barrel
                    position: {
                        xOffset: Math.cos(0) * (60 / 2 + 0) - Math.sin(0), // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                        yOffset: Math.sin(0) * (60 / 2 + 0) - Math.cos(0), // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                        angle: 0 + 0 // angle + trapezoidDirection
                    },
                    physics: {
                        sides: 2,
                        size: 60,
                        width: 0.7 * 21,
                        isTrapezoid: false
                    },
                    style: {
                        color: Color.Barrel
                    }
                },{
                    // the actual barrel
                    position: {
                        xOffset: Math.cos(0) * (40 / 2 + 0) - Math.sin(0), // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                        yOffset: Math.sin(0) * (40 / 2 + 0) - Math.cos(0), // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                        angle: 0 + 0 // angle + trapezoidDirection
                    },
                    physics: {
                        sides: 2,
                        size: 40,
                        width: 0.7 * 42,
                        isTrapezoid: false
                    },
                    style: {
                        color: Color.Barrel
                    }
                }],
                // the socket for the barrel
                position: {
                    angle: 1 * PI2 / 2, // i * Math.PI * 2 / count
                    xOffset: 0, // Math.cos(angle) * 40.0
                    yOffset: 0 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 25
                },
                style: {
                    color: Color.Barrel,
                    showsAboveParent: true
                }
            },            {
                // the socket for the barrel
                position: {
                    angle: 1 * PI2 / 2, // i * Math.PI * 2 / count
                    xOffset: 0, // Math.cos(angle) * 40.0
                    yOffset: 0 // Math.sin(angle) * 40.0
                },
                physics: {
                    size: 12.5
                },
                style: {
                    color: Color.Vampire,
                    showsAboveParent: true
                }
            }]
    },
    "bumper": {
        children: [{
            physics: {
                sides: 1,
                size: 50 * 1.75 * Math.SQRT1_2 // (tankRadius + 5) * sizeRatio * Math.SQRT1_2
            },
            position: {
                isAngleAbsolute: true
            }
        }]
    },
    "saw": {
        children: [{
            physics: {
                sides: 4,
                size: 50 * 1.5 * Math.SQRT1_2 // (tankRadius + 5) * sizeRatio * Math.SQRT1_2
            },
            position: {
                isAngleAbsolute: true,
                angle: Math.PI/8
            }
        }]
    },
    "weirdspike": {
        children: [{
            physics: {
                sides: 3,
                size: 55 * 1.5 * Math.SQRT1_2 // (tankRadius + 5) * sizeRatio * Math.SQRT1_2
            },
            position: {
                isAngleAbsolute: true
            }
        }, {
            physics: {
                sides: 3,
                size: 55 * 1.5 * Math.SQRT1_2 // (tankRadius + 5) * sizeRatio * Math.SQRT1_2
            },
            position: {
                isAngleAbsolute: true,
                angle: Math.PI / 3
            }
        }]
    },
    "minionLauncher": {
        children: [{
            children: [{
                // the actual barrel
                position: {
                    xOffset: 10/50/2, // Math.cos(angle) * (size / 2 + distance) - Math.sin(angle) * offset
                    yOffset:0, // Math.sin(angle) * (size / 2 + distance) - Math.cos(angle) * offset
                    angle: 0 + 0 // angle + trapezoidDirection
                },
                physics: {
                    sides: 2,
                    size:  10/50,
                    width: 1.25,
                    isTrapezoid: false
                },
                style: {
                    color: Color.Barrel,
                    showsAboveParent: true

                    
                }
            }]
        }]
    }
};

export default AddonRenderDefinitions;