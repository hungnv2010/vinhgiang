import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Styles} from '../configs';
import PropTypes from 'prop-types';
import {Text} from 'react-native-elements';
import Select from '../components/Select';
import {FormInput} from '../components';
import {ProductModel} from '../models';

const ProductAttach = (props) => {
    const {data, onChange} = props;
    const add = () => {
        onChange([...data, {quantity: 0, product_id: 0}]);
    };

    const [attachments, setAttachments] = useState([]);

    const remove = (index) => {
        data.splice(index, 1);
        onChange(data);
    };

    useEffect(() => {
        if (attachments.length > 0) {
            return;
        }
        ProductModel.getAttachments()
            .then(res => {
                setAttachments(res);
            })
            .catch(e => console.log('get attachments failed', e));
    }, [attachments.length]);
    const renderItems = () => {
        if (data.length === 0) {
            return <Text>{'Bạn chưa có sản phẩm nào'}</Text>;
        }
        return data.map((item, index) => (
            <View style={Styles.listItemContent}>
                <Select
                    required
                    onSelect={(pa) => {
                        data[index].product_id = pa.id;
                        onChange(data);
                    }}
                    options={attachments}
                    valueKey={'id'}
                    label={'Sản phẩm'}
                    current={item.product_id}
                    search/>
                <FormInput
                    label={'Số lượng'}
                    numeric
                    value={item.quantity}
                    onChange={(val) => {
                        data[index].quantity = parseInt(val, 10);
                        onChange(data);
                    }}/>
                <View style={Styles.rightButtonContainer}>
                    <TouchableOpacity
                        onPress={() => remove(index)}
                        style={Styles.smallButton}>
                        <Text style={Styles.rightButtonText}>
                            {'Xoá'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>));
    };

    return <>
        <View style={Styles.sectionHeader}>
            <Text style={Styles.sectionTitle}>
                {'Sản phẩm đính kèm'}
            </Text>
            <TouchableOpacity
                onPress={add}
                style={Styles.rightButton}>
                <Text style={Styles.rightButtonText}>
                    {'Thêm một dòng'}
                </Text>
            </TouchableOpacity>
        </View>
        <View style={Styles.listItemContainer}>
            {renderItems()}
        </View>
    </>;
};

ProductAttach.propTypes = {
    data: PropTypes.array,
    onChange: PropTypes.func,
};

ProductAttach.defaultProps = {};

export default ProductAttach;
