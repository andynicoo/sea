import request from '@/libs/request'
/**
 * 商标服务列表
 */
export const serviceList = (data) => {
  return request({
    url: '/trademark/management/services/list',
    data,
    method: 'post'
  })
}

/**
 * 批量修改审核人
 */
export const UpdateApproveUserApi = (data) => {
  return request({
    url: '/trademark/management/register/trademark/batch/UpdateApproveUser',
    data,
    method: 'post'
  })
}

/**
 * 发送用户待提交资料短信提醒
 */
export const batchMessageTrs = (data) => {
  return request({
    url: '/trademark/management/services/send/submit/material/sms',
    data,
    method: 'post'
  })
}


/**
 * 脚本异常列表
 */
export const scriptErrorListApi = (params) => {
  return request({
    url: '/trademark/scriptEx/list',
    params,
    method: 'get'
  })
}



/**
 * 业务提醒
 */
export const workOrderMessageListApi = (params) => {
  return request({
    url: '/trademark/workOrderMessage/list',
    params,
    method: 'get'
  })
}
