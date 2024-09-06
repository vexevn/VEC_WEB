import { DateFormated } from "./Functions";
let intlLocale = 'en-us'
export default {
  ToDateStr: function (str, format) {
    if (!str) return "";
    str = str || new Date();
    format = format || "DD/MM/YYYY";
    return DateFormated(format, str);
  },
  ToMoneyStr: function (str, decimal_alway) {
    str = str || '0';
    if (str == '0')
      return ''
    // console.log(str)
    let splt = (str + '').split(".");
    let num = splt[0] || 0;
    let decimal = splt[1] || '';
    let numStr = Intl.NumberFormat(intlLocale).format(num);
    if (decimal != '') {
      if (decimal_alway)
        numStr = numStr += '.' + decimal.substring(0, 2).padEnd(2, 0);
      else
        numStr = numStr += '.' + decimal;
    } else if (decimal_alway) {
      numStr = numStr += '.00'
    }
    return numStr;
  },
  /**
  * Parse a localized number to a float.
  * @param {string} stringNumber - the localized number
  */
  ToNumber(stringNumber) {
    stringNumber = stringNumber + ''
    var thousandSeparator = Intl.NumberFormat(intlLocale).format(11111).replace(/\p{Number}/gu, '');
    var decimalSeparator = Intl.NumberFormat(intlLocale).format(1.1).replace(/\p{Number}/gu, '');
    // console.log(stringNumber)
    return parseFloat(stringNumber
      .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
      .replace(new RegExp('\\' + decimalSeparator), '.')
    );
  },
  ToPhoneStr: function (str) {
    str = str || "";
    return str
      .replace(/[^0-9 -]/g, "")
      .replace(/ +/g, " ")
      .replace(/-+/g, "-");
  }
};
