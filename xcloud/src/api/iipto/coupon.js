import request from '@/libs/request'

//获取优惠券管理列表
export const getCouponList = (data) => {
  return request({
    url: '/trademark/coupon/management/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

//优惠券统计
export const getCouponStatistics = (data) => {
  return request({
    url: '/trademark/coupon/management/statistics',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
//获取优惠券发放人
export const usersList = (data) => {
  return request({
    url: '/trademark/coupon/management/users',
    data,
    method: 'post',
  })
}

//发放优惠券
export const addCoupon = (data) => {
  return request({
    url: '/trademark/coupon/management/add',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

//优惠券作废
export const obsolete = (data) => {
  return request({
    url: '/trademark/coupon/management/obsolete',
    data,
    method: 'post'
  })
}