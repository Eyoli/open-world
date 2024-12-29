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
    biomes: { [key: string]: BiomeConfig }
    terrain: TerrainConfig
}

export type PokemonGenerationConfig = {
    maxNumber: number
    maxDistanceToCenter: number
}

export type BiomeConfig = {
    type: string
    color: string
    items: ItemConfig[]
    pokemons: PokemonConfig[]
}

export type TerrainConfig = {
    type?: string
    threshold?: number
    sub?: TerrainConfig[]
}

export type PokemonConfig = {
    id: number
    p: number
}
