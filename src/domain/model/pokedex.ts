import {csv} from 'd3-fetch'
import {BiomeConfig} from "./biomes";
import {randomInt} from "../utils/random";
import {Generations, MOVES, Pokemon as SmogonPokemon} from "@smogon/calc";
import {Pokemon} from "./pokemon";
import {Moves} from "@smogon/calc/dist/data/moves";

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
        console.log(Array.from(POKEMON_GEN.moves))
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
        //calculate(POKEMON_GEN, pokemonData, pokemonData, )
        return {
            id,
            generalData: pokedexEntry,
            battleData: pokemonData
        }
    }
}

export const loadNationalPokedex = async () => {
    const data: [p: string, value: any][] = (await csv('dist/pokemon-national-dex.csv'))
        .map((row, i) => [row["Nat"], row])
    return new Pokedex(new Map(data))
}
