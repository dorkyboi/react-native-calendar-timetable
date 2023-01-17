export interface Node<T> {
    key: string,
    start: number,
    end: number,
    neighbours: { [key: string]: Node<T> },
    cluster: Cluster<T> | null,
    position: number | null,
    biggestGroupSize: number,
    data: T,
    isLast: boolean | null,
}

export interface Cluster<T> {
    nodes: { [key: string]: Node<T> },
    width: number,
    maxGroupSize: number,
}

export function createCluster<T>(): Cluster<T> {
    return {
        nodes: {},
        width: 0,
        maxGroupSize: 1,
    };
}

export function createNode<T>(key: any, start: any, end: any, event: T): Node<T> {
    return {
        key,
        start,
        end,
        neighbours: {},
        cluster: null,
        position: null,
        biggestGroupSize: 1,
        data: event,
        isLast: null,
    };
}
