import React, {useState} from 'react';
import {OrderForm, Screen} from '../containers';

const Customer = (props) => {
    const {navigation, route} = props;
    const product = route?.params?.data;
    const title = 'Khách hàng';
    const [loading, setLoading] = useState(false);

    return (
        <Screen header={title}>
            
        </Screen>
    );
};

Customer.propTypes = {};

Customer.defaultProps = {};

Customer.route = 'Customer';

export default Customer;
