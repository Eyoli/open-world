import {BiomeConfig} from "./config";

export class Biome {
    constructor(
        readonly polygon: [number, number][],
        readonly config: BiomeConfig
    ) {
    }
}
