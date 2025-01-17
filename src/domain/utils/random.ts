import * as d3 from "d3-random";
import {Delaunay} from "d3-delaunay";
import {polygonCentroid} from "d3-polygon";
import Polygon = Delaunay.Polygon;

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

export const randomInPolygon = (
    polygon: Polygon,
    randomizer: (vMin: number, vMax: number, center: number) => () => number
) => {
    const [cx, cy] = polygonCentroid(polygon);
    const vectorX = polygon.map(([x, _]) => x)
    const randomX = randomizer(Math.min(...vectorX), Math.max(...vectorX), cx);

    return () => {
        const x = randomX();
        const vectorY = polygon.slice(1)
            .filter((_, i, points) => {
                const d = (x - polygon[i][0]) / (points[i][0] - polygon[i][0]);
                return d > 0 && d < 1
            })
            .map(([_, y]) => y);
        const randomY = randomizer(Math.min(...vectorY), Math.max(...vectorY), cy);

        return [x, randomY()];
    }
}
