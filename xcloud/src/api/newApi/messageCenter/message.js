import request from '@/libs/request';

/**
 * 消息列表---------弃用
 */
export const renewalMessageList = (data) => {
  return request({
    url: '/reportserver/renewalMessage/renewalMessageList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 消息已读--------弃用
 */
export const renewalMessageRead = (params) => {
  return request({
    url: '/reportserver/renewalMessage/renewalMessageRead',
    params,
    method: 'get',
  });
};

/**
 * 获取消息数量
 */
export const getMessageTotal = (params) => {
  return request({
    url: '/base/manage/baseMessage/get/msg/total',
    params,
    method: 'get',
  });
};

/**
 * 获取消息列表
 */
export const getBaseMessageList = (data) => {
  return request({
    url: '/base/manage/baseMessage/get/msg',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 设置消息已读
 */
export const setMessageRead = (data) => {
  return request({
    url: '/base/manage/baseMessage/set/msg/read',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
