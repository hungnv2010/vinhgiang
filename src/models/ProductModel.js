import {ApiService} from '../services';
import _ from 'lodash';
import {MOCK_DATA} from '../mock_data';

const USE_MOCK_DATA = true;

export const TYPE = {
    CUA: 'cua',
    CANH: 'canh',
    KHUNG: 'khung',
    PHAO: 'phao',
    O_THOANG: 'o_thoang',
};

export const TYPE_NAMES = [
    {name: 'Cửa', value: TYPE.CUA},
    {name: 'Cánh', value: TYPE.CANH},
    {name: 'Khung', value: TYPE.KHUNG},
    {name: 'Phào', value: TYPE.PHAO},
    {name: 'Ô thoáng', value: TYPE.O_THOANG},
];

export const LIST_QUY_CACH_CANH = {
    '1_canh': '1 Cánh',
    '2_canh_can': '2 Cánh cân',
    '2_canh_lech': '2 Cánh lệch',
    '3_canh_can': '3 Cánh cân',
    '4_canh_can': '4 Cánh cân',
    '4_canh_lech': '4 Cánh lệch',
    'fix': 'Fix',
};

export const LIST_CHIEU_MO = {
    'trong': 'Mở trong',
    'ngoai': 'Mở ngoài',
    't-trai': 'Trong - Bản lề trái',
    't-phai': 'Trong - Bản lề phải',
    'n-trai': 'Ngoài - Bản lề trái',
    'n-phai': 'Ngoài - Bản lề phải',
    'khong': 'Không',
};

export const LIST_LOAI_PHAO_ROI = {
    '1-mat': '1 mặt',
    '2-mat': '2 mặt',
};

export const LIST_SONG_CUA = {
    'khong': 'Không',
    'cstd-k': 'Song tròn dọc không đố',
    'cs1': 'Song tròn dọc, 1 đố',
    'cs2': 'Song tròn dọc, 2 đố',
    'cstn-k': 'Song tròn ngang không đố',
    'cs3': 'Song tròn ngang, 1 đố',
    'cs4': 'Song tròn ngang, 2 đố',
    'csvd-k': 'Song vuông dọc không đố',
    'cs5': 'Song vuông dọc, 1 đố',
    'cs6': 'Song vuông dọc, 2 đố',
    'csvn-k': 'Song vuông ngang không đố',
    'cs7': 'Song vuông ngang, 1 đố',
    'cs8': 'Song vuông ngang, 2 đố',
};

export const LIST_PHAO_LIEN_KHUNG = {
    'vat_trong': 'Vát, Trong',
    'vat_ngoai': 'Vát, Ngoài',
    'cong_trong': 'Cong, Trong',
    'cong_ngoai': 'Cong, Ngoài',
    'tk': 'Thiết kế',
    'khong': 'Không',
};

export const LIST_PHAO_DAI = {
    'PD200': 'Phào đại - 200',
    'PD250': 'Phào đại - 250',
    'thiet_ke': 'Phào theo thiết kế',
    'khong': 'Không',
};

export const LIST_PHAO_ROI = {'roi20': 'Có', 'khong': 'Không'};

export const LIST_KIEU_O_THOANG = {
    'kinh': 'Kính',
    'nan_chop': 'Nan chớp',
    'fix': 'Fix Huỳnh',
    'vom_kinh': 'Vòm kính',
    'vom_nan_chop': 'Vòm nan chớp',
    'hoa_sen': 'Hoa sen',
    'khong': 'Không',
};

export const LIST_DOORSIL = {
    'no': 'Không',
    '201-noi': '201 - Nổi',
    '201-am': '201 - Âm',
    '304-noi': '304 - Nổi',
    '304-am': '304 - Âm',
};

export default class ProductModel {

    //#region Const
    product_name: string;
    type_of_sale: TYPEA;
    sequence: number;
    product_id: {};
    qty_cai: number;
    chieu_cao: number;
    chieu_rong: number;
    rong_thong_thuy: number;
    cao_thong_thuy: number;
    song_cua: string;
    ma_huynh_giua: {};
    ma_huynh_ngoai: {};
    quy_cach_canh: string;
    chieu_mo: string;
    day_canh: number;
    day_khung: number;
    phao_lien_khung: string;
    paint_color: number;
    phao_dai: string;
    phao_roi: string;
    loai_phao_roi: string;
    kieu_o_thoang: string;
    doorsil: string;
    phu_kien: string;
    color: string;
    note: string;
    choose_product_attach: number; // Sản phẩm đính kèm
    product_attach_ids: [];

    //#endregion
    constructor(data = {}) {
        if (data.product_id && _.isObject(data.product_id)) {
            this.product_name = data.product_id.name;
        }
        // if (data.ma_huynh_giua && _.isObject(data.ma_huynh_giua)) {
        //   data.ma_huynh_giua = data.ma_huynh_giua.name;
        // }
        ProductModel.resetData(this);
        this.type_of_sale = TYPE.CUA;
        Object.assign(this, data);
    }

    /**
     * Return errors list
     * @param visible {}
     * @param required {}
     * @returns {string[]}
     */
    validate(visible, required) {
        const errors = [];
        if (!this.product_id || this.product_id.id <= 0) {
            errors.push('Chưa chọn sản phẩm');
        }
        if (this.qty_cai <= 0) {
            errors.push('Chưa chọn số lượng');
        }
        if (!this.chieu_rong) {
            errors.push('Chưa điền chiều rộng');
        }
        if (!this.chieu_cao) {
            errors.push('Chưa điền chiều cao');
        }
        if (!visible.rong_thong_thuy) {
            this.rong_thong_thuy = 0;
        } else if (required.rong_thong_thuy && this.rong_thong_thuy <= 130) {
            errors.push('Thông số Rộng thông thủy phải lớn hơn 130');
        }
        if (!visible.cao_thong_thuy) {
            this.cao_thong_thuy = 0;
        } else if (required.cao_thong_thuy && this.cao_thong_thuy <= 130) {
            errors.push('Thông số Cao thông thủy phải lớn hơn 130');
        }
        if (!visible.song_cua) {
            this.song_cua = 'khong';
        } else if (required.song_cua && this.song_cua === 'khong') {
            errors.push('Chưa chọn song cửa');
        }
        if (!visible.ma_huynh_giua) {
            this.ma_huynh_giua = {id: 0, name: ''};
        } else if (required.ma_huynh_ngoai && !this.ma_huynh_ngoai?.id) {
            errors.push('Chưa chọn mã huỳnh cánh giữa');
        }
        if (!visible.ma_huynh_ngoai) {
            this.ma_huynh_ngoai = {id: 0, name: ''};
        } else if (required.ma_huynh_ngoai && !this.ma_huynh_ngoai?.id) {
            errors.push('Chưa chọn mã huỳnh cánh ngoài');
        }
        if (!visible.chieu_mo) {
            this.chieu_mo = 'khong';
        } else if (required.chieu_mo && this.chieu_mo === 'khong') {
            errors.push('Chưa chọn chiều mở');
        }
        if (!visible.day_khung) {
            this.day_khung = 0;
        } else if (required.day_khung && (this.day_khung < 90 || this.day_khung > 999)) {
            errors.push('Giá trị dày khung phải nằm trong khoảng [90, 999]');
        }
        if (!visible.phu_kien) {
            this.phu_kien = '';
        }
        if (!this.color) {
            errors.push('Chưa chọn màu sơn');
        }
        if (!visible.choose_product_attach) {
            this.choose_product_attach = false;
            this.product_attach_ids = [];
        }
        return errors;
    }

    getRequestData() {
        console.log('getRequestData', this);
        const data = JSON.parse(JSON.stringify(this));
        if (data.product_id.id) {
            data.product_id = data.product_id.id;
        }
        if (data.ma_huynh_giua?.id) {
            data.ma_huynh_giua = data.ma_huynh_giua.id;
        } else {
            delete data.ma_huynh_giua;
        }
        if (data.ma_huynh_ngoai?.id) {
            data.ma_huynh_ngoai = data.ma_huynh_ngoai.id;
        } else {
            delete data.ma_huynh_ngoai;
        }
        delete data.product_name;
        return data;
    }

    static getAllColors() {
        return ApiService.getAllColors()
            .then(res => {
                if (!res.result?.data) {
                    throw new Error('Cannot get colors');
                }
                return res.result.data;
            })
            .catch(e => {
                console.log('get color code failed', e);
            });
    }

    static async getProducts(type = TYPE.CUA) {
        switch (type) {
            case TYPE.CUA:
                return await ApiService.getProductCua();
            case TYPE.CANH:
                return await ApiService.getProductCanh();
            case TYPE.KHUNG:
                return await ApiService.getProductKhung();
            case TYPE.PHAO:
                return await ApiService.getProductPhao();
            case TYPE.O_THOANG:
                return await ApiService.getProductOThoang();
            default:
                throw new Error('Invalid product type', type);
        }
    }

    static async getMaHuynh() {
        try {
            const data = await ApiService.getMaHuynh();
            return data.result.data;
        } catch (e) {
            throw new Error('getMaHuynh exception', e);
        }
    }

    static async getAttachments() {
        try {
            const data = await ApiService.getProductAttachments();
            return data.result.data;
        } catch (e) {
            throw new Error('getAttachments exception', e);
        }
    }

    static getVisible(data) {
        let rong_thong_thuy = [TYPE.CUA, TYPE.KHUNG].includes(data.type_of_sale);
        if (data.type_of_sale === TYPE.CUA && data.product_id?.name && data.product_id?.name?.includes('Cửa đi')) {
            rong_thong_thuy = false;
        }

        return {
            qty: ![TYPE.KHUNG, TYPE.PHAO].includes(data.type_of_sale),
            qty_total: ![TYPE.KHUNG, TYPE.PHAO].includes(data.type_of_sale),
            rong_thong_thuy,
            cao_thong_thuy: ![TYPE.O_THOANG, TYPE.CANH, TYPE.PHAO].includes(data.type_of_sale),
            song_cua: ![TYPE.CANH, TYPE.PHAO, TYPE.O_THOANG].includes(data.type_of_sale)
                && ['cua_so', 'khung'].includes(data.product_id?.chung_loai),
            ma_huynh_giua: ![TYPE.KHUNG, TYPE.PHAO].includes(data.type_of_sale),
            ma_huynh_ngoai: ![TYPE.KHUNG, TYPE.PHAO, TYPE.O_THOANG].includes(data.type_of_sale)
                && !['1_canh', '2_canh_can'].includes(data.product_id?.quy_cach_canh),
            quy_cach_canh: ![TYPE.PHAO, TYPE.O_THOANG].includes(data.type_of_sale),
            chieu_mo: data.type_of_sale !== TYPE.PHAO,
            day_canh: ![TYPE.KHUNG, TYPE.PHAO, TYPE.O_THOANG].includes(data.type_of_sale),
            day_khung: ![TYPE.PHAO, TYPE.CANH].includes(data.type_of_sale),
            phao_lien_khung: ![TYPE.CANH, TYPE.PHAO].includes(data.type_of_sale),
            phao_dai: ![TYPE.CANH, TYPE.PHAO, TYPE.KHUNG, TYPE.O_THOANG].includes(data.type_of_sale),
            phao_roi: ![TYPE.PHAO, TYPE.CANH].includes(data.type_of_sale),
            loai_phao_roi: ![TYPE.CANH, TYPE.KHUNG, TYPE.CUA, TYPE.O_THOANG].includes(data.type_of_sale)
                || (data.phao_roi !== 'khong'),
            kieu_o_thoang: ![TYPE.CANH, TYPE.PHAO].includes(data.type_of_sale),
            phu_kien: ![TYPE.PHAO].includes(data.type_of_sale),
            doorsil: [TYPE.CUA, TYPE.KHUNG].includes(data.type_of_sale),
            choose_product_attach: ![TYPE.PHAO].includes(data.type_of_sale),
        };
    }

    static getRequires(data) {
        let thong_thuy_require = data.type_of_sale === TYPE.CUA 
                            && ( data.product_id?.kieu_o_thoang != 'khong'
                                || (data.song_cua && data.song_cua != 'khong'))
        return {
            qty_cai: true,
            chieu_rong: true,
            chieu_cao: true,
            rong_thong_thuy: thong_thuy_require,
            cao_thong_thuy: thong_thuy_require,
            song_cua: data.type_of_sale === TYPE.CUA,
            ma_huynh_giua: [TYPE.CUA, TYPE.CANH].includes(data.type_of_sale),
            ma_huynh_ngoai: !['1_canh', '2_canh_can'].includes(data.product_id?.quy_cach_canh),
            quy_cach_canh: false,
            chieu_mo: [TYPE.CUA, TYPE.CANH, TYPE.O_THOANG].includes(data.type_of_sale),
            day_canh: false,
            day_khung: [TYPE.CUA, TYPE.KHUNG, TYPE.O_THOANG].includes(data.type_of_sale),
            phao_lien_khung: false,
            phao_dai: false,
            phao_roi: false,
            loai_phao_roi: data.phao_roi === 'roi20',
            kieu_o_thoang: false,
            doorsil: false,
        };
    }

    static resetData(data) {
        data.product_name = '';
        data.product_id = {id: 0, name: '', chung_loai: ''};
        data.qty_cai = 0;
        data.chieu_rong = 0;
        data.chieu_cao = 0;
        data.chieu_mo = '';
        data.rong_thong_thuy = 0;
        data.cao_thong_thuy = 0;
        data.song_cua = '';
        data.ma_huynh_giua = {id: 0, name: ''};
        data.ma_huynh_ngoai = {id: 0, name: ''};
        data.quy_cach_canh = '';
        data.chieu_mo = '';
        data.day_canh = 0;
        data.day_khung = 0;
        data.phao_lien_khung = 'khong';
        data.paint_color = 0;
        data.phao_dai = 'khong';
        data.phao_roi = 'khong';
        data.loai_phao_roi = '';
        data.kieu_o_thoang = 'khong';
        data.doorsil = 'no';
        data.phu_kien = '';
        data.color = '';
        data.note = '';
        data.choose_product_attach = 0; // Sản phẩm đính kèm
        data.product_attach_ids = [];
        return data;
    }
}
