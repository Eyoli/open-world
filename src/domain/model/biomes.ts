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
    factors: { [key: string]: FactorConfig }
    terrain: TerrainConfig
}

export type FactorConfig = {
    density: number
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
    factor?: string
    sub?: TerrainConfig[]
}

export type PokemonConfig = {
    id: number
    w: number
}
