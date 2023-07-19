import request from '@/libs/request'

/**
 * 获取数据概览信息
 */
export const overView = ({ beginTime, endTime}) => {
  const data = {
    beginTime: beginTime,
    endTime: endTime,
  }
  return request({
    url: 'etax/management/dataanalysis/overView',
    data,
    method: 'post'
  })
}

/**
 * 获取服务情况信息
 */
export const serviceAnalysis = ({ beginTime, endTime}) => {
  const data = {
    beginTime: beginTime,
    endTime: endTime,
  }
  return request({
    url: 'etax/management/dataanalysis/serviceAnalysis',
    data,
    method: 'post'
  })
}