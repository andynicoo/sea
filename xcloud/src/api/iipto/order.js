import request from '@/libs/request'

//获取订单列表
export const getOrderList = (data) => {
  return request({
    url: '/trademark/order/management/list',
    data,
    method: 'post'
  })
}
//获取订单详情
export const getOrderDetail = (data) => {
  return request({
    url: '/trademark/order/management/detail',
    data,
    method: 'post'
  })
}
//确认到账
export const sureAccount = (data) => {
  return request({
    url: '/trademark/order/management/confirm/gathering',
    data,
    method: 'post'
  })
}
//根据条件查询统计订单金额
export const statistics = (data) => {
  return request({
    url: '/trademark/order/management/order/money/statistics',
    data,
    method: 'post'
  })
}

// 获取退款订单列表
export const getRefundList = (data) => {
  return request({
    url: '/trademark/refund/management/list',
    data,
    method: 'post'
  })
}

// 申请退款
export const requestRefund = (data) => {
  return request({
    url: '/trademark/refund/management/add',
    data,
    method: 'post'
  })
}

// 审核退款
export const audit = (data) => {
  return request({
    url: '/trademark/refund/management/audit',
    data,
    method: 'post'
  })
}

// 确认退款
export const confirmRefund = (data) => {
  return request({
    url: '/trademark/refund/management/confirm',
    data,
    method: 'post'
  })
}

// 获取退款订单详情
export const refundDetail = (data) => {
  return request({
    url: '/trademark/refund/management/detail',
    data,
    method: 'post'
  })
}

// 获取退款明细列表
export const financeList = (data) => {
  return request({
    url: '/trademark/refund/management/finance/list',
    data,
    method: 'post'
  })
}
// 获取退款明细列表统计
export const financeStatistics = (data) => {
  return request({
    url: '/trademark/refund/management/finance/list/statistics',
    data,
    method: 'post'
  })
}

// 获取收入明细列表
export const incomeList = (data) => {
  return request({
    url: '/trademark/order/management/income/list',
    data,
    method: 'post'
  })
}
// 获取收入明细列表统计
export const incomeStatistics = (data) => {
  return request({
    url: '/trademark/order/management/income/list/statistics',
    data,
    method: 'post'
  })
}

// 批量修改（分配）跟进人
export const updatefollowuserAPI = (data) => {
  return request({
    url: '/trademark/order/management/batch/updatefollowuser',
    data,
    method: 'post'
  })
}
