import {csv} from 'd3-fetch'
import {randomLevel, randomPokemon} from "../utils/random";
import {Pokemon as SmogonPokemon} from "@smogon/calc";
import {Biome} from "./biome";
import {Dex} from '@pkmn/dex';
import {Generations} from '@pkmn/data';
import {Direction, Position} from "./types";
import {Pokemon} from "./pokemon";

const POKEMON_GEN = new Generations(Dex).get(8)
const SPECIES = new Map(Array.from(POKEMON_GEN.species).map(specie => [specie.num, specie.baseSpecies]))

const pokemonGenerator = randomPokemon()
const levelGenerator = randomLevel()

export type PokemonData = {
    id: number,
    battleData: SmogonPokemon,
}

export class Pokedex {
    constructor(
        private readonly data: Map<string, any>
    ) {
        this.data = data
    }

    async generateRandomPokemon(position: Position, biome: Biome): Promise<Pokemon> {
        const id = pokemonGenerator(biome)
        const level = levelGenerator(biome)
        if (!id) throw new Error(`No pokemon can be generated in biome ${biome.name}`)

        const pokemonName = SPECIES.get(id)
        if (!pokemonName) throw new Error(`Species ${id} not found in current pokedex`)

        const moves = await loadAvailableMoves(pokemonName, level)

        const smogonPokemon = new SmogonPokemon(POKEMON_GEN.dex.gen, pokemonName, {
            level,
            moves: moves.map(({move}) => move)
        });

        const pokemonData = {
            id,
            battleData: smogonPokemon
        } as PokemonData

        return new Pokemon(pokemonData, position, Direction.UP);
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

