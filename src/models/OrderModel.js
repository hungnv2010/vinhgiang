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
    'sale': 'Đơn bán hàng',
    'draft': 'Nháp',
    'send': 'Gửi',
};

export default class OrderModel {

    activity_ids = []
    company_id = 1
    currency_id = 23
    date_order = "2022-05-18 14:52:05"
    date_planned = "2022-05-18 05:00:00"
    dest_address_id = false
    fiscal_position_id = false
    incoterm_id = 1
    message_follower_ids = []
    message_ids = []
    notes = '' // dieu khoan
    order_line = []
    origin = false
    partner_id = 7
    partner_ref = false
    payment_term_id = 2
    picking_type_id = 1
    priority = "0"
    receipt_reminder_email = false
    reminder_date_before_receipt = 1
    user_id = 2
    // id = 'New';
    // isRecreated = false;
    // customer = '';
    // bill = 0;
    // lines = [];
    // note = '';
    // name = '';
    // state = '';
    // mobile = '';
    // date_nhan = moment();
    // date_send = moment();
    // date_order = moment();
    // date_validity = '';
    // infor_tranfer = '';
    // sale_order = {id: false, name: false};
    // partner_id = 0;
    // delivery_address = '';
    // infor_receive = '';
    // new_order = 0;
    // ngay_nhan_theo_bao_gia = '';
    // amount_total: 0;

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
            order_line: this.order_line.map(product => product.getRequestData()),
            infor_tranfer: this.infor_tranfer,
            is_app_order: true,
            new_order: false,
            note: this.note,
        };
    }

    addProduct(productData) {
        console.log('add product', productData);
        this.order_line.push(new ProductModel(productData));
    }
}
