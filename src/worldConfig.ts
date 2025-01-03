import {WorldConfig} from "./domain/model/config";

export const config: WorldConfig = {
    pokemons: {
        maxNumber: 50,
        maxDistanceToCenter: 2000
    },
    chunkSize: 20,
    tileSize: 50,
    assets: [
        {
            alias: "UNKNOWN",
            src: "dist/images/pokemon/unknown.png"
        },
        {
            alias: "POKEMONS",
            src: "dist/images/pokemon/texture.json"
        },
        {
            alias: "TREES",
            src: "dist/images/trees/trees_2.json"
        }
    ],
    biomes: {
        BEACH: {
            type: "BEACH",
            color: "#d5c8af",
            pItem: 0.005,
            pokemons: [],
            items: [
                {
                    type: "BBCA3668-37E6-4401-8F86-F91792DC4CD3",
                    w: 1,
                    scale: 2
                }
            ]
        },
        DESERT: {
            type: "Desert",
            color: "#d5c8af",
            pItem: 0,
            pokemons: [],
            items: []
        },
        DEEP_OCEAN: {
            type: "DEEP_OCEAN",
            color: "#093970",
            pItem: 0,
            pokemons: [
                {
                    ids: [72, 90],
                    w: 10
                },
                {
                    ids: [73, 91, 116],
                    w: 4
                },
                {
                    ids: [117],
                    w: 2
                },
                {
                    ids: [9, 130, 131],
                    w: 1
                }
            ],
            items: []
        },
        OCEAN: {
            type: "OCEAN",
            color: "#2469b8",
            pItem: 0,
            pokemons: [
                {
                    ids: [72, 90],
                    w: 10
                },
                {
                    ids: [7, 73, 91,],
                    w: 4
                },
                {
                    ids: [8],
                    w: 2
                }
            ],
            items: []
        },
        LAKE: {
            type: "Lake",
            color: "#2d73c6",
            pItem: 0,
            pokemons: [
                {
                    ids: [7, 60],
                    w: 4
                },
                {
                    ids: [8, 61],
                    w: 2
                },
                {
                    ids: [9, 62],
                    w: 1
                }
            ],
            items: []
        },
        PLAIN: {
            type: "PLAIN",
            color: "#63a131",
            pItem: 0.01,
            pokemons: [
                {
                    ids: [16, 19, 21, 22, 29, 32],
                    w: 4
                },
                {
                    ids: [17, 20, 30, 33],
                    w: 2
                },
                {
                    ids: [18, 31, 34],
                    w: 1
                }
            ],
            items: [
                {
                    type: "3569D858-DDBE-4996-B084-DC98A92A4229",
                    w: 1,
                    scale: 2
                },
                {
                    type: "7A9B1D07-B0DB-4F3D-88FE-5DEC0500D315",
                    w: 1,
                    scale: 2
                },
                {
                    type: "8798078E-745C-4258-AEBD-D14925A27365",
                    w: 1,
                    scale: 2
                }
            ]
        },
        FOREST: {
            type: "FOREST",
            color: "#3e6c15",
            pItem: 0.25,
            pokemons: [
                {
                    ids: [10, 13, 43, 46],
                    w: 4
                },
                {
                    ids: [11, 14, 44, 47],
                    w: 2
                },
                {
                    ids: [12, 15, 45],
                    w: 1
                },
            ],
            items: [
                {
                    type: "3569D858-DDBE-4996-B084-DC98A92A4229",
                    w: 1,
                    scale: 2
                },
                {
                    type: "7A9B1D07-B0DB-4F3D-88FE-5DEC0500D315",
                    w: 1,
                    scale: 2
                },
                {
                    type: "38484192-00F7-4C2C-A600-B3734ACB9CE2",
                    w: 1,
                    scale: 2
                },
                {
                    type: "AD6D7017-39FB-4D29-9DDA-EE5C734DCB01",
                    w: 1,
                    scale: 2
                },
                {
                    type: "10E01ABD-1381-4141-A1F2-F5EB750B1CD6",
                    w: 1,
                    scale: 2
                }
            ]
        },
        HIGH_FOREST: {
            type: "High forest",
            color: "#535047",
            pItem: 0.25,
            pokemons: [
                {
                    ids: [10, 13, 43, 46],
                    w: 4
                },
                {
                    ids: [11, 14, 44, 47],
                    w: 2
                },
                {
                    ids: [12, 15, 45],
                    w: 1
                },
            ],
            items: [
                {
                    type: "E363FE54-D661-4B7C-A5B4-B4EBC9CE6F1A",
                    w: 2,
                    scale: 2
                },
                {
                    type: "9BBFE714-8AC5-4B98-8E8B-80DB5934297E",
                    w: 3,
                    scale: 2
                },
                {
                    type: "D7381202-8218-4F32-A364-337E0B15D8AD",
                    w: 3,
                    scale: 2
                },
                {
                    type: "C34B7581-3176-4E5E-A7BF-8A90927DC70C",
                    w: 1,
                    scale: 2
                }
            ]
        },
        MOUNTAIN: {
            type: "MOUNTAIN",
            color: "#535047",
            pItem: 0.04,
            items: [
                {
                    type: "D7381202-8218-4F32-A364-337E0B15D8AD",
                    w: 1,
                    scale: 2
                },
                {
                    type: "4DCFED99-036F-4A27-8D90-B00908595F6C",
                    w: 2,
                    scale: 2
                },
                {
                    type: "C34B7581-3176-4E5E-A7BF-8A90927DC70C",
                    w: 2,
                    scale: 2
                }
            ],
            pokemons: [
                {
                    ids: [74],
                    w: 4
                },
                {
                    ids: [95, 111],
                    w: 3
                },
                {
                    ids: [75, 185],
                    w: 2
                },
                {
                    ids: [76, 112],
                    w: 1
                }
            ]
        },
        GLACIER: {
            type: "GLACIER",
            color: "#96dadd",
            pItem: 0.005,
            pokemons: [
                {
                    ids: [216, 220],
                    w: 4
                },
                {
                    ids: [124, 215, 225, 238, 361],
                    w: 3
                },
                {
                    ids: [217, 221],
                    w: 1
                }
            ],
            items: [
                {
                    type: "5949BC48-E073-438E-B2C7-0D85A1AFAD54",
                    w: 1,
                    scale: 2
                }
            ]
        }
    },
    factors: {
        CLIMATE: {
            density: 800
        },
        HEIGHT: {
            density: 500
        },
        NATURE: {
            density: 40
        },
        HUMIDITY: {
            density: 40
        }
    },
    terrain: {
        factor: "HEIGHT",
        sub: [
            {
                threshold: 0.45,
                type: "DEEP_OCEAN",
            },
            {
                threshold: 0.55,
                type: "OCEAN",
            },
            {
                threshold: 0.58,
                type: "BEACH"
            },
            {
                threshold: 0.63,
                type: "PLAIN"
            },
            {
                threshold: 0.9,
                factor: "HUMIDITY",
                sub: [
                    {
                        threshold: 0.9,
                        factor: "NATURE",
                        sub: [
                            {
                                threshold: 0.7,
                                type: "PLAIN",
                            },
                            {
                                threshold: 1,
                                type: "FOREST",
                            }
                        ]
                    },
                    {
                        threshold: 1,
                        type: "LAKE",
                    },
                ]
            },
            {
                threshold: 0.98,
                factor: "HUMIDITY",
                sub: [
                    {
                        threshold: 0.9,
                        factor: "NATURE",
                        sub: [
                            {
                                threshold: 0.7,
                                type: "MOUNTAIN",
                            },
                            {
                                threshold: 1,
                                type: "HIGH_FOREST",
                            }
                        ]
                    },
                    {
                        threshold: 1,
                        type: "LAKE",
                    }
                ],
            },
            {
                threshold: 1,
                factor: "HUMIDITY",
                sub: [
                    {
                        threshold: 0.9,
                        type: "MOUNTAIN",
                    },
                    {
                        threshold: 1,
                        type: "GLACIER",
                    }
                ],
            }
        ]
    }
}