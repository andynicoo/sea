import request from '@/libs/request'

//新闻资讯列表
export const informationList = (data) => {
    return request({
        url: 'etax/bulletins/management/list',
        data,
        method: 'post'
    })
}

//新闻资讯发布
export const submitInformation = (data) => {
    return request({
        url: 'etax/bulletins/management/edit/bulletininfo',
        data,
        method: 'post'
    })
}

