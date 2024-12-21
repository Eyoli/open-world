import {Application, Container, ContainerChild, Graphics, Sprite, Texture} from "pixi.js";
import {Item} from "../../domain/model/item";
import {World} from "../../domain/model/world";
import {createAdminViewport} from "./controls";
import {Viewport} from "pixi-viewport";
import {createPokemonSprite, PokemonSprite} from "./pokemon";
import {Pokemon} from "../../domain/model/pokemon";
import {Chunk} from "../../domain/model/chunk";

export class WorldContainer {
    private readonly container: Container<ContainerChild>;
    private readonly backgroundLayer: Container<ContainerChild>;
    private readonly itemLayer: Container<ContainerChild>;
    private readonly pokemonLayer: Container<PokemonSprite>;
    private pokemons: Map<Pokemon, PokemonSprite> = new Map();
    private readonly viewport: Viewport;

    constructor(
        private readonly app: Application,
        width: number,
        height: number,
        private readonly world: World
    ) {
        this.container = new Container({
            // this will make moving this container GPU powered
            isRenderGroup: true,
        });
        this.backgroundLayer = new Container({interactiveChildren: false});
        this.container.addChild(this.backgroundLayer);

        this.itemLayer = new Container();
        this.container.addChild(this.itemLayer);

        this.pokemonLayer = new Container();
        this.container.addChild(this.pokemonLayer);

        this.viewport = createAdminViewport(app, width, height);
        app.stage.addChild(this.viewport);
        this.viewport.addChild(this.container);
    }

    render = () => {
        const {world} = this;

        this.renderChunks()

        this.viewport.on('pointerdown', (event) => {
            const position = {x: event.x, y: event.y};
            world.center = this.viewport.toWorld(position);
            console.log("Set center at", world.center);

            this.backgroundLayer.children.forEach((child) => {
                child.destroy({children: true, context: true, texture: true});
            })
            this.backgroundLayer.removeChildren();

            this.itemLayer.children.forEach((child) => {
                child.destroy({children: true, context: true, texture: true});
            })
            this.itemLayer.removeChildren();
            this.renderChunks()
        });
    }

    runEachFrame = () => {
        const {world} = this;

        for (const pokemon of world.addPokemon()) {
            const pokemonSprite = createPokemonSprite(pokemon);
            this.pokemons.set(pokemon, pokemonSprite);
            this.pokemonLayer.addChild(pokemonSprite);
        }

        world.update()

        world.removePokemons().forEach((pokemon) => {
            const pokemonSprite = this.pokemons.get(pokemon);
            this.pokemons.delete(pokemon);
            this.pokemonLayer.removeChild(pokemonSprite);
        })

        for (const [_, pokemonSprite] of this.pokemons) {
            pokemonSprite.update();
        }
    }

    private renderChunkBackground(chunk: Chunk) {
        const {world} = this;

        const graphics = new Graphics();

        const offsetX = chunk.n * chunk.size * world.tileSize;
        const offsetY = chunk.m * chunk.size * world.tileSize;
        for (const {x, y, biome} of chunk.enumerateTiles()) {
            graphics.rect(offsetX + x * world.tileSize, offsetY + y * world.tileSize, world.tileSize, world.tileSize);
            graphics.fill(biome.color);
        }

        return graphics;
    }

    private renderChunks() {
        const {world} = this;

        for (const chunk of world.getVisibleChunks()) {
            const itemsContainer = new Container();

            for (const item of chunk.items) {
                const itemView = createItemView(item, world);
                itemsContainer.addChild(itemView);
            }

            this.backgroundLayer.addChild(this.renderChunkBackground(chunk));
            this.itemLayer.addChild(itemsContainer);

            for (const pokemonSprite of this.pokemons.values()) {
                this.pokemonLayer.addChild(pokemonSprite);
            }
        }

        this.itemLayer.children.sort((a, b) => (a.position.y + a.height) - (b.position.y + b.height));
    }
}

const createItemView = (item: Item, world: World) => new Sprite({
    texture: Texture.from(item.type),
    x: item.position[0] * world.tileSize,
    y: item.position[1] * world.tileSize,
    scale: item.scale,
});
