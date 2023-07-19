import request from '@/libs/request';

/**
 * 单个核名列表
 */
export const selectTrademarkCheckList = (data) => {
  return request({
    url: '/xcloudtrademarkclient/trademarkRecord/selectTrademarkBatchCheckDownloadList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 查询通过率
 */
export const selectPassingRate = (data) => {
  return request({
    url: '/xcloudtrademarkclient/trademarkRecord/selectPassingRate',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 查询国家
 */
export const queryCountry = (params) => {
  return request({
    url: '/xcloudtrademarkclient/trademarkBatchCheck/queryCountry',
    params,
    method: 'get',
  });
};

/**
 * 查询类目
 */
export const queryCategory = (params) => {
  return request({
    url: '/xcloudtrademarkclient/trademarkBatchCheck/queryCategory',
    params,
    method: 'get',
  });
};

/**
 * 商标深度查询
 */
export const getDepthQuery = (params) => {
  return request({
    url: '/xcloudtrademarkclient/probabilityAgain',
    params,
    method: 'post',
  });
};

/**
 * 商标监测
 */
export const getMonitTrademarkStatistics = (data) => {
  return request({
    url: '/xcloudtrademarkclient/monit/monitTrademarkStatistics',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 监测商标列表
 */
export const monitTrademarkList = (data) => {
  return request({
    url: '/xcloudtrademarkclient/monit/monitTrademarkList',
    data,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

/**
 * 监测商标
 */
export const monitTrademark = (data) => {
  return request({
    url: '/xcloudtrademarkclient/monit/monitTrademark',
    data,
    method: 'post',
  });
};

/**
 * 我收藏的商标列表
 */
export const mytrademarkRecord = (data) => {
  return request({
    url: '/xcloudtrademarkclient/trademarkRecord/favourite/list',
    data,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
  });
};
export const mytrademarkCollectRemove = (trademarkAiNameNo) => {
  return request({
    url: '/xcloudtrademarkclient/trademarkRecord/favourite/cacel',
    method: 'post',
    data: { trademarkAiNameNo },
    //headers: { 'Content-Type': 'application/json' },
  });
};
export const mytrademarkCollect = (data) => {
  return request({
    url: '/xcloudtrademarkclient/trademarkRecord/favourite/name',
    data,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
  });
};