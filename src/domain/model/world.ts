import {Direction, Position} from "./types";
import {WorldConfig} from "./config";
import {ChunksHolder} from "./chunk";
import {Pokedex} from "./pokedex";
import {Pokemon} from "./pokemon";
import {randomInt} from "../utils/random";
import {quadtree, Quadtree, QuadtreeLeaf} from "d3-quadtree";

export class World {
    private readonly chunksHolder: ChunksHolder;
    readonly tileSize: number;
    private readonly pokemons: Pokemon[] = [];
    pokemonTree: Quadtree<{ x: number, y: number, data: Pokemon }> = quadtree()
    center: Position = {x: 0, y: 0};

    constructor(
        private readonly loadingDistance: number,
        readonly config: WorldConfig,
        private readonly pokedex: Pokedex
    ) {
        this.chunksHolder = new ChunksHolder(config);
        this.tileSize = config.base.chunkSize / config.base.chunkDensity;
    }

    getNearbyPokemons(pokemon: Pokemon, radius: number) {
        const results: { candidate: Pokemon, distance: number }[] = [];
        const xmin = pokemon.position.x - radius;
        const ymin = pokemon.position.y - radius;
        const xmax = pokemon.position.x + radius;
        const ymax = pokemon.position.y + radius;
        this.pokemonTree.visit((node, x0, y0, x1, y1) => {
            if (!node.length) {
                let leaf = node as unknown as QuadtreeLeaf<{ x: number, y: number, data: Pokemon }>
                do {
                    let data = leaf.data;
                    if (data.x >= xmin && data.x < xmax && data.y >= ymin && data.y < ymax) {
                        results.push({candidate: data.data, distance: pokemon.distanceTo(data.data)});
                    }
                    leaf = leaf.next
                } while (leaf);
            }
            return x0 >= xmax || y0 >= ymax || x1 < xmin || y1 < ymin;
        })
        return results
            .filter(({candidate, distance}) => candidate !== pokemon && distance <= radius)
            .sort((a, b) => a.distance - b.distance);
    }

    addPokemon() {
        const {config: {base: {pokemons: {maxNumber, maxDistanceToCenter}}}} = this;

        const added: Pokemon[] = [];
        if (this.pokemons.length < maxNumber) {
            const randomPosition = randomInt(-maxDistanceToCenter, maxDistanceToCenter);
            const position = {x: this.center.x + randomPosition(), y: this.center.y + randomPosition()};
            const pokemon = this.generatePokemonAt(position)
            if (pokemon) {
                added.push(pokemon);
            }
        }
        this.pokemons.push(...added);
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
            return pokemon.isKO() || (distance > this.config.base.pokemons.maxDistanceToCenter)
        })

        pokemonsToRemove.forEach((pokemon) => {
            this.pokemons.splice(this.pokemons.indexOf(pokemon), 1);
        })

        return pokemonsToRemove;
    }

    getVisibleChunks() {
        return this.chunksHolder.getVisibleChunks(this.center, this.loadingDistance);
    }

    getBiomeAt(position: Position) {
        const chunk = this.chunksHolder.getChunk(position);
        return chunk.getBiome(position);
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
