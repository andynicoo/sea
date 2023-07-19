import request from '@/libs/request'

// 分页获取广告列表
export const getCategoryList = (data) => {
    return request({
        url: '/etax/optionService/management/category/list',
        data,
        method: 'post'
    })
}

// 添加类目
export const addSaveOrUpdate = (data) => {
    return request({
        url: '/etax/optionService/management/category/saveOrUpdate',
        data,
        method: 'post'
    })
}

// 添加服务商数据
export const addService = (data) => {
    return request({
        url: '/etax/optionService/management/service/saveOrUpdate',
        data,
        method: 'post'
    })
}

// 服务商列表
export const serviceList = (data) => {
    return request({
        url: '/etax/optionService/management/service/list',
        data,
        method: 'post'
    })
}

// 删除优选服务商
export const removeService = (data) => {
    return request({
        url: '/etax/optionService/management/service/remove',
        data,
        method: 'post'
    })
}

// 删除广告
export const advDetail = (data) => {
    return request({
        url: '/etax/advertise/management/detail',
        data,
        method: 'post'
    })
}