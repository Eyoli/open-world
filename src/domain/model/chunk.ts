import {BiomeConfig, WorldConfig} from "./biomes";
import {Item} from "./item";
import {FBMGenerator, PerlinNoise} from "../utils/perlin";
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
    private readonly generators: FBMGenerator[];
    private readonly randomizer = randomInt(1, 100);
    private readonly normalDistribution = Normal(0, 0.22);

    constructor(
        private readonly config: WorldConfig
    ) {
        const depth = this.getBiomesDepth();

        this.generators = Array.from({length: depth}).map(() => new FBMGenerator(50, 2));
    }

    private getBiomesDepth() {
        const nodes = [{value: this.config.terrain, depth: 0}] || [];
        let maxDepth = 0;
        while (nodes.length > 0) {
            const node = nodes.pop();
            maxDepth = Math.max(maxDepth, node.depth);
            if (node.value.sub) {
                for (const sub of node.value.sub) {
                    nodes.push({value: sub, depth: node.depth + 1});
                }
            }
        }
        return maxDepth;
    }

    private extractTiles(result: PerlinNoise[]): BiomeConfig[][] {
        const {config, normalDistribution} = this;
        return result[0].noises
            .map((line, x) => line
                .map((_, y) => {
                    let terrain = config.terrain;
                    let depth = 0;
                    while (terrain.sub) {
                        const noise = result[depth].noises[x][y]
                        terrain = terrain.sub?.find(b => noise < normalDistribution.inv(b.threshold));
                        depth++;
                    }
                    return config.biomes[terrain.type];
                }))
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
        return chunks.getOrSetDefault(n, m, () => this.generate(n, m));
    }

    private generate(n: number, m: number) {
        const {generators, config: {chunkSize, tileSize}} = this;
        const noises = generators
            .map(generator => generator.getNoiseField(n * chunkSize, m * chunkSize, chunkSize, chunkSize));

        const tiles = this.extractTiles(noises);
        const items = this.generateItems(tiles, n, m);

        return new Chunk(n, m, chunkSize, tileSize, tiles, items);
    }
}