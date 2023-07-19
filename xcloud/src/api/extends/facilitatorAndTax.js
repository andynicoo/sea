import request from '@/libs/request'

//查询角色成员（获取税务经理列表）
export const taxManagerList = () => {
  return request({
    url: '/base/role/users/info',
    params: {
      roleCode: 'tax_commissioner'
    },
    method: 'get',
  })
}

//获取税号国家下拉数据
export const getTaxCountry = (params) => {
  return request({
    url: '/etax/workorder/management/register/list/baseinfo',
    params,
    method: 'get'
  })
}

//根据国家编码获取服务商配置信息
export const getSupplierCondition = (data) => {
  return request({
    url: '/etax/supplierConfig/manager/config/getSupplierCondition',
    data,
    method: 'post'
  })
}

//批量更新工单服务商
export const batchUpdateServicesSupplier = (data) => {
  return request({
    url: '/etax/services/management/batchUpdateServicesSupplier',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

//批量更新工单税务经理
export const batchUpdateServicesTaxManager = (data) => {
  return request({
    url: '/etax/services/management/batchUpdateServicesTaxManager',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

//服务订单认领税务经理
export const orderServiceClaimTaxManager = (data) => {
  return request({
    url: '/etax/services/management/orderServiceClaimTaxManager',
    data,
    method: 'post'
  })
}
//增值服务工单认领税务经理
export const applyServicesClaimTaxManager = (data) => {
  return request({
    url: '/etax/services/management/applyServicesClaimTaxManager',
    data,
    method: 'post'
  })
}