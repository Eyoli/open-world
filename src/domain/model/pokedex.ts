import {csv} from 'd3-fetch'
import {PokemonConfig} from "./config";
import {randomUniform} from "../utils/random";
import {Pokemon as SmogonPokemon} from "@smogon/calc";
import {Biome} from "./biome";
import {Dex} from '@pkmn/dex';
import {Generations} from '@pkmn/data';
import {randomNormal} from "d3-random";
import {Direction, Position} from "./types";
import {Pokemon} from "./pokemon";

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

const randomLevel = (biome: Biome) => {
    const generator = randomNormal(25, 20 / 3)
    return Math.min(100, Math.max(1, Math.round(generator())))
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

    generateRandomPokemon(position: Position, biome: Biome, callback: (pokemon: Pokemon) => void): Pokemon {
        const id = randomPokemon(biome)
        const level = randomLevel(biome)
        if (!id) return null

        const pokedexEntry = this.getEntry(id)
        loadAvailableMoves(pokedexEntry["Pokemon"], level)
            .then((moves) => {
                console.log(pokedexEntry["Pokemon"], moves)

                const smogonPokemon = new SmogonPokemon(POKEMON_GEN.dex.gen, pokedexEntry["Pokemon"], {
                    level,
                    moves: moves.map(({move}) => move)
                });
                const pokemonData = {
                    id,
                    generalData: pokedexEntry,
                    battleData: smogonPokemon
                } as PokemonData
                callback(new Pokemon(pokemonData, position, Direction.UP));
            })
            .catch((e) => {
                console.error(`Error generating pokemon ${pokedexEntry["Pokemon"]} (${id})`, e)
            })
    }
}

const loadAvailableMoves = async (id: string, maxLevel: number) => {
    const learnset = await POKEMON_GEN.learnsets.get(id)
    return Object.entries(learnset.learnset)
        .map(([move, conditions]) => {
            const level = conditions
                .find((condition) => condition.split(`${POKEMON_GEN.dex.gen}L`).length > 1)
            return {move, level: level && parseInt(level.split(`${POKEMON_GEN.dex.gen}L`)[1])}
        })
        .filter(({level}) => level && level <= maxLevel)
}

export const loadNationalPokedex = async () => {
    const data: [p: string, value: any][] = (await csv('dist/pokemon-national-dex.csv'))
        .map((row, i) => [row["Nat"], row])
    return new Pokedex(new Map(data))
}

