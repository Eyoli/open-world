import {Result} from "@smogon/calc";
import {IdleState} from "./states";
import {Position} from "./types";
import {PokemonData} from "./pokedex";

export interface PokemonState {
    next(): PokemonState

    act(): void
}

const DIRECTION_VECTOR = [
    {x: Math.cos(Math.PI), y: Math.sin(Math.PI)},
    {x: Math.cos(3 * Math.PI / 2), y: Math.sin(3 * Math.PI / 2)},
    {x: Math.cos(0), y: Math.sin(0)},
    {x: Math.cos(Math.PI / 2), y: Math.sin(Math.PI / 2)},
]

export class Pokemon {
    private state: PokemonState = new IdleState(this);

    constructor(
        public position: Position,
        public direction = 0,
        public speed = 1,
        readonly data: PokemonData
    ) {
    }

    act() {
        this.state.act();
        this.state = this.state.next();
    }

    face(direction: number) {
        this.direction = direction
    }

    move() {
        this.position.x += DIRECTION_VECTOR[this.direction].x * this.speed;
        this.position.y += DIRECTION_VECTOR[this.direction].y * this.speed;
    }

    update(_result: Result) {

    }
}