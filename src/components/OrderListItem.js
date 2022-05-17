import React from 'react';
import {PropTypes} from '../base';
import {Text, View} from 'react-native';
import {Styles,Colors} from '../configs';
import moment from 'moment';
import _ from 'lodash';

const OrderListItem = (props) => {
    const {dd, dt, type, flexDt} = props;
    const getVal = () => {
        if (dt === null || dt === undefined) {
            return '';
        }
        if (dt === 0) {
            return '0';
        }
        if (type === 'date' && moment(dt, 'YYYY-MM-D h:mm:ss', false).isValid()) {
            return moment(dt, 'YYYY-MM-D h:mm:ss', false).format('DD/MM/YYYY');
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
    const styleDt = flexDt? {flex: flexDt} : {}
    return <View style={Styles.itemDl}>
        <Text style={{ flex: 1, color: Colors.gray4}}>{dd}: </Text>
        <Text style={{ ...styleDt, textAlignVertical:'center', color: Colors.blue}}>{val}</Text>
    </View>;
};

OrderListItem.propTypes = {
    dd: PropTypes.string,
    dt: PropTypes.any,
    type: PropTypes.oneOf(['text', 'date', 'number']),
    flexDt: PropTypes.number
};

OrderListItem.defaultProps = {
    dd: '',
    dt: '',
    type: 'text',
};

export default OrderListItem;