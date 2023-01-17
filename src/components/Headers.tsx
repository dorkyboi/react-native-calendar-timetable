import {StyleSheet, Text, View} from "react-native";
import {Day, HeadersProps} from "../types";

const shouldRenderHeaders = (columnsAmount: number, headersEnabled: boolean) => headersEnabled === undefined ? columnsAmount > 1 : headersEnabled;

const renderDefaultHeader = (day: Day) => {
    const date = day.date.getDate();
    const month = day.date.getMonth() + 1;
    return `${date < 9 ? '0' + date : date}.${month < 9 ? '0' + month : month}`;
};

function Headers({
    headersContainer,
    columnDays,
    columnWidth,
    linesTopOffset,
    linesLeftOffset,
    renderHeader,
    headerContainerStyle = {marginVertical: 5},
    headerTextStyle,
}: HeadersProps) {
    return (
        <View style={[styles.row, headersContainer]}>
            {shouldRenderHeaders(columnDays.length, !!renderHeader) && columnDays.map((day, columnIndex) => (
                <View
                    key={String(columnIndex)}
                    style={[
                        {
                            width: columnWidth,
                            // height: withDefault(props.columnHeaderHeight, hourHeight / 2),
                            top: linesTopOffset,
                            marginLeft: columnIndex === 0 ? linesLeftOffset : undefined,
                            alignItems: 'center',
                        },
                        headerContainerStyle,
                    ]}
                >
                    <Text style={headerTextStyle}>
                        {(typeof renderHeader === 'function' ? renderHeader : renderDefaultHeader)(day)}
                    </Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
});

export default Headers;
