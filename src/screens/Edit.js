import React, {useState} from 'react';
import {OrderForm, Screen} from '../containers';

const Edit = (props) => {
    const {navigation, route} = props;
    const orderData = route?.params?.data;
    const title = 'Sửa đơn hàng / ' + orderData.name;

    const goBack = () => {
        if (route?.params?.goBack) {
            route.params.goBack();
        }
        navigation.goBack();
    };

    return (
        <Screen header={title} goBack={() => goBack()}>
            <OrderForm
                mode={'edit'}
                orderData={orderData}
                orderName={orderData.name}
                goBack = {goBack}
                submitLabel={'Sửa đơn hàng'}/>
        </Screen>
    );
};

Edit.propTypes = {};

Edit.defaultProps = {};

Edit.route = 'Edit';

export default Edit;
