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

export class LimitedQueue<T> {
    private readonly queue: T[] = [];

    constructor(
        private readonly limit: number
    ) {
    }

    push = (item: T) => {
        this.queue.push(item);
        if (this.queue.length > this.limit) {
            this.queue.shift();
        }
    }

    values = () => this.queue;
}

export class Map2D<T> {
    private readonly map: Map<string, T> = new Map();

    getOrLoad = (x: number, y: number, defaultValue: () => T): T => {
        const key = `${x},${y}`;
        if (!this.map.has(key)) {
            console.log("Loading", key);
            this.map.set(key, defaultValue());
        }
        return this.map.get(key);
    }
}
