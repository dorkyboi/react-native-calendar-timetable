import { ReactNode } from "react";
import { Animated, ScrollViewProps, StyleProp, TextStyle, ViewStyle } from "react-native";
export interface CardProps<I = any> {
    key: string;
    item: I;
    daysTotal: number;
    style: {
        position: 'absolute';
        zIndex: 2;
        top: number;
        left: number;
        height: number;
        width: number;
    };
}
export interface Day {
    date: Date;
    start: Date;
    end: Date;
}
export interface HeadersProps {
    columnDays: Day[];
    columnWidth: number;
    linesTopOffset: number;
    linesLeftOffset: number;
    renderHeader?: boolean | ((day: Day) => ReactNode);
    headersContainer?: StyleProp<ViewStyle>;
    headerContainerStyle?: StyleProp<ViewStyle>;
    headerTextStyle?: StyleProp<TextStyle>;
}
export interface NowLineProps {
    style?: {
        dot?: StyleProp<any>;
        line?: StyleProp<any>;
    };
    left: number;
    width: number;
    calculateTopOffset: (date: number) => number;
}
export interface HoursProps {
    offsetX?: Animated.Value;
    columnDays: Day[];
    columnWidth: number;
    linesTopOffset: number;
    linesLeftOffset: number;
    fromHour: number;
    toHour: number;
    hourHeight: number;
    timeWidth: number;
    is12Hour?: boolean;
    timeStyle?: TextStyle;
    timeContainerStyle?: StyleProp<ViewStyle>;
    linesStyle?: StyleProp<ViewStyle>;
    renderHour?: (hour: number) => ReactNode;
}
type Values = {
    date: Date;
    range?: never;
} | {
    range: {
        from: Date;
        till: Date;
    };
    date?: never;
};
export type TimetableProps<I = any> = Values & {
    items: I[];
    renderItem: (props: CardProps) => ReactNode;
    style?: {
        container?: StyleProp<ViewStyle>;
        headerContainer?: HeadersProps["headerContainerStyle"];
        headerText?: HeadersProps["headerTextStyle"];
        headersContainer?: HeadersProps["headersContainer"];
        contentContainer?: StyleProp<ViewStyle>;
        timeContainer?: HoursProps["timeContainerStyle"];
        time?: HoursProps["timeStyle"];
        lines?: HoursProps["linesStyle"];
        nowLine?: NowLineProps["style"];
    };
    width?: number;
    timeWidth?: number;
    itemMinHeightInMinutes?: number;
    hourHeight?: number;
    columnWidth?: number;
    columnHeaderHeight?: number;
    linesTopOffset?: number;
    linesLeftInset?: number;
    columnHorizontalPadding?: number;
    stickyHours?: boolean;
    hideNowLine?: boolean;
    enableSnapping?: boolean;
    scrollViewProps?: ScrollViewProps;
    renderHeader?: HeadersProps["renderHeader"];
    renderHour?: HoursProps["renderHour"];
    startProperty?: keyof I;
    endProperty?: keyof I;
    fromHour?: HoursProps["fromHour"];
    toHour?: HoursProps["toHour"];
    is12Hour?: HoursProps["is12Hour"];
};
export {};
//# sourceMappingURL=types.d.ts.map