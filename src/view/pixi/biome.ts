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

class DisplacementSprite extends Sprite {
    private readonly sprite: Sprite;
    private readonly filter: DisplacementFilter

    constructor(underlyingSprite: Sprite, scale: { x: number, y: number } = {x: 50, y: 100}) {
        super();
        this.sprite = new Sprite({
            texture: Texture.from("displacement"),
            width: underlyingSprite.width,
            height: underlyingSprite.height
        });
        this.filter = new DisplacementFilter({sprite: this.sprite, scale});
        underlyingSprite.filters = [this.filter];
    }

    update() {
        if (this.sprite) {
            this.sprite.x++;
            if (this.sprite.x > this.sprite.width) {
                this.sprite.x = 0;
            }
        }
    }
}
