import request from '@/libs/request';
import request_six from '@/libs/request_six';
import qs from 'qs';
/**
 * 申报 服务列表
 * @param {*} params 参数，
 */
export function getList(data) {
  return request({
    url: '/workorder/management/declare/page',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
/**
 * 申报服务 详情
 * @param {*} params 参数，
 */
export function serviceDetail(id) {
  return request({
    url: '/workorder/management/declare/' + id,
    method: 'GET',
  });
}

/**
 * 申报服务 转出
 * @param {*} params 参数，
 */
export function serviceTransfer(id) {
  return request({
    url: '/workorder/management/declare/service/transfer/' + id,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 申报工单 申报审核
 * @param {*} params 参数，
 */
export function orderAudit(params) {
  return request({
    url: '/workorder/management/declare/work_order/audit',
    method: 'PUT',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 申报服务 税号信息
 * @param {*} params 参数，
 */
export function vatInfo(id) {
  return request({
    url: '/workorder/management/declare/service/vat_info/' + id,
    method: 'GET',
  });
}
/**
 * 申报工单  上传缴税凭证
 * @param {*} params 参数，
 */
export function certificate(params) {
  return request({
    url: '/workorder/management/declare/work_order/certificate',
    method: 'PUT',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 申报工单 上传回执
 * @param {*} params 参数，
 */
export function workReceipt(params) {
  return request({
    url: '/workorder/management/declare/work_order/receipt',
    method: 'PUT',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 申报工单 替换回执
 * @param {*} params 参数，
 */
export function changeReceipt(params) {
  return request({
    url: '/workorder/management/declare/work_order/receipt/replace',
    method: 'PUT',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 申报工单  提交申报
 * @param {*} params 参数，
 */
export function submission(params) {
  return request({
    url: '/workorder/management/declare/work_order/submission',
    method: 'PUT',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 申报工单  税金审核
 * @param {*} params 参数，
 */
export function taxAudit(params) {
  return request({
    url: '/workorder/management/declare/work_order/tax_audit',
    method: 'PUT',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 计算税金
 * @param {*} params 参数，
 */
export function caluTax(params) {
  return request({
    // url: "/hxa/workorder/tax/caluTax",
    url: '/workorder/tax/caluTax',
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 申报记录 列表
 * @param {*} params 参数，
 */
export function declarePage(params) {
  return request({
    url: '/workorder/management/declare/work_order/page/' + params.serviceId,
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 *  申报数据
 * @param {*} params 参数，
 */
export function taxesList(id) {
  return request({
    url: '/workorder/management/declare/work_order/taxes/' + id,
    method: 'get',
  });
}
/**
 *  录入发票号
 * @param {*} params 参数，
 */
export function taxesInvoice(params) {
  return request({
    url: '/workorder/management/declare/work_order/invoice',
    method: 'PUT',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
/**
 *  下载税确
 * @param {*} params 参数，
 */
export function taxConfirm(params) {
  return request({
    url: '/workorder/management/download/confirm',
    method: 'GET',
    params,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 *  下载税确
 * @param {*} params 参数，
 */
export function downloadBritainReceipt(params) {
  return request({
    url: '/workorder/management/download/receipt',
    method: 'get',
    params,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 *  下载税确(计算税金时下载税确)
 * @param {*} params 参数，
 */
export function taxConfirmationApi(data) {
  return request({
    url: '/workorder/management/download/taxConfirmation',
    method: 'POST',
    data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
/**
 *  下载税确
 * @param {*} params 参数，
 */
export function creatAnnalsApi(params) {
  return request({
    url: '/workorder/management/taxWorkOrderYear/tax/create/year',
    method: 'POST',
    data: params,
  });
}

/**
 * 申报服务 处理人修改
 */
export const declareHandler = (data) => {
  return request({
    url: '/workorder/management/declare/service/handler',
    data,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 *  下载ECL明细
 */
export function downloadECLInfo(id) {
  return request({
    url: '/workorder/management/declare/download/ecl/' + id,
    method: 'post',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 *  下载其他回执
 */
export function downloadReceipt(id) {
  return request({
    url: '/workorder/management/declare/work_order/debit_receipt/down/' + id,
    method: 'get',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 *  修复申报
 */
export function repair(id) {
  return request({
    url: '/workorder/management/declare/work_order/fixtax/' + id,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 税务申报短信
 */

export function sendSmsBatch(data) {
  return request({
    url: '/workorder/management/declare/batch_sms_notify',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 *  更改申报周期
 */
export function declarePeriodModifyApi(data) {
  return request({
    url: '/workorder/management/declare/service/declare_period/modify',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 *  驳回
 */
export function doReject(param) {
  return request({
    url: '/workorder/management/declare/service/doReject',
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 *  驳回
 */
export function handleWorkOrderCloseFlag(data) {
  return request({
    url: '/workorder/management/declare/handleWorkOrderCloseFlag',
    method: 'post',
    data,
  });
}

/**
 * 获取当前进度和驳回进度
 * @param {*} params 参数，
 */
export function rejectNode(id) {
  return request({
    url: '/workorder/management/declare/service/rejectNode/' + id,
    method: 'GET',
  });
}

/**
 *  修改申报工单数据信息
 */
export function updateDeclareData(data) {
  return request({
    url: '/workorder/management/declare/work_order/updateDeclareData',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 *  申报工单 批量下载回执
 */
export function downloadMultipleReceipt(data) {
  return request({
    url: '/workorder/management/declare/work_order/batch/download/receipt',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 *  申报工单 批量下载回执查询结果
 */
export function queryMultipleReceipt(id) {
  return request({
    url: '/workorder/management/declare/work_order/download/receipt/query?id=' + id,
    method: 'get',
  });
}

/**
 *  申报工单 根据申报工单拉取销售亚马逊销售文件
 */
export function pullSellFile(id) {
  return request({
    url: `/workorder/management/declare/work_order/pullSellFile/${id}`,
    method: 'get',
  });
}

/**
 *  申报工单 申报的税号是否关联店铺
 */
export function flagRelateTaxNo(data) {
  return request({
    url: '/data/data-shop-relate-tax/flagRelateTaxNo',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 获取历史报税记录
 * @param {*} params 参数，
 */
export function getVatObligations(params) {
  return request({
    url: '/workorder/management/bureau/auth/history/vatObligations',
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}

/**
 *  线下申报
 */
export function offlineSubmission(data) {
  return request({
    url: '/workorder/management/declare/work_order/offline/submission',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 *  线下申报-年报
 */
export function offlineSubmissionYear(data) {
  return request({
    url: '/workorder/management/taxWorkOrderYear/offline/submission',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 *  申报工单列表
 * @param {*} params 参数，
 */
export function getDecalreOrderList(id, params) {
  return request({
    url: '/workorder/management/declare/work_order/page/' + id,
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 *  开通申报端口
 */
export function declPort(data) {
  return request({
    url: '/workorder/management/declare/work_order/decl_port',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 *  申报下载选项列表
 */
export function declareDownloadItems() {
  return request({
    url: '/workorder/management/declare/work_order/batch/download/item',
    method: 'get',
  });
}

/**
 *  申报批量下载
 */
export function batchDeclareDownload(params) {
  return request({
    url: '/workorder/management/declare/work_order/batch/download',
    method: 'get',
    params,
    paramsSerializer: function (params) {
      return qs.stringify(params, {
        arrayFormat: 'repeat',
      });
    },
  });
}

/**
 *  下载税务申报文件
 */
export function allDeclareDownload(data) {
  return request({
    url: '/workorder/management/declare/export',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
}

/**
 *  上传申报回执
 */
export function eprDeclareReceipt(data) {
  return request({
    url: '/workorder/management/epr/declare/upload',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 获取历史报税记录
 * @param {*} params 参数，
 */
export function startDeclare(params) {
  return request({
    url: '/workorder/management/epr/declare/notify',
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}

/**
 * 保存草稿
 * @param {*} params 参数，
 */
export function draft(params) {
  return request({
    url: '/workorder/management/declare/service/draft',
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 获取草稿
 * @param {*} params 参数，
 */
export function getDraft(id) {
  return request({
    url: '/workorder/management/declare/get/draft/' + id,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 查询申报状态接口
 */
export function TaxBureauStatus(data) {
  return request({
    url: '/workorder/management/declare/TaxBureauStatus',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}

/**
 * 申报数量统计
 */
export const declareStatistics = (data) => {
  return request({
    url: '/workorder/management/declare/statistics',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 修改首次申报月份
 */
export const firstMonth = (data) => {
  return request({
    url: '/workorder/management/declare/first_month',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 修改服务商
 */
export const changeDeclareSupplier = (data) => {
  return request({
    url: '/workorder/management/declare/supplier',
    data,
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 批量转出
 */
export const batchTransformOut = (data) => {
  return request({
    url: '/workorder/management/declare/batch_transform_out/work_order',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
