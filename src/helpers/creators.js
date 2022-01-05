// Entities creators
export const createCluster = () => ({
    nodes: {},
    width: 0,
    maxGroupSize: 1,
});

export const createNode = (key, start, end, event) => ({
    key,
    start,
    end,
    neighbours: {},
    cluster: null,
    position: null,
    biggestGroupSize: 1,
    data: event,
});
