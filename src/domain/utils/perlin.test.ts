// Generate suite test for perlin noise

import {FBMGenerator} from "./perlin";

jest.mock('d3-random', () => {
    let i = 0;
    return {
        randomUniform: () => () => {
            i++;
            return (i % 10) / 10
        }
    }
});

describe("PerlinNoiseGenerator", () => {

    it("should extend gradient field correctly (line translation)", () => {
        const perlin = new FBMGenerator(10, 2);
        const result = perlin.getNoiseField(0, 0, 2, 2);
        const nextResult = perlin.getNoiseField(1, 0, 2, 2);
    });
});
