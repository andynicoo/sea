import request from '@/libs/request'

/**
 * 年报管理列表
 */
export const getOrderYearListAPI = data => {
    return request({
        url: '/workorder/management/taxWorkOrderYear/list',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 申报年度评估记录详情
 */
 export const OrderYearDetailAPI = data => {
    return request({
        url: '/workorder/management/taxWorkOrderYear/declare/detail',
        data,
        method: 'post',
    })
}

/**
 * 年报提交(预计算)--提交操作（德国年报）
 */
 export const yearSubmitAPI = data => {
    return request({
        url: '/workorder/management/taxWorkOrderYear/year/submit',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 报税确认提交资料--提交操作（德国年报）
 */
 export const deAnnalsSureSubmitApi = data => {
    return request({
        url: '/workorder/management/taxWorkOrderYear/year/confirm',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// api / newApi / workOrder / annualReport;

/**
 * 报税确认提交资料--提交操作（德国年报）
 */
 export const taxWorkOrderYearTaxYearSms= data => {
    return request({
      url: "/workorder/management/taxWorkOrderYear/tax/year/sms",
      data,
      method: "post"
    });
}