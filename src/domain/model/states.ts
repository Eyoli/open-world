import {calculate, Move, Pokemon as SmogonPokemon} from "@smogon/calc";
import {Pokemon, PokemonState} from "./pokemon";
import {randomInt} from "../utils/random";

const randomPercentage = randomInt(0, 100)
const randomDirection = randomInt(0, 3)

export class IdleState implements PokemonState {
    private readonly pokemon: Pokemon;

    constructor(pokemon: Pokemon) {
        this.pokemon = pokemon;
    }

    next(): PokemonState {
        const rand = randomPercentage()
        if (rand < 10) {
            return new MovingState(this.pokemon);
        }
        return this;
    }

    act(): void {
    }
}

export class MovingState implements PokemonState {

    private readonly pokemon: Pokemon;
    private readonly direction: number;

    constructor(pokemon: Pokemon) {
        this.pokemon = pokemon;
        this.direction = randomDirection();
    }

    next(): PokemonState {
        const rand = randomPercentage()
        if (rand < 2) {
            return new IdleState(this.pokemon);
        }
        return this;
    }

    act(): void {
        this.pokemon.face(this.direction)
        this.pokemon.move()
    }
}

export class AttackingState implements PokemonState {
    private readonly pokemon: Pokemon;
    private readonly target: Pokemon;

    constructor(pokemon: Pokemon, target: Pokemon) {
        this.pokemon = pokemon;
        this.target = target;
    }

    next(): PokemonState {
        return new IdleState(this.pokemon);
    }

    act(): void {
        const gen = 9;
        const result = calculate(
            gen,
            new SmogonPokemon(gen, 'Gengar', {
                item: 'Choice Specs',
                nature: 'Timid',
                evs: {spa: 252},
                boosts: {spa: 1},
            }),
            new SmogonPokemon(gen, 'Chansey', {
                item: 'Eviolite',
                nature: 'Calm',
                evs: {hp: 252, spd: 252},
            }),
            new Move(gen, 'Focus Blast')
        );
        this.pokemon.update(result)
        this.target.update(result)
    }
}