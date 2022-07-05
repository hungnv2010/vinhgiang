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

const DatePickerNull = (props) => {
    const {label, date, onChange} = props;
    const [data, setData] = React.useState({show: false, val: getDate(date? date : moment()), isNull: date? false: true});

    React.useEffect(()=>{
        console.log("aaaa data ", data)

    },[])

    const onDateChange = (_event, selectedDate) => {
        let newDate = moment(selectedDate).format("YYYY-MM-DD hh:mm:ss")
        onChange(newDate);
        setData({ show: false, val: getDate(newDate), isNull: false})
    };

    return <View style={Styles.formItem}>
        <Text secondary style={Styles.formLabel}>{label}</Text>
        <TouchableOpacity
            style={Styles.formTextInput}
            onPress={() => setData({...data, show: !data.show})}>
            <Text style={Styles.touchContent}>{data.isNull? "" : data.val.format('YYYY/MM/D')}</Text>
        </TouchableOpacity>
        {data.show && <RNDateTimePicker
            value={data.val.toDate()}
            mode="date"
            display="default"
            onChange={onDateChange}
        />}
    </View>;
};

DatePickerNull.propTypes = {
    label: PropTypes.string,
    date: PropTypes.any,
    onChange: PropTypes.func,
};

export default DatePickerNull;
