import request from '@/utils/request'

const src = 'work_client/'
/**
 * 取申报列表
 */
export const getTariffList = (data) => {
  return request({
    url: src + 'vat_declare/declare_list',
    data,
    method: 'post'
  })
}
/**
 * 申报统计+缴纳记录
 */
export const getRecord = () => {
  return request({
    url: src + 'vat_declare/pay_count',
    method: 'post'
  })
}
/**
 * 取智能税号列表
 */
export const getAutoTaxList = () => {
  return request({
    url: src + 'vat_declare/auto_list',
    method: 'post'
  })
}
/**
   * 智能识别确认
   */
export const clickAuto = () => {
  return request({
    url: src + 'vat_declare/auto_sync',
    method: 'get'
  })
}
/**
* 取所有可选国家
*/
export const getAllCountry = () => {
  return request({
    url: 'work_oa/work/all_county',
    method: 'get'
  })
}
/**
* 取可服务国家
*/
export const getAllServerCountry = () => {
  return request({
    url: 'work_oa/work/service_county',
    method: 'get'
  })
}
/**
* 根据公司取税号信息
*/
export const getTaxInfo = (params) => {
  return request({
    url: src + 'vat_reg/info',
    params,
    method: 'get'
  })
}
/**
* 添加申报
*/
export const addTariff = (data) => {
  return request({
    url: src + 'vat_declare/add',
    data,
    method: 'post'
  })
}
/**
 * 缴纳记录列表
 */
export const getPaylist = (data) => {
  return request({
    url: src + 'vat_declare/pay_list',
    data,
    method: 'post'
  })
}
/**
 * 申报详情
 */
export const gettarInfo = (data) => {
  return request({
    url: src + 'vat_declare/detail',
    data,
    method: 'post'
  })
}
/**
 * 注册详情
 */
export const gettarInfoR = (id) => {
  return request({
    url: src + 'vat_reg/work_detail/' + id,
    method: 'get'
  })
}
/**
 * 记录详情
 */
export const getRecordInfo = (data) => {
  return request({
    // url: src + 'vat_declare/record_detail',
    url: src + 'vat_declare/find_declare_detail',
    data,
    method: 'post'
  })
}
/**
 * 核算税金
 */
export const saveTax = (data) => {
  return request({
    url: src + 'tax/tax_cal',
    data,
    method: 'post'
  })
}
