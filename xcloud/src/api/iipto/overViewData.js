import request from '@/libs/request'

//实时概况(销售额)
export const salesDataApi = (data) => {
  return request({
    url: '/trademark/management/dataanalysis/real/time/overview',
    data,
    method: 'post'
  })
}

//交易分析
export const dealDataApi = (data) => {
  return request({
    url: '/trademark/management/dataanalysis/deal/analyse',
    data,
    method: 'post'
  })
}

//服务分析
export const serviceDataApi = (data) => {
  return request({
    url: '/trademark/management/dataanalysis/service/analyse',
    data,
    method: 'post'
  })
}

//用户分析
export const userDataApi = (data) => {
  return request({
    url: '/trademark/management/dataanalysis/user/analyse',
    data,
    method: 'post'
  })
}