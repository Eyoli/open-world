import {WorldConfig} from "./domain/model/config";

export const config: WorldConfig = {
    pokemons: {
        maxNumber: 50,
        maxDistanceToCenter: 2000
    },
    chunkSize: 1000,
    chunkDensity: 40,
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
            src: "dist/images/trees.json"
        },
        {
            alias: "ROCKS",
            src: "dist/images/rocks.json"
        },
        {
            alias: "BUILDINGS",
            src: "dist/images/buildings.json"
        },
        {
            alias: "deep_water",
            src: "dist/images/deep_water.png"
        },
        {
            alias: "sand",
            src: "dist/images/sand.png"
        },
        {
            alias: "snow",
            src: "dist/images/snow.png"
        },
        {
            alias: "mountain",
            src: "dist/images/mountain.png"
        },
        {
            alias: "water",
            src: "dist/images/water.png"
        },
        {
            alias: "grass",
            src: "dist/images/grass.png"
        }
    ],
    biomes: {
        BEACH: {
            type: "Beach",
            color: "#e1d8c6",
            texture: "sand",
            pItem: 0.002,
            pokemons: [],
            items: [
                {
                    type: "BBCA3668-37E6-4401-8F86-F91792DC4CD3",
                    w: 1,
                    scale: 2
                },
                {
                    type: "5FC6E016-2AB4-4891-8082-AA9B54DB6CDD",
                    w: 1,
                    scale: 2
                }
            ]
        },
        DESERT: {
            type: "Desert",
            color: "#c6b799",
            texture: "sand",
            pItem: 0.004,
            pokemons: [],
            items: [
                {
                    type: "51A643D4-6973-4269-A6D3-796F94011275",
                    w: 1,
                    scale: 2
                },
                {
                    type: "DE7AB9F7-B21F-4FD4-BDC9-C9D55DD0BE04",
                    w: 1,
                    scale: 2
                },
                {
                    type: "7E32CBA5-EBF3-424A-A839-EBA44E46486E",
                    w: 1,
                    scale: 2
                },
                {
                    type: "65C40BB9-5DE4-4694-9E90-3B4C6113583E",
                    w: 1,
                    scale: 2
                }
            ]
        },
        DEEP_OCEAN: {
            type: "Deep ocean",
            color: "#3374bf",
            texture: "water",
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
            type: "Ocean",
            color: "#5a9ae3",
            texture: "water",
            pItem: 0.0005,
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
            items: [
                {
                    type: "72C3A99D-BD99-48F8-8ACB-BCFC3942F0B4",
                    w: 1,
                    scale: 2
                }
            ]
        },
        LAKE: {
            type: "Lake",
            color: "#adc9cd",
            texture: "water",
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
        OASIS: {
            type: "Oasis",
            color: "#d2dfe1",
            texture: "water",
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
            type: "Plain",
            color: "#63a131",
            texture: "grass",
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
            type: "Forest",
            color: "#558e27",
            texture: "grass",
            pItem: 0.1,
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
        RED_FOREST: {
            type: "Red forest",
            pItem: 0.05,
            color: "#c6b799",
            texture: "sand",
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
                    type: "6DF63721-51D4-4805-9718-B98797894384",
                    w: 3,
                    scale: 2
                },
                {
                    type: "5542D68E-3599-4A8B-8C8D-3FD0F03F7925",
                    w: 3,
                    scale: 2
                },
                {
                    type: "C0D8AFAE-9108-4F0F-8601-580B357C3877",
                    w: 1,
                    scale: 2
                },
                {
                    type: "4DCFED99-036F-4A27-8D90-B00908595F6C",
                    w: 2,
                    scale: 2
                }
            ]
        },
        HIGH_FOREST: {
            type: "High forest",
            preset: "FOREST",
            color: "#b5b3a5",
            texture: "mountain",
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
            type: "Mountain",
            color: "#b5b3a5",
            texture: "mountain",
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
                },
                {
                    type: "61366C93-253D-47CC-B1FB-FDC4AA51DA8C",
                    w: 1,
                    scale: 2
                },
                {
                    type: "A4333FCB-C4F9-4340-AEBE-EAD3B1DF72C3",
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
        SNOWY_MOUNTAIN: {
            type: "Snowy mountain",
            color: "#d1f2f4",
            texture: "snow",
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
                },
                {
                    type: "C34B7581-3176-4E5E-A7BF-8A90927DC70C",
                    w: 1,
                    scale: 2
                }
            ]
        },
        SNOWY_FOREST: {
            type: "Snowy forest",
            preset: "FOREST",
            color: "#d1f2f4",
            texture: "snow",
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
                },
                {
                    type: "C34B7581-3176-4E5E-A7BF-8A90927DC70C",
                    w: 1,
                    scale: 2
                }
            ]
        },
        GLACIER: {
            type: "Glacier",
            color: "#b3ebed",
            pItem: 0,
            pokemons: [],
            items: []
        }
    },
    factors: {
        HEIGHT: {
            density: 800,
            octaves: 3,
        },
        NATURE: {
            density: 40,
            octaves: 3,
        },
        CLIMATE: {
            density: 1000,
            octaves: 1,
        },
        HUMIDITY: {
            density: 40,
            octaves: 1,
        }
    },
    terrain: {
        factor: "HEIGHT",
        sub: [
            {
                threshold: 0.4,
                type: "DEEP_OCEAN",
            },
            {
                threshold: 0.53,
                type: "OCEAN",
            },
            {
                threshold: 0.58,
                type: "BEACH",
            },
            {
                threshold: 0.63,
                factor: "CLIMATE",
                sub: [
                    {
                        threshold: 0.5,
                        type: "PLAIN"
                    },
                    {
                        threshold: 1,
                        type: "DESERT"
                    }
                ]
            },
            {
                threshold: 0.9,
                factor: "CLIMATE",
                sub: [
                    {
                        threshold: 0.5,
                        factor: "HUMIDITY",
                        sub: [
                            {
                                threshold: 0.95,
                                factor: "NATURE",
                                sub: [
                                    {
                                        threshold: 0.7,
                                        type: "FOREST",
                                    },
                                    {
                                        threshold: 1,
                                        type: "PLAIN",
                                    },
                                ]
                            },
                            {
                                threshold: 1,
                                type: "LAKE",
                            },
                        ]
                    },
                    {
                        threshold: 1,
                        factor: "HUMIDITY",
                        sub: [
                            {
                                threshold: 0.9,
                                factor: "NATURE",
                                sub: [
                                    {
                                        threshold: 0.3,
                                        type: "RED_FOREST",
                                    },
                                    {
                                        threshold: 1,
                                        type: "DESERT",
                                    },
                                ]
                            },
                            {
                                threshold: 0.96,
                                type: "BEACH",
                            },
                            {
                                threshold: 1,
                                type: "OASIS",
                            },
                        ]
                    },
                ]
            },
            {
                threshold: 0.97,
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
                        factor: "NATURE",
                        sub: [
                            {
                                threshold: 0.7,
                                type: "SNOWY_MOUNTAIN",
                            },
                            {
                                threshold: 1,
                                type: "SNOWY_FOREST",
                            }
                        ]
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
