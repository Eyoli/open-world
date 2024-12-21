import {Application, Assets, Container, DisplacementFilter, Sprite} from "pixi.js"

export const renderWater = async (app: Application) => {
    const container = new Container();
    app.stage.addChild(container);

    await Assets.load({alias: 'water-bg', src: 'dist/images/water-bg.jpeg'});
    await Assets.load({alias: 'displacement', src: 'dist/images/displacement.jpeg'});

    const displacementSprite = Sprite.from('displacement');

    const waterBackground = Sprite.from('water-bg');
    waterBackground.width = app.renderer.width;
    waterBackground.height = app.renderer.height;

    container.addChild(displacementSprite);
    container.addChild(waterBackground);

    const displacementFilter = new DisplacementFilter(displacementSprite);
    waterBackground.filters = [displacementFilter];
    displacementFilter.scale.x = 35;
    displacementFilter.scale.y = 35;

    app.ticker.add(() => {
        displacementSprite.x += 1;
        if (displacementSprite.x > displacementSprite.width) {
            displacementSprite.x = 0;
        }
    });
}
