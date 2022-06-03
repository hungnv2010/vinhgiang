import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Text} from 'react-native-elements';
import {View, FlatList} from 'react-native';
import {Colors, Styles} from '../configs';
import { NumberFormat } from '../configs/Utils';

const ProductList = (props) => {
    const {data, onDelete, hideDeleteButton} = props;

    const renderTextItem = (title, text) => {
        return (
        <View style={{...Styles.itemDl, backgroundColor:"white"}}>
            <Text style={{ color: Colors.gray_aaa, marginTop: 4, fontSize: 13 }}>{title} </Text>
            <Text style={{color: Colors.black, marginTop: 4, fontSize: 13 }}>{text}</Text>
        </View>
        )
    }

    const renderProduct = (item, index) => {
        return (
            <View style={{ padding: 2, borderRadius: 0, borderColor: 'silver', borderWidth: 0.5, }}>
                <View style={Styles.flexDirection}>
                    <View style={Styles.itemViewContent}>
                        <Text style={Styles.textSize14}>{item.product_id.name}</Text>

                        <View style={{ flex: 1, flexDirection: "row", justifyContent:'space-between'}}>
                            {renderTextItem("Số lượng: ", NumberFormat(item.product_uom_qty))}
                            <View style={{ alignSelf:'baseline' , paddingHorizontal: 4, paddingVertical:2.5, borderRadius: 10, borderColor: 'silver', borderWidth: 0.5, }}>
                                    <Text style={{color: 'silver', fontSize: 13 }}>{item.tax_id?.name ? item.tax_id.name :""}</Text>
                            </View>
                        </View>

                        <View style={{ flex: 1, flexDirection: "row", justifyContent:'space-between'}}>
                            {renderTextItem("Đơn giá: ", NumberFormat(item.price_unit) +"/"+ item.product_uom.name)}
                            {renderTextItem("Tổng: ", NumberFormat(item.price_subtotal) + "đ")}
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    return <View style={Styles.orderProducts}>
        {data.length > 0 ?
                <FlatList
                    data={data}
                    renderItem={({ item, index }) => renderProduct(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                    style={Styles.productList}
                />
                : <View style={Styles.productViewNoList}>
                    <Text>Chưa có sản phẩm</Text>
                </View>
            }
    </View>;
};

ProductList.propTypes = {
    data: PropTypes.array,
    onDelete: PropTypes.func,
    hideDeleteButton: PropTypes.bool,
};
export default ProductList;
