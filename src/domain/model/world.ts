import {Position} from "./types";
import {WorldConfig} from "./biomes";
import {Chunk, ChunkGenerator} from "./chunk";
import {Pokedex} from "./pokedex";
import {Pokemon} from "./pokemon";
import {randomInt} from "../utils/random";

export class World {
    private readonly chunkGenerator: ChunkGenerator
    private readonly chunks: Map<string, Chunk> = new Map();
    private pokemons: Pokemon[] = [];
    private center: Position = {x: 0, y: 0};

    constructor(
        private readonly chunkSize: number,
        readonly tileSize: number,
        private readonly loadingDistance: number,
        config: WorldConfig,
        private readonly pokedex: Pokedex
    ) {
        this.chunkGenerator = new ChunkGenerator(chunkSize, 1, config);
    }

    update() {
        const result = {
            added: [] as Pokemon[],
            removed: [] as Pokemon[],
        }
        if (this.pokemons.length < 100) {
            const randomPosition = randomInt(-1000, 1000);
            const position = {x: this.center.x + randomPosition(), y: this.center.y + randomPosition()};
            result.added.push(this.generatePokemonAt(position));
        }

        for (const pokemon of this.pokemons) {
            pokemon.act();
        }

        this.removePokemons();

        return result;
    }

    private removePokemons = () => {
        this.pokemons = this.pokemons.filter((pokemon) => {
            const dx = pokemon.position.x - this.center.x;
            const dy = pokemon.position.y - this.center.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return (distance <= 2000)
        })
    }

    private getChunkPosition(position: Position) {
        return {
            n: Math.floor(position.x / (this.chunkSize * this.tileSize)),
            m: Math.floor(position.y / (this.chunkSize * this.tileSize))
        }
    }

    private getChunkAt(n: number, m: number) {
        const {chunks, chunkGenerator} = this;
        const key = `${n}-${m}`;
        if (!chunks.has(key)) {
            chunks.set(key, chunkGenerator.generate(n, m));
        }
        return chunks.get(key);
    }

    * getVisibleChunks(center: Position) {
        const {loadingDistance} = this;
        const {n, m} = this.getChunkPosition(center);

        for (let i = -loadingDistance; i <= loadingDistance; i++) {
            for (let j = -loadingDistance; j <= loadingDistance; j++) {
                yield this.getChunkAt(n + i, m + j);
            }
        }
    }

    generatePokemonAt(position: Position) {
        const {n, m} = this.getChunkPosition(position);
        const chunk = this.getChunkAt(n, m);
        const factor = this.chunkSize * this.tileSize
        const chunkX = Math.floor((position.x - n * factor) / this.tileSize)
        const chunkY = Math.floor((position.y - m * factor) / this.tileSize)
        const biome = chunk.getTileAt(chunkX, chunkY);
        const pokemonData = this.pokedex.generateRandomPokemon(biome);
        console.log(pokemonData)
        return new Pokemon(position, 0, 1, pokemonData)
    }
}
