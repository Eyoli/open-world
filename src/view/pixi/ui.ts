import {Graphics, Rectangle, Text, TextStyle} from "pixi.js";
import {List} from "@pixi/ui"

export class UserInterface extends Graphics {
    private style = new TextStyle({fill: "black", align: "center", wordWrap: true, wordWrapWidth: 200});
    private readonly biomeView: Text

    constructor() {
        super();
        this.roundRect(0, 0, 200, 30, 10).fill("white");
        const list = new List({});

        this.biomeView = new Text({style: this.style, boundsArea: new Rectangle(0, 0, 160, 30)});
        this.addChild(this.biomeView);
        this.biomeView.x = 200 - this.biomeView.boundsArea.width;
    }

    updateCurrentBiome(biome: string) {
        this.biomeView.text = biome;
    }
}
