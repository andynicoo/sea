import request from '@/libs/request'

//分页获取税金对账列表
export const taxreconciliationListApi= (data) => {
    return request({
        url: '/etax/taxreconciliation/page/list',
        data,
        method: 'post'
    })
}

//添加或修改备注
export const addRemarkApi = (data) => {
    return request({
        url: '/etax/taxreconciliation/add/remark',
        data,
        method: 'post'
    })
}

//填写或修改税金
export const addtaxesApi = (data) => {
    return request({
        url: '/etax/taxreconciliation/add/taxes',
        data,
        method: 'post'
    })
}

//添加或修改NRC码
export const addNrcApi = (data) => {
    return request({
        url: '/etax/taxreconciliation/add/nrc',
        data,
        method: 'post'
    })
}