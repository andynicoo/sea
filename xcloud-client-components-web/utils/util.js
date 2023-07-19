/** 乘法精度丢失一分 test
 * @param {*}  arg1 数值 arg2 100 列如：0.009,100 返回0.9
 */
export function floatMultiply(arg1, arg2) {
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split('.')[1].length;
  } catch (e) {}
  try {
    m += s2.split('.')[1].length;
  } catch (e) {}
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
}

export const formatDecimal = (num, decimal) => {
  num = num.toString();
  let index = num.indexOf('.');
  if (index !== -1) {
    num = num.substring(0, decimal + index + 1);
  } else {
    num = num.substring(0);
  }
  return parseFloat(num).toFixed(decimal);
};
/**
 *
 */
export const debounce = (fn, duration = 200) => {
  let timer = null;
  return function() {
    let that = this, // this对象
      args = arguments; // 参
    clearTimeout(timer);
    timer = setTimeout(() => {
      // console.log(args);
      that[fn](...args); // vue用法
    }, duration);
  };
};
/**
 * 加减法
 * @param {*} arr
 * @returns
 */
export function countSum(arr) {
  if (!arr.length) return 0;
  arr = arr.map((v) => {
    if (v && !Number.isNaN(Number(v))) return Math.round(v * 100);
    return 0;
  });
  const result = arr.reduce((prev, curr) => {
    return prev + curr;
  }, 0);
  return result / 100;
}

/** 除法
 * @param { number } num1
 * @param { number } num2
 */
export function division(num1, num2) {
  let t1, t2, r1, r2;
  try {
    t1 = num1.toString().split('.')[1].length;
  } catch (e) {
    t1 = 0;
  }
  try {
    t2 = num2.toString().split('.')[1].length;
  } catch (e) {
    t2 = 0;
  }
  r1 = Number(num1.toString().replace('.', ''));
  r2 = Number(num2.toString().replace('.', ''));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}

// 图片url 转base64
export const toBase64URL = (url) =>
  fetch(url, { mode: 'no-cors' })
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );
//获取枚举列表
export function getEnumObj(list, key = 'value') {
  let obj = {};
  let arr = list.map((item) => item[key]);
  arr.forEach((item) => {
    obj[item] = item;
  });
  return obj;
}
