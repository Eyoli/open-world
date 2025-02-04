import {calculate, Move, Result} from "@smogon/calc";
import {IdleState, PokemonState} from "./states";
import {Direction, Position} from "./types";
import {PokemonData} from "./pokedex";
import {World} from "./world";


const DIRECTION_VECTOR = [
    {x: Math.cos(0), y: Math.sin(0)},
    {x: Math.cos(Math.PI / 2), y: Math.sin(Math.PI / 2)},
    {x: Math.cos(Math.PI), y: Math.sin(Math.PI)},
    {x: Math.cos(3 * Math.PI / 2), y: Math.sin(3 * Math.PI / 2)},
]

export class Pokemon {
    private state: PokemonState = new IdleState();
    private _target?: Pokemon;
    private _directionVector: { x: number, y: number }

    readonly visibility = 500;
    readonly speed = 3;

    constructor(
        private readonly data: PokemonData,
        private _position: Position,
        private _direction: Direction
    ) {
        this._directionVector = DIRECTION_VECTOR[_direction];
    }

    distanceTo(pokemon: Pokemon) {
        const dx = this._position.x - pokemon.position.x;
        const dy = this._position.y - pokemon.position.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    act(world: World) {
        this.state = this.state.actIfNotKO(this, world);
    }

    face(rad: number) {
        this._direction = Math.round((rad >= 0 ? rad : (Math.PI * 2 + rad)) / (Math.PI / 2)) % 4;
        this._directionVector = {x: Math.cos(rad), y: Math.sin(rad)};
    }

    moveForward(world: World) {
        const nextPosition = {
            x: this._position.x + this.directionVector.x * this.speed,
            y: this._position.y + this.directionVector.y * this.speed
        }
        const canMove = this.canMoveTo(nextPosition, world);
        if (canMove) {
            this._position = nextPosition;
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
        const dx = target._position.x - this._position.x;
        const dy = target._position.y - this._position.y;
        const rad = Math.atan2(dy, dx);
        this.face(rad);
    }

    isKO() {
        return this.data.battleData.curHP() <= 0;
    }

    updateTarget(world: World) {
        if (this.target && this.target.isKO()) {
            this._target = undefined;
        } else if (!this.target) {
            const nearbyPokemons = world.getNearbyPokemons(this, this.visibility);
            this._target = nearbyPokemons.find(candidate => candidate.isEnemyOf(this))
        }

        return this._target;
    }

    isEnemyOf(pokemon: Pokemon) {
        return !this.data.battleData.types.some(type => pokemon.data.battleData.types.includes(type));
    }

    get target() {
        return this._target;
    }

    get direction() {
        return this._direction;
    }

    get position() {
        return this._position;
    }

    get directionVector() {
        return this._directionVector;
    }

    get name() {
        return this.data.battleData.name;
    }

    get id() {
        return this.data.id;
    }

    get hp() {
        return this.data.battleData.curHP();
    }

    get maxHp() {
        return this.data.battleData.maxHP();
    }

    get level() {
        return this.data.battleData.level;
    }

    get stats(): { [stat: string]: number } {
        return this.data.battleData.rawStats
    }

    attack() {
        const gen = this.data.battleData.gen
        const result = calculate(
            gen,
            this.data.battleData,
            this.target.data.battleData,
            new Move(gen, 'Aurora Beam')
        );
        this.attacked(result)
        this.target.defended(result)
    }
}
