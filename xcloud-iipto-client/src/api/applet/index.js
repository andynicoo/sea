import request from '@/utils/request'

/**
 * 获取小程序登录码
 */
export const getQRcode = (params) => {
  return request({
    url: '/custuser/client/login/getQRCode',
    params,
    method: 'get'
  })
}

/**
 * 获取小程序登录状态
 */
export const getQRStatus = (params) => {
  return request({
    url: `/custuser/client/login/getQRStatus/${params.uuid}`,
    params,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
