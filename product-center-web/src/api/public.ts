import { post, get } from '@/api';

//上传图片
export const ossUpload = (params: any): Promise<any> =>
  post(`/file/oss/feign/upload2`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

//获取token
export const loginToken = (): Promise<any> => post(`admin/login/token?username=admin&password=123456`);

//获取所有用户
export const getUserAll = (): Promise<any> => get(`base/user/all`);

//获取国家
export const getCountryList = (): Promise<any> => post(`order/management/country/countryList`);

//获取部门
export const xcloudOrgDepartment = (params: { limit: number; page: number }): Promise<any> => post(`base/xcloudOrgDepartment/pageList`, params);

//获取菜单
export const getMenus = (): Promise<any> => get(`base/current/user/menu`, { params: { serviceId: 'uaa-admin-server' } });
