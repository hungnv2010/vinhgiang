import {ApiService} from '../services';
import _ from 'lodash';
import {MOCK_DATA} from '../mock_data';

export default class ProductModel {

    //#region Const
    //product_name: string;
    name: string; // mo ta
    //product_id: number;
    product_id: {};
    product_uom_qty: number;
    discount: number;
    //product_uom: string;
    product_uom: {};
    price_unit: number;
    x_discount_amount : number;

    //#endregion
    constructor(data = {}) {
        // if (data.product_id && _.isObject(data.product_id)) {
        //     this.product_name = data.product_id.name;
        //     this.product_id = data.product_id.id;
        // }
        // if (data.product_uom && _.isObject(data.product_uom)) {
        //     this.product_uom = data.product_uom.name;
        // }
        ProductModel.resetData(this);
        Object.assign(this, data);
    }

    getRequestData() {
        console.log('getRequestData', this);
        const data = JSON.parse(JSON.stringify(this));

        if (data.product_id && _.isObject(data.product_id)) {
            data.product_id = data.product_id.id;
        }

        if (data.product_uom_qty && _.isArray(data.product_uom_qty)) {
            data.product_uom_qty_id = data.product_uom_qty[0];
        }

        delete data.product_uom;
        return data;
    }

    static async getProducts() {
      await ApiService.getProductAll()
    }

    static resetData(data) {
        data.name = "";
        data.product_id = {id: null, name: ""};
        data.product_uom_qty = 0;
        data.discount = 0;
        data.product_uom = {id: null, name: ""};
        data.price_unit = 0;
        data.x_discount_amount = 0;
    
        return data;
    }
}
