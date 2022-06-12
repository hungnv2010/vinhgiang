import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View, Text, Image, RefreshControl, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Asset, Colors, Styles } from '../configs';
import { OrderForm, Screen } from '../containers';
import { useAuthDispatch } from '../context';
import { ApiService } from '../services';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import FSModal from '../components/FSModal';
import { Button } from 'react-native-elements/dist/buttons/Button';
import { CheckBox } from 'react-native-elements';
import { ChangeAlias, NumberFormat } from '../configs/Utils';

const Product = (props) => {
    const { navigation, route } = props;
    const product = route?.params?.data;
    const title = 'Sản phẩm';
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [listProduct, setListProduct] = useState([])
    const [listCategori, setListCategori] = useState([])
    const [textSearchProduct, setTextSearchProduct] = useState("");

    const [loadMore, setLoadMore] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const listAllData = useRef([])

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        let getProductCategory = await ApiService.getProductCategory()
        // console.log("getProductCategory ", JSON.stringify(getProductCategory));
        let getProductAll = await ApiService.getProductAll()
        console.log("getProductAll ", JSON.stringify(getProductAll));
        setRefreshing(false);
        setListProduct(getProductAll.data)
        setListCategori(getProductCategory.data)
        listAllData.current = getProductAll.data;
    }


    const filterMore = () => {

    }

    const onClickItem = (item) => {

    }

    const refresh = useCallback(() => {
        setRefreshing(true);
        getData();
    });

    const renderProduct = (item, index) => {
        return (
            <TouchableOpacity key={index.toString()} onPress={() => onClickItem(item)}>
                <View style={Styles.viewItemProduct}>
                    <View style={Styles.flexDirection}>
                        <View style={Styles.itemViewIcon}>
                            <MaterialCommunityIcons name={"image"} color={Colors.t_cyan} size={70} />
                        </View>
                        <View style={Styles.itemViewContent}>
                            <Text style={Styles.textSize14}>{item.name} [{item.default_code}]</Text>
                            <View style={Styles.flexDirection}>
                                <Text style={Styles.itemProductText}>Giá {NumberFormat(item.lst_price)} đ</Text>
                            </View>
                            <Text style={Styles.itemProductText}>Tồn hiện có {NumberFormat(item.qty_available)} </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const onClickApply = () => {
        setShowModal(!showModal)
        let listProductFilter = []
        listAllData.current.forEach(item => {
            listCategori.map(el => {
                if (el.checkGroup && item.categ_id[0] == el.id) listProductFilter.push(item)
            })
        })
        setListProduct(listProductFilter)
    }

    const onChangeTextSearch = (text) => {
        let listProductFilter = listAllData.current.filter(item => (ChangeAlias(item.name).indexOf(ChangeAlias(text)) > -1))
        setListProduct(listProductFilter)
    }

    const renderCategori = () => {
        return <View style={Styles.productViewModalCategori}>
            <MaterialCommunityIcons onPress={() => { setShowModal(false) }} style={Styles.productIconCloseModalCategori} name={"close"} color={Colors.gray_aaa} size={26} />
            {
                listCategori.length > 0 ?
                    listCategori.map((item, index) => {
                        return <TouchableOpacity key={index.toString()} onPress={() => { item.checkGroup = !item.checkGroup; setListCategori([...listCategori]) }} style={Styles.productViewItemModalCategori}>
                            <CheckBox
                                containerStyle={Styles.productCheckBox}
                                center
                                checkedColor={Colors.primary}
                                checked={item.checkGroup}
                                onPress={() => { item.checkGroup = !item.checkGroup; setListCategori([...listCategori]) }}
                            />
                            <Text style={Styles.productItemNameCategori} >{item.name}</Text>
                        </TouchableOpacity>
                    }
                    )
                    : null
            }
            <TouchableOpacity onPress={() => onClickApply()} style={Styles.productViewApply}>
                <Text style={Styles.productTextApply}>Áp dụng</Text>
            </TouchableOpacity>
        </View>
    }

    return (
        <Screen header={title}  showLogoutButton={true}>
            <View style={Styles.productViewFilter}>
                <TouchableOpacity onPress={() => { setShowModal(!showModal) }} style={Styles.productViewFilterCategori}>
                    <MaterialCommunityIcons name={"menu"} color={Colors.gray_aaa} size={20} />
                    <Text style={Styles.productTextFilterCategori} >Nhóm theo</Text>
                </TouchableOpacity>
                <View style={Styles.productViewSearch}>
                    <TextInput style={Styles.productInputSearch} onChangeText={(text) => onChangeTextSearch(text)} />
                    <Ionicons name={"search"} color={Colors.gray_aaa} size={20} />
                </View>
            </View>

            <FSModal visible={showModal} children={renderCategori()} />

            {listProduct.length > 0 ?
                <FlatList
                    refreshControl={<RefreshControl
                        refreshing={refreshing}
                        onRefresh={refresh} />}
                    data={listProduct}
                    onEndReachedThreshold={0.3}
                    onEndReached={filterMore}
                    renderItem={({ item, index }) => renderProduct(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={loadMore ? <ActivityIndicator color={Colors.primary} /> : null}
                    style={Styles.productList}
                />
                : <View style={Styles.productViewNoList}>
                    <Text>Chưa có sản phẩm</Text>
                </View>
            }
        </Screen>
    );
};

Product.propTypes = {};

Product.defaultProps = {};

Product.route = 'Product';

export default Product;
