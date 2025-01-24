import {Pokemon} from "./pokemon";
import {quadtree, Quadtree, QuadtreeLeaf} from "d3-quadtree";
import {Position} from "./types";
import RBush from "rbush";

export interface GeographicContainer<T> {
    getNearby: (object: T, radius: number) => T[];
    update: () => void;
}

export class PokemonContainer {
    private readonly _pokemons: Pokemon[] = []

    constructor(
        private readonly max: number,
        private readonly maxDistanceToCenter: number,
    ) {
    }

    isNotFull(): boolean {
        return this._pokemons.length < this.max;
    }

    iterate(): IterableIterator<Pokemon> {
        return this._pokemons[Symbol.iterator]();
    }

    get pokemons(): Pokemon[] {
        return this._pokemons;
    }

    add(...pokemons: Pokemon[]): void {
        this.pokemons.push(...pokemons);
    }

    removeInvalidPokemons(center: Position): Pokemon[] {
        const pokemonsToRemove = this.pokemons.filter((pokemon) => {
            const dx = pokemon.position.x - center.x;
            const dy = pokemon.position.y - center.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return pokemon.isKO() || (distance > this.maxDistanceToCenter)
        })

        this.remove(...pokemonsToRemove);

        return pokemonsToRemove;
    }

    protected remove(...pokemons: Pokemon[]): void {
        pokemons.forEach((pokemon) => {
            this._pokemons.splice(this._pokemons.indexOf(pokemon), 1);
        });
    }
}

export class QuadTreeGeographicContainer implements GeographicContainer<Pokemon> {
    private pokemonTree: Quadtree<{ x: number, y: number, data: Pokemon }> = quadtree()

    constructor(
        private readonly container: PokemonContainer
    ) {
    }

    getNearby(pokemon: Pokemon, radius: number): Pokemon[] {
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
            .sort((a, b) => a.distance - b.distance)
            .map(({candidate}) => candidate);
    };

    update(): void {
        this.pokemonTree = quadtree(this.container.pokemons.map(p => {
            return {
                x: p.position.x,
                y: p.position.y,
                data: p
            }
        }), d => d.x, d => d.y);
    };
}

export class RTreePokemonContainer implements GeographicContainer<Pokemon> {
    private tree = new RBush();

    getNearby(pokemon: Pokemon, radius: number): Pokemon[] {
        return [];
    }

    update(): void {
        this.tree.clear();

    }
}
