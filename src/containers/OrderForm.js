import React, {useEffect, useRef, useState} from 'react';
import {PropTypes} from '../base';
import {ScrollView, TextInput, TouchableOpacity, View} from 'react-native';
import {Colors, Styles} from '../configs';
import {Button, Text} from 'react-native-elements';
import moment from 'moment';
import {OrderModel, ProductModel} from '../models';
import {DatePicker, FormInput, TextArea} from '../components';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import {logout, useAuthDispatch} from '../context';
import messageService from '../services/messages';
import { ApiService } from '../services';
import { NumberFormat } from '../configs/Utils';
import SelectLoadmore, { TYPE } from '../components/SelectLoadmore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FSModal from '../components/FSModal';
import { SO_TYPE } from '../models/OrderModel';
import Select from '../components/Select';
import _ from 'lodash';

const OrderForm = (props) => {
    const {orderData, orderName, mode, goBack} = props;
    const [error, setError] = useState([]);
    const [showLoading, setShowLoading] = useState(false);
    const [showProductForm, setShowProductForm] = useState(false);
    const [order, setOrder] = useState(new OrderModel());
    const [partnerList, setPartnerList] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const productSelect = useRef({})
    const offset = useRef(0)
    const listDataCoupon = useRef([]);
    const listDataPriceList = useRef([]);

    const updateField = (key, value) => {
        setOrder({...order, [key]: value});
    };

    const selectPartner = (item) => {
        setOrder({...order, 'partner_name': item.name, 'partner_id': item.id});
    };

    const dispatch = useAuthDispatch();

    useEffect(() => {
        offset.current = 0
        if (orderData) setOrderData(orderData)
        getPriceList()
        getCoupons()
        updateCustomerList()
    }, []);

    useEffect(() => {
        if(partnerList.length == 0) return;
        offset.current += 400;
        updateCustomerList()
    }, [partnerList]);

    const setOrderData = (data) => { 
        if (data.date_order) data.date_order = moment(data.date_order);
        data.partner_name = data.partner_id.name;
        data.partner_id = data.partner_id.id;
        // delete data.partner_id;
        data.order_line = data.order_line.map(product => {
            let tax = (product.tax_id && product.tax_id.name) ? parseInt(product.tax_id.name.replace(/\D/g,'')) : 0
            product.subtotal_with_tax = product.price_subtotal * (100 + tax) /100
            return new ProductModel(product)
        })
        data.amount_total_with_tax =  data.order_line.map(product =>  product.subtotal_with_tax ? product.subtotal_with_tax : 0)
        .reduce((prev, value) => value + prev, 0)

        console.log("data ",data);
        setOrder(data);
    }

    const updateCustomerList = () => {
        setShowLoading(true)
        ApiService.getAllCustomer(offset.current)
            .then(res => {
                if (res) {
                    if(res.data.length == 0) {
                        return;
                    }
                    if(offset.current == 0) {
                        setPartnerList(res.data);
                    } else {
                        setPartnerList( [...partnerList, ...res.data])
                    }
                }
                console.log("get customer ", res.data);
                setShowLoading(false);
            })
            .catch(e => {
                console.error('get customer error', e);
                setShowLoading(false);
            })
    }

    const getCoupons = () => {
        ApiService.getCoupons()
            .then(res => {
                console.log('getCoupons', res);
                listDataCoupon.current = res.data;
            })
            .catch(e => {
                console.error('getCoupons error', e);
            })
        ;
    };

    const getPriceList = () => {
        ApiService.getPriceList()
            .then(res => {
                console.log('getPriceList', res);
                if(_.isArray(res.data)) {
                    let currentPriceLists = res.data.filter((priceList) => priceList.default_on_mobile)
                    if(currentPriceLists && currentPriceLists.length > 0) listDataPriceList.current = currentPriceLists[0];
                }
            })
            .catch(e => {
                console.error('getPriceList error', e);
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
        let body = {
            sale_order_id: order.id,
            promotion_program_id: item.id
        }
        console.log('applyPromotionById start', order, body);
        ApiService.applyPromotionById(body)
            .then(res => {
                console.log('applyPromotionById', res);
                messageService.showSuccess("Thêm chương trình khuyến mại thành công")
                setShowModal(false)
                goBack()
            })
            .catch(e => {
                messageService.showError("Lỗi thêm chương trình khuyến mại \n" + e)
                console.error('applyPromotionById error', e);
                setShowModal(false)
            })
        ;
    }

    const onCreate = () => {
        if (order.order_line.length === 0) {
            messageService.showError('Chưa có sản phẩm nào');
            return;
        }
        const data = new OrderModel(order);
        setShowLoading(true);
        data.Create(data)
            .then(res => {
                console.log("order.Create ",res);
                messageService.showSuccess(`Lưu đơn thành công`);
                let data = res.result ? JSON.parse(res.result).data : []
                if(data && data[0] && data[0].id){
                    setOrder({...order, id: data[0].id})
                }
                else
                    goBack()
            })
            .catch(err => {
                setShowLoading(false);
                messageService.showError(`Có lỗi trong quá trình xử lý \n ${err}`);
                console.log("confirmImportInPicking err ", err);
            });
    
    };

    const onSave = () => {
        if (order.order_line.length === 0) {
            messageService.showError('Chưa có sản phẩm nào');
            return;
        }
        const data = new OrderModel(order);
        console.log("onSave data ", data);
        setShowLoading(true);
        data.Update(order.id)
            .then(res => {
                console.log("order.Update ",res);
                messageService.showSuccess(`Lưu đơn thành công`);
                goBack()
            })
            .catch(err => {
                setShowLoading(false);
                messageService.showError(`Có lỗi trong quá trình xử lý \n ${err}`);
                console.log("confirmImportInPicking err ", err);
            });
    
    };


    const onConfirm = () => {
        ApiService.confirmOrder(order.id)
        .then(res => {
            console.log("order.confirm ",res);
            messageService.showSuccess(`Xác nhận đơn thành công`);
            goBack()
        })
        .catch(err => {
            setShowLoading(false);
            messageService.showError(`Có lỗi trong quá trình xử lý \n ${err}`);
            console.log("confirmImportInPicking err ", err);
        });
    
    };

    const addProduct = (productData) => {
        if(productSelect.current.index >= 0)
            order.order_line[productSelect.current.index] = productData;
        else
            order.order_line.push(productData);

        order.amount_total_with_tax =  order.order_line.map(product =>  product.subtotal_with_tax ? product.subtotal_with_tax : 0)
            .reduce((prev, value) => value + prev, 0)
        // order.amount_tax = order.amount_untaxed * 0.1
        // order.amount_total = order.amount_untaxed

        setOrder(order);
    };

    const deleteProduct = () => {
        if(productSelect.current.index >= 0)
        order.order_line.splice(productSelect.current.index, 1);

        order.amount_total_with_tax =  order.order_line.map(product =>  product.subtotal_with_tax ? product.subtotal_with_tax : 0)
            .reduce((prev, value) => value + prev, 0)
    }

    const renderModal = () => {
    
        return <View style={Styles.productViewModalCategori}>
            <View style={{ width: "100%", flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ flex: 1, marginLeft: 10, textAlign: 'center', fontSize: 16, color: Colors.primary }}>Chọn chương trình khuyến mại</Text>
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

    return <>
        <ScrollView 
        keyboardShouldPersistTaps='always'
        showsVerticalScrollIndicator={false}>
            {error.length > 0 && <TouchableOpacity onPress={() => setError([])}>
                {error.map((item, index) => (
                    <Text key={index} style={Styles.errorItem}>{item}</Text>
                ))}
            </TouchableOpacity>}
            <View style={Styles.screenContainer}>
                <View style={Styles.sectionHeader}>
                    <Text style={Styles.sectionTitle}>Thông tin đặt hàng</Text>
                </View>
                <View style={Styles.viewInput}>

                <SelectLoadmore
                    label={'Khách hàng'}
                    options={partnerList}
                    optionType={'array'}
                    valueKey={'id'}
                    type={'text'}
                    current={order.partner_id}
                    reload={() => {
                        updateCustomerList();
                    }}
                    modelType= {TYPE.CUSTOMER}
                    onSelect={(item) => { selectPartner(item)}}
                    keySearchs = {["code_ch_ncc1", "street"]}
                    search/>
                </View>

                <DatePicker
                    label={'Hạn chốt đặt'}
                    date={order.date_order}
                    onChange={(value) => updateField('date_order', value)}/>

                <Select
                    label={'Loại đơn hàng'}
                    options={SO_TYPE}
                    valueKey={'value'}
                    type={'text'}
                    current={order.so_type}
                    onSelect={(item) => { 
                        console.log(item);
                        setOrder({...order, so_type: item.value})
                    }}
                    />

                <TextArea
                    label={'Ghi chú'}
                    onChangeText={(val) => updateField('note', val)}/>

                <View style={Styles.sectionHeader}>
                    <Text style={Styles.sectionTitle}>Thông tin sản phẩm</Text>
                    <TouchableOpacity
                        onPress={() => {
                            productSelect.current = {index: -1}
                            setShowProductForm(true)
                         }
                        }
                        style={Styles.rightButton}>
                        <Text style={Styles.rightButtonText}>
                            + Thêm sản phẩm
                        </Text>
                    </TouchableOpacity>
                </View>

                <ProductList
                    onClickItem={(index, item) => {
                        productSelect.current = {index: index, product: item}
                        setShowProductForm(true)
                    }}
                
                    data={order.order_line}/>

                    <View style={{ flex: 1, flexDirection: "row", justifyContent:"flex-end", paddingVertical:2, }}>
                        <View >
                            <Text style={{ color: Colors.gray4, marginTop: 4, fonSize: 13 }}>Tạm tính tiền phải trả: </Text>
                            {/* <Text style={{ color: Colors.gray4, marginTop: 4, fonSize: 13 }}>Tạm tính thuế: </Text>
                            <Text style={{ color: Colors.gray4, marginTop: 4, fonSize: 13 }}>Tạm tính sau thuế: </Text> */}
                        </View>

                        <View style={{ flex: 0.05}}/>
                        <View style={{ alignItems:'flex-end', justifyContent:'center', marginEnd: 10}}>
                            <Text style={{color: Colors.black, marginTop: 4, fontSize: 13 }}>{NumberFormat(order.amount_total_with_tax) + 'đ'}</Text>
                            {/* <Text style={{color: Colors.black, marginTop: 4, fontSize: 13 }}>{NumberFormat(order.amount_tax) + 'đ'}</Text>
                            <Text style={{color: Colors.blue, marginTop: 4, fontSize: 13 }}>{NumberFormat(order.amount_total) + 'đ'}</Text> */}
                        </View>
                            
                    </View>

                <View style={{height: 50}}>
                    {order.id ? 
                        <TouchableOpacity onPress={onOpenSelectCoupon} style={[Styles.detailCustomerViewTextInput, { paddingHorizontal: 10, flex: 1 }]}>
                            <Text numberOfLines={1} ellipsizeMode="tail" pointerEvents="none" style={{ paddingLeft: 10 }}>{"Thêm chương trình khuyến mãi"}</Text>
                            <MaterialCommunityIcons onPress={() => { setShowModal(false) }} style={{}} name={"menu-down"} color={Colors.black} size={26} />
                        </TouchableOpacity>
                        : null 
                    }
                </View>

                <View style ={{ flexDirection : "row"}}>

                    <TouchableOpacity onPress={order.id? onSave : onCreate} style={{ padding: 5, flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.primary, borderRadius: 7, height: 40, margin: 10, marginTop: 10, height: 50 }}>
                        <Text style={{color: Colors.white}}>{order.id? 'Lưu' : 'Tạo'}</Text>
                    </TouchableOpacity>

                    { order.id?
                    <TouchableOpacity onPress={()=> onConfirm()} style={{ padding: 5, flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.primary, borderRadius: 7, height: 40, margin: 10, marginTop: 10, height: 50 }}>
                        <Text style={{color: Colors.white}}>Chốt đơn</Text>
                    </TouchableOpacity>
                    :   
                    null
                    }
                </View>

            </View>
        </ScrollView>

        <ProductForm
            product={productSelect.current.product}
            priceList ={listDataPriceList.current.item_ids ? listDataPriceList.current.item_ids : []}
            visible={showProductForm}
            onSubmit={addProduct}
            onDelete={deleteProduct}
            onClose={() => setShowProductForm(false)}/>

        <FSModal visible={showModal} children={renderModal()} />

    </>;
};

OrderForm.propTypes = {
    onSubmit: PropTypes.func,
    loading: PropTypes.bool,
    mode: PropTypes.oneOf(['create', 'edit']),
    orderName: PropTypes.string,
};

OrderForm.defaultProps = {
    mode: 'create',
    orderName: '',
};

export default OrderForm;
