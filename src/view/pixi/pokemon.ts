import {Pokemon} from "../../domain/model/pokemon";
import {AnimatedSprite, Graphics, Sprite, Texture} from "pixi.js";
import {Direction} from "../../domain/model/types";
import {loadTextures} from "./common/texture";

export class PokemonSprite extends Sprite {
    private readonly hpBar: Graphics;
    private readonly lineToTarget: Graphics;

    constructor(
        private readonly sprites: Map<Direction, AnimatedSprite>,
        readonly pokemon: Pokemon
    ) {
        super();
        for (const sprite of this.sprites.values()) {
            this.addChild(sprite);
        }
        this.hpBar = new Graphics();
        this.addChild(this.hpBar);

        this.lineToTarget = new Graphics();
        this.addChild(this.lineToTarget);
    }

    update = () => {
        this.x = this.pokemon.position.x;
        this.y = this.pokemon.position.y;
        for (const sprite of this.sprites.values()) {
            sprite.visible = false;
            sprite.stop();
        }
        const activeSprite = this.sprites.get(this.pokemon.direction);
        if (!activeSprite.visible) {
            activeSprite.visible = true;
            activeSprite.play();
        }
        this.updateHpBar();
        // this.updateLineToTarget();
    }

    private updateLineToTarget = () => {
        this.lineToTarget.clear();
        if (this.pokemon.target) {
            this.lineToTarget.lineTo(this.pokemon.target.position.x - this.x, this.pokemon.target.position.y - this.y);
            this.lineToTarget.stroke({color: "#ff0000", width: 5});
        }
        this.lineToTarget.circle(0, 0, this.pokemon.visibility);
        this.lineToTarget.stroke({color: "#ff0000", width: 5});
    }

    private updateHpBar = () => {
        const spriteHeight = this.sprites.get(Direction.UP).texture.trim?.height || this.sprites.get(Direction.UP).height;
        this.hpBar.clear()
        const hpWidth = 32 * (this.pokemon.data.battleData.curHP() / this.pokemon.data.battleData.maxHP());
        this.hpBar.rect(-16, spriteHeight + 17, hpWidth, 4);
        this.hpBar.fill("#40ff00");
        this.hpBar.rect(-16 + hpWidth, spriteHeight + 17, 32 - hpWidth, 4);
        this.hpBar.fill("#ff0000");
    }
}

export const createPokemonSprite = (pokemon: Pokemon): PokemonSprite => {
    const anim: [Direction, AnimatedSprite][] = getPokemonTextures(pokemon)
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

            anim.anchor.set(0.5);
            return [direction, anim];
        });

    return new PokemonSprite(new Map(anim), pokemon);
}

const getPokemonTextures = (pokemon: Pokemon): [Direction, Texture[]][] => {
    const id = pokemon.data.id.toString().padStart(3, '0')
    return [
        [Direction.UP, loadTextures([`o-b_hs_${id}_1.png`, `o-b_hs_${id}_2.png`])],
        [Direction.DOWN, loadTextures([`o_hs_${id}_1.png`, `o_hs_${id}_2.png`])],
        [Direction.LEFT, loadTextures([`o-l_hs_${id}_1.png`, `o-l_hs_${id}_2.png`])],
        [Direction.RIGHT, loadTextures([`o-r_hs_${id}_1.png`, `o-r_hs_${id}_2.png`])]
    ];
}
