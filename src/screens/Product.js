import React, {useState} from 'react';
import {OrderForm, Screen} from '../containers';

const Product = (props) => {
    const {navigation, route} = props;
    const product = route?.params?.data;
    const title = 'Sản phẩm';
    const [loading, setLoading] = useState(false);

    return (
        <Screen header={title}>
            
        </Screen>
    );
};

Product.propTypes = {};

Product.defaultProps = {};

Product.route = 'Product';

export default Product;
