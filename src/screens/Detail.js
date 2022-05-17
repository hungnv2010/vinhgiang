import React, {useEffect, useState} from 'react';
import {Screen} from '../containers';
import {Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import {Styles, Colors} from '../configs';
import {NumberFormat} from '../configs/Utils'
import {ScrollView} from 'react-native-gesture-handler';
import {OrderListItem, OrderItem} from '../components';
import {OrderModel} from '../models';
import {InvalidAccessToken} from '../errors';
import {logout, useAuthDispatch} from '../context';
import ProductList from '../containers/ProductList';
import Edit from './Edit';
import {showMessage} from 'react-native-flash-message';
import {STATE} from '../models/OrderModel';

const Detail = (props) => {
    const {route, navigation} = props;
    const product = route?.params?.data;

    const [order, setOrder] = useState(new OrderModel());
    const dispatch = useAuthDispatch();
    useEffect(() => {
        OrderModel.getDetail(product.name)
            .then(res => {
                console.log("aaaa order" + JSON.stringify(res));
                setOrder(res);
            }).catch(error => {
                if (InvalidAccessToken.compare(error)) {
                    logout(dispatch).catch(e => console.log('log out error', e));
                }
                showMessage({
                    message: `Get order error ${error.message}`,
                    type: 'danger',
                });
            },
        );
    }, [dispatch, product.name]);
    const editOrder = () => {
        navigation.navigate(Edit.name, {data: product});
    };
    const getInforReceive = (order) => {
        if (!order.infor_receive) return "";
        switch (order.infor_receive) {
            case "khach_lay": return "Khách đến lấy";
        
            default: return "";
        }
    }
    return <Screen header={'Yêu cầu mua hàng / ' + product.name} goBack={navigation.goBack}>
        <ScrollView 
        keyboardShouldPersistTaps='always' 
        showsVerticalScrollIndicator={false}>
            <View style={Styles.screenContent}>
                <Text style={{...Styles.listItemTitle, alignSelf:'flex-start', fontSize: 16}}>
                    {order.name}
                </Text>
                <View style={{ width:'100%', borderColor: "gray", borderTopWidth: 0.5,borderBottomWidth: 0.5, flexDirection:'column' }}>
                    <OrderListItem
                        flexDt ={1}
                        type={'date'}
                        dd={'Ngày gửi'}
                        dt={order.date_send}/>
                     <OrderListItem
                        flexDt ={1}
                        type={'date'}
                        dd={'Ngày lên đơn'}
                        dt={order.date_order}/>
                     <OrderListItem
                        flexDt ={1}
                        type={'date'}
                        dd={'Ngày xác nhận'}
                        dt={order.date_validity}/>
                     <OrderListItem
                        flexDt ={1}
                        type={'date'}
                        dd={'Ngày giao dự kiến'}
                        dt={order.ngay_nhan_theo_bao_gia}/>
                </View>
                <OrderListItem
                    flexDt ={1}
                    dd={'Thông tin nhận hàng'}
                    dt={getInforReceive(order)}/>
                <OrderListItem
                    flexDt ={1}
                    type={'text'}
                    dd={'Trạng thái'}
                    dt={STATE[order.state]}/>
                 <OrderListItem
                    flexDt ={1}
                    dd={'Mã đơn hàng'}
                    dt={order.sale_order?.name}/>
            
                <OrderListItem
                    flexDt ={1}
                    dd={'Số điện thoại'}
                    dt={order.mobile}/>
                
                <OrderListItem
                    flexDt ={1}
                    dd={'Ghi chú'}
                    dt={order.note}/>

                <OrderListItem
                     flexDt ={1}
                    dd={'Tổng tiền'}
                    dt={NumberFormat(order.amount_total) + ' đ'}/>
                <Text/>

                <ProductList
                    hideDeleteButton={true}
                    data={order.lines}/>



                {/*{*/}
                {/*    (order.state === 'darft' || order.state === 'draft')*/}
                {/*        ? <Button*/}
                {/*            title={'Sửa đơn hàng'.toUpperCase()}*/}
                {/*            buttonStyle={Styles.button}*/}
                {/*            containerStyle={[Styles.formTouchContent, Styles.buttonContainer]}*/}
                {/*            onPress={editOrder}/>*/}
                {/*        : <>*/}
                {/*            <Button*/}
                {/*                buttonStyle={Styles.button}*/}
                {/*                containerStyle={[Styles.formTouchContent, Styles.buttonContainer]}*/}
                {/*                title={'Sửa đơn hàng'.toUpperCase()}*/}
                {/*                disabled/>*/}
                {/*            <Text style={Styles.alert}>Đơn hàng đã được xử lý</Text>*/}
                {/*        </>*/}
                {/*}*/}

            </View>
        </ScrollView>
    </Screen>;
};

Detail.route = 'Detail';

export default Detail;
