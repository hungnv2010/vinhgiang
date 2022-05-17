import React, {useEffect, useState} from 'react';
import {PropTypes} from '../base';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {Styles} from '../configs';
import {Button, Text} from 'react-native-elements';
import Select from '../components/Select';
import {LIST_THONG_TIN_NHAN_HANG} from '../models/OrderModel';
import {OrderModel} from '../models';
import {DatePicker, TextArea} from '../components';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import {Loading} from './index';
import {logout, useAuthDispatch} from '../context';
import {InvalidAccessToken} from '../errors';
import messageService from '../services/messages';

const OrderForm = (props) => {
    const {orderName, mode, onSubmit, loading} = props;
    const [error, setError] = useState([]);
    const [showProductForm, setShowProductForm] = useState(false);
    const [order, setOrder] = useState(new OrderModel());

    const updateField = (key, value) => {
        setOrder({...order, [key]: value});
    };

    const submit = () => {
        if (order.lines.length === 0) {
            messageService.showError('Chưa có sản phẩm nào');
            return;
        }
        const data = new OrderModel(order);
        if (onSubmit) {
            onSubmit(data);
        }
    };

    const addProduct = (productData) => {
        order.lines.push(productData);
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
                        current={order.infor_receive}
                        options={LIST_THONG_TIN_NHAN_HANG}
                        type={'text'}
                        optionType={'object'}
                        label={'Thông tin vận chuyển'}
                        onSelect={(item) => updateField('infor_receive', item.value)}/>
                </View>

                {/*<InputView*/}
                {/*    label={'Ngày xác nhận'}*/}
                {/*    value={moment().format('YYYY/MM/D')}/>*/}

                <DatePicker
                    label={'Ngày muốn nhận'}
                    date={order.date_nhan}
                    onChange={(value) => updateField('date_nhan', value)}/>

                {order.infor_receive !== 'khach_lay'
                && <TextArea
                    label={'Thông tin giao hàng'}
                    onChangeText={(val) => updateField('infor_tranfer', val)}/>
                }

                <TextArea
                    label={'Ghi chú'}
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
                        const lines = order.lines;
                        lines.splice(index, 1);
                        updateField('lines', lines);
                    }}
                    data={order.lines}/>

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
