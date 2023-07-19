/**
 * @description [ axios 请求封装]
 */
import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { useStore } from '@/stores/store';
import router from '@/router';
import { message } from 'ant-design-vue';
import qs from 'qs';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_API,
  timeout: 60000,
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    // "Content-Type": "application/x-www-form-urlencoded",
  },
});

/**
 * @description 请求发起前的拦截器
 * @returns {AxiosRequestConfig} config
 */
service.interceptors.request.use((config: AxiosRequestConfig) => {
  // 添加 token
  if (useStore().getToken) {
    (config.headers as any).Authorization = 'Bearer ' + useStore().getToken;
  }
  // 添加 企业主体id
  if (useStore().enterprise.record.id) {
    (config.headers as any).enterpriseid = useStore().enterprise.record.id;
  }
  // 添加 菜单id
  if (useStore().menuData.record.menuId) {
    (config.headers as any).menuid = useStore().menuData.record.menuId;
  }

  if ((config.headers as any)['Content-Type'].match(/x-www-form-urlencoded/i)) {
    if (config.url !== '/file/oss/upload2') {
      config.data = qs.stringify({ ...config.data });
    }
  }
  return config;
});

/**
 * @description 响应收到后的拦截器
 * @returns {}
 */
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 使用Promise.resolve 正常响应
    if (response.data.code === 0) {
      return Promise.resolve(response.data.data);
    } else if (response.request.responseType === 'blob') {
      return Promise.resolve(response.data);
    } else {
      // 使用Promise.reject 响应
      message.error({ content: response.data.message });
      return Promise.reject(response.data);
    }
  },
  (error: AxiosError) => {
    let msg = '';
    if (error && error.response) {
      const res: any = error.response;
      switch (res.status) {
        case 401:
          useStore().$reset();
          msg = 'token失效，请重新登录！';
          if (qiankunWindow.__POWERED_BY_QIANKUN__) {
            window.history.pushState('', '', '/login');
          } else {
            router.push('/login');
          }
          break;
        case 403:
          msg = res.data.path + ',' + res.data.message;
          break;
        case 429:
          msg = '访问太过频繁，请稍后再试!';
          break;
        case 500:
          msg = '服务器错误';
          break;
        default:
          msg = res.data && res.data.message ? res.data.message : '服务器错误';
          break;
      }
      message.error({ content: msg });
      // 请求错误处理
      return Promise.reject(error);
    } else {
      msg = '连接服务器失败';
      message.error({ content: msg });
      return Promise.reject(error);
    }
  }
);

export const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return service.request(config);
};

export const get = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return service.request({ ...config, method: 'GET' });
};

export const post = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return service.request({ ...config, method: 'POST' });
};

export default service;
