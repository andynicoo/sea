import request from '@/libs/request'

// 获取增值服务分页数据
export const getRenewOrderList = (data) => {
  return request({
    url: '/etax/renewalOrderConfirmation/list',
    data,
    method: 'post'
  })
}
// 单行已续费
export const renewedOne = (data) => {
    return request({
      url: '/etax/renewalOrderConfirmation/renewal',
      data,
      method: 'post'
    })
  }
  // 批量已续费
export const renewedMany = (data) => {
    return request({
      url: '/etax/renewalOrderConfirmation/renewals',
      data,
      method: 'post'
    })
  }