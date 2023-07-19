import axios from 'axios';
import qs from 'qs';
import $config from '@/config';
import { getToken, setToken } from '@/libs/util';
import { Message } from 'element-ui';
import { sign } from '@/libs/sign';
import store from '@/store';
import router from '@/router';
import Vue from 'vue';

let baseUrl = process.env.VUE_APP_BASE_API;
// switch (process.env.NODE_ENV) {
//   case "development":
//     // 这里是本地的请求url
//     baseUrl = $config.apiUrl.dev;
//     break;
//   case "production":
//     // 生产环境url
//     baseUrl = $config.apiUrl.pro;
//     break;
// }

/**
 * 创建axios实例
 * @type {AxiosInstance}
 */
const service = axios.create({
  baseURL: baseUrl, // api的base_url
  timeout: 60 * 1000 * 2, // 设置请求超时时间; 一键算税相关接口相应较长，改成两分钟
});

service.apiUrl = baseUrl;

/**
 * 请求参数处理
 */
service.interceptors.request.use((config) => {
  // 参数签名处理
  config = sign(config, $config.appId, $config.appSecret, 'SHA256');
  let arrayQueryRequestList = [
    '/workorder/management/workFunctionCategory/saveOrUpdate',
    '/workorder/management/workFunctionWorkflowRelation/saveOrUpdate',
    '/workorder/management/tax/reg/transform_out',
    '/information/management/answer/save',
    '/workorder/management/declare/export',
    '/workorder/management/declare/batch_transform_out/work_order',
  ];
  if (!arrayQueryRequestList.includes(config.url)) {
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
  }
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token;
  }

  const enterpriseCode = localStorage.getItem('enterpriseCode') || '1';
  if (enterpriseCode) config.headers['enterpriseCode'] = enterpriseCode;
  const enterpriseId = localStorage.getItem('enterpriseId');
  if (enterpriseId) config.headers['enterpriseId'] = enterpriseId;

  const menus = store.state.user.menus;
  const pathname = location.pathname.substr(1);
  const menu = menus.find((item) => item.path === pathname);
  // console.log(config.data)

  if (menu) {
    config.headers['menuId'] = menu.menuId;
  } else if (config.data !== '' && config.data !== undefined) {
    if (config.data.menuId) config.headers['menuId'] = config.data.menuId;
  } else if (config.params !== '' && config.params !== undefined) {
    if (config.params.menuId) config.headers['menuId'] = config.params.menuId;
  } else {
    if (config.headers['menuId']) {
      delete config.headers['menuId'];
    }
  }
  if (config.interrupt) {
    config['cancelToken'] = new axios.CancelToken((cancel) => {
      Vue.prototype.$cancelRequestList.push(cancel);
    });
  }
  return config;
});

/**
 * 响应结果处理
 */
service.interceptors.response.use(
  (response) => {
    if (response.data.code == 0 || !response.data.code) {
      // 下载文件接口无code字段
      // 服务端定义的响应code码为0时请求成功
      // 使用Promise.resolve 正常响应
      return Promise.resolve(response.data);
    } else {
      // 使用Promise.reject 响应
      Message.error(response.data.message);
      return Promise.reject(response.data);
    }
  },
  (error) => {
    let message = '';
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          setToken('');
          router.push('/login');
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
      Message.error(message);
      // 请求错误处理
      return Promise.reject(error);
    } else {
      if (error.message !== 'interrupt') {
        message = '连接服务器失败';
        Message.error(message);
        return Promise.reject(error);
      }
    }
  }
);

export default service;
