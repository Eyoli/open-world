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
