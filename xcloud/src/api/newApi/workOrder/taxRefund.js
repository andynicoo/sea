import request from '@/libs/request';

/**
 * VAT退税列表
 */
export const getTaxRefundList = (params) => {
  return request({
    url: '/workorder/management/refund/page',
    params,
    method: 'get',
  });
};

/**
 * VAT退税详情
 */
export const getTaxRefundInfo = (params) => {
  return request({
    url: '/workorder/management/taxRefundWorkOrder/serviceDetail',
    params,
    method: 'get',
  });
};

/**
 * 添加备注
 */
export const addTaxRefundRemark = (params) => {
  return request({
    url: '/workorder/management/taxRefundWorkOrder/addRemark',
    params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
/**
 * 提交资料
 */
export const taxRefundSubmitInfo = (data) => {
  return request({
    url: '/workorder/management/taxRefundWorkOrder/submitInfo',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 批量更新税务经理
 */
export const changeDispose = (data) => {
  return request({
    url: '/workorder/management/taxRefundWorkOrder/updateDispose',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 审核
 */
export const taxRefundAudit = (params) => {
  return request({
    url: '/workorder/management/taxRefundWorkOrder/audit',
    params,
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 退税驳回
 */
export const taxRefundReject = (data) => {
  return request({
    url: '/workorder/management/taxRefundWorkOrder/handleWorkOrderToReject',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 修改服务商
 */
export const supplierChange = (data) => {
  return request({
    url: `/workorder/management/taxRefundWorkOrder/supplier/change?serviceId=${data.serviceId}&supplierId=${data.supplierId}`,
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
