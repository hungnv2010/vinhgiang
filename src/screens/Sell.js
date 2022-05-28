import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Styles} from '../configs';
import Screen from '../containers/Screen';
import {Button} from 'react-native-elements';
import {OrderList} from '../containers';
import {OrderModel} from '../models';
import {logout, useAuthDispatch} from '../context';
import {Create, Detail} from './index';
import {InvalidAccessToken} from '../errors';
import Pagination from '../components/Pagination';
import messageService from '../services/messages';
import { ApiService } from '../services';

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
    const createOrder = () => {
        navigation.navigate(Create.route, {
            goBack: refresh,
        });
    };

    const viewOrder = (item) => {
        navigation.navigate(Detail.route, {data: item, mode: 'view'});
    };

    useEffect(() => {
        setRefreshing(true);
        OrderModel.GetOrderList(1)
            .then(res => {
                console.log("aaaa list ", res);
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
        OrderModel.GetOrderList(1)
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
                let msg = 'Lấy danh sách yêu cầu mua hàng thất bại!';
                if (err.message) {
                    msg += '\n' + err.message;
                }
                messageService.showError(msg);
                setRefreshing(false);
            });
    }, [dispatch]);

    const loadPage = (page) => {
        if (page > data.total_pages
            || page < 1) {
            return;
        }
        setRefreshing(true);
        OrderModel.GetOrderList(page)
            .then(res => {
                setRefreshing(false);
                setData(res);
            })
            .catch(err => {
                setRefreshing(false);
                if (InvalidAccessToken.compare(err)) {
                    logout(dispatch).then(e => console.log('logout error', e));
                }
                console.error('get order list error', err);
            });
    };

    if (!refreshing && data.count === 0 && data.data.length === 0) {
        return <Screen
            showLogoutButton={true}
            header={'Yêu cầu mua hàng'}>
            <RefreshControl
                refreshing={refreshing}
                onRefresh={refresh}>
                <TouchableOpacity onPress={createOrder} style={Styles.noOrder}>
                    <Text style={Styles.textNormal}>Chưa có đơn bán hàng nào!</Text>
                    <Text style={Styles.textNormal}>Hãy tạo đơn bán hàng!</Text>
                </TouchableOpacity>
            </RefreshControl>
            <View style={Styles.floatingIcon}>
                <Button
                    buttonStyle={Styles.button}
                    title={'Tạo yêu cầu mua hàng'.toUpperCase()}
                    onPress={createOrder}
                />
            </View>
        </Screen>;
    }

    return (
        <Screen 
        showLogoutButton={true}
        header={'Yêu cầu mua hàng'}>
            <RefreshControl
                refreshing={refreshing}
                onRefresh={refresh}>
                <ScrollView
                    showsVerticalScrollIndicator={false}>
                    <OrderList data={data.data} onSelect={viewOrder}/>
                    {data.total_pages > 1
                        && <Pagination
                            onBack={() => loadPage(data.page - 1)}
                            onNext={() => loadPage(data.page + 1)}
                            currentPage={data.page}
                            totalPage={data.total_pages}/>}
                    <View style={Styles.bottomPadding}/>
                </ScrollView>
            </RefreshControl>
            <View style={Styles.floatingIcon}>
                <Button
                    buttonStyle={Styles.button}
                    title={'Tạo yêu cầu mua hàng'.toUpperCase()}
                    onPress={createOrder}
                />
            </View>
        </Screen>
    );
};
Sell.route = 'Sell';
export default Sell;
