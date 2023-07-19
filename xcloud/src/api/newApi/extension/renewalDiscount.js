import request from '@/libs/request'

/** 续费优惠列表
 * @param {*} data
 * @returns
 */
export function getRenewalList(data) {
  return request({
    url: '/workorder/management/renewalOffer/pageList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/** 续费优惠详情
 * @param {*} id
 * @returns
 */
export function getRenewalInfo(id) {
  return request({
    url: '/workorder/management/renewalOffer/info/' + id,
    method: 'get',
  })
}

/** 新增/编辑续费优惠
 * @param {*} data
 * @returns
 */
export function addOrEditRenewal(data) {
  return request({
    url: '/workorder/management/renewalOffer/save',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/** 启用/禁用优惠列表
 * @param {*} data
 * @returns
 */
export function enableRenewal(data) {
  return request({
    url: '/workorder/management/renewalOffer/enable',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
