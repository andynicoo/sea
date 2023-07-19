import request from '@/libs/request';

/**
 * 店铺管理 - 后台授权店铺列表查询
 */
export const getAuthStore = (data) => {
  return request({
    url: '/data/manager/authorizationApi/pageList',
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
 * 店铺管理 -后台授权店铺列表导出
 */
export const authStoreExport = (data) => {
  return request({
    url: '/data/manager/authorizationApi/export',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
};

/**
 * 后台报告列表查询
 */
export const getAmazonSalesReportList = (data) => {
  return request({
    url: '/data/amazon-sales-report/pageList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 店铺管理 -后台报告列表查询
 */
export const exportList = (data) => {
  return request({
    url: '/data/amazon-sales-report/exportList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
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
