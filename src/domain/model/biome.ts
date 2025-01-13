import {BiomeConfig, PokemonConfig} from "./config";

export class Biome {
    readonly name: string
    readonly type: "Water" | "Soil"
    readonly color: string
    readonly texture: string
    readonly pokemons: PokemonConfig[]

    constructor(
        readonly polygon: [number, number][],
        config: BiomeConfig
    ) {
        this.type = config.type || "Soil"
        this.name = config.name
        this.color = config.color
        this.texture = config.texture
        this.pokemons = config.pokemons
    }
}
