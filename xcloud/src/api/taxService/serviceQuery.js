import request from '@/libs/request'

//查询订单列表（客服订单查询）
export const serviceListApi = (data) => {
    return request({
        url: '/etax/order/management/service/order/list',
        data,
        method: 'post'
    })
}

//用户服务详情（客服工单查询）
export const serviceDetailInfoApi = (data) => {
    return request({
        url: '/etax/services/management/user/service/detail',
        data,
        method: 'post'
    })
}