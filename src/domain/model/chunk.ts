import {BiomeConfig, WorldConfig} from "./biomes";
import {Item} from "./item";
import {PerlinNoise, PerlinNoiseGenerator} from "../utils/perlin";
import {randomInt} from "../utils/random";
import {Normal} from "distributions";

export class Chunk {
    constructor(
        readonly n: number,
        readonly m: number,
        readonly size: number,
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

    getTileAt = (x: number, y: number) => this.tiles[x][y];
}

export class ChunkGenerator {
    private readonly generators: PerlinNoiseGenerator[];
    private readonly randomizer = randomInt(1, 100);
    private readonly normalDistribution = Normal(0, 0.22);

    constructor(
        private readonly chunkSize: number,
        chunkNodes: number,
        private readonly config: WorldConfig
    ) {
        const depth = this.getBiomesDepth();

        this.generators = Array.from({length: depth}).map(() => new PerlinNoiseGenerator(chunkNodes, 2));
    }

    private getBiomesDepth() {
        const nodes = [{value: this.config.biomes, depth: 0}] || [];
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

    private extractTiles(result: PerlinNoise[]) {
        const {config, normalDistribution} = this;
        return result[0].noises
            .map((line, x) => line
                .map((_, y) => {
                    let biome = config.biomes;
                    let depth = 0;
                    while (biome.sub) {
                        const noise = result[depth].noises[x][y]
                        biome = biome.sub?.find(b => noise < normalDistribution.inv(b.threshold));
                        depth++;
                    }
                    return biome
                }))
    }

    private generateItems(tiles: BiomeConfig[][], n: number, m: number) {
        const {chunkSize, randomizer} = this;
        return tiles
            .flatMap((line, x) => line
                .map((biome, y) => ({
                    x, y, item: biome.items?.find(item => randomizer() < item.p)
                }))
                .filter(({item}) => item)
                .map(({x, y, item}) => new Item([n * chunkSize + x, m * chunkSize + y], item.type, item.scale || 1)));
    }

    generate(n: number, m: number): Chunk {
        const {generators, chunkSize} = this;
        const noises = generators
            .map(generator => generator.generateNoiseField(n, m, chunkSize));

        const tiles = this.extractTiles(noises);
        const items = this.generateItems(tiles, n, m);

        return new Chunk(n, m, chunkSize, tiles, items);
    }
}