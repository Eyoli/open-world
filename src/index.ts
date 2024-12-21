import {start} from "./view/pixi/start";


window.onload = async () => {
    const width = 500;
    const height = 500;

    await start(width, height);
}
