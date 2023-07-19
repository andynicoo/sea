import request from '@/utils/request';

/** 添加订单与推广链接关联 */
export const addOrderPromteCodeLink = (orderNo, promteCode) =>
  request.get('/custuser/management/linkAddress/addOrderPromteCodeLink', { params: { orderNo, promteCode } });

/**
 * 发送资料 - 获取邮件
 */
export const getEmailInfo = (params) => {
  return request({
    url: '/workorder/client/work-email-config/getEmailConfig',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
};

/**
 * 发送资料 - 记录邮件是否发送状态
 */
export const updateEmailSendService = (params) => {
  return request({
    url: '/workorder/client/service_work_order/email/send/service',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
};

/**
 * 发送资料 - 记录邮件是否发送状态
 */
export const customerDataDownLoad = (params) => {
  return request({
    url: '/workorder/client/service_work_order/customer/data/downLoad',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
};

/**
 * 下载资料清单
 */
export const workFlowColumnRelationDownloadList = (params) => {
  return request({
    url: '/workorder/client/workFlowColumnRelation/downloadList',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
};

/**
 * 获取公司和客户vat税号
 */
export function taxCustUserVatNumber(params) {
  return request({
    url: '/workorder/client/commonInterface/list',
    method: 'get',
    params,
  });
}
// /**
//  * 获取国家信息列表
//  */
export const countryListApi = (params) => {
  return request({
    url: '/order/management/country/countryList',
    data: params,
    method: 'post',
  });
};
