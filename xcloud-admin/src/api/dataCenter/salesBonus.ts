import axios from '@/utils/axios';

// 主页-查询个人界面
export const selectMarketPersonalCenter = (data: any) => {
  return axios({
    url: '/reportserver/salesCommissions/selectMarketPersonalCenter',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 配置-查询数据源配置
export const selectSalesCommissionsConfig = (params: any) => {
  return axios({
    url: '/reportserver/salesCommissions/selectSalesCommissionsConfig',
    method: 'get',
    params,
  });
};

// 配置-添加数据源配置
export const addSalesCommissionsConfig = (data: any) => {
  return axios({
    url: '/reportserver/salesCommissions/addSalesCommissionsConfig',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 下载模板
export const verificationTemplateDownload = () => {
  return axios({
    url: '/reportserver/dataBatchImport/verificationTemplateDownload',
    method: 'get',
    responseType: 'blob',
  });
};

// 批量导入插入任务
export const addDataBatchTask = (params: any) => {
  return axios({
    url: '/reportserver/dataBatchImport/addDataBatchTask',
    method: 'get',
    params,
  });
};

// 批量任务集合
export const selectBatchThreadList = (params: any) => {
  return axios({
    url: '/reportserver/dataBatchImport/selectBatchThreadList',
    method: 'get',
    params,
  });
};

// 单个下载
export const downloadRecord = (params: any) => {
  return axios({
    url: '/reportserver/dataBatchImport/downloadRecord',
    method: 'get',
    params,
    responseType: 'blob',
  });
};

// 数据明细-列表
export const getSalesCommissionsList = (data: any) => {
  return axios({
    url: '/reportserver/salesCommissions/salesCommissionsList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 数据明细-统计
export const selectSalesCommissionsSum = (data: any) => {
  return axios({
    url: '/reportserver/salesCommissions/selectSalesCommissionsSum',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 数据明细-导出
export const salesCommissionsExport = (data: any) => {
  return axios({
    url: '/reportserver/salesCommissions/salesCommissionsExport',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
};
