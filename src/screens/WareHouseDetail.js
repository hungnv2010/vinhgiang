import React, { useEffect, useRef, useState } from 'react';
import { Screen } from '../containers';
import { FlatList, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { Styles, Colors } from '../configs';
import { NumberFormat } from '../configs/Utils'
import { ScrollView } from 'react-native-gesture-handler';
import { OrderListItem, OrderItem, DatePicker } from '../components';
import { loginUser, logout, useAuthDispatch } from '../context';
import FSModal from '../components/FSModal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScanBarcode } from '.';
import { ApiService } from '../services';
import messageService from '../services/messages';
import DatePickerNull from '../components/DatePickerNull';
import moment from 'moment';

const WareHouseDetail = (props) => {
    const { route, navigation } = props;
    const [stockPicking, setStockPicking] = useState(route?.params);
    const [showModal, setShowModal] = useState(false);
    const pallets = useRef([])
    const itemSelect = useRef({})
    const indexSelect = useRef(0)
    const indexElmSelect = useRef(0)

    const goBack = () => {
        if (route?.params?.goBack) {
            route.params.goBack();
        }
        navigation.goBack();
    };

    const dispatch = useAuthDispatch();

    useEffect(() => {
        ApiService.getPallet().then(res => {
            pallets.current = res.data?? []
        }).catch(err => {
            messageService.showError('Không lấy được danh sách pallet');
            console.log("importInPicking err ", JSON.stringify(err));
        })
    }, []);

    const renderTextItem = (title, text) => {
        return (
            <View style={{ ...Styles.itemDl, backgroundColor: "white" }}>
                <Text style={{ color: Colors.gray_aaa, marginTop: 4, fontSize: 13 }}>{title} </Text>
                <Text style={{ color: Colors.black, marginTop: 4, fontSize: 13 }}>{text}</Text>
            </View>
        )
    }

    const onClickSave = async () => {
        let moveIds = []
        stockPicking.move_ids_without_package.forEach(product => {
          product.move_line_nosuggest_ids.forEach(elm => {
            moveIds.push({
                product_id: product.product_id[0],
                result_package_id: elm.result_package_id[0],
                qty_done: elm.qty_done,
                lot_name: elm.lot_name,
                expiration_date: elm.expiration_date
            })
          })
        });

        let body = {
            picking_id : stockPicking.id,
            move_ids: moveIds,

        }

        console.log("onClickSave ", body );

        await ApiService.importInPicking(body).then(res => {
            console.log("importInPicking", res);
            messageService.showSuccess(`Lưu thành công`);
            // goBack()
        }).catch(err => {
            messageService.showError(`Có lỗi trong quá trình xử lý \n ${err}`);
            console.log("importInPicking err ", JSON.stringify(err));
        })
    }

    const onClickConfirm = async () => {

        let body = {
            picking_id : stockPicking.id,
        }

        console.log("onClickConfirm ", body );

        await ApiService.confirmImportInPicking(body).then(res => {
            messageService.showSuccess(`Xác nhận thành công`);
            goBack()
        }).catch(err => {
            messageService.showError(`Có lỗi trong quá trình xử lý \n ${err}`);
            console.log("confirmImportInPicking err ", err);
        })
    }

    const onClickItem = (item) => {
        console.log("onClickItem ", item);
        itemSelect.current = item;
        setShowModal(true)
    }

    const onClickInItem = (index, item, indexElm) => {//nhap hang
        itemSelect.current = item
        indexSelect.current = index
        indexElmSelect.current = indexElm

        setShowModal(true)
    }

    const onClickNewInItem = (index, item) => {//nhap hang
        itemSelect.current = item
        indexSelect.current = index
        indexElmSelect.current = item.move_line_nosuggest_ids.length

        let newElm = {
            "location_dest_id": stockPicking.location_dest_id,
            "lot_name": "",
            "result_package_id": [ null, ""],
            "qty_done": 0,
            "product_uom_id": [0, ""]
        }

        itemSelect.current.move_line_nosuggest_ids.push(newElm)

        setShowModal(true)
    }

    const onClickApply = (elm) => {
        itemSelect.current.move_line_nosuggest_ids[indexElmSelect.current] = elm

        stockPicking.move_ids_without_package[indexSelect.current] = itemSelect.current
        setStockPicking(stockPicking)
        setShowModal(false)
    }

    const onClickOpenScanBarcode = () => {
        navigation.navigate(ScanBarcode.route, {
            onReturn: (data) =>{
                let find = pallets.current.find(pallet => pallet.name == data)
                if(find) {

                    itemSelect.current.move_line_nosuggest_ids[indexElmSelect.current].result_package_id = [find.id ,find.name]

                    messageService.showInfo(data)
                    setShowModal(false);
                   
                }
                else  messageService.showError("Không tìm thấy pallet " + data)

            }
        });
    }

    const renderContentModal = () => {
        if(!itemSelect.current.move_line_nosuggest_ids) return null
        let elm = itemSelect.current.move_line_nosuggest_ids[indexElmSelect.current]

        if (JSON.stringify(itemSelect.current) != "{}")
            return <View style={Styles.productViewModalCategori}>
                <View style={{ width: "100%", flexDirection: "row", justifyContent: 'space-between', alignItems:'center' }}>
                    <Text style={{fontSize: 16}}>{itemSelect.current.product_id[1] ?? ""}</Text>
                    <MaterialCommunityIcons onPress={() => { setShowModal(false) }} name={"close"} color={Colors.gray_aaa} size={26} />
                </View>
                <View style={{ marginTop: 20 }}>
                    <TextInput defaultValue={`${elm.qty_done}`} placeholder='Số lượng' 
                        keyboardType={'numeric'} style={{ marginBottom: 10, height: 45, borderRadius: 5, borderWidth: 1, borderColor: Colors.gray_aaa }} 
                        onChangeText={(text) => elm.qty_done = text}/>
                    <TextInput defaultValue={elm.lot_name ?? ""} placeholder='Số lô/ seri' 
                        style={{ marginBottom: 10, height: 45, borderRadius: 5, borderWidth: 1, borderColor: Colors.gray_aaa }}
                        onChangeText={(text) => elm.lot_name = text} />
                    <TouchableOpacity onPress={() => onClickOpenScanBarcode()}>
                        <TextInput defaultValue={elm.result_package_id[1] ?? ""} editable={false} placeholder='Gói nguồn' style={{ marginBottom: 10, height: 45, borderRadius: 5, borderWidth: 1, borderColor: Colors.gray_aaa, color: Colors.black }} />
                    </TouchableOpacity>
                    <DatePickerNull
                        label={'Ngày hết hạn'}
                        date = {elm.expiration_date}
                        onChange={(value) => {
                            console.log("het han ", value);
                            elm.expiration_date =  value
                        }}/>                
                    </View>
                <TouchableOpacity onPress={() => { onClickApply(elm)}} style={[Styles.productViewApply, { marginTop: 25, height: 50, marginLeft: 0 }]}>
                    <Text style={Styles.productTextApply}>Áp dụng</Text>
                </TouchableOpacity>
            </View>
        else return null;
    }

    const renderItem = (item, index) => {
        return (
            <TouchableOpacity onPress={() => onClickItem(item)} key={index}
                style={{ padding: 2, borderRadius: 0, borderColor: 'silver', borderWidth: 0.5, }}>
                <View style={Styles.flexDirection}>
                    <View style={Styles.itemViewContent}>
                        <Text style={Styles.textSize14}>{item.product_id[1] ?? ""}</Text>

                        <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between' }}>
                            {renderTextItem("Hoàn thành: ", NumberFormat(item.product_uom_qty) + "/" + NumberFormat(item.qty_done))}
                            {renderTextItem("Số lô/sê-ri: ", item.lot_id[1] ?? "")}
                        </View>

                        <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between' }}>
                            {renderTextItem("Gói nguồn: ", item.result_package_id[1] ?? "")}
                            {renderTextItem("Tới: ", item.location_id[1] ?? "")}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const renderInItem = (item, index) => {
        return (
            <View key={index}
                style={{ paddingVertical: 4, borderColor: Colors.primary, borderTopWidth: 0.5, borderBottomWidth: 0.5 }}>
                <View style={Styles.flexDirection}>
                    <View style={Styles.itemViewContent}>

                        <View style={{ flex: 1, paddingBottom: 8, flexDirection: "row", justifyContent: 'space-between' }}>
                            <Text style={{fontSize: 16}}>{item.product_id[1] ?? ""}</Text>

                            <View style={{  flexDirection: 'row', backgroundColor: "white" }}>
                                <Text style={{ color: Colors.gray_aaa, fontSize: 15 }}>Hoàn thành: </Text>
                                <Text style={{ color: Colors.black, fontSize: 15 }}>{ NumberFormat(item.quantity_done) + "/" + NumberFormat(item.product_uom_qty)}</Text>
                            </View>
                        </View>

                        {
                            item.move_line_nosuggest_ids.length > 0 ?
                             item.move_line_nosuggest_ids.map((elm, indexElm) => {
                                return <TouchableOpacity onPress={() => onClickInItem(index, item, indexElm)} key={index}
                                        style={{ padding: 4, borderRadius: 0, borderColor: 'silver', borderWidth: 0.5, }}>
                                            <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between' }}>
                                        {renderTextItem("Gói đích: ", elm.result_package_id[1] ?? "")}
                                        {renderTextItem("Tới: ", elm.location_dest_id[1] ?? "")}
                                    </View>
            
                                    <View style={{ flex: 1, flexDirection: "row", justifyContent: 'space-between' }}>
                                        {renderTextItem("Số lô/sê-ri: ", elm.lot_name ?? "")}
                                        {renderTextItem("Số lượng: ",  NumberFormat(elm.qty_done) ?? "")}
                                    </View>
                                    {renderTextItem("Ngày hết hạn: ", elm.expiration_date? moment(elm.expiration_date).format("YYYY/MM/D") : "")}
                                </TouchableOpacity>
                                }
                             )
                            : null
                        }

                        <TouchableOpacity onPress={() => onClickNewInItem(index, item)} style={{ padding: 5, flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Colors.primary, borderRadius: 7, height: 40, margin: 10, marginTop: 10, height: 50 }}>
                            <Text style={{color: Colors.primary}}>Thêm Pallet cho {item.product_id[1] ?? "sản phẩm"}</Text>
                        </TouchableOpacity>
                        
                    </View>
                </View>
            </View>
        )
    }


    return <Screen header={'Chi tiết - ' + stockPicking?.name ?? ""} goBack={navigation.goBack}>
        <ScrollView
            keyboardShouldPersistTaps='always'
            showsVerticalScrollIndicator={false}>
            <View >
                <View style={Styles.screenContent}>
                    <Text style={{ ...Styles.listItemTitle, alignSelf: 'flex-start', fontSize: 16 }}>
                        {stockPicking.name ?? ""}
                    </Text>
                    <View style={{ width: '100%', paddingVertical: 4, borderColor: "gray", borderTopWidth: 0.5, borderBottomWidth: 0.5, flexDirection: 'column' }}>
                        <OrderListItem
                            flexDt={1}
                            type={'text'}
                            dd={'Tài liệu gốc'}
                            dt={stockPicking.origin} />

                        <OrderListItem
                            flexDt={1}
                            type={'date'}
                            dd={'Ngày dự kiến'}
                            dt={stockPicking.scheduled_date} />
                        <OrderListItem
                            flexDt={1}
                            type={'date'}
                            dd={'Hạn chót'}
                            dt={stockPicking.date_deadline} />
                    </View>

                    <View style={{ width: '100%', flexDirection: "column", paddingTop: 4 }}>
                        <OrderListItem
                            flexDt={1}
                            dd={'Địa điểm nguồn'}
                            dt={stockPicking.location_dest_id[1] ?? ""} />

                        <OrderListItem
                            flexDt={1}
                            dd={'Địa điểm đích'}
                            dt={stockPicking.user_id.name} />

                        <OrderListItem
                            flexDt={1}
                            dd={'Giao đến'}
                            dt={stockPicking.move_line_ids_without_package[0]?.location_id[1] ?? ""} />
                    </View>

                    <Text style={{ color: Colors.gray4, marginTop: 4, fonSize: 13 }}>Hoạt động chi tiết </Text>

                </View>
                <View style={Styles.orderProducts}>
                    {stockPicking.move_ids_without_package && stockPicking.move_ids_without_package.length > 0 ?
                        <FlatList
                            data={stockPicking.move_ids_without_package ?? []}
                            renderItem={({ item, index }) => stockPicking.name.includes("IN/") ?
                                renderInItem(item, index) : renderItem(item, index)}
                            keyExtractor={(item, index) => index.toString()}
                            style={Styles.productList}
                        />
                        : <View style={Styles.productViewNoList}>
                            <Text>Chưa có hoạt động</Text>
                        </View>
                    }
                </View>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", paddingVertical: 2, }}>
                    <Text style={{ color: Colors.gray4, marginTop: 4, fonSize: 13 }}>Tổng: </Text>
                    <View style={{ flex: 0.05 }} />
                    <Text style={{
                        color: Colors.black, marginTop: 4, fontSize: 13, alignItems: 'flex-end',
                        justifyContent: 'center', marginEnd: 10
                    }}>0</Text>

                </View>

            </View>
        </ScrollView>
        <FSModal visible={showModal} children={renderContentModal()} />

        <View style ={{ flexDirection : "row"}}>

            <TouchableOpacity onPress={() => onClickSave()} style={{ padding: 5, flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.primary, borderRadius: 7, height: 40, margin: 10, marginTop: 10, height: 50 }}>
                <Text style={{color: Colors.white}}>Lưu</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onClickConfirm()} style={{ padding: 5, flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.primary, borderRadius: 7, height: 40, margin: 10, marginTop: 10, height: 50 }}>
                <Text style={{color: Colors.white}}>Xác nhận</Text>
            </TouchableOpacity>
        </View>

    </Screen>;
};

WareHouseDetail.route = 'WareHouseDetail';

export default WareHouseDetail;