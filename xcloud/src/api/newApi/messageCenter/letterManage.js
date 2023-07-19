import request from '@/libs/request'

/**
 * 获取信件列表
 */
 export const getStationLetterList = data => {
    return request({
        url: '/information/management/stationLetter/page',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 获取信件详情
 */
 export const getStationLetterAllInfo = id => {
    return request({
        url: '/information/management/stationLetter/item/' + id,
        method: 'get'
    })
}

/**
 * 获取信件回显详情
 */
 export const getStationLetterInfo = id => {
    return request({
        url: '/information/management/stationLetter/' + id,
        method: 'get'
    })
}

/**
 * 新增信件
 */
export const addStationLetter = data => {
    return request({
        url: '/information/management/stationLetter',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 编辑信件
 */
 export const updateStationLetter = data => {
    return request({
        url: '/information/management/stationLetter',
        data,
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 信件完结
 */
 export const dealStationLetter = id => {
    return request({
        url: '/information/management/stationLetter/' + id,
        method: 'put'
    })
}


/**
 * 根据vat税号和国家获取用户手机号
 */
 export const getUserMobileApi = (data) => {
    return request({
        url: "/workorder/management/service/getUserMobile",
        method: 'post',
        data
    })
}

/**
 * 信件模版新增
 */
 export const addLetterTemplateApi = (data) => {
    return request({
        url: "/information/management/stationLetterTemplate",
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 信件条件分页查询
 */
 export const getLetterTemplatePageApi = (data) => {
    return request({
        url: "/information/management/stationLetterTemplate/page",
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 信件模版下拉数据
 */
 export const getLetterTemplateListApi = (params) => {
    return request({
        url: "/information/management/stationLetterTemplate/pull/list",
        method: 'get',
        params
    })
}


/**
 * 信件模版下拉数据
 */
 export const delTemplateListApi = (data) => {
    return request({
        url: "/information/management/stationLetterTemplate/delete/Template",
        method: 'post',
        data
    })
}

/**
 * 信件模版有效数据数据
 */
 export const getTemplateListApi = (params) => {
    return request({
        url: "/information/management/stationLetterTemplate/list",
        method: 'get',
        params
    })
}


/**
 * 批量vat税号和国家获取用户手机号
 */
 export const getOrderServicesByVatTaxNumbersApi = (data) => {
    return request({
        url: "/workorder/management/service/getOrderServicesByVatTaxNumbers",
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}