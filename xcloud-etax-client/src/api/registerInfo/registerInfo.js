import request from '@/utils/request'

/**
 * 上传资料 资料提交
 */
export const getMaterialSubmit = (data) => {
  return request({
    url: '/etax/registerorder/submit/wordordermaterial',
    data,
    method: 'post'
  })
}

/**
 * 保存注册信息
 */
export const getMaterialSave = (data) => {
  return request({
    url: '/etax/registerorder/save/wordordermaterial',
    data,
    method: 'post'
  })
}
/**
 * 查询所在国家列表
 * @param {*} params 
 */
 export const getRegionList=(params)=>{
  return request({
      url:'/etax/client/confirmConfig/selected',
      params,
      method:'get'
  })
}

/**
 * 获取注册详情
 */
export const getRegTaxDetail = (params) => {
  return request({
    url: '/etax/registerorder/get/material',
    params,
    method: 'get'
  })
}

/**
 * 客户端获取当前登录用户所有购买服务公司
 */
export const getAllServiceCompanies = (data) => {
  return request({
    url: '/etax/order_services/list/service/company',
    data,
    method: 'post'
  })
}



/**
* 客户端获取用户使用过的公司资料信息
*/
export const getCompanyInformation = (data) => {
  return request({
    url: '/etax/order_services/user/company/material',
    data,
    method: 'post'
  })
}

/**
* 获取法人签名
*/
export const getCompanyLegalPersonSign = (data) => {
  return request({
    url: '/etax/derive/client/get/legalperson/sign',
    data,
    method: 'post'
  })
}

/**
* 获取签名链接
*/
export const getCompanyLegalPersonSignUrl = (data) => {
  return request({
    url: '/etax/derive/client/get/legalperson/sign/url',
    data,
    method: 'post'
  })
}

/**
* 获取提交资料后的转代理参考时效
*/
export const getTransformEfficiency = (params) => {
  return request({
    url: '/etax/baseinfo/list/baseinfo',
    params,
    method: 'get'
  })
}