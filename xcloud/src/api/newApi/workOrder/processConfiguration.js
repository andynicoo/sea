import request from '@/libs/request';

/**
 * 获取服务商列表
 */
export const supplierList = (data) => {
  return request({
    url: '/workorder/management/supplier',
    data,
    method: 'get',
  });
};
/**
 * 新获取服务商列表
 */
export const newSupplierList = (data) => {
  return request({
    url: '/workorder/management/base/supplier/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 结算服务商信息
 */
export const settlementcenterSupplierList = (data) => {
  return request({
    url: '/settlementcenter/management/base/supplier/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 获取按钮列表
 */
export const getServiceFunction = (data) => {
  return request({
    url: '/workorder/management/serviceFunction',
    data,
    method: 'get',
  });
};

/**
 * 停用流程
 */
export const serviceWorkflowStopWorkFlow = (id) => {
  return request({
    url: '/workorder/management/serviceWorkflow/stopWorkFlow?flowId=' + id,
    method: 'get',
  });
};

/**
 * 提交审核
 */
export const serviceWorkflowSubmitAudit = (data) => {
  return request({
    url: '/workorder/management/serviceWorkflow/submit/audit',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
/**
 * functionCode服务商信息查询
 */
export const supplierFunctionCode = (data) => {
  return request({
    url: '/settlementcenter/management/base/supplier/supplierFunctionCode/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
