import {Application, Container, ContainerChild, Graphics, Sprite, Texture} from "pixi.js";
import {Item} from "../../domain/model/item";
import {World} from "../../domain/model/world";
import {Position} from "../../domain/model/types";
import {createAdminViewport} from "./controls";
import {Viewport} from "pixi-viewport";
import {createPokemonSprite, PokemonSprite} from "./pokemon";
import {randomInt} from "../../domain/utils/random";
import {createTicker} from "./common/ticker";

export class WorldContainer {
    private readonly container: Container<ContainerChild>;
    private readonly background: Container<ContainerChild>;
    private readonly items: Container<ContainerChild>;
    private pokemons: PokemonSprite[] = [];
    private readonly viewport: Viewport;

    private center: Position = {x: 0, y: 0};

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
        this.background = new Container();
        this.container.addChild(this.background);

        this.items = new Container();
        this.container.addChild(this.items);

        this.viewport = createAdminViewport(app, width, height);
        app.stage.addChild(this.viewport);
        this.viewport.addChild(this.container);
    }

    render = () => {
        const {world} = this;

        this.renderChunks(world, this.center)

        this.viewport.on('pointerdown', (event) => {
            const position = {x: event.x, y: event.y};
            this.center = this.viewport.toWorld(position);
            console.log("click", this.center);
            this.background.children.forEach((child) => {
                child.destroy({children: true});
            })
            this.background.removeChildren();
            this.items.removeChildren();
            this.renderChunks(world, this.center)
        });

        this.app.ticker.add(createTicker(1000 / 30, this.runEachFrame));
    }

    private runEachFrame = () => {
        const {world} = this;

        if (this.pokemons.length < 100) {
            const randomPosition = randomInt(-2000, 2000);
            const position = {x: this.center.x + randomPosition(), y: this.center.y + randomPosition()};
            const pokemon = world.generatePokemonAt(position);
            const pokemonSprite = createPokemonSprite(pokemon);
            this.pokemons.push(pokemonSprite);
            pokemonSprite.sprites.forEach((sprite) => {
                this.items.addChild(sprite);
            });
        }

        this.filterPokemons();

        for (const pokemon of this.pokemons) {
            pokemon.update();
        }
    }

    private renderChunks(world: World, position: Position) {
        for (const chunk of world.getVisibleChunks(position)) {
            const itemsContainer = new Container();
            const graphics = new Graphics();

            const offsetX = chunk.n * chunk.size * world.tileSize;
            const offsetY = chunk.m * chunk.size * world.tileSize;
            for (const {x, y, biome} of chunk.enumerateTiles()) {
                graphics.rect(offsetX + x * world.tileSize, offsetY + y * world.tileSize, world.tileSize, world.tileSize);
                graphics.fill(biome.color);
            }

            for (const item of chunk.items) {
                const itemView = createItemView(item, world);
                itemsContainer.addChild(itemView);
            }

            this.background.addChild(graphics);
            this.items.addChild(itemsContainer);

            this.filterPokemons();
            this.pokemons.forEach(({sprites}) => {
                sprites.forEach((sprite) => {
                    this.items.addChild(sprite);
                });
            });
        }

        this.items.children.sort((a, b) => (a.position.y + a.height) - (b.position.y + b.height));
    }

    private filterPokemons = () => {
        this.pokemons = this.pokemons.filter(({pokemon}) => {
            const dx = pokemon.position.x - this.center.x;
            const dy = pokemon.position.y - this.center.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return (distance <= 2000)
        })
    }
}

const createItemView = (item: Item, world: World) => new Sprite({
    texture: Texture.from(item.type),
    x: item.position[0] * world.tileSize,
    y: item.position[1] * world.tileSize,
    scale: item.scale,
});
