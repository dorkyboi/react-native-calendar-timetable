import { createCluster, createNode } from "./creators";
import { getDayMinutes } from "./date";
const TotalMinutesInDay = (24 * 60) + 1;
// Algorithm to separating events and mapping all neighbours between each other
export function clusterizer(events, minutes) {
    // Object with mapped nodes with structure described in the creators.ts
    let nodeMap = {};
    let clusters = [];
    // Object with nodes for each cluster with structure described in the creators.ts
    let cluster = null;
    events?.forEach(event => {
        nodeMap[event.key] = createNode(event.key, event.start, event.end, event);
    });
    minutes?.forEach(minute => {
        if (minute?.length > 0) {
            minute.forEach(eventKey => {
                if (cluster === null)
                    cluster = createCluster();
                if (!cluster.nodes[eventKey]) {
                    cluster.nodes[eventKey] = nodeMap[eventKey];
                    nodeMap[eventKey].cluster = cluster;
                }
            });
            return;
        }
        // Push cluster to timetable
        if (cluster !== null)
            clusters.push(cluster);
        cluster = null;
    });
    if (cluster !== null)
        clusters.push(cluster);
    minutes?.forEach(minute => {
        minute?.forEach(eventKey => {
            let findNode = nodeMap[eventKey];
            findNode.biggestGroupSize = Math.max(findNode.biggestGroupSize, minute?.length);
            minute.forEach(targetEventKey => {
                if (eventKey !== targetEventKey) {
                    findNode.neighbours[targetEventKey] = nodeMap[targetEventKey];
                }
            });
        });
    });
    return { clusters, nodes: nodeMap };
}
// Function which prepare initial structure and add events key per every minute where this event exist
export function prepareTimetable(items, startProperty, endProperty, itemMinHeightInMinutes, day) {
    const minutes = [];
    // Creating array of minutes where length should be 1440 minutes (24hours)
    for (let minute = 1; minute < TotalMinutesInDay; minute++) {
        minutes[minute] = [];
    }
    // Preparing events to clusterize, adding (key, start, end) properties
    let preparedEvents = [];
    items?.forEach((item, index) => {
        if (typeof item !== "object" || item === null) {
            __DEV__ && console.warn(`Invalid item of type [${typeof item}] supplied to Timeline, expected [object]`);
            return;
        }
        const start = item[startProperty];
        const end = item[endProperty];
        for (const { name, value } of [
            { name: 'start', value: start },
            { name: 'end', value: end },
        ]) {
            if (!value || (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'object')) {
                __DEV__ && console.warn(`Invalid ${name} date of item ${item}, expected ISO string, UNIX timestamp or Date object, got [${value}]`);
                return;
            }
        }
        let originalStart = new Date(start);
        let originalEnd = new Date(end);
        let countedStartMinutes = day.start > originalStart ? 0 : getDayMinutes(originalStart);
        let endMinutes = day.end < originalEnd ? TotalMinutesInDay : getDayMinutes(originalEnd);
        let countedEndMinutes = Math.max(endMinutes, countedStartMinutes + itemMinHeightInMinutes);
        // Creating new object without reference to avoid direct state change
        const clonedObj = {
            ...item,
            key: '' + index + item[startProperty] + item[endProperty],
            start: countedStartMinutes,
            end: countedEndMinutes,
        };
        // Adding events to minutes array
        for (let eventMinute = countedStartMinutes; eventMinute <= countedEndMinutes; eventMinute++) {
            minutes?.[eventMinute]?.push(clonedObj.key);
        }
        preparedEvents.push(clonedObj);
    });
    return {
        preparedEvents,
        minutes
    };
}
export function setClusterWidth(timetable, columnWidth) {
    timetable.clusters.forEach(cluster => {
        let maxGroupSize = 1;
        let neighboursCount = 0;
        for (let nodeId in cluster.nodes) {
            maxGroupSize = Math.max(maxGroupSize, cluster.nodes[nodeId].biggestGroupSize);
            neighboursCount = Object.keys(cluster.nodes[nodeId].neighbours).length;
        }
        const clusterWidth = columnWidth / maxGroupSize;
        cluster.maxGroupSize = maxGroupSize;
        cluster.width = clusterWidth;
    });
}
export function setNodesPosition(timetable) {
    timetable.clusters.forEach(cluster => {
        for (let nodeId in cluster.nodes) {
            let node = cluster.nodes[nodeId];
            if (!node.cluster)
                return;
            let positionArray = new Array(node.cluster.maxGroupSize);
            for (let neighborId in node.neighbours) {
                let neighbour = node.neighbours[neighborId];
                if (neighbour.position !== null) {
                    positionArray[neighbour.position] = true;
                }
            }
            for (let i = 0; i < positionArray.length; i++) {
                if (!positionArray[i]) {
                    node.position = i;
                    node.isLast = i === positionArray?.length - 1;
                    break;
                }
            }
        }
    });
}
//# sourceMappingURL=eventsPreparer.js.map