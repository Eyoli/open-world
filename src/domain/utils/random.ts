import * as d3 from "d3-random";
import {randomNormal} from "d3-random";
import {Biome} from "../model/biome";
import {PokemonConfig} from "../model/config";

const seed = Math.random()
const source = d3.randomLcg(seed)

export const randomUniform = d3.randomUniform.source(source)
export const randomInt = d3.randomInt.source(source)

export const randomDirection = () => {
    const rand = randomUniform(-Math.PI, Math.PI);
    return () => rand()
}

export const randomPokemon = () => {
    const randomizer = randomUniform()
    return (biome: Biome) => {
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
}

export const randomLevel = () => (biome: Biome) => {
    const generator = randomNormal(25, 20 / 3)
    return Math.min(100, Math.max(1, Math.round(generator())))
}
