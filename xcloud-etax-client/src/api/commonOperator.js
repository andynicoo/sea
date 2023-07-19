// 工单公共操作接口
import request from '@/utils/request';
import qs from 'qs';

/**
 * 详情
 * @param {integer} workOrderId 工单id
 */
export const serviceWorkOrderDetail = (workOrderId) => {
  return request({
    url: '/workorder/client/service_work_order/detail/' + workOrderId,
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
    url: '/workorder/client/service_work_order/next/' + serviceWorkOrderId,
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
    url: '/workorder/client/service_work_order/reject/' + serviceWorkOrderId,
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
    url: '/workorder/client/service_work_order/save_material',
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
    url: '/workorder/client/service_work_order/commit_material',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 添加备注
 * @param {string} remark 备注
 * @param {string} workId 工单id
 */
export const serviceWorkOrderSaveRemark = (data) => {
  return request({
    url: '/workorder/client/service_work_order/remark',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * ocr识别（新）
 * @param {string} fileType 文件类型（身份证正面：ID_CARD；身份证反面：ID_CARD_REVERSE；公司营业执照：COMPANY_LICENSE）
 * @param {integer} fileUrl 文件url
 */
export const clientOcr = (data) => {
  return request({
    url: '/workorder/client/ocr',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
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
 * 下载上传资料模板
 */
export const workFlowColumnRelationDownloadMaterialExcel = (params) => {
  return request({
    url: '/workorder/client/workFlowColumnRelation/downloadMaterialExcel',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
};

/**
 * 暂存资料（新）
 */
export const materialStash = (params) => {
  return request({
    url: '/workorder/client/service_work_order/material/stash',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  });
};
/**
 * 暂存资料（新）
 */
export const getMaterialStash = (params) => {
  return request({
    url: '/workorder/client/service_work_order/material/stash/' + params,
    method: 'get',
  });
};
