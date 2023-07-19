import request from '@/utils/request'

const src = ''
/**
 * 取税号列表
 */
export const getTaxList = (data) => {
  return request({
    url: 'work_client/vat_reg/list',
    data,
    method: 'post'
  })
}
/**
 * 删除税号
 */
export const deleteTaxNum = (id) => {
  return request({
    url: 'work_client/vat_reg/del/' + id,
    method: 'get'
  })
}
/**
* 编辑税号
*/
export const editTaxNum = (data) => {
  return request({
    url: 'work_client/vat_reg/upd',
    data,
    method: 'post'
  })
}
/**
* 取公司
*/
export const getCompanyList = (data, type) => {
  if (type === 'post') {
    return request({
      url: 'work_client/company/company_list',
      data,
      method: type
    })
  } else {
    const params = data
    return request({
      url: 'work_client/company/company_list',
      params,
      method: type
    })
  }
}
/**
* 取国家
*/
export const getStateList = () => {
  return request({
    url: 'work_oa/work/service_county',
    method: 'get'
  })
}
/**
* 新增公司
*/
export const addCompany = (data) => {
  return request({
    url: 'work_client/company/company_add',
    data,
    method: 'post'
  })
}
/**
* 税号详情
*/
export const taxNumInfo = (id) => {
  return request({
    url: 'work_client/vat_reg/detail/' + id,
    method: 'get'
  })
}
/**
* 添加税号
*/
export const addTaxNum = (data) => {
  return request({
    url: 'work_client/vat_reg/add',
    data,
    method: 'post'
  })
}
/**
 * 取智能税号列表
 */
export const getAutoTaxList = () => {
  return request({
    url: 'work_client/vat_reg/auto_list',
    method: 'post'
  })
}
/**
 * 智能识别确认
 */
export const clickAuto = () => {
  return request({
    url: 'work_client/vat_reg/auto_sync',
    method: 'get'
  })
}
