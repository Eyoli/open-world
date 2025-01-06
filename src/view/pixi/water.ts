import {Application, Container, DisplacementFilter, Sprite} from "pixi.js"

export const renderWater = (app: Application, width: number, height: number) => {
    const container = new Container();
    const displacementSprite = Sprite.from('displacement');
    console.log(displacementSprite.x)

    const waterBackground = Sprite.from('water-bg');
    waterBackground.width = width;
    waterBackground.height = height;

    container.addChild(displacementSprite);
    container.addChild(waterBackground);

    const displacementFilter = new DisplacementFilter(displacementSprite);
    waterBackground.filters = [displacementFilter];
    displacementFilter.scale.x = 35;
    displacementFilter.scale.y = 35;

    app.ticker.add(() => {
        if (displacementSprite.position) {
            displacementSprite.x += 1;
            if (displacementSprite.x > displacementSprite.width) {
                displacementSprite.x = 0;
            }
        }
    });

    return container;
}
