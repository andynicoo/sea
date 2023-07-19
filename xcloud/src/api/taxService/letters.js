import request from '@/libs/request'

//获取信件列表
export const getLetterList = (data) => {
    return request({
        url: '/etax/management/letter/list',
        data,
        method: 'post'
    })
}
// 国家信息
export const baseInfo = (params) => {
    return request({
        url: '/etax/baseinfo/list/baseinfo',
        params,
        method: 'get'
    })
}
// 根据公司名称获取服务列表
export const compnayname = (data) => {
    return request({
        url: '/etax/services/management/services/by/compnayname',
        data,
        method: 'post'
    })
}
// 根据税号获取服务列表
export const vatNumSerch = (data) => {
    return request({
        url: '/etax/services/management/findCompanysByVatNumber',
        data,
        method: 'post'
    })
}
// 保存信件
export const add = (data) => {
    return request({
        url: '/etax/management/letter/add',
        data,
        method: 'post'
    })
}
// 保存并发送信件
export const send = (data) => {
    return request({
        url: '/etax/management/letter/add/send',
        data,
        method: 'post'
    })
}
// 根据id获取信件详情
export const detail = (data) => {
    return request({
        url: '/etax/management/letter/detail',
        data,
        method: 'post'
    })
}
// 处理信件
export const dispose = (data) => {
    return request({
        url: '/etax/management/letter/dispose',
        data,
        method: 'post'
    })
}
// 发送信件
export const sendLetter = (data) => {
    return request({
        url: '/etax/management/letter/send',
        data,
        method: 'post'
    })
}

// 站内信列表
export const stationLetterList = (data) => {
    return request({
        url: '/etax/messageInfo/management/list',
        data,
        method: 'post'
    })
}

// 发送站内信
export const stationLetterSend = (data) => {
    return request({
        url: '/etax/messageInfo/management/send',
        data,
        method: 'post'
    })
}

// 立即发送站内信
export const stationLetterAdd = (data) => {
    return request({
        url: '/etax/messageInfo/management/send/add',
        data,
        method: 'post'
    })
}

// 保存站内信
export const stationLetterSave = (data) => {
    return request({
        url: '/etax/messageInfo/management/add',
        data,
        method: 'post'
    })
}