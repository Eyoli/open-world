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
        const perlin = new FBMGenerator(2);
        const result = perlin.generateNoiseField(0, 0, 2);
        const nextResult = perlin.generateNoiseField(1, 0, 2);

        expect(nextResult.gradientField[0]).toEqual(result.gradientField[2]);
    });

    it("should extend gradient field correctly (row translation)", () => {
        const perlin = new FBMGenerator(2);
        const result = perlin.generateNoiseField(0, 0, 2);
        const nextResult = perlin.generateNoiseField(0, 1, 2);

        expect(nextResult.gradientField.map(line => line[0])).toEqual(result.gradientField.map(line => line[2]));
    });
});
