import {BiomeConfig, FactorConfig, TerrainConfig, WorldConfig} from "./config";
import {Item} from "./item";
import {FBMGenerator} from "../utils/perlin";
import {randomUniform} from "../utils/random";
import {Normal} from "distributions";
import {Polygon, Position} from "./types";
import {Map2D} from "../utils/collections";
import {isoBands} from "marchingsquares";
import {combineMasks, createMask} from "../utils/masks";
import {polygonArea, polygonContains} from "d3-polygon";
import {Biome} from "./biome";

export class Chunk {
    constructor(
        readonly n: number,
        readonly m: number,
        readonly size: number,
        readonly biomes: Biome[],
        readonly items: Item[],
    ) {
    }

    id() {
        return `${this.n},${this.m}`;
    }

    getBiome = ({x, y}: Position): Biome => {
        return this.biomes.find(biome => polygonContains(biome.polygon, [y, x]));
    };
}

export class ChunksHolder {
    private readonly chunks = new Map2D<Chunk>();
    private readonly generators: Map<string, FBMGenerator> = new Map();
    private readonly randomizer = randomUniform();
    private readonly normalDistribution = Normal(0, 0.22);

    private readonly biomes: { [p: string]: BiomeConfig } = {};
    private readonly factors: { [p: string]: FactorConfig }
    private readonly terrain: TerrainConfig
    private readonly chunkSize: number
    private readonly tilesNumber: number

    constructor(config: WorldConfig) {
        for (const [key, biome] of Object.entries(config.biomes)) {
            this.biomes[key] = {...config.biomes[biome.preset], ...biome};
        }
        this.factors = config.factors;
        this.terrain = config.terrain;
        this.chunkSize = config.base.chunkSize
        this.tilesNumber = config.base.chunkDensity

        for (let factor in this.factors) {
            const {density, octaves} = this.factors[factor];
            this.generators.set(factor, new FBMGenerator(density, octaves || 2));
        }
    }

    private getNoises(n: number, m: number): { [key: string]: number[][] } {
        const {tilesNumber} = this;
        const noises: { [key: string]: number[][] } = {}
        for (let [key, g] of this.generators) {
            noises[key] = g.getNoiseField(n * tilesNumber, m * tilesNumber, (tilesNumber + 1), (tilesNumber + 1)).noises
        }
        return noises;
    }

    private extractTiles(noises: { [key: string]: number[][] }): BiomeConfig[][] {
        const {tilesNumber, normalDistribution} = this;

        const tiles: BiomeConfig[][] = [];
        for (let x = 0; x < tilesNumber; x++) {
            const line = [];
            for (let y = 0; y < tilesNumber; y++) {
                let terrain = this.terrain;
                while (terrain.sub) {
                    const noise = noises[terrain.factor][x][y];
                    const index = terrain.sub.findIndex(sub => noise < normalDistribution.inv(sub.threshold));
                    terrain = terrain.sub[index];
                }
                line.push(this.biomes[terrain.type]);
            }
            tiles.push(line);
        }
        return tiles;
    }

    private extractBiomes(n: number, m: number, noises: { [key: string]: number[][] }): Biome[] {
        const {biomes, terrain, chunkSize, tilesNumber, normalDistribution} = this;
        const offset = [n * chunkSize, m * chunkSize];
        const tileSize = chunkSize / tilesNumber;

        const newBiomes: Biome[] = [];
        const candidates: {
            node: TerrainConfig,
            factorNoises: number[][],
            mask: boolean[][]
        }[] = [{
            node: terrain,
            factorNoises: null,
            mask: null
        }];
        while (candidates.length > 0) {
            const {node, mask} = candidates.pop();
            if (node.sub) {
                let lowerBound = -1;
                for (let i = 0; i < node.sub.length; i++) {
                    const sub = node.sub[i];
                    const upperBound = normalDistribution.inv(sub.threshold);
                    const subMask = createMask(noises[node.factor], [lowerBound, upperBound]);
                    candidates.push({
                        node: sub,
                        factorNoises: noises[node.factor],
                        mask: mask ? combineMasks(mask, subMask) : subMask
                    });
                    lowerBound = upperBound;
                }
            } else {
                const polygons = isoBands(mask, [1E-32], [100])[0];
                if (polygons.length > 0) {
                    newBiomes.push(...polygons.map((polygon: Polygon) => {
                        const translatedPolygon: Polygon = polygon.map(([y, x]) => [offset[1] + y * tileSize, offset[0] + x * tileSize]);
                        return new Biome(translatedPolygon, biomes[node.type]);
                    }));
                }
            }
        }

        return newBiomes.sort((a, b) => polygonArea(a.polygon) - polygonArea(b.polygon));
    }

    private generateItems(tiles: BiomeConfig[][], n: number, m: number) {
        const {tilesNumber, randomizer} = this;
        return tiles
            .flatMap((line, x) => line
                .map((biome, y) => {
                    if (biome.items.length < 1 || randomizer() > biome.pItem) return null;

                    const totalWeight = biome.items.reduce((acc, pConf) => acc + pConf.w, 0);
                    const random = randomizer() * totalWeight;
                    let total = 0;
                    return {
                        x, y,
                        item: biome.items.find(pConf => {
                            total += pConf.w;
                            return random <= total;
                        })
                    };
                })
                .filter((item) => item)
                .map(({
                          x,
                          y,
                          item
                      }) => new Item([n * tilesNumber + x, m * tilesNumber + y], item.type, item.scale || 1)));
    }

    private getChunkPosition(position: Position) {
        return {
            n: Math.floor(position.x / this.chunkSize),
            m: Math.floor(position.y / this.chunkSize)
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
        const {tilesNumber} = this;

        const noises = this.getNoises(n, m);
        const tiles = this.extractTiles(noises);
        const biomes = this.extractBiomes(n, m, noises);
        const items = this.generateItems(tiles, n, m);

        return new Chunk(n, m, tilesNumber, biomes, items);
    }
}
