import {DisplacementFilter, Graphics, PointData, Sprite, Texture} from "pixi.js";

import {Biome} from "../../domain/model/biome";

export class BiomeView extends Graphics {
    constructor(biome: Biome) {
        super();

        const drawablePolygon = biome.polygon.map(([y, x]) => ({x, y} as PointData));
        this.poly(drawablePolygon);
        if (biome.texture) {
            this.fill({texture: Texture.from(biome.texture), color: biome.color});
        } else {
            this.fill({color: biome.color});
        }
    }
}
