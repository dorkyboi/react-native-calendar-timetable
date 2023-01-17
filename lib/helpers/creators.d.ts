export interface Node<T> {
    key: string;
    start: number;
    end: number;
    neighbours: {
        [key: string]: Node<T>;
    };
    cluster: Cluster<T> | null;
    position: number | null;
    biggestGroupSize: number;
    data: T;
    isLast: boolean | null;
}
export interface Cluster<T> {
    nodes: {
        [key: string]: Node<T>;
    };
    width: number;
    maxGroupSize: number;
}
export declare function createCluster<T>(): Cluster<T>;
export declare function createNode<T>(key: any, start: any, end: any, event: T): Node<T>;
//# sourceMappingURL=creators.d.ts.map