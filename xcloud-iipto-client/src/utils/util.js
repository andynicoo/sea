/*
 * js工具类集合
 */
import { getUserInegralMessage } from '@/api/user/integralMal.js';
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

  /**
   * 防止精度丢失
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

  // 金额求和（相加/相减）
  countSum(arr) {
    if (!arr.length) return 0;
    arr = arr.map((v) => {
      if (v && !Number.isNaN(Number(v))) return Math.round(v * 100);
      return 0;
    });
    const result = arr.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
    return result / 100;
  },

  // 用户积分反馈
  getUserInegralMessage(that, type = '') {
    getUserInegralMessage().then((res) => {
      if (+res.code === 0 && res.data.length) {
        const cur = res.data[res.data.length - 1];
        that.$Message.success({
          content: `${cur.action}，获得${cur.integral}积分`,
          duration: 5,
        });
      }
    });
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
  // 四舍五入，有小数则保留两位，五小数则为整数
  toDecimalRound(num) {
    if (isNaN(num) || (!num && num !== 0)) {
      return 0;
    }
    return Math.round(num * 100) / 100;
  },

  /**
   * 下载文件到本地
   * @param {*} url
   */
  downloadFile(url, name) {
    let newUrl = url.replace('http://', 'https://');
    let timestamp = new Date().getTime();
    var a = document.createElement('a');
    let fileName = newUrl
      .split('.')
      .pop()
      .toLowerCase();
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
    const fileReader = new FileReader();
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('token', localStorage.getItem('token'));
    xhr.setRequestHeader('sessionId', localStorage.getItem('sessionId'));
    xhr.setRequestHeader('enterprisecode', 'ksy');
    xhr.responseType = 'blob';
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const content = xhr.response;
        fileReader.onloadend = () => {
          try {
            const jsonData = JSON.parse(fileReader.result); // 说明是普通对象数据，后台转换失败
            Message.error(jsonData.message || '当前模板未配置，请联系管理员');
          } catch (err) {
            let fileSuffix = xhr.getResponseHeader('fileSuffix') || suffix; //获取文件格式
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
  /**
   * 后端返回文件流下载
   * @param {*} content
   */
  downFilePost(url, fileName, formData, suffix = 'zip') {
    console.log(formData, 'formData');
    const fileReader = new FileReader();
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('token', localStorage.getItem('token'));
    xhr.setRequestHeader('sessionId', localStorage.getItem('sessionId'));
    xhr.setRequestHeader('enterprisecode', 'kby');
    xhr.responseType = 'blob';
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(formData));
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const content = xhr.response;
        fileReader.onloadend = () => {
          try {
            const jsonData = JSON.parse(fileReader.result); // 说明是普通对象数据，后台转换失败
            Message.error(jsonData.message || '当前模板未配置，请联系管理员');
          } catch (err) {
            let fileSuffix = xhr.getResponseHeader('fileSuffix') || suffix; //获取文件格式
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
};
