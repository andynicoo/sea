import request from '@/utils/request';

/**
 * EPR续费查询列表页
 * @param {*} params 参数，
 */
export function getEprRenewalListAPI(data) {
  return request({
    url: '/workorder/client/epr/renew/page',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * EPR续费节点
 * @param {*} params 参数，
 */
export function getEprNodeListAPI(data) {
  return request({
    url: '/workorder/client/service_work_order/nodes',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * EPR续费节点
 * @param {*} params 参数，
 */
export function getEprRenewalNodeListAPI(data) {
  return request({
    url: '/workorder/client/service_work_order/nodesByFlowId',
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
    url: '/workorder/client/service_work_order/detail/' + serviceId,
    method: 'get',
  });
};

/**
 * 上传缴费凭证
 */
export function uploadPaymentVoucherAPI(data) {
  return request({
    url: '/workorder/client/erp/renew/uploadPaymentVoucher',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/** 查找之前的续费 */
export function getEprHistoryInfo(data) {
  return request({
    url: '/workorder/client/epr/renew/findEprHistoryInfo',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
  
}

/** epr续费 保存 */
export const EPRRenewSave = (params) => {
  return request({
    url: '/workorder/client/service_work_order/save_material',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
};
/** epr续费 提交 */
export const EPRRenewCommit = (params) => {
  return request({
    url: '/workorder/client/service_work_order/commit_material',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
};

/** 查询是否可申报 */
export const EPRdeclareSuccess = (params) => {
  return request({
    url: '/workorder/client/epr/declare/success/declare',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
    params
  });
}