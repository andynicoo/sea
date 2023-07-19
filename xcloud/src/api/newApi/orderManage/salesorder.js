import request from '@/libs/request';

/**
 * 获取销售订单列表
 * @param obj
 */
export function getorderlist(params) {
  return request({
    url: '/order/management/order/page',
    data: params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 修改归属人
 * @param {*} params
 * @returns
 */
export function updateAttribution(params) {
  return request({
    url: '/order/management/order/updateAttribution',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 获取所有的服务分类
 * @param {*} params
 * @returns
 */
export function categoryList(params) {
  return request({
    url: '/orderproduct/management/category/all/category',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 获取订单详情
 * @param {*} params
 * @returns
 */
export function getDeatils(id) {
  return request({
    url: '/order/management/order/' + id,
    method: 'get',
  });
}
/**
 * 驳回
 * @param {*} id
 * @returns
 */
export function getReject(params) {
  return request({
    url: '/orderproduct/management/order/reject',
    method: 'PUT',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 审核
 * @param {*} params
 * @returns
 */
export function ShenHe(params) {
  return request({
    url: '/order/management/order/audit',
    method: 'PUT',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 申请开票
 * @param {*} params
 * @returns
 */
export function applyInvoice(params) {
  return request({
    url: '/order/management/invoice',
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 款项登记
 * @param {*} params
 * @returns
 */
export function managementOrder(params, flag) {
  return request({
    url: '/orderproduct/management/orderPayment',
    method: flag == 'add' ? 'POST' : 'PUT',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 收款确认
 * @param {*} params
 * @returns
 */
export function confirmPayment(params) {
  return request({
    url: '/orderproduct/management/orderPayment/confirm',
    method: 'PUT',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**申请退款
 * @param {*} data
 * @returns
 */
export function applyOrderRefund(data) {
  return request({
    url: '/order/management/orderRefund',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**删除款项信息
 * @param {*} data
 * @returns
 */
export function deletePayment(id) {
  return request({
    url: '/orderproduct/management/orderPayment/' + id,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**发送合同接口
 * @param {*} data
 * @returns
 */
export function contractSignApi(data) {
  return request({
    url: '/order/management/contract/sign',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**撤销合同接口
 * @param {*} data
 * @returns
 */
export function revokeContractApi(params) {
  return request({
    url: '/order/management/contract/revokeContract',
    method: 'post',
    params,
  });
}

/**作废合同接口-线上
 * @param {*} data
 * @returns
 */
export function contractsInvalidApi(params) {
  return request({
    url: '/order/management/contract/contractsInvalid',
    method: 'post',
    params,
  });
}

/**获取合同签署主体信息
 * @param {*} data
 * @returns
 */
export function getSignSubject(data) {
  return request({
    url: '/order/management/contract/listSignSubject',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**获取续费订单签署主体信息
 * @param {*} data
 * @returns
 */
export function getRenewalSignSubject(data) {
  return request({
    url: '/workorder/management/renewalOffer/list/renewalCompany',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 新建 || 修改  联系人&&企业
 * @param {*} data
 * @returns
 */
export function saveSignSubject(data) {
  return request({
    url: '/order/management/contract/saveSignSubject',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**获取模板列表
 * @param {*} data
 * @returns
 */
export function signTemplatesApi(params) {
  return request({
    url: '/order/management/contract/templates',
    method: 'get',
    params,
  });
}
/**判断是否需要走合同流程
 * @param {*} data
 * @returns
 */
export function getNeedSignApi(params) {
  return request({
    url: '/order/management/contract/getNeedSign',
    method: 'get',
    params,
  });
}

/**根据手机获取公司列表
 * @param {*} data
 * @returns
 */
export function listByMobileApi(params) {
  return request({
    url: '/workorder/management/userCompanyMaterial/listByMobile',
    method: 'get',
    params,
  });
}

/**获取手机号列表
 * @param {*} data
 * @returns
 */
export function getMobileListApi(params) {
  return request({
    url: '/custuser/management/user/custUserMobileList',
    method: 'get',
    params,
  });
}

/**修改手机号
 * @param {*} data
 * @returns
 */
export function updateOrderByUserMobile(data) {
  return request({
    url: '/order/management/order/updateOrderByUserMobile',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**修改手机号
 * @param {*} data
 * @returns
 */
export function updateOrderUserMobileChange(data) {
  return request({
    url: '/orderproduct/management/order/updateOrderUserMobileChange',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**订单驳回取消订单或订单付款被驳回申请取消接口
 * @param {*} data
 * @returns
 */
export function orderCancel(data) {
  return request({
    url: '/order/management/order/cancel',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**取消订单审核接口
 * @param {*} data
 * @returns
 */
export function orderCancelAudit(data) {
  return request({
    url: '/order/management/order/cancelAudit',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**续费订单列表接口
 * @param {*} data
 * @returns
 */
export function renewalPage(data) {
  return request({
    url: '/workorder/management/renewalOffer/list/renewal',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**ocr识别
 * @param {*} data
 * @returns
 */
export function ocrPayVoucher(data) {
  return request({
    url: '/orderproduct/ocr/payVoucher?uri=' + data.uri,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export const batchUpdateAttribution = (data) => {
  return request({
    url: '/orderproduct/management/order/attribution',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**申请退款
 * @param {*} data
 * @returns
 */
export function calculateRefundAmount(data) {
  return request({
    url: '/order/management/orderRefund/calculateRefundAmount',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**修改申请退款
 * @param {*} data
 * @returns
 */
export function editOrderRefund(data) {
  return request({
    url: '/order/management/orderRefund/edit',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**订单合同列表（订单详情页）
 * @param {*} data
 * @returns
 */
export function getContractInfo(data) {
  return request({
    url: '/sign/management/contract/order/' + `${data}`,
    method: 'get',
  });
}
/**合同管理 列表页
 * @param {*} data
 * @returns
 */
export function getContractPage(data) {
  return request({
    url: '/sign/management/contract/page',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**合同管理 详情页
 * @param {*} data
 * @returns
 */
export function getContractDetail(contractId) {
  return request({
    url: '/sign/management/contract/detail/' + `${contractId}`,
    method: 'get',
  });
}

/**合同管理 首页-tabs
 * @param {*} data
 * @returns
 */
export function getStatistics() {
  return request({
    url: '/sign/management/contract/status/statistics',
    method: 'get',
  });
}

/**发起付款（分期付款）
 * @param {*} data
 * @returns
 */
export function sendPayment(data) {
  return request({
    url: '/order/management/order/sendPayment',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**作废线下合同
 * @param {*} data
 * @returns
 */
export function offlineInvalid(data) {
  return request({
    url: '/order/management/contract/offlineInvalid',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**获取销售订单统计数据
 * @param {*} data
 * @returns
 */
export function getTotalPrice(data) {
  return request({
    url: '/order/management/order/orderCount',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 人工确认到账
 * @param {*} params
 * @returns
 */
export function uploadCertificate(params) {
  return request({
    url: '/order/management/orderPayment/uploadCertificate',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 审核凭证
 * @param {*} params
 * @returns
 */
export function auditUpload(params) {
  return request({
    url: '/order/management/orderPayment/payConfirm',
    method: 'put',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 生成服务
 * @param {*} params
 * @returns
 */
export function createOrderService(orderId) {
  return request({
    url: '/order/management/order/create/service/' + orderId,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 生成服务
 * @param {*} params
 * @returns
 */
export function orderStatusCount(data) {
  return request({
    url: '/order/management/order/orderStatusCount',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * OCR识别（新）
 * @param {*} params
 * @returns
 */
export function orderOcrPayVoucher(data) {
  return request({
    url: '/order/ocr/payVoucher',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 手工录单提交前重复录续费商品的判断
 * @param {*} params
 * @returns
 */
export function checkRepeatRenewProductInfo(params) {
  return request({
    url: '/order/management/order/checkRepeatRenewProductInfo',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 修改订单备注
 * @param {*} data
 * @returns
 */
export function modifyOrderRemark(data) {
  return request({
    url: '/order/management/order/modifyOrderRemark',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}


/**
 * 修改订单 应付金额
 * @param {*} data
 * @returns
 */
export function updateFinalPaymentMoney(data) {
  return request({
    url: '/order/management/order/updateFinalPaymentMoney',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
