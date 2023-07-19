import axios from 'axios';
import qs from 'qs';
import { Message, Modal } from 'view-design';
import Cookies from 'js-cookie';
import Vue from 'vue';
var showError = false;
// 设置axios跨域访问
axios.defaults.withCredentials = true; // 设置cross跨域 并设置访问权限 允许跨域携带cookie信息
axios.defaults.crossDomain = true; // 设置axios跨域的配置

const anonymousID = localStorage.getItem('anonymousID');

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // base api url
  timeout: 3 * 60 * 1000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    // 拦截post请求
    // 默认使用formdata传输，如需使用body传参，则需要手动加content-type是json的
    if (config.method == 'post') {
      if (config.headers['Content-Type'] && config.headers['Content-Type'].match(/json/i)) {
        config.data = { ...config.data };
      } else {
        config.data = qs.stringify({ ...config.data });
      }
    }

    // 判定是跨税云客户端还是跨企云客户端，跨企云客户端 envpla === 'kqy'，否则为空
    let envpla = Vue.prototype.envpla;
    // 请求头固定传参
    if (envpla === 'kqy') {
      config.headers['enterprisecode'] = 'jy17jue17v3';
      config.headers['enterpriseid'] = 51;
    } else {
      config.headers['enterprisecode'] = 'ksy';
      config.headers['enterpriseid'] = 29;
    }
    // 请求头拦截
    // token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['token'] = token;
    }

    if (JSON.parse(localStorage.getItem('objInfo')) && JSON.parse(localStorage.getItem('objInfo')).userId) {
      const userId = JSON.parse(localStorage.getItem('objInfo')).userId;
      config.headers['userId'] = userId;
    }
    // sessionId
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      config.headers['sessionId'] = sessionId;
    }
    // isbig
    const isBig = localStorage.getItem('isBig');
    if (isBig) {
      config.headers['isBig'] = isBig;
    }
    if (anonymousID) config.headers['anonymousid'] = anonymousID;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res) {
      // 正常返回
      if (res.code === 0) {
        return res;
      } else if (res.code === 6001) {
        localStorage.removeItem('token');
        localStorage.removeItem('sessionId');

        Cookies.remove('token');
        Cookies.remove('sessionId');
        localStorage.removeItem('activeOpenMenu');
        localStorage.removeItem('activeOpenMenu');
        //支付链接页面不提示
        if (!window.location.href.includes('client/payment')) {
          Modal.warning({
            title: '提示',
            content: '登录状态已失效，请重新登录后再操作。',
            onOk: () => {
              window.location.reload();
            },
          });
        }
      } else if (/data:image\/.*;base64,/.test(res)) {
        // 支付二维码，后端返回没有包装数据结构，判断是否是base64结构
        return res;
      }
      // 非code是0的返回
      else if (res.message) {
        if (!response.config.hiddenError) {
          Message.error({ content: res.message });
        }
        return res;
      } else {
        return res;
      }
    } else {
      return Promise.reject(new Error(res.message || 'Error'));
    }
  },
  (error) => {
    if (showError) return;
    showError = true;
    // 解析错误信息
    let errorMessage = getErrorMessage(error);
    // 捕捉请求异常
    if ('取消请求' !== errorMessage) {
      Message.error({
        content: errorMessage,
        duration: 2,
      });
    }
    setTimeout(() => {
      showError = false;
    }, 3000);
    return Promise.reject(error);
  }
);
/**
 * 解析response错误，返回对应错误信息提示
 * @param {*} error
 */
function getErrorMessage(error) {
  console.log(error.message, 'error');
  if (error.message.includes('timeout')) {
    return '抱歉，服务器请求超时。';
  } else if (error.message.includes('500')) {
    return '抱歉，程序出现内部异常。';
  } else if (error.message.includes('502')) {
    return '抱歉，网关访问无响应。';
  } else if (error.message.includes('504')) {
    return '抱歉，网关访问无效。';
  } else if (error.message.includes('404')) {
    return '抱歉，接口地址无效。';
  } else if (error.message.includes('400')) {
    return '抱歉，接口参数有误。';
  } else if (error.message.includes('403')) {
    return '抱歉，没有权限访问。';
  } else if (error.message.includes('429')) {
    return '访问太频繁，请稍后再试。';
  } else if (error.message.includes('取消请求')) {
    return '取消请求';
  } else {
    return '请稍后再试!';
  }
}
export default service;
