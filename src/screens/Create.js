import React, {useState} from 'react';
import {OrderForm, Screen} from '../containers';
import {InvalidAccessToken, InvalidRequest} from '../errors';
import {logout, useAuthDispatch} from '../context';
import messageService from '../services/messages';

const Create = (props) => {
    const {navigation, route} = props;
    const dispatch = useAuthDispatch();

    const goBack = () => {
        if (route?.params?.goBack) {
            route.params.goBack();
        }
        navigation.goBack();
    };

    return <Screen
        header={'Tạo đơn hàng mới'}
        goBack={() => goBack()}>
        <OrderForm
            mode={'create'}
            goBack = {goBack}
        />
    </Screen>;
};

Create.route = 'Create';

export default Create;
