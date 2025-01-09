import {createQuasiMask, multiply} from "./masks";

describe("Masks", () => {

    it("should create a quasi mask", () => {
        const noises = [[1, 1, 0.7], [0.5, 0.4, 0.2], [0.1, -1, -1]]
        const mask = createQuasiMask(noises, [0.1, 0.7])
        expect(mask).toEqual([[0, 0, 0], [0.6666666666666665, 0.9999999999999998, 0.3333333333333335], [2.220446049250313e-16, 0, 0]])
    });

    it("should multiply quasi masks", () => {
        const mask1 = [[1, 1, 1], [0.33333333333333326, 1, 0.6666666666666667], [0, 0, 0]]
        const mask2 = [[0, 0, 0], [1, 1, 1], [1, 1, 1]]
        expect(multiply(mask1, mask2)).toEqual([[0, 0, 0], [0.33333333333333326, 1, 0.6666666666666667], [0, 0, 0]])
    });
});
