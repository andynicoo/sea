import request from '@/libs/request';

/**
 * 老系统客户列表
 */
export const userOldAccountList = (data) => {
  return request({
    url: '/custuser/management/userOldAccount/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 老系统客户列表
 */
export const editOldAccount = (data) => {
  return request({
    url: '/custuser/management/userOldAccount/editOldAccount',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 老系统客户统计
 */
export const getTotalCustomer = (data) => {
  return request({
    url: '/custuser/management/userOldAccount/getDataStatistics',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
