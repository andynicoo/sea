import request from '@/libs/request';

/**
 * 获取分配规则列表
 */
export const getSupplierAllotRuleList = (data) => {
  return request({
    url: '/workorder/management/supplierAllotRule/v2/pageList',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 获取分配规则详情
 */
export const getSupplierAllotRuleInfo = (params) => {
  return request({
    url: '/workorder/management/supplierAllotRule/info',
    params,
    method: 'get',
  });
};

/**
 * 根据商品分类获取业务分类
 */
export const getFunctionCodeByCategory = (productCategoryId) => {
  return request({
    url: '/workorder/management/workFunctionCategory/getFunctionCode/' + productCategoryId,
    method: 'post',
  });
};

/**
 * 更改分配规则禁用状态
 */
export const activateAllotRuleDisabledState = (params) => {
  return request({
    url: '/workorder/management/supplierAllotRule/activateEnabledState',
    params,
    method: 'get',
  });
};

/**
 * 删除分配规则
 */
export const deleteSupplierAllotRule = (params) => {
  return request({
    url: '/workorder/management/supplierAllotRule/delete',
    params,
    method: 'delete',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/**
 * 更新分配规则
 */
export const updateSupplierAllotRule = (data) => {
  return request({
    url: '/workorder/management/supplierAllotRule/update',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 新增分配规则
 */
export const addSupplierAllotRule = (data) => {
  return request({
    url: '/workorder/management/supplierAllotRule/add',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 查询处理人列表信息
 */
export const getHandlerUserList = (data) => {
  return request({
    url: '/settlementcenter/management/base/supplier/supplierAllotRule/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//

/**
 * 查询处理人列表信息
 */
export const getListByNo = (data) => {
  return request({
    url: '/other/management/businessLog/listByNo',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 分配归属人
 */
export const changeAllotRuleInAffiliationCreateApi = (data) => {
  return request({
    url: '/workorder/management/supplierAllotRule/changeAllotRuleInAffiliationCreate',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 分配归属人
 */
export const changeSupplierAffiliationCreateApi = (data) => {
  return request({
    url: '/workorder/management/supplier/changeSupplierAffiliationCreate',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 分配归属人
 */
export const changeAttorneyAffiliationCreateApi = (data) => {
  return request({
    url: '/workorder/management/attorney/changeAttorneyAffiliationCreate',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 根据商品分配查询工单类型和已发布流程信息， 新增国家编码参数
 */
export const getInfoByCategory = (data) => {
  return request({
    url: '/workorder/management/serviceWorkflow/find/categoryWorkFlow',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
