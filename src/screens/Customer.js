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
import messageService from '../services/messages';

const Customer = (props) => {
    const { navigation, route } = props;
    const title = 'Khách hàng';
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [listCustomer, setListCustomer] = useState([])
    const [loadMore, setLoadMore] = useState(false)
    const listAllData = useRef([])

    const offset = useRef(0)
    const offsetEnd = useRef(false)
    const textSearch = useRef("")

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        ApiService.getCustomer(offset.current)
        .then(res => {
            if (res) {
                console.log("getCustomer offset = "+ offset.current , res);
                if(res.data.length == 0) {
                    offsetEnd.current = true;
                    return;
                }
                if(offset.current == 0) {
                    setListCustomer(res.data);
                    listAllData.current = res.data;
                } else {
                    listAllData.current = [...listAllData.current, ...res.data]
                    filterText()
                }
            }
            setRefreshing(false);
        })
        .catch(err => {
            let msg = 'Lấy danh sách khách hàng thất bại!';
            if (err.message) {
                msg += '\n' + err;
            }
            messageService.showError(msg);
            setRefreshing(false);
        });
    }
    const onChangeTextSearch = (text) => {
        textSearch.current = text;
        filterText()
    }

    const filterText = () => {
        let listFilter = listAllData.current.filter(item => 
                (ChangeAlias(item.name).indexOf(ChangeAlias(textSearch.current)) > -1 || (item.phone && item.phone.indexOf(textSearch.current) > -1)
                || (item.name_store && ChangeAlias(item.name_store).indexOf(ChangeAlias(textSearch.current)) > -1)
                || (item.country_id[1] && ChangeAlias(item.country_id[1]).indexOf(ChangeAlias(textSearch.current)) > -1)
                || (item.district && ChangeAlias(item.district[1]).indexOf(ChangeAlias(textSearch.current)) > -1)
                || (item.street && ChangeAlias(item.street).indexOf(ChangeAlias(textSearch.current)) > -1)
                )
            )

        if (listFilter.length == 0) filterMore()
        else if (listFilter.length < 5) {
            setListCustomer(listFilter)
            filterMore()
        }
        else setListCustomer(listFilter)
    }

    const filterMore = () => {
        if(offsetEnd.current) return;
        offset.current += 20;
        getData()
    }

    const onClickItem = (item) => {
        console.log("onClickItem ", JSON.stringify(item));
        navigation.navigate(CustomerDetail.route, item);
    }

    const refresh = useCallback(() => {
        setRefreshing(true);
        offsetEnd.current = false;
        offset.current = 0;
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
                            <MaterialCommunityIcons name={"account"} color={Colors.secondaryLight} size={70} />
                        </View>
                        <View style={{ flexDirection: 'column', justifyContent: 'space-around', flex: 1, padding: 5, marginLeft: 5}}>
                            <Text style={Styles.textSize14}>{item.name}</Text>

                            <View style={{flexDirection:"row", justifyContent: 'space-between'}}>
                                <View style={{flexDirection: 'row', alignItems:'center'}}>
                                    <MaterialCommunityIcons name={ item.email ? "email" : "home"} color={Colors.primaryLight} size={16} />
                                    <Text style={{color: Colors.gray_aaa, fontSize: 12, marginLeft: 2}}>{item.email ? item.email : (item.country_id[1] ? item.country_id[1] : "")}</Text>
                                </View>
                                { item.phone ?
                                    <View style={{flexDirection:"row", justifyContent: 'space-between'}}>
                                        <MaterialCommunityIcons name={"phone"} color={Colors.primaryLight} size={16} />
                                        <Text style={{color: Colors.gray_aaa, fontSize: 12, marginLeft: 2}}>{ item.phone }</Text>
                                    </View>
                                : null
                                }
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <Screen header={title}  showLogoutButton={true}>
            <View style={Styles.productViewFilter}>
                <View style={Styles.productViewSearch}>
                    <TextInput style={{ flex: 1, textAlign: "center"}}
                        placeholder={"Tìm kiếm khách hàng..."}
                        onChangeText={(text) => onChangeTextSearch(text)} />
                    <Ionicons name={"search"} color={Colors.gray_aaa} size={20} />
                </View>
            </View>
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
