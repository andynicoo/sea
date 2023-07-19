import axios, { AxiosInstance } from 'axios';
import { handleInterceptorsResponseError } from '@/api/handle';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const TOKEN_KEY = process.env.REACT_APP_TOKEN_KEY as string;
const getToken = () => localStorage.getItem(TOKEN_KEY);
// config munuId配置
const menuList = localStorage.getItem('menuList');
const menus = menuList ? JSON.parse(menuList) : [];
const pathname = location.pathname.substr(1);
const menu = menus.find((item: { path: string; }) => item.path === pathname);

const request: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 600000,
  headers: { 'Content-Type': 'application/json;charset=UTF-8' },
});
request.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token && !config.url?.includes('login/token')) {
      config.headers = {
        ...config.headers,
        [TOKEN_KEY]: `Bearer ${token}`,
        enterpriseid: localStorage.enterpriseId || 29,
        menuId: menu.menuId || ''
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    return Promise.resolve(response.data);
  },
  (error) => {
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          //@ts-ignore
          if (window.__POWERED_BY_QIANKUN__) {
            location.reload();
          }

          return;
      }
      handleInterceptorsResponseError(error);
      // 请求错误处理
      return Promise.reject(error);
    } else {
      handleInterceptorsResponseError(error);
      return Promise.reject(error);
    }
  }
);

export const get = request.get;
export const post = request.post;
export const del = request.delete;
export const put = request.put;

export default request;
