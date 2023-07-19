import request from '@/libs/request';

/**
 * 查一查统计数据查询
 */
export const checkStatistics = (data) => {
  return request({
    url: '/xxjob/management/check/statistics',
    data,
    method: 'post',
    interrupt: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 查一查订单列表
 */
export const orderList = (data) => {
  return request({
    url: '/xxjob/management/check/OmsOrderPage',
    data,
    method: 'post',
    interrupt: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 查一查工单列表
 */
export const workOrderList = (data) => {
  return request({
    url: '/xxjob/management/check/workOrderDataPage',
    data,
    method: 'post',
    interrupt: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 查一查工单分组列表
 */
export const workOrderGroupList = (data) => {
  return request({
    url: '/xxjob/management/check/workOrderDataGroupByOrderNoPage',
    data,
    method: 'post',
    interrupt: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 查一查预警列表
 */
export const warnList = (data) => {
  return request({
    url: '/xxjob/management/check/messageSenderRecordPage',
    data,
    method: 'post',
    interrupt: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 查一查生命周期列表
 */
export const lifeCycleList = (data) => {
  return request({
    url: '/xxjob/management/check/messageSenderRecordPage',
    data,
    method: 'post',
    interrupt: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 查一查公司列表
 */
export const getServiceCompanyList = (data) => {
  return request({
    url: '/xxjob/management/check/getServiceCompanyList',
    data,
    method: 'post',
    interrupt: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
