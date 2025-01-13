export type WorldConfig = {
    pokemons: PokemonGenerationConfig
    chunkSize: number
    chunkDensity: number
    assets: { alias: string, src: string }[]
    biomes: { [key: string]: BiomeConfig }
    factors: { [key: string]: FactorConfig }
    terrain: TerrainConfig
}

export type FactorConfig = {
    density: number
    octaves?: number
}

export type PokemonGenerationConfig = {
    maxNumber: number
    maxDistanceToCenter: number
}

export type BiomeConfig = {
    name: string
    type?: "Water" | "Soil"
    preset?: string
    color?: string
    texture?: string
    pItem?: number
    items: ItemConfig[]
    pokemons: PokemonConfig[]
}

export type ItemConfig = {
    type: string
    w: number
    scale?: number
}

export type TerrainConfig = {
    type?: string
    factor?: string
    threshold?: number
    sub?: TerrainConfig[]
}

export type PokemonConfig = {
    ids: number[]
    w: number
}
