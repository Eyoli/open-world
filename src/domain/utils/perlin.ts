import {randomUniform} from './random';

/* Function to linearly interpolate between a0 and a1
 * Weight w should be in the range [0.0, 1.0]
 */
const interpolate = (a0: number, a1: number, w: number) => {
    // clamping
    if (0.0 > w) return a0;
    if (1.0 < w) return a1;

    // Linear interpolation
    // return (a1 - a0) * w + a0;

    // Use this cubic interpolation [[Smoothstep]] instead, for a smooth appearance:
    //return (a1 - a0) * (3.0 - w * 2.0) * w * w + a0;

    // Use [[Smootherstep]] for an even smoother result with a second derivative equal to zero on boundaries:
    return (a1 - a0) * ((w * (w * 6.0 - 15.0) + 10.0) * w * w * w) + a0;
}

const randomRadAngle = randomUniform(0, 2 * Math.PI);

export type GradientField = number[][][];

export type PerlinNoise = {
    noises: number[][],
    gradientField: GradientField
}

// Computes the dot product of the distance and gradient vectors.
const dotGridGradient = (gradientField: GradientField, ix: number, iy: number, x: number, y: number) => {
    // Get gradient from integer coordinates
    const gradient = gradientField[ix][iy];

    // Compute the distance vector
    const dx = x - ix;
    const dy = y - iy;

    // Compute the dot-product
    return (dx * gradient[0] + dy * gradient[1]);
}

const noise2d = (gradients: GradientField, x: number, y: number) => {
    // Determine grid cell coordinates
    const x0 = Math.floor(x);
    const x1 = x0 + 1;
    const y0 = Math.floor(y);
    const y1 = y0 + 1;

    // Determine interpolation weights
    // Could also use higher order polynomial/s-curve here
    const sx = x - x0;
    const sy = y - y0;

    // Interpolate between grid point gradients
    let n0, n1, ix0, ix1, value;

    n0 = dotGridGradient(gradients, x0, y0, x, y);
    n1 = dotGridGradient(gradients, x1, y0, x, y);
    ix0 = interpolate(n0, n1, sx);

    n0 = dotGridGradient(gradients, x0, y1, x, y);
    n1 = dotGridGradient(gradients, x1, y1, x, y);
    ix1 = interpolate(n0, n1, sx);

    value = interpolate(ix0, ix1, sy);
    return value;
}

const randomGradientField = (nx: number, ny: number): GradientField => {
    const field = [];
    for (let i = 0; i < nx; i++) {
        field.push([]);
        for (let j = 0; j < ny; j++) {
            const random = randomRadAngle();
            field[i].push([Math.cos(random), Math.sin(random)])
        }
    }
    return field;
}

function fbm(gradients: GradientField, x: number, y: number, numOctaves: number = 1) {
    let result = 0.0;
    let amplitude = 1.0;
    let frequency = 0.005;
    const lacunarity = 2.0;
    const gain = 0.5;

    for (let octave = 0; octave < numOctaves; octave++) {
        const n = amplitude * noise2d(gradients, x * frequency, y * frequency);
        result += n;

        amplitude *= gain;
        frequency *= lacunarity;
    }

    return result;
}

function* noisesGenerator(gradientField: GradientField, fieldSize: number, octaves: number) {
    const gradientFieldSize = gradientField.length - 1;

    for (let i = 0; i < fieldSize; i++) {
        const x = (i + 0.5) * gradientFieldSize / fieldSize;
        const array = [];
        for (let j = 0; j < fieldSize; j++) {
            const y = (j + 0.5) * gradientFieldSize / fieldSize;
            array.push(noise2d(gradientField, x, y) + fbm(gradientField, x, y, octaves));
        }
        yield array;
    }
}

export class FBMGenerator {
    private readonly gradientFields: Map<string, GradientField> = new Map();

    constructor(
        readonly gradNumber: number,
        private readonly fractalBrownianOctaves: number = 1
    ) {
    }


    private generateField = (n: number, m: number) => {
        const {gradientFields, gradNumber} = this;
        if (!gradientFields.has(`${n}-${m}`)) {
            gradientFields.set(`${n}-${m}`, randomGradientField(gradNumber, gradNumber));
        }
        return gradientFields.get(`${n}-${m}`);
    }

    private getWorkingGradientField = (n: number, m: number): GradientField => {
        const {generateField, gradNumber} = this;

        const fieldNM = generateField(n, m);
        const fieldN1M = generateField(n + 1, m);
        const fieldNM1 = generateField(n, m + 1);
        const fieldN1M1 = generateField(n + 1, m + 1);

        const workingField = []
        for (let i = 0; i < gradNumber; i++) {
            workingField.push([]);
            for (let j = 0; j < gradNumber; j++) {
                workingField[i].push(fieldNM[i][j]);
            }
            workingField[i].push(fieldNM1[i][0]);
        }
        workingField.push(fieldN1M[0]);
        workingField[gradNumber].push(fieldN1M1[0][0]);

        return workingField;
    }

    generateNoiseField(n: number, m: number, fieldSize: number): PerlinNoise {
        const {getWorkingGradientField, fractalBrownianOctaves} = this;

        const gradientField = getWorkingGradientField(n, m);

        return {
            noises: Array.from(noisesGenerator(gradientField, fieldSize, fractalBrownianOctaves)),
            gradientField
        };
    }
}
