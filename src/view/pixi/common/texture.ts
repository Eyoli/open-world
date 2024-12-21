import {Texture} from "pixi.js";

export const loadTextures = (urls: string[]) => urls.map((url) => Texture.from(url));
