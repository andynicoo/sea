import request from '@/libs/request';

/**
 * 获取服务商列表
 */
export const getSupplierList = (data) => {
  return request({
    url: '/workorder/management/supplier/pageList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 获取服务商详情
 */
export const getSupplierById = (params) => {
  return request({
    url: '/workorder/management/base/supplier/info',
    params,
    method: 'get',
  });
};

/**
 * 更改服务商启用禁用状态
 */
export const activateEnabledState = (params) => {
  return request({
    url: '/workorder/management/supplier/activateEnabledState',
    params,
    method: 'get',
  });
};

/**
 * 删除服务商
 */
export const deleteSupplierById = (params) => {
  return request({
    url: '/workorder/management/supplier/delete',
    params,
    method: 'delete',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/**
 * 更新服务商信息
 */
export const updateSupplier = (data) => {
  return request({
    url: '/workorder/management/supplier/update',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 新增服务商
 */
export const addSupplier = (data) => {
  return request({
    url: '/workorder/management/supplier/add',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 币别列表
 */
export const getCurrencyCode = (params) => {
  return request({
    url: '/workorder/management/supplier/currencyCode/list',
    params,
    method: 'get',
  });
};
