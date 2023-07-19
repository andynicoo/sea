/**
 * from-create 新增编辑 重新初始化 from -create
 * @param {*} arr
 * @param {*} data
 * @returns
 */
export const moduleListMap = (arr, data) => {
  return arr.map((item) => {
    if (item.field in data) {
      item.value = data[item.field];
      return item;
    } else {
      return item;
    }
  });
};

/**
 *验证是不是 输入是不是 https 开头
 * @param {*} val
 * @returns
 */
export function validaHttps(rule, value, callback) {
  console.log('验证值', value);
  const reg = /(http|https):\/\/([\w.]+\/?)\S*/;
  if (!reg.test(value) && value && value.length > 0) {
    callback(new Error('链接必须已http 或者 https开头'));
  } else {
    callback();
  }
}

/**
 * 转化 addorder 组件 Lable
 *
 * @param {*} value
 * @returns
 */
export function setTreeLabel(value) {
  value = value == '不使用标签' ? 1 : value;
  if (!!Number(value)) {
    return value == 1 ? null : value == 2 ? '热门' : value == 3 ? '最新' : '限时秒杀';
  } else {
    return value;
  }
}
