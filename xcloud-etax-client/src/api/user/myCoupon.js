import request from '@/utils/request'
const src = 'orderserver/'

/**
 * 获取优惠券列表
 */
export const getCouponList = (obj) => {
  const data = obj
  return request({
    url: src + 'coupon/vatclient/page',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 获取所有可用优惠券
 */
export const getUseCoupon = (obj) => {
  const data = obj
  return request({
    url: src + 'coupon/vatclient/list',
    data,
    method: 'post',
    // headers: {
    //   'Content-Type': 'application/json;charset=UTF-8'
    // }
  })
}