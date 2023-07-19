import request from '@/libs/request'

//服务商自动分配规则管理列表
export const getTableList = (data) => {
  return request({
    url: '/etax/supplierStateConfig/manager/stateConfig/list',
    data,
    method: 'post'
  })
}
//服务商自动分配规则配置详情
export const getStateConfigDetail = (data) => {
  return request({
    url: '/etax/supplierStateConfig/manager/config/getStateConfigDetail',
    data,
    method: 'post'
  })
}
//新增和编辑服务商自动分配规则
export const addOrUpdateStateConfig = (data) => {
  return request({
    url: '/etax/supplierStateConfig/manager/stateConfig/addOrUpdateStateConfig',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
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
//获取操作日志信息
export const getLog = (data) => {
  return request({
    url: '/etax/log/list',
    data,
    method: 'post'
  })
}
