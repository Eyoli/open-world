import {Polygon} from "../model/types";
import {polygonContains} from "d3-polygon";

/**
 * returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
 */
export const segmentsIntersection = (
    [a, b]: [number, number],
    [c, d]: [number, number],
    [p, q]: [number, number],
    [r, s]: [number, number]
): [number, number] => {
    const det = (c - a) * (s - q) - (r - p) * (d - b);

    if (det === 0) return null;

    const lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    const gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;

    if ((0 <= lambda && lambda <= 1) && (0 <= gamma && gamma <= 1)) {
        return [a + lambda * (c - a), b + lambda * (d - b)]
    }
    return null
}

export const contains = (polygon: Polygon, candidate: Polygon): boolean => {
    return candidate.every(p => {
        return polygon.some(([x, y]) => x === p[0] && y === p[1]) || polygonContains(polygon, p);
    });
}

export const intersection = (p1: Polygon, p2: Polygon): Polygon => {
    if (contains(p1, p2)) return p2;
    if (contains(p2, p1)) return p1;

    const intersections: { i1: number, i2: number, intersection: [number, number] }[] = [];
    for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
            const intersection = segmentsIntersection(p1[i], p1[(i + 1) % p1.length], p2[j], p2[(j + 1) % p2.length]);
            if (intersection) {
                intersections.push({i1: i, i2: j, intersection});
            }
        }
    }

    if (intersections.length === 0) return [];

    const result: Polygon = intersections.reduce((acc, {i1, i2, intersection}, index) => {
        acc.push(intersection);
        const next = intersections[(index + 1) % intersections.length];

        let i = (i1 + 1) % p1.length;
        if (polygonContains(p2, p1[i])) {
            while (i !== next.i1) {
                acc.push(p1[i]);
                i = (i + 1) % p1.length;
            }
        } else {
            i = (i2 + 1) % p2.length;
            while (i !== next.i2) {
                acc.push(p2[i]);
                i = (i + 1) % p2.length;
            }
        }

        return acc;
    }, []);

    return result;
}