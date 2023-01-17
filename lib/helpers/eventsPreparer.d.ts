import { Cluster, Node } from "./creators";
import { Day } from "../types";
type Item<T> = T & {
    key: string;
    start: number;
    end: number;
};
interface Timetable<T> {
    clusters: Cluster<T>[];
    nodes: {
        [key: string]: Node<T>;
    };
}
export declare function clusterizer<T>(events: Item<T>[], minutes: string[][]): Timetable<T>;
export declare function prepareTimetable<T>(items: T[], startProperty: keyof T, endProperty: keyof T, itemMinHeightInMinutes: number, day: Day): {
    preparedEvents: Item<T>[];
    minutes: string[][];
};
export declare function setClusterWidth<T>(timetable: Timetable<T>, columnWidth: number): void;
export declare function setNodesPosition<T>(timetable: Timetable<T>): void;
export {};
//# sourceMappingURL=eventsPreparer.d.ts.map