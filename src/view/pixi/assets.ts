import {Assets} from "pixi.js";
import {WorldConfig} from "../../domain/model/config";

export const loadAssets = async (config: WorldConfig) => {
    config.assets.forEach(asset => {
        Assets.add(asset);
    });

    await Assets.load({alias: 'water-bg', src: 'dist/images/water-bg.jpeg'});
    await Assets.load({alias: 'displacement', src: 'dist/images/displacement.jpeg'});

    return await Assets.load(config.assets.map((asset => asset.alias)));
}
