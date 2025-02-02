import {Container, ContainerChild, Graphics, Sprite, Text, TextStyle} from "pixi.js";
import {List} from "@pixi/ui"
import {Pokemon} from "../../domain/model/pokemon";
import {getPokemonTextures} from "./pokemon";
import {Direction} from "../../domain/model/types";

export class UserInterface extends Container {
    private readonly biomePanel: Panel
    private readonly pokemonPanel: PokemonPanel
    private readonly biomeName: Text

    constructor() {
        super({interactive: true});
        this.biomePanel = new Panel({type: "vertical", width: 200, padding: 10, color: "white", alpha: 0.7});
        this.biomePanel.position.set(10, 10);
        this.biomeName = this.biomePanel.addText("");
        this.addChild(this.biomePanel);
        this.biomePanel.visible = false;

        this.pokemonPanel = new PokemonPanel();
        this.pokemonPanel.position.set(10, 10);
        this.addChild(this.pokemonPanel);
        this.pokemonPanel.visible = false;
    }

    updateCurrentBiome(biome: string) {
        this.biomeName.text = biome;
        this.biomePanel.visible = true;
        this.pokemonPanel.visible = false;
    }

    updateCurrentPokemon(pokemon: Pokemon) {
        this.pokemonPanel.update(pokemon);
        this.biomePanel.visible = false;
        this.pokemonPanel.visible = true;
    }
}

class Panel extends Container {
    private readonly background: Graphics;
    private readonly style: TextStyle;
    private readonly list: List;

    constructor(private readonly options: {
        type: "vertical" | "horizontal",
        width?: number,
        padding?: number,
        color: string,
        alpha: number
    }) {
        super();
        this.list = new List({type: options.type, padding: options.padding, elementsMargin: 5});
        this.list.x = (options.type === "vertical") ? this.options.width / 2 : 0;
        this.style = new TextStyle({fill: "black", align: "center", wordWrap: true, wordWrapWidth: options.width});
        this.background = new Graphics();
        this.addChild(this.background);
        this.addChild(this.list);
    }

    addText(text?: string) {
        const textView = new Text({text: text, style: this.style});
        textView.anchor.x = 0.5;
        this.addElement(textView);
        return textView;
    }

    addElement(element: ContainerChild) {
        this.list.addChild(element);
        const width = (this.options.type === "horizontal" ? this.list.children
            .map(c => c.width)
            .reduce((a, b) => a + b, 0) + this.list.children.length * this.list.elementsMargin
            : this.options.width) + 2 * this.list.horPadding;
        this.background.clear()
            .roundRect(0, 0, width, this.list.height + 2 * this.list.vertPadding, 10)
            .fill({color: this.options.color, alpha: this.options.alpha});
    }
}

class PokemonPanel extends Container {
    private readonly layout = new Panel({type: "horizontal", padding: 10, color: "white", alpha: 0.7});
    private readonly leftPanel = new Panel({type: "vertical", width: 150, color: "white", alpha: 0});
    private readonly rightPanel = new Panel({type: "vertical", width: 220, color: "white", alpha: 0});
    private readonly image: Sprite
    private readonly pName: Text
    private readonly level: Text
    private readonly hp: Text
    private readonly atk: Text
    private readonly def: Text
    private readonly spa: Text
    private readonly spd: Text
    private readonly spe: Text

    constructor() {
        super();
        this.hp = this.rightPanel.addText();
        this.atk = this.rightPanel.addText();
        this.def = this.rightPanel.addText();
        this.spa = this.rightPanel.addText();
        this.spd = this.rightPanel.addText();
        this.spe = this.rightPanel.addText();

        this.image = new Sprite({scale: 2, width: 64});

        this.pName = this.leftPanel.addText();
        this.level = this.leftPanel.addText();
        this.leftPanel.addElement(this.image);
        this.layout.addElement(this.leftPanel);
        this.layout.addElement(this.rightPanel);
        this.addChild(this.layout);
    }

    update(pokemon: Pokemon) {
        const [, textures] = getPokemonTextures(pokemon)[Direction.UP];
        this.image.texture = textures[0];
        this.pName.text = pokemon.name
        this.level.text = `Level: ${pokemon.level}`
        this.hp.text = `HP: ${pokemon.hp} / ${pokemon.stats["hp"]}`
        this.atk.text = `ATK: ${pokemon.stats["atk"]}`
        this.def.text = `DEF: ${pokemon.stats["def"]}`
        this.spa.text = `SPA: ${pokemon.stats["spa"]}`
        this.spd.text = `SPD: ${pokemon.stats["spd"]}`
        this.spe.text = `SPE: ${pokemon.stats["spe"]}`
    }
}
