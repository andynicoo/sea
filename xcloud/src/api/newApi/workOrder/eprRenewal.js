import request from '@/libs/request';

/**
 * EPR续费查询列表页
 * @param {*} params 参数，
 */
export function getEprRenewalListAPI(data) {
  return request({
    url: '/workorder/management/epr/renew/page',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 税号注册详情
 */
export const getEprRenewalDetailAPI = (serviceId) => {
  return request({
    url: '/workorder/management/service_work_order/detail/' + serviceId,
    method: 'get',
  });
};

/**
 * 修改处理人
 * @param {*} params 参数，
 */
export function modifyHandle(params) {
  return request({
    url: '/workorder/management/service_work_order/handler',
    method: 'put',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

//获取操作记录
export const getBusinessLogListByBusinessNo = (data) => {
  return request({
    url: '/other/management/businessLog/listByNo',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 审核通过
 */
export const auditAPI = (serviceId) => {
  return request({
    url: '/workorder/management/service_work_order/next/' + serviceId + '?operation=待续费',
    method: 'put',
  });
};

/**
 * 续费驳回
 */
export const rejectEprAPI = (data) => {
  return request({
    url: '/workorder/management/service_work_order/audit',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 录入证书
 */
export const inputEprRegisterInfoApi = (data) => {
  return request({
    url: '/workorder/management/epr/renew/inputEprRegisterInfo',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 完成续费
 */
export const renewComplete = (data) => {
  return request({
    url: '/workorder/management/epr/renew/complete',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 录入证书
 */
export const renewUpload = (data) => {
  return request({
    url: '/workorder/management/epr/renew/uploadPaymentVoucher',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 下载
 */
export const renewalDownLoad = (serviceId) => {
  return request({
    url: '/workorder/management/epr/renew/downLoad/' + serviceId,
    method: 'get',
  });
};

/**
 * 修改服务商
 * @param {*} params 参数，
 */
export function modifyProvider(params) {
  return request({
    url: '/workorder/management/service_work_order/supplierEpr',
    method: 'put',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
