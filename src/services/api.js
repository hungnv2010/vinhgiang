import {API_ROOT} from '../configs';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {InvalidAccessToken, InvalidRequest} from '../errors';

export const unsecuredPost = (uri, data = {}) => {
    const url = `${API_ROOT}/${uri}`;
    return axios.post(url, data, {
        validateStatus: false,
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(res => res.data)
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
            AUTHORIZATION: token,
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

const ApiService = {
    login: async (username, password) => {
        try {
            console.log('login api', username, password);
            const res = await unsecuredPost('signin', {
                login: username,
                password,
                device_token: 'phone_abc',
            });
            console.log('login result=====', res);
            if (res.status === 200) {
                return {...res.data, success: true};
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
        return await post('get_detail_request_order', {name})
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
    getProductCua: async () => {
        return await post('get_product_door')
            .then(res => res.result.data);
    },
    getProductCanh: async () => {
        return await post('get_product_door_leaf')
            .then(res => res.result.data);
    },
    getProductKhung: async () => {
        return await post('get_product_door_frames')
            .then(res => res.result.data);
    },
    getProductPhao: async () => {
        return await post('get_product_phao')
            .then(res => res.result.data);
    },
    getProductOThoang: async () => {
        return await post('get_o_thoang')
            .then(res => res.result.data);
    },
    getMaHuynh: async () => {
        return await post('get_all_ma_huynh');
    },
    getAllColors: async () => {
        return await post('get_all_color_code');
    },
    getProductAttachments: async () => {
        return await post('get_product_attach');
    },
};

export default ApiService;
