import axios from '@/utils/axios';

//用户登录
export const login = (data: { username: string; password: string }) => {
  return axios({
    url: '/admin/login/token',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

//获取登录用户菜单权限
export const getCurrentUserMenu = () => {
  return axios({
    url: '/base/current/user/menu',
    params: {
      serviceId: 'uaa-admin-server',
    },
    method: 'get',
  });
};

//获取用户信息
export const getBaseUserInfo = (params: { userId: string }) => {
  return axios({
    url: '/base/user/info',
    params,
    method: 'get',
  });
};

//获取用户信息
export const getUserInfo = () => {
  return axios({
    url: '/admin/current/user',
    method: 'get',
  });
};

// 新增用户
export const handleAddUser = (data: { name: string; mobile: string; enterpriseId: string; followUserId: string }) => {
  return axios({
    url: '/custuser/management/user/order/addXcloudUserLead',
    data,
    method: 'post',
  });
};

// 获取已注册手机号列表
export function getRegistedMobileList(params: { userMobile: string }) {
  return axios({
    url: '/custuser/management/user/custUserDetailMobileList',
    method: 'get',
    params,
  });
}
