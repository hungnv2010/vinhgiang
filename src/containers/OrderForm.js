import React, {useEffect, useRef, useState} from 'react';
import {PropTypes} from '../base';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {Colors, Styles} from '../configs';
import {Button, Text} from 'react-native-elements';
import Select from '../components/Select';
import {OrderModel} from '../models';
import {DatePicker, FormInput, TextArea} from '../components';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import {Loading} from './index';
import {logout, useAuthDispatch} from '../context';
import {InvalidAccessToken} from '../errors';
import messageService from '../services/messages';
import { ApiService } from '../services';
import { NumberFormat } from '../configs/Utils';
import SelectLoadmore from '../components/SelectLoadmore';

const OrderForm = (props) => {
    const {orderName, mode, goBack} = props;
    const [error, setError] = useState([]);
    const [showLoading, setShowLoading] = useState(false);
    const [showProductForm, setShowProductForm] = useState(false);
    const [order, setOrder] = useState(new OrderModel());
    const [partnerList, setPartnerList] = useState({});
    const productSelect = useRef({})

    const updateField = (key, value) => {
        setOrder({...order, [key]: value});
    };

    const selectPartner = (item) => {
        setOrder({...order, 'partner_name': item.name, 'partner_id': item.id});
    };

    useEffect(() => {
        updateCustomerList()
    }, []);

    const updateCustomerList = () => {
        setShowLoading(true)
        ApiService.getAllCustomer()
            .then(res => {
                console.log("get customer ", res.data);
                setPartnerList(res.data)
                setShowLoading(false);
            })
            .catch(e => {
                console.error('get customer error', e);
                setShowLoading(false);
            })
    }

    const onSubmit = () => {
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
                if(data && data[0] && data[0].id)
                    setOrder({...order, id: data[0].id})
                else
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

        order.amount_untaxed =  order.order_line.map(product =>  product.price_subtotal ? product.price_subtotal : 0)
            .reduce((prev, value) => value + prev)
        order.amount_tax = order.amount_untaxed * 0.1
        order.amount_total = order.amount_untaxed

        setOrder(order);
    };

    const dispatch = useAuthDispatch();
    useEffect(() => {
        if (mode === 'edit' && orderName) {
            OrderModel.getDetail(orderName)
                .then(res => {
                    setOrder(res);
                }).catch(e => {
                    if (InvalidAccessToken.compare(e)) {
                        logout(dispatch)
                            .catch(err => console.log('log out error', err));
                    }
                },
            );
        }
    }, [dispatch, mode, orderName]);

    if (mode === 'edit' && orderName && !order.name) {
        return <Loading/>;
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
                    onSelect={(item) => { selectPartner(item)}}
                    search/>
                </View>
{/* 
                <FormInput
                        keyboardType={'numeric'}
                        label={'Số điện thoại'}
                        value={`${order.phone}`}
                        onChangeText={(val) => updateField('phone', val)}/> */}

                <DatePicker
                    label={'Hạn chốt đặt'}
                    date={order.date_order}
                    onChange={(value) => updateField('date_order', value)}/>

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
                        console.log("add ProductList ", productSelect.current);
                        setShowProductForm(true)
                    }}
                
                    data={order.order_line}/>

                    <View style={{ flex: 1, flexDirection: "row", justifyContent:"flex-end", paddingVertical:2, }}>
                        <View >
                            <Text style={{ color: Colors.gray4, marginTop: 4, fonSize: 13 }}>Tạm tính trước thuế: </Text>
                            <Text style={{ color: Colors.gray4, marginTop: 4, fonSize: 13 }}>Tạm tính thuế: </Text>
                            <Text style={{ color: Colors.gray4, marginTop: 4, fonSize: 13 }}>Tạm tính sau thuế: </Text>
                        </View>

                        <View style={{ flex: 0.05}}/>
                        <View style={{ alignItems:'flex-end', justifyContent:'center', marginEnd: 10}}>
                            <Text style={{color: Colors.black, marginTop: 4, fontSize: 13 }}>{NumberFormat(order.amount_untaxed) + 'đ'}</Text>
                            <Text style={{color: Colors.black, marginTop: 4, fontSize: 13 }}>{NumberFormat(order.amount_tax) + 'đ'}</Text>
                            <Text style={{color: Colors.blue, marginTop: 4, fontSize: 13 }}>{NumberFormat(order.amount_total) + 'đ'}</Text>
                        </View>
                            
                    </View>

                <View style ={{ flexDirection : "row"}}>

                    <TouchableOpacity onPress={() => onSubmit()} style={{ padding: 5, flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.primary, borderRadius: 7, height: 40, margin: 10, marginTop: 10, height: 50 }}>
                        <Text style={{color: Colors.white}}>Lưu</Text>
                    </TouchableOpacity>

                    { order.id?
                    <TouchableOpacity onPress={()=> onConfirm()} style={{ padding: 5, flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.primary, borderRadius: 7, height: 40, margin: 10, marginTop: 10, height: 50 }}>
                        <Text style={{color: Colors.white}}>Chốt đơn</Text>
                    </TouchableOpacity>
                    : null
                    }
                </View>
            </View>
        </ScrollView>
        <ProductForm
            product={productSelect.current.product}
            visible={showProductForm}
            onSubmit={addProduct}
            onClose={() => setShowProductForm(false)}/>
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
