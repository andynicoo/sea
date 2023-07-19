import request from '@/libs/request';

/**
 * 转代理+申报 服务列表
 * @param {*} params 参数，
 */
export function getList(params) {
  return request({
    url: '/workorder/management/vat/workorder/proxy/pageList',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 服务工单详情
 * @param {*} params 参数，serviceId
 */
export function getDetail(params) {
  return request({
    url: '/workorder/management/vat/workorder/detail',
    method: 'post',
    data: params,
  });
}

/**
 * 服务单批量发送短信提醒
 * @param {*} params 参数，progressBar业务进度  servicesIds服务ids
 */
export function sendsmCode(params) {
  return request({
    url: '/workorder/management/vat/sms/send/smsBatch',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
/**
 * 单个工单发送短信提醒
 * @param {*} params 参数，servicesId
 */
export function sendsmsMsg(params) {
  return request({
    url: '/workorder/management/vat/sms/send/smsMsg',
    method: 'post',
    data: params,
  });
}

/**
 * 税务经理认领
 * @param {*} params 参数，
 */
export function dispose(id) {
  return request({
    url: '/workorder/management/vat/dispose/dispose/' + id,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 税务经理批量认领
 * @param {*} params 参数，
 */
export function disposeBatch(params) {
  return request({
    url: '/workorder/management/vat/dispose/disposeBatch',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 新增服务单备注
 *  @param {*} params 参数，
 */
export function orderServiceRemark(params) {
  return request({
    url: '/workorder/management/orderServiceRemark/save',
    data: params,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 申报详情新增备注
 *  @param {*} params 参数，
 */
export function saveDeclareWorkOrder(params) {
  return request({
    url: '/workorder/management/orderServiceRemark/saveDeclareWorkOrder',
    data: params,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 根据服务号查询备注内容
 *  @param {*} params 参数，
 */
export function seelistRemark(params) {
  return request({
    url: '/workorder/management/orderServiceRemark/listRemark',
    data: params,
    method: 'POST',
  });
}

/**
 * 删除备注
 *  @param {*} params 参数，
 */
export function deleteRemark(id) {
  return request({
    url: '/workorder/management/orderServiceRemark/deleteRemark/' + id,
    method: 'POST',
  });
}

/**
 * 表单配置数据
 *  @param {*} params 参数，
 */
export function getNodeField(params) {
  return request({
    url: '/workorder/management/workFlowColumnRelation/findWorkflowColumnsByCode',
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 获取所有节点数据(当前流程已添加节点不返回)
 *  @param {*} params 参数，
 */
export function serviceNode(params) {
  return request({
    url: '/workorder/management/serviceNode/list',
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 保存注册或转代理资料
 *  @param {*} params 参数，
 */
export function materialSaveAuthorization(params) {
  return request({
    url: '/workorder/management/vat/material/upload/authorization',
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 保存注册或转代理资料
 *  @param {*} params 参数，
 */
export function materialSave(params) {
  return request({
    url: '/workorder/management/vat/material/save',
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 提交注册或转代理资料
 *  @param {*} params 参数，
 */
export function materialSubmit(params) {
  return request({
    url: '/workorder/management/vat/material/submit',
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 获取签名链接
 * @param {*} params 参数，
 *
 */
export function signCode(params) {
  return request({
    url: '/workorder/management/sign/generate',
    method: 'post',
    data: params,
  });
}

/**
 * 获取法人签名回显
 * @param {*} params 参数，serviceNo
 *
 */
export function refresh(params) {
  return request({
    url: '/workorder/management/sign/refresh',
    method: 'post',
    data: params,
  });
}

/**
 * 注册OR转代理驳回
 * @param {*} params sendMsg 短信标识 是true，否false
 * serviceId 服务id
 * remark 审核资料备注（原因）
 */
export function reject(params) {
  return request({
    url: '/workorder/management/vat/material/reject',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 审核资料
 * @param {*} params apiStatus是否提交API(法国) 1:提交 2:不提交
 * serviceId 服务id  status审核标识 1:通过 2:不通过
 * remark 审批备注 supplierId服务商id
 */
export function auditInfo(params) {
  return request({
    url: '/workorder/management/vat/material/apply',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 修改服务商分配编码
 * @param {*} params supplierAssignsCode
 * serviceId 服务id
 */
export function updateSupplierCode(params) {
  return request({
    url: '/workorder/management/vat/material/updateSupplierAssignsCode',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 修改服务商分配编码
 * @param {*} params supplierAssignsCode
 * serviceId 服务id
 */
export function listReject(params) {
  return request({
    url: '/workorder/management/orderServiceReject/listReject',
    method: 'post',
    data: params,
  });
}

/**
 * 提交转代理
 * @param {*} params
 * servicesId 服务id
 */
export function subAgent(params) {
  return request({
    url: '/workorder/management/vat/material/submitMaterial',
    method: 'post',
    data: params,
  });
}

/**
 * 完成转代理
 * @param {*} params
 * servicesId 服务id
 */
export function submitTransProxy(params) {
  return request({
    url: '/workorder/management/tax/reg/complete/proxy',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 更改服务商
 * @param {*} params
 * servicesId 服务id supplierId
 */
export function updateSupplier(params) {
  return request({
    url: '/workorder/management/vat/supplier/supplier',
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 添加服务商注册地址
 * @param {*} params
 * servicesId 服务id servicesId
 */
export function saveRegistrarAddress(params) {
  return request({
    url: '/workorder/management/tax/reg/reg_addr',
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 服务单批量/单个确认转出
 */
export function transferOut(data) {
  return request({
    url: '/workorder/management/vat/workorder/transferOut',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 修改服务单截止日期
 * @param {*} params 参数，
 */
export function changeExpirationTime(params) {
  return request({
    url: '/workorder/management/vat/material/change/expirationTime',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 更改IBAN
 */
export function updateIBAN(data) {
  return request({
    url: '/workorder/management/tax/reg/iban',
    method: 'put',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/*
 * 修改公司名称
 * @param {*} params 参数，
 */
export function changeCompanyName(params) {
  return request({
    url: '/workorder/management/vat/material/change/companyName',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 修改税号
 * @param {*} params 参数，
 */
export function changeTaxNumber(params) {
  return request({
    url: '/workorder/management/vat/material/change/taxNumber',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 录入SIRET号
 * @param {*} params 参数，
 */
export function changeSiret(params) {
  return request({
    url: '/workorder/management/tax/reg/siret',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 录入/修改税号信息
 * @param {*} params 参数，
 */
export function changeVatInfo(params) {
  return request({
    url: '/workorder/management/tax/reg/tax_info',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 修改税号下发日期
 * @param {*} params 参数，
 */
export function changeTaxIssueDate(params) {
  return request({
    url: '/workorder/management/vat/material/change/taxIssueDate',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 修改税号生效时间
 * @param {*} params 参数，
 */
export function changeTaxEffectiveDate(params) {
  return request({
    url: '/workorder/management/vat/material/change/taxEffectiveDate',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 修改处理人
 * @param {*} params 参数，
 */
export function modifyHandle(params) {
  return request({
    url: '/workorder/management/epr/declare/handle/modify',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 修改处理人
 * @param {*} params 参数，
 */
export function saveIncrementReamke(params) {
  return request({
    url: '/workorder/management/taxApplyServices/add/remark',
    method: 'post',
    data: params,
  });
}

/**
 * 修改处理人
 * @param {*} params 参数，
 */
export function preModifyHandle(params) {
  return request({
    url: '/workorder/management/vat/pre/epr/handle/modify',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 提交epr申报
 */
export const confirmExpensesApi = (data) => {
  return request({
    url: '/workorder/management/epr/declare/confirmExpenses',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 录入税号申请书
 */
export const applyTaxNumber = (data) => {
  return request({
    url: '/workorder/management/tax/reg/tax_number_apply',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
