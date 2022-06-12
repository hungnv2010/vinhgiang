import React, { useCallback, useEffect, useRef, useState } from 'react';
import { OrderForm, Screen } from '../containers';
import { ApiService } from '../services';
import { ActivityIndicator, View, Text, Image, RefreshControl, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Asset, Colors, Styles } from '../configs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import FSModal from '../components/FSModal';
import { Button } from 'react-native-elements/dist/buttons/Button';
import { CheckBox } from 'react-native-elements';
import { ChangeAlias } from '../configs/Utils';
import { FAB } from 'react-native-elements';
import { CustomerDetail } from '.';

const Customer = (props) => {
    const { navigation, route } = props;
    const title = 'Khách hàng';
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [listCustomer, setListCustomer] = useState([])
    const [loadMore, setLoadMore] = useState(false)

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        let getCustomer = await ApiService.getCustomer()
        console.log("getCustomer ", JSON.stringify(getCustomer));
        setListCustomer(getCustomer.data)
        setRefreshing(false);
    }

    const filterMore = () => {

    }

    const onClickItem = (item) => {
        console.log("onClickItem ", JSON.stringify(item));
        navigation.navigate(CustomerDetail.route, item);
    }

    const refresh = useCallback(() => {
        setRefreshing(true);
        getData();
    });

    const onClickAddCustomer = () => {
        navigation.navigate(CustomerDetail.route, {});
    }

    const renderCustomer = (item, index) => {
        return (
            <TouchableOpacity key={index.toString()} onPress={() => onClickItem(item)} >
                <View style={Styles.viewItemProduct}>
                    <View style={Styles.flexDirection}>
                        <View style={Styles.itemViewIcon}>
                            <MaterialCommunityIcons name={"account"} color={Colors.t_cyan} size={70} />
                        </View>
                        <View style={Styles.itemViewContent}>
                            <Text style={Styles.textSize14}>{item.name}</Text>
                            <View style={Styles.flexDirection}>
                                <Text style={Styles.itemProductText}>{item.email ? item.email : (item.country_id[1] ? item.country_id[1] : "")}</Text>
                            </View>
                            <Text style={Styles.itemProductText}></Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <Screen header={title}  showLogoutButton={true}>
            {listCustomer.length > 0 ?
                <FlatList
                    refreshControl={<RefreshControl
                        refreshing={refreshing}
                        onRefresh={refresh} />}
                    data={listCustomer}
                    onEndReachedThreshold={0.3}
                    onEndReached={filterMore}
                    renderItem={({ item, index }) => renderCustomer(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={loadMore ? <ActivityIndicator color={Colors.primary} /> : null}
                    style={Styles.productList}
                />
                : <View style={Styles.productViewNoList}>
                    <Text>Chưa có khách hàng</Text>
                </View>
            }
            <FAB
                onPress={() => onClickAddCustomer()}
                icon={{ name: 'add', color: 'white' }}
                color={Colors.primary}
                buttonStyle={Styles.customerButonAdd}
                containerStyle={Styles.customerAdd}
            />
        </Screen>
    );
};

Customer.propTypes = {};

Customer.defaultProps = {};

Customer.route = 'Customer';

export default Customer;
