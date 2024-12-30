import {csv} from 'd3-fetch'
import {BiomeConfig, PokemonConfig} from "./biomes";
import {randomUniform} from "../utils/random";
import {Generations, Pokemon as SmogonPokemon} from "@smogon/calc";

const POKEMON_GEN = Generations.get(9)

const randomizer = randomUniform()

const randomPokemon = (biome: BiomeConfig) => {
    if (!biome.pokemons || biome.pokemons.length < 1) return null

    const totalWeight = biome.pokemons.reduce((acc, pConf) => acc + pConf.w, 0);
    const random = randomizer() * totalWeight;
    let total = 0;
    return biome.pokemons.find(pConf => {
        total += pConf.w;
        return random <= total;
    })
}

export type PokemonData = {
    id: number,
    generalData: any,
    battleData: SmogonPokemon
}

export class Pokedex {
    constructor(
        private readonly data: Map<string, any>
    ) {
        this.data = data
    }

    getEntry(id: number) {
        return this.data.get(id.toString())
    }

    generateRandomPokemon(biome: BiomeConfig) {
        const config = randomPokemon(biome)
        if (!config) return null

        const pokedexEntry = this.getEntry(config.id)
        try {
            return {
                id: config.id,
                generalData: pokedexEntry,
                battleData: new SmogonPokemon(POKEMON_GEN, pokedexEntry["Pokemon"])
            } as PokemonData
        } catch (e) {
            console.error(`Error generating pokemon ${pokedexEntry["Pokemon"]} (${config.id})`, e)
        }

        return null
    }
}

export const loadNationalPokedex = async () => {
    const data: [p: string, value: any][] = (await csv('dist/pokemon-national-dex.csv'))
        .map((row, i) => [row["Nat"], row])
    return new Pokedex(new Map(data))
}
