import axios from 'axios';
import qs from 'qs';
// import { Message } from 'iview'
import { Message } from 'view-design';
import $config from '@/config';
import router from '../router';
import Store from '@/store'; // 引入store
import Cookies from 'js-cookie';

let baseUrl = $config.apiUrl.baseUrl;
let enterpriseCode = 'pn4pn456jy1';
let enterpriseId = '30';

// 外观专利 标识
if (process.env.NODE_PLA === 'wg') {
  enterpriseCode = 'z3aawesxysx';
  enterpriseId = '49';
}

/**
 * 创建axios实例
 * @type {AxiosInstance}
 */
const service = axios.create({
  baseURL: baseUrl, // api的base_url
  timeout: 60000, // 设置请求超时时间30s
});

service.apiUrl = baseUrl;

/**
 * 请求参数处理
 */
service.interceptors.request.use((config) => {
  if (config.headers && config.headers['Content-Type'] && config.headers['Content-Type'].match(/json/i)) {
    if (config.method === 'get') {
      config.params = { ...config.params };
    } else {
      config.data = { ...config.data };
    }
  } else if (config.method === 'get') {
    config.params = { ...config.params };
  } else {
    if (config.url === '/file/oss/upload2') {
      config.data = config.data;
    } else {
      config.data = qs.stringify({ ...config.data });
    }
  }

  // 请求头处理
  const token = localStorage.getItem('token');
  const sessionid = localStorage.getItem('sessionId');
  const promteCode = localStorage.getItem('promteCode');
  const isBig = localStorage.getItem('isBig');
  const anonymousID = localStorage.getItem('anonymousID');
  const objInfo = JSON.parse(localStorage.getItem('objInfo'));
  if (objInfo) config.headers['userId'] = objInfo.userId;
  if (token) config.headers['token'] = token;
  if (sessionid) config.headers['sessionId'] = sessionid;
  if (promteCode) config.headers['promteCode'] = promteCode;
  if (isBig) config.headers['isBig'] = isBig;
  if (anonymousID) config.headers['anonymousID'] = anonymousID;
  if (enterpriseCode) config.headers['enterpriseCode'] = enterpriseCode;
  config.headers.enterpriseId = enterpriseId;
  return config;
});

/**
 * 响应结果处理
 */
service.interceptors.response.use(
  (response) => {
    if (Number(response.data.code) === 0) {
      // 服务端定义的响应code码为0时请求成功
      // 使用Promise.resolve 正常响应
      return Promise.resolve(response.data);
    } else if (response.data.code === 6001) {
      localStorage.removeItem('token');
      localStorage.removeItem('sessionId');
      Cookies.remove('token');
      Cookies.remove('sessionId');
      Store.dispatch('changeLeft', false);
      Store.dispatch('changeLogin', false);
      // 核名报告未登录不需要跳转
      if (window.location.href.indexOf('/trademarkNameReviewReport') > -1) {
        return;
      }
      if (window.location.href.indexOf('/en/login') > -1) {
        router.push({ path: `/en/login${window.location.search}` });
      } else {
        router.push({ path: `/login${window.location.search}` });
      }
    } else if (/data:image\/.*;base64,/.test(response.data)) {
      // 支付二维码，后端返回没有包装数据结构，判断是否是base64结构
      return Promise.reject(response.data);
    } else {
      // 使用Promise.reject 响应
      Message.error({ content: response.data.message });
      return Promise.reject(response.data);
    }
  },
  (error) => {
    let message = '';
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          localStorage.removeItem('sessionId');

          Cookies.remove('token');
          Cookies.remove('sessionId');
          Store.dispatch('changeHead', false);
          // window.location.href = '/login'
          return;
        case 403:
          message = error.response.data.path + ',' + error.response.data.message;
          break;
        case 429:
          message = '访问太过频繁，请稍后再试!';
          break;
        default:
          message = error.response.data.message ? error.response.data.message : '服务器错误';
          break;
      }
      Message.error({ content: message });
      // 请求错误处理
      return Promise.reject(error);
    } else {
      message = '连接服务器失败';
      Message.error({ content: message });
      return Promise.reject(error);
    }
  }
);

export default service;
