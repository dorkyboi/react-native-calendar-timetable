import {ReactNode} from "react";
import {Animated, ScrollViewProps, StyleProp, TextStyle, ViewStyle} from "react-native";

export interface CardProps<I = any> {
    key: string,
    item: I,
    daysTotal: number,
    style: {
        position: 'absolute',
        zIndex: 2,
        top: number,
        left: number,
        height: number,
        width: number,
    },
}

export interface Day {
    date: Date,
    start: Date,
    end: Date,
}

export interface HeadersProps {
    columnDays: Day[],
    columnWidth: number,
    linesTopOffset: number,
    linesLeftOffset: number,
    renderHeader?: boolean | ((day: Day) => ReactNode),
    headersContainer?: StyleProp<ViewStyle>,
    headerContainerStyle?: StyleProp<ViewStyle>,
    headerTextStyle?: StyleProp<TextStyle>,
}

export interface NowLineProps {
    style?: {
        // Styles of the circle of the 'current time' line
        dot?: StyleProp<any>,
        // Styles of the line of the 'current time' line
        line?: StyleProp<any>,
    },
    left: number,
    width: number,
    calculateTopOffset: (date: number) => number;
}

export interface HoursProps {
    offsetX?: Animated.Value,
    columnDays: Day[],
    columnWidth: number,
    linesTopOffset: number,
    linesLeftOffset: number,
    fromHour: number,
    toHour: number,
    hourHeight: number,
    timeWidth: number,
    is12Hour?: boolean,
    timeStyle?: TextStyle,
    timeContainerStyle?: StyleProp<ViewStyle>,
    linesStyle?: StyleProp<ViewStyle>,
    renderHour?: (hour: number) => ReactNode,
}

type Values = {
    // Shortcut for 'range' prop, equals to {from: date, till: date}
    date: Date,
    range?: never,
} | {
    // Range of dates to display, each day in separate column
    range: { from: Date, till: Date },
    date?: never,
};

export type TimetableProps<I = any> = Values & {
    // Array of items to render
    items: I[],
    // Function used to render cards
    renderItem: (props: CardProps) => ReactNode,

    // Styling
    style?: {
        // Styles of the main container
        container?: StyleProp<ViewStyle>,
        // Styles of the container of column's header
        headerContainer?: HeadersProps["headerContainerStyle"],
        // Styles of the Text of column's header
        headerText?: HeadersProps["headerTextStyle"],
        // Styles of the View that wraps all header containers
        headersContainer?: HeadersProps["headersContainer"],
        // Styles of the container of lines and cards
        contentContainer?: StyleProp<ViewStyle>,
        // Styles of time containers
        timeContainer?: HoursProps["timeContainerStyle"],
        // Styles of time text
        time?: HoursProps["timeStyle"],
        // Styles of Views that render lines
        lines?: HoursProps["linesStyle"],
        // Styles of the 'current time' line
        nowLine?: NowLineProps["style"],
    },

    // Width of whole component
    width?: number,
    // Width of time containers
    timeWidth?: number,
    // item min height in minutes
    itemMinHeightInMinutes?: number,
    // Height of hour row
    hourHeight?: number,
    // Width of day columns
    columnWidth?: number,
    // Height of the container of column's header
    columnHeaderHeight?: number,
    // How far the lines are from top border
    linesTopOffset?: number,
    // How far the lines are moved left from time's right border
    linesLeftInset?: number,
    // Space between column borders and column cards
    columnHorizontalPadding?: number,

    // Enables sticky hours for horizontal scroll
    stickyHours?: boolean,
    // Hiding line, example if you don't want to show line on other days
    hideNowLine?: boolean,
    // Enables snapping to columns on scroll
    enableSnapping?: boolean,
    // Props for horizontal ScrollView
    scrollViewProps?: ScrollViewProps,
    // Determines if headers should be rendered and how. By default, headers are hidden if there's one column and shown otherwise. Pass `false` to hide headers or pass function that renders column header text `({date, start, end}) => {}` where `start` and `end` are start and end of the day (column)
    renderHeader?: HeadersProps["renderHeader"],
    // Function that renders time component for a given hour
    renderHour?: HoursProps["renderHour"],
    // Name of the property that has item's start date
    startProperty?: keyof I,
    // Name of the property that has item's end date
    endProperty?: keyof I,
    // First hour of the timetable
    fromHour?: HoursProps["fromHour"],
    // Last hour of the timetable
    toHour?: HoursProps["toHour"],
    // Option to set time to 12h mode
    is12Hour?: HoursProps["is12Hour"],
}
