export function createCluster() {
    return {
        nodes: {},
        width: 0,
        maxGroupSize: 1,
    };
}
export function createNode(key, start, end, event) {
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
//# sourceMappingURL=creators.js.map