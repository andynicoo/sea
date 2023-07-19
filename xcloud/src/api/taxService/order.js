import request from '@/libs/request'

//获取订单列表
export const getOrderList = (data) => {
  return request({
    url: '/etax/order/management/list',
    data,
    method: 'post'
  })
}
//获取订单详情
export const getOrderDetail = (data) => {
  return request({
    url: '/etax/order/management/detail',
    data,
    method: 'post'
  })
}
//确认到账
export const sureAccount = (data) => {
  return request({
    url: '/etax/order/management/confirm/gathering',
    data,
    method: 'post'
  })
}
//根据条件查询统计订单金额
export const statistics = (data) => {
  return request({
    url: '/etax/order/management/order/money/statistics',
    data,
    method: 'post'
  })
}

// 获取配置信息列表
export const baseinfo = (params) => {
  return request({
    url: '/etax/management/baseinfo/list/baseinfo',
    params,
    method: 'get'
  })
}

// 获取退款订单列表
export const getRefundList = (data) => {
  return request({
    url: '/etax/refund/management/list',
    data,
    method: 'post'
  })
}

// 申请退款
export const requestRefund = (data) => {
  return request({
    url: '/etax/refund/management/add',
    data,
    method: 'post'
  })
}

// 审核退款
export const audit = (data) => {
  return request({
    url: '/etax/refund/management/audit',
    data,
    method: 'post'
  })
}

// 确认退款
export const confirmRefund = (data) => {
  return request({
    url: '/etax/refund/management/confirm',
    data,
    method: 'post'
  })
}

// 获取退款订单详情
export const refundDetail = (data) => {
  return request({
    url: '/etax/refund/management/detail',
    data,
    method: 'post'
  })
}

// 获取收入明细列表
export const incomeList = (data) => {
  return request({
    url: '/etax/order/management/income/list',
    data,
    method: 'post'
  })
}
// 获取收入明细列表统计
export const incomeStatistics = (data) => {
  return request({
    url: '/etax/order/management/income/list/statistics',
    data,
    method: 'post'
  })
}
// 获取退款明细列表
export const financeList = (data) => {
  return request({
    url: '/etax/refund/management/finance/list',
    data,
    method: 'post'
  })
}
// 获取退款明细列表统计
export const financeStatistics = (data) => {
  return request({
    url: '/etax/refund/management/finance/list/statistics',
    data,
    method: 'post'
  })
}
// 批量修改（分配）跟进人
export const updatefollowuserAPI = (data) => {
  return request({
    url: '/etax/order/management/batch/updatefollowuser',
    data,
    method: 'post'
  })
}
// B端-订单批量开票
export const batchApplyInvoice = (data) => {
  return request({
    url: '/etax/management/invoiceInfo/add',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 取消开票
export const cancelApplyInvoice = (data) => {
  return request({
    url: '/etax/order/management/cancelOrderInvoiceInfo',
    data,
    method: 'post'
  })
}
// 开票订单-开票详情（根据orderId查询）
export const orderInvoiceDetail = (data) => {
  return request({
    url: '/etax/order/management/orderInvoiceDetail',
    data,
    method: 'post'
  })
}
// 开票订单-开票详情（根据发票id查询）
export const invoiceDetail = (data) => {
  return request({
    url: '/etax/management/invoiceInfo/invoiceDetail',
    data,
    method: 'post'
  })
}
// 开票订单-上传支付凭证
export const orderInvoice = (data) => {
  return request({
    url: '/etax/order/management/upload/orderInvoice',
    data,
    method: 'post'
  })
}
