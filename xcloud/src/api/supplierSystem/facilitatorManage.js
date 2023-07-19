import request from '@/libs/request'

//服务商列表
export const facilitatorList = (data) => {
  return request({
    url: '/etax/supplierConfig/manager/config/list',
    data,
    method: 'post'
  })
}
//新增/编辑服务商信息
export const addOrUpdateSupplier = (data) => {
  return request({
    url: '/etax/supplierConfig/manager/config/addOrUpdateSupplier',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
//获取服务类型信息
export const getEtaxTypesInfo = (params) => {
  return request({
    url: '/etax/supplierConfig/manager/config/getEtaxTypesInfo',
    params,
    method: 'get'
  })
}
//根据国家编码获取服务商配置信息
export const getSupplierCondition = (params) => {
  return request({
    url: '/etax/supplierConfig/manager/config/getSupplierCondition',
    params,
    method: 'get'
  })
}
//服务商信息详情
export const getSupplierConfigDetail = (data) => {
  return request({
    url: '/etax/supplierConfig/manager/config/getSupplierConfigDetail',
    data,
    method: 'post'
  })
}
//获取操作日志信息
export const getLog = (data) => {
  return request({
    url: '/etax/log/list',
    data,
    method: 'post'
  })
}