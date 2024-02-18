"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
;
const AddonRenderDefinitions = {
    "bigautoturret": {
        children: [{
                children: [{
                        position: {
                            xOffset: Math.cos(0) * (96 / 2 + 0) - Math.sin(0),
                            yOffset: Math.sin(0) * (96 / 2 + 0) - Math.cos(0),
                            angle: 0 + 0
                        },
                        physics: {
                            sides: 2,
                            size: 96,
                            width: 0.7 * 75.6,
                            isTrapezoid: false
                        },
                        style: {
                            color: 1
                        }
                    }],
                position: {
                    angle: 1 * util_1.PI2 / 2,
                    xOffset: 0,
                    yOffset: 0
                },
                physics: {
                    size: 25 * 1.5
                },
                style: {
                    color: 1,
                    showsAboveParent: true
                }
            }]
    },
    "auto2": {
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
                            isTrapezoid: true
                        },
                        style: {
                            color: 1
                        }
                    }],
                position: {
                    angle: 1 * util_1.PI2 / 2,
                    xOffset: 0,
                    yOffset: 0
                },
                physics: {
                    size: 25
                },
                style: {
                    color: 1,
                    showsAboveParent: true
                }
            }, {
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
                                    isTrapezoid: true
                                },
                                style: {
                                    color: 1
                                }
                            }],
                        position: {
                            angle: 0 * util_1.PI2 / 2,
                            xOffset: Math.cos(0 * util_1.PI2 / 2) * 40,
                            yOffset: Math.sin(0 * util_1.PI2 / 2) * 40
                        },
                        physics: {
                            size: 25
                        },
                        style: {
                            color: 1
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
                                    color: 1
                                }
                            }],
                        position: {
                            angle: 1 * util_1.PI2 / 2,
                            xOffset: Math.cos(1 * util_1.PI2 / 2) * 40,
                            yOffset: Math.sin(1 * util_1.PI2 / 2) * 40
                        },
                        physics: {
                            size: 25
                        },
                        style: {
                            color: 1
                        }
                    }],
                physics: {
                    size: 5
                },
                position: {
                    isAngleAbsolute: true,
                    angle: 0.5 * util_1.PI2 / 2
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
                                position: {
                                    xOffset: Math.cos(0) * (65 / 2 + 0) - Math.sin(0) * 0,
                                    yOffset: Math.sin(0) * (65 / 2 + 0) - Math.cos(0) * 0,
                                    angle: 0 + Math.PI
                                },
                                physics: {
                                    sides: 2,
                                    size: 65,
                                    width: 0.7 * 71.4,
                                    isTrapezoid: false
                                },
                                style: {
                                    color: 1
                                }
                            }],
                        position: {
                            angle: 0 * util_1.PI2 / 3,
                            xOffset: Math.cos(0 * util_1.PI2 / 2) * 40,
                            yOffset: Math.sin(0 * util_1.PI2 / 2) * 40
                        },
                        physics: {
                            size: 25 * 1.25
                        },
                        style: {
                            color: 1
                        }
                    }, {
                        children: [{
                                position: {
                                    xOffset: Math.cos(0) * (65 / 2 + 0) - Math.sin(0) * 0,
                                    yOffset: Math.sin(0) * (65 / 2 + 0) - Math.cos(0) * 0,
                                    angle: 0 + Math.PI
                                },
                                physics: {
                                    sides: 2,
                                    size: 65,
                                    width: 0.7 * 71.4,
                                    isTrapezoid: false
                                },
                                style: {
                                    color: 1
                                }
                            }],
                        position: {
                            angle: 1 * util_1.PI2 / 3,
                            xOffset: Math.cos(1 * util_1.PI2 / 3) * 40,
                            yOffset: Math.sin(1 * util_1.PI2 / 3) * 40
                        },
                        physics: {
                            size: 25 * 1.25
                        },
                        style: {
                            color: 1
                        }
                    }, {
                        children: [{
                                position: {
                                    xOffset: Math.cos(0) * (65 / 2 + 0) - Math.sin(0) * 0,
                                    yOffset: Math.sin(0) * (65 / 2 + 0) - Math.cos(0) * 0,
                                    angle: 0 + Math.PI
                                },
                                physics: {
                                    sides: 2,
                                    size: 65,
                                    width: 0.7 * 71.4,
                                    isTrapezoid: false
                                },
                                style: {
                                    color: 1
                                }
                            }],
                        position: {
                            angle: 2 * util_1.PI2 / 3,
                            xOffset: Math.cos(2 * util_1.PI2 / 3) * 40,
                            yOffset: Math.sin(2 * util_1.PI2 / 3) * 40
                        },
                        physics: {
                            size: 25 * 1.25
                        },
                        style: {
                            color: 1
                        }
                    }],
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
                                position: {
                                    xOffset: Math.cos(0) * (65 / 2 + 0) - Math.sin(0) * 0,
                                    yOffset: Math.sin(0) * (65 / 2 + 0) - Math.cos(0) * 0,
                                    angle: 0 + Math.PI
                                },
                                physics: {
                                    sides: 2,
                                    size: 65,
                                    width: 0.7 * 42,
                                    isTrapezoid: true
                                },
                                style: {
                                    color: 1
                                }
                            }],
                        position: {
                            angle: 0 * util_1.PI2 / 3,
                            xOffset: Math.cos(0 * util_1.PI2 / 2) * 40,
                            yOffset: Math.sin(0 * util_1.PI2 / 2) * 40
                        },
                        physics: {
                            size: 25 * 1.1
                        },
                        style: {
                            color: 1
                        }
                    }, {
                        children: [{
                                position: {
                                    xOffset: Math.cos(0) * (65 / 2 + 0) - Math.sin(0) * 0,
                                    yOffset: Math.sin(0) * (65 / 2 + 0) - Math.cos(0) * 0,
                                    angle: 0 + Math.PI
                                },
                                physics: {
                                    sides: 2,
                                    size: 65,
                                    width: 0.7 * 42,
                                    isTrapezoid: true
                                },
                                style: {
                                    color: 1
                                }
                            }],
                        position: {
                            angle: 1 * util_1.PI2 / 3,
                            xOffset: Math.cos(1 * util_1.PI2 / 3) * 40,
                            yOffset: Math.sin(1 * util_1.PI2 / 3) * 40
                        },
                        physics: {
                            size: 25 * 1.1
                        },
                        style: {
                            color: 1
                        }
                    }, {
                        children: [{
                                position: {
                                    xOffset: Math.cos(0) * (65 / 2 + 0) - Math.sin(0) * 0,
                                    yOffset: Math.sin(0) * (65 / 2 + 0) - Math.cos(0) * 0,
                                    angle: 0 + Math.PI
                                },
                                physics: {
                                    sides: 2,
                                    size: 65,
                                    width: 0.7 * 42,
                                    isTrapezoid: true
                                },
                                style: {
                                    color: 1
                                }
                            }],
                        position: {
                            angle: 2 * util_1.PI2 / 3,
                            xOffset: Math.cos(2 * util_1.PI2 / 3) * 40,
                            yOffset: Math.sin(2 * util_1.PI2 / 3) * 40
                        },
                        physics: {
                            size: 25 * 1.1
                        },
                        style: {
                            color: 1
                        }
                    }],
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
                                    color: 1
                                }
                            }],
                        position: {
                            angle: 1.5 * util_1.PI2 / 3,
                            xOffset: Math.cos(0 * util_1.PI2 / 2) * 90,
                            yOffset: Math.sin(0 * util_1.PI2 / 2) * 90
                        },
                        physics: {
                            size: 25
                        },
                        style: {
                            color: 1
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
                                    isTrapezoid: false
                                },
                                style: {
                                    color: 1
                                }
                            }],
                        position: {
                            angle: 2.5 * util_1.PI2 / 3,
                            xOffset: Math.cos(1 * util_1.PI2 / 3) * 90,
                            yOffset: Math.sin(1 * util_1.PI2 / 3) * 90
                        },
                        physics: {
                            size: 25
                        },
                        style: {
                            color: 1
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
                                    isTrapezoid: false
                                },
                                style: {
                                    color: 1
                                }
                            }],
                        position: {
                            angle: 3.5 * util_1.PI2 / 3,
                            xOffset: Math.cos(2 * util_1.PI2 / 3) * 90,
                            yOffset: Math.sin(2 * util_1.PI2 / 3) * 90
                        },
                        physics: {
                            size: 25
                        },
                        style: {
                            color: 1
                        }
                    }],
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
                                            xOffset: (40 + (0.7 * 56.7 * (20 / 42))) / 2,
                                            yOffset: 0,
                                            angle: 0 + 0
                                        },
                                        physics: {
                                            sides: 2,
                                            size: (0.7 * 56.7 * (20 / 42)),
                                            width: 0.7 * 56.7,
                                            isTrapezoid: true
                                        },
                                        style: {
                                            color: 1
                                        }
                                    }],
                                position: {
                                    xOffset: Math.cos(0) * (40 / 2 + 0) - Math.sin(0) * 0,
                                    yOffset: Math.sin(0) * (40 / 2 + 0) - Math.cos(0) * 0,
                                    angle: 0 + 0
                                },
                                physics: {
                                    sides: 2,
                                    size: 40,
                                    width: 0.7 * 56.7,
                                    isTrapezoid: false
                                },
                                style: {
                                    color: 1
                                }
                            }],
                        position: {
                            angle: 0 * util_1.PI2 / 4,
                            xOffset: Math.cos(0 * util_1.PI2 / 4) * 40,
                            yOffset: Math.sin(0 * util_1.PI2 / 4) * 40
                        },
                        physics: {
                            size: 25 * 1.125
                        },
                        style: {
                            color: 1
                        }
                    }, {
                        children: [{
                                children: [{
                                        position: {
                                            xOffset: (40 + (0.7 * 56.7 * (20 / 42))) / 2,
                                            yOffset: 0,
                                            angle: 0 + 0
                                        },
                                        physics: {
                                            sides: 2,
                                            size: (0.7 * 56.7 * (20 / 42)),
                                            width: 0.7 * 56.7,
                                            isTrapezoid: true
                                        },
                                        style: {
                                            color: 1
                                        }
                                    }],
                                position: {
                                    xOffset: Math.cos(0) * (40 / 2 + 0) - Math.sin(0) * 0,
                                    yOffset: Math.sin(0) * (40 / 2 + 0) - Math.cos(0) * 0,
                                    angle: 0 + 0
                                },
                                physics: {
                                    sides: 2,
                                    size: 40,
                                    width: 0.7 * 56.7,
                                    isTrapezoid: false
                                },
                                style: {
                                    color: 1
                                }
                            }],
                        position: {
                            angle: 1 * util_1.PI2 / 4,
                            xOffset: Math.cos(1 * util_1.PI2 / 4) * 40,
                            yOffset: Math.sin(1 * util_1.PI2 / 4) * 40
                        },
                        physics: {
                            size: 25 * 1.125
                        },
                        style: {
                            color: 1
                        }
                    }, {
                        children: [{
                                children: [{
                                        position: {
                                            xOffset: (40 + (0.7 * 56.7 * (20 / 42))) / 2,
                                            yOffset: 0,
                                            angle: 0 + 0
                                        },
                                        physics: {
                                            sides: 2,
                                            size: (0.7 * 56.7 * (20 / 42)),
                                            width: 0.7 * 56.7,
                                            isTrapezoid: true
                                        },
                                        style: {
                                            color: 1
                                        }
                                    }],
                                position: {
                                    xOffset: Math.cos(0) * (40 / 2 + 0) - Math.sin(0) * 0,
                                    yOffset: Math.sin(0) * (40 / 2 + 0) - Math.cos(0) * 0,
                                    angle: 0 + 0
                                },
                                physics: {
                                    sides: 2,
                                    size: 40,
                                    width: 0.7 * 56.7,
                                    isTrapezoid: false
                                },
                                style: {
                                    color: 1
                                }
                            }],
                        position: {
                            angle: 2 * util_1.PI2 / 4,
                            xOffset: Math.cos(2 * util_1.PI2 / 4) * 40,
                            yOffset: Math.sin(2 * util_1.PI2 / 4) * 40
                        },
                        physics: {
                            size: 25 * 1.125
                        },
                        style: {
                            color: 1
                        }
                    }, {
                        children: [{
                                children: [{
                                        position: {
                                            xOffset: (40 + (0.7 * 56.7 * (20 / 42))) / 2,
                                            yOffset: 0,
                                            angle: 0 + 0
                                        },
                                        physics: {
                                            sides: 2,
                                            size: (0.7 * 56.7 * (20 / 42)),
                                            width: 0.7 * 56.7,
                                            isTrapezoid: true
                                        },
                                        style: {
                                            color: 1
                                        }
                                    }],
                                position: {
                                    xOffset: Math.cos(0) * (40 / 2 + 0) - Math.sin(0) * 0,
                                    yOffset: Math.sin(0) * (40 / 2 + 0) - Math.cos(0) * 0,
                                    angle: 0 + 0
                                },
                                physics: {
                                    sides: 2,
                                    size: 40,
                                    width: 0.7 * 56.7,
                                    isTrapezoid: false
                                },
                                style: {
                                    color: 1
                                }
                            }],
                        position: {
                            angle: 3 * util_1.PI2 / 4,
                            xOffset: Math.cos(3 * util_1.PI2 / 4) * 40,
                            yOffset: Math.sin(3 * util_1.PI2 / 4) * 40
                        },
                        physics: {
                            size: 25 * 1.125
                        },
                        style: {
                            color: 1
                        }
                    }],
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
                                    color: 1
                                }
                            }],
                        position: {
                            angle: 0 * util_1.PI2 / 3,
                            xOffset: Math.cos(0 * util_1.PI2 / 2) * 40,
                            yOffset: Math.sin(0 * util_1.PI2 / 2) * 40
                        },
                        physics: {
                            size: 25
                        },
                        style: {
                            color: 1
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
                                    isTrapezoid: false
                                },
                                style: {
                                    color: 1
                                }
                            }],
                        position: {
                            angle: 1 * util_1.PI2 / 3,
                            xOffset: Math.cos(1 * util_1.PI2 / 3) * 40,
                            yOffset: Math.sin(1 * util_1.PI2 / 3) * 40
                        },
                        physics: {
                            size: 25
                        },
                        style: {
                            color: 1
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
                                    isTrapezoid: false
                                },
                                style: {
                                    color: 1
                                }
                            }],
                        position: {
                            angle: 2 * util_1.PI2 / 3,
                            xOffset: Math.cos(2 * util_1.PI2 / 3) * 40,
                            yOffset: Math.sin(2 * util_1.PI2 / 3) * 40
                        },
                        physics: {
                            size: 25
                        },
                        style: {
                            color: 1
                        }
                    }],
                physics: {
                    size: 5
                },
                position: {
                    isAngleAbsolute: true,
                    angle: 0.5 * util_1.PI2 / 3
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
                                            xOffset: (60 - (0.7 * 56.7 * (20 / 42))) / 1.5,
                                            yOffset: 0,
                                            angle: 0 + 0
                                        },
                                        physics: {
                                            sides: 1,
                                            size: (0.7 * 56.7 * (20 / 42)),
                                            width: 0.7 * 56.7
                                        },
                                        style: {
                                            color: 1
                                        }
                                    }],
                                position: {
                                    xOffset: Math.cos(0) * (60 / 2 + 0) - Math.sin(0) * 0,
                                    yOffset: Math.sin(0) * (60 / 2 + 0) - Math.cos(0) * 0,
                                    angle: 0 + 0
                                },
                                physics: {
                                    sides: 2,
                                    size: 60,
                                    width: 0.7 * 56.7,
                                    isTrapezoid: false
                                },
                                style: {
                                    color: 1
                                }
                            }],
                        position: {
                            angle: 0 * util_1.PI2 / 3,
                            xOffset: Math.cos(0 * util_1.PI2 / 3) * 40,
                            yOffset: Math.sin(0 * util_1.PI2 / 3) * 40
                        },
                        physics: {
                            size: 25
                        },
                        style: {
                            color: 1
                        }
                    },
                    {
                        children: [{
                                children: [{
                                        position: {
                                            xOffset: (60 - (0.7 * 56.7 * (20 / 42))) / 1.5,
                                            yOffset: 0,
                                            angle: 0 + 0
                                        },
                                        physics: {
                                            sides: 1,
                                            size: (0.7 * 56.7 * (20 / 42)),
                                            width: 0.7 * 56.7
                                        },
                                        style: {
                                            color: 1
                                        }
                                    }],
                                position: {
                                    xOffset: Math.cos(0) * (60 / 2 + 0) - Math.sin(0) * 0,
                                    yOffset: Math.sin(0) * (60 / 2 + 0) - Math.cos(0) * 0,
                                    angle: 0 + 0
                                },
                                physics: {
                                    sides: 2,
                                    size: 60,
                                    width: 0.7 * 56.7,
                                    isTrapezoid: false
                                },
                                style: {
                                    color: 1
                                }
                            }],
                        position: {
                            angle: 1 * util_1.PI2 / 3,
                            xOffset: Math.cos(1 * util_1.PI2 / 3) * 40,
                            yOffset: Math.sin(1 * util_1.PI2 / 3) * 40
                        },
                        physics: {
                            size: 25
                        },
                        style: {
                            color: 1
                        }
                    },
                    {
                        children: [{
                                children: [{
                                        position: {
                                            xOffset: (60 - (0.7 * 56.7 * (20 / 42))) / 1.5,
                                            yOffset: 0,
                                            angle: 0 + 0
                                        },
                                        physics: {
                                            sides: 1,
                                            size: (0.7 * 56.7 * (20 / 42)),
                                            width: 0.7 * 56.7
                                        },
                                        style: {
                                            color: 1
                                        }
                                    }],
                                position: {
                                    xOffset: Math.cos(0) * (60 / 2 + 0) - Math.sin(0) * 0,
                                    yOffset: Math.sin(0) * (60 / 2 + 0) - Math.cos(0) * 0,
                                    angle: 0 + 0
                                },
                                physics: {
                                    sides: 2,
                                    size: 60,
                                    width: 0.7 * 56.7,
                                    isTrapezoid: false
                                },
                                style: {
                                    color: 1
                                }
                            }],
                        position: {
                            angle: 2 * util_1.PI2 / 3,
                            xOffset: Math.cos(2 * util_1.PI2 / 3) * 40,
                            yOffset: Math.sin(2 * util_1.PI2 / 3) * 40
                        },
                        physics: {
                            size: 25
                        },
                        style: {
                            color: 1
                        }
                    }],
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
                                    color: 1
                                }
                            }],
                        position: {
                            angle: 1 * util_1.PI2 / 2,
                            xOffset: Math.cos(1 * util_1.PI2 / 2) * 40,
                            yOffset: Math.sin(1 * util_1.PI2 / 2) * 40
                        },
                        physics: {
                            size: 25
                        },
                        style: {
                            color: 1
                        }
                    }],
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
                    size: 50 * 0.55 * Math.SQRT1_2
                },
                style: {
                    showsAboveParent: true,
                    color: 1
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
                    size: 50 * 1.3 * Math.SQRT1_2
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
                    size: 50 * 1.15 * Math.SQRT1_2
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
                position: {
                    angle: 1 * util_1.PI2 / 2,
                    xOffset: 0,
                    yOffset: 0
                },
                physics: {
                    size: 25
                },
                style: {
                    color: 26,
                    showsAboveParent: true
                }
            },
            {
                physics: {
                    sides: 6,
                    size: 50 * 1.15 * Math.SQRT1_2
                },
                position: {
                    isAngleAbsolute: true
                }
            },
            {
                physics: {
                    sides: 3,
                    size: 50 * 1.45 * Math.SQRT1_2
                },
                style: {
                    color: 26,
                },
                position: {
                    isAngleAbsolute: true,
                    angle: Math.PI / 6
                }
            }
        ]
    },
    "vampire": {
        children: [
            {
                position: {
                    angle: 1 * util_1.PI2 / 2,
                    xOffset: 0,
                    yOffset: 0
                },
                physics: {
                    size: 25
                },
                style: {
                    color: 26,
                    showsAboveParent: true
                }
            }
        ]
    },
    "autovamp": {
        children: [
            {
                children: [{
                        position: {
                            xOffset: Math.cos(0) * (60 / 2 + 0) - Math.sin(0),
                            yOffset: Math.sin(0) * (60 / 2 + 0) - Math.cos(0),
                            angle: 0 + 0
                        },
                        physics: {
                            sides: 2,
                            size: 60,
                            width: 0.7 * 21,
                            isTrapezoid: false
                        },
                        style: {
                            color: 1
                        }
                    }, {
                        position: {
                            xOffset: Math.cos(0) * (40 / 2 + 0) - Math.sin(0),
                            yOffset: Math.sin(0) * (40 / 2 + 0) - Math.cos(0),
                            angle: 0 + 0
                        },
                        physics: {
                            sides: 2,
                            size: 40,
                            width: 0.7 * 42,
                            isTrapezoid: false
                        },
                        style: {
                            color: 1
                        }
                    }],
                position: {
                    angle: 1 * util_1.PI2 / 2,
                    xOffset: 0,
                    yOffset: 0
                },
                physics: {
                    size: 25
                },
                style: {
                    color: 1,
                    showsAboveParent: true
                }
            }, {
                position: {
                    angle: 1 * util_1.PI2 / 2,
                    xOffset: 0,
                    yOffset: 0
                },
                physics: {
                    size: 12.5
                },
                style: {
                    color: 26,
                    showsAboveParent: true
                }
            }
        ]
    },
    "bumper": {
        children: [{
                physics: {
                    sides: 1,
                    size: 50 * 1.75 * Math.SQRT1_2
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
                    size: 50 * 1.5 * Math.SQRT1_2
                },
                position: {
                    isAngleAbsolute: true,
                    angle: Math.PI / 8
                }
            }]
    },
    "weirdspike": {
        children: [{
                physics: {
                    sides: 3,
                    size: 55 * 1.5 * Math.SQRT1_2
                },
                position: {
                    isAngleAbsolute: true
                }
            }, {
                physics: {
                    sides: 3,
                    size: 55 * 1.5 * Math.SQRT1_2
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
                        position: {
                            xOffset: 10 / 50 / 2,
                            yOffset: 0,
                            angle: 0 + 0
                        },
                        physics: {
                            sides: 2,
                            size: 10 / 50,
                            width: 1.25,
                            isTrapezoid: false
                        },
                        style: {
                            color: 1,
                            showsAboveParent: true
                        }
                    }]
            }]
    }
};
exports.default = AddonRenderDefinitions;
