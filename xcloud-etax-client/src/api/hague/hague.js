import request from '@/utils/request'

/**
 * 海牙认证自动获取已完成转代理的西班牙公司
 */
export const getEScompany = (data) => {
    return request({
        url: '/etax/transformProxyWorkOrder/get/proxy/companyNameList',
        data,
        method: 'post'
    })
}

/**
 * 海牙认证提交资料
 */
export const subESFeil = (data) => {
    return request({
        url: '/etax/apostille/submit/material',
        data,
        method: 'post'
    })
}

/**
 * 海牙认证获取详情资料
 */
export const getESXiangQing = (data) => {
    return request({
        url: '/etax/apostille/detail',
        data,
        method: 'post'
    })
}
