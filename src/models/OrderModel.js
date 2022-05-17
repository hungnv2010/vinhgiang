import {ApiService} from '../services';
import moment from 'moment';
import _ from 'lodash';
import ProductModel from './ProductModel';

export const LIST_THONG_TIN_NHAN_HANG = {
    khach_lay: 'Tại nhà máy',
    send: 'Nhà máy gửi hàng',
    ship: 'Nhà máy vận chuyển',
    '': '',
};

export const STATE = {
    'darft': 'Nháp',
    'draft': 'Nháp',
    'send': 'Gửi',
};

export default class OrderModel {
    id = 'New';
    isRecreated = false;
    customer = '';
    bill = 0;
    lines = [];
    note = '';
    name = '';
    state = '';
    mobile = '';
    date_nhan = moment();
    date_send = moment();
    date_order = moment();
    date_validity = '';
    infor_tranfer = '';
    sale_order = {id: false, name: false};
    partner_id = 0;
    delivery_address = '';
    infor_receive = '';
    new_order = 0;
    ngay_nhan_theo_bao_gia = '';
    amount_total: 0;

    constructor(data = {}) {
        if (data.lines && _.isArray(data.lines)) {
            data.lines = data.lines.map(item => new ProductModel(item));
        }
        Object.assign(this, data);
    }

    validate() {
        return [];
    }

    getDate(date) {
        if (date.format) {
            return date.format('YYYY/MM/D h:mm:ss');
        }
        console.log('date', date);
        return date;
    }

    static async GetOrderList(page = 1) {
        try {
            return await ApiService.getOrderList({page});
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
        data.date_send = moment().format('YYYY/MM/D h:mm:ss');
        return ApiService.createOrder(data);
    }

    Update() {
        const data = this.getRequestData();
        data.order_name = this.name;
        return ApiService.editOrder(data);
    }

    getRequestData() {
        return {
            infor_receive: this.infor_receive,
            date_nhan: this.getDate(this.date_nhan),
            lines: this.lines.map(product => product.getRequestData()),
            infor_tranfer: this.infor_tranfer,
            is_app_order: true,
            new_order: false,
            note: this.note,
        };
    }

    addProduct(productData) {
        console.log('add product', productData);
        this.lines.push(new ProductModel(productData));
    }
}
