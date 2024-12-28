import {Direction, Position} from "./types";
import {WorldConfig} from "./biomes";
import {Chunk, ChunkGenerator} from "./chunk";
import {Pokedex} from "./pokedex";
import {Pokemon} from "./pokemon";
import {randomInt} from "../utils/random";
import {quadtree, Quadtree, QuadtreeLeaf} from "d3-quadtree";

export class World {
    private readonly chunkGenerator: ChunkGenerator
    private readonly chunks: Map<string, Chunk> = new Map();
    private readonly pokemons: Pokemon[] = [];
    pokemonTree: Quadtree<{ x: number, y: number, data: Pokemon }> = quadtree()
    center: Position = {x: 0, y: 0};

    constructor(
        private readonly loadingDistance: number,
        readonly config: WorldConfig,
        private readonly pokedex: Pokedex
    ) {
        this.chunkGenerator = new ChunkGenerator(1, config);
    }

    seeAround(pokemon: Pokemon, radius: number) {
        const results: { candidate: Pokemon, distance: number }[] = [];
        this.pokemonTree.visit((node, x0, y0, x1, y1) => {
            if (!node.length) {
                let leaf = node as unknown as QuadtreeLeaf<{ x: number, y: number, data: Pokemon }>
                do {
                    let candidate = leaf.data.data;
                    const distance = pokemon.distanceTo(candidate);
                    if (pokemon != candidate && distance < radius) {
                        results.push({candidate, distance});
                    }
                    leaf = leaf.next
                } while (leaf);
            }
            return x0 <= pokemon.position.x && pokemon.position.x < x1 && y0 <= pokemon.position.y && pokemon.position.y < y1;
        })
        return results.sort((a, b) => a.distance - b.distance);
    }

    addPokemon() {
        const {config: {pokemons: {maxNumber, maxDistanceToCenter}}} = this;

        const added: Pokemon[] = [];
        if (this.pokemons.length < maxNumber) {
            const randomPosition = randomInt(-maxDistanceToCenter, maxDistanceToCenter);
            const position = {x: this.center.x + randomPosition(), y: this.center.y + randomPosition()};
            const pokemon = this.generatePokemonAt(position)
            added.push(pokemon);
            this.pokemons.push(...added);
        }
        return added;
    }

    update() {
        for (const pokemon of this.pokemons) {
            pokemon.act(this);
        }
    }

    updateTree = () => {
        this.pokemonTree = quadtree(this.pokemons.map(p => {
            return {
                x: p.position.x,
                y: p.position.y,
                data: p
            }
        }), d => d.x, d => d.y);
    }

    removePokemons = () => {
        const pokemonsToRemove = this.pokemons.filter((pokemon) => {
            const dx = pokemon.position.x - this.center.x;
            const dy = pokemon.position.y - this.center.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return pokemon.isKO() || (distance > this.config.pokemons.maxDistanceToCenter)
        })

        pokemonsToRemove.forEach((pokemon) => {
            this.pokemons.splice(this.pokemons.indexOf(pokemon), 1);
        })

        return pokemonsToRemove;
    }

    private getChunkPosition(position: Position) {
        return {
            n: Math.floor(position.x / (this.config.chunkSize * this.config.tileSize)),
            m: Math.floor(position.y / (this.config.chunkSize * this.config.tileSize))
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

    private generatePokemonAt(position: Position) {
        const {pokedex, config: {tileSize, chunkSize}} = this

        const {n, m} = this.getChunkPosition(position);
        const chunk = this.getChunkAt(n, m);
        const factor = chunkSize * tileSize
        const chunkX = Math.floor((position.x - n * factor) / tileSize)
        const chunkY = Math.floor((position.y - m * factor) / tileSize)
        const biome = chunk.getTileAt(chunkX, chunkY);
        const pokemonData = pokedex.generateRandomPokemon(biome);
        return new Pokemon(pokemonData, position, Direction.UP)
    }
}
