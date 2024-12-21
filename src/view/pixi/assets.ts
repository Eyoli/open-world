import {Assets} from "pixi.js";
import {WorldConfig} from "../../domain/model/biomes";

export const loadAssets = async (config: WorldConfig) => {
    config.assets.forEach(asset => {
        Assets.add(asset);
    });

    return await Assets.load(config.assets.map((asset => asset.alias)));
}
