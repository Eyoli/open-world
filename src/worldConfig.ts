import {WorldConfig} from "./domain/model/biomes";

export const config: WorldConfig = {
    pokemons: {
        maxNumber: 20,
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
                    p: 20
                },
                {
                    id: 8,
                    p: 30
                },
                {
                    id: 9,
                    p: 40
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
                    p: 20
                },
                {
                    id: 8,
                    p: 30
                },
                {
                    id: 9,
                    p: 40
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
                    p: 20
                },
                {
                    id: 17,
                    p: 30
                },
                {
                    id: 18,
                    p: 40
                },
                {
                    id: 19,
                    p: 60
                },
                {
                    id: 20,
                    p: 70
                },
                {
                    id: 21,
                    p: 90
                },
                {
                    id: 22,
                    p: 100
                }
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
                    p: 20
                },
                {
                    id: 11,
                    p: 30
                },
                {
                    id: 12,
                    p: 40
                },
                {
                    id: 13,
                    p: 60
                },
                {
                    id: 14,
                    p: 70
                },
                {
                    id: 15,
                    p: 80
                },
                {
                    id: 46,
                    p: 90
                },
                {
                    id: 47,
                    p: 100
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
            "items": [
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
                    p: 20
                },
                {
                    id: 75,
                    p: 30
                },
                {
                    id: 76,
                    p: 35
                },
                {
                    id: 95,
                    p: 55
                },
                {
                    id: 111,
                    p: 65
                },
                {
                    id: 112,
                    p: 75
                },
                {
                    id: 185,
                    p: 100
                }
            ]
        },
        SNOWY_MOUNTAIN: {
            type: "SNOWY_MOUNTAIN",
            color: "#ffffff",
            pokemons: [
                {
                    id: 124,
                    p: 20
                },
                {
                    id: 215,
                    p: 30
                },
                {
                    id: 220,
                    p: 35
                },
                {
                    id: 221,
                    p: 55
                },
                {
                    id: 225,
                    p: 65
                },
                {
                    id: 238,
                    p: 75
                },
                {
                    id: 361,
                    p: 100
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
            density: 50
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
                                threshold: 0.8,
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