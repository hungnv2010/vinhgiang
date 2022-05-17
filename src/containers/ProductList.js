import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Text} from 'react-native-elements';
import {View} from 'react-native';
import {Styles} from '../configs';
import ProductItem from './ProductItem';

const ProductList = (props) => {
    const {data, onDelete, hideDeleteButton} = props;
    if (data.length === 0) {
        return <Text>"Bạn chưa có sản phẩm nào"</Text>;
    }
    return <View style={Styles.orderProducts}>
        {data.map((item, index) => (
            <ProductItem
                hideDeleteButton={hideDeleteButton}
                onDelete={() => onDelete(index)}
                key={index}
                item={item}/>
        ))}
    </View>;
};

ProductList.propTypes = {
    data: PropTypes.array,
    onDelete: PropTypes.func,
    hideDeleteButton: PropTypes.bool,
};
export default ProductList;
