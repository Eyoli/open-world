import {csv} from 'd3-fetch'
import {BiomeConfig} from "./biomes";
import {randomInt} from "../utils/random";
import {Pokemon as SmogonPokemon} from "@smogon/calc";
import {Pokemon} from "./pokemon";

const POKEMON_GEN = 9

const randomPokemonId = randomInt(1, 493)

export type PokemonData = {
    id: number,
    data: SmogonPokemon
}

export class Pokedex {
    constructor(
        private readonly data: Map<string, any>
    ) {
        this.data = data
    }

    get(id: number) {
        return this.data.get(id.toString())
    }

    generateRandomPokemon(biome: BiomeConfig): PokemonData {
        const randomizer = randomInt(1, 100)
        const config = biome.pokemons?.find(pConf => randomizer() < pConf.p)

        const id = config?.id || randomPokemonId()
        const pokedexEntry = this.get(id)
        const pokemonData = new SmogonPokemon(POKEMON_GEN, pokedexEntry["Pokemon"]);
        return {
            id,
            data: pokemonData
        }
    }
}

export const loadNationalPokedex = async () => {
    const data: [p: string, value: any][] = (await csv('dist/pokemon-national-dex.csv'))
        .map((row, i) => [row["Nat"], row])
    return new Pokedex(new Map(data))
}
