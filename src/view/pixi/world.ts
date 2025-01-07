import {Application, Container, ContainerChild, Graphics, PointData, Sprite, Texture} from "pixi.js";
import {Item} from "../../domain/model/item";
import {World} from "../../domain/model/world";
import {createAdminViewport} from "./controls";
import {Viewport} from "pixi-viewport";
import {createPokemonSprite, PokemonSprite} from "./pokemon";
import {Pokemon} from "../../domain/model/pokemon";
import {Chunk} from "../../domain/model/chunk";
import {UserInterface} from "./ui";

export class WorldContainer {
    private readonly container: Container<ContainerChild>;
    private readonly backgroundLayer: Container<ContainerChild>;
    private readonly itemLayer: Container<ContainerChild>;
    private readonly collisionLayer: Graphics = new Graphics();
    private pokemons: Map<Pokemon, PokemonSprite> = new Map();
    private readonly viewport: Viewport;
    private visibleChunks: Chunk[] = [];
    private ui: UserInterface;

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

        this.renderChunks()

        this.viewport.on('pointerdown', (event) => {
            world.center = this.viewport.toWorld({x: event.x, y: event.y});
            this.renderChunks();

            const biome = world.getBiomeAt(world.center);
            this.ui.updateCurrentBiome(biome.config.type);
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
        for (const biome of chunk.biomes) {
            const graphics = new Graphics();

            const drawablePolygon = biome.polygon.map(([y, x]) => ({x, y} as PointData));
            graphics.poly(drawablePolygon);
            if (biome.config.texture) {
                graphics.fill({texture: Texture.from(biome.config.texture), color: biome.config.color});
            } else {
                graphics.fill({color: biome.config.color});
            }
            this.backgroundLayer.addChild(graphics);
        }
    }

    private renderChunkContours(chunk: Chunk) {
        for (const polygons of Object.values(chunk.contours)) {
            const graphics = new Graphics();
            for (const polygon of polygons) {
                const points = polygon.map(([y, x], i) => ({x, y} as PointData));
                graphics.poly(points);
                graphics.stroke({color: "red", width: 5});
            }
            this.backgroundLayer.addChild(graphics);
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
                // this.renderChunkContours(chunk);

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
