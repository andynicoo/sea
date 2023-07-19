import request from '@/libs/request'

//录入订单确认
export const enterOrderAdoptApi = (data) => {
  return request({
    url: '/trademark/order/management/enter/order/adopt',
    data,
    method: 'post'
  })
}

//录入订单驳回
export const enterOrderRejectApi = (data) => {
  return request({
    url: '/trademark/order/management/enter/order/reject',
    data,
    method: 'post'
  })
}

//添加订单付款凭证
export const orderAddPayVoucheApi = (data) => {
  return request({
    url: '/trademark/orderPayVoucher/addPayVouche',
    data,
    method: 'post'
  })
}

//订单收款方信息列表
export const companyBodySettingListApi = () => {
  return request({
    url: '/trademark/order/companyBodySetting/list',
    method: 'get'
  })
}

//订单基础信息条件
export const orderConditionApi = () => {
  return request({
    url: '/trademark/order/management/orderCondition',
    method: 'get'
  })
}

//录入订单查询服务列表
export const queryServiceListApi = () => {
  return request({
    url: '/trademark/order/management/enter/order/queryServiceList',
    method: 'post'
  })
}

//后台录入订单
export const addOrderApi = (data) => {
  return request({
    url: '/trademark/order/management/addOrder',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

//修改订单查询详情
export const getUpdateOrderDetail = (params) => {
  return request({
    url: '/trademark/order/management/getUpdateOrderDetail',
    method: 'get',
    params
  })
}

//取消订单
export const cancelOrderApi = (data) => {
  return request({
    url: '/trademark/order/management/cancelOrder',
    method: 'post',
    data
  })
}

//修改订单备注
export const updateOrderRemarkApi = (data) => {
  return request({
    url: '/trademark/order/management/updateOrderRemark',
    method: 'post',
    data
  })
}

// //添加或修改订单付款凭证 修改或确认到账
// export const addPayVouche = (data) => {
//   return request({
//     url: '/trademark/orderPayVoucher/addPayVouche',
//     method: 'post',
//     data
//   })
// }
//付款凭证驳回
export const rejectPay = (data) => {
  return request({
    url: '/trademark/orderPayVoucher/reject',
    method: 'post',
    data
  })
}
//查看订单付款凭证详情
export const updatePayVouche = (data) => {
  return request({
    url: '/trademark/orderPayVoucher/updatePayVouche',
    method: 'post',
    data
  })
}
//修改订单付款凭证
export const getPayVoucheInfo = (data) => {
  return request({
    url: '/trademark/orderPayVoucher/getPayVoucheInfo',
    method: 'post',
    data
  })
}
