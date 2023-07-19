import request from '@/libs/request';

/**
 * 查询订单列表（客服订单查询）
 * @param data
 */
export const serviceOrderListAPI = (data) => {
  return request({
    url: '/etax/worktable/management/service/order/list',
    data,
    method: 'post',
  });
};

/**
 * 注册工单统计
 * @param data
 */
export const registerStatisticsAPI = (data) => {
  return request({
    url: '/etax/worktable/management/register/statistics',
    data,
    method: 'post',
  });
};

/**
 * 转代理工单统计
 * @param data
 */
export const transformProxyStatisticsAPI = (data) => {
  return request({
    url: '/etax/worktable/management/transformProxy/statistics',
    data,
    method: 'post',
  });
};

/**
 * 申报工单统计
 * @param data
 */
export const taxWorkOrderStatisticsAPI = (data) => {
  return request({
    url: '/etax/worktable/management/taxWorkOrder/statistics',
    data,
    method: 'post',
  });
};

/**
 * 设置工作台默认国家
 * @param data
 */
export const updateDefaultCountry = (data) => {
  return request({
    url: '/etax/worktable/management/country/update',
    data,
    method: 'post',
  });
};

/**
 * 获取工作台默认国家
 */
export const getDefaultCountry = () => {
  return request({
    url: '/etax/worktable/management/country/default',
    method: 'get',
  });
};

/**
 * 注册工单列表
 * @param data
 */
export const registerListAPI = (data) => {
  return request({
    url: '/etax/worktable/management/register/list',
    data,
    method: 'post',
  });
};

/**
 * 转代理工单列表
 * @param data
 */
export const transformProxyListAPI = (data) => {
  return request({
    url: '/etax/worktable/management/transformProxy/list',
    data,
    method: 'post',
  });
};

/**
 * 申报工单列表
 * @param data
 */
export const taxWorkOrderListAPI = (data) => {
  return request({
    url: '/etax/worktable/management/taxWorkOrder/list',
    data,
    method: 'post',
  });
};

/**
 * 填写服务备注记录
 * @param data
 */
export const addRemarkAPI = (data) => {
  return request({
    url: '/etax/worktable/management/service/add/remark/record',
    data,
    method: 'post',
  });
};

/**
 * 填写服务备注记录
 * @param data
 */
export const getNavLateLy = (data) => {
  return request({
    url: '/etax/worktable/management/service/add/remark/record',
    data,
    method: 'post',
  });
};

/**
 * 首页最近浏览记录
 * @param data
 */
export const getNavRecords = (data = {}) => {
  return request({
    url: '/workorder/workPendingItem/get/nav/lately',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 我的待办
 * @param data
 */
export const getWorkPendingItem = (data = {}) => {
  return request({
    url: '/workorder/workPendingItem/item',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 添加预警跟进
 * @param data
 */
export const saveFollow = (data = {}) => {
  return request({
    url: '/workorder/workPendingItem/save',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

//

/**
 * 添加预警跟进
 * @param data
 */
export const getWarningRecords = (data = {}) => {
  return request({
    url: '/workorder/workPendingItem/track/record',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

export const getPendingMsg = (data = {}) => {
  return request({
    url: '/workorder/workPendingItem/get/pending/msg',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

export const getAllLable = (data = {}) => {
  return request({
    url: '/workorder/workOrderLabel/getPage',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

export const batchEditLabel = (data = {}) => {
  return request({
    url: '/workorder/management/service/batch/edit/label',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

export const deleteAgency = (data = {}) => {
  return request({
    url: '/workorder/workPendingItem/delete',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
