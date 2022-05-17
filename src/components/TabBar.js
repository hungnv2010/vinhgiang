import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const borderRadius = 0;
const styles = StyleSheet.create({
    item: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 46,
    },
    horizontalStartItem: {
        borderTopLeftRadius: borderRadius,
        borderBottomLeftRadius: borderRadius,
    },
    horizontalEndItem: {
        borderTopRightRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
    },
    verticalStartItem: {
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
    },
    verticalEndItem: {
        borderBottomLeftRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
    },
    view: {backgroundColor: 'transparent', borderWidth: 0},
});

const TabOption = (props, tab, index) => {
    const {
        orientation,
        onPress,
        activeColor,
        inActiveColor,
        titleSize,
        selected,
        borderColor,
    } = props;
    const isTabActive = selected === index;
    const textColor = 'white';
    const itemStyle = orientation === 'horizontal'
        ? (index === 0
                ? [styles.horizontalStartItem, {borderWidth: 0}]
                : (index < props.data.length - 1
                        ? [{borderWidth: 0, borderLeftWidth: 0}]
                        : [styles.horizontalEndItem, {borderWidth: 0, borderLeftWidth: 0, marginLeft: -1}]
                )
        )
        : (index === 0
                ? [styles.verticalStartItem, {borderWidth: 1}]
                : (index < props.data.length - 1
                        ? [{borderWidth: 1, borderTopWidth: 0}]
                        : [styles.verticalEndItem, {borderWidth: 1, borderTopWidth: 0, marginTop: -1}]
                )
        );

    return (<TouchableOpacity key={index}
                              onPress={() => onPress(index)}
                              activeOpacity={1}
                              style={[styles.item, {
                                  backgroundColor: (isTabActive ? activeColor : inActiveColor),
                                  borderColor: borderColor,
                              }, ...itemStyle]}>
        <Text style={{color: textColor, fontSize: titleSize}}>{tab}</Text>
    </TouchableOpacity>);
};

const TabBar = (props) => {
    const {verticalHeight, verticalWidth, horizontalHeight, horizontalWidth, data, orientation} = props;

    const style = orientation === 'horizontal'
        ? [{height: horizontalHeight, width: horizontalWidth, flexDirection: 'row'}]
        : [{width: verticalWidth, height: verticalHeight, flexDirection: 'column'}];

    return (
        <View style={[...style, styles.view, props.style]}>
            {data.map((item) => TabOption({
                ...props,
                activeColor: 'red',
                inActiveColor: 'black',
            }, item.name, item.value))}
        </View>
    );
};

export default TabBar;
