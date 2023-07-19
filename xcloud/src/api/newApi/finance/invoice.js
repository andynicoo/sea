import request from '@/libs/request';

/**财务管理-发票列表
 * @param {*} params
 * @returns
 */
export function getList(params) {
  return request({
    url: '/order/management/invoice/list',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**财务管理-发票详情
 * @param {*} params
 * @returns
 */
export function getDetail(params) {
  return request({
    url: '/order/management/invoice/get',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}

/**财务管理-上传发票
 * @param {*} params
 * @returns
 */
export function upload(params) {
  return request({
    url: '/order/management/invoice/upload',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}

/**财务管理-取消发票
 * @param {*} params id
 * @returns
 */
export function cancelInvoice(params) {
  return request({
    url: '/order/management/invoice/cancel',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}

/**财务管理-统计发票
 * @param {*} params id
 * @returns
 */
export function totalInvoice(params) {
  return request({
    url: '/order/management/invoice/statistics',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
/**
 * 确认退票
 * id
 */
export function reFundInvoice(id) {
  return request({
    url: '/orderproduct/management/invoice/refund/' + id,
    method: 'PUT',
  });
}

/**
 * 修改发票
 * id
 */
export function modifyInvoice(data) {
  return request({
    url: '/order/management/invoice/editInvoice',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 补充发票信息
 * id
 */
export function fillMaterial(data) {
  return request({
    url: '/order/management/invoice/fillMaterial',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**发票管理-详情-线下付款
 * @param {*} params
 * @returns
 */
export function uploadInvoiceCertificate(params) {
  return request({
    url: '/order/management/orderPayment/uploadInvoiceCertificate',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**发票管理-详情-线下付款
 * @param {*} params
 * @returns
 */
export function payConfirm(params) {
  return request({
    url: '/order/management/orderPayment/payConfirmInvoice',
    method: 'put',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
