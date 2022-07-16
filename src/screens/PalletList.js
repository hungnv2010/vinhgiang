import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Screen } from '../containers';
import { ApiService } from '../services';
import { ActivityIndicator, View, Text, Image, RefreshControl, TextInput, TouchableOpacity, FlatList } from 'react-native';
import {  Colors, Styles } from '../configs';
import OrderListItem from '../components/OrderListItem';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ChangeAlias } from '../configs/Utils';
import FSModal from '../components/FSModal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ScanBarcode from './ScanBarcode';
import messageService from '../services/messages';


const PalletList = (props) => {
    const { navigation, route } = props;
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [pallets, setPallets] = useState([])
    const [loadMore, setLoadMore] = useState(false)
    const itemSelect = useRef({})
    const indexSelect = useRef(0)
    const stockLocations = useRef([])

    const listAllData = useRef([])

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        let getDatas = await  ApiService.getPallet()
        let dataFilter = getDatas.data.filter(data => !data.date_done)
        dataFilter.reverse();
        listAllData.current = dataFilter;

        console.log("getPallet ", dataFilter);
        setPallets(dataFilter)
        setRefreshing(false);
    }

    useEffect(() => {
        ApiService.getStockLocation().then(res => {
            stockLocations.current = res.data?? []
            console.log("getStockLocation ", stockLocations.current);

        }).catch(err => {
            messageService.showError('Không lấy được danh sách địa điểm');
            console.log("importInPicking err ", JSON.stringify(err));
        })
    }, []);

    const onChangeTextSearch = (text) => {
        let listFilter = listAllData.current.filter(item => (item.name && ChangeAlias(item.name).indexOf(ChangeAlias(text)) > -1 ))
        setPallets(listFilter)
    }

    const filterMore = () => {

    }

    const onClickItem = (item, index) => {
        itemSelect.current = item
        indexSelect.current = index

        setShowModal(true)
    }

    const refresh = useCallback(() => {
        setRefreshing(true);
        getData();
    });

    const onClickApply = async (item) => {
        if(!item.location_dest_id) messageService.showError("Cần nhập địa điểm đích")
        itemSelect.current = item

        let body = {
            location_dest_id: item.location_dest_id[0],
            package_ids: [{package_id: item.id}]
        }

        console.log("onClickApply ", body );

        await ApiService.packageTransfer(body).then(res => {

            let result = JSON.parse(res.result)

            let id = result.data[0].id

            let body2 = {
                picking_id : id,
            }

            console.log("confirm ", body2 );

            ApiService.stockPickingConfirm(body2).then(res => {
                setShowModal(false);
                messageService.showSuccess(`Xác nhận thành công`);
            }).catch(err => {
                setShowModal(false);
                messageService.showError(`Có lỗi trong quá trình xử lý \n ${err}`);
                console.log("confirmImportIntPicking err ", err);
            })
        })
        .catch(err => {
            setShowModal(false);
            messageService.showError(`Có lỗi trong quá trình xử lý \n ${err}`);
            console.log("confirmImportIntPicking err ", err);
        })
    
    }

    const onClickOpenScanBarcode = () => {
        setShowModal(false);
        navigation.navigate(ScanBarcode.route, {
            onReturn: (data) =>{
                let find = stockLocations.current.find(stockLocation => stockLocation.barcode == data)
                if(find) {
                    setShowModal(true);
                    itemSelect.current.location_dest_id = [find.id ,find.name]
                    messageService.showInfo(data)
                }
                else  messageService.showError("Không tìm thấy địa điểm " + data)

            }
        });
    }

    const renderContentModal = () => {
        let elm = itemSelect.current

        if (JSON.stringify(itemSelect.current) != "{}")
            return <View style={Styles.productViewModalCategori}>
                <View style={{ width: "100%", flexDirection: "row", justifyContent: 'space-between', alignItems:'center' }}>
                    <Text style={{fontSize: 16}}>{elm.display_name ?? ""}</Text>
                    <MaterialCommunityIcons onPress={() => { setShowModal(false) }} name={"close"} color={Colors.gray_aaa} size={26} />
                </View>
                <View style={{ marginTop: 20 }}>
                    <View style={{ ...Styles.itemDl, backgroundColor: "white", marginVertical: 10 }}>
                        <Text style={{ color: Colors.gray_aaa, fontSize: 15 }}>Từ:   </Text>
                        <Text style={{ color: Colors.black,  fontSize: 15 }}>{elm.location_id ? elm.location_id[1] : ""}</Text>
                    </View>
                  
                    <TouchableOpacity onPress={() => onClickOpenScanBarcode()} style={{ ...Styles.itemDl, backgroundColor: "white", marginTop: 10, marginBottom: 20 }}>
                        <Text style={{ color: Colors.gray_aaa, fontSize: 15, textAlignVertical:'center' }}>Tói:  </Text>
                        <TextInput defaultValue={elm.location_dest_id ? elm.location_dest_id[1] : ""} editable={false} placeholder='Tới' style={{flex:1, height: 45, borderRadius: 5, borderWidth: 1, borderColor: Colors.gray_aaa, color: Colors.black }} />
                    </TouchableOpacity>
                    {/* <TextInput defaultValue={elm.location_dest_id[1] ?? ""} placeholder='Tới' style={{ height: 45, borderRadius: 5, borderWidth: 1, borderColor: Colors.gray_aaa }} /> */}
                </View>
                <TouchableOpacity onPress={() => { onClickApply(elm)}} style={[Styles.productViewApply, { marginTop: 25, height: 50, marginLeft: 0 }]}>
                    <Text style={Styles.productTextApply}>Áp dụng</Text>
                </TouchableOpacity>
            </View>
        else return null;
    }
    
    const renderItem = (item, index) => {
        return (
        <TouchableOpacity onPress={() => onClickItem(item, index)} key={index} 
            style={{ borderRadius: 10, margin: 3, backgroundColor: 'white',
            flexDirection: "column", alignItems: "center", borderBottomColor: "#ddd", borderBottomWidth: 1, paddingVertical: 5, paddingHorizontal: 10 }}>
            <Text style={{...Styles.listItemTitle, alignSelf:'flex-start', fontSize: 16}}>
                {item.display_name}
            </Text>
            <OrderListItem
                // type={'date'}
                dd={'Địa điểm'}
                dt={item.location_id[1] ?? ""}/>
        </TouchableOpacity>
        )
    }

    return (
        <Screen header={"Danh sách pallet"} goBack={navigation.goBack}>
            <View style={Styles.productViewFilter}>
                <View style={Styles.productViewSearch}>
                    <TextInput style={{ flex: 1, textAlign: "center"}}
                        placeholder={"Tìm kiếm ..."}
                        onChangeText={(text) => onChangeTextSearch(text)} />
                    <Ionicons name={"search"} color={Colors.gray_aaa} size={20} />
                </View>
            </View>
            {pallets.length > 0 ?
                <FlatList
                    refreshControl={<RefreshControl
                        refreshing={refreshing}
                        onRefresh={refresh} />}
                    data={pallets}
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
            <FSModal visible={showModal} children={renderContentModal()} />

        </Screen>
    );
};

PalletList.propTypes = {};

PalletList.defaultProps = {};

PalletList.route = 'PalletList';

export default PalletList;
