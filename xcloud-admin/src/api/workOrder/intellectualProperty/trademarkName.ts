import axios from '@/utils/axios';
import type Type from './type';

//单个核名列表
export const selectTrademarkCheckList = (data: any) => {
  return axios({
    url: '/xcloudtrademarkclient/trademarkRecord/selectTrademarkBatchCheckDownloadList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//批量核名列表
export const selectTrademarkBatchList = (data: any) => {
  return axios({
    url: '/xcloudtrademarkclient/trademarkBatchCheck/selectTrademarkBatchCheckDownloadList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//批量核名
export const batchCheckTrademark = (params: any) => {
  return axios({
    url: '/xcloudtrademarkclient/trademarkBatchCheck/batchCheckTrademark',
    params,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//下载模板
export const downloadTemplate = (params: any) => {
  return axios({
    url: '/xcloudtrademarkclient/trademarkBatchCheck/verificationTemplateDownload',
    params,
    method: 'get',
    responseType: 'blob',
  });
};

//下载 xls
export const downloadRecord = (params: any) => {
  return axios({
    url: '/xcloudtrademarkclient/trademarkBatchCheck/downloadRecord',
    params,
    method: 'get',
    responseType: 'blob',
  });
};

//批量下载
export const batchCheckTrademarkDownload = (data: any) => {
  return axios({
    url: '/xcloudtrademarkclient/trademarkBatchCheck/batchCheckTrademarkDownload',
    data,
    method: 'post',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//查询国家
export const queryCountry = (params: any) => {
  return axios({
    url: '/xcloudtrademarkclient/trademarkBatchCheck/queryCountry',
    params,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//查询类目
export const queryCategory = (params: any) => {
  return axios({
    url: '/xcloudtrademarkclient/trademarkBatchCheck/queryCategory',
    params,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 商标核名检索2.0
export const queryTrademarkName = (params: Type.QueryTrademarkNameParams): Promise<Type.QueryTrademarkNameRes> => {
  return axios.post('/xcloudtrademarkclient/management/trademark/search/utils/check/trademarks', params);
};
