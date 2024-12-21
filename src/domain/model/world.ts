import {Position} from "./types";
import {WorldConfig} from "./biomes";
import {Chunk, ChunkGenerator} from "./chunk";
import {Pokedex} from "./pokedex";
import {Pokemon} from "./pokemon";
import {randomInt} from "../utils/random";

export class World {
    private readonly chunkGenerator: ChunkGenerator
    private readonly chunks: Map<string, Chunk> = new Map();
    private readonly pokemons: Pokemon[] = [];
    center: Position = {x: 0, y: 0};

    constructor(
        private readonly chunkSize: number,
        readonly tileSize: number,
        private readonly loadingDistance: number,
        config: WorldConfig,
        private readonly pokedex: Pokedex
    ) {
        this.chunkGenerator = new ChunkGenerator(chunkSize, 1, config);
    }

    addPokemon() {
        const added: Pokemon[] = [];
        if (this.pokemons.length < 100) {
            const randomPosition = randomInt(-2000, 2000);
            const position = {x: this.center.x + randomPosition(), y: this.center.y + randomPosition()};
            const pokemon = this.generatePokemonAt(position)
            added.push(pokemon);
            this.pokemons.push(...added);
        }
        return added;
    }

    update() {
        for (const pokemon of this.pokemons) {
            pokemon.act();
        }
    }

    removePokemons = () => {
        const pokemonsToRemove = this.pokemons.filter((pokemon) => {
            const dx = pokemon.position.x - this.center.x;
            const dy = pokemon.position.y - this.center.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return (distance > 2000)
        })

        pokemonsToRemove.forEach((pokemon) => {
            this.pokemons.splice(this.pokemons.indexOf(pokemon), 1);
        })

        return pokemonsToRemove;
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

    * getVisibleChunks() {
        const {center, loadingDistance} = this;
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
        return new Pokemon(position, 0, 1, pokemonData)
    }
}
