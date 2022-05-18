import React, {useState} from 'react';
import {OrderForm, Screen} from '../containers';

const WareHouse = (props) => {
    const {navigation, route} = props;
    const product = route?.params?.data;
    const title = 'Kho vận';
    const [loading, setLoading] = useState(false);

    return (
        <Screen header={title}>
            
        </Screen>
    );
};

WareHouse.propTypes = {};

WareHouse.defaultProps = {};

WareHouse.route = 'WareHouse';

export default WareHouse;
