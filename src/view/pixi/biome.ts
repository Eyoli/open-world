import {Graphics, PointData, Texture} from "pixi.js";

import {Biome} from "../../domain/model/biome";

export class BiomeView extends Graphics {
    constructor(biome: Biome) {
        super();

        const drawablePolygon = biome.polygon.map(([y, x]) => ({x, y} as PointData));
        this.poly(drawablePolygon);
        if (biome.config.texture) {
            this.fill({texture: Texture.from(biome.config.texture), color: biome.config.color});
        } else {
            this.fill({color: biome.config.color});
        }
    }
}
