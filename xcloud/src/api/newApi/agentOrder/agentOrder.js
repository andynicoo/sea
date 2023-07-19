import request from '@/libs/request';

/**代理订单-列表
 * @param {*} params
 * @returns
 */
export function getList(params) {
  return request({
    url: '/order/management/agencyOrder/listPage',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**代理订单
 * @param {*} params
 * @returns
 */
export function addOrEditAgentOrder(params) {
  return request({
    url: '/order/management/agencyOrder/save',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export function getAgentInfoList(id) {
  return request({
    url: '/order/management/agencyOrder/attachmentList/' + id,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**代理订单-上传代理订单资料
 * @param {*} params
 * @returns
 */
export function uploadAgentOrder(params) {
  return request({
    url: '/order/management/agencyOrder/uploadAttachment',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**代理订单-删除
 * @param {*} params
 * @returns
 */
export function removeAgentOrder(params) {
  return request({
    url: '/order/management/agencyOrder/remove/' + params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export function exportExcel(params) {
  return request({
    url: '/order/management/agencyOrder/export',
    method: 'post',
    data: params,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**代理订单-删除
 * @param {*} params
 * @returns
 */
export function removeAgentInfo(params) {
  return request({
    url: '/order/management/agencyOrder/remove/attachment/' + params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
