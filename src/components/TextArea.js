import React from 'react';
import {PropTypes} from '../base';
import {Input} from 'react-native-elements';
import {Text, View} from 'react-native';
import {Styles} from '../configs';

const TextArea = (props) => {
    const {onChangeText, value, label, required} = props;
    return <View style={Styles.formTextAreaContainer}>
        <Text style={Styles.formTextAreaLabel}>{label + (required ? ' *:' : ':')}</Text>
        <Input
            style={Styles.formTextArea}
            multiline
            onChangeText={onChangeText}
            value={value}/>
    </View>;
};

TextArea.propTypes = {
    label: PropTypes.string,
    value: PropTypes.any,
    onChangeText: PropTypes.func,
    required: PropTypes.bool,
    icon: PropTypes.string,
};

TextArea.defaultProps = {
    required: false,
};

export default TextArea;
