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
                dt={item.qty_cai}/>

            <OrderItem
                dd={'Chiều cao'}
                dt={item.chieu_rong}/>

            <OrderItem
                dd={'Chiều rộng'}
                dt={item.chieu_cao}/>

            <OrderItem
                dd={'Rộng thông thuỷ'}
                dt={item.rong_thong_thuy}/>

            <OrderItem
                dd={'Cao thông thuỷ'}
                dt={item.cao_thong_thuy}/>

            <OrderItem
                dd={'Mã huỳnh cánh giữa'}
                dt={item.ma_huynh_giua.name}/>

            <OrderItem
                dd={'Mã huỳnh cánh ngoài'}
                dt={item.ma_huynh_ngoai.name}/>

            <OrderItem
                dd={'Phụ kiện'}
                dt={item.choose_product_attach}/>

            <OrderItem
                dd={'Chiều mở'}
                dt={LIST_CHIEU_MO[item.chieu_mo]}/>

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
