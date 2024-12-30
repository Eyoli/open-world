import {WorldConfig} from "./domain/model/biomes";

export const config: WorldConfig = {
    pokemons: {
        maxNumber: 50,
        maxDistanceToCenter: 2000
    },
    chunkSize: 20,
    tileSize: 50,
    assets: [
        {
            alias: "TREE_1",
            src: "dist/images/tree1.png"
        },
        {
            alias: "TREE_2",
            src: "dist/images/tree2.png"
        },
        {
            alias: "ROCK_1",
            src: "dist/images/rock1.png"
        },
        {
            alias: "ROCK_2",
            src: "dist/images/rock2.png"
        },
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
            src: "dist/images/trees/trees.json"
        }
    ],
    biomes: {
        BEACH: {
            type: "BEACH",
            color: "#d5c8af",
            pokemons: [],
            items: []
        },
        DEEP_OCEAN: {
            type: "DEEP_OCEAN",
            color: "#093970",
            pokemons: [
                {
                    id: 7,
                    w: 4
                },
                {
                    id: 8,
                    w: 2
                },
                {
                    id: 9,
                    w: 1
                }
            ],
            items: []
        },
        OCEAN: {
            type: "OCEAN",
            color: "#2469b8",
            pokemons: [
                {
                    id: 7,
                    w: 4
                },
                {
                    id: 8,
                    w: 2
                },
                {
                    id: 9,
                    w: 1
                }
            ],
            items: []
        },
        PLAIN: {
            type: "PLAIN",
            color: "#63a131",
            pokemons: [
                {
                    id: 16,
                    w: 4
                },
                {
                    id: 17,
                    w: 2
                },
                {
                    id: 18,
                    w: 1
                },
                {
                    id: 19,
                    w: 4
                },
                {
                    id: 20,
                    w: 2
                },
                {
                    id: 21,
                    w: 4
                },
                {
                    id: 22,
                    w: 4
                },
                {
                    id: 29,
                    w: 4
                },
                {
                    id: 30,
                    w: 2
                },
                {
                    id: 31,
                    w: 1
                },
                {
                    id: 32,
                    w: 4
                },
                {
                    id: 33,
                    w: 2
                },
                {
                    id: 34,
                    w: 1
                },
            ],
            items: [
                {
                    type: "tile006",
                    "p": 1,
                    "scale": 2
                },
                {
                    type: "tile010",
                    "p": 2,
                    "scale": 2
                }
            ]
        },
        FOREST: {
            type: "FOREST",
            color: "#3e6c15",
            pokemons: [
                {
                    id: 10,
                    w: 4
                },
                {
                    id: 11,
                    w: 2
                },
                {
                    id: 12,
                    w: 1
                },
                {
                    id: 13,
                    w: 4
                },
                {
                    id: 14,
                    w: 2
                },
                {
                    id: 15,
                    w: 1
                },
                {
                    id: 43,
                    w: 4
                },
                {
                    id: 44,
                    w: 2
                },
                {
                    id: 45,
                    w: 1
                },
                {
                    id: 46,
                    w: 4
                },
                {
                    id: 47,
                    w: 2
                }
            ],
            items: [
                {
                    type: "tile007",
                    p: 10,
                    scale: 2
                },
                {
                    type: "tile008",
                    p: 20,
                    scale: 2
                },
                {
                    type: "tile006",
                    p: 10,
                    scale: 2
                }
            ]
        },
        MOUNTAIN: {
            type: "MOUNTAIN",
            color: "#535047",
            items: [
                {
                    type: "ROCK_1",
                    "p": 5,
                    "scale": 0.2
                },
                {
                    type: "ROCK_2",
                    "p": 10,
                    "scale": 0.2
                }
            ],
            pokemons: [
                {
                    id: 74,
                    w: 4
                },
                {
                    id: 75,
                    w: 2
                },
                {
                    id: 76,
                    w: 1
                },
                {
                    id: 95,
                    w: 3
                },
                {
                    id: 111,
                    w: 3
                },
                {
                    id: 112,
                    w: 1
                },
                {
                    id: 185,
                    w: 2
                }
            ]
        },
        SNOWY_MOUNTAIN: {
            type: "SNOWY_MOUNTAIN",
            color: "#ffffff",
            pokemons: [
                {
                    id: 124,
                    w: 3
                },
                {
                    id: 215,
                    w: 3
                },
                {
                    id: 216,
                    w: 4
                },
                {
                    id: 217,
                    w: 1
                },
                {
                    id: 220,
                    w: 4
                },
                {
                    id: 221,
                    w: 1
                },
                {
                    id: 225,
                    w: 3
                },
                {
                    id: 238,
                    w: 3
                },
                {
                    id: 361,
                    w: 3
                }
            ],
            items: []
        }
    },
    factors: {
        ISLANDS: {
            density: 100
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
                        threshold: 0.1,
                        type: "OCEAN",
                    },
                    {
                        threshold: 1,
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
                ]
            },
            {
                threshold: 0.98,
                factor: "HUMIDITY",
                sub: [
                    {
                        threshold: 0.1,
                        type: "OCEAN",
                    },
                    {
                        threshold: 1,
                        type: "MOUNTAIN",
                    },
                ],
            },
            {
                threshold: 1,
                type: "SNOWY_MOUNTAIN",
            }
        ]
    }
}