import request from '@/libs/request'

/**
 * 合规备案列表
 */
export const getFilingList = data => {
    return request({
        url: '/workorder/management/filing/page',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 获取产品信息
 */
 export const getFilingInfo = id => {
    return request({
        url: '/workorder/management/filing/' + id,
        method: 'get'
    })
}

/**
 * 合规备案审核
 */
 export const filingApproval = data => {
    return request({
        url: '/workorder/management/filing/approval',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}


/**
 * 合规备案税务经理批量认领或更改
 */
 export const filingDisposeBatch = data => {
    return request({
        url: '/workorder/management/filing/disposeBatch',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}


/**
 * 合规备案驳回详情
 */
 export const filingRejectInfo = data => {
    return request({
        url: '/workorder/management/orderServiceReject/listRejectByWorkNo',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    })
}