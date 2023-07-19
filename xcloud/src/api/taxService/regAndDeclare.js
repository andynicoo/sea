import request from '@/libs/request'

/**
 * 注册服务列表
 */
export const getRegProductInfo = (data) => {
    return request({
        url: '/etax/services/management/reg/list',
        data,
        method: 'post'
    })
}

/**
 * 备注列表
 */
 export const getRemarkList = (data) => {
    return request({
        url: '/etax/remark/list',
        data,
        method: 'post'
    })
}

/**
 * 查看驳回原因列表
 */
 export const getRefuseList = (data) => {
    return request({
        url: '/etax/refuse/list',
        data,
        method: 'post'
    })
}

/**
 * 添加/删除备注
 */
 export const addOrDeletRemark = (data) => {
    return request({
        url: '/etax/remark/save',
        data,
        method: 'post',
    })
}

/**
 * 注册＋申报服务列表
 */
export const getProductInfo = (data) => {
    return request({
        url: '/etax/services/management/regAndTax/list',
        data,
        method: 'post'
    })
}
/**
 * 注册异常工单列表
 */
 export const getAbnormalProductInfo = (data) => {
    return request({
        url: '/etax/exceptionRegisterWorkOrder/list',
        data,
        method: 'post'
    })
}
/**
 * 注册异常工单列表添加备注
 */
 export const subRemark = (data) => {
    return request({
        url: '/etax/exceptionRegisterWorkOrder/remark',
        data,
        method: 'post'
    })
}
/**
 * 注册异常工单列表已处理
 */
 export const chuliAbnormal = (data) => {
    return request({
        url: '/etax/exceptionRegisterWorkOrder/processed',
        data,
        method: 'post'
    })
}
/**
 * 获取注册工单详情
 */
export const getRegDetailInfo = (data) => {
    return request({
        url: '/etax/services/management/detail',
        data,
        method: 'post'
    })
}

/**
 * 保存注册资料
 */
export const saveRegInfo = (data) => {
    return request({
        url: '/etax/workorder/management/register/save/material',
        data,
        method: 'post'
    })
}

/**
 * 提交注册资料
 */
export const submitRegInfo = (data) => {
    return request({
        url: '/etax/workorder/management/register/update/material',
        data,
        method: 'post'
    })
}

/**
 * 注册资料审核
 */
export const auditInfo = (data) => {
    return request({
        url: '/etax/workorder/management/register/audit/material',
        data,
        method: 'post'
    })
}

/**
 * 录入税号信息
 */
export const logTaxInfo = (data) => {
    return request({
        url: '/etax/workorder/management/register/input/taxinfo',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

/**
 * 上传申报回执
 */
export const uploadReceipt = (data) => {
    return request({
        url: '/etax/tax/workorder/management/upload/receipt',
        data,
        method: 'post'
    })
}

/**
 * 审核缴税凭证
 */
export const auditTaxCertificate = (data) => {
    return request({
        url: '/etax/tax/workorder/management/check/taxCertificate',
        data,
        method: 'post'
    })
}

/**
 * 后台获取用户所有购买服务公司
 */
export const getLenovoSearchCompany = (data) => {
    return request({
        url: '/etax/services/management/list/service/company',
        data,
        method: 'post'
    })
}
/**
 * 后台获取用户使用过的公司资料信息
 */
export const getMaterial = (data) => {
    return request({
        url: '/etax/services/management/user/company/material',
        data,
        method: 'post'
    })
}
/**
 * 西班牙转代理海牙认证确认签收资料
 */
export const confirmReceiptES= (data) => {
    return request({
        url: '/etax/workorder/management/register/hy/confirm/receipt',
        data,
        method: 'post'
    })
}
/**
 * 录入西班牙海牙信息
 */
export const enteringHaugeInfo = (data) => {
    return request({
        url: '/etax/workorder/management/register/hy/input/info',
        data,
        method: 'post'
    })
}
/**
 * 西班牙填写寄送海牙单号
 */
export const enteringHaugeTrankingNumber = (data) => {
    return request({
        url: '/etax/workorder/management/register/hy/input/number',
        data,
        method: 'post'
    })
}
/**
 * 西班牙填写寄送税局单号
 */
export const enteringTaxTrankingNumber = (data) => {
    return request({
        url: '/etax/workorder/management/register/tax/input/number',
        data,
        method: 'post'
    })
}
/**
 * 转出申报
 */
 export const changeServiceStatusTransferredOut = (data) => {
    return request({
        url: '/etax/services/management/changeServiceStatusTransferredOut',
        data,
        method: 'post'
    })
}
/**
 * 注册+申报改变状态
 */
 export const regUpdateStatus = (data) => {
    return request({
        url: '/etax/workorder/management/register/updateStatus',
        data,
        method: 'post'
    })
}
/**
 * 转代理+申报改变状态
 */
 export const agentUpdateStatus = (data) => {
    return request({
        url: '/etax/tax/workorder/management/updateStatus',
        data,
        method: 'post'
    })
}