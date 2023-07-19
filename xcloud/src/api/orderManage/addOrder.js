import request from '@/libs/request'

/**
 * 国家信息
 */
export const getCountry = (data) => {
  return request({
    url: '/etax/baseinfo/list/getCountry',
    data,
    method: 'post'
  })
}
/**
 * 获取公司主体信息
 */
export const getCompanybody = (data) => {
  return request({
    url: '/etax/baseinfo/list/getCompanybody',
    data,
    method: 'post'
  })
}
/**
 * 付款类型
 */
export const getPaymenttype = (data) => {
  return request({
    url: '/etax/baseinfo/list/getPaymenttype',
    data,
    method: 'post'
  })
}
/**
 * 获取所有付款方式配置信息
 */
export const getPaymentaccount = (params) => {
  return request({
    url: '/etax/cmpanyBodySetting/list',
    params,
    method: 'get'
  })
}
/**
 * 根据国家获取商品列表
 */
export const listByCountryCode = (data) => {
  return request({
    url: '/etax/product/management/listByCountryCode',
    data,
    method: 'post'
  })
}
/**
 * B端-线下录单&编辑
 */
export const addOrder = (data) => {
  return request({
    url: '/etax/order/management/add',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * B端-获取录入订单明细信息
 */
export const orderDetail = (data) => {
  return request({
    url: '/etax/order/management/list/orderDetail',
    data,
    method: 'post',
  })
}
/**
 * B端订单编辑用户
 */
export const editorOrderUserId = (data) => {
  return request({
    url: '/etax/order/management/editorOrderUserId',
    data,
    method: 'post',
  })
}
/**
 * 审核订单
 */
export const checkOrder = (data) => {
  return request({
    url: '/etax/order/management/list/audit',
    data,
    method: 'post',
  })
}
/**
 * 登记/编辑款项
 */
export const addOrUpOrderPayments = (data) => {
  return request({
    url: '/etax/order/management/list/addOrUpOrderPayments',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 删除款项
 */
export const deletePayments = (data) => {
  return request({
    url: '/etax/order/management/list/delete/payments',
    data,
    method: 'post',
  })
}
/**
 * 确认到账
 */
export const gatheringOrder = (data) => {
  return request({
    url: '/etax/order/management/confirm/gatheringOrder',
    data,
    method: 'post'
  })
}
// 订单商品详情
export const getOrderProductInfo = (data) => {
  return request({
    url: '/etax/order/management/getOrderProductInfo',
    data,
    method: 'post'
  })
}
// 校验用户手机号是否注册
export const cheakOrderUserMobile = (data) => {
  return request({
    url: '/etax/order/management/cheakOrderUserMobile',
    data,
    method: 'post'
  })
}
// 获取公司主体税点
export const getCompanyBodyTax = (data) => {
  return request({
    url: '/etax/order/management/getCompanyBodyTax',
    data,
    method: 'post'
  })
}
// 后台录入订单申请退款
export const addByBackstage = (data) => {
  return request({
    url: '/etax/refund/management/addByBackstage',
    data,
    method: 'post'
  })
}
// 订单款项驳回
export const rejectPayment = (data) => {
  return request({
    url: '/etax/order/management/orderPayment/reject',
    data,
    method: 'post'
  })
}
// 订单取消
export const cancelOrder = (data) => {
  return request({
    url: '/etax/order/management/orderInfo/cancel',
    data,
    method: 'post'
  })
}
// 获取操作日志信息
export const logList = (data) => {
  return request({
    url: '/etax/log/list',
    data,
    method: 'post'
  })
}