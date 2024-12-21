import {WorldConfig} from "./domain/model/biomes";

export const config: WorldConfig = {
    "assets": [
        {
            "alias": "TREE_1",
            "src": "dist/images/tree1.png"
        },
        {
            "alias": "TREE_2",
            "src": "dist/images/tree2.png"
        },
        {
            "alias": "ROCK_1",
            "src": "dist/images/rock1.png"
        },
        {
            "alias": "ROCK_2",
            "src": "dist/images/rock2.png"
        },
        {
            "alias": "UNKNOWN",
            "src": "dist/images/pokemon/unknown.png"
        },
        {
            "alias": "POKEMONS",
            "src": "dist/images/pokemon/texture.json"
        }
    ],
    "biomes": {
        "sub": [
            {
                "threshold": 0.05,
                "sub": [
                    {
                        "type": "DESERT",
                        "color": "#d5c8af",
                        "threshold": 0.01
                    },
                    {
                        "type": "OCEAN",
                        "color": "#2469b8",
                        "threshold": 1,
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
                        ]
                    }
                ]
            },
            {
                "threshold": 1,
                "sub": [
                    {
                        "threshold": 0.9,
                        "sub": [
                            {
                                "type": "PLAIN",
                                "color": "#63a131",
                                "threshold": 0.8,
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
                                "items": [
                                    {
                                        "type": "TREE_1",
                                        "p": 1,
                                        "scale": 0.3
                                    },
                                    {
                                        "type": "TREE_2",
                                        "p": 2,
                                        "scale": 0.3
                                    }
                                ]
                            },
                            {
                                "type": "FOREST",
                                "color": "#3e6c15",
                                "threshold": 1,
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
                                        type: "TREE_1",
                                        p: 15,
                                        scale: 0.3
                                    },
                                    {
                                        type: "TREE_2",
                                        p: 25,
                                        scale: 0.3
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "MOUNTAIN",
                        "color": "#535047",
                        "threshold": 0.985,
                        "items": [
                            {
                                "type": "ROCK_1",
                                "p": 5,
                                "scale": 0.2
                            },
                            {
                                "type": "ROCK_2",
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
                    {
                        "type": "SNOWY_MOUNTAIN",
                        "color": "#ffffff",
                        "threshold": 1,
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
                    }
                ]
            }
        ]
    }
}