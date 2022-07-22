import React, {useCallback, useEffect, useRef, useState} from 'react';
import {RefreshControl, ScrollView, Text, TouchableOpacity, View, FlatList, TextInput} from 'react-native';
import {Colors, Styles} from '../configs';
import Screen from '../containers/Screen';
import {Button} from 'react-native-elements';
import {OrderModel} from '../models';
import {logout, useAuthDispatch} from '../context';
import {Create} from './index';
import {InvalidAccessToken} from '../errors';
import Pagination from '../components/Pagination';
import messageService from '../services/messages';
import { FAB } from 'react-native-elements';
import { OrderListItem } from '../components';
import { STATE_PURCHASE } from '../models/OrderModel';
import { ChangeAlias, DurationDate, NumberFormat } from '../configs/Utils';
import PurchaseDetail from './PurchaseDetail';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FSModal from '../components/FSModal';
import { CheckBox } from 'react-native-elements/dist/checkbox/CheckBox';

const Purchase = (props) => {
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
    const listAllData = useRef([])
    const [filterState, setFilterState] = useState({show: false, state: null});

    const createOrder = () => {
        navigation.navigate(Create.route, {
            goBack: refresh,
        });
    };

    const filterMore = () => {

    }

    const onClickItem = (item) => {
        navigation.navigate(PurchaseDetail.route, {data: item, mode: 'view'});
    }

    useEffect(() => {
        setRefreshing(true);
        OrderModel.GetPurchaseList(1)
            .then(res => {
                if (res) {
                    setData(res);
                    console.log("get purchaseList", res);
                    listAllData.current = res;
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
    }, [dispatch]);

    const getListFilter = () => {
        return listAllData.current.data.filter(item =>
            (!filterState.state || item.state == filterState.state)
        )
    }

    const onChangeTextSearch = (text) => {
        let listFilter = getListFilter().data.filter(item => 
                (item.name && ChangeAlias(item.name.toLowerCase()).indexOf(ChangeAlias(text)) > -1 )
                || (item.partner_id && ChangeAlias(item.partner_id[1].toLowerCase()).indexOf(ChangeAlias(text)) > -1 )
            )
        setData({...data, data: listFilter})
    }

    const refresh = useCallback(() => {
        setRefreshing(true);
        OrderModel.GetPurchaseList(1)
            .then(res => {
                setRefreshing(false);
                if (res) {
                    setData(res);
                }
            })
            .catch(err => {
                setRefreshing(false);
                if (InvalidAccessToken.compare(err)) {
                    logout(dispatch).then(() => {
                        logout(dispatch).then(() => {
                            const msg = 'Phiên đăng nhập hết hạn!\n' +
                                'Xin hãy đăng nhập lại!';
                            messageService.showError(msg);
                        });
                    });
                }
                let msg = 'Lấy danh sách mua hàng thất bại!';
                if (err.message) {
                    msg += '\n' + err.message;
                }
                messageService.showError(msg);
                setRefreshing(false);
            });
    }, [dispatch]);

    const renderItem = (item, index, onClickItem) => {
        return (
            <TouchableOpacity onPress={() => onClickItem(item)} key={index} 
            style={{ borderRadius: 10, margin: 3, backgroundColor: 'white',
                flexDirection: "column", alignItems: "center", borderBottomColor: "#ddd", borderBottomWidth: 1, paddingVertical: 5, paddingHorizontal: 10 }}>
                <Text style={{...Styles.listItemTitle, alignSelf:'flex-start', fontSize: 16}}>
                    {item.name}
                </Text>
                <OrderListItem
                        // type={'date'}
                        dd={'Nhà cung cấp'}
                        dt={item.partner_id[1]}/>
                    <OrderListItem
                        //type={'date'}
                        dd={'Đại diện mua hàng'}
                        dt={item.user_id[1]}/>
                <View style={{ flex: 1, flexDirection: "row", }}>
                    <View style={{ flex: 1 }}>
    
                        <OrderListItem
                            dd={'Hạn chốt đặt'}
                            dt={parseInt(DurationDate(item.date_order).asDays()) + " ngày"}/>
                        <OrderListItem
                            type={'text'}
                            dd={'Trạng thái'}
                            dt={STATE_PURCHASE[item.state]}/>
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

        const itemFilterState = (state, index) => {
            return <TouchableOpacity key={index.toString()} onPress={() => setFilterState({...filterState, state: state}) } style={Styles.productViewItemModalCategori}>
            <CheckBox
                containerStyle={Styles.productCheckBox}
                center
                checkedColor={Colors.primary}
                checked={filterState.state == state}
                onPress={() => setFilterState({...filterState, state: state})}
            />
            <Text style={Styles.productItemNameCategori} >{state? STATE_PURCHASE[state]: 'Tất cả'}</Text>
        </TouchableOpacity>
        }

        const renderSelectStatus = () => {
            return <View style={Styles.productViewModalCategori}>
                <MaterialCommunityIcons onPress={() => {
                    setFilterState({...filterState, show: false})
                    setData({...data, data: getListFilter()})}} 
                    style={Styles.productIconCloseModalCategori} name={"close"} color={Colors.gray_aaa} size={26} />
                <Text style={Styles.sectionTitleSmall}>Lọc trạng thái đơn hàng</Text>
    
                {
                    [ null, 'draft','sent' ,'purchase'].map((state, index) => itemFilterState(state, index) )
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
        header={'Mua hàng'}>
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
                    renderItem={({ item, index }) => renderItem(item, index, onClickItem)}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={loadMore ? <ActivityIndicator color={Colors.primary} /> : null}
                    style={Styles.productList}
                />
            : <RefreshControl
                refreshing={refreshing}
                onRefresh={refresh}>
                <TouchableOpacity onPress={createOrder} style={Styles.noOrder}>
                    <Text style={Styles.textNormal}>Chưa có đơn mua hàng nào!</Text>
                    <Text style={Styles.textNormal}>Hãy tạo đơn mua hàng!</Text>
                </TouchableOpacity>
            </RefreshControl>
            }
{/* 
            <FAB
                onPress={() => createOrder()}
                icon={{ name: 'add', color: 'white' }}
                color={Colors.primary}
                buttonStyle={Styles.customerButonAdd}
                containerStyle={Styles.customerAdd}
            /> */}

            <FSModal visible={filterState.show} children={renderSelectStatus()} />
        </Screen>
    );
};
Purchase.route = 'Purchase';
export default Purchase;
