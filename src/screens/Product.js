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
import { ScrollView } from 'react-native-gesture-handler';

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
    const offset = useRef(0)
    const offsetEnd = useRef(false)
    const textSearch = useRef("")

    useEffect(() => {
        getData();
        getProducts();
    }, []);

    const getData = async () => {
        let getProductCategory = await ApiService.getProductCategory()
        // console.log("getProductCategory ", JSON.stringify(getProductCategory));
        setRefreshing(false);
        setListCategori(getProductCategory.data)
    }

    const getProducts = async() => {
        let getProducts = await ApiService.getProducts(offset.current)
        console.log(`getProducts offset: ${offset.current} = `, getProducts);
        if(getProducts.data.length == 0) {
            offsetEnd.current = true;
            return;
        }
        if(offset.current == 0) {
            setListProduct(getProducts.data)
            listAllData.current = getProducts.data;
        } else {
            listAllData.current = [...listAllData.current, ...getProducts.data];
            filterText()
        }
    }

    const onChangeTextSearch = (text) => {
        textSearch.current = text;
        filterText()
    }

    const filterText = () => {
        let listProductFilter = listAllData.current.filter(item => 
                (ChangeAlias(item.name).toLowerCase().indexOf(ChangeAlias(textSearch.current)) > -1) || (item.code && item.code.toLowerCase().indexOf(textSearch.current) > -1) 
                || (item.lst_price  && `${item.lst_price}`.indexOf(textSearch.current) > -1)
            )
        if (listProductFilter.length == 0) filterMore()
        else if (listProductFilter.length < 20) {
            setListProduct(listProductFilter)
            filterMore()
        }
        else setListProduct(listProductFilter)
    }

    const filterMore = () => {
        if(offsetEnd.current) return;
        offset.current += 20;
        getProducts()
    }

    const onClickItem = (item) => {

    }
  
    const refresh = useCallback(() => {
        setRefreshing(true);
        offsetEnd.current = false;
        offset.current = 0;
        getData();
        getProducts()
    });

    const renderProduct = (item, index) => {
        return (
            <TouchableOpacity key={index.toString()} onPress={() => onClickItem(item)}>
                <View style={Styles.viewItemProduct}>
                    <View style={Styles.flexDirection}>
                        <View style={Styles.itemViewIcon}>
                            <MaterialCommunityIcons name={"image"} color={Colors.secondaryLight} size={70} />
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

    const renderCategori = () => {
        return <View style={Styles.productViewModalCategori}>
            <MaterialCommunityIcons onPress={() => { setShowModal(false) }} style={Styles.productIconCloseModalCategori} name={"close"} color={Colors.gray_aaa} size={26} />
            <ScrollView>
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
            </ScrollView>
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
                    <TextInput style={Styles.productInputSearch} onChangeText={(text) => onChangeTextSearch(text.toLowerCase())} />
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
