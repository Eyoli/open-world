import {Pokemon} from "./pokemon";
import {randomDirection, randomInt} from "../utils/random";
import {World} from "./world";

const percentageGenerator = randomInt(0, 100)
const directionGenerator = randomDirection()

export abstract class PokemonState {
    protected abstract act(pokemon: Pokemon, world: World): PokemonState

    actIfNotKO(pokemon: Pokemon, world: World): PokemonState {
        if (pokemon.isKO()) {
            return this
        }
        return this.act(pokemon, world)
    }
}

export class IdleState extends PokemonState {
    act(pokemon: Pokemon, world: World): PokemonState {
        const target = pokemon.updateTarget(world)
        if (target) return new AttackingState();

        const rand = percentageGenerator()
        if (rand < 10) return new MovingState();

        return this;
    }
}

export class MovingState extends PokemonState {
    private readonly direction = directionGenerator();

    act(pokemon: Pokemon, world: World): PokemonState {
        const target = pokemon.updateTarget(world)
        if (target) return new AttackingState();

        pokemon.face(this.direction)
        const rand = percentageGenerator()
        if (!pokemon.moveForward(world) || rand < 2) {
            return new IdleState();
        }
        return this;
    }
}

export class AttackingState extends PokemonState {
    private lastAttack = 31;

    act(pokemon: Pokemon, world: World): PokemonState {
        const target = pokemon.updateTarget(world)
        if (!target) return new IdleState();

        if (pokemon.distanceTo(target) > 50) {
            pokemon.facePokemon(target)
            pokemon.moveForward(world)
            return this
        } else if (this.lastAttack > 30) {
            this.lastAttack = 0
            pokemon.attack()
            return this
        }
        this.lastAttack++;
        return this;
    }
}
