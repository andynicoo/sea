import request from '@/libs/request';

/**
 * 税务稽查列表
 */
export const getTaxCheckList = (params) => {
  return request({
    url: '/workorder/management/check/page',
    params,
    method: 'get',
  });
};

/**
 * 税务稽查详情
 */
export const getTaxCheckInfo = (params) => {
  return request({
    url: '/workorder/management/taxCheckWorkOrder/serviceDetail',
    params,
    method: 'get',
  });
};

/**
 * 添加备注
 */
export const addTaxCheckRemark = (params) => {
  return request({
    url: '/workorder/management/taxCheckWorkOrder/addRemark',
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
export const taxCancelSubmitInfo = (data) => {
  return request({
    url: '/workorder/management/taxCheckWorkOrder/submitInfo',
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
    url: '/workorder/management/taxCheckWorkOrder/updateDispose',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 开始处理/处理完成
 */
export const handleWorkOrderToNext = (data) => {
  return request({
    url: '/workorder/management/taxCheckWorkOrder/handleWorkOrderToNext',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 工单处理(流转到驳回节点)
 */
export const handleWorkOrderToReject = (data) => {
  return request({
    url: '/workorder/management/taxCheckWorkOrder/handleWorkOrderToReject',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
