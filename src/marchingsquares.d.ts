declare module 'marchingsquares' {
    /**
     *
     * @param data 2-dimensional input data, i.e. the scalar field (must be array of arrays, or pre-processed data object obtained from new QuadTree()). This parameter is mandatory.
     * @param threshold A constant numerical value (or array of numerical values) defining the curve function for the iso line(s). This parameter is mandatory
     * @param options An object with attributes allowing for changes in the behavior of this function (See below). This parameter is optional
     * @return If threshold is a single scalar, an array of paths representing the iso lines for the given threshold and input data.
     * If threshold is an array of scalars, an additional array layer wraps the individual arrays of paths for each threshold value.
     */
    // @ts-ignore
    export function isoLines(data: ScalarField | QuadTree, threshold: ScalarArray, options?: Options)

    /**
     *
     * @param data 2-dimensional input data, i.e. the scalar field (must be array of arrays, or pre-processed data object obtained from new QuadTree()). This parameter is mandatory.
     * @param lowerBound A constant numerical value (or array of numerical values) that define(s) the lower bound of the iso band. This parameter is mandatory.
     * @param bandwidth A constant numerical value (or array of numerical values) that defines the width(s) the iso band, i.e. the range of values. This parameter is mandatory.
     * @param options An object with attributes allowing for changes in the behavior of this function (See below). This parameter is optional.
     * @return If lowerBound is a single scalar, an array of paths representing the iso lines which enclose the iso band of size bandWidth.
     * If lowerBound is an array of scalars, an additional array layer wraps the individual arrays of paths for each threshold-bandWidth pair. Note, that if bandWidth is a scalar it will be applied to all entries in the lowerBound array.
     */
    // @ts-ignore
    export function isoBands(data: ScalarField | QuadTree, lowerBound: ScalarArray, bandwidth: ScalarArray, options?: Options)

    /**
     *
     * @param data 2-dimensional input data (scalar field). This parameter is mandatory.
     */
    export function quadTree(data: ScalarField): QuadTree

    export type ScalarArray = number[]

    export type ScalarField = ArrayLike<ArrayLike<number>>

    export type QuadTree = {}

    /**
     * @property successCallback A function called at the end of each iso line / iso band computation. It will be passed the path array and the corresponding limit(s) (threshold or lowerBound, bandWidth) as first and second (third) arguments, respectively.
     * @property verbose Create console.log() info messages before each major step of the algorithm
     * @property polygons If true the function returns a list of path coordinates for individual polygons within each grid cell, if false returns a list of path coordinates representing the outline of connected polygons.
     * @property linearRing If true, the polygon paths are returned as linear rings, i.e. the first and last coordinate are identical indicating a closed path. Note, that for the IsoLines implementation a value of false reduces the output to iso lines that are not necessarily closed paths.
     * @property noQuadTree If true, Quad-Tree optimization is deactivated no matter what the input is. Otherwise, the implementations make use of Quad-Tree optimization if the input demands for multiple iso lines/bands.
     * @property noFrame If true, the iso line / iso contour algorithm omits the enclosing rectangular outer frame when all data points along the boundary of the scalar field are below the threshold. Otherwise, if necessary, the enclosing frame will be included for each threshold level as the very first returned path.
     */
    export type Options = {
        successCallback?: (isoBands: any) => void,

        verbose?: boolean,

        polygons?: boolean,

        linearRing?: boolean,

        noQuadTree?: boolean,

        noFrame?: boolean
    }
}
