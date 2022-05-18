import React, {useState} from 'react';
import {OrderForm, Screen} from '../containers';

const Sell = (props) => {
    const {navigation, route} = props;
    const product = route?.params?.data;
    const title = 'Bán hàng';
    const [loading, setLoading] = useState(false);

    return (
        <Screen header={title}>
            
        </Screen>
    );
};

Sell.propTypes = {};

Sell.defaultProps = {};

Sell.route = 'Sell';

export default Sell;
