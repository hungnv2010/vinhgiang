import React, {useState} from 'react';
import {OrderForm, Screen} from '../containers';
import {InvalidAccessToken, InvalidRequest} from '../errors';
import {logout, useAuthDispatch} from '../context';
import messageService from '../services/messages';

const Create = (props) => {
    const {navigation, route} = props;
    const [loading, setLoading] = useState(false);
    const dispatch = useAuthDispatch();

    const goBack = () => {
        if (route?.params?.goBack) {
            route.params.goBack();
        }
        navigation.goBack();
    };

    const submit = (order) => {
        setLoading(true);
        order.Create(order)
            .then(res => {
                console.log("order.Create ",res);
                messageService.showSuccess(`Tạo đơn thành công`);
                goBack()
            })
            .catch(err => {
                setLoading(false);
                messageService.showError(`Có lỗi trong quá trình xử lý \n ${err}`);
                console.log("confirmImportInPicking err ", err);
            });
    };

    return <Screen
        header={'Tạo đơn hàng mới'}
        goBack={() => goBack()}>
        <OrderForm
            mode={'create'}
            onSubmit={submit}
            loading={loading}/>
    </Screen>;
};

Create.route = 'Create';

export default Create;
