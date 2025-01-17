import {DisplacementFilter, Sprite, Texture} from "pixi.js"

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
