import request from '@/utils/request'

/**
 * 合规业务上传/保存资料
 */
export const saveOrUploadCompliance = (data) => {
    return request({
        url: '/etax/authorisedRepresentative/submit/information',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}
/**
 * 合规业务获取详情信息
 */
 export const getComplianceDetail = (data) => {
    return request({
        url: '/etax/authorisedRepresentative/detail',
        data,
        method: 'post'
    })
}

/**
 * 合规业务上传授权文件
 */
 export const uploadShouquanCompliance = (data) => {
    return request({
        // url: '/etax/authorisedRepresentative/submit/authorizedInformation',
        url: '/workorder/client/vat/authAgent/attachment',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}
/**
 * 合规业务查看授权驳回原因
 */
 export const showAuthRefuse = (data) => {
    return request({
        url: '/etax/refuse/authRefuse',
        data,
        method: 'post'
    })
}

/**
 * 合规业务查看授权驳回原因
 */
 export const listReject = (data) => {
    return request({
        url: '/workorder/management/orderServiceReject/listReject',
        data,
        method: 'post'
    })
}

/**
 * 合规备案业务查看授权驳回原因
 */
 export const listRejectByWorkNo = (data) => {
    return request({
        url: '/workorder/management/orderServiceReject/listRejectByWorkNo',
        data,
        method: 'post'
    })
}