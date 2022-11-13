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

export const put = async (uri, data = {}) => {
    const token = await AsyncStorage.getItem('token');
    const url = `${API_ROOT}/${uri}`;
    return axios.put(url, data, {
        validateStatus: false,
        headers: {
            'Content-Type': 'application/json',
            'access_token': token,
        },
    })
        .then(res => {
            let result = res.data.result? JSON.parse(res.data.result) : {}
            if (result.status === 401) {
                console.log('post response InvalidRequest 400', url);
                throw new InvalidAccessToken(result.message);
            }
            if (result.status === 400) {
                console.log('post response InvalidRequest ===============', url);
                console.log(JSON.stringify(data));
                console.log(res.data);
                console.log('======================');
                throw new InvalidRequest(result);
            }

            if (result.status === 404) {
                console.log('post response InvalidRequest 404', result);
                throw new InvalidAccessToken(result.message);
            }

            if (res.data.error && res.data.error.data) {
                console.log('result.error ==> ', res.error);

                throw new InvalidAccessToken(res.error.data.name);
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
            let result = res.data.result? JSON.parse(res.data.result) : {}
            if (result.status === 401) {
                console.log('post response InvalidRequest 400', url);
                throw new InvalidAccessToken(result.message);
            }
            if (result.status === 400) {
                console.log('post response InvalidRequest ===============', url);
                console.log(JSON.stringify(data));
                console.log(res.data);
                console.log('======================');
                throw new InvalidRequest(result);
            }

            if (result.status === 404) {
                console.log('post response InvalidRequest 404', result);
                throw new InvalidAccessToken(result.message);
            }

            console.log('result.error ==> ', res);

            if (res.data.error && res.data.error.data) {
                console.log('result.error ==> ', res.error);

                throw new InvalidAccessToken(res.error.data.name);
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
    console.log('get url', url);

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
    getOrderList: async (offset) => {
        return await get('sale.order',{order: 'id desc', limit: 20, offset: offset})
            // .then(res => res.result.data);
    },
    createOrder: async (data) => {
        console.log('create order api', JSON.stringify(data));
        return await post('sale.order', data);
    },
    confirmOrder: async (id) => {
        return await post('sale_order/confirm', {sale_order_id: id})
    },
    editOrder: async (data) => {
        console.log('edit order api', JSON.stringify(data));
        return await put('sale.order', data);
    },
    getProductCategory: async () => {
        return await get('product.category')
        //.then(res => res.data);
    },
    getProductAll: async (offset) => {
        return await get('product.product', {limit: 400, offset: offset})
    },
    getProducts: async (offset) => {
        return await get('product.product', {limit: 20, offset: offset})
    },
    getAllColors: async () => {
        return await post('get_all_color_code');
    },
    getProductAttachments: async () => {
        return await post('get_product_attach');
    },
    getAllCustomer: async (offset) => {
        return await get('res.partner', {limit: 400, offset: offset});
    },
    getCustomer: async (offset) => {
        return await get('res.partner', {'order': 'id desc', limit: 20, offset: offset});
    },
    addCustomer: async (body) => {
        return await post('res.partner', body);
    },
    editCustomer: async (body) => {
        return await put('res.partner', body);
    },
    uploadImage: async (body) => {
        return await post('upload_attachment', body);
    },

    getImages:  async (partnerId) => {
        return await get('ir.attachment', {'partner_id': partnerId});
    },

    getStockPickingType: async (body) => {
        return await get('stock.picking.type');
    },

    getStockPicking: async (picking_type_id) => {
        return await get('stock.picking', {'picking_type_id': picking_type_id, 'order': 'id desc'});
    },

    getPurchaseList: async (offset) => {
        return await get('purchase.order', {'order': 'id desc', limit: 20, offset: offset})
            // .then(res => res.result.data);
    },
    getCountry: async () => {
        return await get('res.country')
    },
    getCountryState: async () => {
        return await get('res.country.state')
    },
    getWard: async () => {
        return await get('res.ward')
    },

    getPallet: async () => {
        return await get('stock.quant.package')
    },

    importInPicking: async (data) => {
        return await post('purchase_order/import_in_picking', data);
    },

    getStockLocation: async () => {
        return await get('stock.location')
    },

    confirmImportInPicking: async (data) => {
        return await post('purchase_order/confirm_import_in_picking', data);
    },

    importIntPicking: async (data) => {
        return await post('purchase_order/import_int_picking', data);
    },

    confirmImportIntPicking: async (data) => {
        return await post('purchase_order/confirm_import_int_picking', data);
    },

    importPickOutpicking: async (data) => {
        return await post( 'sale_order/import_picking', data)
    },

    confirmPickOutpicking: async (data) => {
        return await post( 'sale_order/confirm', data);
    },

    packageTransfer: async (data) => {
        return await post( 'stock_picking/package_transfer', data);
    }, 

    stockPickingConfirm: async (data) => {
        return await post( 'stock_picking/confirm', data);
    },

    getUsers: async (offset) => {
        return await get( 'res.users', {limit: 400, offset: offset});
    }, 

    getCoupons: async () => {
        return await get( 'coupon.program');
    }, 

    applyPromotionById: async (data) => {
        return await post( 'sale_order/apply_promotion_by_id', data);
    },

    getPriceList: async () => {
        return await get( 'product.pricelist');
    }, 

};

export default ApiService;
