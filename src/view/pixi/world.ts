import {Application, Container, ContainerChild, Graphics, Sprite, Texture} from "pixi.js";
import {Item} from "../../domain/model/item";
import {World} from "../../domain/model/world";
import {createAdminViewport} from "./controls";
import {Viewport} from "pixi-viewport";
import {createPokemonSprite, PokemonSprite} from "./pokemon";
import {Pokemon} from "../../domain/model/pokemon";
import {Chunk} from "../../domain/model/chunk";
import {UserInterface} from "./ui";
import {BiomeView} from "./biome";

export class WorldContainer {
    private readonly container: Container<ContainerChild>;
    private readonly backgroundLayer: Container<BiomeView>;
    private readonly itemLayer: Container<Sprite>;
    private readonly collisionLayer: Graphics = new Graphics();
    private pokemons: Map<Pokemon, PokemonSprite> = new Map();
    private readonly viewport: Viewport;
    private visibleChunks: Chunk[] = [];
    private readonly ui: UserInterface;

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

        //this.container.addChild(this.collisionLayer);

        this.viewport = createAdminViewport(app, width, height);

        app.stage.addChild(this.viewport);
        this.viewport.addChild(this.container);
        this.viewport.moveCenter(this.world.center.x, this.world.center.y);

        this.ui = new UserInterface();
        this.ui.position.set(10, 10);
        app.stage.addChild(this.ui);
    }

    render = () => {
        const {world} = this;

        this.renderChunks();

        this.viewport.on('pointerdown', (event) => {
            world.center = this.viewport.toWorld({x: event.x, y: event.y});
            this.renderChunks();

            const biome = world.getBiomeAt(world.center);
            this.ui.updateCurrentBiome(biome.name);
        });
    }

    runEachFrame = () => {
        const {world} = this;

        for (const pokemon of world.addPokemon()) {
            const pokemonSprite = createPokemonSprite(pokemon);
            this.pokemons.set(pokemon, pokemonSprite);
            this.itemLayer.addChild(pokemonSprite);
        }

        world.update()

        world.removePokemons().forEach((pokemon) => {
            const pokemonSprite = this.pokemons.get(pokemon);
            this.pokemons.delete(pokemon);
            this.itemLayer.removeChild(pokemonSprite);
            pokemonSprite.destroy();
        })

        for (const [_, pokemonSprite] of this.pokemons) {
            pokemonSprite.update();
        }
    }

    updateTree = () => {
        this.world.updateTree();
        this.collisionLayer.clear();
        sortItems(this.itemLayer.children);
    }

    private renderBiomes(chunk: Chunk) {
        for (const biome of chunk.biomes) {
            const view = new BiomeView(biome);
            this.backgroundLayer.addChild(view);
        }
    }

    private clearChunks() {
        this.backgroundLayer.removeChildren().forEach((child) => {
            child.destroy({children: true, context: true, texture: true});
        });

        this.itemLayer.removeChildren()
            .filter((child) => !(child instanceof PokemonSprite))
            .forEach((child) => {
                child.destroy({children: true, context: true, texture: true});
            });
    }

    private renderChunks() {
        const {world} = this;

        const updateVisibleChunks: Chunk[] = Array.from(world.getVisibleChunks());
        const ids = updateVisibleChunks.map(c => c.id());
        if (this.visibleChunks.length == 0 || this.visibleChunks.some(c => !ids.includes(c.id()))) {
            this.clearChunks();

            for (const chunk of updateVisibleChunks) {
                for (const item of chunk.items) {
                    const itemView = createItemView(item, world);
                    itemView.anchor.set(0.5, 1);
                    this.itemLayer.addChild(itemView);
                }

                this.renderBiomes(chunk);

                for (const pokemonSprite of this.pokemons.values()) {
                    this.itemLayer.addChild(pokemonSprite);
                }
            }
            sortItems(this.itemLayer.children);
            this.visibleChunks = updateVisibleChunks;
        }
    }
}

const sortItems = (items: Sprite[]) => items.sort((a, b) => ((a.position.y + a.height * a.anchor.y) - (b.position.y + b.height * b.anchor.y)));

const createItemView = (item: Item, world: World) => new Sprite({
    texture: Texture.from(item.type),
    x: (item.position[0] + 0.5) * world.tileSize,
    y: (item.position[1] + 0.5) * world.tileSize,
    scale: item.scale
});
