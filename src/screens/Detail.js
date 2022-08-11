import React, {useEffect, useRef, useState} from 'react';
import {Screen} from '../containers';
import {Text, TextInput, View} from 'react-native';
import {Button} from 'react-native-elements';
import {Styles, Colors} from '../configs';
import {NumberFormat} from '../configs/Utils'
import {ScrollView} from 'react-native-gesture-handler';
import {OrderListItem, OrderItem} from '../components';
import {OrderModel} from '../models';
import {InvalidAccessToken} from '../errors';
import {loginUser, logout, useAuthDispatch} from '../context';
import ProductList from '../containers/ProductList';
import Edit from './Edit';
import {showMessage} from 'react-native-flash-message';
import {INVOICE_STATUS, STATE} from '../models/OrderModel';
import { ApiService } from '../services';
import { TouchableOpacity } from 'react-native';
import messageService from '../services/messages';
import SelectLoadmore from '../components/SelectLoadmore';
import FSModal from '../components/FSModal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Detail = (props) => {
    const {route, navigation} = props;
    const order = route?.params?.data;

    const [loading, setLoading] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const listDataCoupon = useRef([]);

    if(order.order_line) {
        order.amount_total_with_tax = 0
        order.order_line.forEach(product => {
            if (product.tax_id) {
            let tax = parseInt(product.tax_id.name.replace(/\D/g,''))
            product.subtotal_with_tax = product.price_subtotal * (100 + tax) /100
            order.amount_total_with_tax += product.subtotal_with_tax
            }
        })
    }

    const goBack = () => {
        if (route?.params?.goBack) {
            route.params.goBack();
        }
        navigation.goBack();
    };

    const dispatch = useAuthDispatch();

    useEffect(() => {
        getCoupons()
    }, []);

    const getCoupons = () => {
        setLoading(true);
        ApiService.getCoupons()
            .then(res => {
                console.log('getCoupons', res);
                listDataCoupon.current = res.data;
                setLoading(false);
            })
            .catch(e => {
                console.error('getCoupons error', e);
                setLoading(false);
            })
        ;
    };

    const onOpenSelectCoupon = () => {
        setCoupons([...listDataCoupon.current]);
        
        setShowModal(true);
    }

    const filterSelectCoupon = (filterKey) => {
        setCoupons([...listDataCoupon.current].filter(value => ChangeAlias(value.name).toLowerCase().includes(filterKey)));
    }

    const onClickCoupon = (item) => {
        setLoading(true);
        let body = {
            sale_order_id: order.id,
            promotion_program_id: item.id
        }
        console.log('applyPromotionById start', order, body);
        ApiService.applyPromotionById(body)
            .then(res => {
                console.log('applyPromotionById', res);
                messageService.showSuccess("Thêm chương trình khuyến mại thành công")
                let newItem = {
                    product_uom_qty: 1,
                    // subtotal_with_tax: item.display_name,
                    product_id:{ name: item.reward_id[1]}
                }
                order.order_line.push(newItem)
                setLoading(false);
                setShowModal(false)
            })
            .catch(e => {
                messageService.showError("Lỗi thêm chương trình khuyến mại \n" + e)
                console.error('applyPromotionById error', e);
                setLoading(false);
                setShowModal(false)
            })
        ;
    }

    const onConfirm = () => {
        ApiService.confirmOrder(order.id)
            .then(res => {
                console.log("order.confirm ",res);
                messageService.showSuccess(`Xác nhận đơn thành công`);
                goBack()
            })
            .catch(err => {
                messageService.showError(`Có lỗi trong quá trình xử lý \n ${err}`);
                console.log("confirmImportInPicking err ", err);
            });
    };

    const renderModal = () => {
    
        return <View style={Styles.productViewModalCategori}>
            <View style={{ width: "100%", flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ flex: 1, marginLeft: 10, textAlign: 'center', fontSize: 16, color: Colors.primary }}>Chọn nhân Viên Tiếp Thị</Text>
                <MaterialCommunityIcons onPress={() => { setShowModal(false) }} name={"close"} color={Colors.gray_aaa} size={26} />
            </View>
            <TextInput
                paddingLeft={10}
                placeholder='Tìm kiếm...'
                autoFocus={true}
                onChangeText={(val) => {
                    filterSelectCoupon(ChangeAlias(val).toLowerCase())
                }}
                style={{ color: Colors.black, height: 36, borderWidth: 1, borderRadius: 10, marginHorizontal: 10, marginVertical: 5, borderColor: Colors.primary, }} />
            <ScrollView>
                {
                    coupons.map(item => {
                        return <TouchableOpacity onPress={() => onClickCoupon(item)} style={[Styles.productViewApply, { marginVertical: 10, height: 50, marginBottom: 10 }]}>
                            <Text style={Styles.productTextApply}>{item.name}</Text>
                        </TouchableOpacity>
                    })
                }

            </ScrollView>
        </View>

    }

    return <Screen header={'Đơn hàng - ' + order.name} goBack={navigation.goBack}>
        <ScrollView 
        keyboardShouldPersistTaps='always' 
        showsVerticalScrollIndicator={false}>
            <View >
                <View style={Styles.screenContent}>
                    <Text style={{...Styles.listItemTitle, alignSelf:'flex-start', fontSize: 16}}>
                        {order.name}
                    </Text>
                    <View style={{ width:'100%', paddingVertical: 4, borderColor: "gray", borderTopWidth: 0.5,borderBottomWidth: 0.5, flexDirection:'column' }}>
                        <OrderListItem
                            flexDt ={1}
                            type={'text'}
                            dd={'Trạng thái'}
                            dt={STATE[order.state]}/>
                        <OrderListItem
                            flexDt ={1}
                            type={'text'}
                            dd={'Vận chuyển'}
                            dt={INVOICE_STATUS[order.invoice_status]}/>
                        
                        <OrderListItem
                            flexDt ={1}
                            type={'date'}
                            dd={'Ngày xác nhận'}
                            dt={order.create_date}/>
                        <OrderListItem
                            flexDt ={1}
                            type={'date'}
                            dd={'Ngày nhận'}
                            dt={order.date_order}/>
                    </View>

                    <View style={{width:'100%', flexDirection: "column", paddingTop: 4}}>
                        <OrderListItem
                                flexDt ={1}
                                dd={'Khách hàng'}
                                dt={order.partner_id.name}/>
                
                        <OrderListItem
                                flexDt ={1}
                                dd={'Nhân viên'}
                                dt={order.user_id.name}/>
                
                        <OrderListItem
                                flexDt ={1}
                                dd={'Giao đến'}
                                dt={order.warehouse_id.name}/>
                    </View>

                    <Text style={{ color: Colors.gray4, marginTop: 4, fonSize: 13 }}>Sản phẩm </Text>

                </View>
                <ProductList
                    hideDeleteButton={true}
                    data={order.order_line}/>

                <TouchableOpacity onPress={onOpenSelectCoupon} style={[Styles.detailCustomerViewTextInput, { padding: 0, flex: 1 }]}>
                    <Text numberOfLines={1} ellipsizeMode="tail" pointerEvents="none" style={{ paddingLeft: 10 }}>{"Thêm chương trình khuyến mãi"}</Text>
                    <MaterialCommunityIcons onPress={() => { setShowModal(false) }} style={{}} name={"menu-down"} color={Colors.black} size={26} />
                </TouchableOpacity>

                <View style={{ flex: 1, flexDirection: "row", justifyContent:"flex-end", paddingVertical:2, }}>
                    <View >
                        <Text style={{ color: Colors.gray4, marginTop: 4, fonSize: 13 }}>Tổng tiền phải trả: </Text>
                        {/* <Text style={{ color: Colors.gray4, marginTop: 4, fonSize: 13 }}>Thuế: </Text>
                        <Text style={{ color: Colors.gray4, marginTop: 4, fonSize: 13 }}>Tổng sau thuế: </Text> */}
                    </View>

                    <View style={{ flex: 0.05}}/>
                    <View style={{ alignItems:'flex-end', justifyContent:'center', marginEnd: 10}}>
                        <Text style={{color: Colors.black, marginTop: 4, fontSize: 13 }}>{NumberFormat(order.amount_total_with_tax) + 'đ'}</Text>
                        {/* <Text style={{color: Colors.black, marginTop: 4, fontSize: 13 }}>{NumberFormat(order.amount_tax) + 'đ'}</Text>
                        <Text style={{color: Colors.blue, marginTop: 4, fontSize: 13 }}>{NumberFormat(order.amount_total) + 'đ'}</Text> */}
                    </View>  
                </View>

                <View style={{paddingHorizontal: 10}}>
                    <Text style={{ flex: 1, color: Colors.gray4}}>Ghi chú: </Text>
                    <TextInput
                        style={Styles.formTextAreaSmall}
                        multiline
                        onChangeText={(val) => {}}
                        value={`${order.note? order.note : ""}`}/>
                </View>    

                    {
                    (order.state === 'draft' || order.state === 'sent')
                    ?  <TouchableOpacity onPress={onConfirm} style={{ padding: 5, flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.primary, borderRadius: 7, height: 40, margin: 10, marginTop: 10, height: 50 }}>
                    <Text style={{color: Colors.white}}>Xác nhận đơn </Text>
                </TouchableOpacity>
                    : null
                    }

            </View>
        </ScrollView>
        <FSModal visible={showModal} children={renderModal()} />
    </Screen>;
};

Detail.route = 'Detail';

export default Detail;
