import React, {useEffect, useState} from 'react';
import {Screen} from '../containers';
import {FlatList, Text, View, TouchableOpacity} from 'react-native';
import {Styles, Colors} from '../configs';
import {NumberFormat} from '../configs/Utils'
import {ScrollView} from 'react-native-gesture-handler';
import {OrderListItem, OrderItem} from '../components';
import {loginUser, logout, useAuthDispatch} from '../context';

const WareHouseDetail = (props) => {
    const {route, navigation} = props;
    const stockPicking = route?.params;

    const dispatch = useAuthDispatch();

    const renderTextItem = (title, text) => {
        return (
        <View style={{...Styles.itemDl, backgroundColor:"white"}}>
            <Text style={{ color: Colors.gray_aaa, marginTop: 4, fontSize: 13 }}>{title} </Text>
            <Text style={{color: Colors.black, marginTop: 4, fontSize: 13 }}>{text}</Text>
        </View>
        )
    }

    const onClickItem = (item) => {
        console.log("onClickItem ", item);
    }

    const onClickInItem = (item) => {//nhap hang
        console.log("onClickInItem ", item);
    }

    const renderItem = (item, index) => {
        return (
            <TouchableOpacity onPress={() => onClickItem(item)} key={index} 
                    style={{ padding: 2, borderRadius: 0, borderColor: 'silver', borderWidth: 0.5, }}>
                <View style={Styles.flexDirection}>
                    <View style={Styles.itemViewContent}>
                        <Text style={Styles.textSize14}>{item.product_id[1]??""}</Text>

                        <View style={{ flex: 1, flexDirection: "row", justifyContent:'space-between'}}>
                            {renderTextItem("Hoàn thành: ", NumberFormat(item.product_uom_qty) +"/"+ NumberFormat(item.qty_done))}
                            {renderTextItem("Số lô/sê-ri: ", item.lot_id[1]??"")}
                        </View>

                        <View style={{ flex: 1, flexDirection: "row", justifyContent:'space-between'}}>
                            {renderTextItem("Gói nguồn: ", item.result_package_id[1]??"")}
                            {renderTextItem("Tới: ", item.location_id[1]??"")}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const renderInItem = (item, index) => {
        return (
            <TouchableOpacity onPress={() => onClickInItem(item)} key={index} 
                    style={{ padding: 2, borderRadius: 0, borderColor: 'silver', borderWidth: 0.5, }}>
                <View style={Styles.flexDirection}>
                    <View style={Styles.itemViewContent}>
                        <Text style={Styles.textSize14}>{item.product_id[1]??""}</Text>

                        <View style={{ flex: 1, flexDirection: "row", justifyContent:'space-between'}}>
                            {renderTextItem("Hoàn thành: ",  NumberFormat(item.product_uom_qty) +"/"+ NumberFormat(item.qty_done) )}
                            {renderTextItem("Số lô/sê-ri: ", item.lot_id[1]??"")}
                        </View>

                        <View style={{ flex: 1, flexDirection: "row", justifyContent:'space-between'}}>
                            {renderTextItem("Gói nguồn: ", item.result_package_id[1]??"")}
                            {renderTextItem("Tới: ", item.location_id[1]??"")}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    
    return <Screen header={'Chi tiết - ' + stockPicking?.name??""} goBack={navigation.goBack}>
        <ScrollView 
        keyboardShouldPersistTaps='always' 
        showsVerticalScrollIndicator={false}>
            <View >
                <View style={Styles.screenContent}>
                    <Text style={{...Styles.listItemTitle, alignSelf:'flex-start', fontSize: 16}}>
                        {stockPicking.name??""}
                    </Text>
                    <View style={{ width:'100%', paddingVertical: 4, borderColor: "gray", borderTopWidth: 0.5,borderBottomWidth: 0.5, flexDirection:'column' }}>
                        <OrderListItem
                            flexDt ={1}
                            type={'text'}
                            dd={'Tài liệu gốc'}
                            dt={stockPicking.origin}/>
                        
                        <OrderListItem
                            flexDt ={1}
                            type={'date'}
                            dd={'Ngày dự kiến'}
                            dt={stockPicking.scheduled_date}/>
                        <OrderListItem
                            flexDt ={1}
                            type={'date'}
                            dd={'Hạn chót'}
                            dt={stockPicking.date_deadline}/>
                    </View>

                    <View style={{width:'100%', flexDirection: "column", paddingTop: 4}}>
                        <OrderListItem
                                flexDt ={1}
                                dd={'Địa điểm nguồn'}
                                dt={stockPicking.location_dest_id[1]??""}/>
                
                        <OrderListItem
                                flexDt ={1}
                                dd={'Địa điểm đích'}
                                dt={stockPicking.user_id.name}/>
                
                        <OrderListItem
                                flexDt ={1}
                                dd={'Giao đến'}
                                dt={stockPicking.move_line_ids_without_package[0]?.location_id[1]??""}/>
                    </View> 

                    <Text style={{ color: Colors.gray4, marginTop: 4, fonSize: 13 }}>Hoạt động chi tiết </Text>

                </View>
                <View style={Styles.orderProducts}>
                    {stockPicking.move_line_ids_without_package && stockPicking.move_line_ids_without_package.length > 0 ?
                            <FlatList
                                data={stockPicking.move_line_ids_without_package??[]}
                                renderItem={({ item, index }) => stockPicking.name.includes("IN/")? 
                                                            renderInItem(item, index) : renderItem(item, index)}
                                keyExtractor={(item, index) => index.toString()}
                                style={Styles.productList}
                            />
                            : <View style={Styles.productViewNoList}>
                                <Text>Chưa có hoạt động</Text>
                            </View>
                        }
                </View>
                <View style={{ flex: 1, flexDirection: "row", justifyContent:"flex-end", paddingVertical:2, }}>
                    <Text style={{ color: Colors.gray4, marginTop: 4, fonSize: 13 }}>Tổng: </Text>
                    <View style={{ flex: 0.05}}/>
                    <Text style={{color: Colors.black, marginTop: 4, fontSize: 13, alignItems:'flex-end', 
                        justifyContent:'center', marginEnd: 10 }}>0</Text>
                        
                </View>

            </View>
        </ScrollView>
    </Screen>;
};

WareHouseDetail.route = 'WareHouseDetail';

export default WareHouseDetail;
