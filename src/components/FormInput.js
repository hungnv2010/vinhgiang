import React from 'react';
import {PropTypes} from '../base';
import {Text, TextInput, View} from 'react-native';
import {Styles} from '../configs';

const FormInput = (props) => {
    const {onChangeText, value, label, required, icon, keyboardType} = props;
    return <View style={Styles.formItem}>
        <Text style={Styles.formLabel}>
            {label + (required ? ' *' : '')}
        </Text>
        <TextInput
            keyboardType={keyboardType}
            style={Styles.formInput}
            leftIcon={icon}
            onChangeText={onChangeText}
            value={value}/>
    </View>;
};

FormInput.propTypes = {
    label: PropTypes.func,
    value: PropTypes.any,
    onChangeText: PropTypes.func,
    required: PropTypes.bool,
    icon: PropTypes.string,
    keyboardType: PropTypes.oneOf(['default', 'numeric', 'url', 'email-address']),
};

FormInput.defaultProps = {
    required: false,
    label: '',
    keyboardType: 'default',
    value: 0,
};

export default FormInput;
