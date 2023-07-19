import request from '@/libs/request';

/**
 * 账单列表
 * @param {*} data
 * @returns
 */
export function getChannelBillLists(data) {
  return request({
    url: '/order/management/channelBill/lists',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 账单列表
 * @param {*} data
 * @returns
 */
export function getBillDetailById(params) {
  return request({
    url: '/order/management/channelBill/getBillDetailById',
    method: 'get',
    params,
  });
}
