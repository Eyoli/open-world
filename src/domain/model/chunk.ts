import {BiomeConfig, WorldConfig} from "./biomes";
import {Item} from "./item";
import {FBMGenerator} from "../utils/perlin";
import {randomInt} from "../utils/random";
import {Normal} from "distributions";
import {Position} from "./types";
import {Map2D} from "../utils/collections";

export class Chunk {
    constructor(
        readonly n: number,
        readonly m: number,
        readonly size: number,
        readonly tileSize: number,
        private readonly tiles: BiomeConfig[][],
        readonly items: Item[],
    ) {
    }

    * enumerateTiles() {
        for (let x = 0; x < this.tiles.length; x++) {
            for (let y = 0; y < this.tiles[x].length; y++) {
                yield {x, y, biome: this.tiles[x][y]};
            }
        }
    }

    getTile = (position: Position) => {
        const {n, m, size, tileSize, tiles} = this;
        const x = Math.floor(position.x / tileSize - n * size)
        const y = Math.floor(position.y / tileSize - m * size)
        return tiles[x][y];
    };
}

export class ChunksHolder {
    private readonly chunks = new Map2D<Chunk>();
    private readonly generators: Map<string, FBMGenerator> = new Map();
    private readonly randomizer = randomInt(1, 100);
    private readonly normalDistribution = Normal(0, 0.22);

    constructor(
        private readonly config: WorldConfig
    ) {
        for (let factor in this.config.factors) {
            const density = this.config.factors[factor].density;
            this.generators.set(factor, new FBMGenerator(density, 2));
        }
    }

    private extractTiles(n: number, m: number): BiomeConfig[][] {
        const {config, normalDistribution} = this;
        const noises: { [key: string]: number[][] } = {}
        for (let [key, g] of this.generators) {
            noises[key] = g.getNoiseField(n * config.chunkSize, m * config.chunkSize, config.chunkSize, config.chunkSize).noises
        }

        const result: BiomeConfig[][] = [];
        for (let x = 0; x < config.chunkSize; x++) {
            const line = [];
            for (let y = 0; y < config.chunkSize; y++) {
                let terrain = config.terrain;
                while (terrain.sub) {
                    const noise = noises[terrain.factor][x][y]
                    terrain = terrain.sub?.find(b => noise < normalDistribution.inv(b.threshold));
                }
                line.push(config.biomes[terrain.type]);
            }
            result.push(line);
        }
        return result;
    }

    private generateItems(tiles: BiomeConfig[][], n: number, m: number) {
        const {config: {chunkSize}, randomizer} = this;
        return tiles
            .flatMap((line, x) => line
                .map((biome, y) => ({
                    x, y, item: biome.items?.find(item => randomizer() < item.p)
                }))
                .filter(({item}) => item)
                .map(({x, y, item}) => new Item([n * chunkSize + x, m * chunkSize + y], item.type, item.scale || 1)));
    }

    private getChunkPosition(position: Position) {
        return {
            n: Math.floor(position.x / (this.config.chunkSize * this.config.tileSize)),
            m: Math.floor(position.y / (this.config.chunkSize * this.config.tileSize))
        }
    }

    * getVisibleChunks(center: Position, loadingDistance: number) {
        const {n, m} = this.getChunkPosition(center);

        for (let i = -loadingDistance; i <= loadingDistance; i++) {
            for (let j = -loadingDistance; j <= loadingDistance; j++) {
                yield this.getChunkAt(n + i, m + j);
            }
        }
    }

    getChunk(position: Position): Chunk {
        const {n, m} = this.getChunkPosition(position);
        return this.getChunkAt(n, m);
    }

    private getChunkAt(n: number, m: number) {
        const {chunks} = this;
        return chunks.getOrLoad(n, m, () => this.generate(n, m));
    }

    private generate(n: number, m: number) {
        const {config: {chunkSize, tileSize}} = this;

        const tiles = this.extractTiles(n, m);
        const items = this.generateItems(tiles, n, m);

        return new Chunk(n, m, chunkSize, tileSize, tiles, items);
    }
}