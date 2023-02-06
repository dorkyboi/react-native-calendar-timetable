import { Animated, StyleSheet, Text, View } from "react-native";
const HourNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
function Hours({ offsetX, columnDays, columnWidth, linesTopOffset, linesLeftOffset, fromHour, toHour, hourHeight, timeWidth, is12Hour, timeStyle, timeContainerStyle, linesStyle, renderHour, }) {
    const timeFontSize = timeStyle?.fontSize || 14;
    const renderTime = (hour) => {
        if (is12Hour) {
            switch (hour) {
                case 0:
                case 24: return '12 am';
                case 12: return '12 pm';
                default:
                    return (hour > 12 ? (hour - 12 + ' pm') : hour + ' am');
            }
        }
        return (hour > 9 ? '' : '0') + (hour === 24 ? '00' : hour) + ':00';
    };
    return (<View>
            {HourNumbers.map((hour, rowIndex) => hour >= fromHour && hour <= toHour && (<View key={rowIndex} style={styles.row}>
                    <Animated.View style={[
                styles.timeContainer,
                timeContainerStyle,
                { width: timeWidth, left: offsetX },
            ]}>
                        {!!renderHour && renderHour(hour)}
                        {!renderHour && (<Text style={timeStyle}>
                                {renderTime(hour)}
                            </Text>)}
                    </Animated.View>

                    {/* Day columns / hour lines */}
                    {columnDays.map((day, columnIndex) => (<View key={String(columnIndex)} style={[
                    {
                        width: columnWidth,
                        height: rowIndex === toHour ? linesTopOffset + timeFontSize / 2 : hourHeight,
                        top: linesTopOffset,
                        marginLeft: columnIndex === 0 ? linesLeftOffset : undefined,
                        borderTopWidth: 1,
                        borderLeftWidth: rowIndex === toHour ? 0 : 1,
                        borderRightWidth: columnIndex === columnDays.length - 1 && rowIndex !== toHour ? 1 : 0,
                        borderColor: 'gray',
                    },
                    linesStyle,
                ]}/>))}
                </View>))}
        </View>);
}
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    timeContainer: {
        position: 'absolute',
        zIndex: 3,
        top: 9,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 1,
        backgroundColor: 'white',
    },
});
export default Hours;
//# sourceMappingURL=Hours.js.map