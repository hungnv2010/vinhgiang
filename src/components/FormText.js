import React from 'react';
import {PropTypes} from '../base';
import {Text, View} from 'react-native';
import {Styles} from '../configs';

const FormText = (props) => {
    const {value, label, required, keyboardType} = props;
    return <View style={Styles.formItem}>
        <Text style={Styles.formLabel}>
            {label + (required ? ' *' : '')}
        </Text>
        <Text
            style={Styles.formInput}>{value}</Text>
    </View>;
};

FormText.propTypes = {
    label: PropTypes.func,
    value: PropTypes.any,
    required: PropTypes.bool,
    icon: PropTypes.string,
    keyboardType: PropTypes.oneOf(['default', 'numeric', 'url', 'email-address']),
};

FormText.defaultProps = {
    required: false,
    label: '',
    keyboardType: 'default',
    value: 0,
};

export default FormText;
