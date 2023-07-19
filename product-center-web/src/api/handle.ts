import { message } from 'antd';

const REACT_APP_LOGIN_PAGE = process.env.REACT_APP_LOGIN_PAGE as string;

export function handleInterceptorsResponseError(error: any) {
  if (error && error.response && error.response.status) {
    switch (error.response.status) {
      case 500:
        message.error(error.response.data.message || error.response.data.error);
        break;
      case 503:
        message.error('服务不可用!');
        break;
      case 401:
        message.error('请重新登入!');
        // window.location.href = REACT_APP_LOGIN_PAGE;
        break;
      case 403:
        message.error('权限错误');
        break;
      case 404:
        message.error(`${error.response.data.path} 请求不存在`);
        break;
      case 400:
        message.error(error.response.data.message);
        break;
      default:
        break;
    }
  }
}
