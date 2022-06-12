import moment from 'moment';
import { duration } from 'moment';

export const NumberFormat = value => {
    if (!value || (value && value == "")) {
      value = "0";
    }
    value = parseInt(value)
    let money = value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    return money.toString();
  };

  export const ChangeAlias = (alias) => {
    // console.log("change_alias alias ", alias);
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ + /g, " ");
    str = str.trim();
    return str;
  }

  export const DurationDate = (from, to) => {
    let momentFrom = moment()
    let momentTo = moment()
    if (moment(from, 'YYYY-MM-D h:mm:ss', false).isValid()) {
      momentFrom = moment(from, 'YYYY-MM-D h:mm:ss', false);
    }

    if (moment(to, 'YYYY-MM-D h:mm:ss', false).isValid()) {
      momentTo = moment(to, 'YYYY-MM-D h:mm:ss', false);
    }

    return duration(momentTo.diff(momentFrom))
  };