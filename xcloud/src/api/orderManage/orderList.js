import request from '@/libs/request'

/**
 * B端-订单列表
 */
export const orderList = (data) => {
  return request({
    url: '/orderserver/order/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 国家信息列表
 */
export const allList = (params) => {
  return request({
    url: '/common/country/allList',
    params,
    method: 'get'
  })
}
/**
 * 分类下拉框(有效的值)
 */
export const getCategoryList = (data) => {
  return request({
    url: '/product/category/selectedShowflag',
    data,
    method: 'post'
  })
}
/**
 * 根据分类ID查询商品下拉列表
 */
export const getProductList = (params) => {
  return request({
    url: '/product/product/list/category',
    params,
    method: 'get',
  })
}
/**
 * 根据商品ID查询商品属性下拉列表
 */
export const getAttrList = (params) => {
  return request({
    url: '/product/product/list/attr',
    params,
    method: 'get',
  })
}
/**
 * B端-订单统计
 */
export const statistics = (data) => {
  return request({
    url: '/orderserver/order/list/statistics',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * B端-订单详情
 */
export const orderDetail = (params) => {
  return request({
    url: '/orderserver/order/list/detail',
    params,
    method: 'get',
  })
}
/**
 * B端-订单审核
 */
export const checkOrder = (data) => {
  return request({
    url: '/orderserver/order/list/audit',
    data,
    method: 'post',
  })
}
/**
 * B端-销售跟进人
 */
export const modifySeller = (data) => {
  return request({
    url: '/orderserver/order/list/modifySeller',
    data,
    method: 'post',
  })
}
/**
 * B端-订单关闭
 */
export const closeOrder = (data) => {
  return request({
    url: '/orderserver/order/list/close',
    data,
    method: 'post',
  })
}
/**
 * B端-确认到账
 */
export const confirmReceipt = (data) => {
  return request({
    url: '/orderserver/payment/confirm',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 获取所有企业信息
 */
export const getAllCompanyList = (params) => {
  return request({
    url: '/base/company/selected',
    params,
    method: 'get'
  })
}
/**
 * 获取一级部门下拉框
 */
export const getFirstDepartment = (params) => {
  return request({
    url: '/base/department/selected/first',
    params,
    method: 'get'
  })
}
/**
 * 获取二或三级部门下拉框（调二级就穿一级部门id,调三级就传二级部门id）
 */
export const getSecondOrThirdlyDepartment = (params) => {
  return request({
    url: '/base/department/selected/second',
    params,
    method: 'get'
  })
}
/**
 * 获取三级部门下的人员信息
 */
export const getStaffDepartment = (params) => {
  return request({
    url: '/base/department/selected/second/users',
    params,
    method: 'get'
  })
}
/**
 * B端-收款账户列表
 */
export const getAccountsList = (data) => {
  return request({
    url: '/orderserver/payment/accounts',
    data,
    method: 'post',
  })
}
/**
 * B端-登记款项
 */
export const editOrAddfundsInfo = (data) => {
  return request({
    url: '/orderserver/payment/add',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 订单新增开票
 */
export const addApplyInvoice = (data) => {
  return request({
    url: '/orderserver/invoiceInfo/creatInvoiceInfo',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 订单新增退款
 */
export const creatOrderRefund = (data) => {
  return request({
    url: '/orderserver/orderRefund/creatOrderRefund',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 原因信息列表
 */
export const afterSaleList = (params) => {
  return request({
    url: '/common/commonCause/allList',
    params,
    method: 'get'
  })
}
/**
 * B端-款项异常列表
 */
export const abnormalOrderList = (data) => {
  return request({
    url: '/orderserver/payment/pay/exception/page',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * B端-订单对账列表
 */
export const orderAccountCheckList = (data) => {
  return request({
    url: '/orderserver/payment/reconc/page',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 订单申请售后退款检验查询
 */
export const orderRefundStatus = (data) => {
  return request({
    url: '/orderserver/orderRefund/orderRefundStatus',
    data,
    method: 'post'
  })
}
