import request from '@/libs/request'

/**
 * 英代欧代列表
 */
export const getAuthAgentList = data => {
    return request({
        url: '/workorder/management/authAgent/page',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 英代欧代详情
 */
 export const getAuthAgentInfo = data => {
  return request({
      url: '/workorder/management/vat/workorder/detail',
      data,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
  })
}

/**
 * 保存英代欧代资料
 */
 export const saveAuthAgent = data => {
    return request({
        url: '/workorder/management/authAgent/save',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 提交英代欧代资料
 */
 export const submitAuthAgent = data => {
    return request({
        url: '/workorder/management/authAgent/commit',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 英代欧代资料-审核通过
 */
 export const authAgentCheck = data => {
    return request({
        url: '/workorder/management/authAgent/approval/material',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 英代欧代资料-驳回
 */
 export const authAgentReject = data => {
    return request({
        url: '/workorder/management/authAgent/reject',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 上传协议/证书
 */
 export const authAgentAttachment = data => {
    return request({
        url: '/workorder/management/authAgent/attachment',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 获取欧英代信息
 */
 export const authAgentDefInformation = serviceId => {
    return request({
        url: '/workorder/management/authAgent/' + serviceId + '/defInformation',
        method: 'get',
    })
}

/**
 * 录入英代/欧代信息
 */
 export const authAgentInputInformation = data => {
    return request({
        url: '/workorder/management/authAgent/inputInformation',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 导出
 */
 export const authAgentExport = data => {
    return request({
        url: '/workorder/management/authAgent/export',
        data,
        method: 'post',
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 更改服务商
 */
 export const authAgentChange = params => {
    return request({
        url: '/workorder/management/authAgent/supplier',
        params,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 批量提醒
 */
 export const authAgentNotice = data => {
    return request({
        url: '/workorder/management/authAgent/notice',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}


/**
 * 英代欧代详情
 */
 export const getDeclareInfo = data => {
    return request({
        url: '/workorder/management/epr/declare/detail',
        data,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    })
  }
