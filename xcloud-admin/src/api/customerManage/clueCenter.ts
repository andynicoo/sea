import { request } from '@/utils/axios';
import type { QueryParams } from '@/types/customer';

//线索中心列表查询
export const getClueCenterList = (data: any) => {
  return request({
    url: '/custuser/data-customer-lead/pageList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//线索中心列表查询总数量
export const getPageListCount = (data: any) => {
  return request({
    url: '/custuser/data-customer-lead/pageListCount',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//线索的跟进状态下拉框
export const leadFollowStatusList = (data: any) => {
  return request({
    url: '/custuser/data-customer-config-source/leadFollowStatusList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//添加线索
export const addLead = (data: any) => {
  return request({
    url: '/custuser/data-customer-lead/addLead',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//修改线索
export const editLead = (data: any) => {
  return request({
    url: '/custuser/data-customer-lead/editLead',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//修改跟进人
export const updateFollowUserId = (data: any) => {
  return request({
    url: '/custuser/data-customer-lead/updateFollowUserId',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//手动推送客户线索
export const customerLeadPushLxy = (data: any) => {
  return request({
    url: '/custuser/data-customer-lead/customerLeadPushLxy',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 下载模板
export const verificationTemplateDownload = () => {
  return request({
    url: '/custuser/dataBatchImport/verificationTemplateDownload',
    method: 'get',
    responseType: 'blob',
  });
};

// 批量导入插入任务
export const addDataBatchTask = (params: any) => {
  return request({
    url: '/custuser/dataBatchImport/addDataBatchTask',
    method: 'get',
    params,
  });
};

// 批量任务集合
export const selectBatchThreadList = (params: any) => {
  return request({
    url: '/custuser/dataBatchImport/selectBatchThreadList',
    method: 'get',
    params,
  });
};

// 单个下载
export const downloadRecord = (params: any) => {
  return request({
    url: '/custuser/dataBatchImport/downloadRecord',
    method: 'get',
    params,
    responseType: 'blob',
  });
};

//查询详情
export const getDetailsInfo = (data: any) => {
  return request({
    url: '/custuser/data-customer-lead/leadInfo',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
//查询线索详情
export const leadInfoExtInfo = (data: QueryParams) => {
  return request({
    url: '/custuser/data-customer-lead/leadInfoExt',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//跟进记录列表查询
export const recordPageList = (data: any) => {
  return request({
    url: '/custuser/data-follow-record/pageList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//添加跟进记录
export const addFollowRecord = (data: any) => {
  return request({
    url: '/custuser/data-follow-record/addFollowRecord',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//操作日志列表
export const getOptList = (data: any) => {
  return request({
    url: '/custuser/data-customer-lead-log/pageList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//商标大类
export const getServiceQueryList = (data: any) => {
  return request({
    url: '/workorder/management/trademark/category/pageList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
