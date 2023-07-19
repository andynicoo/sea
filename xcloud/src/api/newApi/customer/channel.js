import request from '@/libs/request';

/**
 * 获取渠道用户列表
 */
export const getList = (data) => {
  return request({
    url: '/custuser/management/user/channelProvider/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/**
 * 新增渠道用户
 */
export const addUser = (data) => {
  return request({
    url: '/custuser/management/user/register/channelUser',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 编辑渠道用户
 */
export const uploadeUser = (data) => {
  return request({
    url: '/custuser/management/user/update/register/channelUser',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 保存子渠道用户
 * @param {*} data
 * @returns
 */

export const saveChildRel = (data) => {
  return request({
    url: '/custuser/management/user/channel/saveChildRel',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 保存子渠道用户
 * @param {*} data
 * @returns
 */
export const childUserRel = (data) => {
  return request({
    url: `/custuser/management/user/channel/childUserRel/${data}`,
    method: 'get',
  });
};
