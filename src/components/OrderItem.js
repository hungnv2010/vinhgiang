import React from 'react';
import {PropTypes} from '../base';
import {Text, View} from 'react-native';
import {Styles} from '../configs';
import moment from 'moment';
import _ from 'lodash';

const OrderItem = (props) => {
    const {dd, dt, type} = props;
    const getVal = () => {
        if (dt === null || dt === undefined) {
            return '';
        }
        if (dt === 0) {
            return '0';
        }
        if (type === 'date' && moment(dt, 'YYYY-MM-D h:mm:ss', false).isValid()) {
            return moment(dt, 'YYYY-MM-D h:mm:ss', false).format('DD-MM-YYYY');
        }
        if (_.isString(dt)) {
            return dt;
        }
        if (!dt) {
            return '';
        }
        return String(dt);
    };
    const val = getVal();
    return <View style={Styles.itemDl}>
        <Text style={Styles.itemDd}>{dd}: </Text>
        <Text style={Styles.itemDt}>{val}</Text>
    </View>;
};

OrderItem.propTypes = {
    dd: PropTypes.string,
    dt: PropTypes.any,
    type: PropTypes.oneOf(['text', 'date', 'number']),
};

OrderItem.defaultProps = {
    dd: '',
    dt: '',
    type: 'text',
};

export default OrderItem;
