import request from '@/utils/request'

/**
 * 资讯列表
 */
export const getList = (data) => {
    return request({
        url: 'etax/bulletins/client/list',
        data,
        method: 'post'
    })
}

/**
 * 资讯详情
 * bulletinId
 */
export const infoDetail = (data) => {
    return request({
        url: 'etax/bulletins/client/detail',
        data,
        method: 'post'
    })
}