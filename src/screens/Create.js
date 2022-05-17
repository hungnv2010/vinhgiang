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
                console.log(res);
                if (res.error) {
                    messageService.showError('Gặp lỗi khi gửi đơn hàng: ' + res.error.data.message);
                    setLoading(false);
                    return;
                }
                messageService.showInfo('Tạo đơn hàng mới thành công');
               goBack();
                // if (res.message === 'CREATED'
                //     || (res.status >= 200 && res.status <= 299)) {
                //     messageService.showInfo('Tạo đơn hàng mới thành công');
                //     navigation.goBack();
                // } else {
                //     let msg = 'Tạo đơn hàng mới thất bại';
                //     if (res.message) {
                //         msg += '\n' + res.message;
                //     }
                //     messageService.showError(msg);
                // }
                setLoading(false);
            })
            .catch(e => {
                setLoading(false);
                if (InvalidAccessToken.compare(e)) {
                    logout(dispatch).catch(le => console.error('logout error', le));
                    return;
                }
                if (InvalidRequest.compare(e)) {
                    console.log('invalid request', JSON.stringify(e));
                    let msg = e.message;
                    msg += '\n' + 'Nếu lỗi liên quan đến sai thông tin sản phẩm, xin hãy xoá sản phẩm và tạo lại!';
                    messageService.showError(msg);
                    return;
                }
                console.log(e.message);
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
