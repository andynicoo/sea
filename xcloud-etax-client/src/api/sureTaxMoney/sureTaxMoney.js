import request from '@/utils/request'

/**
 * 确认税金
 */
export const recordConfirm = (data) => {
  return request({
    url: '/work_client/vat_declare/record_confirm',
    data,
    method: 'post'
  })
}
