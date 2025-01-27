import {csv} from 'd3-fetch'
import {PokemonConfig} from "./config";
import {randomUniform} from "../utils/random";
import {Pokemon as SmogonPokemon, toID} from "@smogon/calc";
import {Biome} from "./biome";
import {Dex} from '@pkmn/dex';
import {Generations} from '@pkmn/data';

const POKEMON_GEN = new Generations(Dex).get(9)
POKEMON_GEN.learnsets.get('bulbasaur').then(
    (learnset) => {
        console.log(learnset)
    }
);

const randomizer = randomUniform()

const randomPokemon = (biome: Biome) => {
    if (!biome.pokemons || biome.pokemons.length < 1) return null
    const unwrapped = biome.pokemons.flatMap((pConf: PokemonConfig) => pConf.ids.map(id => ({id, w: pConf.w})))

    const totalWeight = unwrapped.reduce((acc, pConf) => acc + pConf.w, 0);
    const random = randomizer() * totalWeight;
    let total = 0;
    return unwrapped.find(pConf => {
        total += pConf.w;
        return random <= total;
    }).id
}

export type PokemonData = {
    id: number,
    generalData: any,
    battleData: SmogonPokemon,
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

    generateRandomPokemon(biome: Biome) {
        const id = randomPokemon(biome)
        if (!id) return null

        const pokedexEntry = this.getEntry(id)
        try {
            const smogonPokemon = new SmogonPokemon(POKEMON_GEN.dex.gen, pokedexEntry["Pokemon"]);
            return {
                id,
                generalData: pokedexEntry,
                battleData: smogonPokemon
            } as PokemonData
        } catch (e) {
            console.error(`Error generating pokemon ${pokedexEntry["Pokemon"]} (${id})`, e)
        }

        return null
    }
}

export const loadNationalPokedex = async () => {
    console.log(POKEMON_GEN.species.get(toID('bulbasaur')))
    const data: [p: string, value: any][] = (await csv('dist/pokemon-national-dex.csv'))
        .map((row, i) => [row["Nat"], row])
    return new Pokedex(new Map(data))
}

