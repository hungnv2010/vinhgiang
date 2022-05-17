import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, Modal, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {PropTypes} from '../base';
import {Styles} from '../configs';
import {Screen} from './index';
import {FormInput, InputView, TabBar, Toggle} from '../components';
import {ProductModel} from '../models';
import Select from '../components/Select';
import {
    LIST_CHIEU_MO,
    LIST_DOORSIL,
    LIST_KIEU_O_THOANG,
    LIST_LOAI_PHAO_ROI,
    LIST_PHAO_DAI,
    LIST_PHAO_LIEN_KHUNG,
    LIST_PHAO_ROI,
    LIST_QUY_CACH_CANH,
    LIST_SONG_CUA, TYPE_NAMES,
} from '../models/ProductModel';
import ProductAttach from './ProductAttach';
import {Button} from 'react-native-elements';

const ProductForm = (props) => {
    const {visible: isShow, onClose, onSubmit} = props;
    const [errors, setErrors] = useState([]);
    const [data, setData] = useState(new ProductModel());
    const [loading, setLoading] = useState(false);
    const [productList, setProductList] = useState({});
    const [ma_huynh, set_ma_huynh] = useState([]);
    const [colorList, setColorList] = useState([]);


    const selectType = (type) => {
        setData({
            ...data,
            ...ProductModel.resetData(data),
        });
        updateProductList(type);
    };

    const updateField = (key, value) => {
        console.log('update', key, value);
        setData({
            ...data,
            [key]: value,
        });
    };

    const updateProductList = (type, filters = {}) => {
        if (productList[type]) {
            console.log(productList[type]);
            updateField('type_of_sale', type);
            return;
        }
        setLoading(true);
        console.log('get product', type);
        ProductModel.getProducts(type, filters)
            .then(res => {
                setProductList({
                    ...productList,
                    [type]: res,
                });
                updateField('type_of_sale', type);
                setLoading(false);
            })
            .catch(err => {
                console.error('update product error', err);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (!data.type_of_sale) {
            return;
        }
        if (productList[data.type_of_sale]) {
            return;
        }
        setLoading(true);
        ProductModel.getProducts(data.type_of_sale)
            .then(res => {
                console.log('receive product data', data.type_of_sale, res);
                setProductList({
                    ...productList,
                    [data.type_of_sale]: res,
                });
                setLoading(false);
            })
            .catch(e => {
                console.error('get product error', data.type_of_sale, e);
                setLoading(false);
            })
        ;
    }, [data.type_of_sale, productList]);

    const getMaHuynh = () => {
        ProductModel.getMaHuynh()
            .then(mh => {
                    set_ma_huynh(mh);
                },
            );
    };

    useEffect(() => {
        ProductModel.getMaHuynh()
            .then(mh => {
                    set_ma_huynh(mh);
                },
            );
    }, []);

    useEffect(() => {
        if (colorList.length > 0) {
            return;
        }
        ProductModel.getAllColors()
            .then(cls => {
                console.log('color list', cls);
                if (cls) {
                    setColorList(cls);
                }
            })
            .catch(e => {
                console.log('get color error', e);
            });
    }, [colorList.length]);

    const visibles = ProductModel.getVisible(data);
    const requires = ProductModel.getRequires(data);

    const qty = (data.chieu_rong * data.chieu_cao) / 1000000;
    const qty_total = qty * data.qty_cai;

    const submit = () => {
        const model = new ProductModel(data);
        const validate = model.validate(visibles, requires);
        if (validate.length > 0) {
            setErrors(validate);
            return;
        }
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
                    <View style={Styles.viewInput}>
                        <TabBar
                            style={Styles.tabBar}
                            orientation="horizontal"
                            selected={data.type_of_sale}
                            onPress={selectType}
                            data={TYPE_NAMES}/>
                    </View>

                    <Select
                        required
                        label={'Sản phẩm'}
                        options={productList[data.type_of_sale]}
                        optionType={'array'}
                        valueKey={'id'}
                        type={'text'}
                        current={data.product_id?.id}
                        reload={() => {
                            updateProductList(data.type_of_sale);
                        }}
                        loading={loading}
                        onSelect={(item) => updateField('product_id', item)}
                        search/>

                    <FormInput
                        required
                        keyboardType={'numeric'}
                        label={'Số lượng (bộ)'}
                        value={data.qty_cai}
                        onChangeText={(val) => updateField('qty_cai', val)}/>

                    <FormInput
                        required={requires.chieu_rong}
                        keyboardType={'numeric'}
                        label={'Chiều rộng (mm)'}
                        value={data.chieu_rong}
                        onChangeText={(val) => updateField('chieu_rong', val)}/>
                    <FormInput
                        required={requires.chieu_cao}
                        keyboardType={'numeric'}
                        label={'Chiều cao (mm)'}
                        value={data.chieu_cao}
                        onChangeText={(val) => updateField('chieu_cao', val)}/>
                    {visibles.qty
                        && <InputView
                            value={qty}
                            label={'Diện tích (m2)'}/>}
                    {visibles.qty_total
                        && <InputView
                            value={qty_total}
                            label={'Diện tích (m2)'}/>}

                    {visibles.rong_thong_thuy
                        && <FormInput
                            required={requires.rong_thong_thuy}
                            keyboardType={'numeric'}
                            label={'Rộng thông thủy'}
                            value={data.rong_thong_thuy}
                            onChangeText={(val) => updateField('rong_thong_thuy', val)}/>
                    }

                    {visibles.cao_thong_thuy
                        && <FormInput
                            required={requires.cao_thong_thuy}
                            keyboardType={'numeric'}
                            label={'Cao thông thủy'}
                            value={data.cao_thong_thuy}
                            onChangeText={(val) => updateField('cao_thong_thuy', val)}/>
                    }

                    {visibles.song_cua
                        && <Select
                            required={requires.song_cua}
                            label={'Song cửa'}
                            current={data.song_cua}
                            options={LIST_SONG_CUA}
                            onSelect={(item) => updateField('song_cua', item.value)}
                            search/>}

                    {visibles.ma_huynh_giua
                        && <Select
                            required={requires.ma_huynh_giua}
                            label={'Mã huỳnh cánh giữa'}
                            options={ma_huynh}
                            current={data.ma_huynh_giua?.id}
                            valueKey={'id'}
                            reload={getMaHuynh}
                            loading={loading}
                            onSelect={(item) => updateField('ma_huynh_giua', item)}
                            search/>
                    }

                    {visibles.ma_huynh_ngoai
                        && <Select
                            required={requires.ma_huynh_ngoai}
                            label={'Mã huỳnh cánh ngoài'}
                            options={ma_huynh}
                            current={data.ma_huynh_ngoai?.id}
                            valueKey={'id'}
                            reload={getMaHuynh}
                            loading={loading}
                            onSelect={(item) => updateField('ma_huynh_ngoai', item)}
                            search/>
                    }

                    {visibles.quy_cach_canh
                        && <InputView
                            value={LIST_QUY_CACH_CANH[data.product_id?.quy_cach_canh]}
                            label={'Quy cách cửa'}/>
                    }

                    {visibles.chieu_mo
                        && <Select
                            required={requires.chieu_mo}
                            label={'Chiều mở'}
                            current={data.chieu_mo}
                            onSelect={item => updateField('chieu_mo', item.value)}
                            options={LIST_CHIEU_MO}
                            search/>
                    }

                    {visibles.day_canh
                        && <InputView
                            value={data.product_id.day_canh}
                            label={'Dày cánh (mm)'}/>
                    }

                    {visibles.day_khung
                        && <FormInput
                            keyboardType={'numeric'}
                            required={requires.day_khung}
                            label={'Dày khung (mm)'}
                            value={data.day_khung}
                            onChangeText={val => updateField('day_khung', val)}/>}

                    {visibles.phao_lien_khung
                        && <Select
                            required={requires.phao_lien_khung}
                            label={'Phào liền khung'}
                            options={LIST_PHAO_LIEN_KHUNG}
                            current={data.phao_lien_khung}
                            onSelect={item => updateField('phao_lien_khung', item.value)}
                            search/>
                    }

                    {visibles.phao_dai
                        && <Select
                            required={requires.phao_dai}
                            label={'Phào đại'}
                            options={LIST_PHAO_DAI}
                            current={data.phao_dai}
                            onSelect={item => updateField('phao_dai', item.value)}
                            search/>
                    }

                    {visibles.phao_roi
                        && <Select
                            required={requires.phao_roi}
                            label={'Phào rời'}
                            options={LIST_PHAO_ROI}
                            current={data.phao_roi}
                            onSelect={item => updateField('phao_roi', item.value)}
                            search/>
                    }

                    {visibles.loai_phao_roi
                        && <Select
                            required={requires.loai_phao_roi}
                            label={'Loại phào rời'}
                            options={LIST_LOAI_PHAO_ROI}
                            current={data.loai_phao_roi}
                            onSelect={item => updateField('loai_phao_roi', item.value)}
                            search/>
                    }

                    {visibles.kieu_o_thoang
                        && <InputView
                            label={'Kiểu ô thoáng'}
                            value={LIST_KIEU_O_THOANG[data.product_id?.kieu_o_thoang || 'khong']}/>
                    }

                    {visibles.phu_kien
                        && <FormInput
                            value={data.phu_kien}
                            label={'Phụ kiện'}
                            onChangeText={val => updateField('phu_kien', val)}/>
                    }

                    {visibles.doorsil
                        && <Select
                            required={requires.doorsil}
                            label={'Doorsil'}
                            current={data.doorsil}
                            options={LIST_DOORSIL}
                            onSelect={item => updateField('doorsil', item.value)}
                            search/>
                    }

                    <Select
                        label={'Màu sơn'}
                        current={data.color}
                        options={colorList}
                        valueKey={'id'}
                        reload={() => {
                            ProductModel.getAllColors()
                                .then(cls => {
                                    console.log('color list', cls);
                                    if (cls) {
                                        setColorList(cls);
                                    }
                                })
                                .catch(e => {
                                    console.error('get color error', e);
                                });
                        }}
                        onSelect={val => updateField('color', val.id)}
                        search/>

                    <FormInput
                        value={data.note}
                        label={'Ghi chú'}
                        onChangeText={val => updateField('note', val)}/>

                    {visibles.choose_product_attach
                        && <Toggle
                            onChange={() => {
                                const val = data.choose_product_attach === 1 ? 0 : 1;
                                updateField('choose_product_attach', val);
                            }}
                            isOn={data.choose_product_attach === 1}
                            label={'Sản phẩm đính kèm'}/>}

                    {(visibles.choose_product_attach && data.choose_product_attach === 1)
                        && <ProductAttach
                            onChange={(product_attach_ids) => updateField('product_attach_ids', product_attach_ids)}
                            data={data.product_attach_ids}/>
                    }

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
