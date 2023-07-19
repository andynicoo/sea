/*
 * js工具类集合

 */
import { getUserInegralMessage } from '@/api/user/integralMal.js';
import { Message } from 'view-design';
import Vue from 'vue';
export default {
  /** 不四舍五入 保留两位小数
   * @param {*}   列如132.45646456,2 返回132.45
   */
  formatDecimal(num, decimal) {
    num = num.toString();
    let index = num.indexOf('.');
    if (index !== -1) {
      num = num.substring(0, decimal + index + 1);
    } else {
      num = num.substring(0);
    }
    return parseFloat(num).toFixed(decimal);
  },

  // 图片转换
  convertImage(data) {
    try {
      data = JSON.parse(data);
    } catch (error) {
      try {
        if (typeof data === 'string') {
          data = data.split(',').filter((i) => i);
        }
      } catch (e) {}
    }
    let result = data.map((item) => item.replace('http://', 'https://'));
    return result;
  },

  /** 乘法精度丢失一分
   * @param {*}  arg1 数值 arg2 100 列如：0.009,100 返回0.9
   */
  floatMultiply(arg1, arg2) {
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
  },
  /**
   * 日期Date格式化为日期字符串
   * @param {Date} date 可以为空，默认当前日期；也可以指定任意日期Date
   * @param {String} formatStr 需要转换的日期字符串格式，支持yyyy/MM/dd HH:mm:ss，dd/MM/yyyy HH:mm:ss等多种常用的格式；默认转为yyyy-MM-dd
   * @returns 返回指定格式的日期字符串
   */
  formatDateToStr(date = new Date(), formatStr = 'yyyy-MM-dd') {
    // 日期字符串格式化
    let o = {
      'M+': date.getMonth() + 1, // 月
      'd+': date.getDate(), // 日
      'h+': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
      'H+': date.getHours(), // 24小时制
      'm+': date.getMinutes(), // 分钟
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), //季度
      S: date.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(formatStr)) {
      formatStr = formatStr.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(formatStr))
        formatStr = formatStr.replace(
          RegExp.$1,
          RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        );
    }
    return formatStr;
  },
  /**
   * 获得日期DateTime字符串，默认为当前时间
   * @param {Date} date 可以为空，默认当前日期；也可以指定任意日期Date
   * @param {String} separator 年月日分隔符，默认“-”
   * @returns 返回yyyy-MM-dd HH:mm:ss格式的时间字符串
   */
  getDefaultDateTime(date = new Date(), separator = '-') {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    return [year, month, day].map(this.digit).join(separator) + ' ' + [hour, minute, second].map(this.digit).join(':');
  },
  /**
   * 获得日期Date字符串，默认为当前日期
   * @param {Date} date 可以为空，默认当前日期；也可以指定任意日期Date
   * @param {String} separator 年月日分隔符，默认“-”分隔
   * @returns 返回yyyy-MM-dd格式的日期字符串
   */
  getDefaultDate(date = new Date(), separator = '-') {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return [year, month, day].map(this.digit).join(separator);
  },
  /**
   * 获得加减月数后的日期
   * @param {Date} date 可以为空，默认当前日期；也可以指定任意日期Date
   * @param {Number} num 加减月数的数量，用-1和+1月表示
   * @returns 返回加减月数后的日期Date
   */
  getDiffMonth(date = new Date(), num = +1) {
    date.setMonth(date.getMonth() + num);
    return date;
  },
  /**
   * 格式化时间戳为日期Date
   * @param {Number} timestamp 时间戳
   * @returns 返回日期Date
   */
  formatTimestampToDate(timestamp) {
    if (this.isNull(timestamp) || timestamp == 0) return;
    return new Date(timestamp);
  },

  /**
   * 判断值是否为空，支持空字符串，null，undefined，Object，String，Number，Date
   * @param {*} value 验证的值
   * @returns 返回true和false
   */
  isNull(value) {
    return (
      value == undefined ||
      value == null ||
      value == '' ||
      (this.isObject(value) && Object.keys(value).length == 0) ||
      value.length == 0
    );
  },

  /**
   * 判断是否是Object
   * @param {*} value 参数
   * @returns 返回true和false
   */
  isObject(value) {
    return Object.prototype.toString.call(value).slice(8, -1) === 'Object';
  },

  /**
   * 导出pdf
   * @param {*} content
   */
  exporPdf(content) {
    let timestamp = new Date().getTime();
    let elink = document.createElement('a');
    let blob = new Blob([content]);
    elink.download = timestamp + '.pdf';
    elink.style.display = 'none';
    elink.href = URL.createObjectURL(blob);
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
  },
  /**
   * 下载文件到本地
   * @param {*} url
   */
  downloadFile(url, name) {
    let newUrl = url.replace('http://', 'https://');
    let timestamp = new Date().getTime();
    var a = document.createElement('a');
    let fileName = newUrl.split('.').pop().toLowerCase();
    a.download = (name || timestamp) + '.' + fileName;
    a.href = newUrl;
    a.target = newUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  },

  /**
   * 后端返回文件流下载
   * @param {*} content
   */
  downFile(url, fileName, suffix = 'zip') {
    // 判定是跨税云客户端还是跨企云客户端，跨企云客户端 envpla === 'kqy'，否则为空
    let envpla = Vue.prototype.envpla;

    const fileReader = new FileReader();
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('token', localStorage.getItem('token'));
    xhr.setRequestHeader('sessionId', localStorage.getItem('sessionId'));
    if (envpla === 'kqy') {
      xhr.setRequestHeader('enterprisecode', 'jy17jue17v3');
    } else {
      xhr.setRequestHeader('enterprisecode', 'ksy');
    }
    xhr.responseType = 'blob';
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        const content = xhr.response;
        fileReader.onloadend = () => {
          try {
            const jsonData = JSON.parse(fileReader.result); // 说明是普通对象数据，后台转换失败
            Message.error(jsonData.message || '当前模板未配置，请联系管理员');
          } catch (err) {
            let fileSuffix = xhr.getResponseHeader('fileSuffix') || suffix; //获取文件格式
            if (!fileName) {
              let disposition = xhr.getResponseHeader('Content-Disposition').split('=');
              if (disposition.length > 1) {
                fileName = decodeURI(disposition[1].replace(/^(UTF-8'')(.*)$/, '$2'));
              }
            }
            let timestamp = new Date().getTime();
            let name = fileName || timestamp;
            let elink = document.createElement('a');
            let blob = new Blob([content]);
            elink.style.display = 'none';
            elink.href = URL.createObjectURL(blob);
            elink.download = name + '.' + fileSuffix;
            document.body.appendChild(elink);
            elink.click();
            document.body.removeChild(elink);
          }
        };
        fileReader.readAsText(new Blob([content]));
      }
    };
  },
  // 二进制文件流下载
  fileStreamDownload(data, name = '导出文件') {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }); // for .xlsx files
    // 通过URL.createObjectURL生成文件路径
    const url = window.URL.createObjectURL(blob);
    const ele = document.createElement('a');
    ele.style.display = 'none';
    ele.href = url;
    ele.download = name;
    document.body.appendChild(ele);
    ele.click();
    ele.remove();
  },
  /**
   * 金额计算
   */
  // 相乘
  accMul(arg1, arg2) {
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
  },
  // 相减
  accSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = r1 >= r2 ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
  },
  // 加法
  accAdd(arg1, arg2) {
    var r1, r2, m;
    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m;
  },
  // 保留两位小数
  formatPrice(val = '') {
    return `${val}`.replace(/[^\d.]-/g, '').replace(/^(\d*.\d{2})(\d{0,})$/, '$1');
  },
  // 四舍五入，有小数则保留两位，五小数则为整数
  toDecimalRound(num) {
    if (isNaN(num) || (!num && num !== 0)) {
      return 0;
    }
    return Math.round(num * 100) / 100;
  },
  // 非四舍五入保留小数，默认保留2位
  toDecimal(num, decimals = 2) {
    if (isNaN(num) || (!num && num !== 0)) {
      return '--';
    }
    // 默认为保留的小数点后两位
    let dec = decimals;
    let tempNum = Number(num);
    let pointIndex = String(tempNum).indexOf('.') + 1; // 获取小数点的位置 + 1
    let pointCount = pointIndex ? String(tempNum).length - pointIndex : 0; // 获取小数点后的个数(需要保证有小数位)
    // 源数据为整数或者小数点后面小于decimals位的作补零处理
    if (pointIndex === 0 || pointCount <= dec) {
      let tempNumA = tempNum;
      if (pointIndex === 0) {
        tempNumA = `${tempNumA}.`;
        for (let index = 0; index < dec - pointCount; index++) {
          tempNumA = `${tempNumA}0`;
        }
      } else {
        for (let index = 0; index < dec - pointCount; index++) {
          tempNumA = `${tempNumA}0`;
        }
      }
      return tempNumA;
    }
    let realVal = '';
    // 截取当前数据到小数点后decimals位
    realVal = `${String(tempNum).split('.')[0]}.${String(tempNum).split('.')[1].substring(0, dec)}`;
    // 判断截取之后数据的数值是否为0
    if (realVal == 0) {
      realVal = 0;
    }
    return realVal;
  },
  // 图片转换
  convertImage(data) {
    try {
      data = JSON.parse(data);
    } catch (error) {
      try {
        if (typeof data === 'string') {
          data = data.split(',').filter((i) => i);
        }
      } catch (e) {}
    }
    let result = data.map((item) => item.replace('http://', 'https://'));
    return result;
  },
  // 用户积分反馈
  getUserInegralMessage(that, type = '') {
    getUserInegralMessage().then((res) => {
      if (+res.code === 0 && res.data.length) {
        const cur = res.data[res.data.length - 1];
        Message.success({
          content: `${cur.action}，获得${cur.integral}积分`,
          duration: 5,
        });
      }
    });
  },

  // 获取枚举列表
  getEnumObj(list, key = 'value') {
    let obj = {};
    let arr = list.map((item) => item[key]);
    arr.forEach((item) => {
      obj[item] = item;
    });
    return obj;
  },

  // 给el元素添加cls类
  addClass(el, cls) {
    if (!el) return;
    let curClass = el.className;
    let classes = (cls || '').split(' ');

    for (let i = 0, j = classes.length; i < j; i++) {
      let clsName = classes[i];
      if (!clsName) continue;

      if (el.classList) {
        el.classList.add(clsName);
      } else if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName;
      }
    }
    if (!el.classList) {
      el.setAttribute('class', curClass);
    }
  },
  // 从el元素上移除cls类
  removeClass(el, cls) {
    if (!el) return;
    let curClass = ' ' + el.className + ' ';
    let classes = (cls || '').split(' ');

    for (let i = 0, j = classes.length; i < j; i++) {
      let clsName = classes[i];
      if (!clsName) continue;

      if (el.classList) {
        el.classList.remove(clsName);
      } else if (hasClass(el, clsName)) {
        curClass.replace(' ' + clsName + ' ', ' ');
      }
    }
    if (!el.classList) {
      el.setAttribute('class', trim(curClass));
    }
  },
  // 复制
  copyLink(target, successText = '复制成功', errorText = '复制失败') {
    let clipboard = new Vue.prototype.clipboard(target);
    clipboard.on('success', function (e) {
      Message.success(successText);
    });
    clipboard.on('error', function (e) {
      Message.error(errorText);
    });
    setTimeout(() => {
      clipboard.destroy();
    }, 1000);
  },
};
