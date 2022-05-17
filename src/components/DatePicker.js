import RNDateTimePicker from '@react-native-community/datetimepicker';
import * as React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Styles} from '../configs';
import moment from 'moment';
import _ from 'lodash';
import {PropTypes} from '../base';

const getDate = (date) => {
    if (moment.isMoment(date)) {
        return date;
    }
    if (_.isString(date)) {
        return moment(date);
    }
    return moment();
};

const DatePicker = (props) => {
    const {label, date, onChange} = props;
    const [show, setShow] = React.useState(false);

    const onDateChange = (_event, selectedDate) => {
        onChange(moment(selectedDate));
        setShow(false);
    };
    const val = getDate(date);

    return <View style={Styles.formItem}>
        <Text secondary style={Styles.formLabel}>{label}</Text>
        <TouchableOpacity
            style={Styles.formTextInput}
            onPress={() => setShow(!show)}>
            <Text style={Styles.touchContent}>{val.format('YYYY/MM/D')}</Text>
        </TouchableOpacity>
        {show && <RNDateTimePicker
            value={val.toDate()}
            mode="date"
            display="default"
            onChange={onDateChange}
        />}
    </View>;
};

DatePicker.propTypes = {
    label: PropTypes.string,
    date: PropTypes.any,
    onChange: PropTypes.func,
};

export default DatePicker;
