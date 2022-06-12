import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, ScrollView, Text, TouchableOpacity, View, FlatList} from 'react-native';
import {Colors, Styles} from '../configs';
import Screen from '../containers/Screen';
import {Button} from 'react-native-elements';
import {OrderModel} from '../models';
import {logout, useAuthDispatch} from '../context';
import {Create, Detail} from './index';
import {InvalidAccessToken} from '../errors';
import Pagination from '../components/Pagination';
import messageService from '../services/messages';
import { FAB } from 'react-native-elements';
import { OrderListItem } from '../components';
import { STATE } from '../models/OrderModel';
import { DurationDate, NumberFormat } from '../configs/Utils';

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

    const createOrder = () => {
        navigation.navigate(Create.route, {
            goBack: refresh,
        });
    };

    const filterMore = () => {

    }

    const onClickItem = (item) => {
        navigation.navigate(Detail.route, {data: item, mode: 'view'});
    }

    useEffect(() => {
        setRefreshing(true);
        OrderModel.GetPurchaseList(1)
            .then(res => {
                if (res) {
                    setData(res);
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

    return (
        <Screen 
        showLogoutButton={true}
        header={'Mua hàng'}>
            
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

            <FAB
                onPress={() => createOrder()}
                icon={{ name: 'add', color: 'white' }}
                color={Colors.primary}
                buttonStyle={Styles.customerButonAdd}
                containerStyle={Styles.customerAdd}
            />
        </Screen>
    );
};
Purchase.route = 'Purchase';
export default Purchase;
