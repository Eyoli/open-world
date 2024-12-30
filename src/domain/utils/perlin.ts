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

export type PerlinNoise = {
    noises: number[][]
}

class GradientField {
    private readonly field: Map<string, number[]> = new Map();

    constructor(
        readonly density: number
    ) {
        if (density < 1) throw new Error('Density should be greater than 1');
    }

    getOrCreate = (x: number, y: number) => {
        const key = `${x},${y}`;
        if (!this.field.has(key)) {
            const random = randomRadAngle();
            this.field.set(key, [Math.cos(random), Math.sin(random)]);
        }
        return this.field.get(key);
    }

    // Computes the dot product of the distance and gradient vectors.
    dotGridGradient(ix: number, iy: number, x: number, y: number) {
        // Get gradient from integer coordinates
        const gradient = this.getOrCreate(ix, iy);

        // Compute the distance vector
        const dx = x - ix;
        const dy = y - iy;

        // Compute the dot-product
        return (dx * gradient[0] + dy * gradient[1]);
    }
}

const noise2d = (field: GradientField, x: number, y: number) => {
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

    n0 = field.dotGridGradient(x0, y0, x, y);
    n1 = field.dotGridGradient(x1, y0, x, y);
    ix0 = interpolate(n0, n1, sx);

    n0 = field.dotGridGradient(x0, y1, x, y);
    n1 = field.dotGridGradient(x1, y1, x, y);
    ix1 = interpolate(n0, n1, sx);

    value = interpolate(ix0, ix1, sy);
    return value;
}

function fbm(field: GradientField, x: number, y: number, numOctaves: number = 1) {
    let result = 0.0;
    let amplitude = 1.0;
    let frequency = 0.005;
    const lacunarity = 2.0;
    const gain = 0.5;

    for (let octave = 0; octave < numOctaves; octave++) {
        const n = amplitude * noise2d(field, x * frequency, y * frequency);
        result += n;

        amplitude *= gain;
        frequency *= lacunarity;
    }

    return result;
}

function generateNoises(gradientField: GradientField, x: number, y: number, width: number, height: number, octaves: number) {
    const matrix = [];
    for (let i = 0; i < width; i++) {
        const xi = (x + i + 0.5) / gradientField.density;
        const array = [];
        for (let j = 0; j < height; j++) {
            const yj = (y + j + 0.5) / gradientField.density;
            array.push(noise2d(gradientField, xi, yj) + fbm(gradientField, xi, yj, octaves));
        }
        matrix.push(array);
    }
    return matrix;
}

export class FBMGenerator {
    private readonly gradientField: GradientField;

    constructor(
        density: number,
        private readonly fractalBrownianOctaves: number = 1
    ) {
        this.gradientField = new GradientField(density);
    }

    getNoiseField(x: number, y: number, width: number, height: number): PerlinNoise {
        const {fractalBrownianOctaves} = this;

        return {
            noises: generateNoises(this.gradientField, x, y, width, height, fractalBrownianOctaves)
        };
    }
}
