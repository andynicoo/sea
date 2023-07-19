import request from '@/libs/request'

//获取用户推广列表
export const getUserPromoteList = (data) => {
    return request({
        url: '/etax/market/management/user/list',
        data,
        method: 'post'
    })
}
//用户推广-查看操作
export const getLogs = (data) => {
    return request({
        url: '/etax/market/management/user/invite/logs',
        data,
        method: 'post'
    })
}
//获取优惠券管理列表
export const getCouponList = (data) => {
    return request({
        url: '/etax/coupon/management/list',
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
        url: '/etax/coupon/management/statistics',
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
        url: '/etax/coupon/management/users',
        data,
        method: 'post',
    })
}

//发放优惠券
export const addCoupon = (data) => {
    return request({
        url: '/etax/coupon/management/add',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}
//付费用户数列表
export const payUserList = (data) => {
    return request({
        url: '/etax/market/management/user/pay/list',
        data,
        method: 'post'
    })
}

//优惠券作废
export const obsolete = (data) => {
    return request({
        url: '/etax/coupon/management/obsolete',
        data,
        method: 'post'
    })
}