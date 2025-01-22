import * as d3 from "d3-random";

const seed = Math.random()
const source = d3.randomLcg(seed)

export const randomUniform = d3.randomUniform.source(source)
export const randomInt = d3.randomInt.source(source)

export const randomDirection = () => {
    const rand = randomUniform(-Math.PI, Math.PI);
    return () => rand()
}

export const rand2d = (xMin: number, yMin: number, xMax: number, yMax: number) => {
    const randX = randomInt(xMin, xMax);
    const randY = randomInt(yMin, yMax);
    return () => [randX(), randY()];
}
