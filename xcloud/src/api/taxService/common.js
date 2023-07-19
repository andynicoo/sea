import request from '@/libs/request'

//获取税号国家下拉数据
export const getTaxCountry = (params) => {
    return request({
        url: '/etax/workorder/management/register/list/baseinfo',
        params,
        method:'get'
    })
}