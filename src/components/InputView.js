import React from 'react';
import {View} from 'react-native';
import {Styles} from '../configs';
import PropTypes from 'prop-types';
import {Text} from 'react-native-elements';

const InputView = (props) => {
    const {label, value} = props;

    return <View style={Styles.formItem}>
        <Text style={Styles.formLabel}>
            {label}
        </Text>
        <View style={Styles.formTextView}>
            <Text style={Styles.formSelectInput}>{value}</Text>
        </View>
    </View>;
};

InputView.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
};

export default InputView;
