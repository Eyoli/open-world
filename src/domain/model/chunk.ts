import {BiomeConfig, TerrainConfig, WorldConfig} from "./config";
import {Item} from "./item";
import {FBMGenerator} from "../utils/perlin";
import {randomUniform} from "../utils/random";
import {Normal} from "distributions";
import {Polygon, Position} from "./types";
import {Map2D} from "../utils/collections";
import {isoBands} from "marchingsquares";
import {applyMask, combineMasks, createMask} from "./matrix";
import {polygonArea, polygonContains} from "d3-polygon";

export class Biome {
    constructor(
        readonly polygon: [number, number][],
        readonly config: BiomeConfig
    ) {
    }
}

export class Chunk {
    constructor(
        readonly n: number,
        readonly m: number,
        readonly size: number,
        readonly tileSize: number,
        readonly biomes: Biome[],
        readonly contours: { [p: string]: Polygon[] },
        readonly items: Item[],
    ) {
    }

    id() {
        return `${this.n},${this.m}`;
    }

    getBiome = (position: Position): Biome => {
        const {n, m, size, tileSize} = this;
        const x = position.x / tileSize - n * size
        const y = position.y / tileSize - m * size
        return this.biomes.find(biome => polygonContains(biome.polygon, [x, y]));
    };
}

export class ChunksHolder {
    private readonly chunks = new Map2D<Chunk>();
    private readonly generators: Map<string, FBMGenerator> = new Map();
    private readonly randomizer = randomUniform();
    private readonly normalDistribution = Normal(0, 0.22);

    constructor(
        private readonly config: WorldConfig
    ) {
        for (let factor in this.config.factors) {
            const density = this.config.factors[factor].density;
            this.generators.set(factor, new FBMGenerator(density, 2));
        }
    }

    private getNoises(n: number, m: number): { [key: string]: number[][] } {
        const {config: {chunkSize}} = this;
        const noises: { [key: string]: number[][] } = {}
        for (let [key, g] of this.generators) {
            noises[key] = g.getNoiseField(n * chunkSize, m * chunkSize, (chunkSize + 1), (chunkSize + 1)).noises
        }
        return noises;
    }

    private extractTiles(noises: { [key: string]: number[][] }): BiomeConfig[][] {
        const {config, normalDistribution} = this;

        const tiles: BiomeConfig[][] = [];
        for (let x = 0; x < config.chunkSize; x++) {
            const line = [];
            for (let y = 0; y < config.chunkSize; y++) {
                let terrain = config.terrain;
                while (terrain.sub) {
                    const noise = noises[terrain.factor][x][y];
                    const factor = config.factors[terrain.factor];
                    const index = factor.pThresholds.findIndex(threshold => noise < normalDistribution.inv(threshold));
                    terrain = terrain.sub[index];
                }
                line.push(config.biomes[terrain.type]);
            }
            tiles.push(line);
        }
        return tiles;
    }

    private extractBiomes(noises: { [key: string]: number[][] }): Biome[] {
        const {config, normalDistribution} = this;

        const biomes: Biome[] = [];
        const candidates: {
            node: TerrainConfig,
            factorNoises: number[][],
            mask: boolean[][]
        }[] = [{
            node: config.terrain,
            factorNoises: null,
            mask: null
        }];
        while (candidates.length > 0) {
            const {node, factorNoises, mask} = candidates.pop();
            if (node.sub) {
                let lowerBound = -1;
                for (let i = 0; i < node.sub.length; i++) {
                    const sub = node.sub[i];
                    const upperBound = normalDistribution.inv(config.factors[node.factor].pThresholds[i]);
                    const subMask = createMask(noises[node.factor], [lowerBound, upperBound]);
                    candidates.push({
                        node: sub,
                        factorNoises: noises[node.factor],
                        mask: mask ? combineMasks(mask, subMask) : subMask
                    });
                    lowerBound = upperBound;
                }
            } else {
                const polygons = isoBands(applyMask(factorNoises, mask), [-1], [2])[0];
                if (polygons.length > 0) {
                    biomes.push(...polygons.map((polygon: Polygon) => new Biome(polygon, config.biomes[node.type])));
                }
            }
        }

        return biomes.sort((a, b) => polygonArea(a.polygon) - polygonArea(b.polygon));
    }

    private generateItems(tiles: BiomeConfig[][], n: number, m: number) {
        const {config: {chunkSize}, randomizer} = this;
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

    private getContours(noises: { [key: string]: number[][] }): { [p: string]: Polygon[] } {
        const contours: { [p: string]: Polygon[] } = {};

        for (const [key, noise] of Object.entries(noises)) {
            const factor = this.config.factors[key];
            const lowerBound = factor.pThresholds.map(threshold => this.normalDistribution.inv(threshold));
            lowerBound.pop();
            lowerBound.unshift(-1);
            const bandWidth = lowerBound.reduce((acc, threshold, i) => {
                if (i > 0) {
                    acc.push(threshold - lowerBound[i - 1]);
                }
                return acc;
            }, []);
            bandWidth.push(2);
            contours[key] = isoBands(noise, lowerBound, bandWidth).flatMap((polygons: Polygon[]) => polygons);
        }

        return contours;
    }

    private getChunkAt(n: number, m: number) {
        const {chunks} = this;
        return chunks.getOrLoad(n, m, () => this.generate(n, m));
    }

    private generate(n: number, m: number) {
        const {config: {chunkSize, tileSize}} = this;

        const noises = this.getNoises(n, m);
        const contours = this.getContours(noises);
        const tiles = this.extractTiles(noises);
        const biomes = this.extractBiomes(noises);
        const items = this.generateItems(tiles, n, m);

        return new Chunk(n, m, chunkSize, tileSize, biomes, contours, items);
    }
}
