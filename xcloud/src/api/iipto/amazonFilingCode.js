import request from '@/libs/request'

/**
 * 查询亚马逊列表
 */
export const getFilingCodeListApi = (data) => {
  return request({
    url: '/trademark/management/amazonRecordInfo/list',
    data,
    method: 'post'
  })
}

/**
 * 录入验证码
 */
export const inputFilingCodeApi = (data) => {
  return request({
    url: '/trademark/management/amazonRecordInfo/inputVerificationCode',
    data,
    method: 'post'
  })
}

/**
 * 更新验证码
 */
export const updateFilingCodeApi = (data) => {
  return request({
    url: '/trademark/management/amazonRecordInfo/update',
    data,
    method: 'post'
  })
}

/**
 * 驳回录入验证码
 */
export const rejectFilingCodeApi = (data) => {
  return request({
    url: '/trademark/management/amazonRecordInfo/rejectVerificationCode',
    data,
    method: 'post'
  })
}