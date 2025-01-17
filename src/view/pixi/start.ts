import {Application} from 'pixi.js';
import {WorldContainer} from "./world";
import {loadAssets} from "./assets";
import {World} from "../../domain/model/world";
import {loadNationalPokedex} from "../../domain/model/pokedex";
import {createTicker} from "./common/ticker";
import {WorldConfig} from "../../domain/model/config";

export const start = async (
    width: number,
    height: number,
    config: WorldConfig
) => {
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({background: '#ffffff', resizeTo: window});

    // Load the animation sprite sheet
    await loadAssets(config)

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // render the world
    const pokedex = await loadNationalPokedex();
    const world = new World(config, pokedex);

    const worldContainer = new WorldContainer(app, width, height, world);

    worldContainer.render();
    app.ticker.add(createTicker(1000 / 30, worldContainer.runEachFrame));
    app.ticker.add(createTicker(1000 / 2, worldContainer.updateTree));
    // await renderWater(app);
};
