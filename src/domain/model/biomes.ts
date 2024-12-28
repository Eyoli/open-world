export type ItemConfig = {
    type: string
    p: number
    scale?: number
}

export type WorldConfig = {
    pokemons: PokemonGenerationConfig
    chunkSize: number
    tileSize: number
    assets: { alias: string, src: string }[]
    biomes: BiomeConfig
}

export type PokemonGenerationConfig = {
    maxNumber: number
    maxDistanceToCenter: number
}

export type BiomeConfig = {
    type?: string
    color?: string
    threshold?: number
    items?: ItemConfig[]
    pokemons?: PokemonConfig[]
    sub?: BiomeConfig[]
}

export type PokemonConfig = {
    id: number
    p: number
}
