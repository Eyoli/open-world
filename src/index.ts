import {start} from "./view/pixi/start";
import {load} from "js-yaml";
import {AssetsConfig, BaseConfig, BiomesConfig, FactorsConfig, TerrainConfig, WorldConfig} from "./domain/model/config";

const CONFIG_ROOT = 'dist/worlds/test';

window.onload = async () => {
    const width = 500;
    const height = 500;

    const config = await loadWorldConfig(CONFIG_ROOT);

    await start(width, height, config);
}

const loadWorldConfig = async (root: string): Promise<WorldConfig> => {
    const base = await loadYaml(`${root}/base.yml`) as BaseConfig;
    const terrain = await loadYaml(`${root}/terrain.yml`) as TerrainConfig;
    const factors = await loadYaml(`${root}/factors.yml`) as FactorsConfig;
    const assets = await loadYaml(`${root}/assets.yml`) as AssetsConfig;
    const biomes = await loadYaml(`${root}/biomes.yml`) as BiomesConfig;

    return {base, terrain, factors, assets, biomes};
}

const loadYaml = async (path: string) =>
    fetch(path)
        .then(response => response.text())
        .then(fileContents => load(fileContents));
