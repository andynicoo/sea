import request from '@/utils/request'

/**
 * 税务咨询列表及分类
 */
export const gettaxNumRegi = (params) => {
  return request({
    url: 'work_client/vat_tax/reg_list',
    params,
    method: 'get'
  })
}