import request from '@/libs/request'

// 获取海牙认证服务分页数据
export const getHagueList = (data) => {
  return request({
    url: '/etax/services/management/apostille/list',
    data,
    method: 'post'
  })
}

// 提交海牙认证服务资料
export const subHagueFeil = (data) => {
    return request({
      url: '/etax/management/apostilleWorkOrder/submit/material',
      data,
      method: 'post'
    })
  }

// 审核海牙认证服务资料
export const shenheHaguefeil = (data) => {
    return request({
      url: '/etax/management/apostilleWorkOrder/check/material',
      data,
      method: 'post'
    })
  }

// 录入海牙认证文件
export const luruHaguefeil = (data) => {
    return request({
      url: '/etax/management/apostilleWorkOrder/upload/material',
      data,
      method: 'post'
    })
  }

// 录入海牙认证文件
export const getHagueDetailInfo = (data) => {
  return request({
    url: '/etax/management/apostilleWorkOrder/detail',
    data,
    method: 'post'
  })
}

// 录入海牙认证文件
export const compnayname = (data) => {
  return request({
    url: '/etax/management/apostilleWorkOrder/get/proxy/companyNameList',
    data,
    method: 'post'
  })
}

// 海牙认证确认签收资料
export const confirmReceiptES = (data) => {
  return request({
    url: '/etax/management/apostilleWorkOrder/confirm/receipt',
    data,
    method: 'post'
  })
}