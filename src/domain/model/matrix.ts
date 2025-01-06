export const combineMasks = (mask1: boolean[][], mask2: boolean[][]): boolean[][] => {
    if (mask1.length !== mask2.length || mask1[0].length !== mask2[0].length) {
        throw new Error('Masks should have the same size');
    }

    const mask: boolean[][] = [];
    for (let i = 0; i < mask1.length; i++) {
        const line = [];
        for (let j = 0; j < mask2[0].length; j++) {
            line[j] = mask1[i][j] && mask2[i][j];
        }
        mask.push(line);
    }
    return mask;
}

export const createMask = (a: number[][], thresholds: [number, number], reversed: boolean = false): boolean[][] => {
    const result: boolean[][] = [];
    for (let i = 0; i < a.length; i++) {
        const line = [];
        for (let j = 0; j < a[i].length; j++) {
            if (thresholds[0] <= a[i][j] && thresholds[1] >= a[i][j]) {
                line[j] = !reversed;
            } else {
                line[j] = reversed;
            }
        }
        result.push(line);
    }
    return result;
}

export const applyMask = (a: number[][], mask: boolean[][]): number[][] => {
    const result: number[][] = [];
    for (let i = 0; i < a.length; i++) {
        const line = [];
        for (let j = 0; j < a[i].length; j++) {
            line[j] = mask[i][j] ? a[i][j] : 1.1;
        }
        result.push(line);
    }
    return result;
}


export const amplifyInterval = (a: number[][], thresholds: [number, number]): number[][] => {
    const result: number[][] = [];
    const factor = 2 / (thresholds[1] - thresholds[0]);
    for (let i = 0; i < a.length; i++) {
        const line = [];
        for (let j = 0; j < a[i].length; j++) {
            line[j] = -1 + (a[i][j] - thresholds[0]) * factor;
        }
        result.push(line);
    }
    return result;
}
