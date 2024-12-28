import {calculate, Move} from "@smogon/calc";
import {Pokemon} from "./pokemon";
import {randomInt} from "../utils/random";
import {World} from "./world";

const randomPercentage = randomInt(0, 100)
const randomDirection = randomInt(0, 3)

export abstract class PokemonState {
    protected abstract act(pokemon: Pokemon, world: World): PokemonState

    actIfNotKO(pokemon: Pokemon, world: World): PokemonState {
        if (pokemon.isKO()) {
            return this
        }
        return this.act(pokemon, world)
    }
}

export abstract class HandlingTarget extends PokemonState {
    protected constructor(protected target?: Pokemon) {
        super();
    }

    abstract act(pokemon: Pokemon, world: World): PokemonState

    findTarget(pokemon: Pokemon, world: World) {
        if (this.target && !this.target.isKO()) return

        const targets = world.seeAround(pokemon, 500)
        if (targets.length > 0) {
            this.target = targets[0].candidate
        }
    }
}

export class IdleState extends HandlingTarget {
    constructor(target?: Pokemon) {
        super(target);
    }

    act(pokemon: Pokemon, world: World): PokemonState {
        this.findTarget(pokemon, world)
        if (this.target) return new AttackingState(this.target);

        const rand = randomPercentage()
        if (rand < 10) return new MovingState();

        return this;
    }
}

export class MovingState extends HandlingTarget {
    constructor(target?: Pokemon) {
        super(target);
    }

    private readonly direction: number = randomDirection();

    act(pokemon: Pokemon, world: World): PokemonState {
        this.findTarget(pokemon, world)
        if (this.target) return new AttackingState(this.target);

        pokemon.face(this.direction)
        pokemon.move()
        const rand = randomPercentage()
        if (rand < 2) {
            return new IdleState();
        }
        return this;
    }
}

export class AttackingState extends PokemonState {
    private lastAttack = 31;

    constructor(
        private readonly target: Pokemon
    ) {
        super();
    }

    act(pokemon: Pokemon): PokemonState {
        if (pokemon.distanceTo(this.target) > 50) {
            pokemon.facePokemon(this.target)
            pokemon.move()
            return this
        } else if (this.lastAttack > 30) {
            this.lastAttack = 0
            this.attack(pokemon)
            return this
        }
        this.lastAttack++
        return new IdleState();
    }

    attack(pokemon: Pokemon) {
        const gen = pokemon.data.battleData.gen
        const result = calculate(
            gen,
            pokemon.data.battleData,
            this.target.data.battleData,
            new Move(gen, 'Aurora Beam')
        );
        pokemon.attacked(result)
        this.target.defended(result)
    }
}
