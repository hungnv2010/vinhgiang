import {API_ROOT} from '../configs';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {InvalidAccessToken, InvalidRequest} from '../errors';

const convertJsonToPrameter = jsonData => {
    return ( "?" + Object.keys(jsonData)
            .map(function (k) {
                return encodeURIComponent(k) + "=" + encodeURIComponent(jsonData[k]);
            })
            .join("&")
    );
};

export const unsecuredPost = (uri, param = {}) => {
    let jsonParam = {...param}
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

    let jsonParam = {...param}
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
        let e = JSON.parse('{"length": 6, "data": [{"id": 6, "name": "S00006", "create_date": "2022-05-13 17:24:27", "commitment_date": false, "expected_date": "2022-05-13 17:24:28", "partner_id": [20, "Ho\u00e0ng V\u0103n B\u1ea3n(CRM)"], "website_id": false, "user_id": [2, "Ho\u00e0ng V\u0103n B\u1ea3n(CRM)"], "activity_ids": [], "activity_exception_decoration": false, "activity_exception_icon": false, "activity_state": false, "activity_summary": false, "activity_type_id": false, "activity_type_icon": false, "team_id": [1, "Ch\u00e2u \u00c2u"], "tag_ids": [], "warehouse_id": [1, "VINHGIANG"], "company_id": [1, "Ho\u00e0ng V\u0103n B\u1ea3n(CRM)"], "amount_untaxed": 4000000.0, "amount_tax": 400000.0, "amount_total": 4400000.0, "state": "sale", "invoice_status": "no", "message_needaction": false, "currency_id": [23, "VND"]}, {"id": 5, "name": "S00005", "create_date": "2022-05-13 17:23:34", "commitment_date": false, "expected_date": "2022-05-13 17:23:36", "partner_id": [18, "Ho\u00e0ng V\u0103n B\u1ea3n(CRM)"], "website_id": false, "user_id": [2, "Ho\u00e0ng V\u0103n B\u1ea3n(CRM)"], "activity_ids": [], "activity_exception_decoration": false, "activity_exception_icon": false, "activity_state": false, "activity_summary": false, "activity_type_id": false, "activity_type_icon": false, "team_id": [1, "Ch\u00e2u \u00c2u"], "tag_ids": [], "warehouse_id": [1, "VINHGIANG"], "company_id": [1, "Ho\u00e0ng V\u0103n B\u1ea3n(CRM)"], "amount_untaxed": 2000000.0, "amount_tax": 200000.0, "amount_total": 2200000.0, "state": "sale", "invoice_status": "no", "message_needaction": false, "currency_id": [23, "VND"]}, {"id": 4, "name": "S00004", "create_date": "2022-05-05 03:57:36", "commitment_date": false, "expected_date": "2022-05-05 03:57:37", "partner_id": [20, "Ho\u00e0ng V\u0103n B\u1ea3n(CRM)"], "website_id": false, "user_id": [2, "Ho\u00e0ng V\u0103n B\u1ea3n(CRM)"], "activity_ids": [], "activity_exception_decoration": false, "activity_exception_icon": false, "activity_state": false, "activity_summary": false, "activity_type_id": false, "activity_type_icon": false, "team_id": [1, "Ch\u00e2u \u00c2u"], "tag_ids": [], "warehouse_id": [1, "VINHGIANG"], "company_id": [1, "Ho\u00e0ng V\u0103n B\u1ea3n(CRM)"], "amount_untaxed": 6000000.0, "amount_tax": 400000.0, "amount_total": 6400000.0, "state": "sale", "invoice_status": "no", "message_needaction": false, "currency_id": [23, "VND"]}, {"id": 3, "name": "S00003", "create_date": "2022-04-25 08:47:25", "commitment_date": false, "expected_date": "2022-04-25 08:47:49", "partner_id": [19, "Ho\u00e0ng V\u0103n B\u1ea3n(CRM)"], "website_id": false, "user_id": [2, "Ho\u00e0ng V\u0103n B\u1ea3n(CRM)"], "activity_ids": [], "activity_exception_decoration": false, "activity_exception_icon": false, "activity_state": false, "activity_summary": false, "activity_type_id": false, "activity_type_icon": false, "team_id": [1, "Ch\u00e2u \u00c2u"], "tag_ids": [], "warehouse_id": [1, "VINHGIANG"], "company_id": [1, "Ho\u00e0ng V\u0103n B\u1ea3n(CRM)"], "amount_untaxed": 3600000.0, "amount_tax": 360000.0, "amount_total": 3960000.0, "state": "sale", "invoice_status": "no", "message_needaction": false, "currency_id": [23, "VND"]}, {"id": 1, "name": "S00001", "create_date": "2022-04-25 06:54:25", "commitment_date": false, "expected_date": "2022-04-25 06:55:49", "partner_id": [19, "Ho\u00e0ng V\u0103n B\u1ea3n(CRM)"], "website_id": false, "user_id": [2, "Ho\u00e0ng V\u0103n B\u1ea3n(CRM)"], "activity_ids": [], "activity_exception_decoration": false, "activity_exception_icon": false, "activity_state": false, "activity_summary": false, "activity_type_id": false, "activity_type_icon": false, "team_id": [1, "Ch\u00e2u \u00c2u"], "tag_ids": [], "warehouse_id": [1, "VINHGIANG"], "company_id": [1, "Ho\u00e0ng V\u0103n B\u1ea3n(CRM)"], "amount_untaxed": 1400000.0, "amount_tax": 140000.0, "amount_total": 1540000.0, "state": "sale", "invoice_status": "no", "message_needaction": false, "currency_id": [23, "VND"]}, {"id": 2, "name": "S00002", "create_date": "2022-04-25 06:55:24", "commitment_date": false, "expected_date": "2022-04-25 06:55:32", "partner_id": [18, "Ho\u00e0ng V\u0103n B\u1ea3n(CRM)"], "website_id": false, "user_id": [2, "Ho\u00e0ng V\u0103n B\u1ea3n(CRM)"], "activity_ids": [], "activity_exception_decoration": false, "activity_exception_icon": false, "activity_state": false, "activity_summary": false, "activity_type_id": false, "activity_type_icon": false, "team_id": [1, "Ch\u00e2u \u00c2u"], "tag_ids": [], "warehouse_id": [1, "VINHGIANG"], "company_id": [1, "Ho\u00e0ng V\u0103n B\u1ea3n(CRM)"], "amount_untaxed": 540000.0, "amount_tax": 54000.0, "amount_total": 594000.0, "state": "sale", "invoice_status": "no", "message_needaction": false, "currency_id": [23, "VND"]}]}')
        return e;
        // await post('create_request_order', data);
        // return await post('get_all_request_order', search)
        //     .then(res => res.result.data);
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
};

export default ApiService;
