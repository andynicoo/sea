import request from '@/utils/request'

/**
 * 根据公司名称获取用户服务列表
 */
export const getservicesByCompnayname = (data) => {
  return request({
    url: '/etax/order_services/getservices/by/compnayname',
    data,
    method: 'post'
  })
}
/**
 * 上传税号注销资料
 */
export const submitFile = (data) => {
  return request({
    url: '/etax/cancelTaxWorkOrder/submit/material',
    data,
    method: 'post'
  })
}

/**
 * 注销税号资料详情
 */
export const cancelTaxWorkOrderDetail = (data) => {
  return request({
    url: '/etax/cancelTaxWorkOrder/material/detai',
    data,
    method: 'post'
  })
}