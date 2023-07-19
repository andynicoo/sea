import request from '@/utils/request'


/**
 * 资讯列表
 */
export const vatQuery = (data) => {
  return request({
    url: '/etax/user/vatNumber/Query',
    data,
    method: 'post'
  })
}


/**
 * 资讯列表
 */
export const eoriQuery = (data) => {
  return request({
    url: '/etax/user/eoriNumber/Query',
    data,
    method: 'post'
  })
}