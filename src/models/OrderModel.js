import {ApiService} from '../services';
import moment from 'moment';
import _ from 'lodash';
import ProductModel from './ProductModel';

export const STATE = {
    'draft': 'Báo giá',
    'sent': 'Đã gửi báo giá',
    'sale': 'Đơn bán hàng',
};

export const INVOICE_STATUS = {
    'no': 'Chưa chuyển cho giao vận',
    'to invoice': 'Giao hàng thành công',
};

//Purchase 
export const STATE_PURCHASE = {
    'draft': 'Y/C Báo giá',
    'sent': 'Đã gửi báo giá',
    'purchase': 'Đơn bán hàng',
};

export const SO_TYPE = {
    'hpc': 'Đơn HPC',
    'sum': 'Đơn tổng hợp',
    'ice': 'Đơn đông lạnh',
}

export default class OrderModel {

    date_order = moment();
    // date_planned = "2022-05-18 05:00:00"
    note = '' // dieu khoan
    order_line = []
    partner_id = null
    phone = ''

    constructor(data = {}) {
        if (data.order_line && _.isArray(data.order_line)) {
            data.order_line = data.order_line.map(item => new ProductModel(item));
        }
        Object.assign(this, data);
    }

    validate() {
        return [];
    }

    getDate(date) {
        if (date.format) {
            return date.format('YYYY-MM-DD hh:mm:ss');
        }
        console.log('date', date);
        return date;
    }

    static async GetOrderList(offset) {
        try {
            return await ApiService.getOrderList(offset);
        } catch (e) {
            console.log('get order list error', e);
            throw e;
        }
    }

    static async GetPurchaseList(offset) {
        try {
            return await ApiService.getPurchaseList(offset);
        } catch (e) {
            console.log('get order list error', e);
            throw e;
        }
    }


    static async getDetail(name) {
        return await ApiService.getDetail(name);
    }

    Create() {
        const data = this.getRequestData();
        //data.date_send = moment().format('YYYY/MM/D h:mm:ss');
        return ApiService.createOrder(data);
    }

    Update(id) {
        const data = this.getRequestData();
        data.id = id;
        return ApiService.editOrder(data);
    }

    getRequestData() {
        return {
            date_order: this.getDate(this.date_order),
            so_type: this.so_type,
            note: this.note, // dieu khoan
            partner_id: this.partner_id,
            order_line: this.order_line.map(product => product.getRequestData()),
        };
    }

    addProduct(productData) {
        console.log('add product', productData);
        this.order_line.push(new ProductModel(productData));
    }
}
