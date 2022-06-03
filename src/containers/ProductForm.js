import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, Modal, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {PropTypes} from '../base';
import {Colors, Styles} from '../configs';
import {Screen} from './index';
import {FormInput, InputView, TabBar, Toggle} from '../components';
import {ProductModel} from '../models';
import Select from '../components/Select';
import {Button} from 'react-native-elements';
import { ApiService } from '../services';

const ProductForm = (props) => {
    const {visible: isShow, onClose, onSubmit} = props;
    const [errors, setErrors] = useState([]);
    const [data, setData] = useState(new ProductModel());
    const [loading, setLoading] = useState(false);
    const [productList, setProductList] = useState({});

    const updateField = (key, value) => {
        console.log('update', key, value);
        setData({
            ...data,
            [key]: value,
        });
    };

    const updateFieldFloat = (key, value) => {
        if (!value.endsWith("."))
            updateField(key, Number(value))
    };

    const selectItem = (item) => {
        setData({
            name: item.display_name, // mo ta
            product_id: {id: item.id, name: item.display_name},
            product_uom_qty: 0,
            discount: 0,
            product_uom: {id: item.uom_po_id[0], name: item.uom_po_id[1]},
            price_unit: item.list_price,
        });
    };

    const updateProductList = (filters = {}) => {
        setLoading(true);
        ApiService.getProductAll()
            .then(res => {
                console.log('receive product data', res);
                setProductList(res.data);
                setLoading(false);
            })
            .catch(e => {
                console.error('get product error', e);
                setLoading(false);
            })
        ;
    };

    useEffect(() => {
        setLoading(true);
        ApiService.getProductAll()
            .then(res => {
                console.log('receive product data', res);
                setProductList(res.data);
                setLoading(false);
            })
            .catch(e => {
                console.error('get product error', e);
                setLoading(false);
            })
        ;
    }, []);

    const submit = () => {
        const model = new ProductModel(data);
        console.log("aaaa model ", model);
        if (onSubmit) {
            onSubmit(model);
            setData(new ProductModel())
        }
        onClose();
    };

    return <Modal visible={isShow}>
        <Screen goBack={onClose}
                header={'Thêm sản phẩm'}>
            {
                errors.length > 0
                && <TouchableOpacity
                    onPress={() => setErrors([])}
                    style={Styles.errorContainer}>{errors.map(e =>
                    (
                        <Text style={Styles.errorItem}>{e}</Text>
                    ))}
                </TouchableOpacity>
            }
            <ScrollView 
            keyboardShouldPersistTaps='always'
            showsVerticalScrollIndicator={false}>
                <View style={Styles.screenContent}>
                    <View style={Styles.sectionHeader}>
                        <Text style={Styles.sectionTitle}>
                            Tạo chi tiết đặt
                        </Text>
                    </View>

                    <Select
                        label={'Sản phẩm'}
                        options={productList}
                        optionType={'array'}
                        valueKey={'id'}
                        type={'text'}
                        current={data.product_id.id}
                        reload={() => {
                            updateProductList();
                        }}
                        loading={loading}
                        onSelect={(item) => selectItem(item)}
                        search/>

                    <View style={Styles.formItem}>
                        <Text style={Styles.formLabel}>
                             Số lượng
                        </Text>
                        <View style={{flex:1, flexDirection:"row"}}>
                            <TextInput
                                keyboardType={'numeric'}
                                style={Styles.formInput}
                                onChangeText={(val) => updateFieldFloat('product_uom_qty', val)}
                                value={`${data.product_uom_qty}`}/>
                            <Text style={{alignSelf:"center", paddingStart:5, maxWidth: 100}}>{data.product_uom.name}</Text>
                        </View>
                    </View>

                    <FormInput
                        keyboardType={'numeric'}
                        label={'Đơn giá'}
                        value={`${data.price_unit}`}
                        onChangeText={(val) => updateFieldFloat('price_unit', val)}/>
                    <FormInput
                        keyboardType={'numeric'}
                        label={"Chiết khấu"}
                        value={`${data.discount}`}
                        defaultValue  = {data.discount}
                        onChangeText={(val) => updateFieldFloat('discount', val)}/>
                  
                    <FormInput
                        value={data.name}
                        label={'Mô tả'}
                        onChangeText={val => updateField('name', val)}/>
  
                    <Button
                        title={'Thêm sản phẩm'.toUpperCase()}
                        buttonStyle={Styles.button}
                        containerStyle={[Styles.formTouchContent, Styles.buttonContainer]}
                        onPress={submit}/>
                </View>
            </ScrollView>
        </Screen>
    </Modal>;
};

ProductForm.propTypes = {
    visible: PropTypes.bool,
    onSubmit: PropTypes.func,
    onClose: PropTypes.func,
};

export default ProductForm;
