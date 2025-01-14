import {Result} from "@smogon/calc";
import {IdleState, PokemonState} from "./states";
import {Direction, Position} from "./types";
import {PokemonData} from "./pokedex";
import {World} from "./world";


const DIRECTION_VECTOR = [
    {x: Math.cos(Math.PI), y: Math.sin(Math.PI)},
    {x: Math.cos(3 * Math.PI / 2), y: Math.sin(3 * Math.PI / 2)},
    {x: Math.cos(0), y: Math.sin(0)},
    {x: Math.cos(Math.PI / 2), y: Math.sin(Math.PI / 2)},
]

export class Pokemon {
    private state: PokemonState = new IdleState();
    private _target?: Pokemon;

    readonly visibility = 500;

    constructor(
        public data: PokemonData,
        public position: Position,
        public direction: Direction,
        public speed = 3
    ) {
    }

    distanceTo(pokemon: Pokemon) {
        const dx = this.position.x - pokemon.position.x;
        const dy = this.position.y - pokemon.position.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    act(world: World) {
        this.state = this.state.actIfNotKO(this, world);
    }

    face(direction: number) {
        this.direction = direction
    }

    moveForward(world: World) {
        const nextPosition = {
            x: this.position.x + DIRECTION_VECTOR[this.direction].x * this.speed,
            y: this.position.y + DIRECTION_VECTOR[this.direction].y * this.speed
        }
        const canMove = this.canMoveTo(nextPosition, world);
        if (canMove) {
            this.position = nextPosition;
        }
        return canMove;
    }

    private canMoveTo(position: Position, world: World) {
        const biome = world.getBiomeAt(position);
        return biome.type === "Soil"
            || this.data.battleData.types.includes("Water")
            || this.data.battleData.types.includes("Flying")
    }

    attacked(result: Result) {
        let damage: number;
        const recoil = result.recoil().recoil;
        if (typeof recoil !== "number") {
            damage = recoil[0];
        } else {
            damage = recoil;
        }
        this.data.battleData.originalCurHP = Math.max(0, this.data.battleData.curHP() - damage);
    }

    defended(result: Result) {
        let damage: number;
        if (typeof result.damage !== "number") {
            if (typeof result.damage[0] !== "number") {
                damage = result.damage[0][0];
            } else {
                damage = result.damage[0];
            }
        } else {
            damage = result.damage;
        }
        this.data.battleData.originalCurHP = Math.max(0, this.data.battleData.curHP() - damage);
    }

    facePokemon(target: Pokemon) {
        const dx = target.position.x - this.position.x;
        const dy = target.position.y - this.position.y;
        if (Math.abs(dx) > Math.abs(dy)) {
            this.direction = dx > 0 ? Direction.RIGHT : Direction.LEFT
        } else {
            this.direction = dy > 0 ? Direction.DOWN : Direction.UP
        }
    }

    isKO() {
        return this.data.battleData.curHP() <= 0;
    }

    updateTarget(world: World) {
        if (this.target && this.target.isKO()) {
            this._target = undefined;
        } else if (!this.target) {
            const nearbyPokemons = world.getNearbyPokemons(this, this.visibility);
            const target = nearbyPokemons.find(({candidate}) => candidate.isEnemyOf(this));
            this._target = target?.candidate
        }

        return this._target;
    }

    isEnemyOf(pokemon: Pokemon) {
        return !this.data.battleData.types.some(type => pokemon.data.battleData.types.includes(type))
    }

    get target() {
        return this._target;
    }
}