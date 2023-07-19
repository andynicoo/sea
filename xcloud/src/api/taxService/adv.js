import request from '@/libs/request'

// 分页获取广告列表
export const getAdvList = (data) => {
    return request({
        url: '/etax/advertise/management/list',
        data,
        method: 'post'
    })
}

// 添加广告
export const addSaveOrUpdate = (data) => {
    return request({
        url: '/etax/advertise/management/saveOrUpdate',
        data,
        method: 'post'
    })
}

// 删除广告
export const removeAdv = (data) => {
    return request({
        url: 'etax/advertise/management/remove',
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