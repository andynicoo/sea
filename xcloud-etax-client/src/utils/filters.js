import util from './util.js';
export default {
  // 格式化为千分位
  formatQianFenWei(val) {
    if (util.isNull(val)) return '0.00';
    return Number(val)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  },
  //截取掉第三位小数
  subStringNum(val) {
    if (util.isNull(val)) return '0.00';
    return util.formatDecimal(val, 2);
  },
  filterDeclarePeriod(declarePeriod) {
    switch (declarePeriod) {
      case 0:
        return '月报';
      case 1:
        return '季报';
      case 2:
        return '年报';
      default:
        return declarePeriod;
    }
  },
  filterKey(value, list, findKey = 'value', filterKey = 'label') {
    let temp = list.find((item) => item[findKey] === value);
    return temp ? temp[filterKey] : value;
  },
};
