import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Screen } from '../containers';
import { ApiService } from '../services';
import { ActivityIndicator, View, Text, Image, RefreshControl, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Colors, Styles } from '../configs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FAB } from 'react-native-elements';
import { CustomerDetail } from '.';
import WareHouseList from './WareHouseList';

const WareHouse = (props) => {
    const {navigation, route} = props;
    const product = route?.params?.data;
    const title = 'Kho vận';
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [listCustomer, setListCustomer] = useState([])
    const [loadMore, setLoadMore] = useState(false)

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        let getStockPickingType = await ApiService.getStockPickingType()
        console.log("getStockPickingType ", JSON.stringify(getStockPickingType));
        setListCustomer(getStockPickingType.data)
        setRefreshing(false);
    }

    const filterMore = () => {

    }

    const onClickItem = (item) => {
        console.log("onClickItem ", JSON.stringify(item));
        navigation.navigate(WareHouseList.route, item);
    }

    const refresh = useCallback(() => {
        setRefreshing(true);
        getData();
    });

    const getIcon = (item) => {
        switch(item.name) {
            case "Nhận hàng" : return "archive-arrow-down-outline"
            break;
            case "Điều chuyển pallet" : return "bed-king-outline"
            break;
            case "Điều chuyển nội bộ" : return "call-split"
            break;
            case "Phiếu giao hàng" : return "ballot"
            break;
            case "Manufacturing" : return "cogs"
            break;
            default: return "arrow-right-bold-circle"
        }
    }

    const renderStockPickingType = (item, index) => {
        return (
            <TouchableOpacity style={{ flex: 0.5}} key={index.toString()} onPress={() => onClickItem(item)}>
                <View style={{ minHeight: 120,  flexDirection: 'column', justifyContent: 'space-around', flex: 1,
                    padding: 3, margin: 5, borderRadius: 10, borderColor: 'silver', borderWidth: 0.5, }}>
                        <View style={Styles.itemViewIcon}>
                            <MaterialCommunityIcons name={getIcon(item)} color={Colors.t_cyan} size={50} />
                        </View>
                        <Text style={{ fontSize: 18 , textAlign:'center'}}>{item.name}</Text>
                        <Text style={{ fontSize: 14 , textAlign:'center', color: Colors.primary}}>{item.count_picking_ready} cần xử lý</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <Screen header={title}>
            {listCustomer.length > 0 ?
                <FlatList
                    refreshControl={<RefreshControl
                        refreshing={refreshing}
                        onRefresh={refresh} />}
                    data={listCustomer}
                    numColumns={2}
                    renderItem={({ item, index }) => renderStockPickingType(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={loadMore ? <ActivityIndicator color={Colors.primary} /> : null}
                    style={Styles.productList}
                />
                : <View style={Styles.productViewNoList}>
                    <Text>Không load được dữ liệu</Text>
                </View>
            }
            {/* <FAB
                onPress={() => onClickAddCustomer()}
                icon={{ name: 'add', color: 'white' }}
                color={Colors.primary}
                buttonStyle={Styles.customerButonAdd}
                containerStyle={Styles.customerAdd}
            /> */}
        </Screen>
    );
};

WareHouse.propTypes = {};

WareHouse.defaultProps = {};

WareHouse.route = 'WareHouse';

export default WareHouse;
