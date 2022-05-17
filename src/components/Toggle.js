import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {Styles} from '../configs';
import {Switch, Text} from 'react-native-elements';

const Toggle = (props) => {
    const {isOn, label, onChange} = props;
    return <TouchableOpacity
        onPress={onChange}
        style={Styles.formItem}>
        <Text style={Styles.formLabel}>
            {label}
        </Text>
        <View style={Styles.switchContainer}>
            <Switch value={isOn} onValueChange={onChange}/>
        </View>
    </TouchableOpacity>;
};

Toggle.propTypes = {
    isOn: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func,
};

export default Toggle;
