import {Container, Graphics, Text, TextStyle} from "pixi.js";
import {List} from "@pixi/ui"
import {Pokemon} from "../../domain/model/pokemon";

export class UserInterface extends Container {
    private readonly biomePanel: Panel
    private readonly pokemonPanel: PokemonPanel
    private readonly biomeName: Text

    constructor() {
        super();
        this.biomePanel = new Panel({width: 200});
        this.biomePanel.position.set(10, 10);
        this.biomeName = this.biomePanel.addText();
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

    constructor(private readonly options: { width: number }) {
        super();
        this.list = new List({type: "vertical", padding: 10});
        this.list.x = options.width / 2;
        this.style = new TextStyle({fill: "black", align: "center", wordWrap: true, wordWrapWidth: options.width});
        this.background = new Graphics();
        this.addChild(this.background);
        this.addChild(this.list);
    }

    addText(text?: string) {
        const textView = new Text({text: text, style: this.style});
        textView.anchor.x = 0.5;
        this.list.addChild(textView);
        this.background.clear()
            .roundRect(0, 0, this.options.width + 2 * this.list.horPadding, this.list.height + 2 * this.list.vertPadding, 10)
            .fill({color: "white", alpha: 0.7});
        return textView;
    }
}

class PokemonPanel extends Panel {
    private readonly pName: Text
    private readonly hp: Text
    private readonly atk: Text
    private readonly def: Text
    private readonly spa: Text
    private readonly spd: Text
    private readonly spe: Text

    constructor() {
        super({width: 260});
        this.pName = this.addText();
        this.hp = this.addText();
        this.atk = this.addText();
        this.def = this.addText();
        this.spa = this.addText();
        this.spd = this.addText();
        this.spe = this.addText();
    }

    update(pokemon: Pokemon) {
        this.pName.text = pokemon.name
        this.hp.text = `HP: ${pokemon.hp} / ${pokemon.stats["hp"]}`
        this.atk.text = `ATK: ${pokemon.stats["atk"]}`
        this.def.text = `DEF: ${pokemon.stats["def"]}`
        this.spa.text = `SPA: ${pokemon.stats["spa"]}`
        this.spd.text = `SPD: ${pokemon.stats["spd"]}`
        this.spe.text = `SPE: ${pokemon.stats["spe"]}`
    }
}
