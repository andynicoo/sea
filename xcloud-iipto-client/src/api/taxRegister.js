import request from '@/libs/request'

/**
 * 获取签名链接
 * @param {*} params 参数，
 *
 */
export function signCode (params) {
  return request({
    url: '/workorder/client/sign/generate',
    method: 'post',
    data: params
  })
}

/**
 * 获取法人签名回显
 * @param {*} params 参数，serviceNo
 *
 */
export function refresh (params) {
  return request({
    url: '/workorder/client/sign/refresh',
    method: 'post',
    data: params
  })
}
