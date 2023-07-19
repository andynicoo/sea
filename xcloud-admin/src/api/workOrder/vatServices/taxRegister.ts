import axios, { request } from '@/utils/axios';

//税号注册详情
export const getTaxRegisterDetail = (params: any) => {
  return request({
    url: '/workorder/management/service_work_order/detail/' + params.id,
    method: 'get',
  });
};

// 税号注册详情  - 操作记录
export const getListByNoList = (data: any) => {
  return request({
    url: '/other/management/businessLog/listByNo',
    data,
    method: 'post',
  });
};

// 税号注册详情 -  修改服务商
export const changeSupplier = (data: any) => {
  return axios({
    url: '/workorder/management/service_work_order/supplier',
    data,
    method: 'put',
  });
};

// 税号注册详情 -  下载资料
export const downloadInformation = (params: any) => {
  return request({
    url: '/workorder/management/vat/download/new/' + params.id,
    method: 'get',
    responseType: 'blob',
  });
};

// 税号注册详情 -  提交审核结果 --驳回
export const auditServiceWork = (data: any) => {
  return axios({
    url: '/workorder/management/service_work_order/audit',
    data,
    method: 'put',
  });
};

// 税号注册详情 -  提交审核结果 --通过
export const passServiceWork = (serviceId: string) => {
  return axios({
    url: '/workorder/management/service_work_order/next/' + serviceId + '?operation=审核通过',
    method: 'put',
  });
};

// 税号注册详情  - 获取审核状态信息
export const getDetailsStatusInfo = (params: any) => {
  return request({
    url: '/workorder/management/reject_temp/audit_info/' + params.id,
    method: 'get',
  });
};

// 税号注册详情  - 修改审核信息
export const editDetailsStatusInfo = (params: any, data: any) => {
  return request({
    url: '/workorder/management/reject_temp/audit_info/' + params.id,
    data,
    method: 'post',
  });
};

//驳回 获取驳回下拉字段
export const selecterKeyStrList = (params: any) => {
  return request({
    url: '/workorder/management/reject_temp/selecter/' + params.keyStr,
    method: 'get',
  });
};

//驳回 获取模板-根据字段key
export const getColumnList = (params: any) => {
  return request({
    url: '/workorder//management/reject_temp/column',
    method: 'get',
    params,
  });
};

// 税号注册详情  - 增加模版
export const addRejectTemp = (data: any) => {
  return request({
    url: '/workorder/management/reject_temp',
    data,
    method: 'post',
  });
};

// 税号注册详情  - 驳回原因列表
export const listRejectByWorkNo = (data: any) => {
  return request({
    url: '/workorder/management/orderServiceReject/listRejectByWorkNo?workNo=' + data.workNo,
    method: 'post',
  });
};

// 税号注册详情  - 编辑服务商分配编码
export const updateSupplierAssignsCode = (data: any) => {
  return request({
    url: '/workorder/management/vat/material/updateSupplierAssignsCode',
    data,
    method: 'post',
  });
};

// 税号注册详情  - 编辑DE欧盟证书
export const editDeEuCertificateApi = (data: any) => {
  return request({
    url: '/workorder/management/tax/reg/tax_info',
    data,
    method: 'post',
  });
};
