// 工单公共操作接口
import request from '@/libs/request';
import qs from 'qs';
/**
 * 审核
 * @param {string} isPass 是否通过
 * @param {string} isSend 是否发送短信
 * @param {string} remark 备注
 * @param {integer} workOrderId 工单id
 */
export const serviceWorkOrderAudit = (data) => {
  return request({
    url: '/workorder/management/service_work_order/audit',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
/**
 * 详情
 * @param {integer} workOrderId 工单id
 */
export const serviceWorkOrderDetail = (workOrderId) => {
  return request({
    url: '/workorder/management/service_work_order/detail/' + workOrderId,
    method: 'get',
  });
};
/**
 * 下一节点
 * @param {string} remark 备注
 * @param {integer} serviceWorkOrderId 工单id
 */
export const serviceWorkOrderNext = (data) => {
  let { serviceWorkOrderId, ...params } = data;
  return request({
    url: '/workorder/management/service_work_order/next/' + serviceWorkOrderId,
    params,
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 驳回到上一节点
 * @param {string} remark 备注
 * @param {integer} serviceWorkOrderId 工单id
 */
export const serviceWorkOrderReject = (data) => {
  let { serviceWorkOrderId, ...params } = data;
  return request({
    url: '/workorder/management/service_work_order/reject/' + serviceWorkOrderId,
    params,
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 保存资料
 * @param {string} material 资料JSON
 * @param {integer} workOrderId 工单ID
 */
export const serviceWorkOrderSave = (data) => {
  return request({
    url: '/workorder/management/service_work_order/save_material',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 提交资料
 * @param {string} material 资料JSON
 * @param {integer} workOrderId 工单ID
 */
export const serviceWorkOrderCommit = (data) => {
  return request({
    url: '/workorder/management/service_work_order/commit_material',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 保存备注
 * @param {string} annex 附件地址
 * @param {string} annexName 附件名称
 * @param {string} remarkComment 备注内容
 * @param {string} workNo 服务工单号
 */
export const serviceWorkOrderSaveRemark = (data) => {
  return request({
    url: '/workorder/management/orderServiceRemark/sw/save',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 查看备注
 * @param {string} serviceNo 服务工单号（workNo）
 */
export const serviceWorkOrderCheckRemark = (params) => {
  return request({
    url: '/workorder/management/orderServiceRemark/listRemark',
    params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 查看驳回详情
 * @param {string} workNo 服务工单号
 */
export const serviceWorkOrderCheckReject = (params) => {
  return request({
    url: '/workorder/management/orderServiceReject/listRejectByWorkNo',
    params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 修改服务商
 * @param {integer} supplierId 服务商id
 * @param {array} workIdColl 工单id
 * @param {string} declareBeginTime 申报开始时间
 * @param {string} declareEndTime 申报结束时间
 * @param {integer} declareType 申报类型
 * @param {integer} oldSupplierCooperationStatus 原服务商合作状态
 * @param {string} targetSupplierProgress 新服务商服务进度
 */
export const serviceWorkOrderChangeSupplier = (data) => {
  return request({
    url: '/workorder/management/service_work_order/supplier',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 修改处理人（客服、交付）
 * @param {integer} handlerId 处理人id
 * @param {string} handlerName 处理人名称
 * @param {integer} type 处理人类型 1：客服，2：交付
 * @param {array} workOrderIds 工单ID集合
 */
export const serviceWorkOrderChangeHandler = (data) => {
  return request({
    url: '/workorder/management/service_work_order/handler',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 发送提醒
 * @param {array} workOrderIds 工单ID集合
 */
export const serviceWorkOrderRemind = (params) => {
  return request({
    url: '/workorder/management/service_work_order/remind',
    params,
    method: 'get',
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    },
  });
};

/**
 * 已审核-上传授权书模板
 * @param {integer} businessId 工单ID
 * @param {integer} functionCode 业务编码
 * @param {array} templateDetailList 模板列表
 * @param {string} templateDetailList.exampleUrl 示例文件url
 * @param {string} templateDetailList.remarks 备注
 * @param {string} templateDetailList.sort 排序
 * @param {string} templateDetailList.templateFileName 模板文件名
 * @param {string} templateDetailList.templateName 模板名称
 * @param {string} templateDetailList.templateUrl 模板url
 */
export const serviceWorkOrderUploadAuthTemplate = (data) => {
  return request({
    url: '/workorder/management/service_work_order/upload/auth/template',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 已审核-替换授权书模板
 * @param {integer} workOrderId 工单ID
 * @param {string} material 资料JSON
 */
export const serviceWorkOrderReplaceAuthTemplate = (data) => {
  return request({
    url: '/workorder/management/service_work_order/replace/auth/template',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 待授权-上传授权书
 * @param {string} material 注册授权书
 * @param {integer} workOrderId 工单id
 */
export const serviceWorkOrderUploadAuth = (data) => {
  return request({
    url: '/workorder/management/service_work_order/upload/auth/file',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
