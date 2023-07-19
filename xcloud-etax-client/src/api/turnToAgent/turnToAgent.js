import request from '@/utils/request'

/**
 * 保存转代理资料
 * @param {*} data 
 */
export const saveAgentForm=(data)=>{
    return request({
        url:'/etax/transformProxyWorkOrder/add/proxy/workorder',
        data,
        method:'post'
    })
}

/**
 * 提交转代理资料
 * @param {*} data 
 */
export const submitAgentForm=(data)=>{
    return request({
        url:'/etax/transformProxyWorkOrder/submit/proxy/workorder',
        data,
        method:'post'
    })
}

/**
 * 获取转代理资料
 * @param {*} servicesId 
 */
export const getAgentForm=(data)=>{
    return request({
        url:'/etax/transformProxyWorkOrder/get/servicesId',
        data,
        method:'post'
    })
}