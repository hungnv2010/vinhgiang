import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Screen } from '../containers';
import { ApiService } from '../services';
import { ActivityIndicator, View, Text, Image, RefreshControl, TextInput, TouchableOpacity, FlatList } from 'react-native';
import {  Colors, Styles } from '../configs';
import { FAB } from 'react-native-elements';
import OrderListItem from '../components/OrderListItem';
import WareHouseDetail from './WareHouseDetail';
import WareHouseDetailInt from './WareHouseDetailInt';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ChangeAlias } from '../configs/Utils';


const WareHouseList = (props) => {
    const { navigation, route } = props;
    const title = route?.params?.display_name;
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [stockPickings, setStockPickings] = useState([])
    const [loadMore, setLoadMore] = useState(false)
    const listAllData = useRef([])

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        let getDatas = await ApiService.getStockPicking(route?.params?.id)
        let dataFilter = getDatas.data.filter(data => !data.date_done)
        listAllData.current = dataFilter;

        console.log("WareHouseList ", dataFilter);
        setStockPickings(dataFilter)
        setRefreshing(false);
    }

    const onChangeTextSearch = (text) => {
        let listFilter = listAllData.current.filter(item => (item.name && ChangeAlias(item.name).indexOf(ChangeAlias(text)) > -1 ))
        setStockPickings(listFilter)
    }

    const filterMore = () => {

    }

    const onClickItem = (item) => {
        console.log("onClickItem ", item);

        if (item.name.includes("IN/")) navigation.navigate(WareHouseDetail.route, item);
        else if (item.name.includes("INT/")) navigation.navigate(WareHouseDetailInt.route, item);
    }

    const refresh = useCallback(() => {
        setRefreshing(true);
        getData();
    });

    const onClickAddItem = () => {
        //navigation.navigate(AAAA.route, {});
    }

    const renderItem = (item, index) => {
        return (
        <TouchableOpacity onPress={() => onClickItem(item)} key={index} 
            style={{ borderRadius: 10, margin: 3, backgroundColor: 'white',
            flexDirection: "column", alignItems: "center", borderBottomColor: "#ddd", borderBottomWidth: 1, paddingVertical: 5, paddingHorizontal: 10 }}>
            <Text style={{...Styles.listItemTitle, alignSelf:'flex-start', fontSize: 16}}>
                {item.name}
            </Text>
            <OrderListItem
                // type={'date'}
                dd={'Liên hệ'}
                dt={item.partner_id[1] ?? ""}/>
            <OrderListItem
                dd={'Đến'}
                dt={item.location_dest_id[1]}/>
            <View style={{ flex: 1, flexDirection: "row", }}>
                <View style={{ flex: 1 }}>

                    <OrderListItem
                        type={'date'}
                        dd={'Ngày dự kiến'}
                        dt={item.scheduled_date??""}/>
                    <OrderListItem
                        type={'text'}
                        dd={'Hoàn thành'}
                        dt={!item.date_done? 'chưa' : 'đã hoàn thành'}/>
                </View>

                <View style={{ flex: 0.05}}/>
                <View style={{ flex: 0.8 }}>
                    <Text/>
                    <OrderListItem
                        dd={'Mã gốc'}
                        dt={item.origin??""}/>
                </View>
            </View>
        </TouchableOpacity>
        )
    }

    return (
        <Screen header={title} goBack={navigation.goBack}>
            <View style={Styles.productViewFilter}>
                <View style={Styles.productViewSearch}>
                    <TextInput style={{ flex: 1, textAlign: "center"}}
                        placeholder={"Tìm kiếm ..."}
                        onChangeText={(text) => onChangeTextSearch(text)} />
                    <Ionicons name={"search"} color={Colors.gray_aaa} size={20} />
                </View>
            </View>
            {stockPickings.length > 0 ?
                <FlatList
                    refreshControl={<RefreshControl
                        refreshing={refreshing}
                        onRefresh={refresh} />}
                    data={stockPickings}
                    onEndReachedThreshold={0.3}
                    onEndReached={filterMore}
                    renderItem={({ item, index }) => renderItem(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={loadMore ? <ActivityIndicator color={Colors.primary} /> : null}
                    style={Styles.productList}
                />
                : <View style={Styles.productViewNoList}>
                    <Text>Chưa có dữ liệu</Text>
                </View>
            }
            {/* <FAB
                onPress={() => onClickAddItem()}
                icon={{ name: 'add', color: 'white' }}
                color={Colors.primary}
                buttonStyle={Styles.customerButonAdd}
                containerStyle={Styles.customerAdd}
            /> */}
        </Screen>
    );
};

WareHouseList.propTypes = {};

WareHouseList.defaultProps = {};

WareHouseList.route = 'WareHouseList';

export default WareHouseList;
