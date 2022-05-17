import React, {useState} from 'react';
import {OrderForm, Screen} from '../containers';

const Edit = (props) => {
    const {navigation, route} = props;
    const product = route?.params?.data;
    const title = 'Sửa đơn hàng / ' + product.name;
    const [loading, setLoading] = useState(false);

    /**
     * Send update order api
     * @param order {OrderModel}
     */
    const submit = (order) => {
        setLoading(true);
        order.Update(order)
            .then(res => {
                setLoading(false);
                console.log('update order res', res);
            })
            .catch(e => {
                setLoading(false);
                console.log('update order error', e.message);
            });
    };

    return (
        <Screen header={title} goBack={navigation.goBack}>
            <OrderForm
                mode={'edit'}
                orderName={product.name}
                onSubmit={submit}
                loading={loading}
                submitLabel={'Sửa đơn hàng'}/>
        </Screen>
    );
};

Edit.propTypes = {};

Edit.defaultProps = {};

Edit.route = 'Edit';

export default Edit;
