import request from '@/utils/request'

/**
 * 申报记录基本信息
 */
export const recordDetailBase = (data) => {
  return request({
    url: '/work_client/vat_declare/record_detail_base',
    data,
    method: 'post'
  })
}
/**
 * 上传销售额
 */
export const salesFileUpload = (data) => {
  return request({
    url: 'work_client/vat_declare/sales_file_upload',
    data,
    method: 'post'
  })
}