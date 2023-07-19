import request from '@/utils/request';

/**
 * OAuth授权URI
 */
export const getStoreAuthUrl = (data) => {
  return request({
    url: '/data/client/authorizationApi/getAuthUrl',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 亚马逊站点集合列表
 */
export const getCountryList = (data) => {
  return request({
    url: '/data/client/authorizationApi/marketplaceIdValuesVat',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 授权店铺列表查询
 */
export const getStoreList = (data) => {
  return request({
    url: '/data/client/authorizationApi/pageList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 自动获取报告
 */
export const autoReport = (data) => {
  return request({
    url: '/data/client/authorizationApi/autoReport',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 关联税号下拉框选项
 */
export const bindTaxNoSelectList = (data) => {
  return request({
    url: '/data/client/data-shop-relate-tax/bindTaxNoSelectList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 绑定税号
 */
export const bindStoreTaxNo = (data) => {
  return request({
    url: '/data/client/data-shop-relate-tax/bindTaxNo',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 删除授权
 */
export const deleteStoreAuth = (data) => {
  return request({
    url: '/data/client/authorizationApi/delete',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 客户端报告列表查询
 */
export const getAmazonSalesReportList = (data) => {
  return request({
    url: '/data/client/amazon-sales-report/pageList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 重生生成报告 2
 */
export const reloadReport = (data) => {
  return request({
    url: '/data/client/amazon-sales-report/reloadReport',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 重生生成报告 3
 */
export const reCreateReport = (data) => {
  return request({
    url: '/data/client/amazon-sales-report/reCreateReport',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
