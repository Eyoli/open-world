import {Container, ContainerChild, Text, TextStyle} from "pixi.js";

export class UserInterface extends Container<ContainerChild> {
    private style = new TextStyle({fill: "black"});
    private biome: Text

    constructor() {
        super();
        this.biome = new Text({style: this.style});
        this.addChild(this.biome);
    }

    updateCurrentBiome(biome: string) {
        this.biome.text = biome;
    }
}
