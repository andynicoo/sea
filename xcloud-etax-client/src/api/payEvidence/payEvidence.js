import request from '@/utils/request'

/**
 * 获取上传的文件路径
 */
export const filesDownload = (data) => {
  return request({
    url: '/work_client/vat_declare/files_download',
    data,
    method: 'post'
  })
}
/**
 * 上传支付凭证
 */
export const payUpload = (data) => {
  return request({
    url: '/work_client/vat_declare/pay_upload',
    data,
    method: 'post'
  })
}
