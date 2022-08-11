import React, {useEffect, useRef, useState} from 'react';
import {Alert, KeyboardAvoidingView, Modal, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {PropTypes} from '../base';
import {Colors, Styles} from '../configs';
import {Screen} from './index';
import {FormInput, InputView, TabBar, Toggle} from '../components';
import {ProductModel} from '../models';
import Select from '../components/Select';
import {Button} from 'react-native-elements';
import { ApiService } from '../services';
import messageService from '../services/messages';
import { NumberFormat } from '../configs/Utils';
import SelectLoadmore from '../components/SelectLoadmore';

const ProductForm = (props) => {
    const {product, visible: isShow, onClose, onSubmit} = props;
    const [errors, setErrors] = useState([]);
    const [data, setData] = useState(product? product: new ProductModel());
    const [loading, setLoading] = useState(false);
    const [productList, setProductList] = useState([]);
    const listUnit = useRef([])

    const updateField = (key, value) => {
        console.log('update', key, value);
        data[key] =  value
        calculate()
    };

    useEffect(()=>{
        if(productList && productList.length > 0 && product) {
            productList.forEach(item => {
                if (item.id == product.product_id.id) 
                    listUnit.current = [{id: item.uom_id[0], name: item.uom_id[1]}, {id: item.uom_po_id[0], name: item.uom_po_id[1]}]
            })
        }
        setData(product? {...product}: new ProductModel())
    }, [isShow])

    const updateFieldFloat = (key, value) => {
        if (!value.endsWith("."))
            updateField(key, Number(value))
    };

    const calculate = () => {
        data.price_subtotal = data.price_unit * data.product_uom_qty * (1 - data.discount/100) - data.x_discount_amount
        let tax = 10
        data.subtotal_with_tax = data.price_subtotal * (100 + tax) /100
        setData({...data});
    } 

    const updateUnit = (unit) => {
        console.log('updateUnit', unit);
        setData({
            ...data,
            product_uom:{id: unit.id, name: unit.name},
        });
    };

    const selectItem = (item) => {
        listUnit.current = [{id: item.uom_id[0], name: item.uom_id[1]}, {id: item.uom_po_id[0], name: item.uom_po_id[1]}]
        setData({
            name: item.display_name, // mo ta
            product_id: {id: item.id, name: item.display_name},
            product_uom_qty: 0,
            discount: 0,
            product_uom: {id: item.uom_id[0], name: item.uom_id[1]},
            price_unit: item.list_price,
            x_discount_amount: 0,
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
        if(!data.product_id.id) Alert.alert('Lỗi', 'Chưa chọn sản phẩm')
        else if(data.product_uom_qty <= 0) Alert.alert('Lỗi', 'Số lượng sản phẩm > 0')
        else if (onSubmit) {
            onSubmit(model);
            setData(new ProductModel())
            onClose();
        }
    };

    return <Modal visible={isShow}>
        <Screen goBack={onClose}
                header={product ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}>
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
                        </Text>
                    </View>

                    <SelectLoadmore
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
                        search
                        isProduct/>

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
                        </View>
                    </View>

                    <FormInput
                        keyboardType={'numeric'}
                        label={'Đơn giá'}
                        value={`${data.price_unit}`}
                        onChangeText={(val) => updateFieldFloat('price_unit', val)}/>
                        
                    <Select
                        label={'Đơn vị tính'}
                        options={listUnit.current}
                        optionType={'array'}
                        valueKey={'id'}
                        type={'text'}
                        current={data.product_uom.id}
                        loading={loading}
                        onSelect={(item) => updateUnit(item)}/>

                    <FormInput
                        keyboardType={'numeric'}
                        label={"Chiết khấu(%)"}
                        value={`${data.discount}`}
                        defaultValue  = {data.discount}
                        onChangeText={(val) => updateFieldFloat('discount', val)}/>
                    <FormInput
                        keyboardType={'numeric'}
                        label={"Giảm giá(VNĐ)"}
                        value={`${data.x_discount_amount}`}
                        defaultValue  = {data.x_discount_amount}
                        onChangeText={(val) => updateFieldFloat('x_discount_amount', val)}/>
                  
                    <FormInput
                        value={data.name}
                        label={'Mô tả'}
                        onChangeText={val => updateField('name', val)}/>

                    <View style={Styles.formItem}>
                        <Text style={Styles.formLabel}>
                            Tạm tính
                        </Text>
                        <Text style={Styles.formText}>{NumberFormat(data.subtotal_with_tax ? data.subtotal_with_tax : 0)}</Text>
                    </View>
  
                    <Button
                        title={product ? 'Sửa sản phẩm' : 'Thêm sản phẩm'.toUpperCase()}
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
