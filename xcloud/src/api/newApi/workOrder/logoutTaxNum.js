import request from '@/libs/request';

/**
 * 税号注册列表
 */
export const getTaxCancelList = (data) => {
  return request({
    url: '/workorder/management/cancel/page',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 税号注册详情
 */
export const getTaxCancelInfo = (params) => {
  return request({
    url: '/workorder/management/taxCancelWorkOrder/serviceDetail',
    params,
    method: 'get',
  });
};

/**
 * 添加备注
 */
export const addTaxCancelRemark = (params) => {
  return request({
    url: '/workorder/management/taxCancelWorkOrder/addRemark',
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
export const submitInfo = (data) => {
  return request({
    url: '/workorder/management/taxCancelWorkOrder/submitInfo',
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
export const taxCancelAudit = (params) => {
  return request({
    url: '/workorder/management/taxCancelWorkOrder/audit',
    params,
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 注销失败
 */
export const handleWorkOrderToReject = (data) => {
  return request({
    url: '/workorder/management/cancel/failCancel',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 完成注销
 */
export const handleWorkOrder = (data) => {
  return request({
    url: '/workorder/management/cancel/complete/taxCancel',
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
    url: '/workorder/management/taxCancelWorkOrder/updateDispose',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 更改注销回执文件(注销完成状态下调用)
 */
export const updateReceiptFile = (data) => {
  return request({
    url: '/workorder/management/cancel/updateReceiptFile',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
