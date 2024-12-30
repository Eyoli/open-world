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
    private readonly collisionLayer: Graphics = new Graphics();
    private pokemons: Map<Pokemon, PokemonSprite> = new Map();
    private readonly viewport: Viewport;

    constructor(
        app: Application,
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

        //this.container.addChild(this.collisionLayer);

        this.viewport = createAdminViewport(app, width, height);
        app.stage.addChild(this.viewport);
        this.viewport.addChild(this.container);
        this.viewport.moveCenter(this.world.center.x, this.world.center.y);
    }

    render = () => {
        const {world} = this;

        this.renderChunks()

        this.viewport.on('pointerdown', (event) => {
            const position = {x: event.x, y: event.y};
            world.center = this.viewport.toWorld(position);
            console.log("Set center at", world.center);

            this.backgroundLayer.removeChildren().forEach((child) => {
                child.destroy({children: true, context: true, texture: true});
            });

            this.itemLayer.removeChildren().forEach((child) => {
                child.destroy({children: true, context: true, texture: true});
            });
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

    updateTree = () => {
        this.world.updateTree();
        this.collisionLayer.clear();
        this.world.pokemonTree.visit((node, x1, y1, x2, y2) => {
            if (x2 > x1 && y2 > y1) {
                this.collisionLayer.rect(x1, y1, x2 - x1, y2 - y1);
                this.collisionLayer.stroke({color: 0xff0000, width: 5});
            }
        })
    }

    private renderChunkBackground(chunk: Chunk) {
        const {world: {config: {tileSize}}} = this;

        const graphics = new Graphics();

        const offsetX = chunk.n * chunk.size * tileSize;
        const offsetY = chunk.m * chunk.size * tileSize;
        for (const {x, y, biome} of chunk.enumerateTiles()) {
            graphics.rect(offsetX + x * tileSize, offsetY + y * tileSize, tileSize, tileSize);
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
    x: item.position[0] * world.config.tileSize,
    y: item.position[1] * world.config.tileSize,
    scale: item.scale,
});
