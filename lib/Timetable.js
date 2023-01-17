import React, { useMemo, useRef } from "react";
import { useWindowDimensions, View, Animated } from "react-native";
import NowLine from "./components/NowLine";
import { clusterizer, prepareTimetable, setClusterWidth, setNodesPosition } from "./helpers/eventsPreparer";
import { dateRangesOverlap, daysDiff, minDiff, normalizeTime } from "./helpers/date";
import Headers from "./components/Headers";
import Hours from "./components/Hours";
function withDefault(value, defaultValue) {
    return typeof value === "undefined" ? defaultValue : value;
}
function Timetable({ items, renderItem, date, range: rangeProp, fromHour = 0, toHour = 24, style, width, timeWidth = 50, itemMinHeightInMinutes = 25, hourHeight = 60, linesTopOffset = 18, linesLeftInset = 15, columnHorizontalPadding = 10, stickyHours, renderHeader, renderHour, startProperty = 'startDate', endProperty = 'endDate', ...props }) {
    const screenWidth = useWindowDimensions().width;
    const range = {
        from: normalizeTime(date || rangeProp?.from),
        till: normalizeTime(date || rangeProp?.till, 23, 59, 59, 999),
    };
    const columnDays = React.useMemo(() => {
        const amountOfDays = daysDiff(range.till, range.from) + 1;
        const days = [];
        for (let i = 0; i < amountOfDays; i++) {
            const date = new Date(range.from);
            date.setDate(date.getDate() + i);
            const start = new Date(date);
            start.setHours(fromHour, 0, 0, 0);
            const end = new Date(date);
            end.setHours(toHour - 1, 59, 59, 999);
            days.push({ date, start, end });
        }
        return days;
    }, [range.from, range.till, fromHour, toHour]);
    const scrollX = useRef(new Animated.Value(0)).current;
    const linesLeftOffset = timeWidth - linesLeftInset;
    const minuteHeight = hourHeight / 60;
    const columnWidth = withDefault(props.columnWidth, (width || screenWidth) - (timeWidth - linesLeftInset));
    const calculateTopOffset = (date) => {
        const d = new Date(date);
        return (Math.max((d.getHours() - fromHour), 0) * 60 + d.getMinutes()) * minuteHeight + linesTopOffset;
    };
    const cards = useMemo(() => {
        if (!Array.isArray(items))
            return [];
        const positionedEvents = [];
        const itemMinHeight = Math.max(itemMinHeightInMinutes, 25);
        columnDays.forEach((columnDay, columnIndex) => {
            // Filter event by column date
            const filteredItems = items.filter(item => dateRangesOverlap(columnDay.start, columnDay.end, new Date(item[startProperty]), new Date(item[endProperty])));
            // If length === 0 skip process
            if (!filteredItems?.length)
                return;
            const { preparedEvents, minutes } = prepareTimetable(filteredItems, startProperty, endProperty, itemMinHeight, columnDay);
            const clusteredTimetable = clusterizer(preparedEvents, minutes);
            setClusterWidth(clusteredTimetable, columnWidth);
            setNodesPosition(clusteredTimetable);
            for (let nodeId in clusteredTimetable.nodes) {
                let node = clusteredTimetable.nodes[nodeId];
                if (!node.cluster || node.position === null)
                    continue;
                let data = node?.data;
                const itemStart = new Date(data[startProperty]);
                const itemEnd = new Date(data[endProperty]);
                const itemMinEnd = new Date(itemStart);
                itemMinEnd.setMinutes(itemStart.getMinutes() + itemMinHeight);
                const daysTotal = daysDiff(+itemStart, +itemEnd) + 1;
                const neighboursCount = Object.keys(node?.neighbours).length;
                // card begins either at column's beginning or item's start time, whatever is greater
                const start = Math.max(+columnDay.start, +itemStart);
                // card ends either at column's end or item's end time, whatever is lesser
                const end = Math.min(+columnDay.end + 1, Math.max(+itemEnd, +itemMinEnd));
                let width = neighboursCount > 0 ? columnIndex > 0
                    ? node.cluster.width - (columnHorizontalPadding)
                    : node.cluster.width
                    : node.cluster.width - (columnHorizontalPadding * 2);
                let left = (linesLeftOffset + columnIndex * columnWidth + columnHorizontalPadding) + (node.cluster.width * node.position);
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
                        zIndex: 2,
                        top: calculateTopOffset(start),
                        left,
                        height: minDiff(start, end) * minuteHeight,
                        width
                    },
                });
            }
        });
        return positionedEvents;
    }, [
        items,
        columnDays,
        startProperty,
        endProperty,
        columnWidth,
        columnHorizontalPadding,
        linesLeftOffset,
        linesLeftInset,
        minuteHeight,
    ]);
    return (<Animated.ScrollView horizontal={true} snapToInterval={props.enableSnapping ? columnWidth : undefined} onScroll={stickyHours ? Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
        }) : undefined} {...props.scrollViewProps}>
            <View style={style?.container}>
                <Headers headersContainer={style?.headersContainer} columnDays={columnDays} columnWidth={columnWidth} linesTopOffset={linesTopOffset} linesLeftOffset={linesLeftOffset} renderHeader={renderHeader} headerContainerStyle={style?.headerContainer} headerTextStyle={style?.headerText}/>

                <View style={style?.contentContainer}>
                    <Hours offsetX={scrollX} columnDays={columnDays} columnWidth={columnWidth} linesTopOffset={linesTopOffset} linesLeftOffset={linesLeftOffset} fromHour={fromHour} toHour={toHour} hourHeight={hourHeight} timeWidth={timeWidth} timeStyle={style?.time} timeContainerStyle={style?.timeContainer} linesStyle={style?.lines} is12Hour={props?.is12Hour} renderHour={renderHour}/>

                    {!props.hideNowLine && (<NowLine style={style?.nowLine} calculateTopOffset={calculateTopOffset} left={linesLeftOffset} width={columnWidth * columnDays.length}/>)}

                    {/* Cards */}
                    {!!renderItem && cards.map(renderItem)}
                </View>
            </View>
        </Animated.ScrollView>);
}
export default Timetable;
//# sourceMappingURL=Timetable.js.map