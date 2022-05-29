import React, {useEffect, useState} from 'react';
import {PropTypes} from '../base';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {Styles} from '../configs';
import {Button, Text} from 'react-native-elements';
import Select from '../components/Select';
import {OrderModel} from '../models';
import {DatePicker, TextArea} from '../components';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import {Loading} from './index';
import {logout, useAuthDispatch} from '../context';
import {InvalidAccessToken} from '../errors';
import messageService from '../services/messages';
import { ApiService } from '../services';

const OrderForm = (props) => {
    const {orderName, mode, onSubmit, loading} = props;
    const [error, setError] = useState([]);
    const [showLoading, setShowLoading] = useState(false);
    const [showProductForm, setShowProductForm] = useState(false);
    const [order, setOrder] = useState(new OrderModel());
    const [partnerList, setPartnerList] = useState({});

    const updateField = (key, value) => {
        setOrder({...order, [key]: value});
    };

    const selectPartner = (item) => {
        setOrder({...order, 'partner_name': item.name, 'partner_id': item.id});
    };

    useEffect(() => {
        setShowLoading(true)
        ApiService.getCustomer()
            .then(res => {
                console.log("get customer ", res.data);
                setPartnerList(res.data)
                setShowLoading(false);
            })
            .catch(e => {
                console.error('get customer error', e);
                setShowLoading(false);
            })
        ;
    }, []);

    const submit = () => {
        if (order.order_line.length === 0) {
            messageService.showError('Chưa có sản phẩm nào');
            return;
        }
        const data = new OrderModel(order);
        if (onSubmit) {
            onSubmit(data);
        }
    };

    const addProduct = (productData) => {
        order.order_line.push(productData);
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

                <Select
                    label={'Nhà cung cấp'}
                    options={partnerList}
                    optionType={'array'}
                    valueKey={'id'}
                    type={'text'}
                    current={order.partner_id}
                    reload={() => {
                        // updateProductList(data.type_of_sale);
                    }}
                    onSelect={(item) => { selectPartner(item)}}
                    search/>
                </View>

                <DatePicker
                    label={'Hạn chốt đặt'}
                    date={order.date_order}
                    onChange={(value) => updateField('date_order', value)}/>

                <TextArea
                    label={'Điều khoản & điều kiện:'}
                    onChangeText={(val) => updateField('note', val)}/>

                <View style={Styles.sectionHeader}>
                    <Text style={Styles.sectionTitle}>Thông tin sản phẩm</Text>
                    <TouchableOpacity
                        onPress={() => setShowProductForm(true)}
                        style={Styles.rightButton}>
                        <Text style={Styles.rightButtonText}>
                            + Thêm sản phẩm
                        </Text>
                    </TouchableOpacity>
                </View>

                <ProductList
                    onDelete={index => {
                        const order_line = order.order_line;
                        order_line.splice(index, 1);
                        updateField('order_line', order_line);
                    }}
                    data={order.order_line}/>

                <Button
                    title={'Lưu'.toUpperCase()}
                    buttonStyle={Styles.button}
                    containerStyle={Styles.buttonContainer}
                    onPress={submit}
                    loading={loading}/>
            </View>
        </ScrollView>
        <ProductForm
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
