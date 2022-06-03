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
import {loginUser, logout, useAuthDispatch} from '../context';
import ProductList from '../containers/ProductList';
import Edit from './Edit';
import {showMessage} from 'react-native-flash-message';
import {STATE} from '../models/OrderModel';

const Detail = (props) => {
    const {route, navigation} = props;
    const order = route?.params?.data;

    const dispatch = useAuthDispatch();

    const editOrder = () => {
        navigation.navigate(Edit.name, {data: order});
    };
    const getInforReceive = (order) => {
        if (!order.infor_receive) return "";
        switch (order.infor_receive) {
            case "khach_lay": return "Khách đến lấy";
        
            default: return "";
        }
    }
    return <Screen header={'Đơn hàng - ' + order.name} goBack={navigation.goBack}>
        <ScrollView 
        keyboardShouldPersistTaps='always' 
        showsVerticalScrollIndicator={false}>
            <View >
                <View style={Styles.screenContent}>
                    <Text style={{...Styles.listItemTitle, alignSelf:'flex-start', fontSize: 16}}>
                        {order.name}
                    </Text>
                    <View style={{ width:'100%', paddingVertical: 4, borderColor: "gray", borderTopWidth: 0.5,borderBottomWidth: 0.5, flexDirection:'column' }}>
                        <OrderListItem
                            flexDt ={1}
                            type={'text'}
                            dd={'Trạng thái'}
                            dt={STATE[order.state]}/>
                        
                        <OrderListItem
                            flexDt ={1}
                            type={'date'}
                            dd={'Ngày xác nhận'}
                            dt={order.create_date}/>
                        <OrderListItem
                            flexDt ={1}
                            type={'date'}
                            dd={'Ngày nhận'}
                            dt={order.date_order}/>
                    </View>

                    <View style={{width:'100%', flexDirection: "column", paddingTop: 4}}>
                        <OrderListItem
                                flexDt ={1}
                                dd={'Nhà cung cấp'}
                                dt={order.partner_id.name}/>
                
                        <OrderListItem
                                flexDt ={1}
                                dd={'Nhân viên'}
                                dt={order.user_id.name}/>
                
                        <OrderListItem
                                flexDt ={1}
                                dd={'Giao đến'}
                                dt={order.warehouse_id.name}/>
                    </View> 

                    <Text style={{ color: Colors.gray4, marginTop: 4, fonSize: 13 }}>Sản phẩm </Text>

                </View>
                    <ProductList
                        hideDeleteButton={true}
                        data={order.order_line}/>

                    <View style={{ flex: 1, flexDirection: "row", justifyContent:"flex-end", paddingVertical:2, }}>
                        <View >
                            <Text style={{ color: Colors.gray4, marginTop: 4, fonSize: 13 }}>Tổng trước thuế: </Text>
                            <Text style={{ color: Colors.gray4, marginTop: 4, fonSize: 13 }}>Thuế: </Text>
                            <Text style={{ color: Colors.gray4, marginTop: 4, fonSize: 13 }}>Tổng sau thuế: </Text>
                        </View>

                        <View style={{ flex: 0.05}}/>
                        <View style={{ alignItems:'flex-end', justifyContent:'center', marginEnd: 10}}>
                            <Text style={{color: Colors.black, marginTop: 4, fontSize: 13 }}>{NumberFormat(order.amount_untaxed) + 'đ'}</Text>
                            <Text style={{color: Colors.black, marginTop: 4, fontSize: 13 }}>{NumberFormat(order.amount_tax) + 'đ'}</Text>
                            <Text style={{color: Colors.blue, marginTop: 4, fontSize: 13 }}>{NumberFormat(order.amount_total) + 'đ'}</Text>
                        </View>
                            
                    </View>
                    

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
