import {Direction, Position} from "./types";
import {WorldConfig} from "./config";
import {ChunksHolder} from "./chunk";
import {Pokedex} from "./pokedex";
import {Pokemon} from "./pokemon";
import {randomInt} from "../utils/random";
import {GeographicContainer, PokemonContainer} from "./pokemon-container";


export class World {
    private readonly chunksHolder: ChunksHolder;
    private readonly positionGenerator: () => number;
    private readonly loadingDistance: number;
    private _center: Position = {x: 0, y: 0};
    readonly tileSize: number;

    constructor(
        config: WorldConfig,
        private readonly pokemonContainer: PokemonContainer,
        private readonly geographicContainer: GeographicContainer<Pokemon>,
        private readonly pokedex: Pokedex
    ) {
        this.chunksHolder = new ChunksHolder(config);
        this.tileSize = config.base.chunkSize / config.base.chunkDensity;
        this.positionGenerator = randomInt(-config.base.pokemons.maxDistanceToCenter, config.base.pokemons.maxDistanceToCenter);
        this.loadingDistance = config.base.loadingDistance;
    }

    getNearbyPokemons(pokemon: Pokemon, radius: number): Pokemon[] {
        return this.geographicContainer.getNearby(pokemon, radius);
    }

    addPokemon() {
        const {positionGenerator} = this;

        const added: Pokemon[] = [];
        if (this.pokemonContainer.isNotFull()) {
            const position = {x: this.center.x + positionGenerator(), y: this.center.y + positionGenerator()};
            const pokemon = this.generatePokemonAt(position)
            if (pokemon) {
                added.push(pokemon);
            }
        }
        this.pokemonContainer.add(...added);
        return added;
    }

    update() {
        for (const pokemon of this.pokemonContainer.iterate()) {
            pokemon.act(this);
        }
    }

    updateTree = () => {
        this.geographicContainer.update();
    }

    removePokemons = () => {
        return this.pokemonContainer.removeInvalidPokemons(this.center);
    }

    getVisibleChunks() {
        return this.chunksHolder.getVisibleChunks(this.center, this.loadingDistance);
    }

    getBiomeAt(position: Position) {
        const chunk = this.chunksHolder.getChunk(position);
        return chunk.getBiome(position);
    }

    get center() {
        return this._center;
    }

    set center(center) {
        this._center = center;
    }

    private generatePokemonAt(position: Position) {
        const {pokedex} = this

        const biome = this.getBiomeAt(position);
        if (!biome) return null;

        const pokemonData = pokedex.generateRandomPokemon(biome);
        if (!pokemonData) return null;

        return new Pokemon(pokemonData, position, Direction.UP);
    }
}
