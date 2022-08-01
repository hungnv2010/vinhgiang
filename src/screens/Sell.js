import React, {useCallback, useEffect, useRef, useState} from 'react';
import {RefreshControl, ScrollView, Text, TouchableOpacity, View, FlatList, TextInput} from 'react-native';
import {Colors, Styles} from '../configs';
import Screen from '../containers/Screen';
import {Button, CheckBox} from 'react-native-elements';
import {OrderItem} from '../containers';
import {OrderModel} from '../models';
import {logout, useAuthDispatch} from '../context';
import {Create, Detail} from './index';
import {InvalidAccessToken} from '../errors';
import Pagination from '../components/Pagination';
import messageService from '../services/messages';
import { FAB } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ChangeAlias } from '../configs/Utils';
import FSModal from '../components/FSModal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { INVOICE_STATUS, STATE } from '../models/OrderModel';
import DatePickerNull from '../components/DatePickerNull';
import moment from 'moment';

const Sell = (props) => {
    const {navigation} = props;
    const [data, setData] = useState({
        data: [],
        count: 0,
        limit: 10,
        page: 1,
        total_pages: 6,
    });
    const dispatch = useAuthDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [loadMore, setLoadMore] = useState(false)
    const [filterState, setFilterState] = useState({show: false, state: null, invoice_status: null, startDate: null, endDate: null});

    const listAllData = useRef([])
    const offset = useRef(0)
    const offsetEnd = useRef(false)

    const createOrder = () => {
        navigation.navigate(Create.route, {
            goBack: refresh,
        });
    };

    const onClickItem = (item) => {
        navigation.navigate(Detail.route, {data: item, mode: 'view',  goBack: refresh,});
    }

    const getData = () => {
        OrderModel.GetOrderList(offset.current)
            .then(res => {
                if (res) {
                    console.log("get orderList offset = "+ offset.current , res);
                    if(res.data.length == 0) {
                        offsetEnd.current = true;
                        return;
                    }
                    if(offset.current == 0) {
                        setData(res);
                        listAllData.current = res;
                    } else {
                        console.log("get orderListsss  " , data);

                        let list = [...data.data, ...res.data]
                        console.log("get orderList  " , list);

                        setData({...res, data: list})
                        listAllData.current = {...listAllData.current, data : [...listAllData.current.data, ...res.data]}
                    }
                }
                setRefreshing(false);
            })
            .catch(err => {
                if (InvalidAccessToken.compare(err)) {
                    logout(dispatch).then(() => {
                        const msg = 'Phiên đăng nhập hết hạn!\n' +
                            'Xin hãy đăng nhập lại!';
                        messageService.showError(msg);
                    });
                }
                let msg = 'Lấy danh sách yêu cầu mua hàng thất bại!';
                if (err.message) {
                    msg += '\n' + err.message;
                }
                messageService.showError(msg);
                setRefreshing(false);
            });
    }

    useEffect(() => {
        getData()
    }, [dispatch]);

    const filterMore = () => {
        if(offsetEnd.current) return;
        offset.current += 10;
        getData()
    }

    const getListFilter = () => {
        return listAllData.current.data.filter(item =>
            (!filterState.state || item.state == filterState.state) 
            && (!filterState.invoice_status || item.invoice_status == filterState.invoice_status)
            && (!filterState.startDate || moment(filterState.startDate).subtract(1, "days").isBefore(item.expected_date, 'day'))
            && (!filterState.endDate || moment(filterState.endDate).add(1, "days").isAfter(item.expected_date, 'day'))
        )
    }

    const onChangeTextSearch = (text) => {
        let listSearch = getListFilter().filter(item => 
            (item.name && ChangeAlias(item.name.toLowerCase()).indexOf(ChangeAlias(text)) > -1 )
            || (item.partner_id.name && ChangeAlias(item.partner_id.name.toLowerCase()).indexOf(ChangeAlias(text)) > -1 )
        )
        setData({...data, data: listSearch})
    }

    const refresh = () => {
        setRefreshing(true);
        offsetEnd.current = false;
        offset.current = 0;
        getData()
    };

    const itemFilterState = (state, index) => {
        return <TouchableOpacity key={index.toString()} onPress={() => setFilterState({...filterState, state: state}) } style={Styles.productViewItemModalCategori}>
        <CheckBox
            containerStyle={Styles.productCheckBox}
            center
            checkedColor={Colors.primary}
            checked={filterState.state == state}
            onPress={() => setFilterState({...filterState, state: state})}
        />
        <Text style={Styles.productItemNameCategori} >{state? STATE[state]: 'Tất cả'}</Text>
    </TouchableOpacity>
    }

    const itemFilterInvoiceStatus = (invoice_status, index) => {
        return <TouchableOpacity key={index.toString()} onPress={() => setFilterState({...filterState, invoice_status: invoice_status}) } style={Styles.productViewItemModalCategori}>
        <CheckBox
            containerStyle={Styles.productCheckBox}
            center
            checkedColor={Colors.primary}
            checked={filterState.invoice_status == invoice_status}
            onPress={() => setFilterState({...filterState, invoice_status: invoice_status})}
        />
        <Text style={Styles.productItemNameCategori} >{invoice_status? INVOICE_STATUS[invoice_status]: 'Tất cả'}</Text>
    </TouchableOpacity>
    }

    const renderSelectStatus = () => {
        return <View style={Styles.productViewModalCategori}>
            <MaterialCommunityIcons onPress={() => {
                setFilterState({...filterState, show: false})
                setData({...data, data: getListFilter()})}} 
                style={Styles.productIconCloseModalCategori} name={"close"} color={Colors.gray_aaa} size={26} />
            <Text style={Styles.sectionTitleSmall}>Lọc theo ngày tạo</Text>

            <View>
                <DatePickerNull
                        label={'    Từ ngày:'}
                        date={filterState.startDate}
                        onChange={(value) => {filterState.startDate = value}}/> 
                <DatePickerNull
                        label={'    Đến ngày:'}
                        date={filterState.endDate}
                        onChange={(value) => {filterState.endDate = value}}/> 
            </View>

            <Text style={Styles.sectionTitleSmall}>Lọc trạng thái đơn hàng</Text>

            {
                [ null, 'draft','sent' ,'sale'].map((state, index) => itemFilterState(state, index) )
            }
            
            <Text style={Styles.sectionTitleSmall}>Lọc trạng thái vận chuyển</Text>

            {
                [ null, 'no','to invoice'].map((invoice_status, index) => itemFilterInvoiceStatus(invoice_status, index) )
            }
            <TouchableOpacity onPress={() => {
                setFilterState({...filterState, show: false})
                setData({...data, data: getListFilter()})}} style={[Styles.productViewApply, { marginTop: 25, height: 50 }]}>
                <Text style={Styles.productTextApply}>Xong</Text>
            </TouchableOpacity>
        
        </View>
    }

    return (
        <Screen 
        showLogoutButton={true}
        header={'Bán hàng'}>
            <View style={Styles.productViewFilter}>
                <TouchableOpacity onPress={() => setFilterState({...filterState, show: true})} 
                    style={{...Styles.productViewFilterCategori, borderColor: (filterState.state || filterState.invoice_status) ? Colors.primary : "#aaa"}}>
                    <MaterialCommunityIcons name={"menu"} color={(filterState.state || filterState.invoice_status) ? Colors.primary : "#aaa"} size={20} />
                    <Text style={{...Styles.productTextFilterCategori, color: (filterState.state || filterState.invoice_status) ? Colors.primary : "#aaa"}} >{'Lọc theo'}</Text>
                </TouchableOpacity>
                <View style={Styles.productViewSearch}>
                    <TextInput style={{ flex: 1, textAlign: "center"}}
                        placeholder={"Tìm kiếm mã đơn hàng, khách hàng..."}
                        onChangeText={(text) => onChangeTextSearch(text.toLowerCase())} />
                    <Ionicons name={"search"} color={Colors.gray_aaa} size={20} />
                </View>
            </View>
            
            {!refreshing && data.count > 0 && data.data.length > 0 ?
                <FlatList
                    refreshControl={<RefreshControl
                        refreshing={refreshing}
                        onRefresh={refresh} />}
                    data={data.data}
                    onEndReachedThreshold={0.3}
                    onEndReached={filterMore}
                    renderItem={({ item, index }) => OrderItem(item, index, onClickItem)}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={loadMore ? <ActivityIndicator color={Colors.primary} /> : null}
                    style={Styles.productList}
                />
            : <RefreshControl
                refreshing={refreshing}
                onRefresh={refresh}>
                <TouchableOpacity onPress={createOrder} style={Styles.noOrder}>
                    <Text style={Styles.textNormal}>Chưa có đơn bán hàng nào!</Text>
                    <Text style={Styles.textNormal}>Hãy tạo đơn bán hàng!</Text>
                </TouchableOpacity>
            </RefreshControl>
            }

            <FAB
                onPress={() => createOrder()}
                icon={{ name: 'add', color: 'white' }}
                color={Colors.primary}
                buttonStyle={Styles.customerButonAdd}
                containerStyle={Styles.customerAdd}
            />

            <FSModal visible={filterState.show} children={renderSelectStatus()} />

        </Screen>
    );
};
Sell.route = 'Sell';
export default Sell;
