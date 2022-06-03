import React, {useState} from 'react';
import OrderItem from '../components/OrderItem';
import {Button, ListItem} from 'react-native-elements';
import PropTypes from 'prop-types';
import {LIST_CHIEU_MO} from '../models/ProductModel';
import {Styles} from '../configs';
import {View} from 'react-native';

const ProductItem = (props) => {
    const {item, onDelete, hideDeleteButton} = props;
    const [expanded, setExpanded] = useState(false);
    return <ListItem.Accordion
        content={
            <ListItem.Content>
                <ListItem.Title>{item.product_id.name}</ListItem.Title>
            </ListItem.Content>
        }
        isExpanded={expanded}
        onPress={() => setExpanded(!expanded)}>
        <View style={expanded ? Styles.accordionContent : Styles.accordionCollapseContent}>
            <OrderItem
                dd={'Sản phẩm'}
                dt={item.product_id.name}/>

            <OrderItem
                dd={'Số lượng'}
                dt={item.product_uom_qty}/>

            <OrderItem
                dd={'Mô tả'}
                dt={item.name}/>

            <OrderItem
                dd={'Đã nhận'}
                dt={item.qty_delivered}/>

            <OrderItem
                dd={'Đã có hóa đơn'}
                dt={item.qty_invoiced}/>

            <OrderItem
                dd={'Đơn vị'}
                dt={item.product_uom.name}/>

            <OrderItem
                dd={'Đơn giá'}
                dt={item.price_unit}/>

            <OrderItem
                dd={'Thuế'}
                dt={item.tax_id.name}/>

            <OrderItem
                dd={'Thành tiền'}
                dt={item.price_subtotal}/>

            {!hideDeleteButton
            && <Button
                buttonStyle={Styles.button}
                title={'Xoá sản phẩm'}
                onPress={onDelete}/>}
        </View>
    </ListItem.Accordion>;
};

ProductItem.propTypes = {
    onDelete: PropTypes.func,
    item: PropTypes.object,
    hideDeleteButton: PropTypes.bool,
};

export default ProductItem;
