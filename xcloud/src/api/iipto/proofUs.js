import request from '@/libs/request'
/**
 * 后台-录入证据服务列表
 * @param data
 */
export const evidencelistApi = (data) => {
  return request({
    url: '/trademark/management/services/evidencelist',
    data,
    method: 'post'
  })
}

/**
 * 后台-美标使用证据套餐列表
 */
export const evidenceComboListApi = () => {
  return request({
    url: '/trademark/management/services/evidenceComboList',
    method: 'get'
  })
}

//后台-美标使用证据资料修改或提交
export const evidenceUpdateApi = (data) => {
  return request({
    url: '/trademark/management/services/evidenceUpdate',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}