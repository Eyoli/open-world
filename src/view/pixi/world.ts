import {Application, Container, ContainerChild, Graphics, PointData, Sprite, Texture} from "pixi.js";
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
    private readonly collisionLayer: Graphics = new Graphics();
    private pokemons: Map<Pokemon, PokemonSprite> = new Map();
    private readonly viewport: Viewport;
    private visibleChunks: Chunk[] = [];

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
    }

    render = () => {
        const {world} = this;

        this.renderChunks()

        this.viewport.on('pointerdown', (event) => {
            world.center = this.viewport.toWorld({x: event.x, y: event.y});
            this.renderChunks()
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
        this.world.pokemonTree.visit((node, x1, y1, x2, y2) => {
            if (x2 > x1 && y2 > y1) {
                this.collisionLayer.rect(x1, y1, x2 - x1, y2 - y1);
                this.collisionLayer.stroke({color: 0xff0000, width: 5});
            }
        });
        this.itemLayer.children.sort((a, b) => (a.position.y + a.height) - (b.position.y + b.height));
    }

    private renderChunkBackground(chunk: Chunk) {
        const chunkSize = chunk.size * chunk.tileSize;
        const offsetX = chunk.n * chunkSize;
        const offsetY = chunk.m * chunkSize;

        for (const biome of chunk.biomes) {
            const graphics = new Graphics();

            const drawablePolygon = biome.polygon.map(([y, x]) => ({
                x: offsetX + x * chunk.tileSize,
                y: offsetY + y * chunk.tileSize
            } as PointData));
            graphics.poly(drawablePolygon);
            graphics.fill(biome.config.color);
            this.backgroundLayer.addChild(graphics);

            // if (biome.config.type === "DEEP_OCEAN") {
            //     const container = renderWater(this.app, chunkSize, chunkSize);
            //     container.x = offsetX;
            //     container.y = offsetY;
            //     container.mask = graphics;
            //     this.backgroundLayer.addChild(container);
            // } else {
            // }
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

        const updateVisibleChunks = Array.from(world.getVisibleChunks());
        const ids = updateVisibleChunks.map(c => c.id());
        if (this.visibleChunks.length == 0 || this.visibleChunks.some(c => !ids.includes(c.id()))) {
            this.clearChunks();

            console.log("Visible chunks updated");
            for (const chunk of updateVisibleChunks) {
                for (const item of chunk.items) {
                    const itemView = createItemView(item, world);
                    this.itemLayer.addChild(itemView);
                }

                this.renderChunkBackground(chunk);

                for (const pokemonSprite of this.pokemons.values()) {
                    this.itemLayer.addChild(pokemonSprite);
                }
            }
            this.itemLayer.children.sort((a, b) => (a.position.y + a.height) - (b.position.y + b.height));
            this.visibleChunks = updateVisibleChunks;
        }
    }
}

const createItemView = (item: Item, world: World) => new Sprite({
    texture: Texture.from(item.type),
    x: item.position[0] * world.config.tileSize,
    y: item.position[1] * world.config.tileSize,
    scale: item.scale
});
