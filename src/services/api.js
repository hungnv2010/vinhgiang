import { API_ROOT } from '../configs';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { InvalidAccessToken, InvalidRequest } from '../errors';

const convertJsonToPrameter = jsonData => {
    return ("?" + Object.keys(jsonData)
        .map(function (k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(jsonData[k]);
        })
        .join("&")
    );
};

export const unsecuredPost = (uri, param = {}) => {
    let jsonParam = { ...param }
    let params = jsonParam ? convertJsonToPrameter(jsonParam) : "";

    const url = `${API_ROOT}/${uri}${params}`;
    return axios.get(url, [], {
        validateStatus: false,
        headers: {
            'Content-Type': 'text/plain',
        },
    })
        // .then(res => res.data)
        .catch(e => {
            console.error('post error', e);
            throw e;
        });
};

export const post = async (uri, data = {}) => {
    const token = await AsyncStorage.getItem('token');
    const url = `${API_ROOT}/${uri}`;
    return axios.post(url, data, {
        validateStatus: false,
        headers: {
            'Content-Type': 'application/json',
            'access_token': token,
        },
    })
        .then(res => {
            if (res.status === 401) {
                throw new InvalidAccessToken(res.data?.message);
            }
            if (res.status === 400) {
                console.log('post response InvalidRequest ===============', url);
                console.log(JSON.stringify(data));
                console.log(res.data);
                console.log('======================');
                throw new InvalidRequest(res.data.result);
            }
            return res.data;
        })
        .catch(e => {
            if (e.message?.includes('Accesstoken is not valid')) {
                throw new InvalidAccessToken(e.message);
            }
            throw e;
        });
};

export const get = async (uri, param = {}) => {
    const token = await AsyncStorage.getItem('token');

    let jsonParam = { ...param }
    let params = jsonParam ? convertJsonToPrameter(jsonParam) : "";

    const url = `${API_ROOT}/${uri}${params}`;
    return axios.get(url, {
        validateStatus: false,
        headers: {
            'Content-Type': 'text/html',
            'access_token': token,
        },
    })
        .then(res => {
            if (res.status === 401) {
                throw new InvalidAccessToken(res.data?.message);
            }
            if (res.status === 400) {
                console.log('get response InvalidRequest ===============', url);
                console.log(JSON.stringify(data));
                console.log(res.data);
                console.log('======================');
                throw new InvalidRequest(res.data.result);
            }
            return res.data;
        })
        .catch(e => {

            console.log('get error ', e);

            if (e.message?.includes('Accesstoken is not valid')) {
                throw new InvalidAccessToken(e.message);
            }
            throw e;
        });
};

const ApiService = {
    login: async (username, password) => {
        try {
            console.log('login api', username, password);
            const res = await unsecuredPost('auth/token', {
                login: username,
                password,
                // device_token: 'phone_abc',
            });
            if (res.status === 200) {
                return { ...res.data, success: true };
            }
            return {
                success: false,
                message: res.message,
                status: res.status,
            };
        } catch (e) {
            console.log(e);
            throw e;
        }
    },
    getDetail: async (name) => {
        return await post('get_detail_request_order', { name })
            .then(res => res.result.data);
    },
    getOrderList: async (search = {}) => {
        return await post('get_all_request_order', search)
            .then(res => res.result.data);
    },
    createOrder: async (data) => {
        console.log('create order api', JSON.stringify(data));
        return await post('create_request_order', data);
    },
    editOrder: async (data) => {
        console.log('update order api', JSON.stringify(data));
        return await post('edit_request_order', data);
    },
    getProductCategory: async () => {
        return await get('product.category')
        //.then(res => res.data);
    },
    getProductAll: async () => {
        return await get('product.product')
        //.then(res => res.result.data);
    },
    getAllColors: async () => {
        return await post('get_all_color_code');
    },
    getProductAttachments: async () => {
        return await post('get_product_attach');
    },
    getCustomer: async () => {
        return await get('res.partner');
    },
    addCustomer: async (body) => {
        return await post('res.partner', body);
    },
    editCustomer: async (body) => {
        return await put('res.partner', body);
    }
};

export default ApiService;
