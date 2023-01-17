import {useEffect, useState} from "react";
import {View} from "react-native";
import {NowLineProps} from "../types";

function NowLine({style, left, width, calculateTopOffset}: NowLineProps) {
    const [now, setNow] = useState(new Date());

    // move 'current time' line every minute
    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const update = () => {
            timeout = setTimeout(() => {
                setNow(new Date());
                update();
            }, 60000);
        };
        update();

        return () => clearTimeout(timeout);
    }, []);

    // validate style props
    if (__DEV__) {
        useEffect(() => {
            const allowedDotStyles = ['width', 'height', 'backgroundColor', 'borderRadius', 'zIndex', 'elevation'];
            for (const key in style?.dot) {
                if (!allowedDotStyles.includes(key))
                    console.warn(`Style [${key}] have no effect in dot styles, only the following will have effect: ${allowedDotStyles.join(', ')}`);
            }

            const allowedLineStyles = ['height', 'backgroundColor', 'zIndex', 'elevation'];
            for (const key in style?.line) {
                if (!allowedLineStyles.includes(key))
                    console.warn(`Style [${key}] have no effect in line styles, only the following will have effect: ${allowedLineStyles.join(', ')}`);
            }
        }, []);
    }

    const size = Math.max(style?.dot?.width || 0, style?.dot?.height || 0) || 7;

    return (
        <View style={{
            top: calculateTopOffset(+now),
            left: left - size / 2 + 0.5,
            width,
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
        }}>
            {/* Dot */}
            <View style={{
                backgroundColor: style?.dot?.backgroundColor || 'black',
                height: size,
                width: size,
                borderRadius: style?.dot?.hasOwnProperty('borderRadius') ? style?.dot?.borderRadius : size * 2,
                zIndex: style?.dot?.hasOwnProperty('zIndex') ? style?.dot?.zIndex : 6,
                elevation: style?.dot?.hasOwnProperty('elevation') ? style?.dot?.elevation : 0,
            }}/>
            {/* Line */}
            <View style={{
                backgroundColor: style?.line?.backgroundColor || 'black',
                zIndex: style?.line?.hasOwnProperty('zIndex') ? style?.line?.zIndex : 6,
                elevation: style?.line?.hasOwnProperty('elevation') ? style?.line?.elevation : 0,
                height: style?.line?.height || 1,
                width: '100%',
            }}/>
        </View>
    );
}

export default NowLine;
