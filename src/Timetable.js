import React from "react";
import {Text, useWindowDimensions, View, ScrollView} from "react-native";
import NowLine from "./components/NowLine";
import {clusterizer, prepareTimetable, setClusterWidth, setNodesPosition} from "./helpers/eventsPreparer";
import {hours} from "./constants/constants";
import {dateRangesOverlap, daysDiff, minDiff, normalizeTime, validateRange} from "./helpers/date";

const shouldRenderHeaders = (columnsAmount, headersEnabled) => headersEnabled === undefined ? columnsAmount > 1 : headersEnabled;

const renderDefaultHeader = day => {
    const date = day.date.getDate();
    const month = day.date.getMonth();
    return `${date < 9 ? '0' + date : date}.${month < 9 ? '0' + month : month}`;
};

/**
 * Timetable component
 * @param {!Object[]} props.items Array of items to render
 * @param {!Function} props.cardComponent React component used to render cards
 * @param {?Date} props.date Shortcut for 'range' prop, equals to {from: date, till: date}
 * @param {?Date} props.range.from
 * @param {?Date} props.range.till
 *
 * @param {?Object} props.style.container Styles of the main container
 * @param {?Object} props.style.headerContainer Styles of the container of column's header
 * @param {?Object} props.style.headerText Styles of the Text of column's header
 * @param {?Object} props.style.headersContainer Styles of the View that wraps all header containers
 * @param {?Object} props.style.contentContainer Styles of the container of lines and cards
 * @param {?Object} props.style.timeContainer Styles of time containers
 * @param {?Object} props.style.time Styles of time text
 * @param {?Object} props.style.lines Styles of Views that render lines
 * @param {?Object} props.style.nowLine.dot Styles of the circle of the 'current time' line
 * @param {?Object} props.style.nowLine.line Styles of the line of the 'current time' line
 *
 * @param {?Number} props.width Width of whole component
 * @param {?Number} props.timeWidth Width of time containers
 * @param {?Number} props.itemMinHeightInMinutes item min height in minutes
 * @param {?Number} props.hourHeight Height of hour row
 * @param {?Number} props.columnWidth Width of day columns
 * @param {?Number} props.columnHeaderHeight Height of the container of column's header
 * @param {?Number} props.linesTopOffset How far the lines are from top border
 * @param {?Number} props.linesLeftInset How far the lines are moved left from time's right border
 * @param {?Number} props.columnHorizontalPadding Space between column borders and column cards
 *
 * @param {?Boolean} props.hideNowLine Hiding line, example if you don't want to show line on other days
 * @param {?Boolean} props.enableSnapping Enables snapping to columns on scroll
 * @param {?Object} props.scrollViewProps Props for horizontal ScrollView
 * @param {?(Function|Boolean)} props.renderHeader Determines if headers should be rendered and how. By default headers are hidden if there's one column and shown otherwise. Pass `false` to hide headers or pass function that renders column header text `({date, start, end}) => {}` where `start` and `end` are start and end of the day (column)
 * @param {?String} props.startProperty Name of the property that has item's start date
 * @param {?String} props.endProperty Name of the property that has item's end date
 * @param {?Number} props.fromHour First hour of the timetable
 * @param {?Number} props.toHour Last hour of the timetable
 *
 * @returns {JSX.Element}
 */
export default function Timetable(props) {
    __DEV__ && validateRange(props);

    const screenWidth = useWindowDimensions().width;

    const [items, setItems] = React.useState([]);
    const [range, setRange] = React.useState({
        from: normalizeTime(props.date || props.range?.from),
        till: normalizeTime(props.date || props.range?.till, 23, 59, 59, 999),
    });

    const fromHour = props.hasOwnProperty('fromHour') ? props.fromHour : 0;
    const toHour = props.hasOwnProperty('toHour') ? props.toHour : 24;

    const columnDays = React.useMemo(() => {
        const amountOfDays = daysDiff(new Date(range.till), new Date(range.from)) + 1;
        const days = [];

        for (let i = 0; i < amountOfDays; i++) {
            const date = new Date(range.from);
            date.setDate(date.getDate() + i);

            const start = new Date(date);
            start.setHours(fromHour, 0, 0, 0);

            const end = new Date(date);
            end.setHours(toHour - 1, 59, 59, 999);

            days.push({date, start, end});
        }

        return days;
    }, [range.from, range.till, fromHour, toHour]);

    const width = props.hasOwnProperty('width') ? props.width : screenWidth;
    const timeWidth = props.hasOwnProperty('timeWidth') ? props.timeWidth : 50;
    const timeFontSize = props.style?.time?.fontSize || 14;

    const linesTopOffset = props.hasOwnProperty('linesTopOffset') ? props.linesTopOffset : 18;
    const linesLeftInset = props.hasOwnProperty('linesLeftInset') ? props.linesLeftInset : 15;
    const linesLeftOffset = timeWidth - linesLeftInset;

    const hourHeight = props.hasOwnProperty('hourHeight') ? props.hourHeight : 60;
    const minuteHeight = hourHeight / 60;
    const itemMinHeight = Math.max(props?.itemMinHeightInMinutes || 25, 25);

    const columnWidth = props.hasOwnProperty('columnWidth') ? props.columnWidth : width - (timeWidth - linesLeftInset);
    const columnHeaderHeight = props.hasOwnProperty('columnHeaderHeight') ? props.columnHeaderHeight : hourHeight / 2;

    const columnHorizontalPadding = props.hasOwnProperty('columnHorizontalPadding')
        ? props.columnHorizontalPadding
        : 10;

    const startProperty = props.startProperty || 'startDate';
    const endProperty = props.endProperty || 'endDate';

    /* Update range on props change */
    React.useEffect(() => {
        const from = normalizeTime(props.date || props.range?.from);
        const till = normalizeTime(props.date || props.range?.till, 23, 59, 59, 999);

        if (!from || !till)
            return;

        if (+(new Date(from)) === +range.from && +(new Date(till)) === +range.till)
            return;

        setRange({from, till});
    }, [props.date, props.range?.from, props.range?.till]);

    /* Calculate cards */
    React.useEffect(() => {
        if (!Array.isArray(props.items))
            return;

        let positionedEvents = [];

        columnDays.forEach((columnDay, columnIndex) => {
            const normalizedStartDate = new Date(normalizeTime(columnDay?.date));
            const normalizedEndDate =  new Date(normalizeTime(columnDay?.date, 23, 59, 59, 999));

            // Filter event by column date
            const filteredItems = props?.items.filter(item => dateRangesOverlap(normalizedStartDate, normalizedEndDate, new Date(item?.[startProperty]), new Date(item?.[endProperty])));

            // If length === 0 skip process
            if (!filteredItems?.length)
                return;

            const {
                preparedEvents,
                minutes
            } = prepareTimetable(filteredItems, startProperty, endProperty, itemMinHeight, columnDay);
            const clusteredTimetable = clusterizer(preparedEvents, minutes);
            setClusterWidth(clusteredTimetable, columnWidth);
            setNodesPosition(clusteredTimetable);

            for (let nodeId in clusteredTimetable.nodes) {
                let node = clusteredTimetable.nodes[nodeId];
                let data = node?.data;

                const itemStart = new Date(data?.[startProperty]);
                const itemEnd = new Date(data?.[endProperty]);
                const itemMinEnd = new Date(itemStart);
                itemMinEnd.setMinutes(itemStart.getMinutes() + itemMinHeight);
                const daysTotal = daysDiff(itemStart, itemEnd) + 1;
                const neighboursCount = Object.keys(node?.neighbours).length;
                const start = Math.max(+columnDay.start, +itemStart); // card begins either at column's beginning or item's start time, whatever is greater
                const end = Math.min(+columnDay.end + 1, Math.max(+itemEnd, +itemMinEnd)); // card ends either at column's end or item's end time, whatever is lesser
                const countedClusterWidth = node.cluster.width * node.position;

                const height = minDiff(start, end) * minuteHeight;
                const top = calculateTopOffset(start);
                let width = neighboursCount > 0 ? columnIndex > 0
                        ? node.cluster.width - (columnHorizontalPadding)
                        : node.cluster.width
                    : node.cluster.width - (columnHorizontalPadding * 2);
                let left = (linesLeftOffset + columnIndex * columnWidth + columnHorizontalPadding) + countedClusterWidth;

                if (neighboursCount > 0 && node?.isLast) {
                    width = node.cluster.width - (columnHorizontalPadding * 2);
                }

                if (columnIndex === 0) {
                    width = width - linesLeftInset;
                    left = left + linesLeftInset;
                }

                positionedEvents.push({
                    key: columnIndex + node.key,
                    item: node.data,
                    daysTotal,
                    style: {
                        position: 'absolute',
                        zIndex: 3,
                        top,
                        left,
                        height,
                        width
                    },
                });
            }
        });

        setItems(positionedEvents);
    }, [
        props.items,
        columnDays,
        startProperty,
        endProperty,
        columnWidth,
        columnHorizontalPadding,
        linesLeftOffset,
        linesLeftInset,
        minuteHeight,
    ]);

    const calculateTopOffset = date => {
        const d = new Date(date);
        return (Math.max((d.getHours() - fromHour), 0) * 60 + d.getMinutes()) * minuteHeight + linesTopOffset;
    };

    return (
        <ScrollView
            horizontal={true}
            snapToInterval={props.enableSnapping ? columnWidth : null}
            {...props.scrollViewProps}
        >
            <View style={props.style?.container}>
                <View style={[styles.row, props.style?.headersContainer]}>
                    {shouldRenderHeaders(columnDays.length, !!props.renderHeader) && columnDays.map((day, columnIndex) => (
                        <View key={String(columnIndex)} style={{
                            width: columnWidth,
                            height: columnHeaderHeight,
                            top: linesTopOffset,
                            marginLeft: columnIndex === 0 ? linesLeftOffset : undefined,
                            alignItems: 'center',
                            ...props.style?.headerContainer,
                        }}>
                            <Text style={props.style?.headerText}>
                                {(typeof props.renderHeader === 'function' ? props.renderHeader : renderDefaultHeader)(day)}
                            </Text>
                        </View>
                    ))}
                </View>
                <View style={props.style?.contentContainer}>
                    {/* hours */}
                    {hours.map((hour, rowIndex) => {
                        return hour >= fromHour && hour <= toHour && (
                            <View key={rowIndex} style={styles.row}>
                                <View style={{
                                    position: 'absolute',
                                    zIndex: 2,
                                    top: 9,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingHorizontal: 1,
                                    backgroundColor: 'white',
                                    ...props.style?.timeContainer,
                                    width: timeWidth,
                                }}>
                                    <Text style={props.style?.time}>
                                        {(hour > 9 ? '' : '0') + (hour === 24 ? '00' : hour) + ':00'}
                                    </Text>
                                </View>

                                {/* Day columns / hour lines */}
                                {columnDays.map((day, columnIndex) => (
                                    <View key={String(columnIndex)} style={{
                                        width: columnWidth,
                                        height: rowIndex === toHour ? linesTopOffset + timeFontSize / 2 : hourHeight,
                                        top: linesTopOffset,
                                        marginLeft: columnIndex === 0 ? linesLeftOffset : undefined,
                                        borderTopWidth: 1,
                                        borderLeftWidth: rowIndex === toHour ? 0 : 1,
                                        borderRightWidth: columnIndex === columnDays.length - 1 && rowIndex !== toHour ? 1 : 0,
                                        borderColor: 'gray',
                                        ...props.style?.lines,
                                    }}/>
                                ))}
                            </View>
                        );
                    })}

                    {!props.hideNowLine && (
                        <NowLine
                            style={props.style?.nowLine}
                            calculateTopOffset={calculateTopOffset}
                            left={linesLeftOffset}
                            width={columnWidth * columnDays.length}
                        />
                    )}

                    {/* Cards */}
                    {!!props.cardComponent && items.map(item => <props.cardComponent {...item}/>)}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = {
    row: {
        flexDirection: 'row',
    },
};
