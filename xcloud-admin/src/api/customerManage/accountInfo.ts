import axios from '@/utils/axios';

//账户列表查询
export const getListPage = (data: any) => {
  return axios({
    url: '/custuser/management/user/query/userPageList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//查询账户积分信息
export const getUserInegralAccount = (data: any) => {
  return axios({
    url: '/custuser/user-integral/getUserInegralAccount',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//修改账户信息详情
export const updateUser = (data: any) => {
  return axios({
    url: '/custuser/management/user/updateUser',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//修改账户信息详情 - 调整积分
export const optAdminUserIntegral = (data: any) => {
  return axios({
    url: '/custuser/user-integral/optAdminUserIntegral',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
