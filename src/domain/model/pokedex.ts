import {csv} from 'd3-fetch'
import {BiomeConfig} from "./biomes";
import {randomInt} from "../utils/random";
import {Generations, Pokemon as SmogonPokemon} from "@smogon/calc";

const POKEMON_GEN = Generations.get(9)

const randomPokemonId = randomInt(1, 493)

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

    generateRandomPokemon(biome: BiomeConfig): PokemonData | undefined {
        const randomizer = randomInt(1, 100)
        const config = biome.pokemons?.find(pConf => randomizer() < pConf.p)

        let pokemonData: PokemonData | undefined;
        const id = config?.id || randomPokemonId()
        const pokedexEntry = this.getEntry(id)
        try {
            pokemonData = {
                id,
                generalData: pokedexEntry,
                battleData: new SmogonPokemon(POKEMON_GEN, pokedexEntry["Pokemon"])
            }
        } catch (e) {
            console.error(`Error generating pokemon ${pokedexEntry["Pokemon"]} (${id})`, e)
        }

        return pokemonData
    }
}

export const loadNationalPokedex = async () => {
    const data: [p: string, value: any][] = (await csv('dist/pokemon-national-dex.csv'))
        .map((row, i) => [row["Nat"], row])
    return new Pokedex(new Map(data))
}
