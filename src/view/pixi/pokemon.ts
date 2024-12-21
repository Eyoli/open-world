import {Pokemon} from "../../domain/model/pokemon";
import {AnimatedSprite, Texture} from "pixi.js";
import {Direction} from "../../domain/model/types";

export class PokemonSprite {
    constructor(
        readonly sprites: Map<Direction, AnimatedSprite>,
        readonly pokemon: Pokemon
    ) {
    }

    update = () => {
        this.pokemon.act();

        for (const sprite of this.sprites.values()) {
            sprite.x = this.pokemon.position.x;
            sprite.y = this.pokemon.position.y;
            sprite.visible = false;
            sprite.stop();
        }
        const activeSprite = this.sprites.get(this.pokemon.direction);
        if (!activeSprite.visible) {
            activeSprite.visible = true;
            activeSprite.play();
        }
    }
}

export const createPokemonSprite = (pokemon: Pokemon): PokemonSprite => {

    const anim: [Direction, AnimatedSprite][] = Array.from(getPokemonTextures(pokemon.data.id.toString().padStart(3, '0')).entries())
        .map(([direction, textures]) => {
            let anim;
            try {
                anim = new AnimatedSprite(textures)
                anim.animationSpeed = 0.05;
                anim.scale = 2;
            } catch (e) {
                anim = new AnimatedSprite([Texture.from("UNKNOWN")]);
                anim.width = 32;
                anim.height = 32;
            }

            anim.x = pokemon.position.x;
            anim.y = pokemon.position.y;
            anim.anchor.set(0.5);
            return [direction, anim];
        });

    return new PokemonSprite(new Map(anim), pokemon);
}

export const getPokemonTextures = (id: String) =>
    new Map(
        [
            [Direction.UP, asTexture([`o-b_hs_${id}_1.png`, `o-b_hs_${id}_2.png`])],
            [Direction.DOWN, asTexture([`o_hs_${id}_1.png`, `o_hs_${id}_2.png`])],
            [Direction.LEFT, asTexture([`o-l_hs_${id}_1.png`, `o-l_hs_${id}_2.png`])],
            [Direction.RIGHT, asTexture([`o-r_hs_${id}_1.png`, `o-r_hs_${id}_2.png`])]
        ]
    )

const asTexture = (urls: string[]) => urls.map((url) => Texture.from(url));