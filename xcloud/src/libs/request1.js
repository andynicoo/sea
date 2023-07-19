import axios from 'axios';
import qs from 'qs';
import $config from '@/config';
import {
  getToken
} from '@/libs/util';
import {
  Message
} from 'view-design';
import {
  sign
} from '@/libs/sign';
  
let baseUrl = '/demo';


/**
 * 创建axios实例
 * @type {AxiosInstance}
 */
const service = axios.create({
  baseURL: baseUrl, // api的base_url
  timeout: 60000, // 设置请求超时时间30s
  
});

service.apiUrl = baseUrl;
let url = '';
let type = ''
/**
 * 请求参数处理
 */
service.interceptors.request.use(config => {
  url = config.url;
  type = config.responseType
  // 参数签名处理
  config = sign(config, $config.appId, $config.appSecret, 'SHA256');
  if (config.headers && config.headers['Content-Type'] && config.headers['Content-Type'].match(/json/i)) {
    if (config.method === 'get') {
      config.params = {
        ...config.params
      };
    } else {
      config.data = {
        ...config.data
      };
    }
  } else if (config.method === 'get') {
    config.params = {
      ...config.params
    };
  } else {
    config.data = qs.stringify({
      ...config.data
    });
  }
  const token = getToken();
  if (token) {
    config.headers.authorization = 'Bearer ' + token;
  }
  return config;
});

/**
 * 响应结果处理
 */
service.interceptors.response.use(response => {
  if (url === 'oauth/token') {
    if (response.status === 200) {
      return Promise.resolve(response.data);
    } else {
      this.$Message.info(response.data.message);
    }
  }
  if(type == 'arraybuffer') {
    return Promise.resolve(response);
  }
 
  if (response.data.code === 0 || response.data.code === '0') {
    return Promise.resolve(response.data);
  }
  // 使用Promise.reject 响应
  
  Message.error({
    content: response.data.message
  });
  return Promise.reject(response.data);

}, error => {

  let message = '';
  if (error && error.response) {
    switch (error.response.status) {
      case 401:
        // location.reload()
        Message.error({
          content: error.response.data.message
        });
        return;
      case 403:
        message = error.response.data.path + ',' + error.response.data.message;
        Message.error({
          content: error.response.data.message
        });
        break;
      case 429:
        message = '访问太过频繁，请稍后再试!';
        Message.error({
          content: error.response.data.message
        });
        break;
      default:
        message = error.response.data.message ? error.response.data.message : '服务器错误';
        break;
    }
    Message.error({
      content: message
    });
    // 请求错误处理
    return Promise.reject(error);
  }
  message = '连接服务器失败';
  Message.error({
    content: message
  });
  return Promise.reject(error);

});

export default service;