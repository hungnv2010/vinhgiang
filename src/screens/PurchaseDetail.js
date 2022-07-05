import React, {useEffect, useState} from 'react';
import {Screen} from '../containers';
import {FlatList, Text, View} from 'react-native';
import {Styles, Colors} from '../configs';
import {NumberFormat} from '../configs/Utils'
import {ScrollView} from 'react-native-gesture-handler';
import {OrderListItem, OrderItem} from '../components';
import {loginUser, logout, useAuthDispatch} from '../context';
import Edit from './Edit';

const PurchaseDetail = (props) => {
    const {route, navigation} = props;
    const purchase = route?.params?.data;

    const renderTextItem = (title, text) => {
        return (
        <View style={{...Styles.itemDl, backgroundColor:"white"}}>
            <Text style={{ color: Colors.gray_aaa, marginTop: 4, fontSize: 13 }}>{title} </Text>
            <Text style={{color: Colors.black, marginTop: 4, fontSize: 13 }}>{text}</Text>
        </View>
        )
    }

    const renderProduct = (item, index) => {
        return (
            <View style={{ padding: 2, borderRadius: 0, borderColor: 'silver', borderWidth: 0.5, }}>
                <View style={Styles.flexDirection}>
                    <View style={Styles.itemViewContent}>
                        <Text style={Styles.textSize14}>{item.name}</Text>

                        <View style={{ flex: 1, flexDirection: "row", justifyContent:'space-between'}}>
                            {renderTextItem("Số lượng: ", NumberFormat(item.product_uom_qty))}
                            <View style={{ alignSelf:'baseline' , paddingHorizontal: 4, paddingVertical:2.5, borderRadius: 10, borderColor: 'silver', borderWidth: 0.5, }}>
                                    <Text style={{color: 'silver', fontSize: 13 }}>{item.tax_id?.name ? item.tax_id.name :""}</Text>
                            </View>
                        </View>

                        <View style={{ flex: 1, flexDirection: "row", justifyContent:'space-between'}}>
                            {renderTextItem("Đơn giá: ", NumberFormat(item.price_unit) +"đ/"+ item.product_uom.name)}
                            {renderTextItem("Tổng: ", NumberFormat(item.price_subtotal) + "đ")}
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    const dispatch = useAuthDispatch();

    const editOrder = () => {
        navigation.navigate(Edit.name, {data: order});
    };
    
    return <Screen header={'Đơn mua hàng - ' + purchase.name} goBack={navigation.goBack}>
        <ScrollView 
        keyboardShouldPersistTaps='always' 
        showsVerticalScrollIndicator={false}>
            <View >
                <View style={Styles.screenContent}>
                    <Text style={{...Styles.listItemTitle, alignSelf:'flex-start', fontSize: 16}}>
                        {purchase.name}
                    </Text>
                    <View style={{ width:'100%', paddingVertical: 4, borderColor: "gray", borderTopWidth: 0.5,borderBottomWidth: 0.5, flexDirection:'column' }}>
                        <OrderListItem
                                flexDt ={1}
                                dd={'Nhà cung cấp'}
                                dt={purchase.partner_id[1]}/>
                        
                        <OrderListItem
                            flexDt ={1}
                            type={'date'}
                            dd={'Ngày xác nhận'}
                            dt={purchase.create_date}/>
                        <OrderListItem
                            flexDt ={1}
                            type={'date'}
                            dd={'Ngày nhận'}
                            dt={purchase.date_order}/>
                    </View>

                    <Text style={{ color: Colors.gray4, marginTop: 4, fonSize: 13 }}>Sản phẩm </Text>

                </View>
                <View style={Styles.orderProducts}>
                    {purchase.order_line.length > 0 ?
                        <FlatList
                            data={purchase.order_line}
                            renderItem={({ item, index }) => renderProduct(item, index)}
                            keyExtractor={(item, index) => index.toString()}
                            style={Styles.productList}
                        />
                        : <View style={Styles.productViewNoList}>
                            <Text>Chưa có sản phẩm</Text>
                        </View>
                        }
                </View>

                    <View style={{ flex: 1, flexDirection: "row", justifyContent:"flex-end", paddingVertical:2, }}>
                        <View >
                            <Text style={{ color: Colors.gray4, marginTop: 4, fonSize: 13 }}>Tổng trước thuế: </Text>
                            <Text style={{ color: Colors.gray4, marginTop: 4, fonSize: 13 }}>Thuế: </Text>
                            <Text style={{ color: Colors.gray4, marginTop: 4, fonSize: 13 }}>Tổng sau thuế: </Text>
                        </View>

                        <View style={{ flex: 0.05}}/>
                        <View style={{ alignItems:'flex-end', justifyContent:'center', marginEnd: 10}}>
                            <Text style={{color: Colors.black, marginTop: 4, fontSize: 13 }}>{NumberFormat(purchase.amount_untaxed) + 'đ'}</Text>
                            <Text style={{color: Colors.black, marginTop: 4, fontSize: 13 }}>{NumberFormat(purchase.amount_tax) + 'đ'}</Text>
                            <Text style={{color: Colors.blue, marginTop: 4, fontSize: 13 }}>{NumberFormat(purchase.amount_total) + 'đ'}</Text>
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

PurchaseDetail.route = 'PurchaseDetail';

export default PurchaseDetail;
