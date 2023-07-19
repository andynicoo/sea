import request from '@/libs/request'

//注销税号服务列表
export const canceltaxList = (data) => {
    return request({
        url: '/etax/services/management/canceltax/list',
        data,
        method: 'post'
    })
}

//提交税号注销资料
export const submitCancelInfo = (data) => {
    return request({
        url: '/etax/management/cancelTaxWorkOrder/upload/material',
        data,
        method: 'post'
    })
}

//注销税号资料审核
export const canceltaxAudit = (data) => {
    return request({
        url: '/etax/management/cancelTaxWorkOrder/check/canceltax/material',
        data,
        method: 'post'
    })
}

//注销税号失败
export const cancelFail = (data) => {
    return request({
        url: '/etax/management/cancelTaxWorkOrder/fail/canceltax',
        data,
        method: 'post'
    })
}

//完成税号注销
export const cancelFinish = (data) => {
    return request({
        url: '/etax/management/cancelTaxWorkOrder/finish/canceltax',
        data,
        method: 'post'
    })
}