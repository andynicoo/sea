import request from '@/utils/request'

var arr = []
for (var i = 0; i < navigator.plugins.length; i++) {
  arr.push(navigator.plugins[i].name)
}
var navigatorPlugins = encodeURI(arr.join(','))
var screenHeight = window.screen.height
var availheight = window.screen.availHeight
var screenWidth = window.screen.width
var availWidth = window.screen.availWidth
var colorDepth = window.screen.colorDepth

// 根据用户查询税号是否授权
export const isAuthorized = (data) => {
  return request({
    // url: '/etax/bureau/auth/if',
    url: '/workorder/client/bureau/auth/if',
    data,
    method: 'post',
  })
}

// 税局getway授权
export const taxBureauGetWay = (data) => {
  return request({
    url: '/etax/bureau/auth/mtd',
    data,
    method: 'post',
  })
}

// 税局getway授权回调
export const authorizeCallback = (params) => {
  return request({
    url: '/etax/bureau/callback',
    params,
    method: 'get',
  })
}

// 检索增值税义务
export const retrievalVAT = (data) => {
  return request({
    url: '/etax/bureau/auth/vatObligations',
    data,
    method: 'post',
    headers: {
      'navigatorPlugins': navigatorPlugins,
      'screenHeight': screenHeight,
      'availheight': availheight,
      'screenWidth': screenWidth,
      'availWidth': availWidth,
      'colorDepth': colorDepth
    }
  })
}

// 报税提交资料
export const taxFilingInformation = (data) => {
  return request({
    url: '/etax/bureau/auth/material',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 提交申报数据到税局复制
export const SubmitDeclarationTaxBureau = (data) => {
  return request({
    url: '/etax/bureau/auth/vatReturns',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'navigatorPlugins': navigatorPlugins,
      'screenHeight': screenHeight,
      'availheight': availheight,
      'screenWidth': screenWidth,
      'availWidth': availWidth,
      'colorDepth': colorDepth
    }
  })
}

//查询申报记录
export const searchTaxLog = (data) => {
  return request({
    url: '/etax/bureau/auth/mtdTaxRecord',
    data,
    method: 'post',
  })
}

//查看申报记录详情
export const searchTaxLogDetail = (data) => {
  return request({
    url: '/etax/bureau/auth/mtdTaxView',
    data,
    method: 'post',
    headers: {
      'navigatorPlugins': navigatorPlugins,
      'screenHeight': screenHeight,
      'availheight': availheight,
      'screenWidth': screenWidth,
      'availWidth': availWidth,
      'colorDepth': colorDepth
    }
  })
}

// 根据服务ID或者工单编号获取申报回执
export const forms = (data) => {
  return request({
    url: '/etax/user/download/receipt/forms',
    data,
    method: 'post',
  })
}

// //模糊查询公司名称
// export const mohuSearchCompany = (data) => {
//   return request({
//     url: '/etax/order_services/list/service/company',
//     data,
//     method:'post'
//   })
// }

//模糊查询公司名称
export const mohuSearchCompany = (data) => {
  return request({
    url: '/workorder/client/vat/workOrder/companyNameColl',
    data,
    method:'get'
  })
}


/**
 * 获取授权url
 */
 export function authUrl(data) {
  return request({
    url: '/pay/authorize/authUrl/' + data.channel,
    method: 'get'
  })
}

/**
 * 授权
 */
 export function auth(data) {
  return request({
    url: '/pay/authorize/accessToken',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 创建支付订单
export const createOrder = (data) => {
  return request({
    url: '/workorder/client/vat/workOrder/createOrder',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 获取账户余额
export const getCurrentBalances = (data) => {
  return request({
    url: '/workorder/client/vat/workOrder/getCurrentBalances',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}


/**
 * 查看支付进度
 */
 export function getPayProgress(data) {
  return request({
    url: '/workorder/client/vat/workOrder/progress',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function unbindCheck(data) {
  return request({
    url: '/workorder/client/vat/workOrder/unbindCheck',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}


export function changeDefault(data) {
  return request({
    url: '/pay/authorize/changeDefault',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}