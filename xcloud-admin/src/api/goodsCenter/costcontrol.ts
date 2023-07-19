import axios, { request } from '@/utils/axios';

// 成本管理-列表
export const selectRefundDetailReport = (data: any) => {
  return axios({
    url: '/reportserver/business-cost/list',
    method: 'post',
    data,
  });
};

// 成本管理-获取币种下拉列表
export const getFeeTypeList = () => {
  return axios({
    url: '/reportserver/business-cost/currency',
    method: 'post',
  });
};

// 成本管理-修改成本配置
export const updateBusinessConfig = (data: any) => {
  return axios({
    url: '/reportserver/business-cost/update',
    method: 'post',
    data,
  });
};

// 成本管理-历史记录
export const queryByBusinessCostId = (data: any) => {
  return axios({
    url: '/reportserver/cost-handle-log/queryList',
    method: 'post',
    data,
  });
};

// 成本管理-修改处理人
export const updateBeLonger = (data: any) => {
  return axios({
    url: '/reportserver/business-cost/updateBeLonger',
    method: 'post',
    data,
  });
};

// 成本管理-导入业务成本数据
export const submitExportLog = (data: any) => {
  return axios({
    url: '/reportserver/business-cost/export?filePath=' + data.filePath,
    method: 'post',
  });
};

// 成本管理-导入日志列表接口
export const queryExportLog = (data: any) => {
  return axios({
    url: '/reportserver/business-cost/export/log',
    method: 'post',
    data,
  });
};

// 下载模板
export const verificationTemplateDownload = () => {
  return request({
    url: '/reportserver/business-cost/download',
    method: 'post',
    responseType: 'blob',
  });
};
