export const indexBy = function <T, K>(array: T[], keyMapper: (item: T) => K): Map<K, T> {
    return array.reduce((acc: Map<K, T>, item: T) => {
        const key = keyMapper(item);
        acc.set(key, item);
        return acc;
    }, new Map());
}

export const distinctBy = function <T, K>(array: T[], keyMapper: (item: T) => K): T[] {
    return Array.from(indexBy(array, keyMapper).values());
}

export class Map2D<T> {
    private readonly map: Map<string, T> = new Map();

    getOrSetDefault = (x: number, y: number, defaultValue: () => T): T => {
        const key = `${x}-${y}`;
        if (!this.map.has(key)) {
            this.map.set(key, defaultValue());
        }
        return this.map.get(key);
    }
}
