import request from '@/libs/request';

/**退款订单列表
 * @param {*} data
 * @returns
 */
export function refundOrderList(params) {
  return request({
    url: '/order/management/orderRefund/list',
    data: params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**退款订单详情
 * @param {*} data
 * @returns
 */
export function refundOrderInfo(data) {
  return request({
    url: '/order/management/orderRefund/getOrderRefundInfo',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}

/**退款审核
 * @param {*} data
 * @returns
 */
export function refundAudit(data) {
  return request({
    url: '/orderproduct/management/orderRefund/audit',
    method: 'PUT',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**取消退款
 * @param {*} data
 * @returns
 */
export function cancelRefund(id) {
  return request({
    url: '/order/management/orderRefund/cancel/' + id,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/*确认退款
 * @param {*} data
 * @returns
 */
export function applyOrderRefund(data) {
  return request({
    url: '/order/management/orderRefund/confirm',
    method: 'PUT',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/*确认退款
 * @param {*} data
 * @returns
 */
export function reloadDingApprovalStatusApi(params) {
  return request({
    url: '/order/dingding/orderRefund/reloadDingApprovalStatus',
    params,
    method: 'PUT',
  });
}

/**获取钉钉审批流程
 * @param {*} data
 * @returns
 */
export function getDingDingApprovalDetail(data) {
  return request({
    url: '/order/dingding/orderRefund/getDingDingApprovalDetail',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}

/**退款订单列表统计
 * @param {*} data
 * @returns
 */
export function totalRefund(params) {
  return request({
    url: '/order/management/orderRefund/list/statistics',
    data: params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**退款
 * @param {*} data
 * @returns
 */
export function againRefund(data) {
  return request({
    url: '/order/management/orderRefund/againRefund',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**退款详情修改账户
 * @param {*} data
 * @returns
 */
export function editAccount(params) {
  return request({
    url: '/order/management/orderRefund/editAccount',
    data: params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
