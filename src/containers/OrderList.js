import React from 'react';
import {PropTypes} from '../base';
import {Text, TouchableOpacity, View} from 'react-native';
import {Styles} from '../configs';
import {NumberFormat} from '../configs/Utils'
import {OrderListItem} from '../components';
import {STATE} from '../models/OrderModel';

const OrderList = (props) => {
    const {data, onSelect} = props;

    const renderItem = (item, index) => {
        const onPress = () => {
            if (onSelect) {
                onSelect(item);
            }
        };
     
        return (
          <TouchableOpacity onPress={onPress} key={index} 
          style={{ borderRadius: 10, margin: 3, backgroundColor: 'white',
              flexDirection: "column", alignItems: "center", borderBottomColor: "#ddd", borderBottomWidth: 1, paddingVertical: 5, paddingHorizontal: 10 }}>
            <Text style={{...Styles.listItemTitle, alignSelf:'flex-start', fontSize: 16}}>
                {item.name}
            </Text>
            <View style={{ flex: 1, flexDirection: "row", }}>
              <View style={{ flex: 1 }}>
                <OrderListItem
                    type={'date'}
                    dd={'Ngay gửi'}
                    dt={item.date_send}/>
                <OrderListItem
                    type={'date'}
                    dd={'Ngày xác nhận'}
                    dt={item.date_validity}/>
                <OrderListItem
                    type={'date'}
                    dd={'Ngày lên đơn'}
                    dt={item.date_order}/>
                <OrderListItem
                    type={'date'}
                    dd={'Ngày giao dự kiến'}
                    dt={item.ngay_nhan_theo_bao_gia}/>
              </View>
    
              <View style={{ flex: 0.05}}/>
              <View style={{ flex: 0.8 }}>
                <Text/>
                <OrderListItem
                    type={'text'}
                    dd={'Trạng thái'}
                    dt={STATE[item.state]}/>
                  <Text/>
                <OrderListItem
                    dd={'Tổng tiền'}
                    dt={NumberFormat(item.amount_total) + ' đ'}/>
              </View>
            </View>
          </TouchableOpacity>
        )
      }

    return <View style={Styles.screenContainer}>
        {data.map(renderItem)}
    </View>;
};

OrderList.propTypes = {
    data: PropTypes.array,
    onSelect: PropTypes.func,
};

export default OrderList;
