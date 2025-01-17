export type WorldConfig = {
    base: BaseConfig
    assets: AssetsConfig
    biomes: BiomesConfig
    factors: FactorsConfig
    terrain: TerrainConfig
}

export type BaseConfig = {
    pokemons: PokemonGenerationConfig
    chunkSize: number
    chunkDensity: number
}

export type AssetsConfig = { alias: string, src: string }[]

export type FactorsConfig = { [key: string]: FactorConfig }
export type FactorConfig = {
    density: number
    octaves?: number
}

export type PokemonGenerationConfig = {
    maxNumber: number
    maxDistanceToCenter: number
}

export type BiomesConfig = { [key: string]: BiomeConfig }
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
