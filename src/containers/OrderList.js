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
            <OrderListItem
                    // type={'date'}
                    dd={'Khách hàng'}
                    dt={item.partner_id[1]}/>
                <OrderListItem
                    //type={'date'}
                    dd={'Nhân viên'}
                    dt={item.user_id[1]}/>
            <View style={{ flex: 1, flexDirection: "row", }}>
              <View style={{ flex: 1 }}>

                <OrderListItem
                    type={'date'}
                    dd={'Ngày tạo'}
                    dt={item.expected_date}/>
                <OrderListItem
                    type={'text'}
                    dd={'Trạng thái'}
                    dt={STATE[item.state]}/>
              </View>
    
              <View style={{ flex: 0.05}}/>
              <View style={{ flex: 0.8 }}>
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
